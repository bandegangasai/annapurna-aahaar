import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
        <div className="w-screen max-w-md bg-[#FAF6EE] border-l-2 border-heritage-gold/30 shadow-2xl flex flex-col justify-between">
          {/* Drawer Header */}
          <div className="p-5 sm:p-6 bg-white border-b border-heritage-gold/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-heritage-maroon text-heritage-gold flex items-center justify-center font-bold">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-heritage-maroon">
                  Your Basket
                </h3>
                <span className="text-xs text-stone-500">
                  {items.length} unique item{items.length > 1 ? 's' : ''}
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-full text-stone-500 hover:text-stone-800 hover:bg-stone-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="p-4 bg-white/60 border-b border-heritage-gold/15">
            <div className="flex items-center justify-between text-xs mb-1.5 font-bold">
              <span className="flex items-center gap-1 text-heritage-maroon">
                <Truck className="w-3.5 h-3.5 text-heritage-gold" />
                {amountForFreeDelivery <= 0 ? (
                  <span className="text-emerald-700">You qualify for FREE Delivery!</span>
                ) : (
                  <span>Add {formatINR(amountForFreeDelivery)} more for FREE Delivery</span>
                )}
              </span>
              <span className="text-stone-500">{freeShippingPercent}%</span>
            </div>
            <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-heritage-gold to-emerald-600 transition-all duration-500"
                style={{ width: `${freeShippingPercent}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <div className="w-16 h-16 rounded-full bg-cream-200 flex items-center justify-center mx-auto text-stone-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h4 className="font-serif font-bold text-lg text-stone-800">
                  Your basket is empty
                </h4>
                <p className="text-xs text-stone-500 max-w-xs mx-auto">
                  Explore our handcrafted papads, traditional wheat sevaya, and pure turmeric powder.
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('/products');
                  }}
                  className="mt-2 bg-heritage-maroon text-cream-100 px-6 py-2.5 rounded-2xl font-bold text-xs shadow-md"
                >
                  Browse Products
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={`${item.productId}-${item.variantId}`}
                  className="bg-white p-4 rounded-2xl border border-heritage-gold/20 shadow-sm flex items-center gap-3"
                >
                  <img
                    src={getProductImageUrl(item.imageUrl)}
                    alt={item.productName}
                    className="w-14 h-14 object-contain rounded-xl bg-cream-100 p-1 border border-stone-200 shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <h5 className="font-serif font-bold text-stone-900 text-sm truncate">
                      {item.productName}
                    </h5>
                    <span className="text-xs text-stone-500 font-medium block">
                      Pack: {item.weight}
                    </span>
                    <span className="font-serif font-black text-sm text-heritage-maroon">
                      {formatINR(item.unitPrice)}
                    </span>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <div className="flex items-center bg-[#FAF6EE] border border-stone-300 rounded-xl overflow-hidden text-xs font-bold">
                      <button
                        onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)}
                        className="px-2 py-1 hover:bg-cream-200 transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}
                        className="px-2 py-1 hover:bg-cream-200 transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.productId, item.variantId)}
                      className="text-stone-400 hover:text-red-600 transition-colors p-1"
                      title="Remove Item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer Checkout */}
          {items.length > 0 && (
            <div className="p-5 sm:p-6 bg-white border-t border-heritage-gold/25 space-y-4">
              <div className="space-y-1.5 text-xs sm:text-sm">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-stone-900">{formatINR(subtotal)}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Delivery:</span>
                  <span>
                    {deliveryFee === 0 ? (
                      <span className="text-emerald-700 font-bold">FREE</span>
                    ) : (
                      formatINR(deliveryFee)
                    )}
                  </span>
                </div>
                <div className="flex justify-between font-serif font-black text-lg text-heritage-maroon pt-2 border-t border-stone-100">
                  <span>Total:</span>
                  <span>{formatINR(total)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={handleCheckoutClick}
                  className="w-full bg-gradient-to-r from-heritage-maroon via-heritage-richRed to-heritage-darkMaroon hover:from-heritage-darkMaroon hover:to-heritage-maroon text-cream-100 py-3.5 rounded-2xl font-bold text-sm shadow-xl transition-all flex items-center justify-center gap-2 border border-heritage-gold/30"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4 text-heritage-gold" />
                </button>

                <div className="text-center text-[11px] text-stone-500 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
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
