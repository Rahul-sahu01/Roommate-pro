import 'dotenv/config';

export const PORT = Number(process.env.PORT || 5000);
export const MONGO_URI =
  process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/roommate_pro';
export const JWT_SECRET = process.env.JWT_SECRET || 'change-me';
export const CLIENT_URL =
  process.env.CLIENT_URL || 'http://localhost:5173';
