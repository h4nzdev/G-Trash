-- ============================================
-- G-TRASH Admin Panel Backend Database Schema
-- ============================================

-- Reference table for Cebu City barangays
CREATE TABLE IF NOT EXISTS barangays (
  id TEXT PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  city TEXT NOT NULL DEFAULT 'Cebu City',
  center_lat REAL NOT NULL,
  center_lng REAL NOT NULL,
  coverage_radius_m INTEGER NOT NULL DEFAULT 1000,
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Core user authentication and profile table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  employee_id TEXT UNIQUE,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'resident', -- resident, official, admin, collector, driver, supervisor
  barangay_id TEXT,
  household_members INTEGER NOT NULL DEFAULT 1,
  notifications_enabled INTEGER NOT NULL DEFAULT 1,
  collection_reminders INTEGER NOT NULL DEFAULT 1,
  is_active INTEGER NOT NULL DEFAULT 1,
  status TEXT DEFAULT 'offline', -- online, offline
  last_login_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (barangay_id) REFERENCES barangays(id)
);

-- Community reports feed
CREATE TABLE IF NOT EXISTS reports (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  type TEXT NOT NULL, -- overflowing, bad_smell, missed, illegal, other
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  latitude REAL,
  longitude REAL,
  upvotes INTEGER NOT NULL DEFAULT 0,
  downvotes INTEGER NOT NULL DEFAULT 0,
  priority_score INTEGER NOT NULL DEFAULT 0,
  is_verified INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, investigating, resolved
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Stores uploaded images for reports
CREATE TABLE IF NOT EXISTS report_images (
  id TEXT PRIMARY KEY,
  report_id TEXT NOT NULL,
  image_url TEXT NOT NULL,
  thumbnail_url TEXT,
  file_size_kb INTEGER,
  mime_type TEXT NOT NULL DEFAULT 'image/jpeg',
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (report_id) REFERENCES reports(id) ON DELETE CASCADE
);

-- Garbage collection schedule calendar
CREATE TABLE IF NOT EXISTS collection_schedules (
  id TEXT PRIMARY KEY,
  barangay_id TEXT NOT NULL,
  date TEXT NOT NULL, -- YYYY-MM-DD
  day_label TEXT NOT NULL, -- Monday, Tuesday, etc.
  route_description TEXT NOT NULL,
  time_start TEXT NOT NULL, -- HH:MM:SS
  time_end TEXT NOT NULL, -- HH:MM:SS
  truck_number TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'upcoming', -- active, upcoming, completed, cancelled
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (barangay_id) REFERENCES barangays(id)
);

-- Defined truck collection routes
CREATE TABLE IF NOT EXISTS truck_routes (
  id TEXT PRIMARY KEY,
  route_key TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  barangay_id TEXT NOT NULL,
  color_hex TEXT NOT NULL DEFAULT '#22C55E',
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  description TEXT NOT NULL,
  center_lat REAL NOT NULL,
  center_lng REAL NOT NULL,
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (barangay_id) REFERENCES barangays(id)
);

-- Named stops along routes
CREATE TABLE IF NOT EXISTS truck_stops (
  id TEXT PRIMARY KEY,
  route_id TEXT NOT NULL,
  sequence INTEGER NOT NULL,
  name TEXT NOT NULL,
  time TEXT NOT NULL,
  latitude REAL NOT NULL,
  longitude REAL NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (route_id) REFERENCES truck_routes(id) ON DELETE CASCADE
);

-- Real-time truck GPS positions
CREATE TABLE IF NOT EXISTS truck_locations (
  id TEXT PRIMARY KEY,
  user_id TEXT, -- collector/driver
  route_id TEXT NOT NULL,
  truck_number TEXT NOT NULL,
  latitude REAL NOT NULL,
  longitude REAL NOT NULL,
  position_index INTEGER DEFAULT 0,
  progress_percentage REAL DEFAULT 0.00,
  speed_kmh REAL,
  heading_degrees INTEGER,
  last_updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (route_id) REFERENCES truck_routes(id)
);

-- Air quality/pollution heatmap zones
CREATE TABLE IF NOT EXISTS pollution_zones (
  id TEXT PRIMARY KEY,
  location_name TEXT NOT NULL,
  center_lat REAL NOT NULL,
  center_lng REAL NOT NULL,
  radius_meters INTEGER NOT NULL,
  level TEXT NOT NULL DEFAULT 'safe', -- safe, moderate, high, very_high, hazardous
  aqi_value INTEGER NOT NULL,
  sensor_id TEXT,
  is_active INTEGER NOT NULL DEFAULT 1,
  measured_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- IoT Sensors table
CREATE TABLE IF NOT EXISTS iot_sensors (
  id TEXT PRIMARY KEY,
  sensor_key TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL, -- MQ-135, DHT11, etc.
  location_name TEXT NOT NULL,
  barangay_id TEXT,
  latitude REAL NOT NULL,
  longitude REAL NOT NULL,
  status TEXT DEFAULT 'active', -- active, inactive, maintenance
  last_reading_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (barangay_id) REFERENCES barangays(id)
);

-- Sensor readings (time-series)
CREATE TABLE IF NOT EXISTS sensor_readings (
  id TEXT PRIMARY KEY,
  sensor_id TEXT NOT NULL,
  aqi INTEGER,
  ammonia_ppm REAL,
  methane_ppm REAL,
  co2_ppm REAL,
  humidity REAL,
  temperature REAL,
  recorded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sensor_id) REFERENCES iot_sensors(id) ON DELETE CASCADE
);

-- System Bug Reports (Internal)
CREATE TABLE IF NOT EXISTS system_bugs (
  id TEXT PRIMARY KEY,
  reported_by TEXT NOT NULL, -- User ID
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  severity TEXT NOT NULL, -- low, medium, high, critical
  module TEXT, -- App, Admin, Officials, Backend
  status TEXT DEFAULT 'open', -- open, in_progress, resolved, closed
  resolution_notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (reported_by) REFERENCES users(id)
);

-- System Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  action TEXT NOT NULL, -- LOGIN, DELETE_USER, UPDATE_ROUTE, etc.
  entity_type TEXT, -- users, truck_routes, etc.
  entity_id TEXT,
  details TEXT, -- JSON string of changes
  ip_address TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Admin System Settings
CREATE TABLE IF NOT EXISTS system_settings (
  id TEXT PRIMARY KEY,
  setting_key TEXT UNIQUE NOT NULL,
  setting_value TEXT NOT NULL,
  description TEXT,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_system_bugs_status ON system_bugs(status);
CREATE INDEX IF NOT EXISTS idx_sensor_readings_sensor ON sensor_readings(sensor_id);
CREATE INDEX IF NOT EXISTS idx_sensor_readings_time ON sensor_readings(recorded_at);
