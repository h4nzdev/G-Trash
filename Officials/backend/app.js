import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// ============================================
// MIDDLEWARE
// ============================================

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware - MUST be first to catch ALL requests
app.use((req, res, next) => {
  const start = Date.now();
  console.log(`📥 ${req.method} ${req.originalUrl || req.url}`);
  console.log(`📥 Full URL: ${req.protocol}://${req.get('host')}${req.originalUrl}`);
  const bodyPreview = req.body ? JSON.stringify(req.body).substring(0, 100) : 'No body';
  console.log(`📥 Body preview: ${bodyPreview}`);
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`📤 ${req.method} ${req.originalUrl || req.url} ${res.statusCode} ${duration}ms`);
  });
  next();
});

// ============================================
// ROUTES
// ============================================

import authRoutes from './routes/auth.routes.js';
import reportRoutes from './routes/reports.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';
import scheduleRoutes from './routes/schedules.routes.js';
import truckRoutes from './routes/trucks.routes.js';
import notificationRoutes from './routes/notifications.routes.js';

app.use('/api/auth', authRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/schedules', scheduleRoutes);
app.use('/api/trucks', truckRoutes);
app.use('/api/notifications', notificationRoutes);

// ============================================
// DEBUG: Catch-all for unmatched routes
// ============================================
app.use((req, res, next) => {
  console.log(`⚠️ No route matched: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ success: false, message: `Route not found: ${req.originalUrl}` });
});

// ============================================
// HEALTH CHECK
// ============================================

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'G-TRASH Officials API is running' });
});

// ============================================
// ERROR HANDLING
// ============================================

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

export default app;
