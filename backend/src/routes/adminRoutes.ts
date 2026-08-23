import { Router, Request, Response } from 'express';
import {
  loginAdmin,
  getOrders,
  getOrderById,
  updateOrderStatus,
  getStats,
  getPayments,
  verifyManualPayment,
  getCustomers,
  getReports,
  exportOrdersCsv,
  getCallCenterStats,
  getCalls,
  exportCallsCsv,
  getIvrInteractions,
  exportIvrInteractionsCsv,
  getAuditLogs,
  getContactMessages,
  markContactMessageRead,
  adminGetProducts,
  adminUpdateVariantPrice,
} from '../controllers/adminController';
import { authenticateAdmin } from '../middleware/auth';
import { realtimeService } from '../services/realtime';

const router = Router();

// Public auth route
router.post('/login', loginAdmin);

// Real-Time Server-Sent Events (SSE) Stream
router.get('/events', (req: Request, res: Response) => {
  realtimeService.registerClient(res);
});

// Protected Admin Routes
router.use(authenticateAdmin as any);

router.get('/stats', getStats as any);
router.get('/orders', getOrders as any);
router.get('/orders/export', exportOrdersCsv as any);
router.get('/orders/:id', getOrderById as any);
router.patch('/orders/:id/status', updateOrderStatus as any);

router.get('/payments', getPayments as any);
router.patch('/payments/:id/verify', verifyManualPayment as any);

router.get('/customers', getCustomers as any);
router.get('/reports', getReports as any);
router.get('/audit-logs', getAuditLogs as any);

// Call Center & Telephony Logs
router.get('/call-center/stats', getCallCenterStats as any);
router.get('/calls', getCalls as any);
router.get('/calls/export', exportCallsCsv as any);
router.get('/ivr-interactions', getIvrInteractions as any);
router.get('/ivr-interactions/export', exportIvrInteractionsCsv as any);

router.get('/contact-messages', getContactMessages as any);
router.patch('/contact-messages/:id/read', markContactMessageRead as any);

router.get('/products', adminGetProducts as any);
router.patch('/variants/:variantId', adminUpdateVariantPrice as any);

export default router;
