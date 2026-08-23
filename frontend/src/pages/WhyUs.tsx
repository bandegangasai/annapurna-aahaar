import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Award,
  Sun,
  ShieldCheck,
  Flame,
  Heart,
  Truck,
  CheckCircle2,
  ArrowRight,
  Package,
} from 'lucide-react';
import { SEOHead } from '../components/common/SEOHead';

export const WhyUs: React.FC = () => {
  const pillars = [
    {
      icon: Sparkles,
      title: 'Authentic Indian Taste',
      subtitle: 'Generational recipes with uncompromised flavor',
      description:
        'We follow genuine culinary techniques that deliver the authentic taste of Indian home cooking. No synthetic flavoring or artificial MSG.',
      features: [
        'Natural spice blend (asafoetida, cumin, black pepper)',
        'Traditional regional recipes',
        'Distinct crispy texture when fried or roasted',
      ],
    },
    {
      icon: Award,
      title: 'Premium Quality Ingredients',
      subtitle: 'Direct sourcing from select Indian farms',
      description:
        'Every grain of wheat, pulse of urad and moong dal, and finger of turmeric is inspected for density, purity, and natural richness.',
      features: [
        '100% whole grain flours',
        'High curcumin golden turmeric',
        'Strict zero-adulteration quality tests',
      ],
    },
    {
      icon: Sun,
      title: 'Traditional Inspiration',
      subtitle: 'Honoring time-tested stone milling & sun curing',
      description:
        'We blend traditional Indian grain milling wisdom with state-of-the-art cleanliness to keep nutrients and natural taste undamaged.',
      features: [
        'Natural sun drying under clean enclosures',
        'Cold-process stone chakki grinding',
        'Hand-rolled dough for papad expansion',
      ],
    },
    {
      icon: Truck,
      title: 'Fresh Batch Dispatch',
      subtitle: 'Directly from the production facility to your kitchen',
      description:
        'Unlike supermarket products that sit on distributor shelves for months, our products are dispatched in fresh weekly batches.',
      features: [
        'Small-batch milling for peak freshness',
        'Moisture-proof sealed packaging',
        'Fast doorstep shipping across India',
      ],
    },
    {
      icon: ShieldCheck,
      title: 'Hygienic Preparation',
      subtitle: 'Modern food safety in every single process',
      description:
        'Our processing and packing areas maintain pristine cleanliness. Operators adhere to rigorous food hygiene standards.',
      features: [
        'Stainless steel food-grade machinery',
        'Dust-free clean rooms',
        'Tamper-evident food seal',
      ],
    },
    {
      icon: Heart,
      title: 'Customer-First Experience',
      subtitle: 'Complete peace of mind with Cash on Delivery',
      description:
        'We believe in earning your trust with every order. No upfront payment required — inspect your parcel and pay upon arrival.',
      features: [
        'Cash & UPI on Delivery support',
        'Live real-time order tracking',
        'Direct responsive customer service',
      ],
    },
  ];

  return (
    <div className="bg-[#FCF9F2] min-h-screen py-10 lg:py-16">
      <SEOHead
        title="Why Choose Annapurna Aahaar | Pure Ingredients & Traditional Milling"
        description="Discover why thousands of Indian families trust Annapurna Aahaar for their daily papads, whole-wheat sevaya, and pure turmeric spices."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-turmeric-700 bg-turmeric-100/70 border border-turmeric-300/40 px-3.5 py-1.5 rounded-full uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Our Quality Guarantee
          </span>
          <h1 className="font-serif font-black text-4xl sm:text-5xl text-heritage-maroon leading-tight">
            Why Choose Annapurna Aahaar?
          </h1>
          <p className="text-stone-700 text-base sm:text-lg leading-relaxed">
            We are redefining how traditional Indian food products reach your home — with zero chemical shortcuts, authentic preparation, and unwavering purity.
          </p>
        </div>

        {/* 6 Pillars Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={idx}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-3xl p-7 border border-amber-900/10 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-turmeric-500 to-amber-700 text-white flex items-center justify-center shadow-lg shadow-turmeric-600/20">
                    <Icon className="w-7 h-7" />
                  </div>

                  <div>
                    <h3 className="font-serif font-bold text-xl text-stone-900">
                      {pillar.title}
                    </h3>
                    <p className="text-xs font-semibold text-turmeric-700 mt-0.5">
                      {pillar.subtitle}
                    </p>
                  </div>

                  <p className="text-sm text-stone-600 leading-relaxed">
                    {pillar.description}
                  </p>

                  <div className="pt-2 border-t border-stone-100 space-y-2">
                    {pillar.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2 text-xs text-stone-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Banner */}
        <div className="bg-heritage-maroon rounded-3xl p-8 sm:p-12 text-cream-100 text-center shadow-xl space-y-6">
          <h2 className="font-serif font-bold text-2xl sm:text-3xl text-cream-50">
            Taste the Difference of Uncompromising Purity
          </h2>
          <p className="text-cream-200/90 text-sm sm:text-base max-w-2xl mx-auto">
            Order directly from our latest production batch today. Guaranteed crispy papads, wholesome sevaya, and pure turmeric spices delivered safely to your home.
          </p>
          <div>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-turmeric-500 hover:bg-turmeric-600 text-stone-950 font-bold px-8 py-3.5 rounded-xl shadow-lg transition-all transform active:scale-95 text-base"
            >
              <span>Order Food Products</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
