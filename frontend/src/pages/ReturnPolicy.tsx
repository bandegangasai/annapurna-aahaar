import React from 'react';
import { Link } from 'react-router-dom';
import { RotateCcw, ShieldCheck, Clock, CheckCircle2, Phone, Mail } from 'lucide-react';
import { SEOHead } from '../components/common/SEOHead';

export const ReturnPolicy: React.FC = () => {
  return (
    <div className="bg-[#F8F3E7] min-h-screen py-10 lg:py-16 text-[#252525]">
      <SEOHead
        title="Return & Refund Policy | Annapurna Aahaar"
        description="Official 7-day return and 100% refund policy for Annapurna Aahaar food products from Bhainsa, Nirmal District, Telangana (504103)."
        url="https://annapurnaaahaar.in/#/return-policy"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-[#C79A45] uppercase tracking-widest block">
            Customer Guarantee
          </span>
          <h1 className="font-serif font-black text-3xl sm:text-5xl text-[#173F35] leading-tight">
            Return & Refund Policy
          </h1>
          <p className="text-stone-muted text-sm sm:text-base">
            Your total satisfaction with our traditional heritage food products is our topmost commitment.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#C79A45]/30 shadow-subtle space-y-8 text-stone-primary leading-relaxed text-sm sm:text-base">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-6 border-b border-stone-100">
            <div className="bg-[#FAF6EE] p-5 rounded-2xl border border-[#C79A45]/20 space-y-1">
              <RotateCcw className="w-6 h-6 text-[#C79A45]" />
              <h4 className="font-bold text-[#173F35] text-xs uppercase">7-Day Return Window</h4>
              <p className="text-xs text-stone-muted">
                Eligible returns accepted within 7 days of package delivery date.
              </p>
            </div>

            <div className="bg-[#FAF6EE] p-5 rounded-2xl border border-[#C79A45]/20 space-y-1">
              <ShieldCheck className="w-6 h-6 text-[#C79A45]" />
              <h4 className="font-bold text-[#173F35] text-xs uppercase">100% Refund Guarantee</h4>
              <p className="text-xs text-stone-muted">
                Prompt reimbursement to original payment method or instant UPI transfer.
              </p>
            </div>
          </div>

          <section className="space-y-3">
            <h2 className="font-serif font-bold text-xl text-[#173F35]">1. Return Eligibility Conditions</h2>
            <p className="text-stone-600 text-xs sm:text-sm">
              Because our food items are freshly prepared and consumable, returns are accepted under the following situations:
            </p>
            <ul className="text-xs sm:text-sm text-stone-600 space-y-1.5 list-disc list-inside">
              <li>Item received is damaged in transit or packaging seal is broken upon arrival.</li>
              <li>Incorrect item or weight variant was delivered compared to your order confirmation.</li>
              <li>Product quality or seal defect verified by our customer support.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif font-bold text-xl text-[#173F35]">2. How to Request a Return or Replacement</h2>
            <p className="text-stone-600 text-xs sm:text-sm">
              To initiate a return or replacement, contact our customer desk within <strong>7 days</strong> of delivery:
            </p>
            <ul className="text-xs sm:text-sm text-stone-600 space-y-1.5 list-disc list-inside">
              <li><strong>24/7 Telephone Helpline:</strong> Call <strong>9347036152</strong></li>
              <li><strong>Email Support:</strong> Send order number and photo to <strong>annapurnaaahaar@gmail.com</strong></li>
              <li><strong>Online Contact Desk:</strong> Submit a request via our <Link to="/contact" className="text-[#173F35] font-bold underline">Contact Page</Link></li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif font-bold text-xl text-[#173F35]">3. Refund Processing Timeline</h2>
            <p className="text-stone-600 text-xs sm:text-sm">
              Once approved, full refunds are initiated within <strong>24 to 48 hours</strong> and credited to your original bank account or UPI within <strong>3 to 5 business days</strong>.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif font-bold text-xl text-[#173F35]">4. Order Cancellations</h2>
            <p className="text-stone-600 text-xs sm:text-sm">
              Orders may be cancelled at no cost before dispatch (while status is <strong>PENDING</strong> or <strong>ACCEPTED</strong>) directly via our live tracking portal or by phone.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ReturnPolicy;
