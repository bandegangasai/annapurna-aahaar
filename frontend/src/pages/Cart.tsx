import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Trash2,
  ArrowRight,
  ArrowLeft,
  Truck,
  Plus,
  Minus,
  ShieldCheck,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { SEOHead } from '../components/common/SEOHead';
import { formatINR, getProductImageUrl } from '../utils/formatters';

export const Cart: React.FC = () => {
  const {
    items,
    updateQuantity,
    removeItem,
    subtotal,
    deliveryFee,
    total,
    freeDeliveryThreshold,
    amountForFreeDelivery,
  } = useCart();

  const { t, getLocalizedProduct } = useLanguage();
  const navigate = useNavigate();

  const freeShippingPercent = Math.min(
    100,
    Math.round((subtotal / freeDeliveryThreshold) * 100)
  );

  return (
    <div className="bg-[#F8F3E7] min-h-screen py-10 lg:py-16 text-[#252525]">
      <SEOHead
        title="Your Shopping Basket | Annapurna Aahaar"
        description="Review your selected handcrafted papads, sevaya, and turmeric before secure checkout."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-[#C79A45] uppercase tracking-widest block mb-1">
            Review Selection
          </span>
          <h1 className="font-serif font-black text-3xl sm:text-4xl text-[#173F35]">
            {t('cart_title')}
          </h1>
        </div>

        {items.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 sm:p-16 border border-[#C79A45]/30 shadow-subtle text-center max-w-lg mx-auto space-y-4">
            <div className="w-20 h-20 rounded-3xl bg-[#FAF6EE] flex items-center justify-center mx-auto text-stone-400">
              <ShoppingBag className="w-10 h-10 text-[#C79A45]" />
            </div>
            <h2 className="font-serif font-bold text-2xl text-[#173F35]">
              {t('cart_empty')}
            </h2>
            <p className="text-sm text-stone-muted">
              {t('cart_empty_sub')}
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-[#173F35] text-[#F8F3E7] hover:bg-[#0C241E] px-8 py-3.5 rounded-2xl font-bold text-sm shadow-md transition-all border border-[#C79A45]/30"
            >
              <span>{t('cart_browse')}</span>
              <ArrowRight className="w-4 h-4 text-[#C79A45]" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Left Column: Items */}
            <div className="lg:col-span-8 space-y-4">
              {/* Free Delivery Bar */}
              <div className="bg-white p-5 rounded-3xl border border-[#C79A45]/25 shadow-subtle space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="flex items-center gap-1.5 text-[#173F35]">
                    <Truck className="w-4 h-4 text-[#C79A45]" />
                    {amountForFreeDelivery <= 0 ? (
                      <span className="text-emerald-800 font-bold">{t('cart_free_delivery_tag')}</span>
                    ) : (
                      <span>Add {formatINR(amountForFreeDelivery)} more for Free Delivery</span>
                    )}
                  </span>
                  <span className="text-stone-muted">{freeShippingPercent}%</span>
                </div>
                <div className="w-full h-2.5 bg-[#FAF6EE] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#C79A45] to-[#173F35] transition-all duration-500"
                    style={{ width: `${freeShippingPercent}%` }}
                  />
                </div>
              </div>

              {/* Items Card */}
              <div className="bg-white rounded-3xl border border-[#C79A45]/30 shadow-subtle p-6 sm:p-8 space-y-4">
                <div className="divide-y divide-stone-100">
                  {items.map((item) => {
                    const localized = getLocalizedProduct(item.productId, item.productName, '');
                    return (
                      <div
                        key={`${item.productId}-${item.variantId}`}
                        className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-4">
                          <img
                            src={getProductImageUrl(item.imageUrl)}
                            alt={localized.name}
                            className="w-16 h-16 object-contain rounded-2xl bg-[#FAF6EE] p-1.5 border border-stone-200 shrink-0"
                          />
                          <div>
                            <h4 className="font-serif font-bold text-stone-primary text-base">
                              {localized.name}
                            </h4>
                            <span className="text-xs text-stone-muted">
                              Pack Weight: <strong className="text-stone-primary">{item.weight}</strong>
                            </span>
                            <div className="font-serif font-black text-sm text-[#173F35] mt-0.5">
                              {formatINR(item.unitPrice)} each
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                          {/* Quantity */}
                          <div className="flex items-center bg-[#FAF6EE] border border-[#C79A45]/30 rounded-2xl overflow-hidden shadow-inner text-xs font-bold">
                            <button
                              onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)}
                              className="px-3 py-1.5 hover:bg-[#F1E9D5] transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="px-3 text-stone-primary">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}
                              className="px-3 py-1.5 hover:bg-[#F1E9D5] transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Line Total */}
                          <div className="font-serif font-black text-base text-[#173F35] min-w-[70px] text-right">
                            {formatINR(item.unitPrice * item.quantity)}
                          </div>

                          {/* Remove */}
                          <button
                            onClick={() => removeItem(item.productId, item.variantId)}
                            className="text-stone-400 hover:text-red-700 transition-colors p-1"
                            title="Remove from Cart"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 text-xs font-bold text-stone-muted hover:text-[#173F35] transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Continue Shopping</span>
                </Link>
              </div>
            </div>

            {/* Right Column: Summary */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#C79A45]/30 shadow-subtle space-y-6 sticky top-24">
                <h3 className="font-serif font-bold text-xl text-[#173F35] border-b border-stone-100 pb-3">
                  {t('cart_title')}
                </h3>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-stone-muted">
                    <span>{t('cart_subtotal')}</span>
                    <span className="font-semibold text-stone-primary">{formatINR(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-stone-muted">
                    <span>{t('cart_delivery')}</span>
                    <span>
                      {deliveryFee === 0 ? (
                        <span className="text-emerald-800 font-bold">FREE</span>
                      ) : (
                        formatINR(deliveryFee)
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between font-serif font-black text-xl text-[#173F35] pt-3 border-t border-stone-100">
                    <span>{t('cart_total')}</span>
                    <span>{formatINR(total)}</span>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/checkout')}
                  className="w-full bg-[#173F35] hover:bg-[#0C241E] text-[#F8F3E7] py-4 rounded-2xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 border border-[#C79A45]/40"
                >
                  <span>{t('cart_checkout_btn')}</span>
                  <ArrowRight className="w-4 h-4 text-[#C79A45]" />
                </button>

                <div className="text-center text-xs text-stone-muted flex items-center justify-center gap-1.5 pt-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-800" />
                  <span>Cash on Delivery & Direct UPI Accepted</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
