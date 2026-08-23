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
  Phone,
  Headphones,
  CheckCircle2,
} from 'lucide-react';
import { ProductCard3D } from '../components/product/ProductCard3D';
import { HeroScene } from '../components/3d/HeroScene';
import { SEOHead } from '../components/common/SEOHead';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';
import { Product } from '../types';
import { getProductImageUrl } from '../utils/formatters';

export const Home: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { t, language } = useLanguage();

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
      icon: Truck,
      title: t('order_way_doorstep_title'),
      desc: t('order_way_doorstep_desc'),
    },
    {
      icon: Heart,
      title: 'Local & Trusted',
      desc: 'Founded by Bande Omkar in Bhainsa, Nirmal District, Telangana (504103) with honest handcrafted quality.',
    },
  ];

  return (
    <div className="overflow-hidden bg-[#F8F3E7] text-[#252525]">
      <SEOHead
        title="Annapurna Aahaar | Traditional Indian Food Products"
        description="Annapurna Aahaar offers traditional Indian food products including sevaya, papad and turmeric powder from Bhainsa, Nirmal District, Telangana. Order online or call 9347036152."
        url="https://bandegangasai.github.io/annapurna-aahaar/"
      />

      {/* 1. HERO SECTION WITH 3D HERITAGE COMPOSITION */}
      <section className="relative bg-[#F8F3E7] pt-8 pb-14 lg:pt-12 lg:pb-20 border-b border-[#C79A45]/25">
        {/* Subtle Background Glow */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[850px] h-[450px] bg-gradient-to-tr from-[#C79A45]/15 via-[#173F35]/8 to-transparent blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Brand Statement & Primary Actions */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="lg:col-span-6 space-y-6 text-center lg:text-left"
            >
              {/* Heritage Badge */}
              <div className="inline-flex items-center gap-2 bg-[#173F35]/10 border border-[#C79A45]/40 px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold text-[#173F35] shadow-xs">
                <Sparkles className="w-4 h-4 text-[#C79A45] animate-spin-slow" />
                <span>{t('hero_badge')}</span>
              </div>

              {/* Dynamic Multilingual Main Headline */}
              <div className="space-y-1">
                <h1 className="font-serif font-black text-4xl sm:text-5xl lg:text-6xl text-[#173F35] tracking-tight leading-[1.12]">
                  {t('hero_title_1')} <br className="hidden sm:inline" />
                  <span className="text-[#A65332]">{t('hero_title_2')}</span>
                </h1>
                <p className="font-serif italic text-xl sm:text-2xl text-[#C79A45] font-semibold pt-1">
                  "{t('tagline')}"
                </p>
              </div>

              {/* Supporting Description */}
              <p className="text-base sm:text-lg text-stone-muted max-w-xl mx-auto lg:mx-0 leading-relaxed">
                {t('hero_subtitle')}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/products"
                  className="w-full sm:w-auto bg-[#173F35] hover:bg-[#0C241E] text-[#F8F3E7] px-8 py-4 rounded-2xl font-bold text-base shadow-lg shadow-[#173F35]/20 hover:shadow-xl transition-all transform active:scale-95 flex items-center justify-center gap-2 border border-[#C79A45]/40"
                >
                  <span>{t('hero_shop_now')}</span>
                  <ArrowRight className="w-5 h-5 text-[#C79A45]" />
                </Link>

                {/* Highly Visible CALL TO ORDER Button */}
                <a
                  href="tel:9347036152"
                  className="w-full sm:w-auto bg-[#C79A45] hover:bg-[#D5AD56] text-[#173F35] px-7 py-4 rounded-2xl font-black text-base shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2.5 border border-[#173F35]/20 transform active:scale-95"
                >
                  <Phone className="w-5 h-5 animate-pulse text-[#173F35]" />
                  <span>{t('hero_call_order')}</span>
                </a>
              </div>

              {/* Stat Highlights */}
              <div className="pt-6 border-t border-[#C79A45]/20 grid grid-cols-3 gap-3 text-center sm:text-left">
                <div>
                  <div className="font-serif font-bold text-base sm:text-lg text-[#173F35]">
                    {t('hero_stat_purity')}
                  </div>
                  <div className="text-[11px] text-stone-muted">Stone-Ground Milling</div>
                </div>
                <div>
                  <div className="font-serif font-bold text-base sm:text-lg text-[#173F35]">
                    {t('hero_stat_trust')}
                  </div>
                  <div className="text-[11px] text-stone-muted">Pure Quality</div>
                </div>
                <div>
                  <div className="font-serif font-bold text-base sm:text-lg text-[#173F35]">
                    {t('hero_stat_dispatch')}
                  </div>
                  <div className="text-[11px] text-stone-muted">From Bhainsa, TS</div>
                </div>
              </div>
            </motion.div>

            {/* Right Column: Interactive 3D Hero Scene */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-6 relative flex justify-center"
            >
              <HeroScene />
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. ACCESSIBILITY HOTLINE BANNER */}
      <section className="bg-[#173F35] text-[#F8F3E7] py-6 px-4 border-y-2 border-[#C79A45]/40 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#C79A45] text-[#173F35] flex items-center justify-center font-black shadow-md shrink-0">
              <Phone className="w-6 h-6 animate-bounce" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg sm:text-xl text-white">
                {t('acc_banner_title')}
              </h3>
              <p className="text-xs sm:text-sm text-stone-200 mt-0.5">
                {t('acc_banner_subtitle')}
              </p>
            </div>
          </div>

          <a
            href="tel:9347036152"
            className="inline-flex items-center gap-2 bg-[#C79A45] hover:bg-[#D5AD56] text-[#173F35] font-black px-7 py-3 rounded-2xl shadow-md text-sm transition-all hover:scale-105 shrink-0"
          >
            <Phone className="w-4 h-4" />
            <span>{t('acc_banner_btn')}</span>
          </a>
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS CATALOGUE */}
      <section className="py-16 bg-[#F8F3E7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
            <div>
              <span className="text-xs font-bold text-[#C79A45] uppercase tracking-widest block mb-1">
                {t('prod_section_tag')}
              </span>
              <h2 className="font-serif font-black text-3xl sm:text-4xl text-[#173F35]">
                {t('prod_section_title')}
              </h2>
              <p className="text-xs sm:text-sm text-stone-muted mt-1 max-w-xl">
                {t('prod_section_desc')}
              </p>
            </div>
            <Link
              to="/products"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-[#173F35] hover:text-[#A65332] transition-colors"
            >
              <span>{t('cat_all')}</span>
              <ArrowRight className="w-4 h-4 text-[#C79A45]" />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="bg-white rounded-3xl h-80 animate-pulse border border-[#C79A45]/20" />
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

      {/* 4. ORDER YOUR WAY & SIMPLE VOICE ORDERING */}
      <section className="py-16 bg-white border-y border-[#C79A45]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold text-[#C79A45] uppercase tracking-widest block mb-1">
              {t('order_ways_tag')}
            </span>
            <h2 className="font-serif font-black text-3xl sm:text-4xl text-[#173F35]">
              {t('order_ways_title')}
            </h2>
          </div>

          {/* 4 Ways Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-[#F8F3E7] p-6 rounded-3xl border border-[#C79A45]/30 shadow-subtle space-y-3">
              <div className="w-11 h-11 rounded-2xl bg-[#173F35] text-[#C79A45] flex items-center justify-center font-bold">
                1
              </div>
              <h3 className="font-serif font-bold text-lg text-stone-primary">
                {t('order_way_web_title')}
              </h3>
              <p className="text-xs sm:text-sm text-stone-muted leading-relaxed">
                {t('order_way_web_desc')}
              </p>
            </div>

            <div className="bg-[#F8F3E7] p-6 rounded-3xl border border-[#C79A45]/30 shadow-subtle space-y-3">
              <div className="w-11 h-11 rounded-2xl bg-[#173F35] text-[#C79A45] flex items-center justify-center font-bold">
                2
              </div>
              <h3 className="font-serif font-bold text-lg text-stone-primary">
                {t('order_way_phone_title')}
              </h3>
              <p className="text-xs sm:text-sm text-stone-muted leading-relaxed">
                {t('order_way_phone_desc')}
              </p>
            </div>

            <div className="bg-[#F8F3E7] p-6 rounded-3xl border-2 border-[#C79A45] shadow-md space-y-3 relative">
              <span className="absolute -top-3 right-4 bg-[#C79A45] text-[#173F35] text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
                4 Languages
              </span>
              <div className="w-11 h-11 rounded-2xl bg-[#173F35] text-[#C79A45] flex items-center justify-center font-bold">
                3
              </div>
              <h3 className="font-serif font-bold text-lg text-stone-primary">
                {t('order_way_ivr_title')}
              </h3>
              <p className="text-xs sm:text-sm text-stone-muted leading-relaxed">
                {t('order_way_ivr_desc')}
              </p>
            </div>

            <div className="bg-[#F8F3E7] p-6 rounded-3xl border border-[#C79A45]/30 shadow-subtle space-y-3">
              <div className="w-11 h-11 rounded-2xl bg-[#173F35] text-[#C79A45] flex items-center justify-center font-bold">
                4
              </div>
              <h3 className="font-serif font-bold text-lg text-stone-primary">
                {t('order_way_doorstep_title')}
              </h3>
              <p className="text-xs sm:text-sm text-stone-muted leading-relaxed">
                {t('order_way_doorstep_desc')}
              </p>
            </div>
          </div>

          {/* Simple Voice Ordering Deep Dive Card */}
          <div className="bg-[#173F35] text-[#F8F3E7] p-8 sm:p-10 rounded-3xl border-2 border-[#C79A45]/40 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#C79A45]/25 pb-6">
              <div>
                <span className="text-xs font-bold text-[#C79A45] uppercase tracking-widest">
                  {t('ivr_sec_tag')}
                </span>
                <h3 className="font-serif font-black text-2xl sm:text-3xl text-white mt-1">
                  {t('ivr_sec_title')}
                </h3>
              </div>
              <a
                href="tel:9347036152"
                className="bg-[#C79A45] hover:bg-[#D5AD56] text-[#173F35] font-black px-6 py-3 rounded-2xl text-sm shadow-md transition-all flex items-center gap-2 shrink-0"
              >
                <Phone className="w-4 h-4 text-[#173F35]" />
                <span>Dial 9347036152</span>
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="bg-[#0C241E] p-4 rounded-2xl border border-[#C79A45]/30 space-y-1.5">
                <span className="font-bold text-[#C79A45] block">{t('ivr_step_1')}</span>
                <p className="text-stone-300">{t('ivr_step_1_desc')}</p>
              </div>
              <div className="bg-[#0C241E] p-4 rounded-2xl border border-[#C79A45]/30 space-y-1.5">
                <span className="font-bold text-[#C79A45] block">{t('ivr_step_2')}</span>
                <p className="text-stone-300">{t('ivr_step_2_desc')}</p>
              </div>
              <div className="bg-[#0C241E] p-4 rounded-2xl border border-[#C79A45]/30 space-y-1.5">
                <span className="font-bold text-[#C79A45] block">{t('ivr_step_3')}</span>
                <p className="text-stone-300">{t('ivr_step_3_desc')}</p>
              </div>
              <div className="bg-[#0C241E] p-4 rounded-2xl border border-[#C79A45]/30 space-y-1.5">
                <span className="font-bold text-[#C79A45] block">{t('ivr_step_4')}</span>
                <p className="text-stone-300">{t('ivr_step_4_desc')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. WHY CHOOSE ANNAPURNA AAHAAR */}
      <section className="py-16 lg:py-20 bg-[#F8F3E7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-[#C79A45] uppercase tracking-widest block mb-1">
              {t('trust_section_tag')}
            </span>
            <h2 className="font-serif font-black text-3xl sm:text-4xl text-[#173F35]">
              {t('trust_section_title')}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyChoosePillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <motion.div
                  key={idx}
                  whileHover={{ y: -5 }}
                  className="bg-white p-7 rounded-3xl border border-[#C79A45]/30 shadow-subtle hover:shadow-card-lift transition-all duration-200"
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#173F35] flex items-center justify-center mb-4 text-[#C79A45] border border-[#C79A45]/40 shadow-xs">
                    <Icon className="w-6 h-6 text-[#C79A45]" />
                  </div>
                  <h3 className="font-serif font-bold text-xl text-stone-primary mb-2">
                    {pillar.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-muted leading-relaxed">
                    {pillar.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. BOTTOM CALL-TO-ACTION BANNER */}
      <section className="py-16 bg-[#F8F3E7]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#173F35] rounded-3xl p-8 sm:p-12 text-[#F8F3E7] text-center shadow-2xl relative overflow-hidden border-2 border-[#C79A45]/40">
            <div className="relative z-10 space-y-4 max-w-2xl mx-auto">
              <span className="bg-[#C79A45]/25 text-[#C79A45] text-xs font-bold px-3.5 py-1 rounded-full uppercase tracking-wider border border-[#C79A45]/40">
                Bhainsa Central Kitchen • Direct Dispatch
              </span>
              <h2 className="font-serif font-black text-3xl sm:text-4xl text-white">
                Ready to Experience Authentic Indian Food Purity?
              </h2>
              <p className="text-stone-200 text-sm sm:text-base leading-relaxed">
                Order your favorite handcrafted papads, roasted wheat sevaya, and pure turmeric directly from Bhainsa, Nirmal District, Telangana (504103).
              </p>
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/products"
                  className="w-full sm:w-auto bg-[#C79A45] hover:bg-[#D5AD56] text-[#173F35] font-black px-8 py-4 rounded-2xl shadow-xl transition-all transform active:scale-95 text-base"
                >
                  {t('hero_shop_now')}
                </Link>
                <a
                  href="tel:9347036152"
                  className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white border border-[#C79A45]/50 px-7 py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 text-base"
                >
                  <Phone className="w-4 h-4 text-[#C79A45]" />
                  <span>Call 9347036152</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
