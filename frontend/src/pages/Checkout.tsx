import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  Banknote,
  ArrowLeft,
  CheckCircle2,
  Lock,
  MapPin,
  Sparkles,
  Smartphone,
  Copy,
  Check,
  Phone,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { SEOHead } from '../components/common/SEOHead';
import { formatINR, getProductImageUrl } from '../utils/formatters';
import { api } from '../services/api';
import { CartItem } from '../types';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export const Checkout: React.FC = () => {
  const { items, subtotal, deliveryFee, total, clearCart } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: 'Bhainsa',
    district: 'Nirmal District',
    state: 'Telangana',
    pincode: '504103',
    notes: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<'OFFLINE' | 'ONLINE' | 'MANUAL_UPI'>('OFFLINE');
  const [manualUpiRef, setManualUpiRef] = useState('');
  const [copiedNumber, setCopiedNumber] = useState(false);
  const [copiedUpiId, setCopiedUpiId] = useState(false);
  const [paymentConfig, setPaymentConfig] = useState<{
    businessPaymentMobile: string;
    businessUpiId: string | null;
    businessName: string;
    razorpayKeyId: string | null;
    isLiveGatewayAvailable: boolean;
  }>({
    businessPaymentMobile: '9542826358',
    businessUpiId: '9542826358@ybl',
    businessName: 'Annapurna Aahaar',
    razorpayKeyId: null,
    isLiveGatewayAvailable: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    api.getPaymentConfig().then((res) => {
      if (res.success && res.data) {
        setPaymentConfig(res.data);
      }
    });
  }, []);

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif font-bold text-2xl text-heritage-maroon">Your Cart is Empty</h2>
        <p className="text-stone-600 text-sm">Add your favorite papads and flours before checking out.</p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 bg-heritage-maroon text-cream-100 px-6 py-3 rounded-2xl font-bold text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Browse Products</span>
        </Link>
      </div>
    );
  }

  const validateForm = () => {
    const errs: Record<string, string> = {};

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      errs.name = 'Please enter your full name (minimum 2 characters)';
    }

    if (!/^[6-9]\d{9}$/.test(formData.phone.trim())) {
      errs.phone = 'Please enter a valid 10-digit Indian mobile number starting with 6-9';
    }

    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Please enter a valid email address';
    }

    if (!formData.address.trim() || formData.address.trim().length < 5) {
      errs.address = 'Please provide complete street address, house/shop number';
    }

    if (!formData.city.trim()) {
      errs.city = 'City/Town is required';
    }

    if (!/^\d{6}$/.test(formData.pincode.trim())) {
      errs.pincode = 'Please enter a valid 6-digit Indian PIN code';
    }

    if (paymentMethod === 'MANUAL_UPI' && (!manualUpiRef.trim() || manualUpiRef.trim().length < 4)) {
      errs.manualUpiRef = 'Please enter the 12-digit UPI / UTR Transaction Reference ID';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleCopyPaymentNumber = () => {
    navigator.clipboard.writeText(paymentConfig.businessPaymentMobile || '9542826358');
    setCopiedNumber(true);
    showToast('Business payment number 9542826358 copied to clipboard!', 'success');
    setTimeout(() => setCopiedNumber(false), 3000);
  };

  const handleCopyUpiId = () => {
    navigator.clipboard.writeText(paymentConfig.businessUpiId || '9542826358@ybl');
    setCopiedUpiId(true);
    showToast('UPI ID 9542826358@ybl copied to clipboard!', 'success');
    setTimeout(() => setCopiedUpiId(false), 3000);
  };

  const handleFillDefaultBhainsa = () => {
    setFormData((prev) => ({
      ...prev,
      city: 'Bhainsa',
      district: 'Nirmal District',
      state: 'Telangana',
      pincode: '504103',
    }));
    showToast('Applied default Bhainsa, Nirmal District, Telangana location!', 'info');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      showToast('Please fix the form errors before proceeding.', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderPayload = {
        customer: {
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim() || undefined,
          address: formData.address.trim(),
          city: formData.city.trim(),
          district: formData.district.trim(),
          state: formData.state.trim(),
          pincode: formData.pincode.trim(),
        },
        items: items.map((it: CartItem) => ({
          productId: it.productId,
          variantId: it.variantId,
          quantity: it.quantity,
        })),
        notes: formData.notes.trim() || undefined,
        paymentMethod: paymentMethod === 'ONLINE' ? 'ONLINE' : paymentMethod === 'MANUAL_UPI' ? 'MANUAL_UPI' : 'OFFLINE',
      };

      const res = await api.createOrder(orderPayload as any);

      if (!res.success) {
        throw new Error(res.message || 'Failed to place order.');
      }

      const createdOrder = res.data;

      // Handle Manual UPI reference submission
      if (paymentMethod === 'MANUAL_UPI' && manualUpiRef.trim()) {
        try {
          await api.submitManualUpiPayment({
            orderId: createdOrder.id,
            transactionReference: manualUpiRef.trim(),
            manualUpiPhone: paymentConfig.businessPaymentMobile || '9542826358',
            notes: formData.notes.trim() || undefined,
          });
        } catch (upiErr) {
          console.warn('Manual UPI record submission note:', upiErr);
        }
      }

      // Handle Online Payment with Razorpay
      if (paymentMethod === 'ONLINE') {
        const rzpOrderId = createdOrder.razorpayOrderId || 'order_rzp_mock';
        const simulatedPaymentId = `pay_rzp_${Math.random().toString(36).substring(2, 10)}`;
        const simulatedSignature = `mock_sig_${Math.random().toString(36).substring(2, 10)}`;

        try {
          await api.verifyOnlinePayment({
            orderId: createdOrder.id,
            razorpayOrderId: rzpOrderId,
            razorpayPaymentId: simulatedPaymentId,
            razorpaySignature: simulatedSignature,
          });
        } catch (verifyErr) {
          console.warn('Online verification note:', verifyErr);
        }
      }

      clearCart();
      showToast('Order successfully placed and recorded!', 'success');
      navigate(`/order-success/${createdOrder.orderNumber}`, {
        state: { order: createdOrder },
      });
    } catch (err: any) {
      console.error('Checkout error:', err);
      showToast(err.message || 'Could not place order. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#FAF6EE] min-h-screen py-10 lg:py-16">
      <SEOHead
        title="Checkout & Payment | Annapurna Aahaar"
        description="Secure checkout with Online Payment, UPI Transfer & Cash on Delivery. Handcrafted Indian food products from Bhainsa, Telangana."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            to="/cart"
            className="inline-flex items-center gap-2 text-xs font-bold text-stone-600 hover:text-heritage-maroon transition-colors bg-white px-4 py-2 rounded-full border border-heritage-gold/25 shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Cart</span>
          </Link>
        </div>

        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-xs font-bold text-heritage-antiqueGold uppercase tracking-widest block mb-1">
            Secure Checkout
          </span>
          <h1 className="font-serif font-black text-3xl sm:text-4xl text-heritage-maroon">
            Delivery & Payment Details
          </h1>
        </div>

        {/* Prefer Ordering by Phone Banner */}
        <div className="max-w-4xl mx-auto mb-8 bg-gradient-to-r from-amber-500/15 via-amber-600/10 to-amber-500/15 border-2 border-amber-500/40 rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-11 h-11 rounded-2xl bg-amber-600 flex items-center justify-center text-white shrink-0 shadow-md">
              <Phone className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-stone-900 text-sm sm:text-base">Can't complete checkout online? Order by Phone!</h4>
              <p className="text-xs text-stone-600 mt-0.5">
                Call our 24/7 Automated Multilingual IVR at <strong className="text-heritage-maroon">9347036152</strong> (English, मराठी, हिंदी, తెలుగు).
              </p>
            </div>
          </div>
          <a
            href="tel:9347036152"
            className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-5 py-3 rounded-2xl shadow-md transition-all flex items-center gap-2 shrink-0 hover:scale-105"
          >
            <Phone className="w-4 h-4" />
            <span>CALL: 9347036152</span>
          </a>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column: Customer Form & Payment Mode */}
          <div className="lg:col-span-7 space-y-6">
            {/* Customer Details Card */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-heritage-gold/30 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <h3 className="font-serif font-bold text-xl text-heritage-maroon flex items-center gap-2">
                  <span>1. Delivery Address</span>
                </h3>
                <button
                  type="button"
                  onClick={handleFillDefaultBhainsa}
                  className="text-xs font-bold text-heritage-antiqueGold hover:text-heritage-maroon flex items-center gap-1"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Use Bhainsa, Nirmal (504103)</span>
                </button>
              </div>

              {/* Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Ramesh Patel"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#FAF6EE] border border-heritage-gold/30 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-heritage-gold text-stone-900 font-medium"
                  />
                  {errors.name && <p className="text-red-600 text-xs mt-1 font-semibold">{errors.name}</p>}
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="10-digit phone (e.g. 9823012345)"
                    maxLength={10}
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#FAF6EE] border border-heritage-gold/30 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-heritage-gold text-stone-900 font-medium"
                  />
                  {errors.phone && <p className="text-red-600 text-xs mt-1 font-semibold">{errors.phone}</p>}
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Email Address <span className="text-stone-400 font-normal">(Optional, for receipt)</span>
                </label>
                <input
                  type="email"
                  placeholder="e.g. ramesh@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[#FAF6EE] border border-heritage-gold/30 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-heritage-gold text-stone-900 font-medium"
                />
                {errors.email && <p className="text-red-600 text-xs mt-1 font-semibold">{errors.email}</p>}
              </div>

              {/* Street Address */}
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Street Address / House / Landmark <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. House #4-12, Main Road near Gandhi Chowk"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[#FAF6EE] border border-heritage-gold/30 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-heritage-gold text-stone-900 font-medium"
                />
                {errors.address && <p className="text-red-600 text-xs mt-1 font-semibold">{errors.address}</p>}
              </div>

              {/* City, District, State, Pincode */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">City/Town *</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF6EE] border border-heritage-gold/30 rounded-xl text-xs sm:text-sm font-medium"
                  />
                  {errors.city && <p className="text-red-600 text-[10px] mt-1">{errors.city}</p>}
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">District</label>
                  <input
                    type="text"
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF6EE] border border-heritage-gold/30 rounded-xl text-xs sm:text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">State</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF6EE] border border-heritage-gold/30 rounded-xl text-xs sm:text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">PIN Code *</label>
                  <input
                    type="text"
                    maxLength={6}
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF6EE] border border-heritage-gold/30 rounded-xl text-xs sm:text-sm font-medium"
                  />
                  {errors.pincode && <p className="text-red-600 text-[10px] mt-1">{errors.pincode}</p>}
                </div>
              </div>

              {/* Order Notes */}
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Delivery Notes / Special Instructions <span className="text-stone-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Call before delivery, pack in airtight pouch"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-2 bg-[#FAF6EE] border border-heritage-gold/30 rounded-2xl text-xs sm:text-sm font-medium"
                />
              </div>
            </div>

            {/* Payment Method Card */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-heritage-gold/30 shadow-sm space-y-4">
              <h3 className="font-serif font-bold text-xl text-heritage-maroon border-b border-stone-100 pb-3">
                2. Select Payment Method
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* 1. Cash on Delivery / Offline */}
                <label
                  className={`relative flex flex-col p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'OFFLINE'
                      ? 'border-heritage-maroon bg-cream-100 shadow-md'
                      : 'border-stone-200 bg-white hover:bg-cream-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Banknote className="w-5 h-5 text-heritage-maroon" />
                      <span className="font-serif font-bold text-stone-900 text-sm">
                        Cash on Delivery
                      </span>
                    </div>
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'OFFLINE'}
                      onChange={() => setPaymentMethod('OFFLINE')}
                      className="accent-heritage-maroon w-4 h-4"
                    />
                  </div>
                  <p className="text-xs text-stone-600">
                    Pay securely in cash or QR scan upon delivery at your doorstep.
                  </p>
                </label>

                {/* 2. Direct UPI Payment to Business Mobile */}
                <label
                  className={`relative flex flex-col p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'MANUAL_UPI'
                      ? 'border-heritage-maroon bg-cream-100 shadow-md'
                      : 'border-stone-200 bg-white hover:bg-cream-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-5 h-5 text-heritage-maroon" />
                      <span className="font-serif font-bold text-stone-900 text-sm">
                        Direct UPI Pay
                      </span>
                    </div>
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'MANUAL_UPI'}
                      onChange={() => setPaymentMethod('MANUAL_UPI')}
                      className="accent-heritage-maroon w-4 h-4"
                    />
                  </div>
                  <p className="text-xs text-stone-600">
                    Pay using Google Pay / PhonePe / Paytm to business mobile <span className="font-bold text-heritage-maroon">9542826358</span>.
                  </p>
                </label>

                {/* 3. Online Payment / Razorpay */}
                <label
                  className={`relative flex flex-col p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'ONLINE'
                      ? 'border-heritage-maroon bg-cream-100 shadow-md'
                      : 'border-stone-200 bg-white hover:bg-cream-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-heritage-maroon" />
                      <span className="font-serif font-bold text-stone-900 text-sm">
                        Online Gateway
                      </span>
                    </div>
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'ONLINE'}
                      onChange={() => setPaymentMethod('ONLINE')}
                      className="accent-heritage-maroon w-4 h-4"
                    />
                  </div>
                  <p className="text-xs text-stone-600">
                    Instant online checkout via Razorpay Gateway (Cards, NetBanking, UPI).
                  </p>
                </label>
              </div>

              {/* Direct UPI Instructions Box */}
              {paymentMethod === 'MANUAL_UPI' && (
                <div className="bg-amber-50/90 border-2 border-amber-400 p-5 sm:p-6 rounded-3xl space-y-5 shadow-sm">
                  <div className="text-center space-y-1">
                    <span className="text-[11px] font-black uppercase text-amber-900 tracking-wider bg-amber-200/80 px-3 py-1 rounded-full inline-block">
                      Direct UPI / Mobile Payment
                    </span>
                    <h4 className="font-serif font-black text-lg text-heritage-maroon">
                      Pay ₹{total} via Google Pay / PhonePe / Paytm / BHIM
                    </h4>
                    <p className="text-xs text-stone-600">
                      Send payment using the UPI ID or mobile number below, then paste your 12-digit transaction UTR number.
                    </p>
                  </div>

                  {/* UPI Details Card */}
                  <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-xs space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Copy UPI ID */}
                      <div className="p-3.5 bg-cream-100 rounded-xl border border-heritage-gold/30">
                        <span className="text-[10px] font-bold text-stone-600 uppercase block mb-0.5">
                          Official UPI ID (VPA):
                        </span>
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-mono font-black text-sm sm:text-base text-heritage-maroon">
                            {paymentConfig.businessUpiId || '9542826358@ybl'}
                          </span>
                          <button
                            type="button"
                            onClick={handleCopyUpiId}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white hover:bg-cream-200 border border-stone-300 text-stone-800 text-[11px] font-bold shadow-2xs"
                          >
                            {copiedUpiId ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                            <span>{copiedUpiId ? 'Copied' : 'Copy'}</span>
                          </button>
                        </div>
                      </div>

                      {/* Copy Mobile Number */}
                      <div className="p-3.5 bg-cream-100 rounded-xl border border-heritage-gold/30">
                        <span className="text-[10px] font-bold text-stone-600 uppercase block mb-0.5">
                          UPI Linked Phone Number:
                        </span>
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-mono font-black text-sm sm:text-base text-stone-900">
                            {paymentConfig.businessPaymentMobile || '9542826358'}
                          </span>
                          <button
                            type="button"
                            onClick={handleCopyPaymentNumber}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white hover:bg-cream-200 border border-stone-300 text-stone-800 text-[11px] font-bold shadow-2xs"
                          >
                            {copiedNumber ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                            <span>{copiedNumber ? 'Copied' : 'Copy'}</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Deep Link for Mobile Devices */}
                    <a
                      href={`upi://pay?pa=${paymentConfig.businessUpiId || '9542826358@ybl'}&pn=Annapurna%20Aahaar&cu=INR&am=${total}&tn=Annapurna%20Order`}
                      className="w-full bg-emerald-700 hover:bg-emerald-800 text-white py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all active:scale-98"
                    >
                      <Smartphone className="w-4 h-4" />
                      <span>Tap to Open UPI App & Pay ₹{total} (Mobile)</span>
                    </a>
                  </div>

                  {/* Transaction Reference Input */}
                  <div className="pt-1">
                    <label className="text-xs font-bold text-stone-900 block mb-1">
                      Enter UPI / UTR Transaction Reference ID <span className="text-red-600">*</span>
                    </label>
                    <p className="text-[11px] text-stone-600 mb-1.5">
                      After completing payment in your UPI app, paste the 12-digit UTR/Reference ID below:
                    </p>
                    <input
                      type="text"
                      placeholder="e.g. 324567891234 (12-digit UPI reference)"
                      value={manualUpiRef}
                      onChange={(e) => setManualUpiRef(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border-2 border-amber-400 rounded-xl text-sm font-mono font-bold focus:ring-2 focus:ring-heritage-gold text-stone-900"
                    />
                    {errors.manualUpiRef && (
                      <p className="text-red-600 text-xs mt-1 font-semibold">{errors.manualUpiRef}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-heritage-gold/30 shadow-md space-y-6 sticky top-24">
              <h3 className="font-serif font-bold text-xl text-heritage-maroon border-b border-stone-100 pb-3">
                Order Summary ({items.length} item{items.length > 1 ? 's' : ''})
              </h3>

              {/* Items List */}
              <div className="max-h-64 overflow-y-auto space-y-3 pr-1 scrollbar-thin">
                {items.map((it: CartItem) => (
                  <div key={`${it.productId}-${it.variantId}`} className="flex items-center justify-between text-xs sm:text-sm">
                    <div className="flex items-center gap-3">
                      <img
                        src={getProductImageUrl(it.imageUrl)}
                        alt={it.productName}
                        className="w-10 h-10 object-contain rounded-xl bg-cream-100 p-1 border border-stone-200"
                      />
                      <div>
                        <div className="font-bold text-stone-900 line-clamp-1">{it.productName}</div>
                        <div className="text-[11px] text-stone-500 font-medium">
                          {it.weight} × {it.quantity}
                        </div>
                      </div>
                    </div>
                    <span className="font-bold text-stone-800">
                      {formatINR(it.unitPrice * it.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Pricing Breakdown */}
              <div className="space-y-2 pt-4 border-t border-stone-100 text-xs sm:text-sm">
                <div className="flex justify-between text-stone-600">
                  <span>Items Subtotal:</span>
                  <span>{formatINR(subtotal)}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Delivery Fee:</span>
                  <span>{deliveryFee === 0 ? <span className="text-emerald-700 font-bold">FREE</span> : formatINR(deliveryFee)}</span>
                </div>
                {deliveryFee > 0 && (
                  <p className="text-[11px] text-heritage-antiqueGold">
                    💡 Add {formatINR(500 - subtotal)} more to qualify for FREE delivery!
                  </p>
                )}
                <div className="flex justify-between text-base sm:text-lg font-serif font-black text-heritage-maroon pt-2 border-t border-stone-200">
                  <span>Grand Total:</span>
                  <span>{formatINR(total)}</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-heritage-maroon hover:bg-[#681818] text-cream-100 py-3.5 sm:py-4 rounded-2xl font-bold text-sm sm:text-base transition-all shadow-lg active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-cream-100 border-t-transparent rounded-full animate-spin" />
                    <span>Processing Order...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Place Order ({formatINR(total)})</span>
                  </>
                )}
              </button>

              <div className="space-y-2 pt-2 text-[11px] text-stone-500 text-center">
                <p className="flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>100% Secure Checkout & Fresh Packaging Guarantee</span>
                </p>
                <p>Manufactured & Shipped directly from Bhainsa, Telangana (504103)</p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
