import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ['tenant', 'owner', 'admin'],
      default: 'tenant',
    },

    phone: String,
    bio: String,
    avatar: String,

    verified: {
      type: Boolean,
      default: false,
    },

    preferences: {
      budget: Number,
      city: String,
      smoking: String,
      sleep: String,
      food: String,
    },
  },
  { timestamps: true }
);

export const User = mongoose.model('User', userSchema);
