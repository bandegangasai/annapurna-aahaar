import { Router, Request, Response } from 'express';
import prisma from '../config/prisma';
import { ENV } from '../config/env';

const router = Router();

// Overall System Health
router.get('/', async (req: Request, res: Response) => {
  res.status(200).json({
    status: 'HEALTHY',
    service: 'Annapurna Aahaar Telephony & Commerce API',
    owner: ENV.BUSINESS_OWNER,
    location: ENV.BUSINESS_LOCATION,
    pincode: ENV.BUSINESS_PINCODE,
    ivrNumber: ENV.IVR_PHONE_NUMBER || '9347036152',
    paymentMobile: ENV.BUSINESS_PAYMENT_MOBILE || '9542826358',
    timestamp: new Date().toISOString(),
    version: '2.1.0',
  });
});

// Database Health
router.get('/database', async (req: Request, res: Response) => {
  try {
    const start = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    const latency = Date.now() - start;

    const [orderCount, callCount, customerCount] = await Promise.all([
      prisma.order.count(),
      prisma.call.count(),
      prisma.customer.count(),
    ]);

    res.status(200).json({
      status: 'HEALTHY',
      database: 'PostgreSQL / Relational Store',
      latencyMs: latency,
      records: {
        totalOrders: orderCount,
        totalCalls: callCount,
        totalCustomers: customerCount,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'UNHEALTHY',
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

// IVR Telephony Health
router.get('/ivr', async (req: Request, res: Response) => {
  try {
    const [totalCalls, activeSessions, lastCall] = await Promise.all([
      prisma.call.count(),
      prisma.ivrSession.count({ where: { sessionStatus: 'ACTIVE' } }),
      prisma.call.findFirst({ orderBy: { startTime: 'desc' } }),
    ]);

    res.status(200).json({
      status: 'HEALTHY',
      ivrNumber: ENV.IVR_PHONE_NUMBER || '9347036152',
      provider: ENV.IVR_PROVIDER || 'TWILIO_EXOTEL_PLIVO',
      totalCallsLogged: totalCalls,
      activeLiveSessions: activeSessions,
      lastCallTimestamp: lastCall?.startTime || null,
      supportedLanguages: ['ENGLISH', 'MARATHI', 'HINDI', 'TELUGU'],
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'UNHEALTHY',
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

// Payment Health
router.get('/payment', async (req: Request, res: Response) => {
  try {
    const [paidCount, pendingVerificationCount] = await Promise.all([
      prisma.payment.count({ where: { status: 'PAID' } }),
      prisma.payment.count({ where: { status: 'PENDING_VERIFICATION' } }),
    ]);

    res.status(200).json({
      status: 'HEALTHY',
      paymentMobile: ENV.BUSINESS_PAYMENT_MOBILE || '9542836358',
      upiId: ENV.BUSINESS_UPI_ID || '9542836358@ybl',
      upiBank: ENV.BUSINESS_UPI_BANK,
      gateway: 'Razorpay / Cash on Delivery / Direct UPI',
      paidTransactions: paidCount,
      pendingManualVerifications: pendingVerificationCount,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'UNHEALTHY',
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

// Detailed System Health for Admin Dashboard
router.get('/detailed', async (req: Request, res: Response) => {
  try {
    const dbStart = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    const dbLatency = Date.now() - dbStart;

    const [
      totalOrders,
      totalCalls,
      activeSessions,
      lastCall,
      lastInteraction,
      pendingPayments,
    ] = await Promise.all([
      prisma.order.count(),
      prisma.call.count(),
      prisma.ivrSession.count({ where: { sessionStatus: 'ACTIVE' } }),
      prisma.call.findFirst({ orderBy: { startTime: 'desc' } }),
      prisma.ivrInteraction.findFirst({ orderBy: { timestamp: 'desc' } }),
      prisma.payment.count({ where: { status: 'PENDING_VERIFICATION' } }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        system: {
          status: 'OPERATIONAL',
          uptime: process.uptime(),
          nodeVersion: process.version,
          environment: ENV.NODE_ENV,
        },
        database: {
          status: 'CONNECTED',
          latencyMs: dbLatency,
          totalOrders,
          totalCalls,
        },
        ivr: {
          status: 'ONLINE',
          hotlineNumber: ENV.IVR_PHONE_NUMBER || '9347036152',
          activeSessions,
          lastCallTime: lastCall?.startTime || null,
          lastInteractionTime: lastInteraction?.timestamp || null,
          languages: ['ENGLISH', 'MARATHI', 'HINDI', 'TELUGU'],
        },
        payments: {
          status: 'ONLINE',
          paymentMobile: ENV.BUSINESS_PAYMENT_MOBILE || '9542836358',
          upiId: ENV.BUSINESS_UPI_ID || '9542836358@ybl',
          pendingReviewCount: pendingPayments,
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;
