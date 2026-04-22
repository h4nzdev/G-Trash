import { Router } from 'express';
import { getSchedules, updateSchedule } from '../controllers/shared.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', authMiddleware, getSchedules);
router.put('/:id', authMiddleware, updateSchedule);

export default router;
