import express from 'express';
import {
  addToWishlist,
  getWishlistItems,
  removeFromWishlist,
} from '../controllers/wishlistController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.get('/', getWishlistItems);
router.post('/', addToWishlist);
router.delete('/:productId', removeFromWishlist);

export default router;
