# G-TRASH Officials - Backend Integration Complete

## Overview

The Officials app now has a complete backend integration using the **same shared database** (`gtrash.db`) as the Resident and GarbageTruck apps.

---

## 📦 Tech Stack

### Frontend
- **Framework**: React 19.2.4 + Vite 8.0.1
- **Routing**: React Router DOM 7.14.0
- **Styling**: Tailwind CSS 4.2.2
- **HTTP Client**: Axios 1.14.0
- **Maps**: Leaflet 1.9.4 + React-Leaflet 5.0.0
- **State**: React Context (AuthContext)

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js 5.2.1
- **Database**: SQLite (better-sqlite3) - **SHARED with Resident & GarbageTruck**
- **Authentication**: JWT (jsonwebtoken 9.0.3)
- **Password Hashing**: bcryptjs 3.0.3
- **Validation**: Zod 4.3.6

---

## 🗄️ Shared Database Architecture

```
┌──────────────┐      ┌──────────────────┐      ┌───────────────┐
│ Resident App │      │ GarbageTruck App │      │ Officials App │
│ Port: 3001   │      │ Port: 3002       │      │ Port: 3003    │
└───────┬──────┘      └────────┬─────────┘      └───────┬───────┘
        │                      │                        │
        └──────────────────────┼────────────────────────┘
                               │
                               ▼
                ┌──────────────────────────┐
                │   gtrash.db (SQLite)     │
                │ Resident/backend/database│
                │                          │
                │ Shared Tables:           │
                │ - users                  │
                │ - reports                │
                │ - truck_routes           │
                │ - truck_stops            │
                │ - truck_locations        │
                │ - collection_schedules   │
                │ - pollution_zones        │
                │ - notifications          │
                │ - barangays              │
                └──────────────────────────┘
```

---

## 🔐 Authentication

### Demo Credentials

**Admin:**
```
Email: admin@gtrash.com
Password: password123
```

**Barangay Official:**
```
Email: official@lahug.com
Password: password123
```

Both use the **same `users` table** with different roles (`admin`, `official`).

---

## 🚀 How to Run

### **1. Start Resident Backend FIRST** (Manages database schema)
```bash
cd Resident/backend
npm start
# Initializes database schema
# Runs on http://localhost:3001
```

### **2. Start GarbageTruck Backend** (Optional)
```bash
cd GarbageTruck/backend
npm start
# Seeds collector data
# Runs on http://localhost:3002
```

### **3. Start Officials Backend**
```bash
cd Officials/backend
npm start
# Connects to existing gtrash.db
# Seeds official users
# Runs on http://localhost:3003
```

### **4. Start Officials Frontend**
```bash
cd Officials
npm run dev
# Vite dev server
# Runs on http://localhost:5173
```

---

## 📡 API Endpoints

### Auth
- `POST /api/auth/login` - Official login (email + password)
- `POST /api/auth/register` - Register new official
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/password` - Change password
- `POST /api/auth/logout` - Logout

### Reports
- `GET /api/reports` - Get all reports (with filters)
- `GET /api/reports/:id` - Get single report
- `PUT /api/reports/:id/status` - Update report status
- `POST /api/reports/:id/verify` - Verify report
- `GET /api/reports/stats/summary` - Report statistics

### Analytics
- `GET /api/analytics/dashboard` - Dashboard statistics
- `GET /api/analytics/reports/trend` - Monthly report trends
- `GET /api/analytics/collection/efficiency` - Collection completion rate
- `GET /api/analytics/urgency/distribution` - Urgency level breakdown

### Schedules
- `GET /api/schedules` - Get collection schedules
- `PUT /api/schedules/:id` - Update schedule

### Trucks
- `GET /api/trucks/locations` - Real-time truck GPS locations
- `GET /api/trucks/routes` - Truck routes with stops

### Notifications
- `GET /api/notifications` - Get notifications
- `GET /api/notifications/unread-count` - Unread count
- `PUT /api/notifications/:id/read` - Mark as read

---

## 📁 Project Structure

```
Officials/
├── backend/                      # Node.js/Express API server
│   ├── server.js                 # Entry point
│   ├── app.js                    # Express app config
│   ├── database/
│   │   ├── db.js                 # Connection to shared gtrash.db
│   │   └── seed.js               # Seeds official users
│   ├── controllers/              # 4 controllers
│   │   ├── auth.controller.js    # Login, register, profile
│   │   ├── reports.controller.js # Reports CRUD + stats
│   │   ├── analytics.controller.js # Dashboard analytics
│   │   └── shared.controller.js  # Schedules, trucks, notifications
│   ├── routes/                   # 6 route files
│   ├── middleware/               # Auth, validation, error handling
│   └── utils/                    # JWT, response formatting
│
├── src/
│   ├── services/                 # Frontend API services
│   │   ├── apiClient.js          # Axios client with interceptors
│   │   ├── authService.js        # Auth API calls
│   │   ├── reportsService.js     # Reports API calls
│   │   ├── analyticsService.js   # Analytics API calls
│   │   └── otherServices.js      # Schedules, trucks, notifications
│   ├── contexts/
│   │   └── AuthContext.jsx       # Auth state management (REAL backend)
│   ├── pages/                    # 11 pages (all functional)
│   └── components/               # Dashboard layout, protected routes
│
└── .env                          # VITE_API_URL=http://localhost:3003/api
```

---

## 🔑 Key Features Implemented

✅ **JWT Authentication** - Secure login/logout with token storage  
✅ **Password Hashing** - bcrypt for secure password storage  
✅ **Role-Based Access** - admin, official roles  
✅ **Reports Management** - View, filter, update status, verify reports  
✅ **Analytics Dashboard** - Dashboard stats, trends, efficiency metrics  
✅ **Real-Time Truck Tracking** - GPS location display  
✅ **Collection Schedules** - View and manage schedules  
✅ **Notifications** - Unread count, mark as read  
✅ **Input Validation** - Zod schema validation  
✅ **Error Handling** - Centralized error middleware  
✅ **CORS Support** - Cross-origin requests enabled  
✅ **Shared Database** - Same gtrash.db as Resident & GarbageTruck  

---

## 📊 Data Flow

### Reports
1. **Resident App** - Submits report → `reports` table
2. **Officials App** - Views/filters reports → Updates status
3. **Both see same data** - Single `reports` table

### Truck Tracking
1. **GarbageTruck App** - Updates GPS location → `truck_locations` table
2. **Officials App** - Displays trucks on map
3. **Real-time sync** - Same database

### Analytics
1. **Officials App** - Queries multiple tables for dashboard stats
2. **Aggregates data** from reports, schedules, trucks, pollution
3. **Real-time metrics** - All from shared database

---

## ✅ Integration Checklist

- [x] Backend directory structure created
- [x] Database connection to shared gtrash.db
- [x] Seed data for official users
- [x] Auth controller with JWT
- [x] Reports controller
- [x] Analytics controller
- [x] Shared controller (schedules, trucks, notifications)
- [x] Routes with auth middleware
- [x] Frontend API services (5 files)
- [x] AuthContext updated to use real backend
- [x] Environment variables configured
- [x] CORS enabled
- [x] Error handling middleware

---

## 🛠️ Troubleshooting

### Backend won't start
```bash
# Check if port 3003 is available
netstat -ano | findstr :3003

# Kill process if needed
taskkill /F /PID <PID>
```

### Database not found
- **Start Resident backend first** - It creates the schema
- Check `.env` has correct path in `backend/database/db.js`

### Auth errors
- Clear localStorage: Open browser DevTools → Application → Local Storage → Clear
- Restart Officials backend

### CORS errors
- Ensure backend `app.js` has `app.use(cors())`
- Check frontend API URL matches `.env`

---

## 🎯 Next Steps (Optional Enhancements)

- [ ] Add real-time WebSocket updates for truck locations
- [ ] Implement data export (CSV/PDF reports)
- [ ] Add barangay-specific filtering (officials only see their barangay)
- [ ] Implement push notifications for high-priority reports
- [ ] Add interactive map for route visualization
- [ ] Implement performance metrics for collectors
- [ ] Add bug report management system

---

## ✅ Integration Complete!

The Officials app now has a **fully functional backend** with:
- ✅ Real authentication (JWT + bcrypt)
- ✅ Shared database with Resident & GarbageTruck
- ✅ Reports management with status updates
- ✅ Analytics dashboard with real metrics
- ✅ Truck tracking and schedule management
- ✅ Notification system
- ✅ Same architecture as other apps

**All three apps now share one database and work seamlessly together!** 🚀
