import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, ChevronDown, Phone, Mail, ArrowRight, ShieldCheck, Truck, Sparkles } from 'lucide-react';
import { SEOHead } from '../components/common/SEOHead';
import { useLanguage } from '../context/LanguageContext';

export const FAQ: React.FC = () => {
  const { t } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Where are Annapurna Aahaar food products prepared and manufactured?',
      a: 'All our authentic traditional products — including whole wheat sevaya, sun-cured papads, and pure golden turmeric powder — are handcrafted directly in Bhainsa, Nirmal District, Telangana (PIN: 504103), India, using heritage recipes and regional farm ingredients.',
    },
    {
      q: 'Are any artificial colors or chemical preservatives added to the products?',
      a: 'Never. We take deep pride in 100% pure, natural culinary traditions. Our turmeric is stone-ground from pure farm roots, our sevaya is sun-dried whole wheat vermicelli, and our papads are sun-cured with authentic regional spices, hing, and rock salt without chemical additives.',
    },
    {
      q: 'What are the delivery charges and timelines?',
      a: 'We provide flat-rate standard delivery across Telangana and All India for ₹40. Orders of ₹500 or more qualify for 100% FREE SHIPPING. Delivery usually takes 2 to 5 business days depending on your delivery address.',
    },
    {
      q: 'How can I place an order over the phone?',
      a: 'You can dial our 24/7 Telephone Voice Helpline at 9347036152. Our automated multilingual voice system guides you through placing orders in English, Marathi (मराठी), Hindi (हिन्दी), or Telugu (తెలుగు) with automated SMS confirmation.',
    },
    {
      q: 'What payment methods are supported?',
      a: 'We support Cash on Delivery (COD), direct UPI transfer (to our official UPI 9542836358@ybl), and secure online digital payments through Debit/Credit Cards and NetBanking.',
    },
    {
      q: 'What is your return and refund policy?',
      a: 'We offer a hassle-free 7-day return policy for sealed, unopened, or transit-damaged items. Upon verification, full refunds are processed to your original payment method or UPI within 3-5 business days.',
    },
    {
      q: 'How do I track my order in real-time?',
      a: 'Visit our Live Tracking page (or click "Track Order" in the navigation bar) and enter your Order Number (e.g. AA-20260825-1001) for instant status updates from kitchen dispatch to delivery.',
    },
  ];

  return (
    <div className="bg-[#F8F3E7] min-h-screen py-10 lg:py-16 text-[#252525]">
      <SEOHead
        title="Frequently Asked Questions (FAQ) | Annapurna Aahaar"
        description="Find answers to common questions about Annapurna Aahaar food products, delivery timelines, ingredients, 24/7 telephone ordering (9347036152), and returns."
        url="https://bandegangasai.github.io/annapurna-aahaar/#/faq"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-[#C79A45] uppercase tracking-widest block">
            Customer Help Center
          </span>
          <h1 className="font-serif font-black text-3xl sm:text-5xl text-[#173F35] leading-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-stone-muted text-sm sm:text-base">
            Everything you need to know about our handcrafted products, telephone ordering, and shipping.
          </p>
        </div>

        {/* Accordion FAQ List */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#C79A45]/30 shadow-subtle divide-y divide-stone-100">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={idx} className="py-5 first:pt-0 last:pb-0">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between gap-4 text-left font-serif font-bold text-base sm:text-lg text-[#173F35] hover:text-[#C79A45] transition-colors"
                >
                  <span className="flex items-center gap-3">
                    <HelpCircle className="w-5 h-5 text-[#C79A45] shrink-0" />
                    <span>{faq.q}</span>
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#C79A45] shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="mt-3 pl-8 pr-2 text-xs sm:text-sm text-stone-600 leading-relaxed animate-fade-in">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Contact Support Banner */}
        <div className="bg-gradient-to-br from-[#173F35] to-[#0C241E] text-[#F8F3E7] p-8 rounded-3xl border border-[#C79A45]/40 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="font-serif font-bold text-xl text-[#C79A45]">Have More Questions?</h3>
            <p className="text-xs text-stone-300">
              Our team in Bhainsa is here to help you via phone, WhatsApp, or email.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href="tel:9347036152"
              className="bg-[#C79A45] text-[#173F35] hover:bg-[#D5AD56] font-bold text-xs px-5 py-3 rounded-2xl shadow-md flex items-center gap-2 transition-all"
            >
              <Phone className="w-4 h-4" />
              <span>Call 9347036152</span>
            </a>
            <Link
              to="/contact"
              className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-5 py-3 rounded-2xl border border-white/20 flex items-center gap-2 transition-all"
            >
              <Mail className="w-4 h-4 text-[#C79A45]" />
              <span>Contact Desk</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
