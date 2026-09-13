import express from 'express';
import { auth, role } from '../middleware/auth.js';
import {
  getStats,
  getUsers,
  deleteUser,
  getProperties,
  updatePropertyStatus,
  getApplications,
} from '../controllers/adminController.js';

const router = express.Router();

router.get('/stats', auth, role('admin'), getStats);
router.get('/users', auth, role('admin'), getUsers);
router.delete('/users/:id', auth, role('admin'), deleteUser);
router.get('/properties', auth, role('admin'), getProperties);
router.put(
  '/properties/:id/status',
  auth,
  role('admin'),
  updatePropertyStatus
);
router.get('/applications', auth, role('admin'), getApplications);

export default router;
