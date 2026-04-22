// Analytics controller for Officials

import db from '../database/db.js';
import { formatResponse, formatError } from '../utils/response.utils.js';

// GET /api/analytics/dashboard
export function getDashboardStats(req, res) {
  try {
    // Total reports
    const reportStats = db.prepare(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'resolved' THEN 1 ELSE 0 END) as resolved,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending
      FROM reports
    `).get();

    // Total active trucks
    const truckStats = db.prepare(`
      SELECT COUNT(DISTINCT route_id) as active_trucks
      FROM truck_locations
      WHERE last_updated_at > datetime('now', '-1 hour')
    `).get();

    // Pollution zones count
    const pollutionStats = db.prepare(`
      SELECT 
        COUNT(*) as total_zones,
        SUM(CASE WHEN level = 'high' THEN 1 ELSE 0 END) as high_urgency
      FROM pollution_zones
      WHERE is_active = 1
    `).get();

    // Collection schedules today
    const today = new Date().toISOString().split('T')[0];
    const scheduleStats = db.prepare(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed
      FROM collection_schedules
      WHERE date = ?
    `).get(today);

    res.json(formatResponse({
      reports: reportStats,
      trucks: truckStats,
      pollution: pollutionStats,
      schedules: scheduleStats,
    }));
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json(formatError('Failed to fetch dashboard stats'));
  }
}

// GET /api/analytics/reports/trend
export function getReportsTrend(req, res) {
  try {
    const { months = 6 } = req.query;
    
    const trend = db.prepare(`
      SELECT 
        strftime('%Y-%m', created_at) as month,
        COUNT(*) as total,
        SUM(CASE WHEN status = 'resolved' THEN 1 ELSE 0 END) as resolved,
        AVG(priority_score) as avg_priority
      FROM reports
      WHERE created_at >= date('now', ?)
      GROUP BY month
      ORDER BY month ASC
    `).all(`-${months} months`);

    res.json(formatResponse(trend));
  } catch (error) {
    console.error('Get reports trend error:', error);
    res.status(500).json(formatError('Failed to fetch reports trend'));
  }
}

// GET /api/analytics/collection/efficiency
export function getCollectionEfficiency(req, res) {
  try {
    const efficiency = db.prepare(`
      SELECT 
        COUNT(*) as total_schedules,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
        ROUND(
          CAST(SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) AS FLOAT) / 
          COUNT(*) * 100, 
          2
        ) as completion_rate
      FROM collection_schedules
      WHERE date >= date('now', '-30 days')
    `).get();

    res.json(formatResponse(efficiency));
  } catch (error) {
    console.error('Get collection efficiency error:', error);
    res.status(500).json(formatError('Failed to fetch collection efficiency'));
  }
}

// GET /api/analytics/urgency/distribution
export function getUrgencyDistribution(req, res) {
  try {
    const distribution = db.prepare(`
      SELECT 
        CASE 
          WHEN priority_score > 50 THEN 'Critical'
          WHEN priority_score > 20 THEN 'High'
          WHEN priority_score > 0 THEN 'Medium'
          ELSE 'Low'
        END as urgency_level,
        COUNT(*) as count
      FROM reports
      GROUP BY urgency_level
      ORDER BY 
        CASE 
          WHEN priority_score > 50 THEN 1
          WHEN priority_score > 20 THEN 2
          WHEN priority_score > 0 THEN 3
          ELSE 4
        END
    `).all();

    res.json(formatResponse(distribution));
  } catch (error) {
    console.error('Get urgency distribution error:', error);
    res.status(500).json(formatError('Failed to fetch urgency distribution'));
  }
}
