import { Router } from 'express';
import {
  createOrder,
  getOrderByOrderNumber,
  verifyOnlinePayment,
} from '../controllers/orderController';

const router = Router();

router.post('/', createOrder);
router.post('/razorpay-verify', verifyOnlinePayment);
router.get('/:orderNumber', getOrderByOrderNumber);

export default router;
