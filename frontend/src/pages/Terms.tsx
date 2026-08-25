import React from 'react';
import { Link } from 'react-router-dom';
import { FileCheck, Shield, Scale } from 'lucide-react';
import { SEOHead } from '../components/common/SEOHead';

export const Terms: React.FC = () => {
  return (
    <div className="bg-[#F8F3E7] min-h-screen py-10 lg:py-16 text-[#252525]">
      <SEOHead
        title="Terms and Conditions | Annapurna Aahaar"
        description="Terms of service and commercial policies for Annapurna Aahaar e-commerce and voice telephony ordering."
        url="https://bandegangasai.github.io/annapurna-aahaar/#/terms"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-[#C79A45] uppercase tracking-widest block">
            Legal & Operations
          </span>
          <h1 className="font-serif font-black text-3xl sm:text-5xl text-[#173F35] leading-tight">
            Terms & Conditions
          </h1>
          <p className="text-stone-muted text-sm sm:text-base">
            Terms governing purchases, deliveries, and telephone ordering with Annapurna Aahaar.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#C79A45]/30 shadow-subtle space-y-8 text-stone-primary leading-relaxed text-sm sm:text-base">
          <section className="space-y-3">
            <h2 className="font-serif font-bold text-xl text-[#173F35]">1. Overview & Business Identity</h2>
            <p className="text-stone-600 text-xs sm:text-sm">
              These terms apply to all transactions conducted on the <strong>Annapurna Aahaar</strong> web storefront or via our automated 24/7 Telephone Helpline (<strong>9347036152</strong>), founded and operated by <strong>Bande Omkar</strong> in Bhainsa, Nirmal District, Telangana (504103).
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif font-bold text-xl text-[#173F35]">2. Product Availability & Pricing</h2>
            <p className="text-stone-600 text-xs sm:text-sm">
              All prices listed on the storefront are in Indian Rupees (INR) and are inclusive of packaging. We strive for 100% stock accuracy, but in rare events where an item is temporarily unavailable, we will promptly contact you for replacement or immediate full refund.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif font-bold text-xl text-[#173F35]">3. Delivery & Dispatch</h2>
            <p className="text-stone-600 text-xs sm:text-sm">
              Delivery timelines range between 2 to 5 business days across India. While we make every effort to deliver within estimated schedules, delays caused by unforeseen postal or weather circumstances are resolved expeditiously by our customer support.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif font-bold text-xl text-[#173F35]">4. Intellectual Property & Brand</h2>
            <p className="text-stone-600 text-xs sm:text-sm">
              The brand name <strong>Annapurna Aahaar</strong>, our logo emblem, and culinary recipes are proprietary heritage assets of Bande Omkar, Bhainsa, Telangana.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif font-bold text-xl text-[#173F35]">5. Governing Jurisdiction</h2>
            <p className="text-stone-600 text-xs sm:text-sm">
              Any dispute arising out of or related to commercial transactions shall be governed by the laws applicable in Telangana, India, with jurisdiction in Nirmal District courts.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Terms;
