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
  Star,
  ChevronRight,
  Package,
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
      title: 'Authentic Taste',
      desc: 'Formulated with age-old recipes from Indian kitchens, preserving true culinary heritage.',
    },
    {
      icon: Sun,
      title: 'Sun-Dried Perfection',
      desc: 'Naturally sun-cured papads and sevaya for maximum crispiness and long-lasting freshness.',
    },
    {
      icon: ShieldCheck,
      title: 'Hygienic Preparation',
      desc: 'Processed in ultra-clean, dust-free facilities with modern food safety protocols.',
    },
    {
      icon: Award,
      title: 'Pure Whole Grains',
      desc: '100% whole grain flours and pure spices with zero artificial fillers or starch adulteration.',
    },
    {
      icon: Flame,
      title: 'High Curcumin Turmeric',
      desc: 'Farm-direct golden turmeric powder packed with natural medicinal potency and rich aroma.',
    },
    {
      icon: Heart,
      title: 'Customer-First Values',
      desc: 'Fresh batch grinding, fast dispatch, and direct customer care with cash-on-delivery support.',
    },
  ];

  return (
    <div className="overflow-hidden">
      <SEOHead
        title="Annapurna Aahaar | Tradition in Every Grain | Authentic Indian Food & Spices"
        description="Authentic Indian food products crafted with care, quality, and tradition. Explore handcrafted papads, sun-dried wheat sevaya, and pure golden turmeric."
      />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-[#FAF4EB] via-[#FDFBF7] to-[#FCF9F2] pt-8 pb-16 lg:pt-12 lg:pb-24 border-b border-amber-900/10">
        {/* Subtle Decorative Background Elements */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-tr from-turmeric-400/15 via-amber-300/10 to-transparent blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content Column */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="lg:col-span-7 space-y-6 text-center lg:text-left"
            >
              {/* Heritage Badge */}
              <div className="inline-flex items-center gap-2 bg-amber-100/80 border border-amber-300/60 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold text-heritage-maroon shadow-sm">
                <Sparkles className="w-4 h-4 text-turmeric-600 animate-spin-slow" />
                <span>Authentic Indian Food Traditions</span>
              </div>

              {/* Main Headline */}
              <div className="space-y-2">
                <h1 className="font-serif font-black text-4xl sm:text-5xl lg:text-6xl text-heritage-maroon tracking-tight leading-[1.15]">
                  ANNAPURNA AHAAR
                </h1>
                <p className="font-serif italic text-2xl sm:text-3xl text-turmeric-700 font-medium">
                  "Tradition in Every Grain."
                </p>
              </div>

              {/* Supporting Description */}
              <p className="text-base sm:text-lg text-stone-700 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Authentic Indian food products crafted with care, quality, and time-honored milling techniques. Experience pure, sun-dried handcrafted papads, whole-wheat sevaya, and aromatic stone-ground turmeric.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/products"
                  className="w-full sm:w-auto bg-gradient-to-r from-turmeric-600 via-amber-600 to-heritage-maroon hover:from-turmeric-700 hover:to-amber-900 text-cream-50 px-8 py-4 rounded-xl font-bold text-base shadow-lg shadow-turmeric-700/25 hover:shadow-xl transition-all transform active:scale-95 flex items-center justify-center gap-2"
                >
                  <span>Shop Catalogue</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>

                <Link
                  to="/our-story"
                  className="w-full sm:w-auto bg-white hover:bg-cream-100 text-heritage-maroon border border-amber-900/20 px-7 py-4 rounded-xl font-semibold text-base shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <span>Explore Our Story</span>
                </Link>
              </div>

              {/* Quick Trust Highlights */}
              <div className="pt-6 border-t border-amber-900/10 grid grid-cols-3 gap-3 text-center sm:text-left">
                <div>
                  <div className="font-serif font-bold text-xl text-heritage-maroon">100%</div>
                  <div className="text-xs text-stone-600">Pure Grains</div>
                </div>
                <div>
                  <div className="font-serif font-bold text-xl text-heritage-maroon">₹0</div>
                  <div className="text-xs text-stone-600">Delivery &gt; ₹500</div>
                </div>
                <div>
                  <div className="font-serif font-bold text-xl text-heritage-maroon">4.9 ★</div>
                  <div className="text-xs text-stone-600">Customer Rating</div>
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
              <div className="relative rounded-3xl bg-gradient-to-b from-cream-100/80 to-amber-100/40 p-2 sm:p-4 border border-amber-900/10 shadow-2xl backdrop-blur-sm">
                <HeroScene />
                <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-xl border border-amber-900/10 shadow-sm flex items-center justify-between text-xs text-stone-700">
                  <span className="flex items-center gap-1.5 font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    Interactive 3D Stone Mill
                  </span>
                  <span className="text-turmeric-700 font-semibold">Chakki Grinding Heritage</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Category Quick Grid */}
      <section className="py-12 bg-white border-b border-amber-900/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-bold text-turmeric-700 uppercase tracking-widest block mb-1">
              Curated Collections
            </span>
            <h2 className="font-serif font-bold text-2xl sm:text-3xl text-stone-900">
              Authentic Indian Food Essentials
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Category 1: Papad */}
            <Link
              to="/products?category=Papad"
              className="group relative rounded-2xl overflow-hidden bg-cream-100 border border-amber-900/10 p-6 flex flex-col justify-between hover:shadow-lg transition-all duration-300"
            >
              <div className="space-y-2">
                <span className="text-xs font-semibold text-turmeric-800 bg-turmeric-100 px-2.5 py-1 rounded-full">
                  Handcrafted
                </span>
                <h3 className="font-serif font-bold text-xl text-stone-900 group-hover:text-turmeric-700 transition-colors">
                  Crispy Papads
                </h3>
                <p className="text-xs text-stone-600">
                  Urad Dal, Moong Dal, Masala & Rice Papad. Sun-dried crispiness.
                </p>
              </div>
              <div className="mt-6 flex items-center justify-between text-xs font-semibold text-heritage-maroon">
                <span>From ₹150 / 500g</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Category 2: Sevaya */}
            <Link
              to="/products?category=Flours %26 Grains"
              className="group relative rounded-2xl overflow-hidden bg-cream-100 border border-amber-900/10 p-6 flex flex-col justify-between hover:shadow-lg transition-all duration-300"
            >
              <div className="space-y-2">
                <span className="text-xs font-semibold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-full">
                  Pure Wheat
                </span>
                <h3 className="font-serif font-bold text-xl text-stone-900 group-hover:text-turmeric-700 transition-colors">
                  Traditional Sevaya
                </h3>
                <p className="text-xs text-stone-600">
                  Sun-dried whole wheat vermicelli for festive kheer and upma.
                </p>
              </div>
              <div className="mt-6 flex items-center justify-between text-xs font-semibold text-heritage-maroon">
                <span>₹100 / kg</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Category 3: Turmeric */}
            <Link
              to="/products?category=Spices"
              className="group relative rounded-2xl overflow-hidden bg-cream-100 border border-amber-900/10 p-6 flex flex-col justify-between hover:shadow-lg transition-all duration-300"
            >
              <div className="space-y-2">
                <span className="text-xs font-semibold text-yellow-800 bg-yellow-100 px-2.5 py-1 rounded-full">
                  High Curcumin
                </span>
                <h3 className="font-serif font-bold text-xl text-stone-900 group-hover:text-turmeric-700 transition-colors">
                  Golden Turmeric
                </h3>
                <p className="text-xs text-stone-600">
                  Pure farm turmeric powder, stone ground without chemical fillers.
                </p>
              </div>
              <div className="mt-6 flex items-center justify-between text-xs font-semibold text-heritage-maroon">
                <span>₹150 / kg</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Category 4: Noodles */}
            <Link
              to="/products?category=Noodles"
              className="group relative rounded-2xl overflow-hidden bg-cream-100 border border-amber-900/10 p-6 flex flex-col justify-between hover:shadow-lg transition-all duration-300"
            >
              <div className="space-y-2">
                <span className="text-xs font-semibold text-orange-800 bg-orange-100 px-2.5 py-1 rounded-full">
                  Quick Snack
                </span>
                <h3 className="font-serif font-bold text-xl text-stone-900 group-hover:text-turmeric-700 transition-colors">
                  Maggie & Noodles
                </h3>
                <p className="text-xs text-stone-600">
                  Masala instant noodles and desi wheat noodles for quick snacking.
                </p>
              </div>
              <div className="mt-6 flex items-center justify-between text-xs font-semibold text-heritage-maroon">
                <span>From ₹85 / pack</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-[#FCF9F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold text-turmeric-700 uppercase tracking-widest block mb-1">
                Handcrafted With Care
              </span>
              <h2 className="font-serif font-bold text-3xl sm:text-4xl text-stone-900">
                Featured Products
              </h2>
            </div>
            <Link
              to="/products"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-heritage-maroon hover:text-turmeric-700 transition-colors"
            >
              <span>View Full Catalogue</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="bg-white rounded-2xl h-80 animate-pulse border border-stone-200" />
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

      {/* Heritage & Brand Story Snippet */}
      <section className="py-16 lg:py-20 bg-heritage-maroon text-cream-100 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-bold text-turmeric-400 uppercase tracking-widest block">
                The Annapurna Aahaar Philosophy
              </span>
              <h2 className="font-serif font-black text-3xl sm:text-4xl lg:text-5xl text-cream-50 leading-tight">
                Honoring the Sacred Art of Indian Milling & Food Making
              </h2>
              <p className="text-cream-200/90 text-sm sm:text-base leading-relaxed">
                In Indian culture, food is revered as *Aahaar* — the source of vitality, health, and family bonding. At Annapurna Aahaar, we stay true to the authentic methods: selecting the finest quality grains, sun-drying under hygienic conditions, and ground slowly to preserve pure aroma and nutrition.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-2 text-xs sm:text-sm">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-turmeric-400 shrink-0 mt-0.5" />
                  <span>No synthetic colors or chemical preservatives</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-turmeric-400 shrink-0 mt-0.5" />
                  <span>Slow stone grinding to keep nutrients intact</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-turmeric-400 shrink-0 mt-0.5" />
                  <span>Traditional hand-rolled papad crispiness</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-turmeric-400 shrink-0 mt-0.5" />
                  <span>Direct delivery from our production batches</span>
                </div>
              </div>
              <div className="pt-2">
                <Link
                  to="/our-story"
                  className="inline-flex items-center gap-2 bg-turmeric-500 hover:bg-turmeric-600 text-stone-950 font-bold px-6 py-3 rounded-xl transition-all shadow-lg text-sm"
                >
                  <span>Read Our Full Story</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative rounded-2xl overflow-hidden border-2 border-amber-500/30 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=1000&q=80"
                  alt="Authentic Indian Milling and Spice Preparation"
                  className="w-full h-80 sm:h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6">
                  <span className="text-xs text-turmeric-300 font-semibold">Quality Assured</span>
                  <p className="text-white font-serif text-lg font-bold">
                    Pristine hygiene meets authentic family recipes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Pillars */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-turmeric-700 uppercase tracking-widest block mb-1">
              Our Core Commitments
            </span>
            <h2 className="font-serif font-bold text-3xl sm:text-4xl text-stone-900">
              Why Indian Families Choose Annapurna Aahaar
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyChoosePillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <motion.div
                  key={idx}
                  whileHover={{ y: -5 }}
                  className="bg-[#FCF9F2] p-7 rounded-2xl border border-amber-900/10 shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <div className="w-12 h-12 rounded-xl bg-turmeric-100 flex items-center justify-center mb-4 text-heritage-maroon border border-turmeric-300/40">
                    <Icon className="w-6 h-6" />
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

      {/* Customer Reviews */}
      <section className="py-16 bg-[#FAF4EB] border-t border-b border-amber-900/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-bold text-turmeric-700 uppercase tracking-widest block mb-1">
              Loved by Households
            </span>
            <h2 className="font-serif font-bold text-3xl text-stone-900">
              Real Reviews from Valued Customers
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-amber-900/10 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex gap-1 text-turmeric-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-stone-700 italic">
                  "The Urad Dal and Masala Papads are genuinely crisp and authentic. You can taste the freshly cracked black pepper and good hing. Reminds me of homemade papads from my grandmother."
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-stone-100 text-xs">
                <strong className="text-stone-900 block font-serif">Smt. Meenakshi Iyer</strong>
                <span className="text-stone-500">Bangalore, Karnataka</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-amber-900/10 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex gap-1 text-turmeric-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-stone-700 italic">
                  "Ordered 5kg Sevaya and Turmeric for our Diwali preparations. The sevaya kheer was rich and delicious, and the turmeric aroma is unmistakable compared to supermarket brands."
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-stone-100 text-xs">
                <strong className="text-stone-900 block font-serif">Sunil Agarwal</strong>
                <span className="text-stone-500">Jaipur, Rajasthan</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-amber-900/10 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex gap-1 text-turmeric-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-stone-700 italic">
                  "Very simple ordering process and the Cash on Delivery support gave me complete confidence. The package arrived in protective bubble wrap with crisp papads completely intact."
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-stone-100 text-xs">
                <strong className="text-stone-900 block font-serif">Ananya Deshmukh</strong>
                <span className="text-stone-500">Pune, Maharashtra</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Direct Order CTA Banner */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-heritage-maroon via-[#541B1B] to-turmeric-900 rounded-3xl p-8 sm:p-12 text-cream-100 text-center shadow-2xl relative overflow-hidden border-2 border-turmeric-600/40">
            <div className="relative z-10 space-y-4 max-w-2xl mx-auto">
              <span className="bg-turmeric-500/20 text-turmeric-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-turmeric-400/30">
                Fresh Batch Ready
              </span>
              <h2 className="font-serif font-black text-3xl sm:text-4xl text-cream-50">
                Ready to Taste True Indian Authenticity?
              </h2>
              <p className="text-cream-200/90 text-sm sm:text-base">
                Order your favorite handcrafted papads, sun-dried sevaya, and pure turmeric today. Enjoy fast dispatch directly to your doorstep.
              </p>
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/products"
                  className="w-full sm:w-auto bg-turmeric-500 hover:bg-turmeric-600 text-stone-950 font-bold px-8 py-3.5 rounded-xl shadow-lg transition-all transform active:scale-95 text-base"
                >
                  Order Now (Cash on Delivery)
                </Link>
                <Link
                  to="/contact"
                  className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-cream-100 border border-cream-200/30 px-6 py-3.5 rounded-xl font-semibold transition-colors text-sm"
                >
                  Bulk & Wholesale Enquiry
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
