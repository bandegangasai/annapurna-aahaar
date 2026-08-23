import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ShoppingBag,
  Search,
  Menu,
  X,
  Phone,
  Clock,
  ChevronRight,
  ShieldCheck,
  Headphones,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { totalItemsCount, setIsCartOpen } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
  }, [location.pathname]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Our Story', path: '/our-story' },
    { name: 'Products', path: '/products' },
    { name: 'Why Us', path: '/why-us' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <>
      {/* Top Authentic Heritage Notice Bar with IVR Ordering Phone */}
      <div className="bg-heritage-darkMaroon text-cream-100 text-xs py-2 px-4 font-medium border-b border-heritage-gold/30">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-heritage-gold animate-pulse" />
            <span className="hidden sm:inline">Bhainsa, Nirmal District, Telangana (504103)</span>
            <span className="sm:hidden">Bhainsa, Telangana</span>
            <span className="text-heritage-gold/50 hidden md:inline">|</span>
            <span className="hidden md:inline text-cream-200">Owner: Bande Omkar</span>
          </div>

          <div className="flex items-center gap-3 sm:gap-6 text-xs">
            {/* Dedicated IVR Hotline Call Link */}
            <a
              href="tel:9347036152"
              className="flex items-center gap-1.5 bg-heritage-gold/25 hover:bg-heritage-gold/40 text-heritage-gold border border-heritage-gold/40 px-2.5 py-0.5 rounded-full font-bold transition-all"
              title="24/7 Telephone IVR Ordering in English, Marathi, Hindi, Telugu"
            >
              <Phone className="w-3 h-3 animate-pulse" />
              <span>Order by Phone: <strong className="text-white">9347036152</strong></span>
            </a>

            <Link
              to="/track"
              className="hidden lg:flex items-center gap-1 text-cream-200 hover:text-heritage-gold transition-colors"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Track Order</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Sticky Navbar */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#FAF6EE]/95 backdrop-blur-md shadow-md py-3 border-b border-heritage-gold/20'
            : 'bg-[#FAF6EE] py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-heritage-gold via-heritage-antiqueGold to-heritage-maroon p-0.5 shadow-md group-hover:scale-105 transition-transform">
              <div className="w-full h-full rounded-full bg-heritage-maroon flex items-center justify-center border border-heritage-gold/40">
                <span className="font-serif font-black text-lg text-heritage-gold tracking-wider">AA</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-black text-xl sm:text-2xl text-heritage-maroon tracking-wide group-hover:text-heritage-richRed transition-colors">
                ANNAPURNA AHAAR
              </span>
              <span className="text-[10px] sm:text-xs font-bold text-heritage-antiqueGold tracking-widest uppercase">
                Tradition in Every Grain
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'text-heritage-maroon bg-heritage-gold/15 shadow-sm border border-heritage-gold/30'
                      : 'text-stone-700 hover:text-heritage-maroon hover:bg-cream-200/60'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Desktop CALL TO ORDER Button */}
            <a
              href="tel:9347036152"
              className="hidden lg:flex items-center gap-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-sm transition-all hover:scale-105"
              title="24/7 Telephone Ordering: 9347036152"
            >
              <Phone className="w-3.5 h-3.5 text-amber-200 animate-pulse" />
              <span>CALL: 9347036152</span>
            </a>

            {/* Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 rounded-full text-stone-700 hover:text-heritage-maroon hover:bg-heritage-gold/10 transition-colors"
              aria-label="Search Products"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 rounded-full text-stone-700 hover:text-heritage-maroon hover:bg-heritage-gold/10 transition-colors"
              aria-label="View Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-heritage-maroon text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-pulse">
                  {totalItemsCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-stone-700 hover:text-heritage-maroon hover:bg-cream-200/60"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Collapsible Search Input */}
        {isSearchOpen && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 pb-2 transition-all">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search papad, whole wheat sevaya, turmeric powder, instant food..."
                className="w-full pl-10 pr-24 py-2.5 rounded-xl border-2 border-heritage-gold/40 focus:border-heritage-maroon focus:outline-none bg-white text-stone-800 shadow-inner text-sm"
                autoFocus
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-heritage-maroon text-white text-xs font-bold rounded-lg hover:bg-heritage-richRed transition-colors"
              >
                Search
              </button>
            </form>
          </div>
        )}
      </header>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-stone-900/60 backdrop-blur-sm animate-fade-in">
          <div className="fixed inset-y-0 right-0 w-4/5 max-w-sm bg-[#FAF6EE] shadow-2xl p-6 flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-heritage-gold/20">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-heritage-maroon flex items-center justify-center text-heritage-gold font-serif font-bold text-sm">
                    AA
                  </div>
                  <span className="font-serif font-bold text-heritage-maroon text-base">
                    Annapurna Aahaar
                  </span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1 rounded-full text-stone-500 hover:text-stone-800"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Mobile Dedicated CALL TO ORDER Button */}
              <div className="my-4">
                <a
                  href="tel:9347036152"
                  className="w-full flex items-center justify-center gap-2.5 bg-gradient-to-r from-heritage-maroon to-heritage-richRed text-white py-3.5 px-4 rounded-xl font-bold shadow-md hover:opacity-90 transition-all text-sm"
                >
                  <Phone className="w-4 h-4 animate-pulse text-heritage-gold" />
                  <span>CALL TO ORDER: 9347036152</span>
                </a>
                <p className="text-center text-[10px] text-stone-600 mt-1 font-medium">
                  24/7 Voice IVR: English, मराठी, हिंदी, తెలుగు
                </p>
              </div>

              <div className="mt-4 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className="flex items-center justify-between px-4 py-3 rounded-xl font-semibold text-stone-700 hover:text-heritage-maroon hover:bg-cream-200/80 transition-colors"
                  >
                    <span>{link.name}</span>
                    <ChevronRight className="w-4 h-4 text-stone-400" />
                  </Link>
                ))}
                <Link
                  to="/track"
                  className="flex items-center justify-between px-4 py-3 rounded-xl font-semibold text-stone-700 hover:text-heritage-maroon hover:bg-cream-200/80 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-heritage-gold" />
                    <span>Track Order Status</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-stone-400" />
                </Link>
              </div>
            </div>

            <div className="pt-6 border-t border-heritage-gold/20 space-y-3">
              <div className="bg-heritage-gold/10 p-3 rounded-xl border border-heritage-gold/30 text-xs text-stone-700 space-y-1">
                <div className="flex items-center gap-1 font-bold text-heritage-maroon">
                  <ShieldCheck className="w-4 h-4 text-heritage-gold" />
                  <span>Authentic Heritage Kitchen</span>
                </div>
                <p className="text-stone-600 text-[11px]">
                  Bhainsa, Nirmal District, Telangana (504103)
                </p>
                <div className="text-[11px] text-stone-600 pt-1">
                  Owner: <strong>Bande Omkar</strong>
                </div>
                <div className="text-[11px] text-stone-600">
                  Helpline: <strong>6305970844 / 8688456925</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
