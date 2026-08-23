import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ArrowLeft,
  Truck,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatINR } from '../utils/formatters';
import { SEOHead } from '../components/common/SEOHead';

export const Cart: React.FC = () => {
  const { items, removeItem, updateQuantity, clearCart, subtotal, deliveryFee, total } =
    useCart();
  const navigate = useNavigate();

  const freeDeliveryThreshold = 500;
  const remainingForFree = freeDeliveryThreshold - subtotal;
  const progressPercent = Math.min(100, Math.max(0, (subtotal / freeDeliveryThreshold) * 100));

  return (
    <div className="bg-[#FCF9F2] min-h-screen py-10 lg:py-14">
      <SEOHead
        title="Shopping Cart | Annapurna Aahaar"
        description="Review your selected items from Annapurna Aahaar before checkout."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="font-serif font-black text-3xl sm:text-4xl text-heritage-maroon">
            Shopping Cart
          </h1>
          <p className="text-stone-600 text-sm mt-1">
            Review your selected handcrafted papads, sevaya, and pure spices.
          </p>
        </div>

        {items.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-amber-900/10 shadow-sm max-w-xl mx-auto space-y-5">
            <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center mx-auto text-amber-800">
              <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
            </div>
            <h2 className="font-serif font-bold text-2xl text-stone-900">
              Your cart is currently empty
            </h2>
            <p className="text-sm text-stone-600">
              Experience authentic Indian quality. Add some delicious papads, whole-wheat sevaya, or pure golden turmeric.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-heritage-maroon hover:bg-turmeric-900 text-cream-100 px-7 py-3.5 rounded-xl font-bold text-sm shadow-md transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Explore Products Catalogue</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Cart Items List */}
            <div className="lg:col-span-8 space-y-4">
              {/* Free Delivery Bar */}
              <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200/80 shadow-sm">
                <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-amber-950">
                  <Truck className="w-4 h-4 text-turmeric-600 shrink-0" />
                  {remainingForFree > 0 ? (
                    <span>
                      Add <strong className="text-heritage-maroon">{formatINR(remainingForFree)}</strong> more to unlock <strong>FREE Delivery!</strong>
                    </span>
                  ) : (
                    <span className="text-emerald-700 font-bold">
                      🎉 Congratulations! You have qualified for FREE Delivery!
                    </span>
                  )}
                </div>
                <div className="w-full bg-amber-200/60 h-2 rounded-full mt-2.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-turmeric-500 to-emerald-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Items Card */}
              <div className="bg-white rounded-3xl border border-amber-900/10 shadow-sm divide-y divide-stone-100 overflow-hidden">
                {items.map((item) => (
                  <div
                    key={`${item.productId}-${item.variantId}`}
                    className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={item.imageUrl}
                        alt={item.productName}
                        className="w-20 h-20 rounded-xl object-cover bg-cream-100 shrink-0 border border-amber-900/10"
                      />
                      <div>
                        <Link
                          to={`/products/${item.slug}`}
                          className="font-serif font-bold text-stone-900 hover:text-turmeric-700 transition-colors text-base sm:text-lg"
                        >
                          {item.productName}
                        </Link>
                        <div className="text-xs text-stone-500 mt-1">
                          Size/Weight: <span className="font-semibold text-stone-700">{item.weight}</span>
                        </div>
                        <div className="text-sm font-bold text-heritage-maroon mt-1">
                          {formatINR(item.unitPrice)} each
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                      {/* Quantity Modifier */}
                      <div className="flex items-center border border-amber-900/20 rounded-xl overflow-hidden bg-cream-50">
                        <button
                          onClick={() =>
                            updateQuantity(item.productId, item.variantId, item.quantity - 1)
                          }
                          className="p-2 text-stone-700 hover:bg-cream-200 transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-bold text-stone-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.productId, item.variantId, item.quantity + 1)
                          }
                          className="p-2 text-stone-700 hover:bg-cream-200 transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Line Item Total */}
                      <div className="text-right min-w-[80px]">
                        <span className="font-serif font-bold text-lg text-heritage-maroon block">
                          {formatINR(item.unitPrice * item.quantity)}
                        </span>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeItem(item.productId, item.variantId)}
                        className="text-stone-400 hover:text-red-600 transition-colors p-1"
                        title="Remove from cart"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Actions below list */}
              <div className="flex justify-between items-center pt-2">
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-heritage-maroon hover:text-turmeric-700 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Continue Shopping</span>
                </Link>
                <button
                  onClick={clearCart}
                  className="text-xs text-stone-500 hover:text-red-600 transition-colors"
                >
                  Clear Entire Cart
                </button>
              </div>
            </div>

            {/* Right Column: Order Summary */}
            <div className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-8 border border-amber-900/10 shadow-lg space-y-6">
              <h2 className="font-serif font-bold text-xl text-stone-900 border-b border-stone-100 pb-3">
                Order Summary
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-stone-900">{formatINR(subtotal)}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Delivery Charges</span>
                  <span className="font-semibold text-stone-900">
                    {deliveryFee === 0 ? (
                      <span className="text-emerald-600 font-bold">FREE</span>
                    ) : (
                      formatINR(deliveryFee)
                    )}
                  </span>
                </div>
                <div className="pt-3 border-t border-stone-100 flex justify-between items-baseline">
                  <span className="font-serif font-bold text-lg text-stone-900">Total Payable</span>
                  <span className="font-serif font-black text-2xl text-heritage-maroon">
                    {formatINR(total)}
                  </span>
                </div>
              </div>

              <div className="bg-cream-50 p-3.5 rounded-xl border border-amber-900/10 text-xs text-stone-600 space-y-1.5">
                <div className="flex items-center gap-2 font-semibold text-stone-800">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Cash on Delivery Supported</span>
                </div>
                <p className="text-[11px] text-stone-500">
                  Pay with cash or UPI at the time of delivery after inspecting your sealed box.
                </p>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full bg-gradient-to-r from-turmeric-600 to-amber-700 hover:from-turmeric-700 hover:to-amber-800 text-white py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-turmeric-600/25 transition-all transform active:scale-95"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
