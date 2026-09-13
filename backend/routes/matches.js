import express from 'express';
import { auth, role } from '../middleware/auth.js';
import { findMatches } from '../controllers/matchController.js';

const router = express.Router();

router.post('/', auth, role('tenant'), findMatches);

export default router;
