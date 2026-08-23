import { Router } from 'express';
import {
  handleIncomingCall,
  handleSelectLanguage,
  handleMainMenu,
  handleSelectProduct,
  handleSelectVariant,
  handleConfirmOrder,
  handleCancelConfirm,
  handleStatusCallback,
  handleSimulateIvr,
} from '../controllers/ivrController';

const router = Router();

// Inbound IVR Call Handlers (supports both POST and GET for telephony provider flexibility)
router.all('/incoming', handleIncomingCall as any);
router.all('/select-language', handleSelectLanguage as any);
router.all('/main-menu', handleMainMenu as any);
router.all('/order/select-product', handleSelectProduct as any);
router.all('/order/select-variant', handleSelectVariant as any);
router.all('/order/confirm', handleConfirmOrder as any);
router.all('/cancel-confirm', handleCancelConfirm as any);
router.all('/status-callback', handleStatusCallback as any);

// Simulator endpoint for E2E testing
router.post('/simulate', handleSimulateIvr as any);

export default router;
