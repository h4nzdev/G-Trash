import { verifyToken } from '../utils/jwt.utils.js';
import { formatError } from '../utils/response.utils.js';

export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json(formatError('Access token required'));
  }

  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(401).json(formatError('Invalid or expired token'));
  }

  req.user = decoded;
  next();
}

export function adminOnly(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json(formatError('Admin access required'));
  }
  next();
}
