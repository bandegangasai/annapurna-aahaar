import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import prisma from '../config/prisma';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit mobile number'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  subject: z.string().optional(),
  message: z.string().min(5, 'Message must be at least 5 characters'),
});

export const submitContactMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, phone, email, subject, message } = contactSchema.parse(req.body);

    const newMessage = await prisma.contactMessage.create({
      data: {
        name,
        phone,
        email: email || null,
        subject: subject || 'General Enquiry',
        message,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Thank you for reaching out! We have received your message and will contact you shortly.',
      data: newMessage,
    });
  } catch (error) {
    next(error);
  }
};
