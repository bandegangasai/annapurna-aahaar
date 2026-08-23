import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ShoppingBag,
  Check,
  ShieldCheck,
  Truck,
  Sparkles,
  ArrowLeft,
  Heart,
  Share2,
} from 'lucide-react';
import { SEOHead } from '../components/common/SEOHead';
import { ProductCard3D } from '../components/product/ProductCard3D';
import { formatINR, getProductImageUrl } from '../utils/formatters';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';
import { Product, ProductVariant } from '../types';

export const ProductDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addItem, setIsCartOpen } = useCart();
  const { showToast } = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!slug) return;
      setIsLoading(true);
      try {
        const res = await api.getProductBySlug(slug);
        if (res.success && res.data) {
          setProduct(res.data);
          if (res.data.variants && res.data.variants.length > 0) {
            setSelectedVariant(res.data.variants[0]);
          }
        }
      } catch (err) {
        console.error('Error fetching product detail:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 border-4 border-heritage-gold border-t-heritage-maroon rounded-full animate-spin mx-auto mb-4" />
        <p className="font-serif text-lg text-stone-700">Loading authentic product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif font-bold text-2xl text-heritage-maroon">Product Not Found</h2>
        <p className="text-stone-600 text-sm">The product you are looking for does not exist or has been updated.</p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 bg-heritage-maroon text-cream-100 px-6 py-3 rounded-2xl font-bold text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Catalogue</span>
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!selectedVariant) return;
    addItem(product, selectedVariant, quantity);
    setIsAdded(true);
    showToast(`Added ${quantity}x ${product.name} (${selectedVariant.weight}) to cart!`, 'success');
    setTimeout(() => setIsAdded(false), 1500);
  };

  const handleBuyNow = () => {
    if (!selectedVariant) return;
    addItem(product, selectedVariant, quantity);
    navigate('/checkout');
  };

  return (
    <div className="bg-[#FAF6EE] min-h-screen py-10 lg:py-16">
      <SEOHead
        title={`${product.name} | Annapurna Aahaar — Bhainsa, Telangana`}
        description={product.description}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb & Back */}
        <div className="mb-6">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-xs font-bold text-stone-600 hover:text-heritage-maroon transition-colors bg-white px-4 py-2 rounded-full border border-heritage-gold/25 shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Products</span>
          </Link>
        </div>

        {/* Main Product Container */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-heritage-gold/30 shadow-md grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Product Photography Column */}
          <div className="lg:col-span-6 flex items-center justify-center">
            <div className="relative w-full aspect-square max-w-md bg-gradient-to-b from-[#FAF6EE] to-[#F3EBD9] rounded-3xl p-6 border-2 border-heritage-gold/30 shadow-inner flex items-center justify-center overflow-hidden">
              <img
                src={getProductImageUrl(product.imageUrl)}
                alt={product.name}
                className="w-full h-full object-contain hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-4 left-4 bg-heritage-maroon text-cream-100 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm border border-heritage-gold/30">
                {product.category}
              </span>
            </div>
          </div>

          {/* Product Info & Purchase Column */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <span className="text-xs font-bold text-heritage-antiqueGold uppercase tracking-widest block mb-1">
                Annapurna Aahaar — Bhainsa, Nirmal
              </span>
              <h1 className="font-serif font-black text-3xl sm:text-4xl text-heritage-maroon leading-tight">
                {product.name}
              </h1>
            </div>

            <p className="text-stone-700 text-sm sm:text-base leading-relaxed">
              {product.description}
            </p>

            {/* Variant / Weight Selector */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-stone-100">
                <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block">
                  Select Pack / Weight:
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setSelectedVariant(v)}
                      className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
                        selectedVariant?.id === v.id
                          ? 'bg-heritage-maroon text-cream-100 shadow-md border-2 border-heritage-gold'
                          : 'bg-[#FAF6EE] text-stone-800 hover:bg-cream-200 border border-heritage-gold/30'
                      }`}
                    >
                      <span>{v.weight}</span>
                      <span className="ml-2 opacity-80">({formatINR(v.price)})</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Price Display */}
            {selectedVariant && (
              <div className="bg-[#FAF6EE] p-4 rounded-2xl border border-heritage-gold/30 flex items-baseline justify-between">
                <div>
                  <span className="text-xs text-stone-500 uppercase font-bold block">Total Unit Price:</span>
                  <div className="flex items-baseline gap-2">
                    <span className="font-serif font-black text-3xl text-heritage-maroon">
                      {formatINR(selectedVariant.price)}
                    </span>
                    <span className="text-xs text-stone-600 font-medium">
                      per {selectedVariant.weight}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
                    Fresh Batch In Stock
                  </span>
                </div>
              </div>
            )}

            {/* Quantity Selector & Add Actions */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold text-stone-700 uppercase">Quantity:</span>
                <div className="flex items-center bg-[#FAF6EE] border border-heritage-gold/30 rounded-2xl overflow-hidden shadow-inner">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-4 py-2 font-bold text-stone-700 hover:bg-cream-200 transition-colors"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 font-bold text-sm text-stone-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="px-4 py-2 font-bold text-stone-700 hover:bg-cream-200 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  onClick={handleAddToCart}
                  className={`py-4 rounded-2xl font-bold text-sm transition-all shadow-lg flex items-center justify-center gap-2 ${
                    isAdded
                      ? 'bg-emerald-700 text-white'
                      : 'bg-heritage-maroon hover:bg-heritage-darkMaroon text-cream-100 border border-heritage-gold/30'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-5 h-5" />
                      <span>Added to Cart</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-5 h-5 text-heritage-gold" />
                      <span>Add to Cart</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleBuyNow}
                  className="py-4 rounded-2xl font-bold text-sm bg-heritage-gold hover:bg-heritage-antiqueGold text-heritage-darkMaroon transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  <span>Buy Now (Direct Checkout)</span>
                </button>
              </div>
            </div>

            {/* Assurance Badges */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-stone-100 text-xs text-stone-600">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-heritage-gold" />
                <span>100% Pure & Unadulterated</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-heritage-gold" />
                <span>Free Shipping Above ₹500</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {product.related && product.related.length > 0 && (
          <div className="mt-16">
            <h3 className="font-serif font-bold text-2xl text-heritage-maroon mb-6">
              You May Also Like
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
