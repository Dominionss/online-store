import express from 'express';
import {
  deleteUser,
  getDashboardStats,
  getUsers,
  updateUserRole,
} from '../controllers/adminController.js';
import { adminOnly } from '../middleware/adminMiddleware.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect, adminOnly);
router.get('/dashboard', getDashboardStats);
router.get('/users', getUsers);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);

export default router;
