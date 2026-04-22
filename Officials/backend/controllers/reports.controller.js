// Reports controller for Officials

import db from '../database/db.js';
import { formatResponse, formatError } from '../utils/response.utils.js';

// GET /api/reports
export function getReports(req, res) {
  try {
    const { status, type, filter, sortBy = 'priority', limit = 50, page = 1 } = req.query;
    
    let query = `
      SELECT r.*, u.full_name as user_name 
      FROM reports r 
      LEFT JOIN users u ON r.user_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (status) {
      query += ' AND r.status = ?';
      params.push(status);
    }
    if (type) {
      query += ' AND r.type = ?';
      params.push(type);
    }
    if (filter === 'high') {
      query += ' AND r.priority_score > 20';
    } else if (filter === 'unresolved') {
      query += " AND r.status != 'resolved'";
    }

    const orderBy = sortBy === 'priority' ? 'r.priority_score DESC' : 'r.created_at DESC';
    query += ` ORDER BY ${orderBy} LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), (parseInt(page) - 1) * parseInt(limit));

    const reports = db.prepare(query).all(...params);
    const total = db.prepare('SELECT COUNT(*) as count FROM reports').get().count;

    res.json(formatResponse({
      reports,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    }));
  } catch (error) {
    console.error('Get reports error:', error);
    res.status(500).json(formatError('Failed to fetch reports'));
  }
}

// GET /api/reports/:id
export function getReport(req, res) {
  try {
    const { id } = req.params;
    const report = db.prepare(`
      SELECT r.*, u.full_name as user_name 
      FROM reports r 
      LEFT JOIN users u ON r.user_id = u.id 
      WHERE r.id = ?
    `).get(id);

    if (!report) {
      return res.status(404).json(formatError('Report not found'));
    }

    res.json(formatResponse(report));
  } catch (error) {
    console.error('Get report error:', error);
    res.status(500).json(formatError('Failed to fetch report'));
  }
}

// PUT /api/reports/:id/status
export function updateReportStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json(formatError('Status is required'));
    }

    db.prepare("UPDATE reports SET status = ?, updated_at = datetime('now') WHERE id = ?")
      .run(status, id);

    const report = db.prepare('SELECT * FROM reports WHERE id = ?').get(id);
    res.json(formatResponse(report, 'Report status updated'));
  } catch (error) {
    console.error('Update report status error:', error);
    res.status(500).json(formatError('Failed to update report status'));
  }
}

// POST /api/reports/:id/verify
export function verifyReport(req, res) {
  try {
    const { id } = req.params;
    db.prepare("UPDATE reports SET is_verified = 1, updated_at = datetime('now') WHERE id = ?")
      .run(id);

    const report = db.prepare('SELECT * FROM reports WHERE id = ?').get(id);
    res.json(formatResponse(report, 'Report verified'));
  } catch (error) {
    console.error('Verify report error:', error);
    res.status(500).json(formatError('Failed to verify report'));
  }
}

// GET /api/reports/stats/summary
export function getReportStats(req, res) {
  try {
    const stats = db.prepare(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN status = 'investigating' THEN 1 ELSE 0 END) as investigating,
        SUM(CASE WHEN status = 'resolved' THEN 1 ELSE 0 END) as resolved,
        AVG(priority_score) as avg_priority
      FROM reports
    `).get();

    res.json(formatResponse(stats));
  } catch (error) {
    console.error('Get report stats error:', error);
    res.status(500).json(formatError('Failed to fetch report stats'));
  }
}
