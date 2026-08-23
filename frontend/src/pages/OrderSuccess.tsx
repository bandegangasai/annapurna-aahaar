import React from 'react';
import { useLocation, useParams, Link } from 'react-router-dom';
import {
  CheckCircle,
  Clock,
  MapPin,
  Phone,
  ArrowRight,
  ShieldCheck,
  Package,
} from 'lucide-react';
import { SEOHead } from '../components/common/SEOHead';
import { formatINR } from '../utils/formatters';

export const OrderSuccess: React.FC = () => {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const location = useLocation();
  const order = location.state?.order;

  return (
    <div className="bg-[#FAF6EE] min-h-screen py-12 lg:py-20">
      <SEOHead
        title={`Order Confirmed #${orderNumber} | Annapurna Aahaar`}
        description="Your Annapurna Aahaar order has been received and is being prepared with traditional care."
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border-2 border-heritage-gold/40 shadow-xl text-center space-y-6">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-emerald-100 border-2 border-emerald-500 rounded-full flex items-center justify-center mx-auto text-emerald-700 shadow-md animate-bounce">
            <CheckCircle className="w-10 h-10 stroke-[2.5]" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-heritage-antiqueGold uppercase tracking-widest block">
              Order Confirmed
            </span>
            <h1 className="font-serif font-black text-3xl sm:text-4xl text-heritage-maroon">
              Thank You for Ordering from Annapurna Aahaar!
            </h1>
            <p className="text-stone-600 text-sm sm:text-base max-w-md mx-auto">
              Your order has been recorded in our database and will be freshly processed by <strong>Bande Omkar</strong> in Bhainsa, Telangana.
            </p>
          </div>

          {/* Order Details Card */}
          <div className="bg-[#FAF6EE] p-6 rounded-2xl border border-heritage-gold/30 text-left space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-stone-200 pb-3 gap-2">
              <div>
                <span className="text-xs text-stone-500 uppercase font-bold block">Order Number</span>
                <span className="font-mono font-bold text-lg text-heritage-maroon">
                  #{orderNumber}
                </span>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-xs text-stone-500 uppercase font-bold block">Initial Status</span>
                <span className="inline-flex items-center gap-1.5 text-xs font-black bg-amber-100 text-amber-900 px-3 py-1 rounded-full border border-amber-300">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                  {order?.status || 'PENDING'} (Awaiting Admin Review)
                </span>
              </div>
            </div>

            {order && (
              <>
                {/* Customer & Delivery */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="font-bold text-stone-700 block mb-1">Customer:</span>
                    <p className="text-stone-900 font-semibold">{order.customer.name}</p>
                    <p className="text-stone-600">Mobile: {order.customer.phone}</p>
                  </div>
                  <div>
                    <span className="font-bold text-stone-700 block mb-1">Delivery Address:</span>
                    <p className="text-stone-600">
                      {order.customer.address}, {order.customer.city}, {order.customer.state} - {order.customer.pincode}
                    </p>
                  </div>
                </div>

                {/* Payment Breakdown */}
                <div className="pt-3 border-t border-stone-200 flex items-center justify-between text-xs sm:text-sm">
                  <div>
                    <span className="font-bold text-stone-700 block">Payment Method:</span>
                    <span className="text-stone-600 font-medium">
                      {order.paymentMethod === 'ONLINE_RAZORPAY' ? 'Online Payment (Razorpay)' : 'Cash on Delivery (Pay Offline)'}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-stone-700 block">Grand Total:</span>
                    <span className="font-serif font-black text-xl text-heritage-maroon">
                      {formatINR(order.total)}
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Action Links */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to={`/track/${orderNumber}`}
              className="w-full sm:w-auto bg-heritage-maroon hover:bg-heritage-darkMaroon text-cream-100 font-bold px-8 py-3.5 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 border border-heritage-gold/30 text-sm"
            >
              <Clock className="w-4 h-4 text-heritage-gold" />
              <span>Track Live Order Status</span>
            </Link>

            <Link
              to="/products"
              className="w-full sm:w-auto bg-white hover:bg-cream-100 text-stone-800 font-bold px-6 py-3.5 rounded-2xl border border-heritage-gold/30 transition-colors text-sm"
            >
              <span>Continue Shopping</span>
            </Link>
          </div>

          {/* Business Contact Footer Note */}
          <div className="pt-4 border-t border-stone-100 text-xs text-stone-500 space-y-1">
            <div className="font-bold text-heritage-maroon">Annapurna Aahaar — Bhainsa, Telangana (504103)</div>
            <div>Owner: Bande Omkar | Customer Support: 6305970844 / 8688456925</div>
          </div>
        </div>
      </div>
    </div>
  );
};
