import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Award,
  Sun,
  Flame,
  CheckCircle2,
  Heart,
  ChevronRight,
  Package,
  MapPin,
  Phone,
} from 'lucide-react';
import { HeroScene } from '../components/3d/HeroScene';
import { ProductCard3D } from '../components/product/ProductCard3D';
import { SEOHead } from '../components/common/SEOHead';
import { api } from '../services/api';
import { Product } from '../types';

export const Home: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await api.getProducts({ featured: true });
        if (res.success && res.data.length > 0) {
          setFeaturedProducts(res.data);
        }
      } catch (err) {
        console.error('Error fetching featured products:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const whyChoosePillars = [
    {
      icon: Sparkles,
      title: 'Authentic Indian Taste',
      desc: 'Formulated with age-old recipes from traditional kitchens, preserving authentic culinary taste.',
    },
    {
      icon: Sun,
      title: 'Natural Sun-Curing',
      desc: 'Naturally sun-cured papads and whole-wheat sevaya for maximum crispiness and natural freshness.',
    },
    {
      icon: ShieldCheck,
      title: 'Hygienic Preparation',
      desc: 'Processed in clean, dust-controlled facilities in Bhainsa with moisture-proof protective packaging.',
    },
    {
      icon: Award,
      title: 'Pure Whole Grains',
      desc: '100% whole grain flours and pure spices with zero artificial fillers or starch adulteration.',
    },
    {
      icon: Flame,
      title: 'Golden Pure Turmeric',
      desc: 'Farm-sourced golden turmeric powder stone-ground without chemical fillers or synthetic color.',
    },
    {
      icon: Heart,
      title: 'Customer-First Values',
      desc: 'Direct from Bande Omkar in Bhainsa with prompt dispatch and Cash on Delivery / Online payment support.',
    },
  ];

  return (
    <div className="overflow-hidden">
      <SEOHead
        title="Annapurna Aahaar | Traditional Indian Food Products | Bhainsa, Telangana"
        description="Annapurna Aahaar — authentic Indian food products from Bhainsa, Nirmal District, Telangana. Explore handcrafted papads, sun-dried wheat sevaya, and pure golden turmeric."
      />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-[#F5ECDA] via-[#FAF6EE] to-[#FAF6EE] pt-8 pb-16 lg:pt-12 lg:pb-24 border-b border-heritage-gold/20">
        {/* Decorative Golden Ambient Glow */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-tr from-heritage-gold/15 via-heritage-maroon/10 to-transparent blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Brand & Action */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="lg:col-span-7 space-y-6 text-center lg:text-left"
            >
              {/* Heritage Pill */}
              <div className="inline-flex items-center gap-2 bg-heritage-maroon/10 border border-heritage-gold/40 px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold text-heritage-maroon shadow-sm">
                <Sparkles className="w-4 h-4 text-heritage-gold animate-spin-slow" />
                <span>Bhainsa, Nirmal District, Telangana</span>
              </div>

              {/* Main Headline */}
              <div className="space-y-2">
                <h1 className="font-serif font-black text-4xl sm:text-5xl lg:text-6xl text-heritage-maroon tracking-tight leading-[1.12]">
                  ANNAPURNA AHAAR
                </h1>
                <p className="font-serif italic text-2xl sm:text-3xl text-heritage-antiqueGold font-semibold">
                  "Tradition in Every Grain."
                </p>
              </div>

              {/* Supporting Description */}
              <p className="text-base sm:text-lg text-stone-700 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Authentic Indian food products crafted with care, quality, and the timeless taste of tradition. Handcrafted round papads, traditional whole-wheat sevaya, and stone-ground pure turmeric powder.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/products"
                  className="w-full sm:w-auto bg-gradient-to-r from-heritage-maroon via-heritage-richRed to-heritage-darkMaroon hover:from-heritage-darkMaroon hover:to-heritage-maroon text-cream-100 px-8 py-4 rounded-2xl font-bold text-base shadow-xl shadow-heritage-maroon/20 hover:shadow-2xl transition-all transform active:scale-95 flex items-center justify-center gap-2 border border-heritage-gold/30"
                >
                  <span>SHOP OUR PRODUCTS</span>
                  <ArrowRight className="w-5 h-5 text-heritage-gold" />
                </Link>

                <Link
                  to="/our-story"
                  className="w-full sm:w-auto bg-white hover:bg-cream-100 text-heritage-maroon border border-heritage-gold/40 px-7 py-4 rounded-2xl font-bold text-base shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <span>OUR STORY</span>
                </Link>
              </div>

              {/* Verified Business Badges */}
              <div className="pt-6 border-t border-heritage-gold/20 grid grid-cols-3 gap-3 text-center sm:text-left">
                <div>
                  <div className="font-serif font-bold text-lg sm:text-xl text-heritage-maroon">Bande Omkar</div>
                  <div className="text-xs text-stone-600">Founder & Owner</div>
                </div>
                <div>
                  <div className="font-serif font-bold text-lg sm:text-xl text-heritage-maroon">Bhainsa, TS</div>
                  <div className="text-xs text-stone-600">PIN: 504103</div>
                </div>
                <div>
                  <div className="font-serif font-bold text-lg sm:text-xl text-heritage-maroon">Online + COD</div>
                  <div className="text-xs text-stone-600">Payment Modes</div>
                </div>
              </div>
            </motion.div>

            {/* Right 3D Scene Column */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-5 relative"
            >
              <div className="relative rounded-3xl bg-gradient-to-b from-cream-100/90 to-amber-100/40 p-2 sm:p-4 border-2 border-heritage-gold/30 shadow-2xl backdrop-blur-sm">
                <HeroScene />
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-heritage-gold/30 shadow-sm flex items-center justify-between text-xs text-stone-800">
                  <span className="flex items-center gap-1.5 font-bold text-heritage-maroon">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
                    Traditional Stone Mill (Chakki)
                  </span>
                  <span className="text-heritage-antiqueGold font-bold">100% Whole Grains</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Category Quick Grid */}
      <section className="py-14 bg-white border-b border-heritage-gold/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold text-heritage-antiqueGold uppercase tracking-widest block mb-1">
              Curated Collections
            </span>
            <h2 className="font-serif font-black text-2xl sm:text-3xl text-heritage-maroon">
              Authentic Indian Food Essentials
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Category 1: Papad */}
            <Link
              to="/products?category=Papad"
              className="group relative rounded-3xl overflow-hidden bg-cream-100 border border-heritage-gold/30 p-6 flex flex-col justify-between hover:shadow-xl transition-all duration-300"
            >
              <div className="space-y-2">
                <span className="text-xs font-bold text-heritage-maroon bg-heritage-gold/20 px-3 py-1 rounded-full">
                  Handcrafted
                </span>
                <h3 className="font-serif font-bold text-xl text-stone-900 group-hover:text-heritage-richRed transition-colors">
                  Crispy Papads
                </h3>
                <p className="text-xs text-stone-600">
                  Urad Dal, Moong Dal, Masala & Rice Papad. Sun-dried crispiness.
                </p>
              </div>
              <div className="mt-6 flex items-center justify-between text-xs font-bold text-heritage-maroon">
                <span>₹150 / 500g | ₹300 / 1kg</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-heritage-gold" />
              </div>
            </Link>

            {/* Category 2: Sevaya */}
            <Link
              to="/products?category=Flours %26 Grains"
              className="group relative rounded-3xl overflow-hidden bg-cream-100 border border-heritage-gold/30 p-6 flex flex-col justify-between hover:shadow-xl transition-all duration-300"
            >
              <div className="space-y-2">
                <span className="text-xs font-bold text-heritage-maroon bg-heritage-gold/20 px-3 py-1 rounded-full">
                  Pure Wheat
                </span>
                <h3 className="font-serif font-bold text-xl text-stone-900 group-hover:text-heritage-richRed transition-colors">
                  Traditional Sevaya
                </h3>
                <p className="text-xs text-stone-600">
                  Sun-dried whole wheat vermicelli for sweet kheer and breakfast upma.
                </p>
              </div>
              <div className="mt-6 flex items-center justify-between text-xs font-bold text-heritage-maroon">
                <span>₹100 / kg</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-heritage-gold" />
              </div>
            </Link>

            {/* Category 3: Turmeric */}
            <Link
              to="/products?category=Spices"
              className="group relative rounded-3xl overflow-hidden bg-cream-100 border border-heritage-gold/30 p-6 flex flex-col justify-between hover:shadow-xl transition-all duration-300"
            >
              <div className="space-y-2">
                <span className="text-xs font-bold text-heritage-maroon bg-heritage-gold/20 px-3 py-1 rounded-full">
                  High Curcumin
                </span>
                <h3 className="font-serif font-bold text-xl text-stone-900 group-hover:text-heritage-richRed transition-colors">
                  Pure Turmeric
                </h3>
                <p className="text-xs text-stone-600">
                  Pure farm golden-yellow turmeric powder, stone-ground with zero fillers.
                </p>
              </div>
              <div className="mt-6 flex items-center justify-between text-xs font-bold text-heritage-maroon">
                <span>₹150 / kg</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-heritage-gold" />
              </div>
            </Link>

            {/* Category 4: Noodles */}
            <Link
              to="/products?category=Noodles %26 Instant Foods"
              className="group relative rounded-3xl overflow-hidden bg-cream-100 border border-heritage-gold/30 p-6 flex flex-col justify-between hover:shadow-xl transition-all duration-300"
            >
              <div className="space-y-2">
                <span className="text-xs font-bold text-heritage-maroon bg-heritage-gold/20 px-3 py-1 rounded-full">
                  Quick Snack
                </span>
                <h3 className="font-serif font-bold text-xl text-stone-900 group-hover:text-heritage-richRed transition-colors">
                  Noodles & Instant
                </h3>
                <p className="text-xs text-stone-600">
                  Maggie masala noodles & whole wheat desi noodles for family snacking.
                </p>
              </div>
              <div className="mt-6 flex items-center justify-between text-xs font-bold text-heritage-maroon">
                <span>Packs Available</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-heritage-gold" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-[#FAF6EE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold text-heritage-antiqueGold uppercase tracking-widest block mb-1">
                Authentic Craftsmanship
              </span>
              <h2 className="font-serif font-black text-3xl sm:text-4xl text-heritage-maroon">
                Featured Products
              </h2>
            </div>
            <Link
              to="/products"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-heritage-maroon hover:text-heritage-richRed transition-colors"
            >
              <span>View Full Catalogue</span>
              <ArrowRight className="w-4 h-4 text-heritage-gold" />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="bg-white rounded-3xl h-80 animate-pulse border border-stone-200" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard3D key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Heritage Narrative Section */}
      <section className="py-16 lg:py-20 bg-heritage-darkMaroon text-cream-100 relative overflow-hidden border-y-2 border-heritage-gold/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-bold text-heritage-gold uppercase tracking-widest block">
                Annapurna Aahaar — Bhainsa
              </span>
              <h2 className="font-serif font-black text-3xl sm:text-4xl lg:text-5xl text-cream-50 leading-tight">
                Authentic Indian Food Traditions From Bhainsa, Telangana
              </h2>
              <p className="text-cream-200/90 text-sm sm:text-base leading-relaxed">
                Founded by <strong>Bande Omkar</strong> in Bhainsa, Nirmal District, Telangana, Annapurna Aahaar is dedicated to delivering unadulterated food products. From selecting the finest whole wheat and pulses to natural sun-drying and hygienic moisture-proof packaging, we preserve true Indian flavor.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-2 text-xs sm:text-sm">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-heritage-gold shrink-0 mt-0.5" />
                  <span>No synthetic colors or chemical fillers</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-heritage-gold shrink-0 mt-0.5" />
                  <span>Stone chakki grinding for pure nutrition</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-heritage-gold shrink-0 mt-0.5" />
                  <span>Handcrafted round papad crispiness</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-heritage-gold shrink-0 mt-0.5" />
                  <span>Direct dispatch across Telangana and India</span>
                </div>
              </div>
              <div className="pt-2">
                <Link
                  to="/our-story"
                  className="inline-flex items-center gap-2 bg-heritage-gold hover:bg-heritage-antiqueGold text-heritage-darkMaroon font-black px-7 py-3.5 rounded-2xl transition-all shadow-xl text-sm"
                >
                  <span>Read Our Full Story</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative rounded-3xl overflow-hidden border-2 border-heritage-gold/40 shadow-2xl bg-cream-100 p-4">
                <img
                  src="/products/turmeric-haldi-powder.svg"
                  alt="Pure Turmeric Powder and Traditional Indian Milling"
                  className="w-full h-80 sm:h-96 object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Pillars */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-heritage-antiqueGold uppercase tracking-widest block mb-1">
              Our Core Commitments
            </span>
            <h2 className="font-serif font-black text-3xl sm:text-4xl text-heritage-maroon">
              Why Choose Annapurna Aahaar?
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyChoosePillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <motion.div
                  key={idx}
                  whileHover={{ y: -5 }}
                  className="bg-[#FAF6EE] p-7 rounded-3xl border border-heritage-gold/30 shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <div className="w-12 h-12 rounded-2xl bg-heritage-gold/20 flex items-center justify-center mb-4 text-heritage-maroon border border-heritage-gold/40">
                    <Icon className="w-6 h-6 text-heritage-maroon" />
                  </div>
                  <h3 className="font-serif font-bold text-xl text-stone-900 mb-2">
                    {pillar.title}
                  </h3>
                  <p className="text-sm text-stone-600 leading-relaxed">
                    {pillar.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Direct Order CTA Banner */}
      <section className="py-16 bg-[#FAF6EE]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-heritage-darkMaroon via-heritage-maroon to-[#5C131F] rounded-3xl p-8 sm:p-12 text-cream-100 text-center shadow-2xl relative overflow-hidden border-2 border-heritage-gold/40">
            <div className="relative z-10 space-y-4 max-w-2xl mx-auto">
              <span className="bg-heritage-gold/20 text-heritage-gold text-xs font-bold px-3.5 py-1 rounded-full uppercase tracking-wider border border-heritage-gold/30">
                Fresh Milling & Dispatch
              </span>
              <h2 className="font-serif font-black text-3xl sm:text-4xl text-cream-50">
                Ready to Taste Authentic Indian Food Purity?
              </h2>
              <p className="text-cream-200/90 text-sm sm:text-base">
                Order your favorite handcrafted papads, sun-dried sevaya, and pure turmeric directly from Bhainsa, Telangana.
              </p>
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/products"
                  className="w-full sm:w-auto bg-heritage-gold hover:bg-heritage-antiqueGold text-heritage-darkMaroon font-black px-8 py-4 rounded-2xl shadow-xl transition-all transform active:scale-95 text-base"
                >
                  Order Now (Online / Cash on Delivery)
                </Link>
                <Link
                  to="/contact"
                  className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-cream-100 border border-cream-200/30 px-6 py-4 rounded-2xl font-bold transition-colors text-sm"
                >
                  Contact Bande Omkar
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
