import { Property } from '../models/index.js';
import { validObjectId } from '../middleware/auth.js';

export async function getOwnerProperties(req, res) {
  const filter =
    req.user.role === 'admin' ? {} : { owner: req.user._id };

  const properties = await Property.find(filter).sort({
    createdAt: -1,
  });

  return res.json(properties);
}

export async function searchProperties(req, res) {
  try {
    const {
      q = '',
      city = '',
      min = '',
      max = '',
      type = '',
      furnished = '',
      amenity = '',
      sort = 'newest',
      limit = '30',
    } = req.query;

    const filter = { status: 'approved' };
    const queryParts = [q, city].filter(Boolean);

    if (queryParts.length) {
      filter.$or = queryParts.flatMap((value) => [
        { title: new RegExp(String(value), 'i') },
        { city: new RegExp(String(value), 'i') },
        { locality: new RegExp(String(value), 'i') },
        { description: new RegExp(String(value), 'i') },
      ]);
    }

    if (min) {
      filter.rent = {
        ...(filter.rent || {}),
        $gte: Number(min),
      };
    }

    if (max) {
      filter.rent = {
        ...(filter.rent || {}),
        $lte: Number(max),
      };
    }

    if (type) filter.type = type;
    if (furnished) filter.furnished = furnished;
    if (amenity) filter.amenities = String(amenity);

    let query = Property.find(filter).populate(
      'owner',
      'name verified'
    );

    if (sort === 'rentLow') {
      query = query.sort({ rent: 1 });
    } else if (sort === 'rentHigh') {
      query = query.sort({ rent: -1 });
    } else {
      query = query.sort({ createdAt: -1 });
    }

    const safeLimit = Math.min(Number(limit) || 30, 60);
    const properties = await query.limit(safeLimit);

    return res.json(properties);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

export async function getPropertyById(req, res) {
  if (!validObjectId(req.params.id)) {
    return res.status(400).json({ error: 'Invalid property id' });
  }

  const property = await Property.findOne({
    _id: req.params.id,
    status: 'approved',
  }).populate('owner', 'name email verified bio');

  if (!property) {
    return res.status(404).json({ error: 'Property not found' });
  }

  return res.json(property);
}

export async function createProperty(req, res) {
  try {
    const { title, city, rent, type } = req.body;

    if (!title?.trim() || !city?.trim() || !rent || !type) {
      return res.status(400).json({
        error: 'Title, city, rent and property type are required.',
      });
    }

    const images = Array.isArray(req.body.images)
      ? req.body.images.filter(Boolean).slice(0, 8)
      : [];

    const property = await Property.create({
      ...req.body,
      owner: req.user._id,
      status: 'pending',
      verified: false,
      images,
    });

    return res.status(201).json(property);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}
