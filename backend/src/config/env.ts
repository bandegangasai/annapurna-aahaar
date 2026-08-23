import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
  PORT: process.env.PORT || '5000',
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL || 'file:./dev.db',
  JWT_SECRET: process.env.JWT_SECRET || 'annapurna_secret_key_change_in_production_2026',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',

  // Real Verified Business Information
  BUSINESS_NAME: 'Annapurna Aahaar',
  BUSINESS_TAGLINE: 'Tradition in Every Grain.',
  BUSINESS_OWNER: 'Bande Omkar',
  BUSINESS_LOCATION: 'Bhainsa, Nirmal District, Telangana',
  BUSINESS_PINCODE: '504103',
  BUSINESS_PHONE_PRIMARY: '6305970844',
  BUSINESS_PHONE_SECONDARY: '8688456925',
  BUSINESS_EMAIL: 'annapurnaaahaar@gmail.com',

  // Razorpay Online Payment Credentials
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder_key',
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET || 'rzp_test_placeholder_secret',

  // Admin Credentials
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'admin@annapurnaaahaar.in',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'Admin@Annapurna2026',
  ADMIN_NAME: 'Bande Omkar (Admin)',
};
