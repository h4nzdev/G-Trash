import { Router } from 'express';
import {
  getNotifications,
  markAsRead,
  getUnreadCount,
} from '../controllers/shared.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', authMiddleware, getNotifications);
router.get('/unread-count', authMiddleware, getUnreadCount);
router.put('/:id/read', authMiddleware, markAsRead);

export default router;
