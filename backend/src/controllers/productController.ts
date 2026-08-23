import { Request, Response, NextFunction } from 'express';
import prisma from '../config/prisma';

export const getProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { category, search, featured, active } = req.query;

    const where: any = {};

    if (active !== 'all') {
      where.isActive = true;
    }

    if (category && typeof category === 'string' && category !== 'All') {
      where.category = { equals: category };
    }

    if (featured === 'true') {
      where.isFeatured = true;
    }

    if (search && typeof search === 'string') {
      const term = search.trim();
      where.OR = [
        { name: { contains: term } },
        { description: { contains: term } },
        { category: { contains: term } },
      ];
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        variants: {
          where: { isActive: true },
          orderBy: { price: 'asc' },
        },
      },
      orderBy: [{ isFeatured: 'desc' }, { createdAt: 'asc' }],
    });

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

export const getProductBySlug = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { slug } = req.params as { slug: string };

    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        variants: {
          where: { isActive: true },
          orderBy: { price: 'asc' },
        },
      },
    });

    if (!product) {
      res.status(404).json({
        success: false,
        message: `Product with slug '${slug}' not found`,
      });
      return;
    }

    // Get related products from the same category
    const related = await prisma.product.findMany({
      where: {
        category: product.category,
        id: { not: product.id },
        isActive: true,
      },
      include: {
        variants: {
          where: { isActive: true },
          orderBy: { price: 'asc' },
        },
      },
      take: 4,
    });

    res.status(200).json({
      success: true,
      data: {
        ...product,
        related,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      select: { category: true },
    });

    const counts: Record<string, number> = {};
    for (const p of products) {
      counts[p.category] = (counts[p.category] || 0) + 1;
    }

    const categories = Object.keys(counts).map((name) => ({
      name,
      count: counts[name],
    }));

    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};
