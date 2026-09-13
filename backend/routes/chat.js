import express from 'express';
import { auth } from '../middleware/auth.js';
import { getConversation } from '../controllers/chatController.js';

const router = express.Router();

router.get('/:peerId', auth, getConversation);

export default router;
