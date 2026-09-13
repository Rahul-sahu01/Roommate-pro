import express from 'express';
import { auth } from '../middleware/auth.js';
import {
  register,
  login,
  getMe,
  updateMe,
} from '../controllers/authController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', auth, getMe);
router.put('/me', auth, updateMe);

export default router;
