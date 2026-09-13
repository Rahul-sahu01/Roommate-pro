import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    tenant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: true,
    },

    message: String,

    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

applicationSchema.index(
  { tenant: 1, property: 1 },
  { unique: true }
);

export const Application = mongoose.model(
  'Application',
  applicationSchema
);
