import { Router } from 'express';
import {
  getReports,
  getReport,
  updateReportStatus,
  verifyReport,
  getReportStats,
} from '../controllers/reports.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', authMiddleware, getReports);
router.get('/stats/summary', authMiddleware, getReportStats);
router.get('/:id', authMiddleware, getReport);
router.put('/:id/status', authMiddleware, updateReportStatus);
router.post('/:id/verify', authMiddleware, verifyReport);

export default router;
