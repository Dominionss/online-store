import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import { asyncHandler } from '../middleware/errorMiddleware.js';

export const getDashboardStats = asyncHandler(async (req, res) => {
  const [totalUsers, totalProducts, totalOrders, sales] = await Promise.all([
    User.countDocuments(),
    Product.countDocuments(),
    Order.countDocuments(),
    Order.aggregate([{ $group: { _id: null, totalSales: { $sum: '$totalPrice' } } }]),
  ]);

  res.json({
    totalUsers,
    totalProducts,
    totalOrders,
    totalSales: sales[0]?.totalSales || 0,
  });
});

export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  res.json(users);
});

export const updateUserRole = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found.');
  }

  user.role = req.body.role || user.role;
  await user.save();
  res.json(user);
});

export const deleteUser = asyncHandler(async (req, res) => {
  if (String(req.params.id) === String(req.user._id)) {
    res.status(400);
    throw new Error('You cannot delete your own admin account.');
  }

  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found.');
  }

  res.json({ message: 'User deleted successfully.' });
});
