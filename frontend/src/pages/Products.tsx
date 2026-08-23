import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, Sparkles, RefreshCw, X } from 'lucide-react';
import { ProductCard3D } from '../components/product/ProductCard3D';
import { SEOHead } from '../components/common/SEOHead';
import { api } from '../services/api';
import { Product } from '../types';

export const Products: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';
  const initialSearch = searchParams.get('search') || '';

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchTerm, setSearchTerm] = useState<string>(initialSearch);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [isLoading, setIsLoading] = useState(true);

  // Sync URL search params
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setSelectedCategory(cat);
    const q = searchParams.get('search');
    if (q !== null) setSearchTerm(q);
  }, [searchParams]);

  // Fetch products and categories from backend API
  useEffect(() => {
    const loadCatalog = async () => {
      setIsLoading(true);
      try {
        const [prodRes, catRes] = await Promise.all([
          api.getProducts({}),
          api.getCategories(),
        ]);

        if (prodRes.success) {
          setProducts(prodRes.data);
        }

        if (catRes.success && catRes.data) {
          setCategories(['All', ...catRes.data.map((c) => c.name)]);
        }
      } catch (err) {
        console.error('Failed to load products:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadCatalog();
  }, []);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    if (category === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', category);
    }
    setSearchParams(searchParams);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    if (value.trim()) {
      searchParams.set('search', value.trim());
    } else {
      searchParams.delete('search');
    }
    setSearchParams(searchParams);
  };

  const clearFilters = () => {
    setSelectedCategory('All');
    setSearchTerm('');
    setSearchParams({});
  };

  // Filter and sort products in-memory for instant responsive UI
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        const matchesCategory =
          selectedCategory === 'All' || product.category === selectedCategory;

        const term = searchTerm.toLowerCase().trim();
        const matchesSearch =
          !term ||
          product.name.toLowerCase().includes(term) ||
          product.description.toLowerCase().includes(term) ||
          product.category.toLowerCase().includes(term) ||
          (product.slug && product.slug.toLowerCase().includes(term));

        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        const aMinPrice = Math.min(...(a.variants?.map((v) => v.price) || [0]));
        const bMinPrice = Math.min(...(b.variants?.map((v) => v.price) || [0]));

        if (sortBy === 'price-low') return aMinPrice - bMinPrice;
        if (sortBy === 'price-high') return bMinPrice - aMinPrice;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      });
  }, [products, selectedCategory, searchTerm, sortBy]);

  return (
    <div className="bg-[#FCF9F2] min-h-screen py-10 lg:py-14">
      <SEOHead
        title="Product Catalogue | Annapurna Aahaar | Pure Papads, Sevaya & Turmeric"
        description="Shop authentic Indian food products from Annapurna Aahaar. Handcrafted Urad, Moong, Masala, and Rice Papads, traditional whole-wheat Sevaya, pure farm Turmeric, and quick noodles."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header Banner */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-turmeric-700 bg-turmeric-100/70 border border-turmeric-300/40 px-3 py-1 rounded-full uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            100% Traditional Recipe & Milling
          </span>
          <h1 className="font-serif font-black text-3xl sm:text-4xl lg:text-5xl text-heritage-maroon">
            Our Product Catalogue
          </h1>
          <p className="text-stone-600 text-sm sm:text-base">
            Crafted with passion, purity, and heritage. Select your desired pack size and order directly with Cash on Delivery.
          </p>
        </div>

        {/* Filter, Search & Sort Control Bar */}
        <div className="bg-white p-5 rounded-2xl border border-amber-900/10 shadow-sm mb-8 space-y-4">
          {/* Top Row: Search Input + Sort Dropdown */}
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 transform -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                placeholder="Search papad, turmeric, sevaya, noodles..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-10 pr-9 py-2.5 bg-cream-50 border border-amber-900/15 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-turmeric-500 focus:border-transparent text-stone-800 placeholder-stone-400"
              />
              {searchTerm && (
                <button
                  onClick={() => handleSearchChange('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Sort & Stats */}
            <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
              <span className="text-xs text-stone-500 hidden sm:inline">
                Showing <strong>{filteredProducts.length}</strong> products
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-stone-600">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="text-xs sm:text-sm bg-cream-50 border border-amber-900/15 rounded-xl px-3 py-2 text-stone-800 font-medium focus:outline-none focus:ring-2 focus:ring-turmeric-500"
                >
                  <option value="featured">Featured First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="name">Product Name (A-Z)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Bottom Row: Category Pill Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" />
              Category:
            </span>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`text-xs px-4 py-2 rounded-xl font-medium transition-all shrink-0 ${
                  selectedCategory === category
                    ? 'bg-heritage-maroon text-cream-100 shadow-md font-semibold'
                    : 'bg-cream-100 text-stone-700 hover:bg-cream-200 border border-amber-900/10'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div
                key={n}
                className="bg-white rounded-2xl h-96 animate-pulse border border-amber-900/10"
              />
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard3D key={product.id} product={product} />
            ))}
          </div>
        ) : (
          /* Empty Search State */
          <div className="bg-white rounded-2xl p-12 text-center border border-amber-900/10 max-w-lg mx-auto space-y-4">
            <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto text-turmeric-700">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="font-serif font-bold text-stone-900 text-xl">No Products Found</h3>
            <p className="text-sm text-stone-500">
              We couldn't find any products matching your search criteria. Try checking for typos or clear your filters.
            </p>
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-2 bg-heritage-maroon text-cream-100 px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-turmeric-900 transition-colors shadow-md"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reset All Filters</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
