import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import prisma from '../config/prisma';
import { ENV } from '../config/env';
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
  paymentStatus: z.enum(['PENDING', 'PAID', 'FAILED', 'REFUNDED']).optional(),
  note: z.string().optional(),
});

const updateVariantPriceSchema = z.object({
  price: z.number().min(0, 'Price must be non-negative'),
  stock: z.number().int().optional(),
});

export const loginAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const admin = await prisma.adminUser.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!admin) {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
      return;
    }

    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
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
      { expiresIn: '7d' }
    );

    res.status(200).json({
      success: true,
      message: 'Admin login successful',
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
    const { status, search, limit = '50', page = '1' } = req.query;

    const where: any = {};

    if (status && typeof status === 'string' && status !== 'ALL') {
      where.status = status.toUpperCase();
    }

    if (search && typeof search === 'string') {
      const term = search.trim();
      where.OR = [
        { orderNumber: { contains: term } },
        { customer: { name: { contains: term } } },
        { customer: { phone: { contains: term } } },
        { customer: { city: { contains: term } } },
      ];
    }

    const take = parseInt(limit as string, 10) || 50;
    const skip = ((parseInt(page as string, 10) || 1) - 1) * take;

    const [orders, totalCount] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          customer: true,
          items: true,
          statusHistory: {
            orderBy: { createdAt: 'asc' },
          },
        },
        orderBy: { createdAt: 'desc' },
        take,
        skip,
      }),
      prisma.order.count({ where }),
    ]);

    res.status(200).json({
      success: true,
      data: orders,
      pagination: {
        total: totalCount,
        page: parseInt(page as string, 10) || 1,
        limit: take,
        totalPages: Math.ceil(totalCount / take),
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
    const { id } = req.params as { id: string };

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        customer: true,
        items: true,
        statusHistory: {
          orderBy: { createdAt: 'asc' },
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
    const { id } = req.params as { id: string };
    const { status, paymentStatus, note } = updateStatusSchema.parse(req.body);

    const existingOrder = await prisma.order.findUnique({
      where: { id },
    });

    if (!existingOrder) {
      res.status(404).json({ success: false, message: 'Order not found' });
      return;
    }

    const previousStatus = existingOrder.status;
    const dataToUpdate: any = { status };

    if (paymentStatus) {
      dataToUpdate.paymentStatus = paymentStatus;
    }

    // Update order status and record history in a transaction
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        ...dataToUpdate,
        statusHistory: {
          create: {
            previousStatus,
            newStatus: status,
            note: note || `Order status updated to ${status} by admin`,
            changedBy: req.admin?.name || 'Bande Omkar (Admin)',
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
      message: `Order #${updatedOrder.orderNumber} updated to ${status}`,
      data: updatedOrder,
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminStats = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const [
      totalOrders,
      pendingOrders,
      acceptedOrders,
      processingOrders,
      deliveredOrders,
      rejectedOrders,
      paidOrdersCount,
      ordersWithTotals,
      totalCustomers,
      unreadContacts,
    ] = await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { status: 'PENDING' } }),
      prisma.order.count({ where: { status: 'ACCEPTED' } }),
      prisma.order.count({ where: { status: 'PROCESSING' } }),
      prisma.order.count({ where: { status: 'DELIVERED' } }),
      prisma.order.count({ where: { status: 'REJECTED' } }),
      prisma.order.count({ where: { paymentStatus: 'PAID' } }),
      prisma.order.findMany({
        where: { status: { notIn: ['REJECTED', 'CANCELLED'] } },
        select: { total: true },
      }),
      prisma.customer.count(),
      prisma.contactMessage.count({ where: { isRead: false } }),
    ]);

    const totalRevenue = ordersWithTotals.reduce((acc, curr) => acc + curr.total, 0);

    res.status(200).json({
      success: true,
      data: {
        totalOrders,
        pendingOrders,
        acceptedOrders,
        processingOrders,
        deliveredOrders,
        rejectedOrders,
        paidOrdersCount,
        totalRevenue,
        totalCustomers,
        unreadContacts,
        business: {
          name: ENV.BUSINESS_NAME,
          owner: ENV.BUSINESS_OWNER,
          location: ENV.BUSINESS_LOCATION,
          pincode: ENV.BUSINESS_PINCODE,
          phones: [ENV.BUSINESS_PHONE_PRIMARY, ENV.BUSINESS_PHONE_SECONDARY],
          email: ENV.BUSINESS_EMAIL,
        },
      },
    });
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
    });

    res.status(200).json({
      success: true,
      data: messages,
    });
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
    const { id } = req.params as { id: string };

    const message = await prisma.contactMessage.update({
      where: { id },
      data: { isRead: true },
    });

    res.status(200).json({
      success: true,
      data: message,
    });
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
      include: { variants: true },
      orderBy: { createdAt: 'asc' },
    });

    res.status(200).json({ success: true, data: products });
  } catch (error) {
    next(error);
  }
};

export const adminUpdateVariantPrice = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { variantId } = req.params as { variantId: string };
    const { price, stock } = updateVariantPriceSchema.parse(req.body);

    const updated = await prisma.productVariant.update({
      where: { id: variantId },
      data: {
        price,
        ...(typeof stock === 'number' ? { stock } : {}),
      },
    });

    res.status(200).json({
      success: true,
      message: 'Product variant updated successfully',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};
