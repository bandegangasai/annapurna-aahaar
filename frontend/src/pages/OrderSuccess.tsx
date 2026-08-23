import React, { useEffect } from 'react';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  ArrowRight,
  ShoppingBag,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { formatINR, formatDate, STATUS_CONFIG } from '../utils/formatters';
import { SEOHead } from '../components/common/SEOHead';

export const OrderSuccess: React.FC = () => {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  const order = (location.state as any)?.order;

  useEffect(() => {
    // Fire festive celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D97706', '#F59E0B', '#78350F', '#10B981', '#FDE68A'],
      });
    } catch (e) {
      console.warn('Confetti effect unavailable:', e);
    }
  }, []);

  return (
    <div className="bg-[#FCF9F2] min-h-screen py-12 lg:py-16">
      <SEOHead
        title="Order Placed Successfully | Annapurna Aahaar"
        description="Your Annapurna Aahaar order has been received."
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-amber-900/10 shadow-xl text-center space-y-6">
          {/* Animated Success Badge */}
          <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner animate-bounce">
            <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-turmeric-700 uppercase tracking-widest bg-turmeric-100/60 px-3 py-1 rounded-full">
              Order Received
            </span>
            <h1 className="font-serif font-black text-3xl sm:text-4xl text-heritage-maroon">
              Order Successfully Placed!
            </h1>
            <p className="text-stone-600 text-sm sm:text-base max-w-md mx-auto">
              Thank you for trusting Annapurna Aahaar. Your order has been placed in our kitchen queue for approval and fresh batch packaging.
            </p>
          </div>

          {/* Order ID Highlight Card */}
          <div className="bg-cream-50 p-4 sm:p-5 rounded-2xl border border-amber-900/15 flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
            <div>
              <span className="text-xs text-stone-500 font-medium block uppercase">
                Your Order Reference Number
              </span>
              <strong className="font-serif text-xl sm:text-2xl text-heritage-maroon tracking-wide">
                {orderNumber}
              </strong>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                PENDING APPROVAL
              </span>
            </div>
          </div>

          {/* Order Snapshot if available */}
          {order && (
            <div className="text-left bg-[#FCF9F2] p-5 rounded-2xl border border-amber-900/10 space-y-4">
              <h3 className="font-serif font-bold text-stone-900 text-base border-b border-amber-900/10 pb-2">
                Order Summary
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-stone-700">
                <div>
                  <span className="font-semibold text-stone-900 block">Customer Name:</span>
                  <span>{order.customer?.name}</span>
                </div>
                <div>
                  <span className="font-semibold text-stone-900 block">Contact Phone:</span>
                  <span>+91 {order.customer?.phone}</span>
                </div>
                <div className="sm:col-span-2">
                  <span className="font-semibold text-stone-900 block">Delivery Address:</span>
                  <span>
                    {order.customer?.address}, {order.customer?.city}, {order.customer?.state} - {order.customer?.pincode}
                  </span>
                </div>
                <div>
                  <span className="font-semibold text-stone-900 block">Payment Mode:</span>
                  <span>Cash / UPI on Delivery</span>
                </div>
                <div>
                  <span className="font-semibold text-stone-900 block">Total Amount:</span>
                  <span className="font-bold text-heritage-maroon text-base">
                    {formatINR(order.total)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Action CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to={`/track/${orderNumber}`}
              className="bg-gradient-to-r from-turmeric-600 to-amber-700 hover:from-turmeric-700 hover:to-amber-800 text-white px-7 py-3.5 rounded-xl font-bold text-sm sm:text-base shadow-lg shadow-turmeric-600/25 transition-all flex items-center justify-center gap-2"
            >
              <Clock className="w-4 h-4" />
              <span>Track Order Timeline</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/products"
              className="bg-white hover:bg-cream-100 text-heritage-maroon border border-amber-900/20 px-6 py-3.5 rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Continue Shopping</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
