import CartItem from '../models/CartItem.js';
import Coupon from '../models/Coupon.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { asyncHandler } from '../middleware/errorMiddleware.js';

const calculateDiscount = async (couponCode, subtotal) => {
  if (!couponCode) return 0;

  const coupon = await Coupon.findOne({
    code: String(couponCode).toUpperCase(),
    active: true,
  });

  if (!coupon) return 0;
  if (coupon.expiresAt && coupon.expiresAt < new Date()) return 0;
  if (subtotal < coupon.minOrderAmount) return 0;

  const discount = coupon.discountType === 'percent' ? subtotal * (coupon.value / 100) : coupon.value;
  return Math.min(discount, subtotal);
};

const buildOrderItemsFromCart = async (userId) => {
  const cartItems = await CartItem.find({ userId }).populate('productId');

  return cartItems
    .filter((item) => item.productId)
    .map((item) => ({
      product: item.productId._id,
      title: item.productId.title,
      image: item.productId.images?.[0] || '',
      price: item.productId.discountPrice || item.productId.price,
      quantity: item.quantity,
      seller: item.productId.seller,
      stock: item.productId.stock,
    }));
};

const reduceStock = async (items) => {
  await Promise.all(
    items.map((item) =>
      Product.updateOne(
        { _id: item.product, stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity, popularity: item.quantity } },
      ),
    ),
  );
};

export const createOrder = asyncHandler(async (req, res) => {
  const { shippingAddress, paymentMethod, couponCode } = req.body;
  const orderItems = await buildOrderItemsFromCart(req.user._id);

  if (!shippingAddress?.street || !shippingAddress?.city || !shippingAddress?.postalCode) {
    res.status(400);
    throw new Error('A complete shipping address is required.');
  }

  if (!orderItems.length) {
    res.status(400);
    throw new Error('Your cart is empty.');
  }

  const unavailableItem = orderItems.find((item) => item.quantity > item.stock);
  if (unavailableItem) {
    res.status(400);
    throw new Error(`${unavailableItem.title} does not have enough stock.`);
  }

  const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingPrice = subtotal >= 75 ? 0 : 8.99;
  const discount = await calculateDiscount(couponCode, subtotal);
  const totalPrice = Math.max(subtotal + shippingPrice - discount, 0);

  const order = await Order.create({
    userId: req.user._id,
    orderItems,
    shippingAddress,
    paymentMethod,
    subtotal,
    shippingPrice,
    discount,
    totalPrice,
  });

  await reduceStock(orderItems);
  await CartItem.deleteMany({ userId: req.user._id });

  res.status(201).json(order);
});

export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
});

export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('userId', 'name email');

  if (!order) {
    res.status(404);
    throw new Error('Order not found.');
  }

  if (String(order.userId._id) !== String(req.user._id) && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('You cannot view this order.');
  }

  res.json(order);
});

export const getOrders = asyncHandler(async (req, res) => {
  const filter = req.query.status ? { status: req.query.status } : {};
  const orders = await Order.find(filter).populate('userId', 'name email').sort({ createdAt: -1 });
  res.json(orders);
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found.');
  }

  order.status = req.body.status || order.status;
  await order.save();

  res.json(order);
});
