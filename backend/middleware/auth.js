import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env.js';
import { User } from '../models/index.js';

export async function auth(req, res, next) {
  try {
    const rawHeader = req.headers.authorization || '';
    const token = rawHeader.startsWith('Bearer ')
      ? rawHeader.slice(7)
      : '';

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      throw new Error('User not found');
    }

    req.user = user;
    next();
  } catch {
    res.status(401).json({
      error: 'Your session has expired. Please log in again.',
    });
  }
}

export function role(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: `This action requires ${roles.join(' or ')} account.`,
      });
    }

    next();
  };
}

export function validObjectId(id) {
  return /^[a-fA-F0-9]{24}$/.test(String(id));
}
