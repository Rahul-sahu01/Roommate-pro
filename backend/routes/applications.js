import express from 'express';
import { auth, role } from '../middleware/auth.js';
import {
  createApplication,
  getApplications,
  updateApplication,
} from '../controllers/applicationController.js';

const router = express.Router();

router.post('/', auth, role('tenant'), createApplication);
router.get('/', auth, getApplications);
router.put('/:id', auth, role('owner', 'admin'), updateApplication);

export default router;
