import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ShieldCheck,
  Sun,
  Flame,
  Award,
  Heart,
  Truck,
  ArrowRight,
} from 'lucide-react';
import { SEOHead } from '../components/common/SEOHead';

export const WhyUs: React.FC = () => {
  const pillars = [
    {
      icon: Sparkles,
      title: 'Authentic Indian Taste',
      desc: 'Formulated with age-old recipes from traditional kitchens, preserving rich culinary heritage in every bite.',
    },
    {
      icon: Sun,
      title: 'Natural Sun-Curing',
      desc: 'Naturally sun-cured papads and whole-wheat sevaya for crispiness and long shelf life without chemical preservatives.',
    },
    {
      icon: ShieldCheck,
      title: 'Hygienic Clean Processing',
      desc: 'Prepared in clean, dust-free facilities in Bhainsa, Telangana with moisture-proof food grade packaging.',
    },
    {
      icon: Award,
      title: 'Pure Whole Grains',
      desc: '100% whole grain flours with zero fillers, artificial starches, or industrial blending.',
    },
    {
      icon: Flame,
      title: 'Golden Pure Turmeric',
      desc: 'Farm-sourced golden turmeric powder stone-ground to retain high curcumin levels and natural medicinal potency.',
    },
    {
      icon: Heart,
      title: 'Dedicated Customer Service',
      desc: 'Direct from Bande Omkar in Bhainsa with prompt dispatch, full order tracking, and Cash on Delivery / Online payment support.',
    },
  ];

  return (
    <div className="bg-[#FAF6EE] min-h-screen py-10 lg:py-16">
      <SEOHead
        title="Why Choose Annapurna Aahaar | Pure Indian Food Products"
        description="Discover the 6 core pillars of quality and tradition that make Annapurna Aahaar the preferred choice for authentic Indian food."
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold text-heritage-antiqueGold uppercase tracking-widest block mb-1">
            Our Quality Standard
          </span>
          <h1 className="font-serif font-black text-3xl sm:text-5xl text-heritage-maroon leading-tight">
            Why Choose Annapurna Aahaar?
          </h1>
          <p className="text-stone-600 text-sm sm:text-base mt-2">
            The values and principles behind every grain and papad prepared in Bhainsa, Telangana.
          </p>
        </div>

        {/* 6 Core Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pillars.map((p, i) => {
            const Icon = p.icon;
            return (
              <div
                key={i}
                className="bg-white p-8 rounded-3xl border border-heritage-gold/30 shadow-sm hover:shadow-md transition-all space-y-4"
              >
                <div className="w-12 h-12 rounded-2xl bg-heritage-gold/20 flex items-center justify-center text-heritage-maroon border border-heritage-gold/40">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-serif font-bold text-xl text-stone-900">
                  {p.title}
                </h3>
                <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                  {p.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* CTA Card */}
        <div className="bg-heritage-darkMaroon text-cream-100 rounded-3xl p-8 sm:p-12 text-center border-2 border-heritage-gold/40 shadow-xl space-y-4">
          <h2 className="font-serif font-bold text-2xl sm:text-3xl text-cream-50">
            Taste the Pure Difference Today
          </h2>
          <p className="text-xs sm:text-sm text-cream-200 max-w-lg mx-auto">
            Order traditional wheat sevaya, round sun-dried papads, and pure turmeric powder directly to your home.
          </p>
          <div className="pt-2">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-heritage-gold hover:bg-heritage-antiqueGold text-heritage-darkMaroon font-black px-8 py-3.5 rounded-2xl text-sm transition-all shadow-lg"
            >
              <span>Explore Full Catalogue</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
