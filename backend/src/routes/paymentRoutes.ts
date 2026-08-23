import { Router } from 'express';
import {
  createPaymentOrder,
  verifyPayment,
  submitManualUpiPayment,
  getPaymentConfig,
} from '../controllers/paymentController';

const router = Router();

// Payment configuration (public)
router.get('/config', getPaymentConfig);

// Create Razorpay payment order
router.post('/create', createPaymentOrder);

// Verify Razorpay payment signature
router.post('/verify', verifyPayment);

// Submit manual UPI payment reference (9542826358)
router.post('/manual-upi', submitManualUpiPayment);

export default router;
