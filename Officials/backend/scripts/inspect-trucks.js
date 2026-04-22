#!/usr/bin/env node
import db from '../database/db.js';

function run() {
  try {
    const rows = db.prepare(`
      SELECT tl.id, tl.user_id, tl.route_id, tl.truck_number, tl.latitude, tl.longitude,
             tl.last_updated_at, tr.name as route_name, u.status as user_status, u.full_name as user_name
      FROM truck_locations tl
      LEFT JOIN truck_routes tr ON tl.route_id = tr.id
      LEFT JOIN users u ON tl.user_id = u.id
      ORDER BY tl.last_updated_at DESC
      LIMIT 50
    `).all();

    console.log(JSON.stringify(rows, null, 2));
  } catch (err) {
    console.error('Failed to inspect truck locations:', err.message);
    process.exit(1);
  }
}

run();
