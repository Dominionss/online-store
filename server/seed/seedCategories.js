import dotenv from 'dotenv';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import connectDB from '../config/db.js';
import Category from '../models/Category.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, '../.env') });

const defaultCategories = [
  {
    name: 'Electronics',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80',
    description: 'Smart devices, headphones, cameras, and everyday tech.',
  },
  {
    name: 'Fashion',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80',
    description: 'Clothing, shoes, bags, and accessories from global sellers.',
  },
  {
    name: 'Home',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=900&q=80',
    description: 'Useful home goods, decor, kitchen tools, and storage.',
  },
  {
    name: 'Sports',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=900&q=80',
    description: 'Fitness gear, outdoor essentials, and active lifestyle products.',
  },
  {
    name: 'Beauty',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=900&q=80',
    description: 'Skin care, fragrance, grooming, and wellness favorites.',
  },
  {
    name: 'Toys',
    image: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=900&q=80',
    description: 'Creative toys, learning kits, collectibles, and gifts.',
  },
];

const seedCategories = async () => {
  await connectDB();

  await Promise.all(
    defaultCategories.map((category) =>
      Category.findOneAndUpdate({ name: category.name }, category, {
        returnDocument: 'after',
        upsert: true,
        runValidators: true,
      }),
    ),
  );

  console.log(`Default categories ready: ${defaultCategories.map((category) => category.name).join(', ')}`);
  process.exit(0);
};

seedCategories().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
