import bcrypt from 'bcryptjs';
import { User, Favorite } from '../models/index.js';
import { safeUser } from '../utils/user.js';
import { tokenFor } from '../utils/auth.js';

export async function register(req, res) {
  try {
    const {
      name,
      email,
      password,
      role: requestedRole = 'tenant',
    } = req.body;

    if (
      !name?.trim() ||
      !email?.trim() ||
      !password ||
      password.length < 6
    ) {
      return res.status(400).json({
        error: 'Name, email and a password of at least 6 characters are required.',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(409).json({
        error: 'An account with this email already exists.',
      });
    }

    const role = requestedRole === 'owner' ? 'owner' : 'tenant';
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role,
    });

    return res.status(201).json({
      token: tokenFor(user),
      user: safeUser(user),
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

export async function login(req, res) {
  try {
    const email = String(req.body.email || '').toLowerCase().trim();
    const password = String(req.body.password || '');

    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        error: 'Invalid email or password.',
      });
    }

    return res.json({
      token: tokenFor(user),
      user: safeUser(user),
    });
  } catch {
    return res.status(500).json({ error: 'Login failed.' });
  }
}

export async function getMe(req, res) {
  const favoriteCount = await Favorite.countDocuments({
    user: req.user._id,
  });

  return res.json({
    user: {
      ...safeUser(req.user),
      favoriteCount,
    },
  });
}

export async function updateMe(req, res) {
  try {
    const allowedFields = ['name', 'phone', 'bio', 'avatar'];

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        req.user[field] = String(req.body[field]).trim();
      }
    }

    if (req.body.preferences) {
      req.user.preferences = {
        ...req.user.preferences?.toObject?.(),
        ...req.body.preferences,
      };
    }

    await req.user.save();

    const favoriteCount = await Favorite.countDocuments({
      user: req.user._id,
    });

    return res.json({
      user: {
        ...safeUser(req.user),
        favoriteCount,
      },
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}
