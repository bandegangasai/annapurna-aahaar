import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Award,
  Sun,
  ShieldCheck,
  Heart,
  MapPin,
  ArrowRight,
} from 'lucide-react';
import { SEOHead } from '../components/common/SEOHead';

export const OurStory: React.FC = () => {
  return (
    <div className="bg-[#FAF6EE] min-h-screen py-10 lg:py-16">
      <SEOHead
        title="Our Story & Heritage | Annapurna Aahaar — Bhainsa, Telangana"
        description="Learn about Annapurna Aahaar, founded by Bande Omkar in Bhainsa, Nirmal District, Telangana. Preserving authentic Indian food traditions."
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header Title */}
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold text-heritage-antiqueGold uppercase tracking-widest block mb-1">
            Heritage & Roots
          </span>
          <h1 className="font-serif font-black text-3xl sm:text-5xl text-heritage-maroon leading-tight">
            The Story of Annapurna Aahaar
          </h1>
          <p className="font-serif italic text-xl text-heritage-antiqueGold font-semibold mt-2">
            "Tradition in Every Grain."
          </p>
        </div>

        {/* Narrative Card */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-heritage-gold/30 shadow-md space-y-8 text-stone-700 leading-relaxed">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center border-b border-stone-100 pb-8">
            <div className="md:col-span-8 space-y-4">
              <h2 className="font-serif font-bold text-2xl text-heritage-maroon">
                Founded by Bande Omkar in Bhainsa, Telangana
              </h2>
              <p className="text-sm sm:text-base">
                <strong>Annapurna Aahaar</strong> was established in <strong>Bhainsa, Nirmal District, Telangana</strong> with a singular mission: to bring pure, unadulterated, and traditionally crafted Indian food products directly to families and food lovers.
              </p>
              <p className="text-sm sm:text-base">
                In an era dominated by mass-manufactured, chemically enhanced food products, Annapurna Aahaar preserves authentic food preparation traditions. We focus on natural whole grains, handcrafted sun-cured papads, and stone-ground spices.
              </p>
            </div>
            <div className="md:col-span-4 bg-[#FAF6EE] p-6 rounded-2xl border border-heritage-gold/30 text-center space-y-2">
              <div className="w-14 h-14 bg-heritage-maroon text-heritage-gold rounded-full flex items-center justify-center mx-auto font-serif font-black text-xl border border-heritage-gold/40">
                AA
              </div>
              <h4 className="font-serif font-bold text-heritage-maroon text-base">Annapurna Aahaar</h4>
              <p className="text-xs text-stone-600">Bhainsa, Nirmal District, Telangana (504103)</p>
              <p className="text-[11px] font-semibold text-heritage-antiqueGold">Proprietor: Bande Omkar</p>
            </div>
          </div>

          {/* Core Philosophy Blocks */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
            <div className="p-5 rounded-2xl bg-[#FAF6EE] border border-heritage-gold/20 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-heritage-gold/20 flex items-center justify-center text-heritage-maroon">
                <Sun className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-lg text-heritage-maroon">
                Natural Sun-Curing
              </h3>
              <p className="text-xs text-stone-600">
                Our Urad, Moong, Masala, and Rice Papads are rolled by hand and cured under the natural Indian sun for authentic crispiness.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF6EE] border border-heritage-gold/20 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-heritage-gold/20 flex items-center justify-center text-heritage-maroon">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-lg text-heritage-maroon">
                Traditional Stone Grinding
              </h3>
              <p className="text-xs text-stone-600">
                We select premium whole grains and farm-fresh turmeric roots, stone-grinding them slowly to protect natural aroma and nutrients.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF6EE] border border-heritage-gold/20 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-heritage-gold/20 flex items-center justify-center text-heritage-maroon">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-lg text-heritage-maroon">
                Zero Artificial Fillers
              </h3>
              <p className="text-xs text-stone-600">
                100% purity guarantee. No synthetic food colors, adulterated starches, or artificial preservatives are ever added.
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="font-serif font-bold text-lg text-stone-900">Experience Traditional Indian Taste</h4>
              <p className="text-xs text-stone-500">Order online or choose Cash on Delivery with door-to-door tracking.</p>
            </div>
            <Link
              to="/products"
              className="bg-heritage-maroon hover:bg-heritage-darkMaroon text-cream-100 px-6 py-3 rounded-2xl font-bold text-sm shadow-md transition-all flex items-center gap-2 border border-heritage-gold/30 shrink-0"
            >
              <span>Explore Products</span>
              <ArrowRight className="w-4 h-4 text-heritage-gold" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
