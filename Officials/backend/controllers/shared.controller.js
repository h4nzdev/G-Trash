// Schedules, Trucks, Notifications controllers for Officials

import db from '../database/db.js';
import { formatResponse, formatError } from '../utils/response.utils.js';

// ============================================
// SCHEDULES CONTROLLER
// ============================================

export function getSchedules(req, res) {
  try {
    const { date, status } = req.query;
    
    let query = 'SELECT * FROM collection_schedules WHERE 1=1';
    const params = [];

    if (date) {
      query += ' AND date = ?';
      params.push(date);
    }
    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    query += ' ORDER BY date ASC, time_start ASC';
    const schedules = db.prepare(query).all(...params);

    res.json(formatResponse(schedules));
  } catch (error) {
    console.error('Get schedules error:', error);
    res.status(500).json(formatError('Failed to fetch schedules'));
  }
}

export function updateSchedule(req, res) {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    db.prepare("UPDATE collection_schedules SET status = ?, notes = ?, updated_at = datetime('now') WHERE id = ?")
      .run(status, notes || null, id);

    const schedule = db.prepare('SELECT * FROM collection_schedules WHERE id = ?').get(id);
    res.json(formatResponse(schedule, 'Schedule updated'));
  } catch (error) {
    console.error('Update schedule error:', error);
    res.status(500).json(formatError('Failed to update schedule'));
  }
}

// ============================================
// TRUCKS CONTROLLER
// ============================================

export function getTruckLocations(req, res) {
  try {
    const locations = db.prepare(`
            SELECT tl.id, tl.user_id, tl.route_id, tl.truck_number, tl.latitude, tl.longitude,
             tl.position_index, tl.progress_percentage,
             tl.speed_kmh as speed, tl.heading_degrees as heading,
             tl.last_updated_at, tl.created_at,
             tr.name as route_name, tr.color_hex,
              u.status as user_status, u.full_name as user_name, u.phone as user_phone
      FROM truck_locations tl
      JOIN truck_routes tr ON tl.route_id = tr.id
      LEFT JOIN users u ON tl.user_id = u.id
      ORDER BY tl.last_updated_at DESC
    `).all();

    res.json(formatResponse(locations));
  } catch (error) {
    console.error('Get truck locations error:', error);
    res.status(500).json(formatError('Failed to fetch truck locations'));
  }
}

export function getTruckRoutes(req, res) {
  try {
    const routes = db.prepare(`
      SELECT tr.*, 
        (SELECT COUNT(*) FROM truck_stops WHERE route_id = tr.id) as stops_count
      FROM truck_routes tr
      WHERE tr.is_active = 1
      ORDER BY tr.name
    `).all();

    // Parse JSON boundary coords and stops
    const routesWithDetails = routes.map(route => {
      const stops = db.prepare(`
        SELECT name, time, latitude, longitude 
        FROM truck_stops 
        WHERE route_id = ? 
        ORDER BY sequence
      `).all(route.id);

      return { ...route, stops };
    });

    res.json(formatResponse(routesWithDetails));
  } catch (error) {
    console.error('Get truck routes error:', error);
    res.status(500).json(formatError('Failed to fetch truck routes'));
  }
}

// ============================================
// NOTIFICATIONS CONTROLLER
// ============================================

export function getNotifications(req, res) {
  try {
    const { is_read, limit = 50 } = req.query;
    
    let query = 'SELECT * FROM notifications WHERE 1=1';
    const params = [];

    if (is_read !== undefined) {
      query += ' AND is_read = ?';
      params.push(is_read === 'true' ? 1 : 0);
    }

    query += ' ORDER BY created_at DESC LIMIT ?';
    params.push(parseInt(limit));

    const notifications = db.prepare(query).all(...params);

    res.json(formatResponse(notifications));
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json(formatError('Failed to fetch notifications'));
  }
}

export function markAsRead(req, res) {
  try {
    const { id } = req.params;
    
    db.prepare("UPDATE notifications SET is_read = 1, read_at = datetime('now') WHERE id = ?")
      .run(id);

    res.json(formatResponse(null, 'Notification marked as read'));
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json(formatError('Failed to mark notification as read'));
  }
}

export function getUnreadCount(req, res) {
  try {
    const count = db.prepare('SELECT COUNT(*) as unreadCount FROM notifications WHERE is_read = 0').get();
    res.json(formatResponse(count));
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json(formatError('Failed to get unread count'));
  }
}
