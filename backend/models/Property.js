import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    description: String,
    city: {
      type: String,
      required: true,
    },
    locality: String,

    rent: {
      type: Number,
      required: true,
    },

    deposit: Number,
    type: {
      type: String,
      required: true,
    },

    furnished: String,
    bedrooms: Number,
    bathrooms: Number,
    area: Number,
    availableFrom: Date,

    amenities: [String],
    images: [String],

    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },

    verified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Property = mongoose.model('Property', propertySchema);
