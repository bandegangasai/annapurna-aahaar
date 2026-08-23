import { Router } from 'express';
import { createOrder, getOrderByNumber } from '../controllers/orderController';
import { verifyPayment } from '../controllers/paymentController';

const router = Router();

router.post('/', createOrder);
router.post('/razorpay-verify', verifyPayment);
router.get('/:orderNumber', getOrderByNumber);

export default router;
