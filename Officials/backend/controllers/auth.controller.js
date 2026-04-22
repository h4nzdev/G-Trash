// Auth controller for Officials - uses Resident database schema

import db from '../database/db.js';
import bcrypt from 'bcryptjs';
import { formatResponse, formatError } from '../utils/response.utils.js';
import { generateToken, generateRefreshToken, verifyToken } from '../utils/jwt.utils.js';

const SALT_ROUNDS = 10;

// POST /api/auth/register
export function register(req, res) {
  try {
    const { email, password, full_name, phone, role, barangay_id } = req.body;

    if (!email || !password || !full_name) {
      return res.status(400).json(formatError('Missing required fields'));
    }

    const existingByEmail = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existingByEmail) {
      return res.status(409).json(formatError('Email already registered'));
    }

    const hashedPassword = bcrypt.hashSync(password, SALT_ROUNDS);
    const id = `usr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    db.prepare(`
      INSERT INTO users (id, email, password_hash, full_name, phone, role, barangay_id)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(id, email, hashedPassword, full_name, phone || null, role || 'official', barangay_id || null);

    const user = db.prepare('SELECT id, email, full_name, phone, role, barangay_id, created_at FROM users WHERE id = ?').get(id);

    const accessToken = generateToken({ id: user.id, email: user.email, role: user.role });
    const refreshToken = generateRefreshToken({ id: user.id });

    res.status(201).json(formatResponse({ accessToken, refreshToken, user }, 'Registration successful'));
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json(formatError('Failed to register user'));
  }
}

// POST /api/auth/login
export function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json(formatError('Email and password are required'));
    }

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);

    if (!user) {
      return res.status(401).json(formatError('Invalid credentials'));
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json(formatError('Invalid credentials'));
    }

    // Update last login
    db.prepare("UPDATE users SET last_login_at = datetime('now') WHERE id = ?").run(user.id);

    // Remove password from response
    const { password_hash, ...userWithoutPassword } = user;

    const accessToken = generateToken({ id: user.id, email: user.email, role: user.role });
    const refreshToken = generateRefreshToken({ id: user.id });

    res.json(formatResponse({ accessToken, refreshToken, user: userWithoutPassword }, 'Login successful'));
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json(formatError('Failed to login'));
  }
}

// GET /api/auth/me
export function getCurrentUser(req, res) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json(formatError('Authorization token required'));
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json(formatError('Invalid or expired token'));
    }

    const user = db.prepare(`
      SELECT id, email, full_name, phone, role, barangay_id, 
             notifications_enabled, collection_reminders, created_at, last_login_at 
      FROM users WHERE id = ?
    `).get(decoded.id);

    if (!user) {
      return res.status(404).json(formatError('User not found'));
    }

    res.json(formatResponse({ user }, 'Current user retrieved successfully'));
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json(formatError('Failed to get current user'));
  }
}

// PUT /api/auth/profile
export function updateProfile(req, res) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json(formatError('Authorization token required'));
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json(formatError('Invalid or expired token'));
    }

    const { full_name, phone, barangay_id, notifications_enabled, collection_reminders } = req.body;

    const updates = [];
    const params = [];

    if (full_name !== undefined) { updates.push('full_name = ?'); params.push(full_name); }
    if (phone !== undefined) { updates.push('phone = ?'); params.push(phone); }
    if (barangay_id !== undefined) { updates.push('barangay_id = ?'); params.push(barangay_id); }
    if (notifications_enabled !== undefined) { updates.push('notifications_enabled = ?'); params.push(notifications_enabled ? 1 : 0); }
    if (collection_reminders !== undefined) { updates.push('collection_reminders = ?'); params.push(collection_reminders ? 1 : 0); }

    if (updates.length === 0) {
      return res.status(400).json(formatError('No fields to update'));
    }

    updates.push("updated_at = datetime('now')");
    params.push(decoded.id);
    
    db.prepare(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`).run(...params);

    const user = db.prepare(`
      SELECT id, email, full_name, phone, role, barangay_id, 
             notifications_enabled, collection_reminders 
      FROM users WHERE id = ?
    `).get(decoded.id);

    res.json(formatResponse({ user }, 'Profile updated successfully'));
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json(formatError('Failed to update profile'));
  }
}

// PUT /api/auth/password
export function changePassword(req, res) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json(formatError('Authorization token required'));
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json(formatError('Invalid or expired token'));
    }

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json(formatError('currentPassword and newPassword are required'));
    }

    const user = db.prepare('SELECT password_hash FROM users WHERE id = ?').get(decoded.id);
    if (!user) {
      return res.status(404).json(formatError('User not found'));
    }

    const isCurrentPasswordValid = bcrypt.compareSync(currentPassword, user.password_hash);
    if (!isCurrentPasswordValid) {
      return res.status(401).json(formatError('Current password is incorrect'));
    }

    const hashedNewPassword = bcrypt.hashSync(newPassword, SALT_ROUNDS);
    db.prepare("UPDATE users SET password_hash = ?, updated_at = datetime('now') WHERE id = ?")
      .run(hashedNewPassword, decoded.id);

    res.json(formatResponse(null, 'Password changed successfully'));
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json(formatError('Failed to change password'));
  }
}

// POST /api/auth/logout
export function logout(req, res) {
  try {
    res.json(formatResponse(null, 'Logout successful'));
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json(formatError('Failed to logout'));
  }
}
