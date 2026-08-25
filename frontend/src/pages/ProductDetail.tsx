import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ShoppingBag,
  Check,
  ShieldCheck,
  Truck,
  ArrowLeft,
  Phone,
  Star,
  Sparkles,
  RotateCcw,
  Clock,
  HeartHandshake,
  MessageSquarePlus,
  User,
  MapPin,
  CheckCircle,
  MessageCircle,
} from 'lucide-react';
import { SEOHead } from '../components/common/SEOHead';
import { ProductCard3D } from '../components/product/ProductCard3D';
import { formatINR, getProductImageUrl } from '../utils/formatters';
import { generateSingleProductWhatsAppUrl } from '../utils/whatsapp';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';
import { Product, ProductVariant, Review } from '../types';

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
  const [activeTab, setActiveTab] = useState<'overview' | 'ingredients' | 'reviews' | 'shipping'>('overview');

  // Customer Review Form State
  const [reviewName, setReviewName] = useState('');
  const [reviewLocation, setReviewLocation] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSuccessMsg, setReviewSuccessMsg] = useState<string | null>(null);

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

  useEffect(() => {
    fetchProduct();
    setReviewSuccessMsg(null);
  }, [slug]);

  const handleAddToCart = () => {
    if (!selectedVariant || !product) return;
    addItem(product, selectedVariant, quantity);
    setIsAdded(true);
    showToast(`Added ${quantity}x ${product.name} (${selectedVariant.weight}) to cart!`, 'success');
    setTimeout(() => setIsAdded(false), 1600);
  };

  const handleBuyNow = () => {
    if (!selectedVariant || !product) return;
    addItem(product, selectedVariant, quantity);
    navigate('/checkout');
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    if (!reviewName.trim() || !reviewComment.trim()) {
      showToast('Please provide your name and review comment.', 'error');
      return;
    }

    setIsSubmittingReview(true);
    try {
      const res = await api.submitReview({
        productId: product.id,
        customerName: reviewName,
        customerLocation: reviewLocation,
        rating: reviewRating,
        title: reviewTitle,
        comment: reviewComment,
      });

      if (res.success) {
        setReviewSuccessMsg(res.message || 'Review submitted for moderation.');
        showToast('Review submitted successfully! Thank you.', 'success');
        setReviewName('');
        setReviewLocation('');
        setReviewTitle('');
        setReviewComment('');
        setReviewRating(5);
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to submit review', 'error');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <div className="w-14 h-14 border-4 border-[#C79A45] border-t-[#173F35] rounded-full animate-spin mx-auto mb-4" />
        <p className="font-serif text-lg text-[#173F35] font-semibold">Loading authentic heritage product details...</p>
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
          className="inline-flex items-center gap-2 bg-[#173F35] text-[#F8F3E7] px-6 py-3 rounded-2xl font-bold text-sm hover:bg-[#0C241E] transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Catalogue</span>
        </Link>
      </div>
    );
  }

  const localized = getLocalizedProduct(product.slug || product.id, product.name, product.description);
  const canonicalUrl = `https://bandegangasai.github.io/annapurna-aahaar/#/products/${product.slug}`;
  const imageUrl = `https://bandegangasai.github.io/annapurna-aahaar${getProductImageUrl(product.imageUrl)}`;

  // Google Search Console Compliant Structured Data (Schema.org)
  const productJsonLd: Record<string, any> = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: `${localized.name} | Annapurna Aahaar`,
    image: [imageUrl],
    description: `${localized.name} from Annapurna Aahaar, Bhainsa, Nirmal District, Telangana. Handcrafted traditional quality.`,
    sku: product.sku || `AA-${product.slug.toUpperCase()}`,
    brand: {
      '@type': 'Brand',
      name: 'Annapurna Aahaar',
    },
    offers: {
      '@type': 'Offer',
      url: canonicalUrl,
      priceCurrency: 'INR',
      price: selectedVariant ? selectedVariant.price.toFixed(2) : (product.variants[0]?.price.toFixed(2) || '100.00'),
      priceValidUntil: '2027-12-31',
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: {
        '@type': 'Organization',
        name: 'Annapurna Aahaar',
      },
      // Google Merchant Listing Fix 1: hasMerchantReturnPolicy
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: 'IN',
        returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
        merchantReturnDays: 7,
        returnMethod: 'https://schema.org/ReturnByMail',
        returnFees: 'https://schema.org/FreeReturn',
      },
      // Google Merchant Listing Fix 2: shippingDetails
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: {
          '@type': 'MonetaryAmount',
          value: '40.00',
          currency: 'INR',
        },
        shippingDestination: {
          '@type': 'DefinedRegion',
          addressCountry: 'IN',
        },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: {
            '@type': 'QuantitativeValue',
            minValue: 0,
            maxValue: 1,
            unitCode: 'DAY',
          },
          transitTime: {
            '@type': 'QuantitativeValue',
            minValue: 2,
            maxValue: 5,
            unitCode: 'DAY',
          },
        },
      },
    },
    // Google Product Snippet Fix: Include aggregateRating & review ONLY when genuine approved reviews exist
    ...(product.reviews && product.reviews.length > 0
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: (product.averageRating || 5.0).toFixed(1),
            reviewCount: (product.totalReviews || product.reviews.length).toString(),
            bestRating: '5',
            worstRating: '1',
          },
          review: product.reviews.map((r) => ({
            '@type': 'Review',
            author: {
              '@type': 'Person',
              name: r.customerName,
            },
            datePublished: r.createdAt ? r.createdAt.split('T')[0] : '2026-08-25',
            reviewBody: r.comment,
            reviewRating: {
              '@type': 'Rating',
              ratingValue: r.rating.toString(),
              bestRating: '5',
              worstRating: '1',
            },
          })),
        }
      : {}),
  };

  const breadcrumbJsonLd: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://bandegangasai.github.io/annapurna-aahaar/',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Products',
        item: 'https://bandegangasai.github.io/annapurna-aahaar/#/products',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: localized.name,
        item: canonicalUrl,
      },
    ],
  };

  const approvedReviews = product.reviews || [];

  return (
    <div className="bg-[#F8F3E7] min-h-screen py-10 lg:py-16 text-[#252525]">
      <SEOHead
        title={`${localized.name} | Annapurna Aahaar`}
        description={`${localized.name} from Annapurna Aahaar, Bhainsa, Nirmal District, Telangana. Handcrafted traditional quality. Call 9347036152 to order.`}
        url={canonicalUrl}
        image={imageUrl}
        jsonLd={[productJsonLd, breadcrumbJsonLd]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-semibold text-stone-muted">
          <Link to="/" className="hover:text-[#173F35] transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link to="/products" className="hover:text-[#173F35] transition-colors">
            Products
          </Link>
          <span>/</span>
          <span className="text-[#173F35] font-bold">{localized.name}</span>
        </nav>

        {/* Main Product Container */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#C79A45]/30 shadow-subtle grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Product Photography Column */}
          <div className="lg:col-span-6 flex items-center justify-center">
            <div className="relative w-full aspect-square max-w-md bg-[#FAF6EE] rounded-3xl p-6 border-2 border-[#C79A45]/30 shadow-inner flex items-center justify-center overflow-hidden group">
              <img
                src={getProductImageUrl(product.imageUrl)}
                alt={localized.name}
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-4 left-4 bg-[#173F35] text-[#F8F3E7] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-xs border border-[#C79A45]/40">
                {product.category}
              </span>
              <span className="absolute top-4 right-4 bg-[#C79A45] text-[#173F35] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-xs">
                100% Traditional
              </span>
            </div>
          </div>

          {/* Product Info & Purchase Column */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <span className="text-xs font-bold text-[#C79A45] uppercase tracking-widest block mb-1">
                Annapurna Aahaar • Bhainsa, Telangana
              </span>
              <h1 className="font-serif font-black text-3xl sm:text-4xl text-[#173F35] leading-tight">
                {localized.name}
              </h1>

              {/* Rating Snippet Header */}
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center text-[#C79A45]">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= Math.round(product.averageRating || 5)
                          ? 'fill-[#C79A45] text-[#C79A45]'
                          : 'text-stone-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-bold text-[#173F35]">
                  {product.averageRating ? product.averageRating.toFixed(1) : '5.0'} / 5.0
                </span>
                <span className="text-xs text-stone-muted">
                  ({approvedReviews.length > 0 ? `${approvedReviews.length} verified reviews` : 'Verified Heritage Recipe'})
                </span>
              </div>
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

              {/* Direct WhatsApp Instant Ordering */}
              {selectedVariant && (
                <a
                  href={generateSingleProductWhatsAppUrl(
                    localized.name,
                    selectedVariant.weight,
                    selectedVariant.price,
                    quantity
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-2xl text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all"
                >
                  <MessageCircle className="w-5 h-5 fill-white" />
                  <span>Order on WhatsApp (Instant Pre-Filled Chat)</span>
                </a>
              )}

              {/* Direct Telephone IVR Ordering */}
              <a
                href="tel:9347036152"
                className="w-full flex items-center justify-center gap-2 py-3 bg-[#173F35]/10 hover:bg-[#173F35]/15 text-[#173F35] border border-[#C79A45]/40 rounded-2xl text-xs font-bold transition-all"
              >
                <Phone className="w-4 h-4 text-[#C79A45] animate-pulse" />
                <span>Prefer to Order by Phone? Call 9347036152 (24/7 Voice Helpline)</span>
              </a>
            </div>

            {/* Assurance Badges */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-stone-100 text-xs text-stone-muted">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#C79A45]" />
                <span>100% Preservative Free</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#C79A45]" />
                <span>Free Delivery Above ₹500</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Information Tabs */}
        <div className="bg-white rounded-3xl border border-[#C79A45]/30 shadow-subtle overflow-hidden">
          {/* Tab Navigation Headers */}
          <div className="flex border-b border-stone-200 overflow-x-auto bg-[#FAF6EE]">
            {[
              { id: 'overview', label: 'Heritage & Craft', icon: Sparkles },
              { id: 'ingredients', label: 'Ingredients & Purity', icon: ShieldCheck },
              { id: 'reviews', label: `Customer Reviews (${approvedReviews.length})`, icon: MessageSquarePlus },
              { id: 'shipping', label: 'Shipping & 7-Day Returns', icon: Truck },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-6 py-4 font-bold text-xs sm:text-sm border-b-2 whitespace-nowrap transition-all ${
                    isActive
                      ? 'border-[#173F35] text-[#173F35] bg-white shadow-2xs'
                      : 'border-transparent text-stone-500 hover:text-[#173F35] hover:bg-[#F1E9D5]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#C79A45]' : 'text-stone-400'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Content Area */}
          <div className="p-6 sm:p-10">
            {/* Tab 1: Overview */}
            {activeTab === 'overview' && (
              <div className="space-y-6 text-stone-primary text-sm sm:text-base leading-relaxed">
                <h3 className="font-serif font-bold text-xl text-[#173F35]">
                  Authentic Culinary Heritage from Bhainsa, Telangana
                </h3>
                <p>
                  Every batch of <strong>{product.name}</strong> is handcrafted using traditional recipes preserved across generations. Sourced from local farms and milled to perfection in Bhainsa, Nirmal District, Telangana (504103).
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                  <div className="bg-[#FAF6EE] p-5 rounded-2xl border border-[#C79A45]/20">
                    <h4 className="font-bold text-[#173F35] text-sm mb-1">Sun-Cured Quality</h4>
                    <p className="text-xs text-stone-muted">Naturally sun-dried for authentic texture, crispness, and traditional taste without artificial dryers.</p>
                  </div>
                  <div className="bg-[#FAF6EE] p-5 rounded-2xl border border-[#C79A45]/20">
                    <h4 className="font-bold text-[#173F35] text-sm mb-1">No Chemical Additives</h4>
                    <p className="text-xs text-stone-muted">Zero artificial colorants, synthetic preservatives, or chemical flavor enhancers.</p>
                  </div>
                  <div className="bg-[#FAF6EE] p-5 rounded-2xl border border-[#C79A45]/20">
                    <h4 className="font-bold text-[#173F35] text-sm mb-1">Direct From Source</h4>
                    <p className="text-xs text-stone-muted">Direct dispatch from kitchen to your home ensures maximum freshness and authentic aroma.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Ingredients */}
            {activeTab === 'ingredients' && (
              <div className="space-y-6 text-stone-primary text-sm sm:text-base leading-relaxed">
                <h3 className="font-serif font-bold text-xl text-[#173F35]">
                  Natural Pure Ingredients
                </h3>
                <p>
                  {product.ingredients ||
                    '100% Natural farm ingredients, premium spices, rock salt, and authentic traditional grains sourced from trusted regional farmers.'}
                </p>
                <div className="bg-[#FAF6EE] p-6 rounded-2xl border border-[#C79A45]/20 space-y-3">
                  <h4 className="font-bold text-[#173F35] text-sm">Packaging & Storage Guidelines:</h4>
                  <ul className="text-xs text-stone-muted space-y-1.5 list-disc list-inside">
                    <li>Store in a cool, dry place away from direct sunlight.</li>
                    <li>Transfer to an airtight container after opening for maximum freshness.</li>
                    <li>Best before 6 months from the date of hygienic packaging.</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Tab 3: Customer Reviews */}
            {activeTab === 'reviews' && (
              <div className="space-y-10">
                {/* Header & Overall Summary */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-stone-100">
                  <div>
                    <h3 className="font-serif font-bold text-xl text-[#173F35]">
                      Customer Ratings & Verified Feedback
                    </h3>
                    <p className="text-xs text-stone-muted mt-1">
                      Real reviews submitted by genuine buyers. Every submission is reviewed by our quality team.
                    </p>
                  </div>
                  <div className="flex items-center gap-3 bg-[#FAF6EE] px-5 py-3 rounded-2xl border border-[#C79A45]/30">
                    <span className="font-serif font-black text-2xl text-[#173F35]">
                      {product.averageRating ? product.averageRating.toFixed(1) : '5.0'}
                    </span>
                    <div>
                      <div className="flex text-[#C79A45]">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-3.5 h-3.5 ${
                              s <= Math.round(product.averageRating || 5)
                                ? 'fill-[#C79A45] text-[#C79A45]'
                                : 'text-stone-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-[11px] text-stone-muted font-bold">
                        {approvedReviews.length} Verified Reviews
                      </span>
                    </div>
                  </div>
                </div>

                {/* Approved Reviews List */}
                {approvedReviews.length > 0 ? (
                  <div className="space-y-4">
                    {approvedReviews.map((rev) => (
                      <div key={rev.id} className="bg-[#FAF6EE] p-5 rounded-2xl border border-[#C79A45]/20 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-[#173F35] text-[#C79A45] flex items-center justify-center font-bold text-xs">
                              {rev.customerName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <span className="font-bold text-xs text-[#173F35] block">{rev.customerName}</span>
                              <span className="text-[10px] text-stone-muted flex items-center gap-1">
                                <MapPin className="w-2.5 h-2.5" />
                                {rev.customerLocation || 'Verified Buyer'}
                              </span>
                            </div>
                          </div>
                          <div className="flex text-[#C79A45]">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                className={`w-3.5 h-3.5 ${
                                  s <= rev.rating ? 'fill-[#C79A45] text-[#C79A45]' : 'text-stone-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        {rev.title && <h4 className="font-bold text-xs text-[#173F35]">{rev.title}</h4>}
                        <p className="text-xs text-stone-600 leading-relaxed">{rev.comment}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 bg-[#FAF6EE] rounded-2xl border border-[#C79A45]/20 p-6 space-y-2">
                    <Sparkles className="w-6 h-6 text-[#C79A45] mx-auto" />
                    <h4 className="font-serif font-bold text-sm text-[#173F35]">Be the First to Review!</h4>
                    <p className="text-xs text-stone-muted max-w-sm mx-auto">
                      Have you enjoyed our authentic {product.name}? Share your genuine experience with customers across India.
                    </p>
                  </div>
                )}

                {/* Review Submission Form */}
                <div className="bg-[#FAF6EE] p-6 sm:p-8 rounded-3xl border border-[#C79A45]/30 space-y-6">
                  <div className="flex items-center gap-2">
                    <MessageSquarePlus className="w-5 h-5 text-[#C79A45]" />
                    <h4 className="font-serif font-bold text-lg text-[#173F35]">Write a Genuine Review</h4>
                  </div>

                  {reviewSuccessMsg ? (
                    <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-4 rounded-2xl text-xs flex items-center gap-2 font-medium">
                      <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                      <span>{reviewSuccessMsg}</span>
                    </div>
                  ) : (
                    <form onSubmit={handleReviewSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-[#173F35] block">Your Rating:</label>
                        <div className="flex items-center gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setReviewRating(star)}
                              className="p-1 text-[#C79A45] hover:scale-110 transition-transform"
                            >
                              <Star
                                className={`w-6 h-6 ${
                                  star <= reviewRating ? 'fill-[#C79A45] text-[#C79A45]' : 'text-stone-300'
                                }`}
                              />
                            </button>
                          ))}
                          <span className="text-xs font-bold text-stone-600 ml-2">({reviewRating} out of 5 stars)</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-bold text-stone-700 block mb-1">Your Full Name *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Ramesh Kulkarni"
                            value={reviewName}
                            onChange={(e) => setReviewName(e.target.value)}
                            className="w-full bg-white border border-[#C79A45]/30 rounded-xl px-4 py-2.5 text-xs text-[#173F35] focus:outline-none focus:ring-2 focus:ring-[#173F35]"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-stone-700 block mb-1">Your City / Location</label>
                          <input
                            type="text"
                            placeholder="e.g. Hyderabad, Telangana"
                            value={reviewLocation}
                            onChange={(e) => setReviewLocation(e.target.value)}
                            className="w-full bg-white border border-[#C79A45]/30 rounded-xl px-4 py-2.5 text-xs text-[#173F35] focus:outline-none focus:ring-2 focus:ring-[#173F35]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-stone-700 block mb-1">Review Headline</label>
                        <input
                          type="text"
                          placeholder="e.g. Authentic taste just like homemade!"
                          value={reviewTitle}
                          onChange={(e) => setReviewTitle(e.target.value)}
                          className="w-full bg-white border border-[#C79A45]/30 rounded-xl px-4 py-2.5 text-xs text-[#173F35] focus:outline-none focus:ring-2 focus:ring-[#173F35]"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-stone-700 block mb-1">Your Review & Comments *</label>
                        <textarea
                          required
                          rows={3}
                          placeholder="Describe the crispness, aroma, quality, or preparation experience..."
                          value={reviewComment}
                          onChange={(e) => setReviewComment(e.target.value)}
                          className="w-full bg-white border border-[#C79A45]/30 rounded-xl p-3 text-xs text-[#173F35] focus:outline-none focus:ring-2 focus:ring-[#173F35]"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmittingReview}
                        className="bg-[#173F35] hover:bg-[#0C241E] text-[#F8F3E7] px-6 py-3 rounded-xl font-bold text-xs tracking-wider shadow-md transition-all disabled:opacity-50"
                      >
                        {isSubmittingReview ? 'Submitting Review...' : 'Submit Genuine Review'}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            )}

            {/* Tab 4: Shipping & Returns Policy */}
            {activeTab === 'shipping' && (
              <div className="space-y-6 text-stone-primary text-sm sm:text-base leading-relaxed">
                <h3 className="font-serif font-bold text-xl text-[#173F35]">
                  Shipping, Delivery & Return Policy
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-[#FAF6EE] p-5 rounded-2xl border border-[#C79A45]/20 space-y-2">
                    <div className="flex items-center gap-2 font-bold text-sm text-[#173F35]">
                      <Truck className="w-4 h-4 text-[#C79A45]" />
                      <span>Delivery Timelines & Charges</span>
                    </div>
                    <ul className="text-xs text-stone-muted space-y-1.5 list-disc list-inside">
                      <li>Standard delivery: <strong>₹40 flat rate</strong> nationwide.</li>
                      <li><strong>FREE SHIPPING</strong> on all orders of ₹500 or more.</li>
                      <li>Estimated delivery: 2-5 business days across Telangana and All India.</li>
                    </ul>
                  </div>

                  <div className="bg-[#FAF6EE] p-5 rounded-2xl border border-[#C79A45]/20 space-y-2">
                    <div className="flex items-center gap-2 font-bold text-sm text-[#173F35]">
                      <RotateCcw className="w-4 h-4 text-[#C79A45]" />
                      <span>7-Day Return & Refund Policy</span>
                    </div>
                    <ul className="text-xs text-stone-muted space-y-1.5 list-disc list-inside">
                      <li>Hassle-free <strong>7-day return window</strong> for unopened, sealed, or damaged items.</li>
                      <li>100% refund processed within 3-5 business days to original payment or UPI.</li>
                      <li>Contact our 24/7 hotline <strong>9347036152</strong> or email <strong>annapurnaaahaar@gmail.com</strong>.</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products Carousel / Grid */}
        {product.related && product.related.length > 0 && (
          <div className="space-y-6 pt-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#C79A45] uppercase tracking-widest block">Complete Your Spread</span>
                <h3 className="font-serif font-black text-2xl text-[#173F35]">You May Also Enjoy</h3>
              </div>
              <Link
                to="/products"
                className="text-xs font-bold text-[#173F35] hover:text-[#C79A45] flex items-center gap-1"
              >
                <span>View All</span>
                <ArrowLeft className="w-3 h-3 rotate-180" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {product.related.slice(0, 3).map((rel) => (
                <ProductCard3D key={rel.id} product={rel} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
