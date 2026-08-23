import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Clock,
  CheckCircle2,
  Package,
  Truck,
  Home as HomeIcon,
  XCircle,
  RefreshCw,
  Search,
  MapPin,
  Phone,
  ShieldCheck,
  ArrowLeft,
  AlertCircle,
} from 'lucide-react';
import { api } from '../services/api';
import { Order } from '../types';
import { formatINR, formatDate, STATUS_CONFIG } from '../utils/formatters';
import { SEOHead } from '../components/common/SEOHead';

const TIMELINE_STEPS = [
  { key: 'PENDING', label: 'Order Placed', icon: Clock, desc: 'Received & queued for review' },
  { key: 'ACCEPTED', label: 'Order Accepted', icon: CheckCircle2, desc: 'Confirmed by kitchen/mill' },
  { key: 'PROCESSING', label: 'Processing', icon: Package, desc: 'Fresh milling & sealed packaging' },
  { key: 'READY', label: 'Ready for Dispatch', icon: ShieldCheck, desc: 'Quality verified & packed' },
  { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', icon: Truck, desc: 'On route with delivery vehicle' },
  { key: 'DELIVERED', label: 'Delivered', icon: HomeIcon, desc: 'Safely arrived at destination' },
];

export const OrderTrack: React.FC = () => {
  const { orderNumber: paramOrderNumber } = useParams<{ orderNumber?: string }>();
  const navigate = useNavigate();

  const [searchNumber, setSearchNumber] = useState(paramOrderNumber || '');
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchOrder = useCallback(async (num: string) => {
    if (!num.trim()) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.getOrderByNumber(num.trim());
      if (res.success && res.data) {
        setOrder(res.data);
      } else {
        setError('Order not found. Please check your order reference number.');
        setOrder(null);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to locate order.');
      setOrder(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (paramOrderNumber) {
      setSearchNumber(paramOrderNumber);
      fetchOrder(paramOrderNumber);
    }
  }, [paramOrderNumber, fetchOrder]);

  // Auto-polling every 10 seconds for real-time status updates
  useEffect(() => {
    if (!autoRefresh || !order || order.status === 'DELIVERED' || order.status === 'REJECTED' || order.status === 'CANCELLED') {
      return;
    }

    const interval = setInterval(() => {
      if (order.orderNumber) {
        fetchOrder(order.orderNumber);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [autoRefresh, order, fetchOrder]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchNumber.trim()) {
      navigate(`/track/${searchNumber.trim()}`);
    }
  };

  const getStepIndex = (status: string): number => {
    return TIMELINE_STEPS.findIndex((s) => s.key === status);
  };

  const currentStepIndex = order ? getStepIndex(order.status) : -1;
  const isRejected = order?.status === 'REJECTED';
  const isCancelled = order?.status === 'CANCELLED';

  return (
    <div className="bg-[#FCF9F2] min-h-screen py-10 lg:py-14">
      <SEOHead
        title="Live Order Tracking | Annapurna Aahaar"
        description="Track your Annapurna Aahaar order in real-time."
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header and Lookup Box */}
        <div className="text-center space-y-3">
          <Link
            to="/products"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-heritage-maroon transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Products</span>
          </Link>
          <h1 className="font-serif font-black text-3xl sm:text-4xl text-heritage-maroon">
            Live Order Tracking
          </h1>
          <p className="text-stone-600 text-sm max-w-md mx-auto">
            Check the real-time preparation, approval, and delivery status of your package.
          </p>

          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="max-w-md mx-auto mt-4 flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                placeholder="Enter Order Number (e.g. AA-2026-XXXX)"
                value={searchNumber}
                onChange={(e) => setSearchNumber(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-amber-900/15 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-turmeric-500 text-stone-900 font-medium placeholder-stone-400"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-heritage-maroon hover:bg-turmeric-900 text-cream-100 px-6 py-3 rounded-xl font-bold text-sm shadow-md transition-colors shrink-0 disabled:opacity-50"
            >
              {isLoading ? 'Searching...' : 'Track'}
            </button>
          </form>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 p-4 rounded-2xl text-sm text-red-800 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Order Details & Timeline Card */}
        {order && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-900/10 shadow-lg space-y-8 animate-fadeIn">
            {/* Top Bar: Order ID, Live Status, Refresh */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-5">
              <div>
                <span className="text-xs text-stone-500 font-medium block">Order Number</span>
                <span className="font-serif font-black text-2xl text-heritage-maroon">
                  {order.orderNumber}
                </span>
                <span className="text-xs text-stone-400 block mt-0.5">
                  Placed on {formatDate(order.createdAt)}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div
                  className={`px-4 py-2 rounded-xl text-xs font-bold border flex items-center gap-1.5 ${
                    STATUS_CONFIG[order.status]?.bg || 'bg-stone-100'
                  } ${STATUS_CONFIG[order.status]?.text || 'text-stone-800'} ${
                    STATUS_CONFIG[order.status]?.border || 'border-stone-200'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-current animate-ping" />
                  <span>{STATUS_CONFIG[order.status]?.label || order.status}</span>
                </div>

                <button
                  onClick={() => fetchOrder(order.orderNumber)}
                  disabled={isLoading}
                  className="p-2.5 rounded-xl bg-cream-100 text-stone-700 hover:bg-cream-200 transition-colors border border-amber-900/10"
                  title="Refresh status now"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>

            {/* Status Description Banner */}
            <div className={`p-4 rounded-2xl border text-sm ${
              isRejected
                ? 'bg-red-50 border-red-200 text-red-900'
                : isCancelled
                ? 'bg-stone-50 border-stone-200 text-stone-800'
                : 'bg-amber-50/70 border-amber-200/80 text-amber-950'
            }`}>
              <div className="font-semibold mb-0.5">
                {isRejected
                  ? 'Order Rejected by Administration'
                  : isCancelled
                  ? 'Order Cancelled'
                  : 'Current Status Overview'}
              </div>
              <p className="text-xs sm:text-sm leading-relaxed opacity-90">
                {STATUS_CONFIG[order.status]?.desc || 'Status in progress.'}
              </p>
            </div>

            {/* Visual Timeline (if not rejected) */}
            {!isRejected && !isCancelled && (
              <div className="space-y-6">
                <h3 className="font-serif font-bold text-lg text-stone-900">
                  Fulfillment Progress
                </h3>

                <div className="relative">
                  {/* Step Progress Line */}
                  <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                    {TIMELINE_STEPS.map((step, idx) => {
                      const Icon = step.icon;
                      const isCompleted = idx <= currentStepIndex;
                      const isCurrent = idx === currentStepIndex;

                      return (
                        <div
                          key={step.key}
                          className={`flex flex-col items-center text-center p-3 rounded-2xl transition-all ${
                            isCurrent
                              ? 'bg-amber-100/70 border-2 border-turmeric-600 shadow-sm'
                              : isCompleted
                              ? 'bg-emerald-50/60 border border-emerald-200'
                              : 'bg-cream-50/50 border border-stone-200/60 opacity-60'
                          }`}
                        >
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 shadow-sm ${
                              isCurrent
                                ? 'bg-turmeric-600 text-white animate-pulse'
                                : isCompleted
                                ? 'bg-emerald-600 text-white'
                                : 'bg-stone-200 text-stone-500'
                            }`}
                          >
                            <Icon className="w-5 h-5" />
                          </div>
                          <span className="font-serif font-bold text-xs text-stone-900 block leading-tight">
                            {step.label}
                          </span>
                          <span className="text-[10px] text-stone-500 mt-1 leading-snug hidden sm:block">
                            {step.desc}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Order Items & Customer Delivery Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-stone-100">
              {/* Items Card */}
              <div className="bg-[#FAF5EC] p-5 rounded-2xl border border-amber-900/10 space-y-3">
                <h4 className="font-serif font-bold text-stone-900 text-sm border-b border-amber-900/10 pb-2">
                  Items in Package ({order.items.length})
                </h4>
                <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center text-xs">
                      <div>
                        <strong className="text-stone-900 block">{item.productName}</strong>
                        <span className="text-stone-500">{item.variantName} × {item.quantity}</span>
                      </div>
                      <span className="font-serif font-bold text-heritage-maroon">
                        {formatINR(item.totalPrice)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-amber-900/10 pt-3 space-y-1 text-xs">
                  <div className="flex justify-between text-stone-600">
                    <span>Subtotal:</span>
                    <span>{formatINR(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>Delivery Charges:</span>
                    <span>{order.deliveryFee === 0 ? 'FREE' : formatINR(order.deliveryFee)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-stone-900 text-sm pt-1 border-t border-amber-900/10">
                    <span>Grand Total:</span>
                    <span className="text-heritage-maroon">{formatINR(order.total)}</span>
                  </div>
                </div>
              </div>

              {/* Customer & Shipping Details */}
              <div className="bg-[#FAF5EC] p-5 rounded-2xl border border-amber-900/10 space-y-3">
                <h4 className="font-serif font-bold text-stone-900 text-sm border-b border-amber-900/10 pb-2">
                  Delivery Destination
                </h4>
                <div className="space-y-2 text-xs text-stone-700">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-stone-900">Recipient:</span>
                    <span>{order.customer.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-turmeric-700 shrink-0" />
                    <span>+91 {order.customer.phone}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-turmeric-700 shrink-0 mt-0.5" />
                    <span>
                      {order.customer.address}, {order.customer.city}, {order.customer.state} - {order.customer.pincode}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-amber-900/10">
                    <span className="font-bold text-stone-900 block mb-0.5">Payment Terms:</span>
                    <span className="text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded font-semibold text-[11px]">
                      Cash / UPI on Delivery
                    </span>
                  </div>
                  {order.notes && (
                    <div className="text-stone-500 italic text-[11px]">
                      Note: "{order.notes}"
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
