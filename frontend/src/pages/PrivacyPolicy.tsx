import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, Eye, FileText } from 'lucide-react';
import { SEOHead } from '../components/common/SEOHead';

export const PrivacyPolicy: React.FC = () => {
  return (
    <div className="bg-[#F8F3E7] min-h-screen py-10 lg:py-16 text-[#252525]">
      <SEOHead
        title="Privacy Policy | Annapurna Aahaar"
        description="Privacy policy and data protection standards for Annapurna Aahaar customers in Bhainsa, Nirmal District, Telangana."
        url="https://bandegangasai.github.io/annapurna-aahaar/#/privacy-policy"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-[#C79A45] uppercase tracking-widest block">
            Data Protection
          </span>
          <h1 className="font-serif font-black text-3xl sm:text-5xl text-[#173F35] leading-tight">
            Privacy Policy
          </h1>
          <p className="text-stone-muted text-sm sm:text-base">
            How Annapurna Aahaar securely handles customer information, orders, and payment data.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#C79A45]/30 shadow-subtle space-y-8 text-stone-primary leading-relaxed text-sm sm:text-base">
          <section className="space-y-3">
            <h2 className="font-serif font-bold text-xl text-[#173F35]">1. Information We Collect</h2>
            <p className="text-stone-600 text-xs sm:text-sm">
              We collect minimal information necessary to fulfill your food orders and provide customer support: customer name, delivery address, phone number, and optional email address.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif font-bold text-xl text-[#173F35]">2. Use of Information</h2>
            <p className="text-stone-600 text-xs sm:text-sm">
              Your contact details are used exclusively for:
            </p>
            <ul className="text-xs sm:text-sm text-stone-600 space-y-1.5 list-disc list-inside">
              <li>Processing, packing, and dispatching your food orders.</li>
              <li>Sending live delivery status and automated order confirmations via SMS/WhatsApp.</li>
              <li>Customer service assistance through our 24/7 Telephone Helpline (<strong>9347036152</strong>).</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif font-bold text-xl text-[#173F35]">3. Payment & Data Security</h2>
            <p className="text-stone-600 text-xs sm:text-sm">
              We do not store complete credit card or debit card numbers on our servers. All digital transactions are processed securely through certified, encrypted payment gateways. UPI payments are settled directly between your UPI application and our verified business account.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif font-bold text-xl text-[#173F35]">4. No Third-Party Selling</h2>
            <p className="text-stone-600 text-xs sm:text-sm">
              Annapurna Aahaar strictly does not sell, rent, or lease customer records to any third-party marketing companies.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif font-bold text-xl text-[#173F35]">5. Contact Our Privacy Officer</h2>
            <p className="text-stone-600 text-xs sm:text-sm">
              For any questions regarding your data or to request deletion of order history, email us at <strong>annapurnaaahaar@gmail.com</strong> or call <strong>9347036152</strong>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
