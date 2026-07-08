import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import connectDB from '../config/db.js';
import User from '../models/User.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, '../.env') });

const email = process.env.ADMIN_EMAIL || 'admin@example.com';
const password = process.env.ADMIN_PASSWORD || 'password123';
const name = process.env.ADMIN_NAME || 'Admin User';

const createAdmin = async () => {
  await connectDB();

  const existingAdmin = await User.findOne({ email }).select('+password');

  if (existingAdmin) {
    existingAdmin.name = existingAdmin.name || name;
    existingAdmin.role = 'admin';
    existingAdmin.password = password;
    await existingAdmin.save();
    console.log(`Admin updated: ${email}`);
  } else {
    await User.create({
      name,
      email,
      password,
      role: 'admin',
    });
    console.log(`Admin created: ${email}`);
  }

  console.log(`Password: ${password}`);
  process.exit(0);
};

createAdmin().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
