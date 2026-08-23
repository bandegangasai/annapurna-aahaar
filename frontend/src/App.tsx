import React from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Phone } from 'lucide-react';
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
  const isAdminDashboard = location.pathname.startsWith('/admin/dashboard') || location.pathname.startsWith('/admin/call-center');

  return (
    <div className="min-h-screen flex flex-col justify-between pb-16 md:pb-0">
      {!isAdminDashboard && <Navbar />}
      {!isAdminDashboard && <CartDrawer />}
      <main className="flex-grow">{children}</main>
      {!isAdminDashboard && <Footer />}

      {/* Large Mobile Sticky "CALL TO ORDER" Quick-Dial Button */}
      {!isAdminDashboard && (
        <div className="fixed bottom-3 left-3 right-3 z-40 md:hidden animate-fade-in">
          <a
            href="tel:9347036152"
            className="w-full flex items-center justify-center gap-2.5 bg-gradient-to-r from-amber-600 via-amber-700 to-heritage-maroon text-white font-black py-3.5 px-4 rounded-2xl shadow-2xl border-2 border-amber-300/40 text-sm tracking-wide transform active:scale-95 transition-all"
            title="24/7 Telephone IVR Ordering: 9347036152"
          >
            <Phone className="w-5 h-5 animate-pulse text-amber-200" />
            <span>CALL TO ORDER: 9347036152</span>
          </a>
        </div>
      )}
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <ToastProvider>
          <HashRouter>
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
                <Route path="/admin/call-center" element={<AdminDashboard initialTab="call-center" />} />

                {/* Fallback 404 */}
                <Route path="*" element={<Home />} />
              </Routes>
            </AppLayout>
          </HashRouter>
        </ToastProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
