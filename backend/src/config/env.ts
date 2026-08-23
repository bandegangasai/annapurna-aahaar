import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
  PORT: process.env.PORT || '5000',
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL || 'file:./dev.db',
  JWT_SECRET: process.env.JWT_SECRET || 'annapurna_secret_key_change_in_production_2026',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  BUSINESS_NAME: process.env.BUSINESS_NAME || 'Annapurna Aahaar',
  BUSINESS_TAGLINE: process.env.BUSINESS_TAGLINE || 'Tradition in Every Grain.',
  BUSINESS_PHONE: process.env.BUSINESS_PHONE || '+91 98765 43210',
  BUSINESS_EMAIL: process.env.BUSINESS_EMAIL || 'contact@annapurnaaahaar.in',
  BUSINESS_ADDRESS: process.env.BUSINESS_ADDRESS || 'Near Traditional Grain Market, Industrial Area, India',
  BUSINESS_WHATSAPP: process.env.BUSINESS_WHATSAPP || '+91 98765 43210',
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'admin@annapurnaaahaar.in',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'Admin@Annapurna2026',
  ADMIN_NAME: process.env.ADMIN_NAME || 'Annapurna Admin',
};
