import express from 'express';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getOrders,
  updateOrderStatus,
} from '../controllers/orderController.js';
import { adminOnly } from '../middleware/adminMiddleware.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.post('/', createOrder);
router.get('/my-orders', getMyOrders);
router.get('/', adminOnly, getOrders);
router.get('/:id', getOrderById);
router.put('/:id/status', adminOnly, updateOrderStatus);

export default router;
