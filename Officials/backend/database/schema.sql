-- ============================================
-- G-TRASH Officials Backend Database Schema
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

-- Tracks individual user votes on reports
CREATE TABLE IF NOT EXISTS report_votes (
  id TEXT PRIMARY KEY,
  report_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  vote_type TEXT NOT NULL, -- up, down
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(report_id, user_id),
  FOREIGN KEY (report_id) REFERENCES reports(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Moderation flags for inappropriate reports
CREATE TABLE IF NOT EXISTS report_flags (
  id TEXT PRIMARY KEY,
  report_id TEXT NOT NULL,
  flagged_by_user_id TEXT NOT NULL,
  reason TEXT NOT NULL,
  is_resolved INTEGER NOT NULL DEFAULT 0,
  resolved_by_id TEXT,
  resolved_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(report_id, flagged_by_user_id),
  FOREIGN KEY (report_id) REFERENCES reports(id) ON DELETE CASCADE,
  FOREIGN KEY (flagged_by_user_id) REFERENCES users(id),
  FOREIGN KEY (resolved_by_id) REFERENCES users(id)
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

-- Route boundary polygon coordinates
CREATE TABLE IF NOT EXISTS truck_route_boundaries (
  id TEXT PRIMARY KEY,
  route_id TEXT NOT NULL,
  sequence INTEGER NOT NULL,
  latitude REAL NOT NULL,
  longitude REAL NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (route_id) REFERENCES truck_routes(id) ON DELETE CASCADE
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

-- Historical pollution measurements
CREATE TABLE IF NOT EXISTS pollution_zone_history (
  id TEXT PRIMARY KEY,
  zone_id TEXT NOT NULL,
  aqi_value INTEGER NOT NULL,
  level TEXT NOT NULL,
  measured_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (zone_id) REFERENCES pollution_zones(id) ON DELETE CASCADE
);

-- Waste segregation categories
CREATE TABLE IF NOT EXISTS waste_guides (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  icon_name TEXT NOT NULL,
  color_hex TEXT NOT NULL DEFAULT '#2E7D32',
  bg_color_hex TEXT NOT NULL DEFAULT '#E8F5E9',
  description TEXT NOT NULL,
  disposal_method TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Common items in each waste category
CREATE TABLE IF NOT EXISTS waste_guide_items (
  id TEXT PRIMARY KEY,
  guide_id TEXT NOT NULL,
  item_name TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (guide_id) REFERENCES waste_guides(id) ON DELETE CASCADE
);

-- Disposal tips for each waste category
CREATE TABLE IF NOT EXISTS waste_guide_tips (
  id TEXT PRIMARY KEY,
  guide_id TEXT NOT NULL,
  tip_text TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (guide_id) REFERENCES waste_guides(id) ON DELETE CASCADE
);

-- General waste management tips
CREATE TABLE IF NOT EXISTS waste_tips (
  id TEXT PRIMARY KEY,
  icon_name TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- AI waste scanner classification history
CREATE TABLE IF NOT EXISTS ai_scan_history (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  image_url TEXT NOT NULL,
  result_guide_id TEXT NOT NULL,
  confidence_score REAL,
  scanned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (result_guide_id) REFERENCES waste_guides(id)
);

-- User preferences and configuration
CREATE TABLE IF NOT EXISTS user_settings (
  id TEXT PRIMARY KEY,
  user_id TEXT UNIQUE NOT NULL,
  notifications_enabled INTEGER NOT NULL DEFAULT 1,
  collection_reminders INTEGER NOT NULL DEFAULT 1,
  map_show_heatmap INTEGER NOT NULL DEFAULT 1,
  map_show_truck INTEGER NOT NULL DEFAULT 1,
  map_show_user_location INTEGER NOT NULL DEFAULT 1,
  map_default_route TEXT,
  theme TEXT NOT NULL DEFAULT 'light',
  language TEXT NOT NULL DEFAULT 'en',
  distance_unit TEXT NOT NULL DEFAULT 'metric',
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Gamification points system
CREATE TABLE IF NOT EXISTS user_points (
  id TEXT PRIMARY KEY,
  user_id TEXT UNIQUE NOT NULL,
  points INTEGER NOT NULL DEFAULT 0,
  lifetime_points INTEGER NOT NULL DEFAULT 0,
  points_expires_at DATETIME,
  last_earned_at DATETIME,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Detailed points transaction log
CREATE TABLE IF NOT EXISTS user_points_history (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  points_change INTEGER NOT NULL,
  reason TEXT NOT NULL,
  reference_type TEXT,
  reference_id TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Push notification history
CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info', -- info, warning, alert, success
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data TEXT, -- JSON string
  is_read INTEGER NOT NULL DEFAULT 0,
  read_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Cloud backup data
CREATE TABLE IF NOT EXISTS user_backups (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  backup_data TEXT NOT NULL, -- JSON string
  backup_size_kb INTEGER NOT NULL DEFAULT 0,
  backup_version TEXT NOT NULL DEFAULT '1.0.0',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_employee_id ON users(employee_id);
CREATE INDEX IF NOT EXISTS idx_reports_user_id ON reports(user_id);
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_priority ON reports(priority_score);
CREATE INDEX IF NOT EXISTS idx_collection_schedules_date ON collection_schedules(date);
CREATE INDEX IF NOT EXISTS idx_truck_routes_key ON truck_routes(route_key);
CREATE INDEX IF NOT EXISTS idx_truck_locations_updated ON truck_locations(last_updated_at);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON notifications(user_id, is_read);
