import React, { useState } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Phone, Headphones } from 'lucide-react';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { CartDrawer } from './components/cart/CartDrawer';
import { IvrCallModal } from './components/ivr/IvrCallModal';

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
  const { t } = useLanguage();
  const isAdminDashboard =
    location.pathname.startsWith('/admin/dashboard') ||
    location.pathname.startsWith('/admin/call-center');

  const [isIvrModalOpen, setIsIvrModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col justify-between pb-16 md:pb-0 bg-[#F8F3E7] text-[#252525]">
      {!isAdminDashboard && <Navbar />}
      {!isAdminDashboard && <CartDrawer />}
      <main className="flex-grow">{children}</main>
      {!isAdminDashboard && <Footer />}

      {/* Interactive Voice IVR Call Modal */}
      <IvrCallModal
        isOpen={isIvrModalOpen}
        onClose={() => setIsIvrModalOpen(false)}
        defaultPhone="9848012345"
      />

      {/* Floating Desktop Quick Voice Simulator Button */}
      {!isAdminDashboard && (
        <div className="fixed bottom-5 right-5 z-40 hidden md:block">
          <button
            onClick={() => setIsIvrModalOpen(true)}
            className="flex items-center gap-2.5 bg-[#173F35] text-[#F8F3E7] font-bold px-5 py-3 rounded-full shadow-2xl border-2 border-[#C79A45] hover:bg-[#0C241E] hover:scale-105 transition-all"
            title="Open Interactive IVR Voice Dialer (English, Marathi, Hindi, Telugu)"
          >
            <Headphones className="w-5 h-5 text-[#C79A45] animate-pulse" />
            <span className="text-xs tracking-wide">Interactive IVR Simulator</span>
          </button>
        </div>
      )}

      {/* Large Mobile Sticky "CALL TO ORDER" Quick-Dial Button */}
      {!isAdminDashboard && (
        <div className="fixed bottom-3 left-3 right-3 z-40 md:hidden animate-fade-in flex gap-2">
          <a
            href="tel:9347036152"
            className="flex-1 flex items-center justify-center gap-2 bg-[#173F35] text-[#F8F3E7] font-black py-3.5 px-3 rounded-2xl shadow-2xl border-2 border-[#C79A45] text-xs tracking-wider transform active:scale-95 transition-all"
            title="24/7 Telephone IVR Ordering: 9347036152"
          >
            <Phone className="w-4 h-4 text-[#C79A45] animate-bounce" />
            <span>{t('nav_call_to_order')}: 9347036152</span>
          </a>

          <button
            onClick={() => setIsIvrModalOpen(true)}
            className="bg-[#0C241E] border-2 border-[#C79A45] text-[#C79A45] p-3.5 rounded-2xl shadow-2xl flex items-center justify-center active:scale-95"
            title="Test Voice Simulator"
          >
            <Headphones className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export function App() {
  return (
    <LanguageProvider>
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
    </LanguageProvider>
  );
}

export default App;
