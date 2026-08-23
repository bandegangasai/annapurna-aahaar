import React from 'react';
import { useLocation, useParams, Link } from 'react-router-dom';
import {
  CheckCircle,
  Clock,
  Phone,
  ArrowRight,
  ShieldCheck,
  Package,
} from 'lucide-react';
import { SEOHead } from '../components/common/SEOHead';
import { formatINR } from '../utils/formatters';
import { useLanguage } from '../context/LanguageContext';

export const OrderSuccess: React.FC = () => {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const location = useLocation();
  const order = location.state?.order;
  const { t } = useLanguage();

  return (
    <div className="bg-[#F8F3E7] min-h-screen py-12 lg:py-20 text-[#252525]">
      <SEOHead
        title={`Order Confirmed #${orderNumber} | Annapurna Aahaar`}
        description="Your Annapurna Aahaar order has been received and is being prepared with traditional care."
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border-2 border-[#C79A45]/40 shadow-card-lift text-center space-y-6">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-emerald-100 border-2 border-emerald-600 rounded-3xl flex items-center justify-center mx-auto text-emerald-800 shadow-md animate-bounce">
            <CheckCircle className="w-10 h-10 stroke-[2.5]" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-[#C79A45] uppercase tracking-widest block">
              Order Confirmed
            </span>
            <h1 className="font-serif font-black text-3xl sm:text-4xl text-[#173F35]">
              {t('success_title')}
            </h1>
            <p className="text-stone-muted text-sm sm:text-base max-w-md mx-auto">
              {t('success_subtitle')}
            </p>
          </div>

          {/* Order Details Card */}
          <div className="bg-[#FAF6EE] p-6 rounded-2xl border border-[#C79A45]/30 text-left space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-stone-200 pb-3 gap-2">
              <div>
                <span className="text-xs text-stone-muted uppercase font-bold block">{t('success_order_number')}</span>
                <span className="font-mono font-bold text-lg text-[#173F35]">
                  #{orderNumber}
                </span>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-xs text-stone-muted uppercase font-bold block">Status</span>
                <span className="inline-flex items-center gap-1.5 text-xs font-black bg-amber-100 text-amber-900 px-3 py-1 rounded-full border border-amber-300">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                  {order?.status || 'PENDING'}
                </span>
              </div>
            </div>

            {order && (
              <>
                {/* Customer & Delivery */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="font-bold text-stone-primary block mb-1">Customer:</span>
                    <p className="text-stone-primary font-semibold">{order.customer?.name}</p>
                    <p className="text-stone-muted">Mobile: {order.customer?.phone}</p>
                  </div>
                  <div>
                    <span className="font-bold text-stone-primary block mb-1">Delivery Address:</span>
                    <p className="text-stone-muted">
                      {order.deliveryAddress || order.customer?.address}, {order.city || order.customer?.city}, {order.state || order.customer?.state} - {order.pincode || order.customer?.pincode}
                    </p>
                  </div>
                </div>

                {/* Payment Breakdown */}
                <div className="pt-3 border-t border-stone-200 flex items-center justify-between text-xs sm:text-sm">
                  <div>
                    <span className="font-bold text-stone-primary block">{t('success_payment')}</span>
                    <span className="text-stone-muted font-medium">
                      {order.paymentMethod === 'ONLINE' ? 'Online Payment (Razorpay)' : 'Cash on Delivery (Pay Offline)'}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-stone-primary block">{t('success_total')}</span>
                    <span className="font-serif font-black text-xl text-[#173F35]">
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
              className="w-full sm:w-auto bg-[#173F35] hover:bg-[#0C241E] text-[#F8F3E7] font-bold px-8 py-3.5 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 border border-[#C79A45]/30 text-sm"
            >
              <Clock className="w-4 h-4 text-[#C79A45]" />
              <span>{t('success_btn_track')}</span>
            </Link>

            <Link
              to="/products"
              className="w-full sm:w-auto bg-white hover:bg-[#FAF6EE] text-stone-primary font-bold px-6 py-3.5 rounded-2xl border border-[#C79A45]/30 transition-colors text-sm"
            >
              <span>{t('success_btn_home')}</span>
            </Link>
          </div>

          {/* Business Contact Footer Note */}
          <div className="pt-4 border-t border-stone-100 text-xs text-stone-muted space-y-1">
            <div className="font-bold text-[#173F35]">Annapurna Aahaar — Bhainsa, Nirmal District, Telangana (504103)</div>
            <div>Owner: Bande Omkar | Customer Support: 6305970844 / 8688456925 | IVR Hotline: 9347036152</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
