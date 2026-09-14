import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import http from 'http';
import { Server } from 'socket.io';

import { PORT, CLIENT_URL, MONGO_URI } from './config/env.js';
import { ensureAdmin } from './services/bootstrap.js';
import { Message } from './models/index.js';
import { createConversationId } from './controllers/chatController.js';

import authRoutes from './routes/auth.js';
import propertyRoutes from './routes/properties.js';
import favoriteRoutes from './routes/favorites.js';
import applicationRoutes from './routes/applications.js';
import matchRoutes from './routes/matches.js';
import chatRoutes from './routes/chat.js';
import adminRoutes from './routes/admin.js';

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: CLIENT_URL,
    methods: ['GET', 'POST'],
  },
});

app.use(cors({ origin: CLIENT_URL }));
app.use(express.json({ limit: '1mb' }));

// Root route
app.get('/', (req, res) => {
  res.json({
    ok: true,
    service: 'roommate-pro-api',
    message: 'RoomMate Pro API is running.',
    health: '/api/health',
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    service: 'roommate-pro-api',
    time: new Date().toISOString(),
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/admin', adminRoutes);

io.on('connection', (socket) => {
  socket.on('join', (conversationId) => {
    if (conversationId) {
      socket.join(conversationId);
    }
  });

  socket.on('sendMessage', async (payload, acknowledge) => {
    try {
      const conversationId = String(payload.conversationId || '');
      const text = String(payload.text || '').trim();

      if (!conversationId || !text) {
        return;
      }

      const message = await Message.create({
        conversationId,
        sender: payload.sender,
        receiver: payload.receiver,
        text: text.slice(0, 2000),
      });

      io.to(conversationId).emit('message', message);
      acknowledge?.(message);
    } catch (error) {
      acknowledge?.({ error: error.message });
    }
  });
});

async function startServer() {
  await mongoose.connect(MONGO_URI);
  await ensureAdmin();

  server.listen(PORT, () => {
    console.log(
      `RoomMate Pro API running on http://localhost:${PORT}`
    );
  });
}

startServer().catch((error) => {
  console.error(error);
  process.exit(1);
});