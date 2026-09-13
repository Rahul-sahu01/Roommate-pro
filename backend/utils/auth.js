import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env.js';

export function tokenFor(user) {
  return jwt.sign(
    {
      id: String(user._id),
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}
