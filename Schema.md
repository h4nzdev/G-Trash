# G-TRASH Resident Application - Complete Database Schema

## Overview

This document defines the complete relational database schema for the G-TRASH Resident Application. The schema is designed to replace the current AsyncStorage-based local storage with a production-ready backend database (PostgreSQL recommended, but compatible with MySQL/SQLite).

**Database Design Principles:**
- Normalized to 3NF (Third Normal Form)
- Proper foreign key relationships with cascading rules
- Audit trails with `created_at` and `updated_at` timestamps
- Soft deletes where appropriate
- Indexes on frequently queried columns
- Constraints to ensure data integrity

---

## Table of Contents

1. [Authentication & Users](#1-users)
2. [Location & Geography](#2-barangays)
3. [Community Reports](#3-reports)
4. [Collection Schedules](#4-collection-schedules)
5. [Truck Routes & Tracking](#5-truck-routes)
6. [Pollution Zones & Heatmap](#6-pollution-zones)
7. [Waste Education](#7-waste-guides)
8. [User Settings & Preferences](#8-user-settings)
9. [Gamification & Rewards](#9-user-points)
10. [Notifications](#10-notifications)
11. [Data Backup & Sync](#11-user-backups)
12. [Entity Relationship Diagram](#entity-relationship-diagram)
13. [Migration Guide from AsyncStorage](#migration-guide-from-asyncstorage)

---

## 1. USERS

### 1.1 `users`

Core user authentication and profile table. Replaces `@gtrash:user`, `@gtrash:password`, and `@gtrash:allUsers` AsyncStorage keys.

| Column | Type | Constraints | Default | Description |
|--------|------|-------------|---------|-------------|
| `id` | UUID | PRIMARY KEY | `gen_random_uuid()` | Unique user identifier |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL | - | User's email address |
| `password_hash` | VARCHAR(255) | NOT NULL | - | Bcrypt hashed password (NEVER plaintext) |
| `full_name` | VARCHAR(255) | NOT NULL | - | User's full name (min 2 words) |
| `phone` | VARCHAR(20) | NULL | NULL | 11-digit phone number (e.g., "09123456789") |
| `barangay_id` | UUID | NULL, FK → barangays.id | NULL | User's residential barangay |
| `household_members` | INTEGER | NOT NULL | 1 | Number of household members (min 1) |
| `notifications_enabled` | BOOLEAN | NOT NULL | TRUE | Truck arrival alerts toggle |
| `collection_reminders` | BOOLEAN | NOT NULL | TRUE | Collection day reminders toggle |
| `is_active` | BOOLEAN | NOT NULL | TRUE | Account status (soft delete flag) |
| `last_login_at` | TIMESTAMPTZ | NULL | NULL | Last successful login timestamp |
| `created_at` | TIMESTAMPTZ | NOT NULL | `NOW()` | Account creation timestamp |
| `updated_at` | TIMESTAMPTZ | NOT NULL | `NOW()` | Last profile update timestamp |

**Indexes:**
- `idx_users_email` ON `users(email)`
- `idx_users_barangay` ON `users(barangay_id)`
- `idx_users_is_active` ON `users(is_active)`

**Constraints:**
- `CHECK (household_members >= 1)`
- `CHECK (full_name ~ ' ')` -- Ensures at least 2 words (PostgreSQL)

**Security Notes:**
- Use bcrypt or argon2 for password hashing (cost factor 12+)
- NEVER store plaintext passwords
- Implement JWT tokens for session management instead of storing session passwords
- Add rate limiting on login attempts

---

## 2. BARANGAYS

### 2.1 `barangays`

Reference table for Cebu City barangays. Replaces the hardcoded `BARANGAYS` array in `app/(tabs)/profile.tsx` and `app/auth/register.tsx`.

| Column | Type | Constraints | Default | Description |
|--------|------|-------------|---------|-------------|
| `id` | UUID | PRIMARY KEY | `gen_random_uuid()` | Unique barangay identifier |
| `name` | VARCHAR(100) | UNIQUE, NOT NULL | - | Barangay name (e.g., "Lahug", "Apas") |
| `city` | VARCHAR(100) | NOT NULL | 'Cebu City' | City name |
| `center_lat` | DECIMAL(10, 8) | NOT NULL | - | Center latitude coordinate |
| `center_lng` | DECIMAL(11, 8) | NOT NULL | - | Center longitude coordinate |
| `coverage_radius_m` | INTEGER | NOT NULL | 1000 | Default coverage radius in meters |
| `is_active` | BOOLEAN | NOT NULL | TRUE | Active status |
| `created_at` | TIMESTAMPTZ | NOT NULL | `NOW()` | Creation timestamp |
| `updated_at` | TIMESTAMPTZ | NOT NULL | `NOW()` | Last update timestamp |

**Indexes:**
- `idx_barangays_name` ON `barangays(name)`
- `idx_barangays_city` ON `barangays(city)`

**Initial Data (from current app):**

```sql
INSERT INTO barangays (id, name, city, center_lat, center_lng) VALUES
  (gen_random_uuid(), 'Ayala', 'Cebu City', 10.3157, 123.8854),
  (gen_random_uuid(), 'SM City', 'Cebu City', 10.3200, 123.8900),
  (gen_random_uuid(), 'Lahug', 'Cebu City', 10.3250, 123.8950),
  (gen_random_uuid(), 'Capitol', 'Cebu City', 10.3180, 123.8970),
  (gen_random_uuid(), 'Kamputhaw', 'Cebu City', 10.3190, 123.8980),
  (gen_random_uuid(), 'Apas', 'Cebu City', 10.3350, 123.8720),
  (gen_random_uuid(), 'Kasambagan', 'Cebu City', 10.3390, 123.8795),
  (gen_random_uuid(), 'Budlaan', 'Cebu City', 10.3400, 123.8820),
  (gen_random_uuid(), 'Bulacao', 'Cebu City', 10.3380, 123.8840),
  (gen_random_uuid(), 'Guba', 'Cebu City', 10.3370, 123.8860),
  (gen_random_uuid(), 'Banilad', 'Cebu City', 10.3328, 123.9070),
  (gen_random_uuid(), 'Talamban', 'Cebu City', 10.3400, 123.9050),
  (gen_random_uuid(), 'Busay', 'Cebu City', 10.3350, 123.8750),
  (gen_random_uuid(), 'Lugma', 'Cebu City', 10.3360, 123.8800),
  (gen_random_uuid(), 'Pasil', 'Cebu City', 10.3430, 123.8895),
  (gen_random_uuid(), 'Sambag', 'Cebu City', 10.3300, 123.8880);
```

---

## 3. REPORTS

### 3.1 `reports`

Community reports feed. Replaces `@gtrash:reports` AsyncStorage key and the `ReportPost` interface in `app/(tabs)/reports.tsx`.

| Column | Type | Constraints | Default | Description |
|--------|------|-------------|---------|-------------|
| `id` | UUID | PRIMARY KEY | `gen_random_uuid()` | Unique report identifier |
| `user_id` | UUID | NOT NULL, FK → users.id | - | Report author |
| `type` | ENUM | NOT NULL | - | Report type (see enum below) |
| `description` | TEXT | NOT NULL | - | Detailed description (min 10 chars) |
| `location` | VARCHAR(255) | NOT NULL | - | Location/landmark description |
| `latitude` | DECIMAL(10, 8) | NULL | NULL | Optional GPS coordinate |
| `longitude` | DECIMAL(11, 8) | NULL | NULL | Optional GPS coordinate |
| `upvotes` | INTEGER | NOT NULL | 0 | Total upvote count |
| `downvotes` | INTEGER | NOT NULL | 0 | Total downvote count |
| `priority_score` | INTEGER | NOT NULL | 0 | Computed: upvotes - downvotes |
| `is_verified` | BOOLEAN | NOT NULL | FALSE | Moderator verification flag |
| `status` | ENUM | NOT NULL | 'pending' | Report status (see enum below) |
| `created_at` | TIMESTAMPTZ | NOT NULL | `NOW()` | Report creation timestamp |
| `updated_at` | TIMESTAMPTZ | NOT NULL | `NOW()` | Last update timestamp |

**Enums:**

```sql
CREATE TYPE report_type AS ENUM (
  'overflowing',    -- Overflowing Trash
  'bad_smell',      -- Bad Smell
  'missed',         -- Missed Collection
  'illegal',        -- Illegal Dumping
  'other'           -- Other
);

CREATE TYPE report_status AS ENUM (
  'pending',
  'investigating',
  'resolved'
);
```

**Indexes:**
- `idx_reports_user_id` ON `reports(user_id)`
- `idx_reports_type` ON `reports(type)`
- `idx_reports_status` ON `reports(status)`
- `idx_reports_priority` ON `reports(priority_score DESC)`
- `idx_reports_created_at` ON `reports(created_at DESC)`
- `idx_reports_location` ON `reports(location)`

**Constraints:**
- `CHECK (LENGTH(description) >= 10)`
- `CHECK (upvotes >= 0)`
- `CHECK (downvotes >= 0)`
- `CHECK (priority_score = upvotes - downvotes)`

**Triggers:**
```sql
-- Auto-update priority_score on vote changes
CREATE OR REPLACE FUNCTION update_report_priority()
RETURNS TRIGGER AS $$
BEGIN
  NEW.priority_score := NEW.upvotes - NEW.downvotes;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_report_priority
  BEFORE INSERT OR UPDATE ON reports
  FOR EACH ROW
  EXECUTE FUNCTION update_report_priority();
```

### 3.2 `report_images`

Stores uploaded images for reports. Replaces `images?: string[]` in `ReportPost` interface.

| Column | Type | Constraints | Default | Description |
|--------|------|-------------|---------|-------------|
| `id` | UUID | PRIMARY KEY | `gen_random_uuid()` | Unique image identifier |
| `report_id` | UUID | NOT NULL, FK → reports.id ON DELETE CASCADE | - | Parent report |
| `image_url` | VARCHAR(500) | NOT NULL | - | Cloud storage URL (e.g., S3, Cloudinary) |
| `thumbnail_url` | VARCHAR(500) | NULL | NULL | Thumbnail version URL |
| `file_size_kb` | INTEGER | NULL | NULL | Image file size |
| `mime_type` | VARCHAR(50) | NOT NULL | 'image/jpeg' | Image MIME type |
| `order_index` | INTEGER | NOT NULL | 0 | Display order in gallery |
| `created_at` | TIMESTAMPTZ | NOT NULL | `NOW()` | Upload timestamp |

**Indexes:**
- `idx_report_images_report_id` ON `report_images(report_id)`
- `idx_report_images_order` ON `report_images(report_id, order_index)`

**Constraints:**
- `CHECK (file_size_kb IS NULL OR file_size_kb > 0)`
- `CHECK (order_index >= 0)`

### 3.3 `report_votes`

Tracks individual user votes on reports. Replaces `userVote?: "up" | "down" | null` in `ReportPost`.

| Column | Type | Constraints | Default | Description |
|--------|------|-------------|---------|-------------|
| `id` | UUID | PRIMARY KEY | `gen_random_uuid()` | Vote record identifier |
| `report_id` | UUID | NOT NULL, FK → reports.id ON DELETE CASCADE | - | Voted report |
| `user_id` | UUID | NOT NULL, FK → users.id ON DELETE CASCADE | - | Voting user |
| `vote_type` | ENUM | NOT NULL | - | Vote direction |
| `created_at` | TIMESTAMPTZ | NOT NULL | `NOW()` | Vote timestamp |

**Enums:**

```sql
CREATE TYPE vote_type AS ENUM ('up', 'down');
```

**Indexes:**
- `idx_report_votes_report_id` ON `report_votes(report_id)`
- `idx_report_votes_user_id` ON `report_votes(user_id)`
- **UNIQUE INDEX:** `idx_report_votes_unique` ON `report_votes(report_id, user_id)`

**Constraints:**
- `UNIQUE (report_id, user_id)` -- One vote per user per report

**Triggers:**
```sql
-- Update report vote counts when votes table changes
CREATE OR REPLACE FUNCTION update_report_votes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.vote_type = 'up' THEN
      UPDATE reports SET upvotes = upvotes + 1 WHERE id = NEW.report_id;
    ELSE
      UPDATE reports SET downvotes = downvotes + 1 WHERE id = NEW.report_id;
    END IF;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.vote_type = 'up' AND NEW.vote_type = 'down' THEN
      UPDATE reports SET upvotes = upvotes - 1, downvotes = downvotes + 1 WHERE id = NEW.report_id;
    ELSIF OLD.vote_type = 'down' AND NEW.vote_type = 'up' THEN
      UPDATE reports SET upvotes = upvotes + 1, downvotes = downvotes - 1 WHERE id = NEW.report_id;
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.vote_type = 'up' THEN
      UPDATE reports SET upvotes = upvotes - 1 WHERE id = OLD.report_id;
    ELSE
      UPDATE reports SET downvotes = downvotes - 1 WHERE id = OLD.report_id;
    END IF;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_report_votes
  AFTER INSERT OR UPDATE OR DELETE ON report_votes
  FOR EACH ROW
  EXECUTE FUNCTION update_report_votes_count();
```

### 3.4 `report_flags`

Moderation flags for inappropriate reports. Replaces the flag modal in `app/(tabs)/reports.tsx`.

| Column | Type | Constraints | Default | Description |
|--------|------|-------------|---------|-------------|
| `id` | UUID | PRIMARY KEY | `gen_random_uuid()` | Flag record identifier |
| `report_id` | UUID | NOT NULL, FK → reports.id ON DELETE CASCADE | - | Flagged report |
| `flagged_by_user_id` | UUID | NOT NULL, FK → users.id | - | User who flagged |
| `reason` | TEXT | NOT NULL | - | Flag reason |
| `is_resolved` | BOOLEAN | NOT NULL | FALSE | Moderation status |
| `resolved_by_id` | UUID | NULL, FK → users.id | NULL | Moderator who resolved |
| `resolved_at` | TIMESTAMPTZ | NULL | NULL | Resolution timestamp |
| `created_at` | TIMESTAMPTZ | NOT NULL | `NOW()` | Flag creation timestamp |

**Indexes:**
- `idx_report_flags_report_id` ON `report_flags(report_id)`
- `idx_report_flags_user_id` ON `report_flags(flagged_by_user_id)`
- `idx_report_flags_resolved` ON `report_flags(is_resolved)`
- `idx_report_flags_created_at` ON `report_flags(created_at DESC)`

**Constraints:**
- `UNIQUE (report_id, flagged_by_user_id)` -- One flag per user per report
- `CHECK (LENGTH(reason) > 0)`

---

## 4. COLLECTION SCHEDULES

### 4.1 `collection_schedules`

Garbage collection schedule calendar. Replaces `@gtrash:schedule` AsyncStorage key and `COLLECTION_DAYS` array in `app/(tabs)/calendar.tsx`.

| Column | Type | Constraints | Default | Description |
|--------|------|-------------|---------|-------------|
| `id` | UUID | PRIMARY KEY | `gen_random_uuid()` | Schedule identifier |
| `barangay_id` | UUID | NOT NULL, FK → barangays.id | - | Target barangay |
| `date` | DATE | NOT NULL | - | Collection date |
| `day_label` | VARCHAR(50) | NOT NULL | - | Display: "Today", "Monday", etc. |
| `route_description` | TEXT | NOT NULL | - | Route: "Ayala → SM → Lahug" |
| `time_start` | TIME | NOT NULL | - | Start time (e.g., "08:00:00") |
| `time_end` | TIME | NOT NULL | - | End time (e.g., "12:00:00") |
| `truck_number` | VARCHAR(50) | NOT NULL | - | Truck identifier (e.g., "GT-101") |
| `status` | ENUM | NOT NULL | 'upcoming' | Schedule status |
| `notes` | TEXT | NULL | NULL | Additional notes |
| `created_at` | TIMESTAMPTZ | NOT NULL | `NOW()` | Creation timestamp |
| `updated_at` | TIMESTAMPTZ | NOT NULL | `NOW()` | Last update timestamp |

**Enums:**

```sql
CREATE TYPE schedule_status AS ENUM (
  'active',
  'upcoming',
  'completed',
  'cancelled'
);
```

**Indexes:**
- `idx_collection_schedules_date` ON `collection_schedules(date)`
- `idx_collection_schedules_barangay` ON `collection_schedules(barangay_id)`
- `idx_collection_schedules_truck` ON `collection_schedules(truck_number)`
- `idx_collection_schedules_status` ON `collection_schedules(status)`
- `idx_collection_schedules_date_range` ON `collection_schedules(date, status)`

**Constraints:**
- `CHECK (time_end > time_start)`

---

## 5. TRUCK ROUTES

### 5.1 `truck_routes`

Defined truck collection routes. Replaces hardcoded `TRUCK_ROUTES` object in `app/(tabs)/index.tsx`.

| Column | Type | Constraints | Default | Description |
|--------|------|-------------|---------|-------------|
| `id` | UUID | PRIMARY KEY | `gen_random_uuid()` | Route identifier |
| `route_key` | VARCHAR(50) | UNIQUE, NOT NULL | - | Machine key (e.g., "lahug") |
| `name` | VARCHAR(100) | NOT NULL | - | Display name (e.g., "Brgy. Lahug Route") |
| `barangay_id` | UUID | NOT NULL, FK → barangays.id | - | Primary barangay |
| `color_hex` | VARCHAR(7) | NOT NULL | '#22C55E' | Route color on map |
| `start_time` | TIME | NOT NULL | - | Route start time |
| `end_time` | TIME | NOT NULL | - | Route end time |
| `description` | TEXT | NOT NULL | - | Route summary description |
| `center_lat` | DECIMAL(10, 8) | NOT NULL | - | Map center latitude |
| `center_lng` | DECIMAL(11, 8) | NOT NULL | - | Map center longitude |
| `is_active` | BOOLEAN | NOT NULL | TRUE | Route active status |
| `created_at` | TIMESTAMPTZ | NOT NULL | `NOW()` | Creation timestamp |
| `updated_at` | TIMESTAMPTZ | NOT NULL | `NOW()` | Last update timestamp |

**Indexes:**
- `idx_truck_routes_key` ON `truck_routes(route_key)`
- `idx_truck_routes_barangay` ON `truck_routes(barangay_id)`
- `idx_truck_routes_active` ON `truck_routes(is_active)`

**Initial Data (from current app):**

```sql
INSERT INTO truck_routes (route_key, name, barangay_id, color_hex, start_time, end_time, description, center_lat, center_lng) VALUES
  ('lahug', 'Brgy. Lahug Route', (SELECT id FROM barangays WHERE name = 'Lahug'), '#22C55E', '07:00:00', '11:00:00', 'Ayala Center → SM City → IT Park → Lahug', 10.3240, 123.8960),
  ('apas', 'Brgy. Apas Route', (SELECT id FROM barangays WHERE name = 'Apas'), '#F59E0B', '06:00:00', '10:00:00', 'Apas Market → Kasambagan → Pasil → Tisa', 10.3385, 123.8860),
  ('guadalupe', 'Brgy. Guadalupe Route', (SELECT id FROM barangays WHERE name = 'Guadalupe'), '#3B82F6', '08:00:00', '12:00:00', 'Guadalupe → Mabolo → Paknaan → Mandaue', 10.3030, 123.8960);
```

### 5.2 `truck_route_boundaries`

Route boundary polygon coordinates. Replaces `boundaryCoords: RoutePoint[]` in `TruckRoute`.

| Column | Type | Constraints | Default | Description |
|--------|------|-------------|---------|-------------|
| `id` | UUID | PRIMARY KEY | `gen_random_uuid()` | Coordinate identifier |
| `route_id` | UUID | NOT NULL, FK → truck_routes.id ON DELETE CASCADE | - | Parent route |
| `sequence` | INTEGER | NOT NULL | - | Coordinate order in polygon |
| `latitude` | DECIMAL(10, 8) | NOT NULL | - | GPS latitude |
| `longitude` | DECIMAL(11, 8) | NOT NULL | - | GPS longitude |
| `created_at` | TIMESTAMPTZ | NOT NULL | `NOW()` | Creation timestamp |

**Indexes:**
- `idx_truck_route_boundaries_route` ON `truck_route_boundaries(route_id)`
- `idx_truck_route_boundaries_sequence` ON `truck_route_boundaries(route_id, sequence)`

**Constraints:**
- `CHECK (sequence >= 0)`

### 5.3 `truck_stops`

Named stops along routes. Replaces `stops: (RoutePoint & { name: string; time: string })[]` in `TruckRoute`.

| Column | Type | Constraints | Default | Description |
|--------|------|-------------|---------|-------------|
| `id` | UUID | PRIMARY KEY | `gen_random_uuid()` | Stop identifier |
| `route_id` | UUID | NOT NULL, FK → truck_routes.id ON DELETE CASCADE | - | Parent route |
| `sequence` | INTEGER | NOT NULL | - | Stop order |
| `name` | VARCHAR(100) | NOT NULL | - | Stop name (e.g., "Ayala Center") |
| `time` | TIME | NOT NULL | - | Expected arrival time |
| `latitude` | DECIMAL(10, 8) | NOT NULL | - | GPS latitude |
| `longitude` | DECIMAL(11, 8) | NOT NULL | - | GPS longitude |
| `created_at` | TIMESTAMPTZ | NOT NULL | `NOW()` | Creation timestamp |

**Indexes:**
- `idx_truck_stops_route` ON `truck_stops(route_id)`
- `idx_truck_stops_sequence` ON `truck_stops(route_id, sequence)`

**Constraints:**
- `CHECK (sequence >= 0)`

**Initial Data (from current app):**

```sql
-- Lahug Route Stops
INSERT INTO truck_stops (route_id, sequence, name, time, latitude, longitude) VALUES
  ((SELECT id FROM truck_routes WHERE route_key = 'lahug'), 0, 'Ayala Center', '07:00:00', 10.3157, 123.8854),
  ((SELECT id FROM truck_routes WHERE route_key = 'lahug'), 1, 'SM City Cebu', '07:45:00', 10.3218, 123.8920),
  ((SELECT id FROM truck_routes WHERE route_key = 'lahug'), 2, 'IT Park', '08:30:00', 10.3278, 123.9010),
  ((SELECT id FROM truck_routes WHERE route_key = 'lahug'), 3, 'Banilad', '09:15:00', 10.3328, 123.9070),
  ((SELECT id FROM truck_routes WHERE route_key = 'lahug'), 4, 'Lahug Proper', '10:00:00', 10.3300, 123.8930);
```

### 5.4 `truck_locations`

Real-time truck GPS positions. Replaces `@gtrash:truck_location` AsyncStorage key and `TruckData` interface in `app/(tabs)/index.tsx`.

| Column | Type | Constraints | Default | Description |
|--------|------|-------------|---------|-------------|
| `id` | UUID | PRIMARY KEY | `gen_random_uuid()` | Location record identifier |
| `route_id` | UUID | NOT NULL, FK → truck_routes.id | - | Current route |
| `truck_number` | VARCHAR(50) | NOT NULL | - | Truck identifier |
| `latitude` | DECIMAL(10, 8) | NOT NULL | - | Current GPS latitude |
| `longitude` | DECIMAL(11, 8) | NOT NULL | - | Current GPS longitude |
| `position_index` | INTEGER | NULL | 0 | Position index on route |
| `progress_percentage` | DECIMAL(5, 2) | NULL | 0.00 | Progress 0-100 |
| `speed_kmh` | DECIMAL(5, 2) | NULL | NULL | Current speed |
| `heading_degrees` | INTEGER | NULL | NULL | Compass heading (0-359) |
| `last_updated_at` | TIMESTAMPTZ | NOT NULL | `NOW()` | Last GPS ping timestamp |
| `created_at` | TIMESTAMPTZ | NOT NULL | `NOW()` | Record creation timestamp |

**Indexes:**
- `idx_truck_locations_route` ON `truck_locations(route_id)`
- `idx_truck_locations_truck` ON `truck_locations(truck_number)`
- `idx_truck_locations_updated` ON `truck_locations(last_updated_at DESC)`
- **Spatial Index (PostGIS):** `idx_truck_locations_coords` ON `truck_locations USING GIST (ST_Point(longitude, latitude))`

**Constraints:**
- `CHECK (progress_percentage BETWEEN 0 AND 100)`
- `CHECK (position_index >= 0)`

---

## 6. POLLUTION ZONES

### 6.1 `pollution_zones`

Air quality/pollution heatmap zones. Replaces `@gtrash:heatmap_data` AsyncStorage key and `POLLUTION_ZONES` array in `app/(tabs)/index.tsx`.

| Column | Type | Constraints | Default | Description |
|--------|------|-------------|---------|-------------|
| `id` | UUID | PRIMARY KEY | `gen_random_uuid()` | Zone identifier |
| `location_name` | VARCHAR(100) | NOT NULL | - | Display name (e.g., "Ayala Center") |
| `center_lat` | DECIMAL(10, 8) | NOT NULL | - | Center GPS latitude |
| `center_lng` | DECIMAL(11, 8) | NOT NULL | - | Center GPS longitude |
| `radius_meters` | INTEGER | NOT NULL | - | Circle radius in meters |
| `level` | ENUM | NOT NULL | 'safe' | Pollution level |
| `aqi_value` | INTEGER | NOT NULL | - | Air Quality Index (0-500) |
| `sensor_id` | VARCHAR(100) | NULL | NULL | IoT sensor identifier (future) |
| `is_active` | BOOLEAN | NOT NULL | TRUE | Zone visibility |
| `measured_at` | TIMESTAMPTZ | NOT NULL | `NOW()` | Last measurement timestamp |
| `created_at` | TIMESTAMPTZ | NOT NULL | `NOW()` | Creation timestamp |
| `updated_at` | TIMESTAMPTZ | NOT NULL | `NOW()` | Last update timestamp |

**Enums:**

```sql
CREATE TYPE pollution_level AS ENUM (
  'safe',      -- AQI 0-50, Green (#43A047)
  'moderate',  -- AQI 51-100, Amber (#FFB300)
  'high',      -- AQI 101-150, Red (#E53935)
  'very_high', -- AQI 151-200 (future)
  'hazardous'  -- AQI 201+ (future)
);
```

**Indexes:**
- `idx_pollution_zones_location` ON `pollution_zones(location_name)`
- `idx_pollution_zones_level` ON `pollution_zones(level)`
- `idx_pollution_zones_active` ON `pollution_zones(is_active)`
- `idx_pollution_zones_measured_at` ON `pollution_zones(measured_at DESC)`
- **Spatial Index (PostGIS):** `idx_pollution_zones_coords` ON `pollution_zones USING GIST (ST_Point(center_lng, center_lat))`

**Constraints:**
- `CHECK (aqi_value >= 0 AND aqi_value <= 500)`
- `CHECK (radius_meters > 0)`

**Initial Data (from current app):**

```sql
INSERT INTO pollution_zones (location_name, center_lat, center_lng, radius_meters, level, aqi_value) VALUES
  ('Ayala Center', 10.3157, 123.8854, 450, 'safe', 35),
  ('SM City', 10.3200, 123.8900, 400, 'moderate', 85),
  ('Lahug', 10.3250, 123.8950, 350, 'high', 145),
  ('Banilad', 10.3328, 123.9070, 380, 'moderate', 92);
```

### 6.2 `pollution_zone_history`

Historical pollution measurements for trend analysis.

| Column | Type | Constraints | Default | Description |
|--------|------|-------------|---------|-------------|
| `id` | UUID | PRIMARY KEY | `gen_random_uuid()` | History record identifier |
| `zone_id` | UUID | NOT NULL, FK → pollution_zones.id ON DELETE CASCADE | - | Pollution zone |
| `aqi_value` | INTEGER | NOT NULL | - | Historical AQI reading |
| `level` | ENUM | NOT NULL | - | Historical pollution level |
| `measured_at` | TIMESTAMPTZ | NOT NULL | `NOW()` | Measurement timestamp |

**Indexes:**
- `idx_pollution_history_zone` ON `pollution_zone_history(zone_id)`
- `idx_pollution_history_measured_at` ON `pollution_zone_history(measured_at DESC)`
- `idx_pollution_history_zone_time` ON `pollution_zone_history(zone_id, measured_at DESC)`

---

## 7. WASTE GUIDES

### 7.1 `waste_guides`

Waste segregation categories. Replaces `WASTE_GUIDES` array in `app/(tabs)/learn.tsx`.

| Column | Type | Constraints | Default | Description |
|--------|------|-------------|---------|-------------|
| `id` | UUID | PRIMARY KEY | `gen_random_uuid()` | Guide identifier |
| `title` | VARCHAR(100) | NOT NULL | - | Category name (e.g., "Biodegradable") |
| `icon_name` | VARCHAR(50) | NOT NULL | - | SF Symbol name (e.g., "leaf.fill") |
| `color_hex` | VARCHAR(7) | NOT NULL | '#2E7D32' | Primary color |
| `bg_color_hex` | VARCHAR(7) | NOT NULL | '#E8F5E9' | Background color |
| `description` | TEXT | NOT NULL | - | Category description |
| `disposal_method` | TEXT | NOT NULL | - | Disposal instructions |
| `display_order` | INTEGER | NOT NULL | 0 | Sort order in UI |
| `is_active` | BOOLEAN | NOT NULL | TRUE | Visibility flag |
| `created_at` | TIMESTAMPTZ | NOT NULL | `NOW()` | Creation timestamp |
| `updated_at` | TIMESTAMPTZ | NOT NULL | `NOW()` | Last update timestamp |

**Indexes:**
- `idx_waste_guides_title` ON `waste_guides(title)`
- `idx_waste_guides_order` ON `waste_guides(display_order)`
- `idx_waste_guides_active` ON `waste_guides(is_active)`

**Initial Data (from current app):**

```sql
INSERT INTO waste_guides (title, icon_name, color_hex, bg_color_hex, description, disposal_method, display_order) VALUES
  ('Biodegradable', 'leaf.fill', '#2E7D32', '#E8F5E9', 'Breaks down naturally and can be composted.', 'Compost bin or green waste container', 0),
  ('Recyclable', 'arrow.triangle.2.circlepath', '#FFD700', '#FFF8E1', 'Can be processed and made into new products.', 'Recycling bin (blue)', 1),
  ('Non-Biodegradable', 'trash.fill', '#E53935', '#FFE5E5', 'Does not break down easily. Dispose properly.', 'General waste bin (black)', 2);
```

### 7.2 `waste_guide_items`

Common items in each waste category. Replaces `items: string[]` in `WasteGuide`.

| Column | Type | Constraints | Default | Description |
|--------|------|-------------|---------|-------------|
| `id` | UUID | PRIMARY KEY | `gen_random_uuid()` | Item identifier |
| `guide_id` | UUID | NOT NULL, FK → waste_guides.id ON DELETE CASCADE | - | Parent waste guide |
| `item_name` | VARCHAR(100) | NOT NULL | - | Item name (e.g., "Food scraps") |
| `display_order` | INTEGER | NOT NULL | 0 | Sort order |
| `created_at` | TIMESTAMPTZ | NOT NULL | `NOW()` | Creation timestamp |

**Indexes:**
- `idx_waste_guide_items_guide` ON `waste_guide_items(guide_id)`
- `idx_waste_guide_items_order` ON `waste_guide_items(guide_id, display_order)`

**Initial Data:**

```sql
-- Biodegradable items
INSERT INTO waste_guide_items (guide_id, item_name, display_order) VALUES
  ((SELECT id FROM waste_guides WHERE title = 'Biodegradable'), 'Food scraps', 0),
  ((SELECT id FROM waste_guides WHERE title = 'Biodegradable'), 'Garden waste', 1),
  ((SELECT id FROM waste_guides WHERE title = 'Biodegradable'), 'Paper', 2),
  ((SELECT id FROM waste_guides WHERE title = 'Biodegradable'), 'Wood', 3),
  ((SELECT id FROM waste_guides WHERE title = 'Biodegradable'), 'Natural fibers', 4);

-- Recyclable items
INSERT INTO waste_guide_items (guide_id, item_name, display_order) VALUES
  ((SELECT id FROM waste_guides WHERE title = 'Recyclable'), 'Plastic bottles', 0),
  ((SELECT id FROM waste_guides WHERE title = 'Recyclable'), 'Glass', 1),
  ((SELECT id FROM waste_guides WHERE title = 'Recyclable'), 'Aluminum cans', 2),
  ((SELECT id FROM waste_guides WHERE title = 'Recyclable'), 'Cardboard', 3),
  ((SELECT id FROM waste_guides WHERE title = 'Recyclable'), 'Newspapers', 4);

-- Non-Biodegradable items
INSERT INTO waste_guide_items (guide_id, item_name, display_order) VALUES
  ((SELECT id FROM waste_guides WHERE title = 'Non-Biodegradable'), 'Plastic bags', 0),
  ((SELECT id FROM waste_guides WHERE title = 'Non-Biodegradable'), 'Styrofoam', 1),
  ((SELECT id FROM waste_guides WHERE title = 'Non-Biodegradable'), 'Chip bags', 2),
  ((SELECT id FROM waste_guides WHERE title = 'Non-Biodegradable'), 'Candy wrappers', 3),
  ((SELECT id FROM waste_guides WHERE title = 'Non-Biodegradable'), 'Broken ceramics', 4);
```

### 7.3 `waste_guide_tips`

Disposal tips for each waste category. Replaces `tips: string[]` in `WasteGuide`.

| Column | Type | Constraints | Default | Description |
|--------|------|-------------|---------|-------------|
| `id` | UUID | PRIMARY KEY | `gen_random_uuid()` | Tip identifier |
| `guide_id` | UUID | NOT NULL, FK → waste_guides.id ON DELETE CASCADE | - | Parent waste guide |
| `tip_text` | TEXT | NOT NULL | - | Tip content |
| `display_order` | INTEGER | NOT NULL | 0 | Sort order |
| `created_at` | TIMESTAMPTZ | NOT NULL | `NOW()` | Creation timestamp |

**Indexes:**
- `idx_waste_guide_tips_guide` ON `waste_guide_tips(guide_id)`
- `idx_waste_guide_tips_order` ON `waste_guide_tips(guide_id, display_order)`

**Initial Data:**

```sql
-- Biodegradable tips
INSERT INTO waste_guide_tips (guide_id, tip_text, display_order) VALUES
  ((SELECT id FROM waste_guides WHERE title = 'Biodegradable'), 'Compost food scraps for garden fertilizer', 0),
  ((SELECT id FROM waste_guides WHERE title = 'Biodegradable'), 'Use paper for mulching', 1),
  ((SELECT id FROM waste_guides WHERE title = 'Biodegradable'), 'Avoid mixing with plastics', 2);

-- Recyclable tips
INSERT INTO waste_guide_tips (guide_id, tip_text, display_order) VALUES
  ((SELECT id FROM waste_guides WHERE title = 'Recyclable'), 'Rinse containers before recycling', 0),
  ((SELECT id FROM waste_guides WHERE title = 'Recyclable'), 'Flatten cardboard boxes', 1),
  ((SELECT id FROM waste_guides WHERE title = 'Recyclable'), 'Remove caps from bottles', 2);

-- Non-Biodegradable tips
INSERT INTO waste_guide_tips (guide_id, tip_text, display_order) VALUES
  ((SELECT id FROM waste_guides WHERE title = 'Non-Biodegradable'), 'Reduce usage of single-use plastics', 0),
  ((SELECT id FROM waste_guides WHERE title = 'Non-Biodegradable'), 'Look for eco-friendly alternatives', 1),
  ((SELECT id FROM waste_guides WHERE title = 'Non-Biodegradable'), 'Proper disposal at designated facilities', 2);
```

### 7.4 `waste_tips`

General waste management tips. Replaces `WASTE_TIPS` array in `app/(tabs)/learn.tsx`.

| Column | Type | Constraints | Default | Description |
|--------|------|-------------|---------|-------------|
| `id` | UUID | PRIMARY KEY | `gen_random_uuid()` | Tip identifier |
| `icon_name` | VARCHAR(50) | NOT NULL | - | SF Symbol name |
| `title` | VARCHAR(100) | NOT NULL | - | Tip title |
| `description` | TEXT | NOT NULL | - | Tip description |
| `display_order` | INTEGER | NOT NULL | 0 | Sort order |
| `is_active` | BOOLEAN | NOT NULL | TRUE | Visibility flag |
| `created_at` | TIMESTAMPTZ | NOT NULL | `NOW()` | Creation timestamp |

**Indexes:**
- `idx_waste_tips_order` ON `waste_tips(display_order)`
- `idx_waste_tips_active` ON `waste_tips(is_active)`

**Initial Data:**

```sql
INSERT INTO waste_tips (icon_name, title, description, display_order) VALUES
  ('drop.fill', 'Reduce Water Usage', 'Use less water when cleaning to minimize wastewater.', 0),
  ('bag.fill', 'Bring Your Own Bag', 'Reduce plastic waste by using reusable shopping bags.', 1),
  ('apple.alt.fill', 'Compost Food Waste', 'Turn food scraps into nutrient-rich soil for plants.', 2),
  ('battery.full', 'Dispose Batteries Properly', 'Batteries contain hazardous materials. Use designated bins.', 3);
```

### 7.5 `ai_scan_history`

AI waste scanner classification history. Tracks usage of the AI scanner feature in `app/(tabs)/learn.tsx`.

| Column | Type | Constraints | Default | Description |
|--------|------|-------------|---------|-------------|
| `id` | UUID | PRIMARY KEY | `gen_random_uuid()` | Scan record identifier |
| `user_id` | UUID | NOT NULL, FK → users.id ON DELETE CASCADE | - | User who scanned |
| `image_url` | VARCHAR(500) | NOT NULL | - | Scanned image URL |
| `result_guide_id` | UUID | NOT NULL, FK → waste_guides.id | - | Classification result |
| `confidence_score` | DECIMAL(5, 4) | NULL | NULL | ML model confidence (0.0-1.0) |
| `scanned_at` | TIMESTAMPTZ | NOT NULL | `NOW()` | Scan timestamp |

**Indexes:**
- `idx_ai_scan_history_user` ON `ai_scan_history(user_id)`
- `idx_ai_scan_history_result` ON `ai_scan_history(result_guide_id)`
- `idx_ai_scan_history_scanned_at` ON `ai_scan_history(scanned_at DESC)`
- `idx_ai_scan_history_user_time` ON `ai_scan_history(user_id, scanned_at DESC)`

**Constraints:**
- `CHECK (confidence_score IS NULL OR (confidence_score >= 0 AND confidence_score <= 1))`

---

## 8. USER SETTINGS

### 8.1 `user_settings`

User preferences and configuration. Replaces `@gtrash:user_profile`, `@gtrash:notifications`, and `@gtrash:settings` AsyncStorage keys.

| Column | Type | Constraints | Default | Description |
|--------|------|-------------|---------|-------------|
| `id` | UUID | PRIMARY KEY | `gen_random_uuid()` | Settings record identifier |
| `user_id` | UUID | UNIQUE, NOT NULL, FK → users.id ON DELETE CASCADE | - | User reference |
| `notifications_enabled` | BOOLEAN | NOT NULL | TRUE | Truck arrival alerts |
| `collection_reminders` | BOOLEAN | NOT NULL | TRUE | Collection day reminders |
| `map_show_heatmap` | BOOLEAN | NOT NULL | TRUE | Show pollution zones on map |
| `map_show_truck` | BOOLEAN | NOT NULL | TRUE | Show truck marker on map |
| `map_show_user_location` | BOOLEAN | NOT NULL | TRUE | Show user location on map |
| `map_default_route` | VARCHAR(50) | NULL | 'lahug' | Default selected route key |
| `theme` | VARCHAR(20) | NOT NULL | 'light' | UI theme: light, dark, system |
| `language` | VARCHAR(10) | NOT NULL | 'en' | Language code |
| `distance_unit` | VARCHAR(10) | NOT NULL | 'metric' | Distance unit: metric, imperial |
| `updated_at` | TIMESTAMPTZ | NOT NULL | `NOW()` | Last update timestamp |

**Indexes:**
- `idx_user_settings_user` ON `user_settings(user_id)`

**Constraints:**
- `CHECK (theme IN ('light', 'dark', 'system'))`
- `CHECK (language IN ('en', 'fil', 'ceb'))`
- `CHECK (distance_unit IN ('metric', 'imperial'))`

---

## 9. USER POINTS

### 9.1 `user_points`

Gamification points system. Replaces mock `userPoints` state in `app/(tabs)/profile.tsx`.

| Column | Type | Constraints | Default | Description |
|--------|------|-------------|---------|-------------|
| `id` | UUID | PRIMARY KEY | `gen_random_uuid()` | Points record identifier |
| `user_id` | UUID | UNIQUE, NOT NULL, FK → users.id ON DELETE CASCADE | - | User reference |
| `points` | INTEGER | NOT NULL | 0 | Current points (0-100+) |
| `lifetime_points` | INTEGER | NOT NULL | 0 | Total points earned |
| `points_expires_at` | TIMESTAMPTZ | NULL | NULL | Expiration date (optional) |
| `last_earned_at` | TIMESTAMPTZ | NULL | NULL | Last points earned timestamp |
| `updated_at` | TIMESTAMPTZ | NOT NULL | `NOW()` | Last update timestamp |

**Indexes:**
- `idx_user_points_user` ON `user_points(user_id)`
- `idx_user_points_points` ON `user_points(points DESC)` -- For leaderboards

**Constraints:**
- `CHECK (points >= 0)`
- `CHECK (lifetime_points >= points)`

### 9.2 `user_points_history`

Detailed points transaction log for audit trail.

| Column | Type | Constraints | Default | Description |
|--------|------|-------------|---------|-------------|
| `id` | UUID | PRIMARY KEY | `gen_random_uuid()` | Transaction identifier |
| `user_id` | UUID | NOT NULL, FK → users.id ON DELETE CASCADE | - | User reference |
| `points_change` | INTEGER | NOT NULL | - | Points delta (+/-) |
| `reason` | VARCHAR(100) | NOT NULL | - | Reason for change |
| `reference_type` | VARCHAR(50) | NULL | NULL | Related entity type |
| `reference_id` | UUID | NULL | NULL | Related entity ID |
| `created_at` | TIMESTAMPTZ | NOT NULL | `NOW()` | Transaction timestamp |

**Indexes:**
- `idx_user_points_history_user` ON `user_points_history(user_id)`
- `idx_user_points_history_created_at` ON `user_points_history(created_at DESC)`
- `idx_user_points_history_user_time` ON `user_points_history(user_id, created_at DESC)`

**Example Reasons:**
- `report_submitted` - User submitted a community report (+5)
- `report_upvoted` - User's report received an upvote (+1)
- `ai_scan_completed` - User scanned a waste item (+2)
- `profile_completed` - User completed their profile (+10)
- `first_login` - User's first login (+5)
- `streak_bonus` - Consecutive day login bonus (+3)

---

## 10. NOTIFICATIONS

### 10.1 `notifications`

Push notification history. Replaces runtime `toast` and `statusType` state in `app/(tabs)/index.tsx`.

| Column | Type | Constraints | Default | Description |
|--------|------|-------------|---------|-------------|
| `id` | UUID | PRIMARY KEY | `gen_random_uuid()` | Notification identifier |
| `user_id` | UUID | NOT NULL, FK → users.id ON DELETE CASCADE | - | Target user |
| `type` | ENUM | NOT NULL | 'info' | Notification type |
| `title` | VARCHAR(200) | NOT NULL | - | Notification title |
| `message` | TEXT | NOT NULL | - | Notification body |
| `data` | JSONB | NULL | NULL | Additional payload |
| `is_read` | BOOLEAN | NOT NULL | FALSE | Read status |
| `read_at` | TIMESTAMPTZ | NULL | NULL | Read timestamp |
| `created_at` | TIMESTAMPTZ | NOT NULL | `NOW()` | Creation timestamp |

**Enums:**

```sql
CREATE TYPE notification_type AS ENUM (
  'info',      -- General information
  'warning',   -- Truck nearby
  'alert',     -- Urgent action required
  'success'    -- Positive confirmation
);
```

**Indexes:**
- `idx_notifications_user` ON `notifications(user_id)`
- `idx_notifications_type` ON `notifications(type)`
- `idx_notifications_read` ON `notifications(is_read)`
- `idx_notifications_created_at` ON `notifications(created_at DESC)`
- `idx_notifications_user_unread` ON `notifications(user_id, is_read)`
- **Partial Index:** `idx_notifications_user_unread_filtered` ON `notifications(user_id) WHERE is_read = FALSE`

**Constraints:**
- `CHECK (LENGTH(message) > 0)`

---

## 11. USER BACKUPS

### 11.1 `user_backups`

Cloud backup data for user profile and local state. Supports the "Backup Data" feature in `app/(tabs)/profile.tsx`.

| Column | Type | Constraints | Default | Description |
|--------|------|-------------|---------|-------------|
| `id` | UUID | PRIMARY KEY | `gen_random_uuid()` | Backup identifier |
| `user_id` | UUID | NOT NULL, FK → users.id ON DELETE CASCADE | - | User reference |
| `backup_data` | JSONB | NOT NULL | - | Complete backup payload |
| `backup_size_kb` | INTEGER | NOT NULL | 0 | Backup file size |
| `backup_version` | VARCHAR(10) | NOT NULL | '1.0.0' | App version at backup time |
| `created_at` | TIMESTAMPTZ | NOT NULL | `NOW()` | Backup timestamp |

**Indexes:**
- `idx_user_backups_user` ON `user_backups(user_id)`
- `idx_user_backups_created_at` ON `user_backups(user_id, created_at DESC)`

**Constraints:**
- `CHECK (backup_size_kb > 0)`

**Backup Data JSON Structure:**

```json
{
  "user_profile": {
    "barangay": "Lahug",
    "notificationsEnabled": true,
    "collectionReminders": true,
    "householdMembers": 3
  },
  "reports": [...],
  "settings": {
    "map_show_heatmap": true,
    "map_show_truck": true,
    "theme": "light"
  },
  "points": {
    "points": 58,
    "lifetime_points": 120
  }
}
```

---

## Entity Relationship Diagram

```
┌──────────────────┐
│   BARANGAYS      │
│──────────────────│
│ id (PK)          │
│ name             │
│ city             │
│ center_lat       │
│ center_lng       │
│ coverage_radius_m│
│ is_active        │
│ created_at       │
│ updated_at       │
└────────┬─────────┘
         │
         │ 1:M
         │
    ┌────┴─────────────────────────────────────────┐
    │                                              │
    │                                              │
    ▼                                              ▼                                              ▼
┌──────────────┐                          ┌──────────────────┐                    ┌──────────────────┐
│    USERS     │                          │ TRUCK_ROUTES     │                    │COLLECTION_       │
│──────────────│                          │──────────────────│                    │SCHEDULES         │
│ id (PK)      │                          │ id (PK)          │                    │──────────────────│
│ email        │                          │ route_key        │                    │ id (PK)          │
│ password_hash│                          │ name             │                    │ barangay_id (FK) │
│ full_name    │                          │ barangay_id (FK) │                    │ date             │
│ phone        │                          │ color_hex        │                    │ day_label        │
│ barangay_id  │──┐                       │ start_time       │                    │ route_description│
│ household_   │  │                       │ end_time         │                    │ time_start       │
│  members     │  │                       │ description      │                    │ time_end         │
│ notif_       │  │                       │ center_lat/lng   │                    │ truck_number     │
│  enabled     │  │                       │ is_active        │                    │ status           │
│ collection_  │  │                       └────────┬─────────┘                    │ notes            │
│  reminders   │  │                                │                              └──────────────────┘
│ is_active    │  │                       1:M      │
│ last_login_at│  │                                │
│ created_at   │  │    ┌───────────────────────────┼──────────────────────────┐
│ updated_at   │  │    │                           │                          │
└──────┬───────┘  │    ▼                           ▼                          ▼
       │          │┌──────────────────┐   ┌──────────────────┐   ┌──────────────────┐
       │          ││TRUCK_ROUTE_      │   │  TRUCK_STOPS     │   │ TRUCK_LOCATIONS  │
       │          ││BOUNDARIES        │   │──────────────────│   │──────────────────│
       │          ││──────────────────│   │ id (PK)          │   │ id (PK)          │
       │          ││ id (PK)          │   │ route_id (FK)    │   │ route_id (FK)    │
       │          ││ route_id (FK)    │   │ sequence         │   │ truck_number     │
       │          ││ sequence         │   │ name             │   │ latitude         │
       │          ││ latitude         │   │ time             │   │ longitude        │
       │          ││ longitude        │   │ latitude         │   │ position_index   │
       └─────┐    │└──────────────────┘   │ longitude        │   │ progress_%       │
             │    │                        └──────────────────┘   │ speed_kmh        │
             │    │                                               │ heading_degrees  │
             │    │                                               │ last_updated_at  │
             │    │                                               └──────────────────┘
             │    │
1:M          │    │
             │    │
             ▼    │
┌──────────────────────────┐
│      REPORTS             │
│──────────────────────────│
│ id (PK)                  │
│ user_id (FK)             │◄────┐
│ type (ENUM)              │     │
│ description              │     │
│ location                 │     │
│ latitude/longitude       │     │
│ upvotes                  │     │ 1:M
│ downvotes                │     │
│ priority_score           │     │
│ is_verified              │     │
│ status (ENUM)            │     │
│ created_at               │     │
│ updated_at               │     │
└──────┬───────────────────┘     │
       │ 1:M                     │
       │                         │
       ├──►┌──────────────────┐  │
       │   │  REPORT_IMAGES   │  │
       │   │──────────────────│  │
       │   │ id (PK)          │  │
       │   │ report_id (FK)   │  │
       │   │ image_url        │  │
       │   │ thumbnail_url    │  │
       │   │ order_index      │  │
       │   └──────────────────┘  │
       │                         │
       ├──►┌──────────────────┐  │
       │   │  REPORT_VOTES    │  │
       │   │──────────────────│  │
       │   │ id (PK)          │  │
       │   │ report_id (FK)   │──┘
       │   │ user_id (FK)     │──┐
       │   │ vote_type (ENUM) │  │
       │   │ created_at       │  │
       │   └──────────────────┘  │
       │                         │
       ├──►┌──────────────────┐  │
       │   │  REPORT_FLAGS    │  │
       │   │──────────────────│  │
       │   │ id (PK)          │  │
       │   │ report_id (FK)   │  │
       │   │ flagged_by_id(FK)│  │
       │   │ reason           │  │
       │   │ is_resolved      │  │
       │   └──────────────────┘  │
       │                         │
       │                         │
       ▼                         │
┌──────────────────┐             │
│  POLLUTION_ZONES │             │
│──────────────────│             │
│ id (PK)          │             │
│ location_name    │             │
│ center_lat/lng   │             │
│ radius_meters    │             │
│ level (ENUM)     │             │
│ aqi_value        │             │
│ sensor_id        │             │
│ is_active        │             │
│ measured_at      │             │
└──────────────────┘             │
                                 │
                                 │
┌──────────────────┐             │
│   WASTE_GUIDES   │             │
│──────────────────│             │
│ id (PK)          │             │
│ title            │             │
│ icon_name        │             │
│ color_hex        │             │
│ bg_color_hex     │             │
│ description      │             │
│ disposal_method  │             │
│ display_order    │             │
└────────┬─────────┘             │
         │ 1:M                   │
         ├──►┌──────────────────┐│
         │   │WASTE_GUIDE_ITEMS ││
         │   │WASTE_GUIDE_TIPS  ││
         │   └──────────────────┘│
         │                       │
         ├──►┌──────────────────┐│
         │   │AI_SCAN_HISTORY   ││
         │   │──────────────────││
         │   │ id (PK)          ││
         │   │ user_id (FK)     │┼──┐
         │   │ image_url        ││  │
         │   │ result_guide_id  ││  │
         │   │ confidence_score ││  │
         │   │ scanned_at       ││  │
         │   └──────────────────┘│  │
         │                       │  │
         └───────────────────────┘  │
                                    │
┌──────────────────┐                │
│   WASTE_TIPS     │                │
│──────────────────│                │
│ id (PK)          │                │
│ icon_name        │                │
│ title            │                │
│ description      │                │
└──────────────────┘                │
                                    │
┌──────────────────┐                │
│  USER_SETTINGS   │                │
│──────────────────│                │
│ id (PK)          │                │
│ user_id (FK,UNQ) │────────────────┘
│ notifications_   │
│  enabled         │
│ collection_      │
│  reminders       │
│ map_show_*       │
│ theme            │
│ language         │
└──────────────────┘

┌──────────────────┐
│   USER_POINTS    │
│──────────────────│
│ id (PK)          │
│ user_id (FK,UNQ) │
│ points           │
│ lifetime_points  │
│ last_earned_at   │
└────────┬─────────┘
         │ 1:M
         │
         ▼
┌──────────────────────┐
│USER_POINTS_HISTORY   │
│──────────────────────│
│ id (PK)              │
│ user_id (FK)         │
│ points_change        │
│ reason               │
│ reference_type/id    │
│ created_at           │
└──────────────────────┘

┌──────────────────┐
│  NOTIFICATIONS   │
│──────────────────│
│ id (PK)          │
│ user_id (FK)     │
│ type (ENUM)      │
│ title            │
│ message          │
│ data (JSONB)     │
│ is_read          │
│ read_at          │
│ created_at       │
└──────────────────┘

┌──────────────────┐
│  USER_BACKUPS    │
│──────────────────│
│ id (PK)          │
│ user_id (FK)     │
│ backup_data(JSONB)                  │
│ backup_size_kb   │
│ backup_version   │
│ created_at       │
└──────────────────┘
```

---

## Migration Guide from AsyncStorage

### Current AsyncStorage Keys → New Database Tables

| AsyncStorage Key | Current Data Type | New Table(s) | Migration Notes |
|------------------|-------------------|--------------|-----------------|
| `@gtrash:user` | `User` object | `users` | Session data, migrate to JWT tokens |
| `@gtrash:password` | `string` | `users.password_hash` | **HASH BEFORE MIGRATION** - never migrate plaintext |
| `@gtrash:allUsers` | `Array<User>` | `users` | Bulk insert all registered users |
| `@gtrash:user_profile` | `any` | `user_settings` | Map fields to typed columns |
| `@gtrash:truck_location` | `TruckData` | `truck_locations` | Real-time data, no migration needed |
| `@gtrash:heatmap_data` | `PollutionZone[]` | `pollution_zones` | Direct migration |
| `@gtrash:notifications` | `boolean` | `user_settings.notifications_enabled` | Direct mapping |
| `@gtrash:reports` | `ReportPost[]` | `reports`, `report_images`, `report_votes` | Split into normalized tables |
| `@gtrash:schedule` | `CollectionSchedule[]` | `collection_schedules` | Direct migration |
| `@gtrash:settings` | `any` | `user_settings` | Map fields to typed columns |

### Migration Steps

1. **Export AsyncStorage Data:**
   ```javascript
   // Export all AsyncStorage keys
   const keys = await AsyncStorage.getAllKeys();
   const data = {};
   for (const key of keys) {
     data[key] = await AsyncStorage.getItem(key);
   }
   ```

2. **Create Database:**
   ```bash
   createdb gtrash_resident
   psql -d gtrash_resident -f schema.sql
   ```

3. **Migrate Users (with password hashing):**
   ```javascript
   import bcrypt from 'bcrypt';
   
   const allUsers = JSON.parse(await AsyncStorage.getItem('@gtrash:allUsers'));
   for (const user of allUsers) {
     const passwordHash = await bcrypt.hash(user.password, 12);
     // Insert into users table
   }
   ```

4. **Migrate Reports:**
   ```javascript
   const reports = JSON.parse(await AsyncStorage.getItem('@gtrash:reports')) || [];
   for (const report of reports) {
     // Insert into reports
     // Insert report.images into report_images
     // If userVote exists, insert into report_votes
   }
   ```

5. **Migrate Schedules:**
   ```javascript
   const schedules = JSON.parse(await AsyncStorage.getItem('@gtrash:schedule')) || [];
   // Bulk insert into collection_schedules
   ```

6. **Migrate Heatmap:**
   ```javascript
   const heatmap = JSON.parse(await AsyncStorage.getItem('@gtrash:heatmap_data')) || [];
   // Bulk insert into pollution_zones
   ```

7. **Migrate User Settings:**
   ```javascript
   const profile = await AsyncStorage.getItem('@gtrash:user_profile');
   const notifications = await AsyncStorage.getItem('@gtrash:notifications');
   const settings = await AsyncStorage.getItem('@gtrash:settings');
   // Merge and insert into user_settings
   ```

8. **Update Resident App:**
   - Replace AsyncStorage calls with API calls
   - Implement JWT authentication
   - Add offline caching with React Query / SWR
   - Update data fetching to use REST/GraphQL endpoints

---

## Indexes Summary

### Critical Indexes for Performance

| Table | Column(s) | Index Type | Purpose |
|-------|-----------|------------|---------|
| `users` | `email` | UNIQUE | Fast login lookup |
| `reports` | `priority_score DESC` | BTREE | Leaderboard/sorting |
| `reports` | `created_at DESC` | BTREE | Feed pagination |
| `report_votes` | `(report_id, user_id)` | UNIQUE | Vote deduplication |
| `truck_locations` | `last_updated_at DESC` | BTREE | Latest truck position |
| `notifications` | `(user_id, is_read)` | PARTIAL | Unread count queries |
| `pollution_zones` | `(center_lat, center_lng)` | SPATIAL (PostGIS) | Location-based queries |
| `ai_scan_history` | `(user_id, scanned_at DESC)` | BTREE | User scan history |

---

## Constraints Summary

### Data Integrity Constraints

| Constraint Type | Table | Columns | Purpose |
|----------------|-------|---------|---------|
| UNIQUE | `users` | `email` | Prevent duplicate emails |
| UNIQUE | `report_votes` | `(report_id, user_id)` | One vote per user per report |
| UNIQUE | `report_flags` | `(report_id, flagged_by_user_id)` | One flag per user per report |
| UNIQUE | `user_settings` | `user_id` | One settings record per user |
| UNIQUE | `user_points` | `user_id` | One points record per user |
| UNIQUE | `truck_routes` | `route_key` | Unique route identifiers |
| CHECK | `users` | `household_members >= 1` | Valid household size |
| CHECK | `reports` | `LENGTH(description) >= 10` | Minimum description length |
| CHECK | `truck_locations` | `progress_percentage BETWEEN 0 AND 100` | Valid progress range |
| CHECK | `pollution_zones` | `aqi_value BETWEEN 0 AND 500` | Valid AQI range |
| CHECK | `ai_scan_history` | `confidence_score BETWEEN 0 AND 1` | Valid ML confidence |
| FOREIGN KEY | Multiple | Various | Referential integrity |

---

## Future Enhancements (Not in Current App)

### Tables Planned for Future Versions

1. **`iot_sensors`** - ESP32 sensor devices (MQ-135, DHT11, Ultrasonic)
2. **`sensor_readings`** - Time-series sensor data for IoT integration
3. **`rewards_catalog`** - Redeemable rewards for points
4. **`user_reward_redemptions`** - Points redemption history
5. **`barangay_leaderboard`** - Aggregated barangay rankings
6. **`ai_model_versions`** - ML model version tracking
7. **`api_rate_limits`** - API throttling
8. **`audit_logs`** - Admin action audit trail
9. **`push_tokens`** - FCM/APNS device tokens for push notifications
10. **`sessions`** - JWT token blacklist/whitelist

---

## API Endpoints Suggested

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh JWT token
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile

### Reports
- `GET /api/reports` - List reports (paginated, filtered)
- `POST /api/reports` - Create new report
- `GET /api/reports/:id` - Get report details
- `PUT /api/reports/:id` - Update report
- `DELETE /api/reports/:id` - Delete report
- `POST /api/reports/:id/vote` - Vote on report
- `POST /api/reports/:id/flag` - Flag report
- `POST /api/reports/:id/images` - Upload report images

### Schedules
- `GET /api/schedules` - List collection schedules
- `GET /api/schedules/:date` - Get schedule for date
- `GET /api/schedules/barangay/:id` - Get barangay schedules

### Truck Routes
- `GET /api/truck-routes` - List all routes
- `GET /api/truck-routes/:key` - Get route details
- `GET /api/truck-routes/:key/stops` - Get route stops
- `GET /api/truck-locations` - Get all truck locations
- `GET /api/truck-locations/:truck_number` - Get specific truck location

### Pollution Zones
- `GET /api/pollution-zones` - List active pollution zones
- `GET /api/pollution-zones/history/:zoneId` - Get zone history

### Waste Guides
- `GET /api/waste-guides` - List all waste guides
- `GET /api/waste-guides/:id` - Get waste guide details
- `GET /api/waste-tips` - List general waste tips
- `POST /api/ai-scanner/scan` - Classify waste image

### User Settings
- `GET /api/user/settings` - Get user settings
- `PUT /api/user/settings` - Update user settings

### Points
- `GET /api/user/points` - Get user points
- `GET /api/user/points/history` - Get points history
- `GET /api/leaderboard` - Get leaderboard

### Notifications
- `GET /api/notifications` - List user notifications
- `PUT /api/notifications/:id/read` - Mark as read
- `PUT /api/notifications/read-all` - Mark all as read

### Backups
- `POST /api/backups` - Create backup
- `GET /api/backups` - List backups
- `POST /api/backups/:id/restore` - Restore backup

---

## Security Recommendations

1. **Password Hashing:** Use bcrypt with cost factor 12+ or argon2id
2. **JWT Tokens:** Use short-lived access tokens (15 min) + refresh tokens (7 days)
3. **HTTPS:** Enforce TLS for all API communication
4. **Input Validation:** Use Zod/Joi for request validation
5. **SQL Injection:** Use parameterized queries or ORM
6. **Rate Limiting:** Implement API rate limiting per user/IP
7. **CORS:** Restrict to known origins
8. **Audit Logs:** Log all authentication and admin actions
9. **Data Encryption:** Encrypt sensitive fields at rest
10. **Backup Encryption:** Encrypt backup data in cloud storage

---

## Database Configuration (PostgreSQL)

```sql
-- Recommended PostgreSQL settings
ALTER SYSTEM SET max_connections = 100;
ALTER SYSTEM SET shared_buffers = '256MB';
ALTER SYSTEM SET effective_cache_size = '1GB';
ALTER SYSTEM SET maintenance_work_mem = '64MB';
ALTER SYSTEM SET checkpoint_completion_target = 0.9;
ALTER SYSTEM SET wal_buffers = '16MB';
ALTER SYSTEM SET default_statistics_target = 100;
ALTER SYSTEM SET random_page_cost = 1.1;
ALTER SYSTEM SET effective_io_concurrency = 200;
```

---

**Schema Version:** 1.0.0  
**Last Updated:** April 7, 2026  
**Compatible With:** PostgreSQL 14+, MySQL 8.0+, SQLite 3.35+  
**Generated From:** Resident Application v1.0.0 (Expo SDK 54)
