import { Router } from 'express';
import {
  handleIvrWebhook,
  handleStatusCallback,
  handleSimulateIvr,
} from '../controllers/ivrController';

const router = Router();

// Primary IVR Webhook (State Machine entry point for all DTMF steps and Inbound calls)
router.all('/webhook', handleIvrWebhook as any);
router.all('/incoming', handleIvrWebhook as any);
router.all('/select-language', handleIvrWebhook as any);
router.all('/main-menu', handleIvrWebhook as any);
router.all('/order/select-product', handleIvrWebhook as any);
router.all('/order/select-variant', handleIvrWebhook as any);
router.all('/order/confirm', handleIvrWebhook as any);
router.all('/cancel-confirm', handleIvrWebhook as any);

// Call Status & Recording Callback
router.all('/status-callback', handleStatusCallback as any);

// Interactive In-Browser Voice Dialer & Automated Simulator
router.post('/simulate', handleSimulateIvr as any);

export default router;
