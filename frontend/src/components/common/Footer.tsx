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
  ExternalLink,
  Headphones,
} from 'lucide-react';

export const Footer: React.FC = () => {
  const mapSearchUrl =
    'https://www.google.com/maps/search/?api=1&query=Bhainsa,+Nirmal+District,+Telangana+504103';

  return (
    <footer className="bg-heritage-darkMaroon text-cream-100 border-t-4 border-heritage-gold">
      {/* Value Badges Strip */}
      <div className="border-b border-heritage-gold/20 bg-[#2A060C] py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-heritage-gold/20 flex items-center justify-center mb-2 border border-heritage-gold/40">
              <Sparkles className="w-6 h-6 text-heritage-gold" />
            </div>
            <h4 className="font-serif font-bold text-cream-100 text-sm">100% Pure Grains</h4>
            <p className="text-xs text-cream-300 mt-0.5">Authentic Indian stone milling</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-heritage-gold/20 flex items-center justify-center mb-2 border border-heritage-gold/40">
              <ShieldCheck className="w-6 h-6 text-heritage-gold" />
            </div>
            <h4 className="font-serif font-bold text-cream-100 text-sm">Sun-Cured Hygiene</h4>
            <p className="text-xs text-cream-300 mt-0.5">Naturally dried & sealed</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-heritage-gold/20 flex items-center justify-center mb-2 border border-heritage-gold/40">
              <Truck className="w-6 h-6 text-heritage-gold" />
            </div>
            <h4 className="font-serif font-bold text-cream-100 text-sm">Fresh Batch Dispatch</h4>
            <p className="text-xs text-cream-300 mt-0.5">Free delivery above ₹500</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-heritage-gold/20 flex items-center justify-center mb-2 border border-heritage-gold/40">
              <HeartHandshake className="w-6 h-6 text-heritage-gold" />
            </div>
            <h4 className="font-serif font-bold text-cream-100 text-sm">Authentic Indian Taste</h4>
            <p className="text-xs text-cream-300 mt-0.5">Direct from Bhainsa, Telangana</p>
          </div>
        </div>
      </div>

      {/* Multilingual Phone Ordering Strip */}
      <div className="bg-gradient-to-r from-amber-900/60 via-amber-800/40 to-amber-900/60 border-b border-heritage-gold/30 py-4 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-heritage-gold text-heritage-darkMaroon flex items-center justify-center font-bold">
              <Phone className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">Can't use the website? Order directly by phone!</div>
              <div className="text-xs text-amber-200">
                24/7 Multilingual Voice IVR: English, मराठी (Marathi), हिंदी (Hindi), తెలుగు (Telugu)
              </div>
            </div>
          </div>

          <a
            href="tel:9347036152"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-heritage-gold to-amber-500 hover:from-amber-400 hover:to-heritage-gold text-heritage-darkMaroon font-black px-6 py-2.5 rounded-full shadow-lg text-sm transition-all hover:scale-105"
          >
            <Phone className="w-4 h-4" />
            <span>CALL TO ORDER: 9347036152</span>
          </a>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
        {/* Brand & Owner Col */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-heritage-gold to-heritage-antiqueGold flex items-center justify-center border border-heritage-gold/40 shadow-md">
              <span className="font-serif font-black text-lg text-heritage-darkMaroon">AA</span>
            </div>
            <div>
              <span className="font-serif font-black text-xl text-cream-50 tracking-wider">
                ANNAPURNA AHAAR
              </span>
              <p className="text-xs font-bold text-heritage-gold tracking-widest uppercase">
                Tradition in Every Grain
              </p>
            </div>
          </div>

          <p className="text-sm text-cream-200/90 leading-relaxed max-w-sm">
            Handcrafted traditional Indian food products crafted by <strong>Bande Omkar</strong> with passion, pure ingredients, and hygienic milling techniques.
          </p>

          <div className="pt-2 text-xs text-cream-300 space-y-2">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-heritage-gold shrink-0 mt-0.5" />
              <div>
                <span>Bhainsa, Nirmal District, Telangana — 504103</span>
                <a
                  href={mapSearchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-[11px] text-heritage-gold hover:underline mt-0.5"
                >
                  View on Google Maps →
                </a>
              </div>
            </div>

            {/* Dedicated IVR Hotline */}
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-heritage-gold shrink-0" />
              <span>Dedicated IVR Hotline: <a href="tel:9347036152" className="text-heritage-gold font-bold hover:underline">9347036152</a></span>
            </div>

            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-heritage-gold/70 shrink-0" />
              <span>Kitchen Helplines: +91 6305970844 / +91 8688456925</span>
            </div>

            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-heritage-gold shrink-0" />
              <a href="mailto:annapurnaaahaar@gmail.com" className="hover:text-heritage-gold transition-colors">
                annapurnaaahaar@gmail.com
              </a>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-serif font-bold text-cream-50 text-base mb-4 border-b border-heritage-gold/30 pb-2">
            Explore Store
          </h4>
          <ul className="space-y-2 text-sm text-cream-300">
            <li>
              <Link to="/" className="hover:text-heritage-gold transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link to="/our-story" className="hover:text-heritage-gold transition-colors">
                Our Story & Heritage
              </Link>
            </li>
            <li>
              <Link to="/products" className="hover:text-heritage-gold transition-colors">
                Product Catalogue
              </Link>
            </li>
            <li>
              <Link to="/why-us" className="hover:text-heritage-gold transition-colors">
                Why Choose Us
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-heritage-gold transition-colors">
                Contact & Enquiries
              </Link>
            </li>
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h4 className="font-serif font-bold text-cream-50 text-base mb-4 border-b border-heritage-gold/30 pb-2">
            Categories
          </h4>
          <ul className="space-y-2 text-sm text-cream-300">
            <li>
              <Link to="/products?category=Papad" className="hover:text-heritage-gold transition-colors">
                Handcrafted Papads
              </Link>
            </li>
            <li>
              <Link to="/products?category=Flours %26 Grains" className="hover:text-heritage-gold transition-colors">
                Traditional Wheat Sevaya
              </Link>
            </li>
            <li>
              <Link to="/products?category=Spices" className="hover:text-heritage-gold transition-colors">
                Pure Golden Turmeric
              </Link>
            </li>
            <li>
              <Link to="/products?category=Noodles %26 Instant Foods" className="hover:text-heritage-gold transition-colors">
                Noodles & Instant Foods
              </Link>
            </li>
            <li>
              <Link to="/track" className="hover:text-heritage-gold transition-colors font-semibold text-heritage-gold">
                Track Live Order →
              </Link>
            </li>
          </ul>
        </div>

        {/* Policies & Business Info */}
        <div className="space-y-4">
          <h4 className="font-serif font-bold text-cream-50 text-base mb-4 border-b border-heritage-gold/30 pb-2">
            Customer Policies
          </h4>
          <ul className="space-y-2 text-xs text-cream-300">
            <li>
              <span className="block text-cream-100 font-semibold">Phone Ordering:</span>
              <a href="tel:9347036152" className="text-heritage-gold font-bold">Call 9347036152</a> (24/7)
            </li>
            <li>
              <span className="block text-cream-100 font-semibold">Payment Methods:</span>
              <span>Online (Razorpay / UPI / Cards) & Cash on Delivery</span>
            </li>
            <li>
              <span className="block text-cream-100 font-semibold">Packaging:</span>
              <span>Hygienic Moisture-Proof Protective Seal</span>
            </li>
            <li>
              <span className="block text-cream-100 font-semibold">Delivery Time:</span>
              <span>Prompt dispatch across Telangana and India</span>
            </li>
          </ul>
          <div className="pt-2">
            <Link
              to="/admin/login"
              className="inline-flex items-center gap-1.5 text-xs text-heritage-gold border border-heritage-gold/40 px-3 py-1.5 rounded-lg hover:bg-heritage-gold/10 transition-all font-semibold"
            >
              <span>Admin Management Portal</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Legal & Copyright Bar */}
      <div className="border-t border-heritage-gold/20 py-6 px-4 text-center text-xs text-cream-300 bg-[#220409]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <p>© {new Date().getFullYear()} Annapurna Aahaar. All rights reserved. Registered in Bhainsa, Telangana.</p>
          <p className="text-heritage-gold/80">
            Tradition in Every Grain • Owner: <strong>Bande Omkar</strong>
          </p>
        </div>
      </div>
    </footer>
  );
};
