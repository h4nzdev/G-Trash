import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Basic routes (placeholders - would be expanded with full controllers)
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'G-TRASH Admin API is running' });
});

// For brevity in this turn, I'm defining the main API structure.
// In a real scenario, these would be in separate route files.
app.get('/api/admin/dashboard-stats', (req, res) => {
  // Mock response for quick setup
  res.json({
    success: true,
    data: {
      totalUsers: 1250,
      activeTrucks: 8,
      pendingReports: 42,
      systemHealth: 'Optimal'
    }
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal Server Error' });
});

export default app;
