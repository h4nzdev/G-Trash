import { Router } from 'express';
import {
  getDashboardStats,
  getReportsTrend,
  getCollectionEfficiency,
  getUrgencyDistribution,
} from '../controllers/analytics.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/dashboard', authMiddleware, getDashboardStats);
router.get('/reports/trend', authMiddleware, getReportsTrend);
router.get('/collection/efficiency', authMiddleware, getCollectionEfficiency);
router.get('/urgency/distribution', authMiddleware, getUrgencyDistribution);

export default router;
