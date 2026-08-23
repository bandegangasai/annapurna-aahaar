import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ShieldCheck,
  Sun,
  Flame,
  Award,
  Heart,
  Phone,
  ArrowRight,
} from 'lucide-react';
import { SEOHead } from '../components/common/SEOHead';
import { useLanguage } from '../context/LanguageContext';

export const WhyUs: React.FC = () => {
  const { t } = useLanguage();

  const pillars = [
    {
      icon: Sparkles,
      title: t('trust_1_title'),
      desc: t('trust_1_desc'),
    },
    {
      icon: Sun,
      title: t('trust_2_title'),
      desc: t('trust_2_desc'),
    },
    {
      icon: ShieldCheck,
      title: t('trust_3_title'),
      desc: t('trust_3_desc'),
    },
    {
      icon: Award,
      title: t('trust_4_title'),
      desc: t('trust_4_desc'),
    },
    {
      icon: Flame,
      title: 'Pure Golden Turmeric',
      desc: 'Farm-sourced golden turmeric powder stone-ground to retain high curcumin levels and natural medicinal aroma.',
    },
    {
      icon: Heart,
      title: 'Dedicated Customer Care',
      desc: 'Direct from Bande Omkar in Bhainsa with prompt dispatch, full order tracking, and 24/7 Telephone IVR assistance (9347036152).',
    },
  ];

  return (
    <div className="bg-[#F8F3E7] min-h-screen py-10 lg:py-16 text-[#252525]">
      <SEOHead
        title="Why Choose Us | Annapurna Aahaar"
        description="Discover the core pillars of quality and tradition that make Annapurna Aahaar the preferred choice for authentic Indian food in Bhainsa, Telangana (504103). Call 9347036152."
        url="https://annapurnaaahaar.in/#/why-us"
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold text-[#C79A45] uppercase tracking-widest block mb-1">
            Our Quality Standard
          </span>
          <h1 className="font-serif font-black text-3xl sm:text-5xl text-[#173F35] leading-tight">
            Why Choose Annapurna Aahaar?
          </h1>
          <p className="text-stone-muted text-sm sm:text-base mt-2">
            The values and principles behind every grain and papad prepared in Bhainsa, Telangana (504103).
          </p>
        </div>

        {/* 6 Core Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pillars.map((p, i) => {
            const Icon = p.icon;
            return (
              <div
                key={i}
                className="bg-white p-8 rounded-3xl border border-[#C79A45]/30 shadow-subtle hover:shadow-card-lift transition-all space-y-4"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#173F35] flex items-center justify-center text-[#C79A45] border border-[#C79A45]/40 shadow-xs">
                  <Icon className="w-6 h-6 text-[#C79A45]" />
                </div>
                <h3 className="font-serif font-bold text-xl text-stone-primary">
                  {p.title}
                </h3>
                <p className="text-stone-muted text-xs sm:text-sm leading-relaxed">
                  {p.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* CTA Card */}
        <div className="bg-[#173F35] text-[#F8F3E7] rounded-3xl p-8 sm:p-12 text-center border-2 border-[#C79A45]/40 shadow-xl space-y-4">
          <h2 className="font-serif font-black text-2xl sm:text-3xl text-white">
            Taste the Pure Difference Today
          </h2>
          <p className="text-xs sm:text-sm text-stone-200 max-w-lg mx-auto">
            Order traditional wheat sevaya, round sun-dried papads, and pure turmeric powder directly to your home.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/products"
              className="w-full sm:w-auto bg-[#C79A45] hover:bg-[#D5AD56] text-[#173F35] font-black px-7 py-3.5 rounded-2xl shadow-lg transition-all text-sm"
            >
              {t('hero_shop_now')}
            </Link>
            <a
              href="tel:9347036152"
              className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white border border-[#C79A45]/40 px-6 py-3.5 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 text-sm"
            >
              <Phone className="w-4 h-4 text-[#C79A45]" />
              <span>Call 9347036152</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhyUs;
