import bcrypt from 'bcryptjs';
import { User } from '../models/index.js';

export async function ensureAdmin() {
  const email = (
    process.env.ADMIN_EMAIL || 'admin@roommate.local'
  ).toLowerCase();

  const existingAdmin = await User.findOne({ email });

  if (existingAdmin) {
    return;
  }

  const password = await bcrypt.hash(
    process.env.ADMIN_PASSWORD || 'Admin@12345',
    12
  );

  await User.create({
    name: 'Platform Admin',
    email,
    password,
    role: 'admin',
    verified: true,
  });
}
