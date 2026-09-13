import { User, Property, Application } from '../models/index.js';
import { validObjectId } from '../middleware/auth.js';

export async function getStats(req, res) {
  return res.json({
    users: await User.countDocuments(),
    tenants: await User.countDocuments({ role: 'tenant' }),
    owners: await User.countDocuments({ role: 'owner' }),
    properties: await Property.countDocuments(),
    pending: await Property.countDocuments({ status: 'pending' }),
    applications: await Application.countDocuments(),
  });
}

export async function getUsers(req, res) {
  const users = await User.find()
    .select('-password')
    .sort({ createdAt: -1 });

  return res.json(users);
}

export async function deleteUser(req, res) {
  if (String(req.user._id) === String(req.params.id)) {
    return res.status(400).json({
      error: 'You cannot delete your own admin account.',
    });
  }

  if (!validObjectId(req.params.id)) {
    return res.status(400).json({ error: 'Invalid user id' });
  }

  await User.findByIdAndDelete(req.params.id);

  return res.json({ ok: true });
}

export async function getProperties(req, res) {
  const properties = await Property.find()
    .populate('owner', 'name email')
    .sort({ createdAt: -1 });

  return res.json(properties);
}

export async function updatePropertyStatus(req, res) {
  if (!validObjectId(req.params.id)) {
    return res.status(400).json({ error: 'Invalid property id' });
  }

  const allowedStatuses = ['approved', 'pending', 'rejected'];

  if (!allowedStatuses.includes(req.body.status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  const property = await Property.findByIdAndUpdate(
    req.params.id,
    {
      status: req.body.status,
      verified: req.body.status === 'approved',
    },
    { new: true }
  ).populate('owner', 'name email');

  if (!property) {
    return res.status(404).json({ error: 'Property not found' });
  }

  return res.json(property);
}

export async function getApplications(req, res) {
  const applications = await Application.find()
    .populate('tenant', 'name email')
    .populate('property', 'title city')
    .sort({ createdAt: -1 });

  return res.json(applications);
}
