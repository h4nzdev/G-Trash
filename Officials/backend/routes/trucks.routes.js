import { Router } from 'express';
import { getTruckLocations, getTruckRoutes } from '../controllers/shared.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/locations', authMiddleware, getTruckLocations);
router.get('/routes', authMiddleware, getTruckRoutes);

export default router;
