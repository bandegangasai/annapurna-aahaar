import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, Sparkles, RefreshCw } from 'lucide-react';
import { ProductCard3D } from '../components/product/ProductCard3D';
import { SEOHead } from '../components/common/SEOHead';
import { api } from '../services/api';
import { Product } from '../types';

export const Products: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'name'>('featured');

  const selectedCategory = searchParams.get('category') || 'All';
  const searchQuery = searchParams.get('search') || '';

  const categories = [
    'All',
    'Papad',
    'Flours & Grains',
    'Spices',
    'Noodles & Instant Foods',
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

  const handleCategoryChange = (cat: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (cat === 'All') {
      newParams.delete('category');
    } else {
      newParams.set('category', cat);
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

  // Sorting
  const sortedProducts = [...products].sort((a, b) => {
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
    <div className="bg-[#FAF6EE] min-h-screen py-10 lg:py-16">
      <SEOHead
        title="Product Catalogue | Annapurna Aahaar — Bhainsa, Nirmal District"
        description="Browse authentic Indian food products from Annapurna Aahaar: Urad Dal Papad, Moong Dal Papad, Masala Papad, Rice Papad, Wheat Sevaya, Pure Turmeric Powder, and Noodles."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Title */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-heritage-antiqueGold uppercase tracking-widest block mb-1">
            Store Catalogue
          </span>
          <h1 className="font-serif font-black text-3xl sm:text-4xl text-heritage-maroon">
            Pure & Authentic Food Products
          </h1>
          <p className="text-stone-600 text-sm sm:text-base mt-2">
            Handcrafted with care in Bhainsa, Nirmal District, Telangana by Bande Omkar.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 bg-amber-500/15 border border-amber-500/40 px-4 py-1.5 rounded-full text-xs text-amber-900 font-medium">
            <span>Prefer to order by phone?</span>
            <a href="tel:9347036152" className="font-bold text-heritage-maroon hover:underline flex items-center gap-1">
              <span>Call 9347036152 (24/7 IVR)</span>
            </a>
          </div>
        </div>

        {/* Filters & Search Toolbar */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-heritage-gold/25 mb-10 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                placeholder="Search papad, turmeric, haldi, sevaya..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-2.5 bg-[#FAF6EE] border border-heritage-gold/30 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-heritage-gold text-stone-900 font-medium"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 w-full md:w-auto justify-end">
              <span className="text-xs font-bold text-stone-500 uppercase">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-[#FAF6EE] border border-heritage-gold/30 text-stone-800 text-sm font-semibold rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-heritage-gold"
              >
                <option value="featured">Featured First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name (A-Z)</option>
              </select>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none pt-2 border-t border-stone-100">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`whitespace-nowrap px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
                    isSelected
                      ? 'bg-heritage-maroon text-cream-100 shadow-md border border-heritage-gold'
                      : 'bg-cream-100 text-stone-700 hover:bg-cream-200 border border-heritage-gold/20'
                  }`}
                >
                  {cat}
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
          <div className="text-center py-16 bg-white rounded-3xl border border-heritage-gold/25 p-8 max-w-md mx-auto space-y-3">
            <RefreshCw className="w-10 h-10 text-stone-400 mx-auto animate-spin-slow" />
            <h3 className="font-serif font-bold text-xl text-stone-800">No Products Found</h3>
            <p className="text-xs text-stone-500">
              No matching products found for "{searchQuery}". Try searching for "papad", "sevaya", "turmeric", or "noodles".
            </p>
            <button
              onClick={() => {
                setSearchParams({});
              }}
              className="mt-2 bg-heritage-maroon text-cream-100 px-5 py-2 rounded-xl text-xs font-bold"
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
