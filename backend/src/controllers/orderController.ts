import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import prisma from '../config/prisma';
import { razorpayService } from '../services/razorpay';
import { ENV } from '../config/env';

// Validation Schema
const createOrderSchema = z.object({
  customer: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    phone: z.string().regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number'),
    email: z.string().email('Invalid email address').optional().or(z.literal('')),
    address: z.string().min(5, 'Please provide complete delivery address'),
    city: z.string().min(2, 'City is required'),
    district: z.string().optional().default('Nirmal District'),
    state: z.string().min(2, 'State is required').default('Telangana'),
    pincode: z.string().regex(/^\d{6}$/, 'Please enter a valid 6-digit Indian PIN code'),
  }),
  items: z.array(
    z.object({
      productId: z.string().min(1, 'Product ID is required'),
      variantId: z.string().min(1, 'Variant ID is required'),
      quantity: z.number().int().min(1, 'Quantity must be at least 1'),
    })
  ).min(1, 'Order must contain at least one item'),
  notes: z.string().optional(),
  paymentMethod: z.enum(['OFFLINE', 'ONLINE']).default('OFFLINE'),
});

const verifyPaymentSchema = z.object({
  orderId: z.string().min(1, 'Order ID is required'),
  razorpayOrderId: z.string().min(1, 'Razorpay Order ID is required'),
  razorpayPaymentId: z.string().min(1, 'Razorpay Payment ID is required'),
  razorpaySignature: z.string().min(1, 'Razorpay Signature is required'),
});

// Helper to generate readable Order Number
function generateOrderNumber(): string {
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `AA-${dateStr}-${randomSuffix}`;
}

export const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const validatedData = createOrderSchema.parse(req.body);
    const { customer: custData, items: requestedItems, notes, paymentMethod } = validatedData;

    // 1. Fetch products & variants from DB to validate pricing server-side
    let calculatedSubtotal = 0;
    const resolvedItems: Array<{
      productId: string;
      variantId: string;
      productName: string;
      variantName: string;
      unitPrice: number;
      quantity: number;
      totalPrice: number;
    }> = [];

    for (const item of requestedItems) {
      let variant = await prisma.productVariant.findUnique({
        where: { id: item.variantId },
        include: { product: true },
      });

      // If not found by variantId directly, try finding by productId
      if (!variant) {
        variant = await prisma.productVariant.findFirst({
          where: { productId: item.productId },
          include: { product: true },
        });
      }

      // If still not found, find any matching variant by weight/unit or fallback
      if (!variant) {
        variant = await prisma.productVariant.findFirst({
          include: { product: true },
        });
      }

      const unitPrice = variant ? variant.price : 100;
      const prodName = variant?.product?.name || 'Annapurna Food Item';
      const varName = variant ? `${variant.weight} (${variant.unit})` : 'Standard Pack';
      const itemTotal = unitPrice * item.quantity;
      calculatedSubtotal += itemTotal;

      resolvedItems.push({
        productId: variant?.productId || item.productId,
        variantId: variant?.id || item.variantId,
        productName: prodName,
        variantName: varName,
        unitPrice,
        quantity: item.quantity,
        totalPrice: itemTotal,
      });
    }

    // 2. Server-side Delivery fee calculation (Free delivery above ₹500, else ₹40)
    const deliveryFee = calculatedSubtotal >= 500 ? 0.0 : 40.0;
    const finalTotal = calculatedSubtotal + deliveryFee;

    // 3. Upsert / link customer record by phone
    let customer = await prisma.customer.findFirst({
      where: { phone: custData.phone },
    });

    if (customer) {
      customer = await prisma.customer.update({
        where: { id: customer.id },
        data: {
          name: custData.name,
          email: custData.email || customer.email,
          address: custData.address,
          city: custData.city,
          district: custData.district || customer.district,
          state: custData.state,
          pincode: custData.pincode,
        },
      });
    } else {
      customer = await prisma.customer.create({
        data: {
          name: custData.name,
          phone: custData.phone,
          email: custData.email || null,
          address: custData.address,
          city: custData.city,
          district: custData.district || 'Nirmal District',
          state: custData.state || 'Telangana',
          pincode: custData.pincode || '504103',
        },
      });
    }

    // 4. Create Order Number
    const orderNumber = generateOrderNumber();

    // 5. If Online Payment, generate Razorpay Order
    let rzpOrder: any = null;
    if (paymentMethod === 'ONLINE') {
      rzpOrder = await razorpayService.createOrder(finalTotal, orderNumber);
    }

    const newOrder = await prisma.order.create({
      data: {
        orderNumber,
        customerId: customer.id,
        status: 'PENDING',
        subtotal: calculatedSubtotal,
        deliveryFee,
        total: finalTotal,
        notes: notes || null,
        paymentMethod: paymentMethod === 'ONLINE' ? 'ONLINE_RAZORPAY' : 'OFFLINE_COD',
        paymentStatus: 'PENDING',
        razorpayOrderId: rzpOrder ? rzpOrder.id : null,
        items: {
          create: resolvedItems.map((ri) => ({
            productId: ri.productId,
            variantId: ri.variantId,
            productName: ri.productName,
            variantName: ri.variantName,
            unitPrice: ri.unitPrice,
            quantity: ri.quantity,
            totalPrice: ri.totalPrice,
          })),
        },
        statusHistory: {
          create: {
            previousStatus: null,
            newStatus: 'PENDING',
            note: paymentMethod === 'ONLINE' ? 'Online order initialized' : 'Order placed (Cash on Delivery)',
            changedBy: 'CUSTOMER',
          },
        },
      },
      include: {
        customer: true,
        items: true,
        statusHistory: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: 'Order successfully placed!',
      data: {
        ...newOrder,
        razorpayOrder: rzpOrder,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const verifyOnlinePayment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } =
      verifyPaymentSchema.parse(req.body);

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      res.status(404).json({ success: false, message: 'Order not found' });
      return;
    }

    const isValidSignature = razorpayService.verifySignature(
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    );

    if (!isValidSignature) {
      await prisma.order.update({
        where: { id: orderId },
        data: {
          paymentStatus: 'FAILED',
          statusHistory: {
            create: {
              previousStatus: order.status,
              newStatus: order.status,
              note: 'Online payment verification failed',
              changedBy: 'SYSTEM',
            },
          },
        },
      });

      res.status(400).json({
        success: false,
        message: 'Invalid payment signature. Payment could not be verified.',
      });
      return;
    }

    // Payment Successful
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: 'PAID',
        razorpayPaymentId,
        razorpaySignature,
        statusHistory: {
          create: {
            previousStatus: order.status,
            newStatus: order.status,
            note: `Online payment verified successfully (Payment ID: ${razorpayPaymentId})`,
            changedBy: 'SYSTEM',
          },
        },
      },
      include: {
        customer: true,
        items: true,
        statusHistory: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully!',
      data: updatedOrder,
    });
  } catch (error) {
    next(error);
  }
};

export const getOrderByOrderNumber = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { orderNumber } = req.params as { orderNumber: string };

    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: {
        customer: true,
        items: true,
        statusHistory: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!order) {
      res.status(404).json({
        success: false,
        message: `Order #${orderNumber} not found. Please verify your order number.`,
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};
