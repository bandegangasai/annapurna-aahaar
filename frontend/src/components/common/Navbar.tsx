import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ShoppingBag,
  Search,
  Menu,
  X,
  Sparkles,
  MapPin,
  Clock,
  ChevronRight,
  ShieldCheck,
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

  // Close mobile menu on route change
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
      {/* Top Heritage Notice Bar */}
      <div className="bg-heritage-maroon text-cream-100 text-xs py-1.5 px-4 font-medium border-b border-amber-900/40">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-turmeric-400 animate-pulse" />
            <span>Pure Ingredients. Traditional Milling. 100% Authentic Indian Taste.</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-cream-200/90 text-xs">
            <Link to="/track" className="hover:text-turmeric-300 transition-colors flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>Track Order</span>
            </Link>
            <div className="flex items-center gap-1 text-cream-300">
              <ShieldCheck className="w-3.5 h-3.5 text-turmeric-400" />
              <span>Free Delivery Above ₹500</span>
            </div>
            <Link to="/admin/dashboard" className="text-amber-300/80 hover:text-amber-200 transition-colors text-[11px] underline">
              Admin Portal
            </Link>
          </div>
        </div>
      </div>

      {/* Main Sticky Navbar */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#FCF9F2]/95 backdrop-blur-md shadow-md py-3 border-b border-amber-900/10'
            : 'bg-[#FCF9F2] py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-br from-turmeric-700 via-heritage-maroon to-turmeric-900 p-0.5 shadow-md group-hover:scale-105 transition-transform">
              <div className="w-full h-full rounded-full bg-heritage-maroon flex items-center justify-center border border-turmeric-400/40">
                <span className="font-serif font-black text-lg text-turmeric-300 tracking-wider">AA</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-extrabold text-xl sm:text-2xl text-heritage-maroon tracking-wide group-hover:text-turmeric-800 transition-colors">
                ANNAPURNA AHAAR
              </span>
              <span className="text-[10px] sm:text-xs font-semibold text-turmeric-700 tracking-widest uppercase">
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
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'text-heritage-maroon bg-turmeric-100/70 font-semibold shadow-sm'
                      : 'text-stone-700 hover:text-heritage-maroon hover:bg-cream-200/50'
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
              className="p-2 rounded-full text-stone-700 hover:text-heritage-maroon hover:bg-turmeric-100/50 transition-colors"
              title="Search Products"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 bg-heritage-maroon hover:bg-turmeric-900 text-cream-100 px-3.5 py-2 rounded-full font-medium text-sm shadow-md hover:shadow-lg transition-all transform active:scale-95"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4 text-turmeric-300" />
              <span className="hidden sm:inline">Cart</span>
              {totalItemsCount > 0 && (
                <span className="bg-turmeric-500 text-stone-900 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center animate-bounce">
                  {totalItemsCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-stone-700 hover:text-heritage-maroon hover:bg-turmeric-100/50 transition-colors"
              aria-label="Open Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Expandable Search Bar */}
        {isSearchOpen && (
          <div className="border-t border-amber-900/10 bg-[#FCF9F2] px-4 py-3 shadow-inner">
            <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  placeholder="Search papad, sevaya, turmeric, noodles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full pl-9 pr-4 py-2 bg-white border border-amber-900/20 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-turmeric-500 focus:border-transparent text-stone-800 placeholder-stone-400"
                />
              </div>
              <button
                type="submit"
                className="bg-turmeric-600 hover:bg-turmeric-700 text-white px-5 py-2 rounded-full text-sm font-medium transition-colors"
              >
                Search
              </button>
            </form>
          </div>
        )}

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-amber-900/10 bg-[#FCF9F2] px-4 pt-3 pb-6 space-y-2 shadow-xl animate-fadeIn">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`block px-4 py-2.5 rounded-lg text-base font-medium transition-colors ${
                  location.pathname === link.path
                    ? 'text-heritage-maroon bg-turmeric-100 font-semibold'
                    : 'text-stone-700 hover:bg-cream-200'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-3 border-t border-amber-900/10 space-y-2">
              <Link
                to="/track"
                className="flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium text-stone-800 bg-cream-200/60"
              >
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-turmeric-700" />
                  Track Your Order
                </span>
                <ChevronRight className="w-4 h-4 text-stone-400" />
              </Link>
              <Link
                to="/admin/login"
                className="block px-4 py-2 rounded-lg text-xs font-semibold text-turmeric-800"
              >
                Admin Login →
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
