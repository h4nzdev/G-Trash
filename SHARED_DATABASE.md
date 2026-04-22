# G-TRASH Shared Database Architecture

## 📊 Overview

Both **Resident** and **GarbageTruck** apps now share a **single database** (`Resident/backend/database/gtrash.db`).

```
┌─────────────────┐         ┌──────────────────┐
│  Resident App   │         │ GarbageTruck App │
│  Backend:3001   │         │ Backend:3002     │
└────────┬────────┘         └────────┬─────────┘
         │                           │
         │                           │
         └───────────┬───────────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │   gtrash.db (SQLite)  │
         │  Resident/backend/    │
         │   database/ folder    │
         └───────────────────────┘
```

---

## 🔗 How It Works

### Resident Backend (Port 3001)
- **Manages database schema** - Creates tables, indexes, triggers
- **Seeds resident data** - Users, reports, schedules, pollution zones
- **Full CRUD operations** - All tables

### GarbageTruck Backend (Port 3002)
- **Uses existing database** - Connects to `../../Resident/backend/database/gtrash.db`
- **Seeds collector data** - Collector/driver users, truck routes, stops
- **Focused operations** - Routes, schedules, GPS tracking, collector profiles
- **NO schema creation** - Resident handles that

---

## 🗄️ Shared Tables

Both apps use the **same tables** from the Resident schema:

| Table | Used By | Purpose |
|-------|---------|---------|
| `users` | Both | Residents AND collectors/drivers (differentiated by `role`) |
| `truck_routes` | Both | Route definitions with boundaries |
| `truck_stops` | GarbageTruck | Named stops on routes |
| `truck_locations` | Both | Real-time GPS tracking |
| `collection_schedules` | Both | Daily collection calendar |
| `pollution_zones` | Both | Air quality heatmap data |
| `notifications` | Both | Push notification history |
| `barangays` | Both | Cebu City barangay reference |

---

## 🔐 Authentication

### User Types (in `users` table)
- **Residents**: `role = NULL` or `'resident'`
- **Collectors**: `role = 'collector'`
- **Drivers**: `role = 'driver'`
- **Supervisors**: `role = 'supervisor'`

### Login Credentials

**Resident App:**
```
Email: demo@gtrash.com
Password: password123
```

**GarbageTruck App:**
```
Email: collector.lahug@gtrash.com
Password: password123
```

Both use the **same `users` table** with `password_hash` (bcrypt).

---

## 🚀 Startup Order

### **1. Start Resident Backend First**
```bash
cd Resident/backend
npm start
# Initializes database schema + seeds data
# Runs on http://localhost:3001
```

### **2. Start GarbageTruck Backend**
```bash
cd GarbageTruck/backend
npm start
# Connects to existing gtrash.db
# Seeds collector data (if not present)
# Runs on http://localhost:3002
```

### **3. Start Frontends**
```bash
# Resident app
cd Resident
npm start

# GarbageTruck app
cd GarbageTruck
npm start
```

---

## 📝 Key Differences from Separate Databases

### ✅ Advantages
- **Single source of truth** - No data duplication
- **Shared references** - Both apps use same barangays, routes, schedules
- **Consistent auth** - Users can theoretically access both apps
- **Easier maintenance** - One database to backup
- **Real-time sync** - Changes in one app immediately visible in the other

### ⚠️ Considerations
- **Resident must start first** - Schema initialization happens in Resident backend
- **Schema changes** - Update Resident's `schema.sql` only
- **Port conflicts** - Resident uses 3001, GarbageTruck uses 3002
- **Concurrent writes** - SQLite WAL mode handles this (Resident schema enables it)

---

## 🔧 Configuration

### GarbageTruck `.env`
```env
EXPO_PUBLIC_OPENROUTESERVICE_API_KEY=your_key_here
EXPO_PUBLIC_API_URL=http://192.168.1.100:3002/api
```

### GarbageTruck `backend/database/db.js`
```javascript
// Points to Resident database
const dbPath = path.join(__dirname, '../../Resident/backend/database/gtrash.db');
```

### GarbageTruck `backend/seed.js`
- **NO schema creation** - Only inserts data
- **Checks existing data** - Prevents duplicate seeding
- **Uses `INSERT OR IGNORE`** - Safe for shared tables

---

## 📊 Data Flow Example

### Collection Schedule (Used by Both Apps)

1. **Resident App** - Views collection schedule for their barangay
2. **GarbageTruck App** - Updates schedule status (in_progress → completed)
3. **Both see same data** - Single `collection_schedules` table

### Truck Location

1. **GarbageTruck App** - Updates GPS location via `/api/trucks/location`
2. **Resident App** - Displays truck on map from `truck_locations` table
3. **Real-time sync** - Both use same database

### Pollution Zones

1. **IoT Sensors** - Update `pollution_zones` table
2. **Resident App** - Shows heatmap circles on map
3. **GarbageTruck App** - Displays AQI readings in heatmap tab
4. **Same data** - Both query `pollution_zones`

---

## 🛠️ Database Maintenance

### Backup
```bash
# Backup the single database file
cp Resident/backend/database/gtrash.db gtrash_backup_$(date +%Y%m%d).db
```

### Reset Database
```bash
# Delete database (Resident will recreate on next start)
rm Resident/backend/database/gtrash.db
rm Resident/backend/database/gtrash.db-shm
rm Resident/backend/database/gtrash.db-wal

# Restart Resident backend
cd Resident/backend && npm start
```

### View Database
```bash
# Using SQLite CLI
sqlite3 Resident/backend/database/gtrash.db

# List tables
.tables

# View users
SELECT id, email, role, full_name FROM users;
```

---

## ✅ Verification

### Check Database Connection
```bash
cd GarbageTruck/backend
node -e "
import db from './database/db.js';
console.log('Connected to:', db.prepare('SELECT file FROM pragma_database_list').all());
console.log('Users count:', db.prepare('SELECT COUNT(*) as c FROM users').get());
"
```

### Expected Output
```
Using Resident app database (gtrash.db)
Database tables managed by Resident backend

✓ GarbageTruck data already exists (3 users)
GarbageTruck data ready!
```

---

## 📚 Related Files

- `Resident/backend/database/schema.sql` - Master schema
- `Resident/backend/database/seed.js` - Resident seed data
- `GarbageTruck/backend/database/db.js` - Connection to shared DB
- `GarbageTruck/backend/database/seed.js` - GarbageTruck seed data
- `GarbageTruck/backend/server.js` - Startup without schema init

---

## 🎯 Summary

✅ **One database** - `gtrash.db` in Resident backend  
✅ **Two backends** - Resident (3001) + GarbageTruck (3002)  
✅ **Shared schema** - Resident manages tables  
✅ **Shared auth** - Same `users` table with bcrypt passwords  
✅ **Shared data** - Routes, schedules, pollution, GPS  
✅ **Independent services** - Each app has its own API  

**Start Resident first, then GarbageTruck, and both will work seamlessly!** 🚀
