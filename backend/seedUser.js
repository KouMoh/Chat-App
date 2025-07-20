import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

import mongoose from 'mongoose';
import User from './models/user.model.js';

async function seedUser() {
  await mongoose.connect(process.env.MONGODB_URI);

  const user = new User({
    fullName: 'Test User',
    username: 'testuser',
    password: 'password123', // You may want to hash this in production
    gender: 'male',
  });

  await user.save();
  console.log('Seeded user:', user);
  await mongoose.disconnect();
}

seedUser().catch(console.error);
