import express from 'express';
import {
  addToCart,
  clearCart,
  deleteCartItem,
  getCart,
  updateCartItem,
} from '../controllers/cartController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.get('/', getCart);
router.post('/', addToCart);
router.put('/:itemId', updateCartItem);
router.delete('/:itemId', deleteCartItem);
router.delete('/', clearCart);

export default router;
