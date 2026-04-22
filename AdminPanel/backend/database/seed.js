import db from './db.js';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

export function seedDatabase() {
  try {
    const tableCheck = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='users'").get();
    if (!tableCheck) {
      console.warn('⚠️  Database schema not initialized. Please run Resident backend first.');
      return;
    }
  } catch (error) {
    console.warn('⚠️  Database access error:', error.message);
    return;
  }

  // Check if admin already exists
  const adminCount = db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'admin'").get();
  if (adminCount.count > 0) {
    console.log(`✓ Admin data already exists`);
  } else {
    console.log('Seeding Admin user...');
    const hashedPassword = bcrypt.hashSync('admin123', 10);
    db.prepare(`
      INSERT OR IGNORE INTO users (id, email, password_hash, full_name, phone, role, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(uuidv4(), 'admin@gtrash.com', hashedPassword, 'System Administrator', '09999999999', 'admin', 1);
    console.log('✓ Admin user seeded (admin@gtrash.com / admin123)');
  }

  // Seed IoT Sensors if they don't exist
  const sensorCount = db.prepare("SELECT COUNT(*) as count FROM sqlite_master WHERE type='table' AND name='iot_sensors'").get();
  if (sensorCount.count > 0) {
    const sensorsExist = db.prepare("SELECT COUNT(*) as count FROM iot_sensors").get();
    if (sensorsExist.count === 0) {
      console.log('Seeding IoT sensors...');
      const sensors = [
        { id: uuidv4(), key: 'SN-LAHUG-01', type: 'MQ-135', loc: 'Lahug Market', lat: 10.3300, lng: 123.8930 },
        { id: uuidv4(), key: 'SN-APAS-01', type: 'MQ-135', loc: 'Apas Plaza', lat: 10.3350, lng: 123.8720 },
        { id: uuidv4(), key: 'SN-SM-01', type: 'MQ-135', loc: 'SM City Terminal', lat: 10.3218, lng: 123.8920 }
      ];
      
      const insert = db.prepare(`
        INSERT INTO iot_sensors (id, sensor_key, type, location_name, latitude, longitude, status)
        VALUES (?, ?, ?, ?, ?, ?, 'active')
      `);
      
      sensors.forEach(s => insert.run(s.id, s.key, s.type, s.loc, s.lat, s.lng));
      console.log('✓ IoT sensors seeded');
    }
  }

  // Seed System Settings
  const settingsCount = db.prepare("SELECT COUNT(*) as count FROM system_settings").get();
  if (settingsCount.count === 0) {
    console.log('Seeding system settings...');
    const settings = [
      { key: 'maintenance_mode', val: 'false', desc: 'Global maintenance mode' },
      { key: 'report_auto_verify', val: 'true', desc: 'Auto-verify reports with high upvotes' },
      { key: 'system_version', val: '1.0.0', desc: 'Current G-TRASH system version' }
    ];
    
    const insert = db.prepare(`INSERT INTO system_settings (id, setting_key, setting_value, description) VALUES (?, ?, ?, ?)`);
    settings.forEach(s => insert.run(uuidv4(), s.key, s.val, s.desc));
    console.log('✓ System settings seeded');
  }
}
