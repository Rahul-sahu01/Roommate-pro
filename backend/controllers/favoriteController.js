import { Favorite } from '../models/index.js';
import { validObjectId } from '../middleware/auth.js';

export async function getFavorites(req, res) {
  const rows = await Favorite.find({ user: req.user._id })
    .populate({
      path: 'property',
      populate: {
        path: 'owner',
        select: 'name verified',
      },
    })
    .sort({ createdAt: -1 });

  return res.json(rows.map((row) => row.property).filter(Boolean));
}

export async function saveFavorite(req, res) {
  if (!validObjectId(req.params.propertyId)) {
    return res.status(400).json({ error: 'Invalid property id' });
  }

  await Favorite.updateOne(
    {
      user: req.user._id,
      property: req.params.propertyId,
    },
    {
      $setOnInsert: {
        user: req.user._id,
        property: req.params.propertyId,
      },
    },
    { upsert: true }
  );

  return res.json({ saved: true });
}

export async function removeFavorite(req, res) {
  await Favorite.deleteOne({
    user: req.user._id,
    property: req.params.propertyId,
  });

  return res.json({ saved: false });
}
