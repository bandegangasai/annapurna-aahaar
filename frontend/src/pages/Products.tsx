import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Sparkles, RefreshCw, Phone, Mic, MicOff, CheckCircle } from 'lucide-react';
import { ProductCard3D } from '../components/product/ProductCard3D';
import { SEOHead } from '../components/common/SEOHead';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';
import { Product } from '../types';

export const Products: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'name'>('featured');
  const [isListening, setIsListening] = useState(false);
  const [inStockOnly, setInStockOnly] = useState(false);
  const { t } = useLanguage();
  const { showToast } = useToast();

  const selectedCategory = searchParams.get('category') || 'All';
  const searchQuery = searchParams.get('search') || '';

  const categories = [
    { id: 'All', label: t('cat_all') },
    { id: 'Papad', label: t('cat_papad') },
    { id: 'Flours & Grains', label: t('cat_sevaya') },
    { id: 'Spices', label: t('cat_spices') },
    { id: 'Noodles & Instant Foods', label: t('cat_noodles') },
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const res = await api.getProducts({
          category: selectedCategory !== 'All' ? selectedCategory : undefined,
          search: searchQuery || undefined,
        });

        if (res.success) {
          setProducts(res.data);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, searchQuery]);

  const handleCategoryChange = (catId: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (catId === 'All') {
      newParams.delete('category');
    } else {
      newParams.set('category', catId);
    }
    setSearchParams(newParams);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const newParams = new URLSearchParams(searchParams);
    if (val) {
      newParams.set('search', val);
    } else {
      newParams.delete('search');
    }
    setSearchParams(newParams);
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
      showToast('Listening... Speak product name now (e.g. Papad, Sevaya, Turmeric)', 'info');

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setIsListening(false);
        const newParams = new URLSearchParams(searchParams);
        newParams.set('search', transcript);
        setSearchParams(newParams);
        showToast(`Voice Search: "${transcript}"`, 'success');
      };

      recognition.onerror = () => {
        setIsListening(false);
        showToast('Could not recognize voice. Please try typing.', 'error');
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  // Filter in-stock and sort
  const filteredProducts = products.filter((p) => {
    if (!inStockOnly) return true;
    return p.variants?.some((v) => v.stock > 0);
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') {
      const priceA = a.variants?.[0]?.price || 0;
      const priceB = b.variants?.[0]?.price || 0;
      return priceA - priceB;
    }
    if (sortBy === 'price-high') {
      const priceA = a.variants?.[0]?.price || 0;
      const priceB = b.variants?.[0]?.price || 0;
      return priceB - priceA;
    }
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    }
    return 0;
  });

  return (
    <div className="bg-[#F8F3E7] min-h-screen py-10 lg:py-16 text-[#252525]">
      <SEOHead
        title="Products Catalogue | Annapurna Aahaar"
        description="Explore handcrafted Indian food products from Annapurna Aahaar: Urad Dal Papad, Moong Dal Papad, Masala Papad, Rice Papad, Whole Wheat Sevaya, Pure Turmeric Powder, and Noodles. Order online or call 9347036152."
        url="https://bandegangasai.github.io/annapurna-aahaar/#/products"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Title */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-[#C79A45] uppercase tracking-widest block mb-1">
            {t('prod_section_tag')}
          </span>
          <h1 className="font-serif font-black text-3xl sm:text-4xl text-[#173F35]">
            {t('prod_section_title')}
          </h1>
          <p className="text-stone-muted text-sm sm:text-base mt-2">
            {t('prod_section_desc')}
          </p>
          <div className="mt-4 inline-flex items-center gap-2 bg-[#173F35]/10 border border-[#C79A45]/40 px-4 py-1.5 rounded-full text-xs text-[#173F35] font-medium">
            <span>{t('acc_banner_title')}</span>
            <a href="tel:9347036152" className="font-bold text-[#A65332] hover:underline flex items-center gap-1">
              <Phone className="w-3.5 h-3.5" />
              <span>Call 9347036152 (24/7 Hotline)</span>
            </a>
          </div>
        </div>

        {/* Filters & Search Toolbar */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-subtle border border-[#C79A45]/30 mb-10 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            {/* Search Input with Voice Search */}
            <div className="relative w-full md:w-96 flex items-center">
              <Search className="w-4 h-4 absolute left-3.5 text-stone-400" />
              <input
                type="text"
                placeholder="Search papad, turmeric, haldi, sevaya..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-12 py-2.5 bg-[#FAF6EE] border border-[#C79A45]/30 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C79A45] text-stone-primary font-medium"
              />
              <button
                type="button"
                onClick={handleVoiceSearch}
                className={`absolute right-2.5 p-1.5 rounded-xl transition-all ${
                  isListening
                    ? 'bg-red-500 text-white animate-pulse'
                    : 'text-stone-500 hover:text-[#173F35] hover:bg-[#F1E9D5]'
                }`}
                title="Voice Search"
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
            </div>

            {/* Sort & In-Stock Toggle */}
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
              <label className="flex items-center gap-2 cursor-pointer bg-[#FAF6EE] border border-[#C79A45]/30 px-3 py-2 rounded-xl text-xs font-bold text-stone-700">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="accent-[#173F35] w-3.5 h-3.5 rounded"
                />
                <span>In Stock Only</span>
              </label>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-stone-muted uppercase">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-[#FAF6EE] border border-[#C79A45]/30 text-stone-primary text-sm font-semibold rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#C79A45]"
                >
                  <option value="featured">Featured First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name (A-Z)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none pt-2 border-t border-stone-100">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`whitespace-nowrap px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
                    isSelected
                      ? 'bg-[#173F35] text-[#F8F3E7] shadow-sm border border-[#C79A45]'
                      : 'bg-[#F8F3E7] text-stone-primary hover:bg-[#F1E9D5] border border-[#C79A45]/25'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Product Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div key={n} className="bg-white rounded-3xl h-96 animate-pulse border border-stone-200" />
            ))}
          </div>
        ) : sortedProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-[#C79A45]/25 p-8 max-w-md mx-auto space-y-3">
            <RefreshCw className="w-10 h-10 text-stone-400 mx-auto animate-spin-slow" />
            <h3 className="font-serif font-bold text-xl text-stone-primary">No Products Found</h3>
            <p className="text-xs text-stone-muted">
              No matching products found for "{searchQuery}". Try searching for "papad", "sevaya", "turmeric", or "noodles".
            </p>
            <button
              onClick={() => {
                setSearchParams({});
                setInStockOnly(false);
              }}
              className="mt-2 bg-[#173F35] text-[#F8F3E7] px-5 py-2 rounded-xl text-xs font-bold"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {sortedProducts.map((product) => (
              <ProductCard3D key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
