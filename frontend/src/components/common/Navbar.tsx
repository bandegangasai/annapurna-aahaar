import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ShoppingBag,
  Search,
  Menu,
  X,
  Sparkles,
  Phone,
  Clock,
  ChevronRight,
  ShieldCheck,
  MapPin,
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
      {/* Top Authentic Heritage Notice Bar with Real Business Details */}
      <div className="bg-heritage-darkMaroon text-cream-100 text-xs py-2 px-4 font-medium border-b border-heritage-gold/30">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-heritage-gold animate-pulse" />
            <span className="hidden sm:inline">Bhainsa, Nirmal District, Telangana (504103)</span>
            <span className="sm:hidden">Bhainsa, Telangana</span>
            <span className="text-heritage-gold/50 hidden md:inline">|</span>
            <span className="hidden md:inline text-cream-200">Owner: Bande Omkar</span>
          </div>

          <div className="flex items-center gap-4 sm:gap-6 text-xs">
            <a
              href="tel:6305970844"
              className="flex items-center gap-1 text-heritage-gold hover:text-white transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>6305970844 / 8688456925</span>
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
            {/* Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 rounded-full text-stone-700 hover:text-heritage-maroon hover:bg-heritage-gold/10 transition-colors"
              title="Search Products"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 bg-heritage-maroon hover:bg-heritage-darkMaroon text-cream-100 px-4 py-2 rounded-full font-bold text-sm shadow-md hover:shadow-lg transition-all border border-heritage-gold/30 transform active:scale-95"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4 text-heritage-gold" />
              <span className="hidden sm:inline">Cart</span>
              {totalItemsCount > 0 && (
                <span className="bg-heritage-gold text-heritage-darkMaroon text-xs font-black w-5 h-5 rounded-full flex items-center justify-center animate-bounce">
                  {totalItemsCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-stone-700 hover:text-heritage-maroon hover:bg-cream-200 transition-colors"
              aria-label="Open Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Expandable Search Bar */}
        {isSearchOpen && (
          <div className="border-t border-heritage-gold/20 bg-[#FAF6EE] px-4 py-3 shadow-inner">
            <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 transform -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  placeholder="Search papad, turmeric, haldi, sevaya, noodles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-heritage-gold/30 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-heritage-gold focus:border-transparent text-stone-900 placeholder-stone-400 font-medium"
                />
              </div>
              <button
                type="submit"
                className="bg-heritage-maroon hover:bg-heritage-darkMaroon text-cream-100 px-6 py-2.5 rounded-full text-sm font-bold transition-colors"
              >
                Search
              </button>
            </form>
          </div>
        )}

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-heritage-gold/20 bg-[#FAF6EE] px-4 pt-3 pb-6 space-y-2 shadow-2xl animate-fadeIn">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`block px-4 py-2.5 rounded-xl text-base font-bold transition-colors ${
                  location.pathname === link.path
                    ? 'text-heritage-maroon bg-heritage-gold/20 font-black'
                    : 'text-stone-700 hover:bg-cream-200'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-3 border-t border-heritage-gold/20 space-y-2">
              <Link
                to="/track"
                className="flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-bold text-stone-800 bg-cream-200/70"
              >
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-heritage-maroon" />
                  Track Your Order
                </span>
                <ChevronRight className="w-4 h-4 text-stone-400" />
              </Link>
              <div className="px-4 py-2 text-xs text-stone-600 space-y-1 bg-white rounded-xl border border-heritage-gold/20">
                <div className="font-bold text-heritage-maroon">Annapurna Aahaar — Bhainsa</div>
                <div>Owner: Bande Omkar</div>
                <div>Helpline: 6305970844 / 8688456925</div>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
