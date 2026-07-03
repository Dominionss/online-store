import WishlistItem from '../models/WishlistItem.js';
import Product from '../models/Product.js';
import { asyncHandler } from '../middleware/errorMiddleware.js';

const getWishlist = (userId) =>
  WishlistItem.find({ userId }).populate({
    path: 'productId',
    populate: [
      { path: 'category', select: 'name' },
      { path: 'seller', select: 'name' },
    ],
  });

export const getWishlistItems = asyncHandler(async (req, res) => {
  res.json(await getWishlist(req.user._id));
});

export const addToWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  const product = await Product.findById(productId);

  if (!product) {
    res.status(404);
    throw new Error('Product not found.');
  }

  await WishlistItem.findOneAndUpdate(
    { userId: req.user._id, productId },
    { userId: req.user._id, productId },
    { upsert: true, new: true },
  );

  res.status(201).json(await getWishlist(req.user._id));
});

export const removeFromWishlist = asyncHandler(async (req, res) => {
  await WishlistItem.deleteOne({ userId: req.user._id, productId: req.params.productId });
  res.json(await getWishlist(req.user._id));
});
