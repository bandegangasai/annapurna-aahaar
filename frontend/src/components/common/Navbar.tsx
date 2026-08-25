import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ShoppingBag,
  Search,
  Menu,
  X,
  Phone,
  Clock,
  Globe,
  MapPin,
  Sparkles,
  Mic,
  MicOff,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useLanguage, LANGUAGES, LanguageCode } from '../../context/LanguageContext';
import { useToast } from '../../context/ToastContext';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isListening, setIsListening] = useState(false);

  const { totalItemsCount, setIsCartOpen } = useCart();
  const { language, setLanguage, t } = useLanguage();
  const { showToast } = useToast();
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

  const handleVoiceSearch = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      showToast('Voice search is not supported in this browser. Please type to search.', 'info');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-IN';
      recognition.interimResults = false;
      setIsListening(true);
      showToast('Listening... Speak product name now', 'info');

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setIsListening(false);
        setSearchQuery(transcript);
        navigate(`/products?search=${encodeURIComponent(transcript.trim())}`);
        setIsSearchOpen(false);
        showToast(`Voice Search: "${transcript}"`, 'success');
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const navLinks = [
    { name: t('nav_home'), path: '/' },
    { name: t('nav_products'), path: '/products' },
    { name: t('nav_about'), path: '/our-story' },
    { name: t('nav_why_us'), path: '/why-us' },
    { name: t('nav_track'), path: '/track' },
    { name: t('nav_contact'), path: '/contact' },
  ];

  return (
    <>
      {/* Top Authentic Heritage Bar with Multilingual Language Selector & 24/7 Phone Hotline */}
      <div className="bg-[#173F35] text-[#F8F3E7] text-xs py-2 px-3 sm:px-6 font-medium border-b border-[#C79A45]/30">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          {/* Location & Brand Motto */}
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-[#C79A45] shrink-0" />
            <span className="hidden sm:inline text-stone-200">
              Bhainsa, Nirmal District, Telangana (504103)
            </span>
            <span className="sm:hidden text-stone-200">Bhainsa, Telangana</span>
            <span className="text-[#C79A45]/40 hidden md:inline">•</span>
            <span className="hidden md:inline text-[#C79A45] font-semibold">
              Owner: Bande Omkar
            </span>
          </div>

          {/* Right Top Bar: Language Buttons & Call Hotline */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Top Language Switcher Bar */}
            <div className="flex items-center bg-[#0C241E] p-0.5 rounded-full border border-[#C79A45]/40 shadow-inner">
              <span className="px-2 text-[11px] text-[#C79A45] flex items-center gap-1 font-bold">
                <Globe className="w-3 h-3" />
                <span className="hidden xl:inline">Language:</span>
              </span>
              {LANGUAGES.map((lang) => {
                const isSelected = language === lang.code;
                return (
                  <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${
                      isSelected
                        ? 'bg-[#C79A45] text-[#173F35] shadow-xs'
                        : 'text-[#F8F3E7] hover:text-[#C79A45] hover:bg-[#173F35]/50'
                    }`}
                    title={`Switch language to ${lang.label}`}
                  >
                    {lang.nativeName}
                  </button>
                );
              })}
            </div>

            {/* Direct Phone Dial Link */}
            <a
              href="tel:9347036152"
              className="flex items-center gap-1.5 bg-[#C79A45]/20 hover:bg-[#C79A45]/30 text-[#C79A45] border border-[#C79A45]/50 px-3 py-1 rounded-full font-bold transition-all text-xs"
              title="Call our 24/7 Telephone IVR: 9347036152"
            >
              <Phone className="w-3 h-3 animate-pulse text-[#C79A45]" />
              <span className="hidden sm:inline">{t('nav_call_to_order')}:</span>
              <strong className="text-white">9347036152</strong>
            </a>
          </div>
        </div>
      </div>

      {/* Main Sticky Navbar Header */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#F8F3E7]/95 backdrop-blur-md shadow-md py-3 border-b border-[#C79A45]/20'
            : 'bg-[#F8F3E7] py-4 border-b border-[#C79A45]/15'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#C79A45] to-[#173F35] p-0.5 shadow-md group-hover:scale-105 transition-transform shrink-0">
              <div className="w-full h-full rounded-[14px] bg-[#173F35] flex items-center justify-center border border-[#C79A45]/40">
                <span className="font-serif font-black text-lg text-[#C79A45] tracking-wider">AA</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-black text-xl sm:text-2xl text-[#173F35] tracking-tight group-hover:text-[#0C241E] transition-colors">
                ANNAPURNA AAHAAR
              </span>
              <span className="text-[10px] sm:text-[11px] font-bold text-[#C79A45] tracking-widest uppercase">
                {t('tagline')}
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
                      ? 'text-[#173F35] bg-[#C79A45]/15 shadow-2xs border border-[#C79A45]/30'
                      : 'text-stone-700 hover:text-[#173F35] hover:bg-[#F1E9D5]'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Action Buttons: Call to Order CTA, Search, Cart & Mobile Menu */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Desktop "CALL TO ORDER" Primary Action */}
            <a
              href="tel:9347036152"
              className="hidden lg:flex items-center gap-2 bg-[#173F35] hover:bg-[#0C241E] text-[#F8F3E7] text-xs font-bold px-4 py-2.5 rounded-xl border border-[#C79A45] shadow-xs transition-all hover:scale-105"
              title="24/7 Telephone Voice Hotline: 9347036152"
            >
              <Phone className="w-3.5 h-3.5 text-[#C79A45] animate-pulse" />
              <span>{t('nav_call_to_order')}: <strong>9347036152</strong></span>
            </a>

            {/* Search Trigger Button */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 rounded-xl text-stone-700 hover:text-[#173F35] hover:bg-[#F1E9D5] transition-colors"
              aria-label="Search Products"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 rounded-xl text-stone-700 hover:text-[#173F35] hover:bg-[#F1E9D5] transition-colors"
              aria-label="View Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#173F35] text-[#C79A45] border border-[#C79A45] text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-pulse">
                  {totalItemsCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-stone-700 hover:text-[#173F35] hover:bg-[#F1E9D5]"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Collapsible Search Input */}
        {isSearchOpen && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 pb-2 transition-all">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search papad, whole wheat sevaya, turmeric powder, instant noodles..."
                className="w-full pl-10 pr-32 py-2.5 rounded-xl border-2 border-[#C79A45]/40 focus:border-[#173F35] focus:outline-none bg-white text-[#252525] shadow-inner text-sm font-medium"
                autoFocus
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5" />
              <button
                type="button"
                onClick={handleVoiceSearch}
                className={`absolute right-20 p-1.5 rounded-lg transition-all ${
                  isListening
                    ? 'bg-red-500 text-white animate-pulse'
                    : 'text-stone-400 hover:text-[#173F35] hover:bg-[#F1E9D5]'
                }`}
                title="Voice Search"
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-[#173F35] text-[#F8F3E7] text-xs font-bold rounded-lg hover:bg-[#0C241E] transition-colors"
              >
                Search
              </button>
            </form>
          </div>
        )}

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-[#F8F3E7] border-b border-[#C79A45]/30 px-4 pt-3 pb-6 space-y-4 animate-fadeIn">
            {/* Mobile Language Selector */}
            <div className="bg-[#173F35] p-3 rounded-2xl border border-[#C79A45]/30 space-y-2 text-center">
              <span className="text-xs text-[#C79A45] font-bold block">
                🌐 Choose Language / भाषा निवडा / भाषा चुनें / భాషను ఎంచుకోండి:
              </span>
              <div className="grid grid-cols-2 gap-2">
                {LANGUAGES.map((lang) => {
                  const isSelected = language === lang.code;
                  return (
                    <button
                      key={lang.code}
                      onClick={() => setLanguage(lang.code)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                        isSelected
                          ? 'bg-[#C79A45] text-[#173F35] shadow-sm'
                          : 'bg-[#0C241E] text-[#F8F3E7] hover:bg-[#C79A45]/20'
                      }`}
                    >
                      {lang.nativeName} ({lang.label})
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Mobile Nav Links */}
            <nav className="flex flex-col space-y-1">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`px-4 py-3 rounded-xl text-sm font-bold flex items-center justify-between ${
                      isActive
                        ? 'text-[#173F35] bg-[#C79A45]/20 border border-[#C79A45]/40'
                        : 'text-stone-700 hover:bg-[#F1E9D5]'
                    }`}
                  >
                    <span>{link.name}</span>
                    <Sparkles className="w-3.5 h-3.5 text-[#C79A45]" />
                  </Link>
                );
              })}
            </nav>

            {/* Mobile Direct Dial Call Button */}
            <a
              href="tel:9347036152"
              className="flex items-center justify-center gap-2 w-full py-3.5 bg-[#173F35] text-[#F8F3E7] font-bold rounded-2xl shadow-md border border-[#C79A45] text-xs"
            >
              <Phone className="w-4 h-4 text-[#C79A45] animate-bounce" />
              <span>{t('nav_call_to_order')}: <strong>9347036152</strong></span>
            </a>
          </div>
        )}
      </header>
    </>
  );
};

export default Navbar;
