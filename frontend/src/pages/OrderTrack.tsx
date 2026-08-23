import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Search,
  CheckCircle2,
  Clock,
  Package,
  Truck,
  CheckCheck,
  XCircle,
  Phone,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import { SEOHead } from '../components/common/SEOHead';
import { formatINR, formatDateTime } from '../utils/formatters';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';
import { Order } from '../types';

export const OrderTrack: React.FC = () => {
  const { orderNumber: paramOrderNumber } = useParams<{ orderNumber?: string }>();
  const navigate = useNavigate();
  const { t, getLocalizedProduct } = useLanguage();

  const [inputOrderNumber, setInputOrderNumber] = useState(paramOrderNumber || '');
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchOrder = async (num: string) => {
    if (!num.trim()) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.getOrderByNumber(num.trim());
      if (res.success && res.data) {
        setOrder(res.data);
        setLastUpdated(new Date());
      } else {
        setError(res.message || 'Order not found');
      }
    } catch (err: any) {
      setError(err.message || 'Could not find order. Please verify your order number.');
      setOrder(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (paramOrderNumber) {
      setInputOrderNumber(paramOrderNumber);
      fetchOrder(paramOrderNumber);
    }
  }, [paramOrderNumber]);

  // Real-time polling every 8 seconds if order is active
  useEffect(() => {
    if (!order || ['DELIVERED', 'REJECTED', 'CANCELLED'].includes(order.status)) {
      return;
    }

    const interval = setInterval(() => {
      fetchOrder(order.orderNumber);
    }, 8000);

    return () => clearInterval(interval);
  }, [order?.orderNumber, order?.status]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputOrderNumber.trim()) {
      navigate(`/track/${encodeURIComponent(inputOrderNumber.trim())}`);
      fetchOrder(inputOrderNumber.trim());
    }
  };

  const steps = [
    { key: 'PENDING', label: 'Order Placed', desc: 'Order received & queued', icon: Clock },
    { key: 'ACCEPTED', label: 'Accepted', desc: 'Accepted by kitchen', icon: CheckCircle2 },
    { key: 'PROCESSING', label: 'Processing', desc: 'Fresh packaging', icon: Package },
    { key: 'READY', label: 'Ready', desc: 'Sealed & ready for courier', icon: Package },
    { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', desc: 'Dispatched to customer', icon: Truck },
    { key: 'DELIVERED', label: 'Delivered', desc: 'Delivered successfully', icon: CheckCheck },
  ];

  const getStepIndex = (status: string) => {
    if (status === 'REJECTED' || status === 'CANCELLED') return -1;
    return steps.findIndex((s) => s.key === status);
  };

  const currentStepIndex = order ? getStepIndex(order.status) : -1;

  return (
    <div className="bg-[#F8F3E7] min-h-screen py-10 lg:py-16 text-[#252525]">
      <SEOHead
        title="Live Order Tracking | Annapurna Aahaar"
        description="Track your Annapurna Aahaar food orders in real-time. Direct dispatch from Bhainsa, Nirmal District, Telangana (504103)."
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-xs font-bold text-[#C79A45] uppercase tracking-widest block mb-1">
            Real-Time Tracking
          </span>
          <h1 className="font-serif font-black text-3xl sm:text-4xl text-[#173F35]">
            {t('track_title')}
          </h1>
          <p className="text-stone-muted text-sm mt-1">
            {t('track_subtitle')}
          </p>
        </div>

        {/* Search Order Bar */}
        <div className="bg-white p-4 sm:p-6 rounded-3xl border border-[#C79A45]/30 shadow-subtle mb-8">
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                placeholder={t('track_input_placeholder')}
                value={inputOrderNumber}
                onChange={(e) => setInputOrderNumber(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#FAF6EE] border border-[#C79A45]/30 rounded-2xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#C79A45] text-stone-primary"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-[#173F35] hover:bg-[#0C241E] text-[#F8F3E7] px-8 py-3 rounded-2xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 border border-[#C79A45]/40"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Searching...</span>
                </>
              ) : (
                <span>{t('track_btn')}</span>
              )}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs font-semibold text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Order Details & Timeline */}
        {order && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-[#C79A45]/40 shadow-card-lift space-y-8">
            {/* Top Status Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-stone-100 pb-6 gap-4">
              <div>
                <span className="text-xs text-stone-muted uppercase font-bold block">{t('success_order_number')}</span>
                <h2 className="font-mono font-black text-2xl text-[#173F35]">
                  #{order.orderNumber}
                </h2>
                <span className="text-xs text-stone-muted">
                  Placed on {formatDateTime(order.createdAt)}
                </span>
              </div>

              <div className="flex flex-col sm:items-end gap-1.5">
                <span className="text-xs text-stone-muted uppercase font-bold">Status</span>
                {order.status === 'REJECTED' ? (
                  <span className="inline-flex items-center gap-1 px-4 py-1.5 rounded-full text-xs font-black bg-red-100 text-red-800 border border-red-300">
                    <XCircle className="w-4 h-4" />
                    {t('track_status_rejected')}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black bg-[#173F35] text-[#F8F3E7] shadow-xs border border-[#C79A45]">
                    <span className="w-2 h-2 rounded-full bg-[#C79A45] animate-ping" />
                    {order.status}
                  </span>
                )}
                {lastUpdated && (
                  <span className="text-[10px] text-stone-400">
                    Live auto-synced {lastUpdated.toLocaleTimeString()}
                  </span>
                )}
              </div>
            </div>

            {/* Timeline Progress */}
            {order.status === 'REJECTED' ? (
              <div className="p-6 bg-red-50 border border-red-200 rounded-2xl text-center space-y-2">
                <XCircle className="w-10 h-10 text-red-600 mx-auto" />
                <h3 className="font-serif font-bold text-lg text-red-900">Order Could Not Be Accepted</h3>
                <p className="text-xs text-red-700 max-w-md mx-auto">
                  Our team in Bhainsa was unable to accept this order. For assistance, call 9347036152 or 6305970844.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <h3 className="font-serif font-bold text-lg text-stone-primary">Delivery Progression</h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  {steps.map((step, idx) => {
                    const isPassed = currentStepIndex >= idx;
                    const isCurrent = currentStepIndex === idx;
                    const Icon = step.icon;

                    return (
                      <div
                        key={step.key}
                        className={`p-3.5 rounded-2xl border transition-all text-center flex flex-col items-center justify-between gap-2 ${
                          isCurrent
                            ? 'bg-[#173F35] text-[#F8F3E7] border-[#C79A45] shadow-md'
                            : isPassed
                            ? 'bg-[#FAF6EE] text-[#173F35] border-[#C79A45]/40'
                            : 'bg-stone-50 text-stone-400 border-stone-200'
                        }`}
                      >
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center ${
                            isCurrent
                              ? 'bg-[#C79A45] text-[#173F35]'
                              : isPassed
                              ? 'bg-[#173F35] text-[#C79A45]'
                              : 'bg-stone-200 text-stone-400'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-serif font-bold text-xs">{step.label}</div>
                          <div className="text-[10px] mt-0.5 opacity-80">{step.desc}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Order Items & Customer Snapshot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-stone-100">
              <div className="space-y-3">
                <h4 className="font-serif font-bold text-base text-stone-primary">{t('track_items_ordered')}</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {order.items?.map((item, i) => {
                    const localized = getLocalizedProduct(item.productId, item.productName, '');
                    return (
                      <div
                        key={i}
                        className="flex justify-between items-center bg-[#FAF6EE] p-2.5 rounded-xl text-xs border border-[#C79A45]/20"
                      >
                        <div>
                          <span className="font-bold text-stone-primary block">{localized.name}</span>
                          <span className="text-[11px] text-stone-muted">
                            {item.weight || item.variantName} × {item.quantity}
                          </span>
                        </div>
                        <span className="font-mono font-bold text-stone-primary">
                          {formatINR(item.totalPrice || item.unitPrice * item.quantity)}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-between text-sm font-bold text-stone-primary pt-2 border-t border-stone-100">
                  <span>{t('cart_total')}</span>
                  <span className="text-[#173F35] font-serif font-black text-base">{formatINR(order.total)}</span>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-serif font-bold text-base text-stone-primary">{t('track_customer_info')}</h4>
                <div className="bg-[#FAF6EE] p-4 rounded-2xl border border-[#C79A45]/20 text-xs space-y-1.5 text-stone-muted">
                  <div className="font-bold text-stone-primary">{order.customer?.name}</div>
                  <div>Phone: {order.customer?.phone}</div>
                  <div className="pt-1">
                    {order.deliveryAddress || order.customer?.address}, {order.city || order.customer?.city}, {order.district || order.customer?.district}, {order.state || order.customer?.state} - {order.pincode || order.customer?.pincode}
                  </div>
                </div>
              </div>
            </div>

            {/* Helpline Footer */}
            <div className="p-4 bg-[#FAF6EE] rounded-2xl border border-[#C79A45]/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <span className="text-stone-muted">
                Need to speak with our kitchen staff in Bhainsa?
              </span>
              <a
                href="tel:9347036152"
                className="inline-flex items-center gap-1.5 font-bold text-[#173F35] bg-white px-3.5 py-1.5 rounded-xl border border-[#C79A45]/40 shadow-xs hover:bg-[#F8F3E7]"
              >
                <Phone className="w-3.5 h-3.5 text-[#C79A45]" />
                <span>Call Hotline: 9347036152</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTrack;
