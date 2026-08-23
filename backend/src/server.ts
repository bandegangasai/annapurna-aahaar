import express from 'express';
import cors from 'cors';
import { ENV } from './config/env';
import productRoutes from './routes/productRoutes';
import orderRoutes from './routes/orderRoutes';
import adminRoutes from './routes/adminRoutes';
import contactRoutes from './routes/contactRoutes';
import paymentRoutes from './routes/paymentRoutes';
import ivrRoutes from './routes/ivrRoutes';
import { errorHandler } from './middleware/errorHandler';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    service: 'Annapurna Aahaar API',
    owner: ENV.BUSINESS_OWNER,
    location: ENV.BUSINESS_LOCATION,
    pincode: ENV.BUSINESS_PINCODE,
    ivrNumber: ENV.IVR_PHONE_NUMBER || '9347036152',
    timestamp: new Date().toISOString(),
    version: '2.0.0',
  });
});

// Business Profile Endpoint (Verified)
app.get('/api/business-info', (req, res) => {
  res.status(200).json({
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
  });
});

// Route registration
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/ivr', ivrRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/contact', contactRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint ${req.method} ${req.originalUrl} not found`,
  });
});

// Global Error Handler
app.use(errorHandler);

// Start server
if (process.env.NODE_ENV !== 'test') {
  const server = app.listen(ENV.PORT, () => {
    console.log(
      `🌾 Annapurna Aahaar Backend running on port ${ENV.PORT} [${ENV.NODE_ENV}]`
    );
    console.log(`📍 Business: ${ENV.BUSINESS_NAME} (Bande Omkar - Bhainsa, Nirmal, Telangana)`);
    console.log(`📞 Dedicated IVR Number: ${ENV.IVR_PHONE_NUMBER || '9347036152'}`);
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
      console.log('HTTP server closed');
    });
  });
}

export default app;
