import Product from '../models/Product.js';
import Review from '../models/Review.js';
import { asyncHandler } from '../middleware/errorMiddleware.js';

const refreshProductRating = async (productId) => {
  const stats = await Review.aggregate([
    { $match: { productId } },
    {
      $group: {
        _id: '$productId',
        rating: { $avg: '$rating' },
        numReviews: { $sum: 1 },
      },
    },
  ]);

  await Product.findByIdAndUpdate(productId, {
    rating: stats[0]?.rating || 0,
    numReviews: stats[0]?.numReviews || 0,
  });
};

export const getProductReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ productId: req.params.id })
    .populate('userId', 'name')
    .sort({ createdAt: -1 });

  res.json(reviews);
});

export const createReview = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found.');
  }

  const existingReview = await Review.findOne({
    productId: product._id,
    userId: req.user._id,
  });

  if (existingReview) {
    res.status(409);
    throw new Error('You already reviewed this product.');
  }

  const review = await Review.create({
    productId: product._id,
    userId: req.user._id,
    rating: req.body.rating,
    comment: req.body.comment,
  });

  await refreshProductRating(product._id);
  res.status(201).json(await review.populate('userId', 'name'));
});

export const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    res.status(404);
    throw new Error('Review not found.');
  }

  if (String(review.userId) !== String(req.user._id) && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('You cannot delete this review.');
  }

  const productId = review.productId;
  await review.deleteOne();
  await refreshProductRating(productId);

  res.json({ message: 'Review deleted successfully.' });
});
