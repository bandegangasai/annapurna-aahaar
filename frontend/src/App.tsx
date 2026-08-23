import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { CartDrawer } from './components/cart/CartDrawer';

// Pages
import { Home } from './pages/Home';
import { Products } from './pages/Products';
import { ProductDetail } from './pages/ProductDetail';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { OrderSuccess } from './pages/OrderSuccess';
import { OrderTrack } from './pages/OrderTrack';
import { OurStory } from './pages/OurStory';
import { WhyUs } from './pages/WhyUs';
import { Contact } from './pages/Contact';
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isAdminDashboard = location.pathname.startsWith('/admin/dashboard');

  return (
    <div className="min-h-screen flex flex-col justify-between">
      {!isAdminDashboard && <Navbar />}
      {!isAdminDashboard && <CartDrawer />}
      <main className="flex-grow">{children}</main>
      {!isAdminDashboard && <Footer />}
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <ToastProvider>
          <BrowserRouter>
            <AppLayout>
              <Routes>
                {/* Storefront Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:slug" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/order-success/:orderNumber" element={<OrderSuccess />} />
                <Route path="/track" element={<OrderTrack />} />
                <Route path="/track/:orderNumber" element={<OrderTrack />} />
                <Route path="/our-story" element={<OurStory />} />
                <Route path="/why-us" element={<WhyUs />} />
                <Route path="/contact" element={<Contact />} />

                {/* Admin Management Routes */}
                <Route path="/admin" element={<AdminLogin />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />

                {/* Fallback 404 */}
                <Route path="*" element={<Home />} />
              </Routes>
            </AppLayout>
          </BrowserRouter>
        </ToastProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
