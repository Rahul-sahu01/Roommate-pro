import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { MONGO_URI } from './config/env.js';
import { User, Property } from './models/index.js';

async function seedDatabase() {
  await mongoose.connect(MONGO_URI);

  const demoPassword = await bcrypt.hash('Demo@12345', 12);

  await createDemoOwner(demoPassword);
  await createDemoTenants(demoPassword);
  await createDemoProperties();

  console.log('Seed completed.');
  await mongoose.disconnect();
}

async function createDemoOwner(password) {
  await User.updateOne(
    { email: 'demo.owner@roommate.local' },
    {
      $setOnInsert: {
        name: 'Demo Owner',
        email: 'demo.owner@roommate.local',
        password,
        role: 'owner',
        verified: true,
      },
    },
    { upsert: true }
  );
}

async function createDemoTenants(password) {
  const tenants = [
    {
      name: 'Aman Demo',
      email: 'aman.demo@roommate.local',
      budget: 12000,
      city: 'Delhi',
    },
    {
      name: 'Priya Demo',
      email: 'priya.demo@roommate.local',
      budget: 14000,
      city: 'Delhi',
    },
    {
      name: 'Arjun Demo',
      email: 'arjun.demo@roommate.local',
      budget: 15000,
      city: 'Noida',
    },
  ];

  for (const tenant of tenants) {
    await User.updateOne(
      { email: tenant.email },
      {
        $setOnInsert: {
          name: tenant.name,
          email: tenant.email,
          password,
          role: 'tenant',
          verified: true,
          preferences: {
            budget: tenant.budget,
            city: tenant.city,
            smoking: 'No',
            sleep: 'Normal',
            food: 'Any',
          },
        },
      },
      { upsert: true }
    );
  }
}

async function createDemoProperties() {
  const owner = await User.findOne({
    email: 'demo.owner@roommate.local',
  });

  const existingCount = await Property.countDocuments({
    owner: owner._id,
  });

  if (existingCount) {
    return;
  }

  await Property.create([
    {
      owner: owner._id,
      title: 'Modern 2BHK near Metro',
      description: 'Fully furnished home with strong connectivity.',
      city: 'Noida',
      locality: 'Sector 62',
      rent: 18500,
      deposit: 30000,
      type: '2BHK',
      furnished: 'Furnished',
      bedrooms: 2,
      bathrooms: 2,
      area: 1100,
      amenities: ['WiFi', 'Power Backup', 'Parking'],
      status: 'approved',
      verified: true,
      images: [
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      ],
    },
    {
      owner: owner._id,
      title: 'Cozy PG for Working Professionals',
      description: 'Clean PG with meals and housekeeping.',
      city: 'Delhi',
      locality: 'Dwarka',
      rent: 9000,
      deposit: 9000,
      type: 'PG',
      furnished: 'Furnished',
      bedrooms: 1,
      bathrooms: 1,
      area: 350,
      amenities: ['WiFi', 'Food', 'Housekeeping'],
      status: 'approved',
      verified: true,
      images: [
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
      ],
    },
  ]);
}

seedDatabase().catch((error) => {
  console.error(error);
  process.exit(1);
});
