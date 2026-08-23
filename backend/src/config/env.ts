import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
  PORT: process.env.PORT || '5000',
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL || 'file:./dev.db',
  JWT_SECRET: process.env.JWT_SECRET || 'annapurna_secret_key_change_in_production_2026',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  LIVE_SITE_URL: process.env.LIVE_SITE_URL || 'https://bandegangasai.github.io/annapurna-aahaar',

  // Real Verified Business Information
  BUSINESS_NAME: 'Annapurna Aahaar',
  BUSINESS_TAGLINE: 'Tradition in Every Grain.',
  BUSINESS_OWNER: 'Bande Omkar',
  BUSINESS_LOCATION: 'Bhainsa, Nirmal District, Telangana',
  BUSINESS_PINCODE: '504103',
  BUSINESS_PHONE_PRIMARY: process.env.BUSINESS_PHONE_1 || '6305970844',
  BUSINESS_PHONE_SECONDARY: process.env.BUSINESS_PHONE_2 || '8688456925',
  BUSINESS_EMAIL: process.env.BUSINESS_EMAIL || 'annapurnaaahaar@gmail.com',

  // Email Notifications (Gmail SMTP / Transactional)
  GMAIL_USER: process.env.GMAIL_USER || 'annapurnaaahaar@gmail.com',
  GMAIL_APP_PASSWORD: process.env.GMAIL_APP_PASSWORD || process.env.SMTP_PASSWORD || '',
  SMTP_HOST: process.env.SMTP_HOST || 'smtp.gmail.com',
  SMTP_PORT: parseInt(process.env.SMTP_PORT || '465', 10),

  // SMS Gateway Configuration
  SMS_API_KEY: process.env.SMS_API_KEY || '',
  SMS_SENDER_ID: process.env.SMS_SENDER_ID || 'ANNAHR',

  // Payment Configuration
  BUSINESS_PAYMENT_MOBILE: process.env.BUSINESS_PAYMENT_MOBILE || '9542826358',
  BUSINESS_UPI_ID: process.env.BUSINESS_UPI_ID || '9542826358@ybl', // Verified PhonePe / IPPB VPA
  BUSINESS_UPI_BANK: 'India Post Payment Bank - 3676',

  // Razorpay Online Payment Credentials
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder_key',
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET || 'rzp_test_placeholder_secret',
  RAZORPAY_WEBHOOK_SECRET: process.env.RAZORPAY_WEBHOOK_SECRET || '',

  // Admin Credentials
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'admin@annapurnaaahaar.in',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'Admin@Annapurna2026',
  ADMIN_NAME: 'Bande Omkar (Admin)',
};
