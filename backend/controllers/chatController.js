import { User, Message } from '../models/index.js';
import { validObjectId } from '../middleware/auth.js';

export async function getConversation(req, res) {
  if (!validObjectId(req.params.peerId)) {
    return res.status(400).json({ error: 'Invalid member id' });
  }

  const peer = await User.findById(req.params.peerId).select(
    'name email role verified'
  );

  if (!peer) {
    return res.status(404).json({ error: 'Member not found' });
  }

  const conversationId = createConversationId(
    req.user._id,
    peer._id
  );

  const messages = await Message.find({ conversationId })
    .sort({ createdAt: 1 })
    .limit(200);

  return res.json({ peer, messages });
}

export function createConversationId(firstUserId, secondUserId) {
  return [String(firstUserId), String(secondUserId)]
    .sort()
    .join(':');
}
