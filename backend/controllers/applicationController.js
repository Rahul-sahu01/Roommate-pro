import { Application, Property } from '../models/index.js';
import { validObjectId } from '../middleware/auth.js';

export async function createApplication(req, res) {
  try {
    const { property, message = '' } = req.body;

    if (!validObjectId(property)) {
      return res.status(400).json({ error: 'Property not found.' });
    }

    const listing = await Property.findOne({
      _id: property,
      status: 'approved',
    });

    if (!listing) {
      return res.status(404).json({
        error: 'This property is no longer available.',
      });
    }

    const existingApplication = await Application.findOne({
      tenant: req.user._id,
      property,
    });

    if (existingApplication) {
      return res.status(409).json({
        error: 'You have already applied to this property.',
      });
    }

    const application = await Application.create({
      tenant: req.user._id,
      property,
      message,
    });

    return res.status(201).json(application);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

export async function getApplications(req, res) {
  let filter = {};

  if (req.user.role === 'tenant') {
    filter.tenant = req.user._id;
  } else if (req.user.role === 'owner') {
    const propertyIds = await Property.find({
      owner: req.user._id,
    }).distinct('_id');

    filter.property = { $in: propertyIds };
  } else if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Not allowed' });
  }

  const applications = await Application.find(filter)
    .populate('tenant', 'name email phone')
    .populate('property', 'title city locality rent images owner')
    .sort({ createdAt: -1 });

  return res.json(applications);
}

export async function updateApplication(req, res) {
  if (!validObjectId(req.params.id)) {
    return res.status(400).json({ error: 'Invalid application id' });
  }

  const application = await Application.findById(
    req.params.id
  ).populate('property');

  if (!application) {
    return res.status(404).json({ error: 'Application not found' });
  }

  if (
    req.user.role === 'owner' &&
    String(application.property.owner) !== String(req.user._id)
  ) {
    return res.status(403).json({
      error: 'You can only manage applications for your listings.',
    });
  }

  if (!['pending', 'accepted', 'rejected'].includes(req.body.status)) {
    return res.status(400).json({
      error: 'Invalid application status.',
    });
  }

  application.status = req.body.status;
  await application.save();

  return res.json(application);
}
