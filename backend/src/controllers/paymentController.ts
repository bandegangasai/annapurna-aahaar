import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import prisma from '../config/prisma';
import { razorpayService } from '../services/razorpay';
import { realtimeService } from '../services/realtime';
import { ENV } from '../config/env';

const createPaymentSchema = z.object({
  orderId: z.string().min(1, 'Order ID is required'),
});

const verifyPaymentSchema = z.object({
  orderId: z.string().min(1, 'Order ID is required'),
  razorpayOrderId: z.string().min(1, 'Razorpay Order ID is required'),
  razorpayPaymentId: z.string().min(1, 'Razorpay Payment ID is required'),
  razorpaySignature: z.string().min(1, 'Razorpay Signature is required'),
});

const manualUpiSchema = z.object({
  orderId: z.string().min(1, 'Order ID is required'),
  transactionReference: z.string().min(4, 'Please enter a valid Transaction/UTR Reference ID'),
  manualUpiPhone: z.string().optional().default(ENV.BUSINESS_PAYMENT_MOBILE || '9542836358'),
  notes: z.string().optional(),
});

export const createPaymentOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { orderId } = createPaymentSchema.parse(req.body);

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { customer: true },
    });

    if (!order) {
      res.status(404).json({ success: false, message: 'Order not found.' });
      return;
    }

    if (order.paymentStatus === 'PAID') {
      res.status(400).json({ success: false, message: 'This order is already marked as paid.' });
      return;
    }

    const rzpOrder = await razorpayService.createOrder(order.total, order.orderNumber);

    // Record / update payment record
    await prisma.payment.create({
      data: {
        orderId: order.id,
        gateway: 'RAZORPAY',
        gatewayOrderId: rzpOrder.id,
        amount: order.total,
        currency: 'INR',
        status: 'PROCESSING',
        paymentMethod: 'ONLINE',
      },
    });

    await prisma.order.update({
      where: { id: order.id },
      data: {
        razorpayOrderId: rzpOrder.id,
        paymentStatus: 'PROCESSING',
        paymentMethod: 'ONLINE',
      },
    });

    res.status(200).json({
      success: true,
      data: {
        orderId: order.id,
        orderNumber: order.orderNumber,
        razorpayOrderId: rzpOrder.id,
        amount: rzpOrder.amount,
        currency: rzpOrder.currency,
        keyId: rzpOrder.keyId,
        businessName: ENV.BUSINESS_NAME,
        customer: {
          name: order.customer.name,
          phone: order.customer.phone,
          email: order.customer.email || '',
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const verifyPayment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } =
      verifyPaymentSchema.parse(req.body);

    const isValid = razorpayService.verifySignature(
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    );

    if (!isValid) {
      res.status(400).json({ success: false, message: 'Payment signature verification failed.' });
      return;
    }

    const order = await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: 'PAID',
        paymentMethod: 'ONLINE',
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
        statusHistory: {
          create: {
            previousStatus: 'PENDING',
            newStatus: 'ACCEPTED',
            note: `Online payment of verified via Razorpay ID: ${razorpayPaymentId}`,
            changedBy: 'PAYMENT_GATEWAY',
          },
        },
      },
      include: { customer: true, items: true, payments: true },
    });

    // Update payment record
    await prisma.payment.create({
      data: {
        orderId: order.id,
        gateway: 'RAZORPAY',
        gatewayOrderId: razorpayOrderId,
        gatewayPaymentId: razorpayPaymentId,
        amount: order.total,
        currency: 'INR',
        status: 'PAID',
        paymentMethod: 'ONLINE',
        verifiedAt: new Date(),
      },
    });

    // Broadcast real-time payment update
    realtimeService.broadcast('payment_verified', {
      orderId: order.id,
      orderNumber: order.orderNumber,
      paymentStatus: 'PAID',
      customerName: order.customer.name,
      total: order.total,
    });

    res.status(200).json({
      success: true,
      message: 'Payment verified and order confirmed successfully!',
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

export const submitManualUpiPayment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { orderId, transactionReference, manualUpiPhone, notes } = manualUpiSchema.parse(req.body);

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { customer: true },
    });

    if (!order) {
      res.status(404).json({ success: false, message: 'Order not found.' });
      return;
    }

    const updatedOrder = await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentStatus: 'PENDING_VERIFICATION',
        paymentMethod: 'MANUAL_UPI',
        statusHistory: {
          create: {
            newStatus: order.status,
            note: `Customer submitted manual UPI payment UTR: ${transactionReference} on phone ${manualUpiPhone}`,
            changedBy: 'CUSTOMER',
          },
        },
      },
      include: { customer: true, items: true },
    });

    const paymentRecord = await prisma.payment.create({
      data: {
        orderId: order.id,
        gateway: 'MANUAL_UPI',
        transactionReference,
        amount: order.total,
        currency: 'INR',
        status: 'PENDING_VERIFICATION',
        paymentMethod: 'MANUAL_UPI',
        manualUpiPhone: manualUpiPhone || ENV.BUSINESS_PAYMENT_MOBILE,
        manualUpiRef: transactionReference,
        manualUpiNotes: notes || '',
      },
    });

    // Broadcast real-time manual UPI verification alert to admin
    realtimeService.broadcast('manual_upi_submitted', {
      orderId: order.id,
      orderNumber: order.orderNumber,
      customerName: order.customer.name,
      amount: order.total,
      transactionReference,
      paymentId: paymentRecord.id,
    });

    res.status(200).json({
      success: true,
      message: 'Payment reference submitted! Your order is waiting for admin verification.',
      data: {
        order: updatedOrder,
        payment: paymentRecord,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getPaymentConfig = async (req: Request, res: Response): Promise<void> => {
  res.status(200).json({
    success: true,
    data: {
      businessPaymentMobile: ENV.BUSINESS_PAYMENT_MOBILE,
      businessUpiId: ENV.BUSINESS_UPI_ID || null,
      businessName: ENV.BUSINESS_NAME,
      razorpayKeyId: ENV.RAZORPAY_KEY_ID && !ENV.RAZORPAY_KEY_ID.includes('placeholder')
        ? ENV.RAZORPAY_KEY_ID
        : null,
      isLiveGatewayAvailable: !!(ENV.RAZORPAY_KEY_ID && !ENV.RAZORPAY_KEY_ID.includes('placeholder')),
    },
  });
};
