import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ShoppingBag, Home, Phone, ArrowLeft } from 'lucide-react';
import { SEOHead } from '../components/common/SEOHead';

export const NotFound: React.FC = () => {
  return (
    <div className="bg-[#F8F3E7] min-h-[80vh] flex items-center justify-center py-16 px-4 text-[#252525]">
      <SEOHead
        title="Page Not Found (404) | Annapurna Aahaar"
        description="The page you are looking for does not exist. Browse authentic Indian food products from Annapurna Aahaar, Bhainsa, Telangana."
        url="https://annapurnaaahaar.in/#/404"
      />

      <div className="max-w-lg w-full bg-white rounded-3xl p-8 sm:p-12 border border-[#C79A45]/30 shadow-subtle text-center space-y-6">
        {/* Decorative Heritage Emblem */}
        <div className="w-20 h-20 rounded-full bg-[#173F35] text-[#C79A45] flex items-center justify-center mx-auto shadow-lg border-2 border-[#C79A45]">
          <Compass className="w-10 h-10 animate-spin-slow" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold text-[#C79A45] uppercase tracking-widest block">
            Error 404 • Page Not Found
          </span>
          <h1 className="font-serif font-black text-3xl sm:text-4xl text-[#173F35]">
            Lost in the Spices?
          </h1>
          <p className="text-stone-muted text-sm sm:text-base leading-relaxed">
            The page you are searching for might have been moved or is temporarily unavailable. Let us guide you back to our authentic handcrafted foods.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <Link
            to="/"
            className="bg-[#173F35] hover:bg-[#0C241E] text-[#F8F3E7] font-bold text-xs sm:text-sm py-3.5 px-4 rounded-2xl shadow-md flex items-center justify-center gap-2 border border-[#C79A45]/30 transition-all"
          >
            <Home className="w-4 h-4 text-[#C79A45]" />
            <span>Return to Home</span>
          </Link>

          <Link
            to="/products"
            className="bg-[#C79A45] hover:bg-[#D5AD56] text-[#173F35] font-bold text-xs sm:text-sm py-3.5 px-4 rounded-2xl shadow-md flex items-center justify-center gap-2 transition-all"
          >
            <ShoppingBag className="w-4 h-4 text-[#173F35]" />
            <span>View All Products</span>
          </Link>
        </div>

        {/* Telephone Ordering Support Link */}
        <div className="pt-4 border-t border-stone-100">
          <a
            href="tel:9347036152"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#173F35] hover:text-[#C79A45] transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-[#C79A45]" />
            <span>Need Help? Call 9347036152 (24/7 Helpline)</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
