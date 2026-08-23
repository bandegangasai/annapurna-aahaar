import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Heart,
  Sun,
  ShieldCheck,
  Award,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { SEOHead } from '../components/common/SEOHead';

export const OurStory: React.FC = () => {
  return (
    <div className="bg-[#FCF9F2] min-h-screen py-10 lg:py-16">
      <SEOHead
        title="Our Story & Heritage | Annapurna Aahaar"
        description="Learn about Annapurna Aahaar's dedication to authentic Indian milling, handcrafted papads, and pure traditional food products."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Story Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-turmeric-700 bg-turmeric-100/70 border border-turmeric-300/40 px-3.5 py-1.5 rounded-full uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Tradition in Every Grain
          </span>
          <h1 className="font-serif font-black text-4xl sm:text-5xl text-heritage-maroon leading-tight">
            Crafting Authentic Indian Food with Integrity & Purity
          </h1>
          <p className="text-stone-700 text-base sm:text-lg leading-relaxed">
            Annapurna Aahaar was established with a singular devotion: to revive the authentic, unadulterated tastes of traditional Indian kitchens through clean processing and honest ingredients.
          </p>
        </div>

        {/* Heritage Narrative Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-bold text-turmeric-700 uppercase tracking-wider block">
                The Sacred Essence of Aahaar
              </span>
              <h2 className="font-serif font-bold text-2xl sm:text-3xl text-stone-900">
                Food Prepared as an Act of Devotion
              </h2>
            </div>
            <p className="text-stone-700 text-sm sm:text-base leading-relaxed">
              In Indian ethos, food is celebrated not merely as sustenance, but as *Annapurna* — divine nourishment that brings families together around the dining table. Modern industrial shortcuts have stripped away the aromatic depth and wholesome purity of daily food.
            </p>
            <p className="text-stone-700 text-sm sm:text-base leading-relaxed">
              At Annapurna Aahaar, we choose the patient path. Our wheat is milled using traditional stone chakki principles to retain the nutritious bran and germ. Our papads are made with whole urad and moong dal flours, kneaded by hand, and naturally cured under the warm Indian sun.
            </p>
            <div className="pt-2">
              <div className="border-l-4 border-turmeric-600 pl-4 py-1 italic font-serif text-heritage-maroon text-lg">
                "When ingredients are pure and intentions are true, every grain tells a story of tradition."
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-amber-900/10">
              <img
                src="https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=1000&q=80"
                alt="Traditional Indian Milling and Food Crafting"
                className="w-full h-96 object-cover"
              />
            </div>
          </div>
        </div>

        {/* 4 Pillars of Our Craft */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-amber-900/10 shadow-sm space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-turmeric-700 uppercase tracking-widest block">
              Our Principles
            </span>
            <h2 className="font-serif font-bold text-2xl sm:text-3xl text-stone-900">
              The Four Pillars of Our Craft
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-[#FCF9F2] p-6 rounded-2xl border border-amber-900/10 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-turmeric-100 text-heritage-maroon flex items-center justify-center">
                <Sun className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-lg text-stone-900">Natural Sun-Curing</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Rather than artificial dehydrators, our papads and sevaya are dried under direct sunlight, giving them an unmistakable crunch.
              </p>
            </div>

            <div className="bg-[#FCF9F2] p-6 rounded-2xl border border-amber-900/10 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-turmeric-100 text-heritage-maroon flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-lg text-stone-900">Slow Stone Milling</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Low-speed milling prevents friction heat from destroying delicate wheat nutrients, natural vitamins, and spice aromatics.
              </p>
            </div>

            <div className="bg-[#FCF9F2] p-6 rounded-2xl border border-amber-900/10 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-turmeric-100 text-heritage-maroon flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-lg text-stone-900">Pristine Hygiene</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Every batch is handled in dust-controlled, stainless-steel food stations with moisture-proof protective packaging.
              </p>
            </div>

            <div className="bg-[#FCF9F2] p-6 rounded-2xl border border-amber-900/10 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-turmeric-100 text-heritage-maroon flex items-center justify-center">
                <Heart className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-lg text-stone-900">Honest Pricing</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Fair, transparent prices directly from the mill to your kitchen without middleman distributor markups.
              </p>
            </div>
          </div>
        </div>

        {/* CTA to Products */}
        <div className="text-center py-8">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-turmeric-600 to-amber-700 hover:from-turmeric-700 hover:to-amber-800 text-white px-8 py-4 rounded-xl font-bold text-base shadow-lg shadow-turmeric-600/25 transition-all transform active:scale-95"
          >
            <span>Explore Our Products</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
