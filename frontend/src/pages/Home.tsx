import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Award,
  Sun,
  Truck,
  Heart,
  Flame,
  CheckCircle2,
  Phone,
  Headphones,
  Volume2,
  Layers,
  Clock,
} from 'lucide-react';
import { ProductCard3D } from '../components/product/ProductCard3D';
import { SEOHead } from '../components/common/SEOHead';
import { api } from '../services/api';
import { Product } from '../types';
import { getProductImageUrl } from '../utils/formatters';

export const Home: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await api.getProducts({ featured: true });
        if (response.success && response.data) {
          setFeaturedProducts(response.data);
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
        description="Annapurna Aahaar — authentic Indian food products from Bhainsa, Nirmal District, Telangana. Explore handcrafted papads, sun-dried wheat sevaya, and pure golden turmeric. Order online or call 9347036152."
      />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-[#F5ECDA] via-[#FAF6EE] to-[#FAF6EE] pt-8 pb-16 lg:pt-12 lg:pb-20 border-b border-heritage-gold/20">
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
                  <span>SHOP ONLINE</span>
                  <ArrowRight className="w-5 h-5 text-heritage-gold" />
                </Link>

                {/* Prominent CALL TO ORDER button */}
                <a
                  href="tel:9347036152"
                  className="w-full sm:w-auto bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white px-7 py-4 rounded-2xl font-bold text-base shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2.5 border border-amber-400/30 transform active:scale-95"
                >
                  <Phone className="w-5 h-5 animate-pulse text-amber-200" />
                  <span>CALL TO ORDER: 9347036152</span>
                </a>
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
                  <div className="font-serif font-bold text-lg sm:text-xl text-heritage-maroon">4 Languages</div>
                  <div className="text-xs text-stone-600">IVR Telephone Support</div>
                </div>
              </div>
            </motion.div>

            {/* Right Hero Product Spread Column */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-5 relative"
            >
              <div className="relative group rounded-3xl bg-gradient-to-b from-cream-100 to-amber-100/60 p-3 sm:p-4 border-2 border-heritage-gold/40 shadow-2xl overflow-hidden">
                {/* Main Hero Photograph */}
                <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-amber-950/10 shadow-inner">
                  <img
                    src={getProductImageUrl('/products/hero-traditional-spread.webp')}
                    alt="Annapurna Aahaar Traditional Food Spread - Sevaya, Papad, and Pure Turmeric"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />

                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full border border-heritage-gold/30 shadow-md flex items-center gap-1.5 text-xs font-bold text-heritage-maroon">
                    <Sparkles className="w-3.5 h-3.5 text-heritage-gold animate-spin-slow" />
                    <span>Pure Handcrafted Taste</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 24/7 MULTILINGUAL IVR & TELEPHONE ORDERING HIGHLIGHT SECTION */}
      <section className="py-12 bg-gradient-to-br from-amber-900 via-amber-950 to-stone-900 text-white relative border-y-4 border-heritage-gold shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <div className="inline-flex items-center gap-2 bg-heritage-gold text-heritage-darkMaroon px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
                <Headphones className="w-3.5 h-3.5" />
                <span>24/7 Telephone IVR Ordering</span>
              </div>
              <h2 className="font-serif font-black text-3xl sm:text-4xl text-cream-50 leading-tight">
                Can't Use The Website? <br />
                <span className="text-heritage-gold">Just Call 9347036152</span>
              </h2>
              <p className="text-cream-200/90 text-sm sm:text-base leading-relaxed">
                We believe everyone should easily access authentic Indian food. Simply call our dedicated IVR number from any basic mobile or landline phone, select your language, and place your order using voice instructions.
              </p>
              <div className="pt-2 flex flex-wrap gap-4 items-center">
                <a
                  href="tel:9347036152"
                  className="bg-gradient-to-r from-heritage-gold to-amber-500 hover:from-amber-400 hover:to-heritage-gold text-heritage-darkMaroon font-black px-8 py-4 rounded-2xl shadow-xl transition-all transform active:scale-95 flex items-center gap-3 text-base"
                >
                  <Phone className="w-5 h-5 animate-pulse" />
                  <span>CALL: 9347036152</span>
                </a>
                <div className="text-xs text-amber-200">
                  <span>Direct connection to our central kitchen in Bhainsa</span>
                </div>
              </div>
            </div>

            {/* 4 Languages Cards */}
            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-heritage-gold/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-heritage-gold text-sm">1. English</span>
                  <span className="text-[10px] bg-heritage-gold/20 px-2 py-0.5 rounded text-amber-200 font-bold">Press 1</span>
                </div>
                <p className="text-xs text-cream-200">
                  "Welcome to Annapurna Aahaar. Press 1 for Orders, 2 to Track, 3 to Cancel, 4 for Support."
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-heritage-gold/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-heritage-gold text-sm">2. मराठी (Marathi)</span>
                  <span className="text-[10px] bg-heritage-gold/20 px-2 py-0.5 rounded text-amber-200 font-bold">2 दाबा</span>
                </div>
                <p className="text-xs text-cream-200">
                  "अन्नपूर्णा आहार मध्ये आपले स्वागत आहे. नवीन ऑर्डर करण्यासाठी 1 दाबा, ट्रॅकिंगसाठी 2 दाबा."
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-heritage-gold/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-heritage-gold text-sm">3. हिंदी (Hindi)</span>
                  <span className="text-[10px] bg-heritage-gold/20 px-2 py-0.5 rounded text-amber-200 font-bold">3 दबाएँ</span>
                </div>
                <p className="text-xs text-cream-200">
                  "अन्नपूर्णा आहार में आपका स्वागत है। ऑर्डर करने के लिए 1 दबाएँ, ट्रैक करने के लिए 2 दबाएँ।"
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-heritage-gold/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-heritage-gold text-sm">4. తెలుగు (Telugu)</span>
                  <span className="text-[10px] bg-heritage-gold/20 px-2 py-0.5 rounded text-amber-200 font-bold">4 నొక్కండి</span>
                </div>
                <p className="text-xs text-cream-200">
                  "అన్నపూర్ణ ఆహార్ కు స్వాగతం. ఆర్డర్ చేయడానికి 1 నొక్కండి, ట్రాక్ చేయడానికి 2 నొక్కండి."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-[#FAF6EE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
            <div>
              <span className="text-xs font-bold text-heritage-antiqueGold uppercase tracking-widest block mb-1">
                Fresh From Bhainsa Kitchen
              </span>
              <h2 className="font-serif font-black text-3xl sm:text-4xl text-heritage-maroon">
                Featured Traditional Specialties
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
                  src={getProductImageUrl('/products/turmeric-haldi-powder.webp')}
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
                  Order Online (COD / UPI / Cards)
                </Link>
                <a
                  href="tel:9347036152"
                  className="w-full sm:w-auto bg-white/15 hover:bg-white/25 text-white border border-heritage-gold/40 px-7 py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 text-base"
                >
                  <Phone className="w-4 h-4 text-heritage-gold" />
                  <span>Call to Order: 9347036152</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
