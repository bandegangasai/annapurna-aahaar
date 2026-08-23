import { Router } from 'express';
import {
  loginAdmin,
  getOrders,
  getOrderById,
  updateOrderStatus,
  getAdminStats,
  getContactMessages,
  markContactMessageRead,
  adminGetProducts,
} from '../controllers/adminController';
import { authenticateAdmin } from '../middleware/auth';

const router = Router();

// Public auth route
router.post('/login', loginAdmin);

// Protected Admin Routes
router.use(authenticateAdmin as any);

router.get('/stats', getAdminStats as any);
router.get('/orders', getOrders as any);
router.get('/orders/:id', getOrderById as any);
router.patch('/orders/:id/status', updateOrderStatus as any);
router.get('/contact-messages', getContactMessages as any);
router.patch('/contact-messages/:id/read', markContactMessageRead as any);
router.get('/products', adminGetProducts as any);

export default router;
