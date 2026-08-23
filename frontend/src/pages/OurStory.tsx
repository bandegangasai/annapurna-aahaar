import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Sun,
  ShieldCheck,
  MapPin,
  ArrowRight,
  Phone,
} from 'lucide-react';
import { SEOHead } from '../components/common/SEOHead';
import { useLanguage } from '../context/LanguageContext';

export const OurStory: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="bg-[#F8F3E7] min-h-screen py-10 lg:py-16 text-[#252525]">
      <SEOHead
        title="Our Story & Heritage | Annapurna Aahaar — Bhainsa, Telangana"
        description="Learn about Annapurna Aahaar, founded by Bande Omkar in Bhainsa, Nirmal District, Telangana (504103). Preserving authentic Indian food traditions."
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header Title */}
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold text-[#C79A45] uppercase tracking-widest block mb-1">
            Heritage & Roots
          </span>
          <h1 className="font-serif font-black text-3xl sm:text-5xl text-[#173F35] leading-tight">
            The Story of Annapurna Aahaar
          </h1>
          <p className="font-serif italic text-xl text-[#C79A45] font-semibold mt-2">
            "{t('tagline')}"
          </p>
        </div>

        {/* Narrative Card */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#C79A45]/30 shadow-subtle space-y-8 text-stone-primary leading-relaxed">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center border-b border-stone-100 pb-8">
            <div className="md:col-span-8 space-y-4">
              <h2 className="font-serif font-bold text-2xl text-[#173F35]">
                Founded by Bande Omkar in Bhainsa, Telangana
              </h2>
              <p className="text-sm sm:text-base text-stone-muted">
                <strong>Annapurna Aahaar</strong> was established in <strong>Bhainsa, Nirmal District, Telangana (504103)</strong> with a singular mission: to bring pure, unadulterated, and traditionally crafted Indian food products directly to families and food lovers across India.
              </p>
              <p className="text-sm sm:text-base text-stone-muted">
                In an era dominated by mass-manufactured, chemically enhanced food products, Annapurna Aahaar preserves authentic food preparation traditions. We focus on natural whole grains, handcrafted sun-cured papads, and stone-ground spices.
              </p>
            </div>
            <div className="md:col-span-4 bg-[#FAF6EE] p-6 rounded-2xl border border-[#C79A45]/30 text-center space-y-2">
              <div className="w-14 h-14 bg-[#173F35] text-[#C79A45] rounded-2xl flex items-center justify-center mx-auto font-serif font-black text-xl border border-[#C79A45]/40 shadow-xs">
                AA
              </div>
              <h4 className="font-serif font-bold text-[#173F35] text-base">Annapurna Aahaar</h4>
              <p className="text-xs text-stone-muted">Bhainsa, Nirmal District, Telangana (504103)</p>
              <p className="text-[11px] font-semibold text-[#C79A45]">Proprietor: Bande Omkar</p>
            </div>
          </div>

          {/* Core Philosophy Blocks */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
            <div className="p-5 rounded-2xl bg-[#FAF6EE] border border-[#C79A45]/20 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-[#173F35]/10 flex items-center justify-center text-[#173F35]">
                <Sun className="w-5 h-5 text-[#C79A45]" />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#173F35]">
                Natural Sun-Curing
              </h3>
              <p className="text-xs text-stone-muted">
                Our Urad, Moong, Masala, and Rice Papads are rolled by hand and cured under the natural Indian sun for authentic crispiness.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF6EE] border border-[#C79A45]/20 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-[#173F35]/10 flex items-center justify-center text-[#173F35]">
                <Sparkles className="w-5 h-5 text-[#C79A45]" />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#173F35]">
                Stone Chakki Grinding
              </h3>
              <p className="text-xs text-stone-muted">
                We select premium whole grains and farm-fresh turmeric roots, stone-grinding them slowly to protect natural aroma and nutrients.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF6EE] border border-[#C79A45]/20 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-[#173F35]/10 flex items-center justify-center text-[#173F35]">
                <ShieldCheck className="w-5 h-5 text-[#C79A45]" />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#173F35]">
                Zero Artificial Fillers
              </h3>
              <p className="text-xs text-stone-muted">
                100% purity guarantee. No synthetic food colors, adulterated starches, or artificial preservatives are ever added.
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="font-serif font-bold text-lg text-[#173F35] block">
                Have questions or need to place a phone order?
              </span>
              <span className="text-xs text-stone-muted">
                Call our 24/7 hotline in English, Marathi, Hindi, Telugu: <strong>9347036152</strong>
              </span>
            </div>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-[#173F35] hover:bg-[#0C241E] text-[#F8F3E7] px-6 py-3 rounded-2xl font-bold text-sm shadow-md transition-all shrink-0 border border-[#C79A45]/40"
            >
              <span>{t('hero_shop_now')}</span>
              <ArrowRight className="w-4 h-4 text-[#C79A45]" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurStory;
