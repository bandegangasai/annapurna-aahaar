import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ShoppingBag,
  Check,
  ShieldCheck,
  Truck,
  ArrowLeft,
  Phone,
} from 'lucide-react';
import { SEOHead } from '../components/common/SEOHead';
import { ProductCard3D } from '../components/product/ProductCard3D';
import { formatINR, getProductImageUrl } from '../utils/formatters';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';
import { Product, ProductVariant } from '../types';

export const ProductDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { showToast } = useToast();
  const { t, getLocalizedProduct } = useLanguage();

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
        <div className="w-14 h-14 border-4 border-[#C79A45] border-t-[#173F35] rounded-full animate-spin mx-auto mb-4" />
        <p className="font-serif text-lg text-stone-muted">Loading authentic product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif font-bold text-2xl text-[#173F35]">Product Not Found</h2>
        <p className="text-stone-muted text-sm">The product you are looking for does not exist or has been updated.</p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 bg-[#173F35] text-[#F8F3E7] px-6 py-3 rounded-2xl font-bold text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Catalogue</span>
        </Link>
      </div>
    );
  }

  const localized = getLocalizedProduct(product.slug || product.id, product.name, product.description);

  const handleAddToCart = () => {
    if (!selectedVariant) return;
    addItem(product, selectedVariant, quantity);
    setIsAdded(true);
    showToast(`Added ${quantity}x ${localized.name} (${selectedVariant.weight}) to cart!`, 'success');
    setTimeout(() => setIsAdded(false), 1600);
  };

  const handleBuyNow = () => {
    if (!selectedVariant) return;
    addItem(product, selectedVariant, quantity);
    navigate('/checkout');
  };

  const productJsonLd = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: `${localized.name} | Annapurna Aahaar`,
    image: `https://bandegangasai.github.io/annapurna-aahaar${getProductImageUrl(product.imageUrl)}`,
    description: `${localized.name} from Annapurna Aahaar, Bhainsa, Nirmal District, Telangana.`,
    brand: {
      '@type': 'Brand',
      name: 'Annapurna Aahaar',
    },
    offers: {
      '@type': 'Offer',
      url: `https://bandegangasai.github.io/annapurna-aahaar/#/products/${product.slug}`,
      priceCurrency: 'INR',
      price: selectedVariant ? selectedVariant.price.toFixed(2) : (product.variants[0]?.price.toFixed(2) || '100.00'),
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'Annapurna Aahaar',
      },
    },
  };

  return (
    <div className="bg-[#F8F3E7] min-h-screen py-10 lg:py-16 text-[#252525]">
      <SEOHead
        title={`${localized.name} | Annapurna Aahaar`}
        description={`${localized.name} from Annapurna Aahaar, Bhainsa, Nirmal District, Telangana. Handcrafted traditional quality. Call 9347036152 to order.`}
        url={`https://bandegangasai.github.io/annapurna-aahaar/#/products/${product.slug}`}
        image={`https://bandegangasai.github.io/annapurna-aahaar${getProductImageUrl(product.imageUrl)}`}
        jsonLd={productJsonLd}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb & Back */}
        <div className="mb-6">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-xs font-bold text-stone-muted hover:text-[#173F35] transition-colors bg-white px-4 py-2 rounded-full border border-[#C79A45]/30 shadow-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Products</span>
          </Link>
        </div>

        {/* Main Product Container */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#C79A45]/30 shadow-subtle grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Product Photography Column */}
          <div className="lg:col-span-6 flex items-center justify-center">
            <div className="relative w-full aspect-square max-w-md bg-[#FAF6EE] rounded-3xl p-6 border-2 border-[#C79A45]/30 shadow-inner flex items-center justify-center overflow-hidden">
              <img
                src={getProductImageUrl(product.imageUrl)}
                alt={localized.name}
                className="w-full h-full object-contain hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-4 left-4 bg-[#173F35] text-[#F8F3E7] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-xs border border-[#C79A45]/40">
                {product.category}
              </span>
            </div>
          </div>

          {/* Product Info & Purchase Column */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <span className="text-xs font-bold text-[#C79A45] uppercase tracking-widest block mb-1">
                Annapurna Aahaar — Bhainsa, Nirmal
              </span>
              <h1 className="font-serif font-black text-3xl sm:text-4xl text-[#173F35] leading-tight">
                {localized.name}
              </h1>
            </div>

            <p className="text-stone-muted text-sm sm:text-base leading-relaxed">
              {localized.description}
            </p>

            {/* Variant / Weight Selector */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-stone-100">
                <label className="text-xs font-bold text-stone-primary uppercase tracking-wider block">
                  {t('prod_select_weight')}
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setSelectedVariant(v)}
                      className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
                        selectedVariant?.id === v.id
                          ? 'bg-[#173F35] text-[#F8F3E7] shadow-md border-2 border-[#C79A45]'
                          : 'bg-[#FAF6EE] text-stone-primary hover:bg-[#F1E9D5] border border-[#C79A45]/30'
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
              <div className="bg-[#FAF6EE] p-4 rounded-2xl border border-[#C79A45]/30 flex items-baseline justify-between">
                <div>
                  <span className="text-xs text-stone-muted uppercase font-bold block">Unit Price:</span>
                  <div className="flex items-baseline gap-2">
                    <span className="font-serif font-black text-3xl text-[#173F35]">
                      {formatINR(selectedVariant.price)}
                    </span>
                    <span className="text-xs text-stone-muted font-medium">
                      per {selectedVariant.weight}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                    {t('prod_stock_in')}
                  </span>
                </div>
              </div>
            )}

            {/* Quantity Selector & Add Actions */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold text-stone-primary uppercase">Quantity:</span>
                <div className="flex items-center bg-[#FAF6EE] border border-[#C79A45]/30 rounded-2xl overflow-hidden shadow-inner">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-4 py-2 font-bold text-stone-primary hover:bg-[#F1E9D5] transition-colors"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 font-bold text-sm text-stone-primary">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="px-4 py-2 font-bold text-stone-primary hover:bg-[#F1E9D5] transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  onClick={handleAddToCart}
                  className={`py-4 rounded-2xl font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 ${
                    isAdded
                      ? 'bg-emerald-800 text-white'
                      : 'bg-[#173F35] hover:bg-[#0C241E] text-[#F8F3E7] border border-[#C79A45]/30'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-5 h-5" />
                      <span>{t('prod_btn_added')}</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-5 h-5 text-[#C79A45]" />
                      <span>{t('prod_btn_add')}</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleBuyNow}
                  className="py-4 rounded-2xl font-bold text-sm bg-[#C79A45] hover:bg-[#D5AD56] text-[#173F35] transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <span>{t('prod_btn_buy')}</span>
                </button>
              </div>

              {/* Direct IVR Phone Ordering Button */}
              <a
                href="tel:9347036152"
                className="w-full flex items-center justify-center gap-2 py-3 bg-[#173F35]/10 hover:bg-[#173F35]/15 text-[#173F35] border border-[#C79A45]/40 rounded-2xl text-xs font-bold transition-all"
              >
                <Phone className="w-4 h-4 text-[#C79A45] animate-pulse" />
                <span>Prefer to Order by Phone? Call 9347036152 (24/7 IVR)</span>
              </a>
            </div>

            {/* Assurance Badges */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-stone-100 text-xs text-stone-muted">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#C79A45]" />
                <span>100% Pure & Unadulterated</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#C79A45]" />
                <span>Free Shipping Above ₹500</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
