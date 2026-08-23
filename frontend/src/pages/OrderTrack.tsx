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
  MapPin,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import { SEOHead } from '../components/common/SEOHead';
import { formatINR, formatDateTime } from '../utils/formatters';
import { api } from '../services/api';
import { Order } from '../types';

export const OrderTrack: React.FC = () => {
  const { orderNumber: paramOrderNumber } = useParams<{ orderNumber?: string }>();
  const navigate = useNavigate();

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
    { key: 'PENDING', label: 'Order Placed', desc: 'Received & queued for review', icon: Clock },
    { key: 'ACCEPTED', label: 'Accepted', desc: 'Accepted by kitchen manager', icon: CheckCircle2 },
    { key: 'PROCESSING', label: 'Processing', desc: 'Fresh grinding & packaging', icon: Package },
    { key: 'READY', label: 'Ready', desc: 'Sealed & ready for courier', icon: Package },
    { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', desc: 'Dispatched to customer address', icon: Truck },
    { key: 'DELIVERED', label: 'Delivered', desc: 'Successfully delivered', icon: CheckCheck },
  ];

  const getStepIndex = (status: string) => {
    if (status === 'REJECTED' || status === 'CANCELLED') return -1;
    return steps.findIndex((s) => s.key === status);
  };

  const currentStepIndex = order ? getStepIndex(order.status) : -1;

  return (
    <div className="bg-[#FAF6EE] min-h-screen py-10 lg:py-16">
      <SEOHead
        title="Live Order Tracking | Annapurna Aahaar"
        description="Track your Annapurna Aahaar food orders in real-time. Direct dispatch from Bhainsa, Nirmal District, Telangana."
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-xs font-bold text-heritage-antiqueGold uppercase tracking-widest block mb-1">
            Real-Time Tracking
          </span>
          <h1 className="font-serif font-black text-3xl sm:text-4xl text-heritage-maroon">
            Track Your Order
          </h1>
          <p className="text-stone-600 text-sm mt-1">
            Enter your order number (e.g., AA-20260823-1234) to view live status.
          </p>
        </div>

        {/* Search Order Bar */}
        <div className="bg-white p-4 sm:p-6 rounded-3xl border border-heritage-gold/30 shadow-md mb-8">
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                placeholder="Enter Order Number (e.g. AA-2026...)"
                value={inputOrderNumber}
                onChange={(e) => setInputOrderNumber(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#FAF6EE] border border-heritage-gold/30 rounded-2xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-heritage-gold text-stone-900"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-heritage-maroon hover:bg-heritage-darkMaroon text-cream-100 px-8 py-3 rounded-2xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 border border-heritage-gold/30"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Searching...</span>
                </>
              ) : (
                <span>Track Order</span>
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
          <div className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-heritage-gold/30 shadow-lg space-y-8">
            {/* Top Status Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-stone-100 pb-6 gap-4">
              <div>
                <span className="text-xs text-stone-500 uppercase font-bold block">Order Number</span>
                <h2 className="font-mono font-black text-2xl text-heritage-maroon">
                  #{order.orderNumber}
                </h2>
                <span className="text-xs text-stone-500">
                  Placed on {formatDateTime(order.createdAt)}
                </span>
              </div>

              <div className="flex flex-col sm:items-end gap-1.5">
                <span className="text-xs text-stone-500 uppercase font-bold">Current Status</span>
                {order.status === 'REJECTED' ? (
                  <span className="inline-flex items-center gap-1 px-4 py-1.5 rounded-full text-xs font-black bg-red-100 text-red-800 border border-red-300">
                    <XCircle className="w-4 h-4" />
                    REJECTED / UNABLE TO FULFILL
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black bg-heritage-maroon text-cream-100 shadow-sm border border-heritage-gold">
                    <span className="w-2 h-2 rounded-full bg-heritage-gold animate-ping" />
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
                  Our team in Bhainsa was unable to accept this order. Any online payments are automatically queued for prompt refund. For enquiries, call 6305970844.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <h3 className="font-serif font-bold text-lg text-stone-900">Delivery Progression</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  {steps.map((step, idx) => {
                    const Icon = step.icon;
                    const isCompleted = idx <= currentStepIndex;
                    const isCurrent = idx === currentStepIndex;

                    return (
                      <div
                        key={step.key}
                        className={`p-3.5 rounded-2xl border transition-all text-center flex flex-col items-center justify-between ${
                          isCurrent
                            ? 'bg-heritage-maroon text-cream-100 border-heritage-gold shadow-md'
                            : isCompleted
                            ? 'bg-cream-100 text-stone-900 border-emerald-400'
                            : 'bg-stone-50 text-stone-400 border-stone-200 opacity-60'
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                            isCurrent
                              ? 'bg-heritage-gold text-heritage-darkMaroon font-black'
                              : isCompleted
                              ? 'bg-emerald-600 text-white'
                              : 'bg-stone-200 text-stone-500'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="font-bold text-xs block">{step.label}</span>
                        <span className="text-[10px] mt-1 line-clamp-2">{step.desc}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Line Items & Shipping Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-stone-100">
              {/* Items Card */}
              <div className="bg-[#FAF6EE] p-5 rounded-2xl border border-heritage-gold/25 space-y-3">
                <h4 className="font-serif font-bold text-stone-900 text-sm border-b border-stone-200 pb-2">
                  Items Ordered
                </h4>
                <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center text-xs">
                      <div>
                        <span className="font-bold text-stone-900">{item.productName}</span>
                        <span className="text-stone-500 block">
                          {item.variantName} × {item.quantity}
                        </span>
                      </div>
                      <span className="font-bold text-stone-800">
                        {formatINR(item.totalPrice)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="pt-2 border-t border-stone-200 flex justify-between font-serif font-black text-base text-heritage-maroon">
                  <span>Grand Total:</span>
                  <span>{formatINR(order.total)}</span>
                </div>
              </div>

              {/* Shipping & Payment Card */}
              <div className="bg-[#FAF6EE] p-5 rounded-2xl border border-heritage-gold/25 space-y-3 text-xs">
                <h4 className="font-serif font-bold text-stone-900 text-sm border-b border-stone-200 pb-2">
                  Delivery & Payment
                </h4>
                <div>
                  <span className="font-bold text-stone-700 block">Recipient:</span>
                  <p className="text-stone-900 font-semibold">{order.customer.name}</p>
                  <p className="text-stone-600">Mobile: {order.customer.phone}</p>
                </div>
                <div>
                  <span className="font-bold text-stone-700 block">Delivery Address:</span>
                  <p className="text-stone-600">
                    {order.customer.address}, {order.customer.city}, {order.customer.state} - {order.customer.pincode}
                  </p>
                </div>
                <div className="pt-2 border-t border-stone-200 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-stone-700 block">Payment Method:</span>
                    <span className="text-stone-600">
                      {order.paymentMethod === 'ONLINE_RAZORPAY' ? 'Online (Razorpay)' : 'Cash on Delivery'}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-stone-700 block">Payment Status:</span>
                    <span
                      className={`font-black px-2.5 py-0.5 rounded-full text-[10px] ${
                        order.paymentStatus === 'PAID'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-900'
                      }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
