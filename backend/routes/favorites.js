import express from 'express';
import { auth, role } from '../middleware/auth.js';
import {
  getFavorites,
  saveFavorite,
  removeFavorite,
} from '../controllers/favoriteController.js';

const router = express.Router();

router.get('/', auth, getFavorites);
router.post('/:propertyId', auth, role('tenant'), saveFavorite);
router.delete('/:propertyId', auth, removeFavorite);

export default router;
