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
} from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-heritage-maroon text-cream-100 border-t-4 border-turmeric-600">
      {/* Value Badges Strip */}
      <div className="border-b border-amber-900/40 bg-[#3B1111]/80 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-turmeric-600/20 flex items-center justify-center mb-2 border border-turmeric-500/30">
              <Sparkles className="w-6 h-6 text-turmeric-400" />
            </div>
            <h4 className="font-serif font-bold text-cream-100 text-sm">100% Pure Grains</h4>
            <p className="text-xs text-cream-300 mt-0.5">Authentic Indian stone milling</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-turmeric-600/20 flex items-center justify-center mb-2 border border-turmeric-500/30">
              <ShieldCheck className="w-6 h-6 text-turmeric-400" />
            </div>
            <h4 className="font-serif font-bold text-cream-100 text-sm">Hygienic Preparation</h4>
            <p className="text-xs text-cream-300 mt-0.5">Clean processing & sun-drying</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-turmeric-600/20 flex items-center justify-center mb-2 border border-turmeric-500/30">
              <Truck className="w-6 h-6 text-turmeric-400" />
            </div>
            <h4 className="font-serif font-bold text-cream-100 text-sm">Fresh Batch Dispatch</h4>
            <p className="text-xs text-cream-300 mt-0.5">Free delivery above ₹500</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-turmeric-600/20 flex items-center justify-center mb-2 border border-turmeric-500/30">
              <HeartHandshake className="w-6 h-6 text-turmeric-400" />
            </div>
            <h4 className="font-serif font-bold text-cream-100 text-sm">Traditional Taste</h4>
            <p className="text-xs text-cream-300 mt-0.5">Handcrafted family heritage</p>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
        {/* Brand Col */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-turmeric-600 to-amber-800 flex items-center justify-center border border-turmeric-400/40">
              <span className="font-serif font-black text-lg text-cream-100">AA</span>
            </div>
            <div>
              <span className="font-serif font-extrabold text-xl text-cream-50 tracking-wider">
                ANNAPURNA AHAAR
              </span>
              <p className="text-xs font-semibold text-turmeric-400 tracking-widest uppercase">
                Tradition in Every Grain
              </p>
            </div>
          </div>
          <p className="text-sm text-cream-300/90 leading-relaxed max-w-sm">
            Dedicated to bringing authentic Indian food traditions into modern homes. Pure ingredients, pristine hygiene, and time-honored milling techniques for true Indian flavor.
          </p>
          <div className="pt-2 text-xs text-cream-400 space-y-1.5">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-turmeric-400 shrink-0" />
              <span>Near Traditional Grain Market, Industrial Area, India</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-turmeric-400 shrink-0" />
              <span>+91 98765 43210 (Customer Support)</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-turmeric-400 shrink-0" />
              <span>contact@annapurnaaahaar.in</span>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-serif font-bold text-cream-50 text-base mb-4 border-b border-amber-900/60 pb-2">
            Explore
          </h4>
          <ul className="space-y-2 text-sm text-cream-300">
            <li>
              <Link to="/" className="hover:text-turmeric-400 transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link to="/our-story" className="hover:text-turmeric-400 transition-colors">
                Our Story & Heritage
              </Link>
            </li>
            <li>
              <Link to="/products" className="hover:text-turmeric-400 transition-colors">
                Product Catalogue
              </Link>
            </li>
            <li>
              <Link to="/why-us" className="hover:text-turmeric-400 transition-colors">
                Why Choose Us
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-turmeric-400 transition-colors">
                Contact & Enquiries
              </Link>
            </li>
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h4 className="font-serif font-bold text-cream-50 text-base mb-4 border-b border-amber-900/60 pb-2">
            Categories
          </h4>
          <ul className="space-y-2 text-sm text-cream-300">
            <li>
              <Link to="/products?category=Papad" className="hover:text-turmeric-400 transition-colors">
                Handcrafted Papads
              </Link>
            </li>
            <li>
              <Link to="/products?category=Flours %26 Grains" className="hover:text-turmeric-400 transition-colors">
                Traditional Sevaya & Grains
              </Link>
            </li>
            <li>
              <Link to="/products?category=Spices" className="hover:text-turmeric-400 transition-colors">
                Pure Turmeric & Spices
              </Link>
            </li>
            <li>
              <Link to="/products?category=Noodles" className="hover:text-turmeric-400 transition-colors">
                Maggie & Quick Foods
              </Link>
            </li>
            <li>
              <Link to="/track" className="hover:text-turmeric-400 transition-colors font-medium text-turmeric-300">
                Track Live Order →
              </Link>
            </li>
          </ul>
        </div>

        {/* Brand Promise & Admin */}
        <div className="space-y-4">
          <h4 className="font-serif font-bold text-cream-50 text-base mb-4 border-b border-amber-900/60 pb-2">
            Our Promise
          </h4>
          <p className="text-xs text-cream-300 leading-relaxed">
            Every batch of Sevaya, Papad, and Turmeric is ground and sun-dried under strict hygienic standards. Zero adulteration, pure authentic taste.
          </p>
          <div className="pt-2">
            <Link
              to="/admin/login"
              className="inline-flex items-center gap-1.5 text-xs text-turmeric-400/90 hover:text-turmeric-300 border border-amber-800/80 px-3 py-1.5 rounded-md hover:bg-amber-900/40 transition-all"
            >
              <span>Admin Management</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="border-t border-amber-900/60 py-4 px-4 text-center text-xs text-cream-400/80">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <span>© {new Date().getFullYear()} Annapurna Aahaar. All rights reserved.</span>
          <span className="text-[11px] text-cream-400/60">
            Handcrafted with devotion to authentic Indian food traditions.
          </span>
        </div>
      </div>
    </footer>
  );
};
