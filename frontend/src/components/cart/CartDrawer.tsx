import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  ShoppingBag,
  Trash2,
  ArrowRight,
  Truck,
  Plus,
  Minus,
  ShieldCheck,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useLanguage } from '../../context/LanguageContext';
import { formatINR, getProductImageUrl } from '../../utils/formatters';

export const CartDrawer: React.FC = () => {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
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

  if (!isCartOpen) return null;

  const freeShippingPercent = Math.min(
    100,
    Math.round((subtotal / freeDeliveryThreshold) * 100)
  );

  const handleCheckoutClick = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#F8F3E7] border-l-2 border-[#C79A45]/40 shadow-2xl flex flex-col justify-between">
          {/* Drawer Header */}
          <div className="p-5 sm:p-6 bg-white border-b border-[#C79A45]/20 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-[#173F35] text-[#C79A45] flex items-center justify-center font-bold border border-[#C79A45]/30">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-[#173F35]">
                  {t('cart_title')}
                </h3>
                <span className="text-xs text-stone-muted font-medium">
                  {items.length} item{items.length > 1 ? 's' : ''}
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-xl text-stone-muted hover:text-stone-primary hover:bg-[#F1E9D5] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Delivery Progress Indicator */}
          <div className="p-4 bg-white/70 border-b border-[#C79A45]/15">
            <div className="flex items-center justify-between text-xs mb-1.5 font-bold">
              <span className="flex items-center gap-1.5 text-[#173F35]">
                <Truck className="w-3.5 h-3.5 text-[#C79A45]" />
                {amountForFreeDelivery <= 0 ? (
                  <span className="text-emerald-800 font-bold">{t('cart_free_delivery_tag')}</span>
                ) : (
                  <span>Add {formatINR(amountForFreeDelivery)} more for FREE Delivery</span>
                )}
              </span>
              <span className="text-stone-muted">{freeShippingPercent}%</span>
            </div>
            <div className="w-full h-2 bg-[#E7DCBE] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#C79A45] to-[#173F35] transition-all duration-500"
                style={{ width: `${freeShippingPercent}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-[#F1E9D5] flex items-center justify-center mx-auto text-stone-400">
                  <ShoppingBag className="w-8 h-8 text-[#C79A45]" />
                </div>
                <h4 className="font-serif font-bold text-lg text-stone-primary">
                  {t('cart_empty')}
                </h4>
                <p className="text-xs text-stone-muted max-w-xs mx-auto">
                  {t('cart_empty_sub')}
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('/products');
                  }}
                  className="mt-2 bg-[#173F35] text-[#F8F3E7] hover:bg-[#0C241E] px-6 py-2.5 rounded-2xl font-bold text-xs shadow-sm border border-[#C79A45]/30 transition-all"
                >
                  {t('cart_browse')}
                </button>
              </div>
            ) : (
              items.map((item) => {
                const localized = getLocalizedProduct(item.productId, item.productName, '');
                return (
                  <div
                    key={`${item.productId}-${item.variantId}`}
                    className="bg-white p-4 rounded-2xl border border-[#C79A45]/20 shadow-subtle flex items-center gap-3"
                  >
                    <img
                      src={getProductImageUrl(item.imageUrl)}
                      alt={localized.name}
                      className="w-14 h-14 object-contain rounded-xl bg-[#FAF6EE] p-1 border border-stone-200 shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <h5 className="font-serif font-bold text-stone-primary text-sm truncate">
                        {localized.name}
                      </h5>
                      <span className="text-xs text-stone-muted font-medium block">
                        Pack: {item.weight}
                      </span>
                      <span className="font-serif font-black text-sm text-[#173F35]">
                        {formatINR(item.unitPrice)}
                      </span>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <div className="flex items-center bg-[#F8F3E7] border border-stone-300 rounded-xl overflow-hidden text-xs font-bold">
                        <button
                          onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)}
                          className="px-2 py-1 hover:bg-[#E7DCBE] transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}
                          className="px-2 py-1 hover:bg-[#E7DCBE] transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.productId, item.variantId)}
                        className="text-stone-400 hover:text-red-700 transition-colors p-1"
                        title="Remove Item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Drawer Footer Checkout */}
          {items.length > 0 && (
            <div className="p-5 sm:p-6 bg-white border-t border-[#C79A45]/25 space-y-4">
              <div className="space-y-1.5 text-xs sm:text-sm">
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
                <div className="flex justify-between font-serif font-black text-lg text-[#173F35] pt-2 border-t border-stone-100">
                  <span>{t('cart_total')}</span>
                  <span>{formatINR(total)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={handleCheckoutClick}
                  className="w-full bg-[#173F35] hover:bg-[#0C241E] text-[#F8F3E7] py-3.5 rounded-2xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 border border-[#C79A45]/40"
                >
                  <span>{t('cart_checkout_btn')}</span>
                  <ArrowRight className="w-4 h-4 text-[#C79A45]" />
                </button>

                <div className="text-center text-[11px] text-stone-muted flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-800" />
                  <span>Online Payments & Cash on Delivery Accepted</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
