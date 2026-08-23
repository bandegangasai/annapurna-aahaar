import express from 'express';
import cors from 'cors';
import { ENV } from './config/env';
import productRoutes from './routes/productRoutes';
import orderRoutes from './routes/orderRoutes';
import adminRoutes from './routes/adminRoutes';
import contactRoutes from './routes/contactRoutes';
import { errorHandler } from './middleware/errorHandler';

const app = express();

// Middleware
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
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
    timestamp: new Date().toISOString(),
    version: '1.1.0',
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
    email: ENV.BUSINESS_EMAIL,
  });
});

// Route registration
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
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

const PORT = parseInt(ENV.PORT, 10) || 5000;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🌾 Annapurna Aahaar API Server running on port ${PORT}`);
    console.log(`🌾 Business: ${ENV.BUSINESS_NAME} (Owner: ${ENV.BUSINESS_OWNER}, Bhainsa, Telangana)`);
    console.log(`🌾 Health Check: http://localhost:${PORT}/api/health`);
  });
}

export default app;
