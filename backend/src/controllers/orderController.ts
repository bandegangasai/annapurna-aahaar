import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import prisma from '../config/prisma';
import { realtimeService } from '../services/realtime';

// Validation Schema
const createOrderSchema = z.object({
  customer: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    phone: z.string().regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number'),
    email: z.string().email('Invalid email address').optional().or(z.literal('')),
    address: z.string().min(5, 'Please provide complete delivery address'),
    city: z.string().min(2, 'City is required').default('Bhainsa'),
    district: z.string().optional().default('Nirmal District'),
    state: z.string().min(2, 'State is required').default('Telangana'),
    pincode: z.string().regex(/^\d{6}$/, 'Please enter a valid 6-digit Indian PIN code').default('504103'),
  }),
  items: z.array(
    z.object({
      productId: z.string().min(1, 'Product ID is required'),
      variantId: z.string().min(1, 'Variant ID is required'),
      quantity: z.number().int().min(1, 'Quantity must be at least 1'),
    })
  ).min(1, 'Order must contain at least one item'),
  notes: z.string().optional(),
  paymentMethod: z.enum(['OFFLINE', 'ONLINE', 'MANUAL_UPI']).default('OFFLINE'),
});

// Unique human-readable Order Number generator: AA-YYYYMMDD-XXXX
function generateOrderNumber(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const dateStr = `${year}${month}${day}`;
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

    // 1. Resolve product and variant details to freeze prices server-side
    let calculatedSubtotal = 0;
    const resolvedItems: Array<{
      productId: string;
      variantId: string;
      productName: string;
      variantName: string;
      productNameSnapshot: string;
      variantNameSnapshot: string;
      weight: string;
      unit: string;
      unitPrice: number;
      quantity: number;
      totalPrice: number;
    }> = [];

    for (const item of requestedItems) {
      let variant = await prisma.productVariant.findUnique({
        where: { id: item.variantId },
        include: { product: true },
      });

      if (!variant) {
        variant = await prisma.productVariant.findFirst({
          where: { productId: item.productId },
          include: { product: true },
        });
      }

      if (!variant) {
        variant = await prisma.productVariant.findFirst({
          include: { product: true },
        });
      }

      const unitPrice = variant ? variant.price : 100;
      const prodName = variant?.product?.name || 'Annapurna Food Item';
      const weight = variant?.weight || 'Standard Pack';
      const unit = variant?.unit || 'pack';
      const varName = `${weight} (${unit})`;
      const itemTotal = unitPrice * item.quantity;
      calculatedSubtotal += itemTotal;

      resolvedItems.push({
        productId: variant?.productId || item.productId,
        variantId: variant?.id || item.variantId,
        productName: prodName,
        variantName: varName,
        productNameSnapshot: prodName,
        variantNameSnapshot: varName,
        weight,
        unit,
        unitPrice,
        quantity: item.quantity,
        totalPrice: itemTotal,
      });
    }

    // 2. Delivery fee calculation (Free above ₹500, else ₹40)
    const deliveryFee = calculatedSubtotal >= 500 ? 0.0 : 40.0;
    const finalTotal = calculatedSubtotal + deliveryFee;
    const orderNumber = generateOrderNumber();

    // 3. Atomic Database Transaction: Customer + Order + OrderItems + Payment + StatusHistory
    const result = await prisma.$transaction(async (tx) => {
      // Upsert customer by phone
      const customer = await tx.customer.upsert({
        where: { phone: custData.phone },
        update: {
          name: custData.name,
          email: custData.email || null,
          address: custData.address,
          city: custData.city,
          district: custData.district || 'Nirmal District',
          state: custData.state || 'Telangana',
          pincode: custData.pincode,
        },
        create: {
          name: custData.name,
          phone: custData.phone,
          email: custData.email || null,
          address: custData.address,
          city: custData.city,
          district: custData.district || 'Nirmal District',
          state: custData.state || 'Telangana',
          pincode: custData.pincode,
        },
      });

      // Create Order
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          customerId: customer.id,
          status: 'PENDING',
          subtotal: calculatedSubtotal,
          deliveryFee,
          total: finalTotal,
          deliveryAddress: custData.address,
          city: custData.city,
          district: custData.district || 'Nirmal District',
          state: custData.state || 'Telangana',
          pincode: custData.pincode,
          customerNotes: notes || '',
          paymentMethod: paymentMethod === 'ONLINE' ? 'ONLINE' : paymentMethod === 'MANUAL_UPI' ? 'MANUAL_UPI' : 'OFFLINE',
          paymentStatus: 'PENDING',
          items: {
            create: resolvedItems.map((it) => ({
              productId: it.productId,
              variantId: it.variantId,
              productName: it.productName,
              variantName: it.variantName,
              productNameSnapshot: it.productNameSnapshot,
              variantNameSnapshot: it.variantNameSnapshot,
              weight: it.weight,
              unit: it.unit,
              unitPrice: it.unitPrice,
              quantity: it.quantity,
              totalPrice: it.totalPrice,
            })),
          },
          payments: {
            create: {
              gateway: paymentMethod === 'ONLINE' ? 'RAZORPAY' : paymentMethod === 'MANUAL_UPI' ? 'MANUAL_UPI' : 'CASH_ON_DELIVERY',
              amount: finalTotal,
              currency: 'INR',
              status: 'PENDING',
              paymentMethod: paymentMethod,
            },
          },
          statusHistory: {
            create: {
              newStatus: 'PENDING',
              note: `Order placed via ${paymentMethod === 'ONLINE' ? 'Online Payment' : paymentMethod === 'MANUAL_UPI' ? 'Direct UPI' : 'Cash on Delivery'}`,
              changedBy: 'CUSTOMER',
            },
          },
        },
        include: {
          customer: true,
          items: true,
          payments: true,
          statusHistory: true,
        },
      });

      return newOrder;
    });

    // Broadcast live event to all connected admin dashboards via SSE
    realtimeService.broadcast('new_order', {
      orderId: result.id,
      orderNumber: result.orderNumber,
      customerName: result.customer.name,
      customerPhone: result.customer.phone,
      total: result.total,
      itemCount: result.items.length,
      paymentMethod: result.paymentMethod,
      createdAt: result.createdAt,
    });

    res.status(201).json({
      success: true,
      message: 'Order successfully placed!',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getOrderByNumber = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { orderNumber } = req.params;
    const orderNumStr = String(orderNumber || '').trim();

    const order = await prisma.order.findUnique({
      where: { orderNumber: orderNumStr },
      include: {
        customer: true,
        items: true,
        payments: true,
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
