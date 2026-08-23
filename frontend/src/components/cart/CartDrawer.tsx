import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Truck,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatINR } from '../../utils/formatters';

export const CartDrawer: React.FC = () => {
  const {
    items,
    removeItem,
    updateQuantity,
    subtotal,
    deliveryFee,
    total,
    isCartOpen,
    setIsCartOpen,
  } = useCart();

  const navigate = useNavigate();

  const handleCheckoutClick = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  const freeDeliveryThreshold = 500;
  const remainingForFree = freeDeliveryThreshold - subtotal;
  const freeDeliveryProgress = Math.min(100, Math.max(0, (subtotal / freeDeliveryThreshold) * 100));

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm transition-opacity"
          />

          {/* Drawer Panel */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-screen max-w-md bg-[#FCF9F2] shadow-2xl flex flex-col justify-between border-l border-amber-900/20"
            >
              {/* Header */}
              <div className="p-5 border-b border-amber-900/15 flex items-center justify-between bg-white">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-heritage-maroon text-cream-100 flex items-center justify-center">
                    <ShoppingBag className="w-4 h-4 text-turmeric-300" />
                  </div>
                  <div>
                    <h2 className="font-serif font-bold text-stone-900 text-lg">Your Cart</h2>
                    <span className="text-xs text-stone-500">
                      {items.length} {items.length === 1 ? 'item' : 'items'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Free Delivery Banner */}
              <div className="bg-amber-50 px-5 py-3 border-b border-amber-200/60">
                <div className="flex items-center gap-2 text-xs font-semibold text-amber-900">
                  <Truck className="w-4 h-4 text-turmeric-600 shrink-0" />
                  {remainingForFree > 0 ? (
                    <span>
                      Add <strong className="text-heritage-maroon">{formatINR(remainingForFree)}</strong> more to get <strong>FREE Delivery!</strong>
                    </span>
                  ) : (
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      🎉 You unlocked FREE Standard Delivery!
                    </span>
                  )}
                </div>
                <div className="w-full bg-amber-200/70 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-turmeric-500 to-emerald-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${freeDeliveryProgress}%` }}
                  />
                </div>
              </div>

              {/* Cart Items List */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-12">
                    <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center mb-4 text-amber-800">
                      <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
                    </div>
                    <h3 className="font-serif font-bold text-stone-800 text-lg">Your cart is empty</h3>
                    <p className="text-sm text-stone-500 mt-1 max-w-xs">
                      Explore our handcrafted papads, sun-dried sevaya, and pure turmeric spices.
                    </p>
                    <button
                      onClick={() => {
                        setIsCartOpen(false);
                        navigate('/products');
                      }}
                      className="mt-6 bg-heritage-maroon text-cream-100 px-6 py-2.5 rounded-xl font-medium text-sm hover:bg-turmeric-900 transition-colors shadow-md"
                    >
                      Browse Catalogue
                    </button>
                  </div>
                ) : (
                  items.map((item) => (
                    <div
                      key={`${item.productId}-${item.variantId}`}
                      className="bg-white p-3.5 rounded-xl border border-amber-900/10 shadow-sm flex items-center gap-3.5"
                    >
                      <img
                        src={item.imageUrl}
                        alt={item.productName}
                        className="w-16 h-16 rounded-lg object-cover bg-cream-100 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-serif font-bold text-stone-900 text-sm truncate">
                          {item.productName}
                        </h4>
                        <div className="text-xs text-stone-500 mt-0.5">
                          Size: <span className="font-medium text-stone-700">{item.weight}</span>
                        </div>
                        <div className="text-sm font-bold text-heritage-maroon mt-1">
                          {formatINR(item.unitPrice)}
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex flex-col items-end gap-2">
                        <button
                          onClick={() => removeItem(item.productId, item.variantId)}
                          className="text-stone-400 hover:text-red-600 transition-colors p-1"
                          title="Remove Item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <div className="flex items-center border border-stone-200 rounded-lg overflow-hidden bg-stone-50">
                          <button
                            onClick={() =>
                              updateQuantity(item.productId, item.variantId, item.quantity - 1)
                            }
                            className="p-1 text-stone-600 hover:bg-stone-200 transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-semibold text-stone-800">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.productId, item.variantId, item.quantity + 1)
                            }
                            className="p-1 text-stone-600 hover:bg-stone-200 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer / Summary */}
              {items.length > 0 && (
                <div className="p-5 border-t border-amber-900/15 bg-white space-y-4">
                  <div className="space-y-2 text-sm">
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
                    <div className="pt-2 border-t border-stone-100 flex justify-between text-base">
                      <span className="font-serif font-bold text-stone-900">Estimated Total</span>
                      <span className="font-serif font-black text-xl text-heritage-maroon">
                        {formatINR(total)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-stone-500 bg-cream-50 p-2.5 rounded-lg border border-amber-900/10">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Pay securely on delivery (Cash / UPI on Delivery).</span>
                  </div>

                  <button
                    onClick={handleCheckoutClick}
                    className="w-full bg-gradient-to-r from-turmeric-600 to-amber-700 hover:from-turmeric-700 hover:to-amber-800 text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-turmeric-600/25 transition-all transform active:scale-95"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
