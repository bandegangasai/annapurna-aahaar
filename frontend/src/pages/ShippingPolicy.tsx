import React from 'react';
import { Link } from 'react-router-dom';
import { Truck, Clock, ShieldCheck, MapPin, Phone, ArrowLeft } from 'lucide-react';
import { SEOHead } from '../components/common/SEOHead';

export const ShippingPolicy: React.FC = () => {
  return (
    <div className="bg-[#F8F3E7] min-h-screen py-10 lg:py-16 text-[#252525]">
      <SEOHead
        title="Shipping & Delivery Policy | Annapurna Aahaar"
        description="Official shipping and delivery terms for Annapurna Aahaar. Flat rate ₹40 delivery, FREE SHIPPING above ₹500, and fast dispatch across Telangana & All India."
        url="https://annapurnaaahaar.in/#/shipping-policy"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-[#C79A45] uppercase tracking-widest block">
            Transparent & Reliable
          </span>
          <h1 className="font-serif font-black text-3xl sm:text-5xl text-[#173F35] leading-tight">
            Shipping & Delivery Policy
          </h1>
          <p className="text-stone-muted text-sm sm:text-base">
            How we carefully pack and swiftly deliver authentic Indian food products to your doorstep.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#C79A45]/30 shadow-subtle space-y-8 text-stone-primary leading-relaxed text-sm sm:text-base">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-6 border-b border-stone-100">
            <div className="bg-[#FAF6EE] p-5 rounded-2xl border border-[#C79A45]/20 text-center space-y-1">
              <Truck className="w-6 h-6 text-[#C79A45] mx-auto" />
              <h4 className="font-bold text-[#173F35] text-xs uppercase">Flat Rate Delivery</h4>
              <p className="font-serif font-black text-xl text-[#173F35]">₹40 Flat</p>
              <p className="text-[11px] text-stone-muted">Across Telangana & India</p>
            </div>

            <div className="bg-[#FAF6EE] p-5 rounded-2xl border border-[#C79A45]/20 text-center space-y-1">
              <ShieldCheck className="w-6 h-6 text-[#C79A45] mx-auto" />
              <h4 className="font-bold text-[#173F35] text-xs uppercase">Free Shipping</h4>
              <p className="font-serif font-black text-xl text-[#173F35]">Orders ₹500+</p>
              <p className="text-[11px] text-stone-muted">Automatic free shipping</p>
            </div>

            <div className="bg-[#FAF6EE] p-5 rounded-2xl border border-[#C79A45]/20 text-center space-y-1">
              <Clock className="w-6 h-6 text-[#C79A45] mx-auto" />
              <h4 className="font-bold text-[#173F35] text-xs uppercase">Delivery Time</h4>
              <p className="font-serif font-black text-xl text-[#173F35]">2 – 5 Days</p>
              <p className="text-[11px] text-stone-muted">Prompt dispatch from Bhainsa</p>
            </div>
          </div>

          <section className="space-y-3">
            <h2 className="font-serif font-bold text-xl text-[#173F35]">1. Order Dispatch & Processing</h2>
            <p className="text-stone-600 text-xs sm:text-sm">
              All orders received through our website or 24/7 Voice Helpline (<strong>9347036152</strong>) are processed and hygienically packaged at our culinary facility in Bhainsa, Nirmal District, Telangana within <strong>24 to 48 hours</strong> of order confirmation.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif font-bold text-xl text-[#173F35]">2. Shipping Regions Covered</h2>
            <p className="text-stone-600 text-xs sm:text-sm">
              We ship across all districts of <strong>Telangana</strong>, <strong>Andhra Pradesh</strong>, <strong>Maharashtra</strong>, <strong>Karnataka</strong>, and pan-India via reputable courier partners and postal delivery services.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif font-bold text-xl text-[#173F35]">3. Real-Time Order Tracking</h2>
            <p className="text-stone-600 text-xs sm:text-sm">
              Once your package is dispatched, you can track the status live on our <Link to="/track" className="text-[#173F35] font-bold underline">Order Tracking Page</Link> using your unique Order Number (e.g. AA-20260825-1001).
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif font-bold text-xl text-[#173F35]">4. Safe Food Packaging Guarantee</h2>
            <p className="text-stone-600 text-xs sm:text-sm">
              Our papads, sevaya, and stone-ground turmeric are packaged in moisture-resistant, food-grade sealed pouches to ensure zero breakage, optimal aroma retention, and fresh delivery.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ShippingPolicy;
