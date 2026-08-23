import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ShieldCheck,
  Truck,
  HeartHandshake,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  Headphones,
  CreditCard,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const Footer: React.FC = () => {
  const { t } = useLanguage();
  const mapSearchUrl =
    'https://www.google.com/maps/search/?api=1&query=Bhainsa,+Nirmal+District,+Telangana+504103';

  return (
    <footer className="bg-[#0C241E] text-[#F8F3E7] border-t-4 border-[#C79A45]">
      {/* Heritage Value Badges Strip */}
      <div className="border-b border-[#C79A45]/20 bg-[#081814] py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-2xl bg-[#173F35] flex items-center justify-center mb-2 border border-[#C79A45]/40 shadow-xs">
              <Sparkles className="w-6 h-6 text-[#C79A45]" />
            </div>
            <h4 className="font-serif font-bold text-[#F8F3E7] text-sm">{t('trust_2_title')}</h4>
            <p className="text-xs text-stone-300 mt-0.5">{t('trust_2_desc')}</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-2xl bg-[#173F35] flex items-center justify-center mb-2 border border-[#C79A45]/40 shadow-xs">
              <ShieldCheck className="w-6 h-6 text-[#C79A45]" />
            </div>
            <h4 className="font-serif font-bold text-[#F8F3E7] text-sm">{t('trust_3_title')}</h4>
            <p className="text-xs text-stone-300 mt-0.5">{t('trust_3_desc')}</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-2xl bg-[#173F35] flex items-center justify-center mb-2 border border-[#C79A45]/40 shadow-xs">
              <Truck className="w-6 h-6 text-[#C79A45]" />
            </div>
            <h4 className="font-serif font-bold text-[#F8F3E7] text-sm">{t('order_way_doorstep_title')}</h4>
            <p className="text-xs text-stone-300 mt-0.5">{t('order_way_doorstep_desc')}</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-2xl bg-[#173F35] flex items-center justify-center mb-2 border border-[#C79A45]/40 shadow-xs">
              <HeartHandshake className="w-6 h-6 text-[#C79A45]" />
            </div>
            <h4 className="font-serif font-bold text-[#F8F3E7] text-sm">{t('trust_1_title')}</h4>
            <p className="text-xs text-stone-300 mt-0.5">{t('trust_1_desc')}</p>
          </div>
        </div>
      </div>

      {/* Multilingual 24/7 Telephone Ordering Strip */}
      <div className="bg-[#173F35] border-b border-[#C79A45]/30 py-4 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#C79A45] text-[#173F35] flex items-center justify-center font-bold shadow-md shrink-0">
              <Phone className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">
                {t('acc_banner_title')} {t('acc_banner_subtitle')}
              </div>
              <div className="text-xs text-[#C79A45] font-medium">
                24/7 Multilingual Voice IVR Hotline: English, मराठी, हिन्दी, తెలుగు
              </div>
            </div>
          </div>

          <a
            href="tel:9347036152"
            className="inline-flex items-center gap-2 bg-[#C79A45] hover:bg-[#D5AD56] text-[#173F35] font-black px-6 py-2.5 rounded-full shadow-lg text-sm transition-all hover:scale-105"
          >
            <Phone className="w-4 h-4" />
            <span>{t('nav_call_to_order')}: 9347036152</span>
          </a>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
        {/* Brand Profile Column */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#173F35] border border-[#C79A45]/40 flex items-center justify-center shadow-md">
              <span className="font-serif font-black text-lg text-[#C79A45]">AA</span>
            </div>
            <div>
              <span className="font-serif font-black text-xl text-white tracking-wide">
                ANNAPURNA AAHAAR
              </span>
              <p className="text-xs font-bold text-[#C79A45] tracking-widest uppercase">
                {t('tagline')}
              </p>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-sm">
            Handcrafted traditional Indian food products produced with pure farm-sourced grains, sun-dried hygiene, and authentic home-style recipes.
          </p>

          <div className="pt-2 text-xs text-stone-300 space-y-2">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-[#C79A45] shrink-0 mt-0.5" />
              <div>
                <span>Bhainsa, Nirmal District, Telangana — 504103</span>
                <a
                  href={mapSearchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-[11px] text-[#C79A45] hover:underline mt-0.5"
                >
                  View on Google Maps →
                </a>
              </div>
            </div>

            {/* Dedicated IVR Hotline */}
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#C79A45] shrink-0" />
              <span>
                Dedicated 24/7 IVR: <a href="tel:9347036152" className="text-[#C79A45] font-bold hover:underline">9347036152</a>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#C79A45] shrink-0" />
              <span>
                Payment Contact: <strong className="text-white">9542836358</strong> (UPI: 9542836358@ybl)
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#C79A45]/70 shrink-0" />
              <span>Kitchen Help: +91 6305970844 / +91 8688456925</span>
            </div>

            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#C79A45] shrink-0" />
              <a href="mailto:annapurnaaahaar@gmail.com" className="hover:text-[#C79A45] transition-colors">
                annapurnaaahaar@gmail.com
              </a>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-serif font-bold text-white text-base mb-4 border-b border-[#C79A45]/30 pb-2">
            {t('footer_quick_links')}
          </h4>
          <ul className="space-y-2 text-xs sm:text-sm text-stone-300">
            <li>
              <Link to="/" className="hover:text-[#C79A45] transition-colors">
                {t('nav_home')}
              </Link>
            </li>
            <li>
              <Link to="/products" className="hover:text-[#C79A45] transition-colors">
                {t('nav_products')}
              </Link>
            </li>
            <li>
              <Link to="/our-story" className="hover:text-[#C79A45] transition-colors">
                {t('nav_about')}
              </Link>
            </li>
            <li>
              <Link to="/why-us" className="hover:text-[#C79A45] transition-colors">
                {t('nav_why_us')}
              </Link>
            </li>
            <li>
              <Link to="/track" className="hover:text-[#C79A45] transition-colors font-semibold text-[#C79A45]">
                {t('nav_track')} →
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-[#C79A45] transition-colors">
                {t('nav_contact')}
              </Link>
            </li>
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h4 className="font-serif font-bold text-white text-base mb-4 border-b border-[#C79A45]/30 pb-2">
            Catalogue
          </h4>
          <ul className="space-y-2 text-xs sm:text-sm text-stone-300">
            <li>
              <Link to="/products?category=Papad" className="hover:text-[#C79A45] transition-colors">
                {t('cat_papad')}
              </Link>
            </li>
            <li>
              <Link to="/products?category=Flours %26 Grains" className="hover:text-[#C79A45] transition-colors">
                {t('cat_sevaya')}
              </Link>
            </li>
            <li>
              <Link to="/products?category=Spices" className="hover:text-[#C79A45] transition-colors">
                {t('cat_spices')}
              </Link>
            </li>
            <li>
              <Link to="/products?category=Noodles %26 Instant Foods" className="hover:text-[#C79A45] transition-colors">
                {t('cat_noodles')}
              </Link>
            </li>
          </ul>
        </div>

        {/* Policies & Admin Portal */}
        <div className="space-y-4">
          <h4 className="font-serif font-bold text-white text-base mb-4 border-b border-[#C79A45]/30 pb-2">
            Business Policies
          </h4>
          <ul className="space-y-2 text-xs text-stone-300">
            <li>
              <span className="block text-[#F8F3E7] font-semibold">Voice Ordering:</span>
              <a href="tel:9347036152" className="text-[#C79A45] font-bold">9347036152</a> (24/7 Hotline)
            </li>
            <li>
              <span className="block text-[#F8F3E7] font-semibold">Payment Modes:</span>
              <span>Cash on Delivery & Direct UPI (9542836358@ybl)</span>
            </li>
            <li>
              <span className="block text-[#F8F3E7] font-semibold">Dispatch Location:</span>
              <span>Bhainsa, Nirmal, Telangana (504103)</span>
            </li>
          </ul>
          <div className="pt-2">
            <Link
              to="/admin/login"
              className="inline-flex items-center gap-1.5 text-xs text-[#C79A45] border border-[#C79A45]/40 px-3 py-1.5 rounded-xl hover:bg-[#173F35] transition-all font-semibold"
            >
              <span>Admin Management Portal</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Legal & Copyright Bar */}
      <div className="border-t border-[#C79A45]/20 py-5 px-4 text-center text-xs text-stone-400 bg-[#071512]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <p>© {new Date().getFullYear()} Annapurna Aahaar. All rights reserved. Registered in Bhainsa, Telangana.</p>
          <p className="text-[#C79A45]">
            {t('tagline')} • Founder & Owner: <strong>Bande Omkar</strong>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
