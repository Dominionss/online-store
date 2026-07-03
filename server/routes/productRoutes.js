import express from 'express';
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  getProductsByCategory,
  searchProducts,
  updateProduct,
} from '../controllers/productController.js';
import { createReview, getProductReviews } from '../controllers/reviewController.js';
import { adminOnly } from '../middleware/adminMiddleware.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/search', searchProducts);
router.get('/category/:categoryId', getProductsByCategory);
router.post('/', protect, adminOnly, createProduct);
router.get('/:id', getProductById);
router.put('/:id', protect, adminOnly, updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);
router.get('/:id/reviews', getProductReviews);
router.post('/:id/reviews', protect, createReview);

export default router;
