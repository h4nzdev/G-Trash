import { Router } from 'express';
import {
  login,
  register,
  getCurrentUser,
  updateProfile,
  changePassword,
  logout,
} from '../controllers/auth.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { validate, loginSchema } from '../middleware/validation.middleware.js';

const router = Router();

router.post('/login', validate(loginSchema), login);
router.post('/register', register);
router.get('/me', authMiddleware, getCurrentUser);
router.put('/profile', authMiddleware, updateProfile);
router.put('/password', authMiddleware, changePassword);
router.post('/logout', authMiddleware, logout);
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ success: false, message: 'Refresh token required' });
    }
    res.json({
      success: true,
      data: {
        accessToken: refreshToken,
        refreshToken: refreshToken,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Token refresh failed' });
  }
});

export default router;
