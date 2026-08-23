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
    clearCart,
  } = useCart();

  const navigate = useNavigate();

  const freeShippingPercent = Math.min(
    100,
    Math.round((subtotal / freeDeliveryThreshold) * 100)
  );

  return (
    <div className="bg-[#FAF6EE] min-h-screen py-10 lg:py-16">
      <SEOHead
        title="Your Shopping Basket | Annapurna Aahaar"
        description="Review your selected handcrafted papads, sevaya, and turmeric before secure checkout."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-heritage-antiqueGold uppercase tracking-widest block mb-1">
            Review Selection
          </span>
          <h1 className="font-serif font-black text-3xl sm:text-4xl text-heritage-maroon">
            Your Shopping Basket
          </h1>
        </div>

        {items.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 sm:p-16 border border-heritage-gold/30 shadow-md text-center max-w-lg mx-auto space-y-4">
            <div className="w-20 h-20 rounded-full bg-cream-100 flex items-center justify-center mx-auto text-stone-400">
              <ShoppingBag className="w-10 h-10" />
            </div>
            <h2 className="font-serif font-bold text-2xl text-heritage-maroon">
              Your Basket is Currently Empty
            </h2>
            <p className="text-sm text-stone-600">
              Add authentic Indian papads, whole-wheat sevaya, or pure turmeric powder to get started.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-heritage-maroon text-cream-100 px-8 py-3.5 rounded-2xl font-bold text-sm shadow-md"
            >
              <span>Explore Products</span>
              <ArrowRight className="w-4 h-4 text-heritage-gold" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Left Column: Items */}
            <div className="lg:col-span-8 space-y-4">
              {/* Free Delivery Bar */}
              <div className="bg-white p-5 rounded-3xl border border-heritage-gold/25 shadow-sm space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="flex items-center gap-1.5 text-heritage-maroon">
                    <Truck className="w-4 h-4 text-heritage-gold" />
                    {amountForFreeDelivery <= 0 ? (
                      <span className="text-emerald-700">Congratulations! Free Delivery Unlocked.</span>
                    ) : (
                      <span>Add {formatINR(amountForFreeDelivery)} more for Free Delivery</span>
                    )}
                  </span>
                  <span className="text-stone-500">{freeShippingPercent}%</span>
                </div>
                <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-heritage-gold to-emerald-600 transition-all duration-500"
                    style={{ width: `${freeShippingPercent}%` }}
                  />
                </div>
              </div>

              {/* Items Card */}
              <div className="bg-white rounded-3xl border border-heritage-gold/30 shadow-md p-6 sm:p-8 space-y-4">
                <div className="divide-y divide-stone-100">
                  {items.map((item) => (
                    <div
                      key={`${item.productId}-${item.variantId}`}
                      className="py-4 sm:py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={getProductImageUrl(item.imageUrl)}
                          alt={item.productName}
                          className="w-16 h-16 object-contain rounded-2xl bg-cream-100 p-1.5 border border-stone-200 shrink-0"
                        />
                        <div>
                          <Link
                            to={`/products/${item.slug}`}
                            className="font-serif font-bold text-stone-900 hover:text-heritage-maroon text-base sm:text-lg block"
                          >
                            {item.productName}
                          </Link>
                          <span className="text-xs text-stone-500 font-medium block">
                            Pack Size: {item.weight}
                          </span>
                          <span className="font-serif font-bold text-sm text-heritage-maroon">
                            {formatINR(item.unitPrice)} each
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                        <div className="flex items-center bg-[#FAF6EE] border border-stone-300 rounded-xl overflow-hidden text-xs font-bold">
                          <button
                            onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)}
                            className="px-3 py-1.5 hover:bg-cream-200 transition-colors"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-3">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}
                            className="px-3 py-1.5 hover:bg-cream-200 transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <span className="font-serif font-black text-base text-stone-900 w-20 text-right">
                          {formatINR(item.unitPrice * item.quantity)}
                        </span>

                        <button
                          onClick={() => removeItem(item.productId, item.variantId)}
                          className="text-stone-400 hover:text-red-600 transition-colors p-1"
                          title="Remove"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-stone-100 flex justify-between items-center text-xs">
                  <button
                    onClick={clearCart}
                    className="text-stone-400 hover:text-red-600 transition-colors font-semibold"
                  >
                    Clear All Items
                  </button>
                  <Link
                    to="/products"
                    className="text-heritage-maroon font-bold hover:underline flex items-center gap-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Continue Shopping</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary */}
            <div className="lg:col-span-4">
              <div className="bg-white rounded-3xl border-2 border-heritage-gold/30 shadow-md p-6 sm:p-8 space-y-6 sticky top-24">
                <h3 className="font-serif font-bold text-xl text-heritage-maroon border-b border-stone-100 pb-3">
                  Summary
                </h3>

                <div className="space-y-2 text-xs sm:text-sm text-stone-600">
                  <div className="flex justify-between">
                    <span>Items Subtotal:</span>
                    <span className="font-bold text-stone-900">{formatINR(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Charge:</span>
                    <span>
                      {deliveryFee === 0 ? (
                        <span className="text-emerald-700 font-bold">FREE</span>
                      ) : (
                        formatINR(deliveryFee)
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between font-serif font-black text-lg text-heritage-maroon pt-3 border-t border-stone-100">
                    <span>Total Amount:</span>
                    <span>{formatINR(total)}</span>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/checkout')}
                  className="w-full bg-gradient-to-r from-heritage-maroon via-heritage-richRed to-heritage-darkMaroon hover:from-heritage-darkMaroon hover:to-heritage-maroon text-cream-100 py-4 rounded-2xl font-bold text-sm shadow-xl transition-all flex items-center justify-center gap-2 border border-heritage-gold/30"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4 text-heritage-gold" />
                </button>

                <div className="text-center text-xs text-stone-500 flex items-center justify-center gap-1.5 pt-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>Online & Cash on Delivery Payment Options</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
