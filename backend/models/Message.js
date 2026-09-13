import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: String,
      index: true,
    },

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },

    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },

    text: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

export const Message = mongoose.model('Message', messageSchema);
