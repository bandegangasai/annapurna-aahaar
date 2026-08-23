import { Router } from 'express';
import { createOrder, getOrderByOrderNumber } from '../controllers/orderController';

const router = Router();

router.post('/', createOrder);
router.get('/:orderNumber', getOrderByOrderNumber);

export default router;
