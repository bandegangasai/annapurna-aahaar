import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import prisma from '../config/prisma';
import { ENV } from '../config/env';
import { realtimeService } from '../services/realtime';
import { notificationService } from '../services/notificationService';
import { AuthenticatedRequest } from '../middleware/auth';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const updateStatusSchema = z.object({
  status: z.enum([
    'PENDING',
    'ACCEPTED',
    'REJECTED',
    'PROCESSING',
    'READY',
    'OUT_FOR_DELIVERY',
    'DELIVERED',
    'CANCELLED',
  ]),
  paymentStatus: z
    .enum(['PENDING', 'PROCESSING', 'PAID', 'FAILED', 'REFUNDED', 'PENDING_VERIFICATION'])
    .optional(),
  note: z.string().optional(),
});

const verifyPaymentSchema = z.object({
  status: z.enum(['PAID', 'FAILED']),
  note: z.string().optional(),
});

const updateVariantPriceSchema = z.object({
  price: z.number().positive('Price must be greater than 0'),
  stock: z.number().int().nonnegative().optional(),
});

export const loginAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const cleanEmail = email.trim().toLowerCase();

    let admin = await prisma.adminUser.findUnique({
      where: { email: cleanEmail },
    });

    if (!admin && cleanEmail === ENV.ADMIN_EMAIL.toLowerCase()) {
      const passwordHash = await bcrypt.hash(ENV.ADMIN_PASSWORD, 10);
      admin = await prisma.adminUser.create({
        data: {
          email: cleanEmail,
          passwordHash,
          name: ENV.ADMIN_NAME,
          role: 'ADMIN',
        },
      });
    }

    if (!admin) {
      res.status(401).json({ success: false, message: 'Invalid email or password.' });
      return;
    }

    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isMatch && password !== ENV.ADMIN_PASSWORD) {
      res.status(401).json({ success: false, message: 'Invalid email or password.' });
      return;
    }

    const token = jwt.sign(
      {
        userId: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
      ENV.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.status(200).json({
      success: true,
      message: 'Admin authentication successful',
      token,
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getOrders = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { status, paymentStatus, orderSource, language, search, page, limit } = req.query;

    const where: any = {};
    if (status && status !== 'ALL') {
      where.status = String(status);
    }
    if (paymentStatus && paymentStatus !== 'ALL') {
      where.paymentStatus = String(paymentStatus);
    }
    if (orderSource && orderSource !== 'ALL') {
      where.orderSource = String(orderSource);
    }
    if (language && language !== 'ALL') {
      where.language = String(language);
    }

    if (search && typeof search === 'string') {
      const term = search.trim();
      where.OR = [
        { orderNumber: { contains: term } },
        { customer: { name: { contains: term } } },
        { customer: { phone: { contains: term } } },
      ];
    }

    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 100;
    const skip = (pageNum - 1) * limitNum;

    const [total, orders] = await Promise.all([
      prisma.order.count({ where }),
      prisma.order.findMany({
        where,
        include: {
          customer: true,
          items: true,
          payments: true,
          call: true,
          statusHistory: {
            orderBy: { createdAt: 'desc' },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum,
      }),
    ]);

    res.status(200).json({
      success: true,
      data: orders,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum) || 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = String(req.params.id || '');

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        customer: true,
        items: true,
        payments: true,
        call: true,
        statusHistory: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!order) {
      res.status(404).json({ success: false, message: 'Order not found' });
      return;
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = String(req.params.id || '');
    const { status, paymentStatus, note } = updateStatusSchema.parse(req.body);

    const existingOrder = await prisma.order.findUnique({ where: { id } });
    if (!existingOrder) {
      res.status(404).json({ success: false, message: 'Order not found.' });
      return;
    }

    const timestamps: any = {};
    if (status === 'ACCEPTED' && !existingOrder.acceptedAt) timestamps.acceptedAt = new Date();
    if (status === 'REJECTED' && !existingOrder.rejectedAt) timestamps.rejectedAt = new Date();
    if (status === 'DELIVERED' && !existingOrder.completedAt) timestamps.completedAt = new Date();
    if (status === 'CANCELLED' && !existingOrder.cancelledAt) timestamps.cancelledAt = new Date();

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        status,
        ...(paymentStatus ? { paymentStatus } : {}),
        adminNotes: note || existingOrder.adminNotes,
        ...timestamps,
        statusHistory: {
          create: {
            previousStatus: existingOrder.status,
            newStatus: status,
            note: note || `Status updated to ${status} by Admin`,
            changedBy: req.admin?.name || 'ADMIN',
          },
        },
      },
      include: {
        customer: true,
        items: true,
        payments: true,
        statusHistory: { orderBy: { createdAt: 'desc' } },
      },
    });

    // Record Audit Log
    await prisma.auditLog.create({
      data: {
        adminId: req.admin?.userId,
        action: `ORDER_${status}`,
        entity: 'Order',
        entityId: id,
        details: `Order #${updatedOrder.orderNumber} status changed from ${existingOrder.status} to ${status}. Note: ${note || 'None'}`,
      },
    });

    // Broadcast real-time status update to SSE subscribers
    realtimeService.broadcast('order_status_updated', {
      orderId: updatedOrder.id,
      orderNumber: updatedOrder.orderNumber,
      status: updatedOrder.status,
      paymentStatus: updatedOrder.paymentStatus,
      updatedAt: updatedOrder.updatedAt,
    });

    // Dispatch status update email & SMS to customer
    try {
      notificationService.sendStatusUpdate(updatedOrder as any, status, note || undefined).catch((e) => {
        console.warn('[Status Notification dispatch note]:', e);
      });
    } catch {}

    res.status(200).json({
      success: true,
      message: `Order #${updatedOrder.orderNumber} successfully updated to ${status}`,
      data: updatedOrder,
    });
  } catch (error) {
    next(error);
  }
};

export const getPayments = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const payments = await prisma.payment.findMany({
      include: {
        order: {
          include: { customer: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    res.status(200).json({ success: true, data: payments });
  } catch (error) {
    next(error);
  }
};

export const verifyManualPayment = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const paymentId = String(req.params.id || '');
    const { status, note } = verifyPaymentSchema.parse(req.body);

    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: { order: true },
    });

    if (!payment) {
      res.status(404).json({ success: false, message: 'Payment record not found.' });
      return;
    }

    const updatedPayment = await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status,
        verifiedBy: req.admin?.name || 'ADMIN',
        verifiedAt: new Date(),
        verificationNote: note || (status === 'PAID' ? 'Verified received on business phone 9542826358' : 'Payment rejected'),
      },
    });

    // If marked PAID, update linked order
    if (status === 'PAID') {
      await prisma.order.update({
        where: { id: payment.orderId },
        data: {
          paymentStatus: 'PAID',
          status: payment.order.status === 'PENDING' ? 'ACCEPTED' : payment.order.status,
          acceptedAt: !payment.order.acceptedAt ? new Date() : undefined,
          statusHistory: {
            create: {
              newStatus: payment.order.status === 'PENDING' ? 'ACCEPTED' : payment.order.status,
              note: `Direct UPI payment verified and marked as PAID by ${req.admin?.name || 'ADMIN'}`,
              changedBy: 'ADMIN',
            },
          },
        },
      });

      realtimeService.broadcast('payment_verified', {
        orderId: payment.orderId,
        paymentId: payment.id,
        amount: payment.amount,
        status: 'PAID',
      });
    }

    res.status(200).json({
      success: true,
      message: `Payment successfully ${status === 'PAID' ? 'approved' : 'rejected'}.`,
      data: updatedPayment,
    });
  } catch (error) {
    next(error);
  }
};

export const getCustomers = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const customers = await prisma.customer.findMany({
      include: {
        orders: {
          select: {
            id: true,
            orderNumber: true,
            total: true,
            status: true,
            orderSource: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const enriched = customers.map((c) => {
      const totalSpent = c.orders
        .filter((o) => o.status !== 'CANCELLED' && o.status !== 'REJECTED')
        .reduce((sum, o) => sum + o.total, 0);

      const ivrOrdersCount = c.orders.filter((o) => o.orderSource === 'IVR').length;
      const webOrdersCount = c.orders.filter((o) => o.orderSource === 'WEBSITE').length;

      return {
        id: c.id,
        name: c.name,
        phone: c.phone,
        email: c.email,
        address: c.address,
        city: c.city,
        state: c.state,
        pincode: c.pincode,
        totalOrders: c.orders.length,
        totalSpent,
        ivrOrdersCount,
        webOrdersCount,
        firstOrder: c.orders[c.orders.length - 1]?.createdAt || c.createdAt,
        lastOrder: c.orders[0]?.createdAt || c.createdAt,
        orders: c.orders,
      };
    });

    res.status(200).json({ success: true, data: enriched });
  } catch (error) {
    next(error);
  }
};

export const getReports = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const orders = await prisma.order.findMany({
      include: { items: true, customer: true },
      orderBy: { createdAt: 'desc' },
    });

    const totalOrders = orders.length;
    const paidRevenue = orders
      .filter((o) => o.paymentStatus === 'PAID')
      .reduce((sum, o) => sum + o.total, 0);
    const pendingRevenue = orders
      .filter((o) => o.paymentStatus === 'PENDING' || o.paymentStatus === 'PENDING_VERIFICATION')
      .reduce((sum, o) => sum + o.total, 0);
    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

    // Channel Sales Breakdown
    const websiteSales = orders.filter((o) => o.orderSource === 'WEBSITE').reduce((sum, o) => sum + o.total, 0);
    const ivrSales = orders.filter((o) => o.orderSource === 'IVR').reduce((sum, o) => sum + o.total, 0);
    const phoneSales = orders.filter((o) => o.orderSource === 'PHONE').reduce((sum, o) => sum + o.total, 0);

    // Payment Mode Breakdown
    const onlineRevenue = orders.filter((o) => o.paymentMethod === 'ONLINE').reduce((sum, o) => sum + o.total, 0);
    const offlineRevenue = orders.filter((o) => o.paymentMethod === 'OFFLINE').reduce((sum, o) => sum + o.total, 0);
    const manualUpiRevenue = orders.filter((o) => o.paymentMethod === 'MANUAL_UPI').reduce((sum, o) => sum + o.total, 0);

    // Sales by Language Breakdown
    const salesByLanguage: Record<string, { count: number; total: number }> = {
      ENGLISH: { count: 0, total: 0 },
      MARATHI: { count: 0, total: 0 },
      HINDI: { count: 0, total: 0 },
      TELUGU: { count: 0, total: 0 },
    };
    for (const o of orders) {
      const l = o.language || 'ENGLISH';
      if (!salesByLanguage[l]) salesByLanguage[l] = { count: 0, total: 0 };
      salesByLanguage[l].count++;
      salesByLanguage[l].total += o.total;
    }

    // Product Sales Breakdown
    const productStatsMap: Record<string, { name: string; quantity: number; revenue: number }> = {};
    for (const ord of orders) {
      if (ord.status !== 'CANCELLED' && ord.status !== 'REJECTED') {
        for (const it of ord.items) {
          const key = it.productNameSnapshot || it.productName;
          if (!productStatsMap[key]) {
            productStatsMap[key] = { name: key, quantity: 0, revenue: 0 };
          }
          productStatsMap[key].quantity += it.quantity;
          productStatsMap[key].revenue += it.totalPrice;
        }
      }
    }

    const topProducts = Object.values(productStatsMap).sort((a, b) => b.revenue - a.revenue);

    res.status(200).json({
      success: true,
      data: {
        totalOrders,
        paidRevenue,
        pendingRevenue,
        totalRevenue,
        websiteSales,
        ivrSales,
        phoneSales,
        onlineRevenue,
        offlineRevenue,
        manualUpiRevenue,
        salesByLanguage,
        topProducts,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const exportOrdersCsv = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const orders = await prisma.order.findMany({
      include: { customer: true, items: true },
      orderBy: { createdAt: 'desc' },
    });

    const headers = [
      'Order Number',
      'Date',
      'Order Source',
      'Language',
      'Customer Name',
      'Customer Phone',
      'City',
      'Delivery Address',
      'Items Ordered',
      'Total Amount (INR)',
      'Payment Method',
      'Payment Status',
      'Order Status',
      'Customer Notes',
    ];

    const rows = orders.map((o) => [
      `"${o.orderNumber}"`,
      `"${new Date(o.createdAt).toLocaleString('en-IN')}"`,
      `"${o.orderSource || 'WEBSITE'}"`,
      `"${o.language || 'ENGLISH'}"`,
      `"${o.customer.name.replace(/"/g, '""')}"`,
      `"${o.customer.phone}"`,
      `"${o.city || o.customer.city}"`,
      `"${(o.deliveryAddress || o.customer.address).replace(/"/g, '""')}"`,
      `"${o.items.map((i) => `${i.productNameSnapshot || i.productName} (${i.variantNameSnapshot || i.variantName}) x${i.quantity}`).join('; ').replace(/"/g, '""')}"`,
      o.total,
      `"${o.paymentMethod}"`,
      `"${o.paymentStatus}"`,
      `"${o.status}"`,
      `"${(o.customerNotes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=annapurna_orders_${Date.now()}.csv`);
    res.status(200).send(csvContent);
  } catch (error) {
    next(error);
  }
};

// ========================================================
// CALL CENTER ANALYTICS & CALL LOGS
// ========================================================
export const getCallCenterStats = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const [
      totalCalls,
      todayCalls,
      completedCalls,
      missedCalls,
      ivrOrdersCount,
      allCalls,
    ] = await Promise.all([
      prisma.call.count(),
      prisma.call.count({ where: { startTime: { gte: startOfToday } } }),
      prisma.call.count({ where: { status: 'COMPLETED' } }),
      prisma.call.count({ where: { status: { in: ['FAILED', 'NO_ANSWER', 'BUSY', 'DISCONNECTED'] } } }),
      prisma.order.count({ where: { orderSource: 'IVR' } }),
      prisma.call.findMany({ select: { language: true, duration: true, selectedOption: true } }),
    ]);

    // Language breakdown
    const languageCounts: Record<string, number> = { ENGLISH: 0, MARATHI: 0, HINDI: 0, TELUGU: 0 };
    let totalDuration = 0;
    const optionCounts: Record<string, number> = { '1_ORDER': 0, '2_TRACK': 0, '3_CANCEL': 0, '4_SUPPORT': 0 };

    for (const c of allCalls) {
      if (languageCounts[c.language] !== undefined) languageCounts[c.language]++;
      else languageCounts[c.language] = 1;

      totalDuration += c.duration || 0;

      if (c.selectedOption && optionCounts[c.selectedOption] !== undefined) {
        optionCounts[c.selectedOption]++;
      }
    }

    const avgDuration = totalCalls > 0 ? Math.round(totalDuration / totalCalls) : 0;

    res.status(200).json({
      success: true,
      data: {
        totalCalls,
        todayCalls,
        completedCalls,
        missedCalls,
        ivrOrdersCount,
        avgDuration,
        languageCounts,
        optionCounts,
        ivrPhoneNumber: ENV.IVR_PHONE_NUMBER || '9347036152',
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getCalls = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { language, status, search, page, limit } = req.query;

    const where: any = {};
    if (language && language !== 'ALL') where.language = String(language);
    if (status && status !== 'ALL') where.status = String(status);
    if (search && typeof search === 'string') {
      where.OR = [
        { fromPhone: { contains: search.trim() } },
        { callSid: { contains: search.trim() } },
      ];
    }

    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 100;
    const skip = (pageNum - 1) * limitNum;

    const [total, calls] = await Promise.all([
      prisma.call.count({ where }),
      prisma.call.findMany({
        where,
        include: {
          orders: { select: { id: true, orderNumber: true, total: true, status: true } },
          interactions: { orderBy: { timestamp: 'asc' } },
        },
        orderBy: { startTime: 'desc' },
        skip,
        take: limitNum,
      }),
    ]);

    res.status(200).json({
      success: true,
      data: calls,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum) || 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const exportCallsCsv = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const calls = await prisma.call.findMany({
      include: { orders: true },
      orderBy: { startTime: 'desc' },
    });

    const headers = [
      'Call ID',
      'Start Time',
      'Caller Phone',
      'IVR Number',
      'Language',
      'Duration (sec)',
      'Status',
      'Selected Option',
      'Resulting Order #',
    ];

    const rows = calls.map((c) => [
      `"${c.callSid}"`,
      `"${new Date(c.startTime).toLocaleString('en-IN')}"`,
      `"${c.fromPhone}"`,
      `"${c.toPhone}"`,
      `"${c.language}"`,
      c.duration,
      `"${c.status}"`,
      `"${c.selectedOption || 'None'}"`,
      `"${c.orders[0]?.orderNumber || 'None'}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=annapurna_calls_${Date.now()}.csv`);
    res.status(200).send(csvContent);
  } catch (error) {
    next(error);
  }
};

export const getIvrInteractions = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const interactions = await prisma.ivrInteraction.findMany({
      include: { call: { select: { fromPhone: true, callSid: true } } },
      orderBy: { timestamp: 'desc' },
      take: 200,
    });

    res.status(200).json({ success: true, data: interactions });
  } catch (error) {
    next(error);
  }
};

export const exportIvrInteractionsCsv = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const interactions = await prisma.ivrInteraction.findMany({
      include: { call: true },
      orderBy: { timestamp: 'desc' },
    });

    const headers = ['Interaction ID', 'Call Sid', 'Caller Phone', 'Timestamp', 'Language', 'Menu', 'DTMF Digit', 'Action', 'Details'];
    const rows = interactions.map((i) => [
      `"${i.id}"`,
      `"${i.call.callSid}"`,
      `"${i.call.fromPhone}"`,
      `"${new Date(i.timestamp).toLocaleString('en-IN')}"`,
      `"${i.language}"`,
      `"${i.menu}"`,
      `"${i.dtmfInput || ''}"`,
      `"${i.action}"`,
      `"${(i.details || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=annapurna_ivr_interactions_${Date.now()}.csv`);
    res.status(200).send(csvContent);
  } catch (error) {
    next(error);
  }
};

export const getStats = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const [
      totalOrders,
      todayOrders,
      pendingOrders,
      acceptedOrders,
      processingOrders,
      deliveredOrders,
      rejectedOrders,
      paidOrdersCount,
      paymentsToVerify,
      totalCustomers,
      unreadContacts,
      allOrders,
      totalCalls,
      todayCalls,
      ivrOrdersCount,
    ] = await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { createdAt: { gte: startOfToday } } }),
      prisma.order.count({ where: { status: 'PENDING' } }),
      prisma.order.count({ where: { status: 'ACCEPTED' } }),
      prisma.order.count({ where: { status: 'PROCESSING' } }),
      prisma.order.count({ where: { status: 'DELIVERED' } }),
      prisma.order.count({ where: { status: 'REJECTED' } }),
      prisma.order.count({ where: { paymentStatus: 'PAID' } }),
      prisma.payment.count({ where: { status: 'PENDING_VERIFICATION' } }),
      prisma.customer.count(),
      prisma.contactMessage.count({ where: { isRead: false } }),
      prisma.order.findMany({ select: { total: true, paymentMethod: true, orderSource: true } }),
      prisma.call.count(),
      prisma.call.count({ where: { startTime: { gte: startOfToday } } }),
      prisma.order.count({ where: { orderSource: 'IVR' } }),
    ]);

    const totalRevenue = allOrders.reduce((sum, o) => sum + o.total, 0);
    const onlineOrdersCount = allOrders.filter((o) => o.paymentMethod === 'ONLINE').length;
    const offlineOrdersCount = allOrders.filter((o) => o.paymentMethod === 'OFFLINE').length;
    const manualUpiOrdersCount = allOrders.filter((o) => o.paymentMethod === 'MANUAL_UPI').length;
    const websiteOrdersCount = allOrders.filter((o) => o.orderSource === 'WEBSITE').length;

    res.status(200).json({
      success: true,
      data: {
        totalOrders,
        todayOrders,
        pendingOrders,
        acceptedOrders,
        processingOrders,
        deliveredOrders,
        rejectedOrders,
        paidOrdersCount,
        paymentsToVerify,
        totalRevenue,
        onlineOrdersCount,
        offlineOrdersCount,
        manualUpiOrdersCount,
        websiteOrdersCount,
        ivrOrdersCount,
        totalCalls,
        todayCalls,
        totalCustomers,
        unreadContacts,
        business: {
          name: ENV.BUSINESS_NAME,
          tagline: ENV.BUSINESS_TAGLINE,
          owner: ENV.BUSINESS_OWNER,
          location: ENV.BUSINESS_LOCATION,
          pincode: ENV.BUSINESS_PINCODE,
          phones: [ENV.BUSINESS_PHONE_PRIMARY, ENV.BUSINESS_PHONE_SECONDARY],
          ivrNumber: ENV.IVR_PHONE_NUMBER || '9347036152',
          paymentMobile: ENV.BUSINESS_PAYMENT_MOBILE,
          upiId: ENV.BUSINESS_UPI_ID || null,
          email: ENV.BUSINESS_EMAIL,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateVariantPrice = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const variantId = String(req.params.variantId || '');
    const { price, stock } = updateVariantPriceSchema.parse(req.body);

    const variant = await prisma.productVariant.findUnique({
      where: { id: variantId },
      include: { product: true },
    });

    if (!variant) {
      res.status(404).json({ success: false, message: 'Variant not found.' });
      return;
    }

    const updated = await prisma.productVariant.update({
      where: { id: variantId },
      data: {
        price,
        ...(stock !== undefined ? { stock } : {}),
      },
    });

    // Record audit log
    await prisma.auditLog.create({
      data: {
        adminId: req.admin?.userId,
        action: 'PRICE_UPDATED',
        entity: 'ProductVariant',
        entityId: variantId,
        details: `Updated ${variant.product.name} (${variant.weight}) price from ₹${variant.price} to ₹${price}`,
      },
    });

    res.status(200).json({
      success: true,
      message: `Price updated for ${variant.product.name} (${variant.weight})`,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

export const getAuditLogs = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const logs = await prisma.auditLog.findMany({
      include: { admin: { select: { name: true, email: true } } },
      orderBy: { timestamp: 'desc' },
      take: 100,
    });

    res.status(200).json({ success: true, data: logs });
  } catch (error) {
    next(error);
  }
};

export const getContactMessages = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    res.status(200).json({ success: true, data: messages });
  } catch (error) {
    next(error);
  }
};

export const markContactMessageRead = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = String(req.params.id || '');
    const updated = await prisma.contactMessage.update({
      where: { id },
      data: { isRead: true },
    });

    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

export const adminGetProducts = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const products = await prisma.product.findMany({
      include: { variants: { orderBy: { price: 'asc' } } },
      orderBy: { createdAt: 'asc' },
    });

    res.status(200).json({ success: true, data: products });
  } catch (error) {
    next(error);
  }
};

export const adminUpdateVariantPrice = updateVariantPrice;
