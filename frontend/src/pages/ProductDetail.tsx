import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Star,
  ShieldCheck,
  Truck,
  Sparkles,
  ArrowLeft,
  Check,
  Plus,
  Minus,
  Heart,
  Share2,
  Package,
} from 'lucide-react';
import { ProductCard3D } from '../components/product/ProductCard3D';
import { SEOHead } from '../components/common/SEOHead';
import { api } from '../services/api';
import { Product, ProductVariant } from '../types';
import { formatINR } from '../utils/formatters';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

export const ProductDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { showToast } = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      if (!slug) return;
      setIsLoading(true);
      try {
        const res = await api.getProductBySlug(slug);
        if (res.success && res.data) {
          setProduct(res.data);
          if (res.data.variants && res.data.variants.length > 0) {
            setSelectedVariant(res.data.variants[0]);
          }
          setQuantity(1);
        }
      } catch (err) {
        console.error('Error loading product detail:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
    window.scrollTo(0, 0);
  }, [slug]);

  const handleAddToCart = () => {
    if (!product || !selectedVariant) return;

    addItem(product, selectedVariant, quantity);
    setIsAdded(true);
    showToast(`Added ${quantity}x ${product.name} (${selectedVariant.weight}) to cart!`, 'success');

    setTimeout(() => setIsAdded(false), 1500);
  };

  const handleBuyNow = () => {
    if (!product || !selectedVariant) return;

    addItem(product, selectedVariant, quantity);
    navigate('/checkout');
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="animate-pulse space-y-6 max-w-4xl mx-auto">
          <div className="h-6 bg-stone-200 rounded w-1/4" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="h-96 bg-stone-200 rounded-3xl" />
            <div className="space-y-4">
              <div className="h-10 bg-stone-200 rounded w-3/4" />
              <div className="h-6 bg-stone-200 rounded w-1/2" />
              <div className="h-24 bg-stone-200 rounded" />
              <div className="h-12 bg-stone-200 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product || !selectedVariant) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif font-bold text-2xl text-stone-900">Product Not Found</h2>
        <p className="text-stone-600">The product you are looking for does not exist or has been removed.</p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 bg-heritage-maroon text-cream-100 px-6 py-2.5 rounded-xl font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Catalogue</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#FCF9F2] min-h-screen py-10 lg:py-14">
      <SEOHead
        title={`${product.name} | Annapurna Aahaar`}
        description={product.description}
        image={product.imageUrl}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-stone-500 mb-8">
          <Link to="/" className="hover:text-heritage-maroon transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link to="/products" className="hover:text-heritage-maroon transition-colors">
            Products
          </Link>
          <span>/</span>
          <Link
            to={`/products?category=${encodeURIComponent(product.category)}`}
            className="hover:text-heritage-maroon transition-colors"
          >
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-stone-800 font-semibold truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Main Product Details Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-amber-900/10 shadow-lg grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 mb-16">
          {/* Left: Product Image Showcase */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative rounded-2xl overflow-hidden bg-cream-100 aspect-square border border-amber-900/10 shadow-inner">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute top-4 left-4 bg-heritage-maroon/90 backdrop-blur-sm text-cream-100 text-xs font-semibold px-3 py-1.5 rounded-full uppercase tracking-wider">
                {product.category}
              </div>
              {product.isFeatured && (
                <div className="absolute top-4 right-4 bg-turmeric-500 text-stone-950 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  Featured Authentic
                </div>
              )}
            </div>

            {/* Quality badges underneath image */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-[#FAF5EC] p-3 rounded-xl border border-amber-900/10">
                <ShieldCheck className="w-5 h-5 text-turmeric-700 mx-auto mb-1" />
                <span className="text-[11px] font-semibold text-stone-800 block">100% Purity</span>
                <span className="text-[9px] text-stone-500">Zero Adulteration</span>
              </div>
              <div className="bg-[#FAF5EC] p-3 rounded-xl border border-amber-900/10">
                <Truck className="w-5 h-5 text-turmeric-700 mx-auto mb-1" />
                <span className="text-[11px] font-semibold text-stone-800 block">Fresh Milling</span>
                <span className="text-[9px] text-stone-500">Quick Dispatch</span>
              </div>
              <div className="bg-[#FAF5EC] p-3 rounded-xl border border-amber-900/10">
                <Package className="w-5 h-5 text-turmeric-700 mx-auto mb-1" />
                <span className="text-[11px] font-semibold text-stone-800 block">Aroma Sealed</span>
                <span className="text-[9px] text-stone-500">Moisture-Proof</span>
              </div>
            </div>
          </div>

          {/* Right: Product Purchase Info */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              {/* Title & Rating */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex text-turmeric-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-stone-700">
                    {product.rating.toFixed(1)} (Based on verified customer batches)
                  </span>
                </div>
                <h1 className="font-serif font-black text-2xl sm:text-3xl lg:text-4xl text-stone-900 leading-tight">
                  {product.name}
                </h1>
              </div>

              {/* Price Banner */}
              <div className="bg-cream-100/80 p-4 rounded-2xl border border-amber-900/10 flex items-baseline justify-between">
                <div>
                  <span className="text-xs text-stone-500 block uppercase font-medium">
                    Selling Price (Inc. all taxes)
                  </span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="font-serif font-black text-3xl text-heritage-maroon">
                      {formatINR(selectedVariant.price)}
                    </span>
                    <span className="text-sm text-stone-600 font-medium">
                      per {selectedVariant.weight}
                    </span>
                  </div>
                </div>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
                  In Stock & Ready
                </span>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-1.5">
                  About This Product
                </h3>
                <p className="text-sm sm:text-base text-stone-700 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Variant Selector */}
              {product.variants && product.variants.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-stone-700 uppercase tracking-wider block">
                    Choose Pack Size / Weight:
                  </span>
                  <div className="flex flex-wrap gap-2.5">
                    {product.variants.map((v) => (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setSelectedVariant(v)}
                        className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all border ${
                          selectedVariant.id === v.id
                            ? 'bg-heritage-maroon text-cream-100 border-heritage-maroon shadow-md scale-105'
                            : 'bg-white text-stone-800 hover:bg-cream-100 border-amber-900/20'
                        }`}
                      >
                        {v.weight} — {formatINR(v.price)}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold text-stone-700 uppercase tracking-wider block">
                  Quantity:
                </span>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-amber-900/20 rounded-xl overflow-hidden bg-cream-50">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="p-3 text-stone-700 hover:bg-cream-200 transition-colors"
                      disabled={quantity <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-5 font-bold text-stone-900 text-sm">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      className="p-3 text-stone-700 hover:bg-cream-200 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="text-sm font-medium text-stone-600">
                    Total: <strong className="text-heritage-maroon font-bold">{formatINR(selectedVariant.price * quantity)}</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Action CTAs */}
            <div className="space-y-3 pt-4 border-t border-stone-100">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={handleAddToCart}
                  className={`w-full py-3.5 rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-md transition-all transform active:scale-95 ${
                    isAdded
                      ? 'bg-emerald-600 text-white'
                      : 'bg-heritage-maroon hover:bg-turmeric-900 text-cream-100'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-5 h-5" />
                      <span>Added to Cart</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-5 h-5 text-turmeric-300" />
                      <span>Add to Cart</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleBuyNow}
                  className="w-full bg-gradient-to-r from-turmeric-600 to-amber-700 hover:from-turmeric-700 hover:to-amber-800 text-white py-3.5 rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-turmeric-600/20 transition-all transform active:scale-95"
                >
                  <span>Buy Now (Cash on Delivery)</span>
                </button>
              </div>

              <p className="text-[11px] text-center text-stone-500">
                🔒 Safe Indian packaging. No prepayment required — pay upon delivery.
              </p>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        {product.related && product.related.length > 0 && (
          <div className="space-y-6">
            <h2 className="font-serif font-bold text-2xl text-stone-900">
              Related Indian Food Essentials
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {product.related.map((rel) => (
                <ProductCard3D key={rel.id} product={rel} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
