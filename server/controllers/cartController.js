import CartItem from '../models/CartItem.js';
import Product from '../models/Product.js';
import { asyncHandler } from '../middleware/errorMiddleware.js';

const getPopulatedCart = (userId) =>
  CartItem.find({ userId }).populate({
    path: 'productId',
    populate: [
      { path: 'category', select: 'name' },
      { path: 'seller', select: 'name' },
    ],
  });

export const getCart = asyncHandler(async (req, res) => {
  const items = await getPopulatedCart(req.user._id);
  res.json(items);
});

export const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  const product = await Product.findById(productId);

  if (!product) {
    res.status(404);
    throw new Error('Product not found.');
  }

  if (product.stock < quantity) {
    res.status(400);
    throw new Error('Requested quantity is not available.');
  }

  const item = await CartItem.findOne({ userId: req.user._id, productId });

  if (item) {
    item.quantity = Math.min(item.quantity + Number(quantity), product.stock);
    await item.save();
  } else {
    await CartItem.create({ userId: req.user._id, productId, quantity });
  }

  res.status(201).json(await getPopulatedCart(req.user._id));
});

export const updateCartItem = asyncHandler(async (req, res) => {
  const item = await CartItem.findOne({ _id: req.params.itemId, userId: req.user._id });

  if (!item) {
    res.status(404);
    throw new Error('Cart item not found.');
  }

  item.quantity = Math.max(Number(req.body.quantity) || 1, 1);
  await item.save();

  res.json(await getPopulatedCart(req.user._id));
});

export const deleteCartItem = asyncHandler(async (req, res) => {
  await CartItem.deleteOne({ _id: req.params.itemId, userId: req.user._id });
  res.json(await getPopulatedCart(req.user._id));
});

export const clearCart = asyncHandler(async (req, res) => {
  await CartItem.deleteMany({ userId: req.user._id });
  res.json({ message: 'Cart cleared.' });
});
