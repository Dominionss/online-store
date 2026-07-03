import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import CartItem from '../models/CartItem.js';
import Category from '../models/Category.js';
import Coupon from '../models/Coupon.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Review from '../models/Review.js';
import User from '../models/User.js';
import WishlistItem from '../models/WishlistItem.js';

dotenv.config({ path: './server/.env' });

const images = {
  electronics:
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80',
  fashion:
    'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80',
  home:
    'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=900&q=80',
  sport:
    'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=900&q=80',
  beauty:
    'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=900&q=80',
  toys:
    'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=900&q=80',
};

const categories = [
  {
    name: 'Electronics',
    image: images.electronics,
    description: 'Smart devices, headphones, cameras, and everyday tech.',
  },
  {
    name: 'Fashion',
    image: images.fashion,
    description: 'Clothing, shoes, bags, and accessories from global sellers.',
  },
  {
    name: 'Home',
    image: images.home,
    description: 'Useful home goods, decor, kitchen tools, and storage.',
  },
  {
    name: 'Sports',
    image: images.sport,
    description: 'Fitness gear, outdoor essentials, and active lifestyle products.',
  },
  {
    name: 'Beauty',
    image: images.beauty,
    description: 'Skin care, fragrance, grooming, and wellness favorites.',
  },
  {
    name: 'Toys',
    image: images.toys,
    description: 'Creative toys, learning kits, collectibles, and gifts.',
  },
];

const productTemplates = [
  ['NovaSound ANC Headphones', 'Electronics', 'NovaTech', 129.99, 89.99, 44, images.electronics],
  ['PulseFit Smart Watch', 'Electronics', 'PulseFit', 179.99, 139.99, 36, images.electronics],
  ['CloudTab Mini Tablet', 'Electronics', 'CloudTab', 249.99, 219.99, 28, images.electronics],
  ['AeroPack Travel Backpack', 'Fashion', 'AeroPack', 74.99, 49.99, 82, images.fashion],
  ['Everyday Knit Sneakers', 'Fashion', 'UrbanStep', 64.99, 52.99, 120, images.fashion],
  ['Minimal Crossbody Bag', 'Fashion', 'StudioLine', 59.99, 39.99, 64, images.fashion],
  ['Ceramic Cookware Set', 'Home', 'Homely', 119.99, 91.99, 35, images.home],
  ['Modular Desk Organizer', 'Home', 'Deskly', 32.99, 24.99, 150, images.home],
  ['SoftWeave Throw Blanket', 'Home', 'SoftWeave', 45.99, 31.99, 74, images.home],
  ['FlexCore Yoga Mat', 'Sports', 'FlexCore', 39.99, 27.99, 110, images.sport],
  ['TrailLite Hiking Bottle', 'Sports', 'TrailLite', 24.99, 18.99, 210, images.sport],
  ['Adjustable Dumbbell Pair', 'Sports', 'IronWay', 149.99, 119.99, 22, images.sport],
  ['GlowLab Vitamin C Serum', 'Beauty', 'GlowLab', 34.99, 26.99, 90, images.beauty],
  ['PureMist Facial Steamer', 'Beauty', 'PureMist', 68.99, 54.99, 48, images.beauty],
  ['Botanical Grooming Kit', 'Beauty', 'NorthRoot', 44.99, 35.99, 58, images.beauty],
  ['Builder Blocks Mega Box', 'Toys', 'PlayForge', 54.99, 42.99, 70, images.toys],
  ['STEM Robot Starter Kit', 'Toys', 'RoboSprout', 89.99, 69.99, 32, images.toys],
  ['Plush Storytime Set', 'Toys', 'CozyTales', 29.99, 22.99, 96, images.toys],
];

const seed = async () => {
  await connectDB();

  await Promise.all([
    CartItem.deleteMany(),
    WishlistItem.deleteMany(),
    Review.deleteMany(),
    Order.deleteMany(),
    Product.deleteMany(),
    Category.deleteMany(),
    Coupon.deleteMany(),
    User.deleteMany(),
  ]);

  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'password123',
    role: 'admin',
    addresses: [
      {
        fullName: 'Admin User',
        phone: '+1 555 100 2000',
        street: '100 Market Street',
        city: 'Seattle',
        state: 'WA',
        postalCode: '98101',
        country: 'United States',
        isDefault: true,
      },
    ],
  });

  const seller = await User.create({
    name: 'Global Seller Co.',
    email: 'seller@example.com',
    password: 'password123',
    role: 'seller',
  });

  const buyer = await User.create({
    name: 'Demo Buyer',
    email: 'buyer@example.com',
    password: 'password123',
    role: 'user',
  });

  const createdCategories = await Category.insertMany(categories);
  const categoryMap = Object.fromEntries(createdCategories.map((category) => [category.name, category._id]));

  const products = productTemplates.map(([title, categoryName, brand, price, discountPrice, stock, image], index) => ({
    title,
    description:
      'A reliable marketplace pick with fast shipping, clear specifications, and quality checks from trusted sellers.',
    price,
    discountPrice,
    category: categoryMap[categoryName],
    brand,
    stock,
    images: [
      image,
      `${image}&sat=-20`,
      `${image}&blur=10`,
    ],
    rating: 4 + ((index % 5) * 0.2),
    numReviews: 8 + index,
    popularity: 120 - index * 3,
    seller: index % 3 === 0 ? admin._id : seller._id,
    specifications: [
      { name: 'Warranty', value: '12 months' },
      { name: 'Ships From', value: index % 2 === 0 ? 'United States' : 'EU warehouse' },
      { name: 'Return Window', value: '30 days' },
    ],
  }));

  const createdProducts = await Product.insertMany(products);

  await Review.insertMany(
    createdProducts.slice(0, 6).map((product, index) => ({
      userId: buyer._id,
      productId: product._id,
      rating: 5 - (index % 2),
      comment: 'Arrived quickly and matched the description. Solid value for the price.',
    })),
  );

  await Coupon.insertMany([
    {
      code: 'WELCOME10',
      discountType: 'percent',
      value: 10,
      minOrderAmount: 40,
      active: true,
    },
    {
      code: 'FREESHIP',
      discountType: 'fixed',
      value: 8.99,
      minOrderAmount: 25,
      active: true,
    },
  ]);

  console.log('Seed completed.');
  console.log('Admin login: admin@example.com / password123');
  console.log('Buyer login: buyer@example.com / password123');
  process.exit(0);
};

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
