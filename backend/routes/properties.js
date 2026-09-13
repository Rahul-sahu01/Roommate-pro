import express from 'express';
import { auth, role } from '../middleware/auth.js';
import {
  getOwnerProperties,
  searchProperties,
  getPropertyById,
  createProperty,
} from '../controllers/propertyController.js';

const router = express.Router();

router.get(
  '/owner/properties',
  auth,
  role('owner', 'admin'),
  getOwnerProperties
);

router.get(
  '/owner/list',
  auth,
  role('owner', 'admin'),
  getOwnerProperties
);

router.get('/', searchProperties);

router.get('/:id', getPropertyById);

router.post('/', auth, role('owner'), createProperty);

export default router;
