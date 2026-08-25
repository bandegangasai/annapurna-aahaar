import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  CreditCard,
  Banknote,
  ArrowLeft,
  Lock,
  MapPin,
  Smartphone,
  Copy,
  Check,
  Phone,
  Tag,
  MessageCircle,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';
import { SEOHead } from '../components/common/SEOHead';
import { formatINR, getProductImageUrl } from '../utils/formatters';
import { generateWhatsAppOrderUrl } from '../utils/whatsapp';
import { api } from '../services/api';
import { CartItem, Coupon } from '../types';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export const Checkout: React.FC = () => {
  const { items, subtotal, deliveryFee, total, clearCart } = useCart();
  const { showToast } = useToast();
  const { t, getLocalizedProduct } = useLanguage();
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
    businessPaymentMobile: '9542836358',
    businessUpiId: '9542836358@ybl',
    businessName: 'Annapurna Aahaar',
    razorpayKeyId: null,
    isLiveGatewayAvailable: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  const finalTotal = Math.max(0, subtotal - couponDiscount + deliveryFee);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');
    if (!couponCode.trim()) return;

    const res = api.validateCoupon(couponCode, subtotal);
    if (res.isValid && res.coupon) {
      setAppliedCoupon(res.coupon);
      setCouponDiscount(res.discount);
      setCouponSuccess(res.message);
      showToast(res.message, 'success');
    } else {
      setAppliedCoupon(null);
      setCouponDiscount(0);
      setCouponError(res.message);
      showToast(res.message, 'error');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponDiscount(0);
    setCouponCode('');
    setCouponSuccess('');
    setCouponError('');
  };

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
        <h2 className="font-serif font-bold text-2xl text-[#173F35]">{t('cart_empty')}</h2>
        <p className="text-stone-muted text-sm">{t('cart_empty_sub')}</p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 bg-[#173F35] text-[#F8F3E7] px-6 py-3 rounded-2xl font-bold text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('cart_browse')}</span>
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
      errs.phone = 'Please enter a valid 10-digit Indian mobile number';
    }

    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Please enter a valid email address';
    }

    if (!formData.address.trim() || formData.address.trim().length < 5) {
      errs.address = 'Please enter your full street address/house number';
    }

    if (!formData.city.trim()) {
      errs.city = 'City/Town is required';
    }

    if (!/^\d{6}$/.test(formData.pincode.trim())) {
      errs.pincode = 'Please enter a valid 6-digit PIN code (e.g. 504103)';
    }

    if (paymentMethod === 'MANUAL_UPI' && !manualUpiRef.trim()) {
      errs.manualUpiRef = 'Please enter the 12-digit UPI / UTR transaction reference number';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleCopyPaymentNumber = () => {
    const numberToCopy = paymentConfig.businessPaymentMobile || '9542836358';
    navigator.clipboard.writeText(numberToCopy);
    setCopiedNumber(true);
    showToast(`Copied UPI Phone Number: ${numberToCopy}`, 'info');
    setTimeout(() => setCopiedNumber(false), 2000);
  };

  const handleCopyUpiId = () => {
    const upiToCopy = paymentConfig.businessUpiId || '9542836358@ybl';
    navigator.clipboard.writeText(upiToCopy);
    setCopiedUpiId(true);
    showToast(`Copied UPI ID: ${upiToCopy}`, 'info');
    setTimeout(() => setCopiedUpiId(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      showToast('Please fix the errors marked below.', 'error');
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
          district: formData.district.trim() || undefined,
          state: formData.state.trim(),
          pincode: formData.pincode.trim(),
        },
        items: items.map((item: CartItem) => ({
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
        })),
        notes: paymentMethod === 'MANUAL_UPI'
          ? `[Direct UPI Ref: ${manualUpiRef.trim()}] ${formData.notes.trim()}`
          : formData.notes.trim() || undefined,
        discountAmount: couponDiscount > 0 ? couponDiscount : undefined,
        couponCode: appliedCoupon?.code,
        paymentMethod: (paymentMethod === 'ONLINE' ? 'ONLINE' : 'OFFLINE') as 'ONLINE' | 'OFFLINE',
      };

      if (paymentMethod === 'ONLINE') {
        const orderRes = await api.createOrder(orderPayload);
        if (!orderRes.success || !orderRes.data) {
          throw new Error(orderRes.message || 'Failed to initialize order');
        }

        const createdOrder = orderRes.data;

        if (paymentConfig.razorpayKeyId && window.Razorpay) {
          const options = {
            key: paymentConfig.razorpayKeyId,
            amount: Math.round(total * 100),
            currency: 'INR',
            name: 'Annapurna Aahaar',
            description: `Order #${createdOrder.orderNumber}`,
            prefill: {
              name: formData.name,
              email: formData.email,
              contact: formData.phone,
            },
            theme: {
              color: '#173F35',
            },
            handler: async function (response: any) {
              try {
                const verifyRes = await api.verifyOnlinePayment({
                  orderId: createdOrder.id,
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature,
                });

                if (verifyRes.success) {
                  showToast('Payment verified successfully!', 'success');
                  clearCart();
                  navigate(`/order-success/${createdOrder.orderNumber}`, { state: { order: createdOrder } });
                } else {
                  showToast('Payment verification pending. Order placed.', 'info');
                  clearCart();
                  navigate(`/order-success/${createdOrder.orderNumber}`, { state: { order: createdOrder } });
                }
              } catch (verifyErr) {
                clearCart();
                navigate(`/order-success/${createdOrder.orderNumber}`, { state: { order: createdOrder } });
              }
            },
            modal: {
              ondismiss: function () {
                showToast('Payment was not completed. You can pay via UPI or Cash on Delivery.', 'info');
                clearCart();
                navigate(`/order-success/${createdOrder.orderNumber}`, { state: { order: createdOrder } });
              },
            },
          };

          const rzp = new window.Razorpay(options);
          rzp.open();
        } else {
          clearCart();
          navigate(`/order-success/${createdOrder.orderNumber}`, { state: { order: createdOrder } });
        }
      } else {
        const orderRes = await api.createOrder(orderPayload);
        if (!orderRes.success || !orderRes.data) {
          throw new Error(orderRes.message || 'Failed to submit order');
        }

        const createdOrder = orderRes.data;
        showToast(`Order #${createdOrder.orderNumber} placed successfully!`, 'success');
        clearCart();
        navigate(`/order-success/${createdOrder.orderNumber}`, { state: { order: createdOrder } });
      }
    } catch (err: any) {
      console.error('Order submission error:', err);
      showToast(err.message || 'Failed to place order. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#F8F3E7] min-h-screen py-10 lg:py-16 text-[#252525]">
      <SEOHead
        title="Checkout & Secure Payment | Annapurna Aahaar"
        description="Complete your order for authentic Indian papads, whole-wheat sevaya, and turmeric powder from Bhainsa, Telangana."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            to="/cart"
            className="inline-flex items-center gap-2 text-xs font-bold text-stone-muted hover:text-[#173F35] transition-colors bg-white px-4 py-2 rounded-full border border-[#C79A45]/30 shadow-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Basket</span>
          </Link>
          <h1 className="font-serif font-black text-3xl sm:text-4xl text-[#173F35] mt-4">
            {t('checkout_title')}
          </h1>
          <p className="text-stone-muted text-sm mt-1">
            Dispatching freshly prepared products from Bhainsa, Nirmal District, Telangana (504103).
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Delivery & Payment Details */}
          <div className="lg:col-span-7 space-y-6">
            {/* Delivery Address Card */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#C79A45]/30 shadow-subtle space-y-5">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <h3 className="font-serif font-bold text-xl text-[#173F35]">
                  {t('checkout_step_1')}
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    setFormData({
                      ...formData,
                      city: 'Bhainsa',
                      district: 'Nirmal District',
                      state: 'Telangana',
                      pincode: '504103',
                    });
                    showToast('Applied Bhainsa, Nirmal District (504103) address preset', 'info');
                  }}
                  className="text-xs text-[#173F35] bg-[#F8F3E7] hover:bg-[#F1E9D5] px-3 py-1.5 rounded-xl border border-[#C79A45]/40 font-bold transition-all flex items-center gap-1.5"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#C79A45]" />
                  <span>Bhainsa Preset</span>
                </button>
              </div>

              {/* Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-stone-primary block mb-1">
                    {t('checkout_name')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Ramesh Patel"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#FAF6EE] border border-[#C79A45]/30 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C79A45] text-stone-primary font-medium"
                  />
                  {errors.name && <p className="text-red-600 text-xs mt-1 font-semibold">{errors.name}</p>}
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-primary block mb-1">
                    {t('checkout_phone')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="10-digit phone (e.g. 9823012345)"
                    maxLength={10}
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#FAF6EE] border border-[#C79A45]/30 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C79A45] text-stone-primary font-medium"
                  />
                  {errors.phone && <p className="text-red-600 text-xs mt-1 font-semibold">{errors.phone}</p>}
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="text-xs font-bold text-stone-primary block mb-1">
                  {t('checkout_email')}
                </label>
                <input
                  type="email"
                  placeholder="e.g. ramesh@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[#FAF6EE] border border-[#C79A45]/30 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C79A45] text-stone-primary font-medium"
                />
                {errors.email && <p className="text-red-600 text-xs mt-1 font-semibold">{errors.email}</p>}
              </div>

              {/* Street Address */}
              <div>
                <label className="text-xs font-bold text-stone-primary block mb-1">
                  {t('checkout_address')} <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. House #4-12, Main Road near Gandhi Chowk"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[#FAF6EE] border border-[#C79A45]/30 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C79A45] text-stone-primary font-medium"
                />
                {errors.address && <p className="text-red-600 text-xs mt-1 font-semibold">{errors.address}</p>}
              </div>

              {/* City, District, State, Pincode */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="text-xs font-bold text-stone-primary block mb-1">{t('checkout_city')}</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF6EE] border border-[#C79A45]/30 rounded-xl text-xs sm:text-sm font-medium"
                  />
                  {errors.city && <p className="text-red-600 text-[10px] mt-1">{errors.city}</p>}
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-primary block mb-1">{t('checkout_district')}</label>
                  <input
                    type="text"
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF6EE] border border-[#C79A45]/30 rounded-xl text-xs sm:text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-primary block mb-1">{t('checkout_state')}</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF6EE] border border-[#C79A45]/30 rounded-xl text-xs sm:text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-primary block mb-1">{t('checkout_pincode')}</label>
                  <input
                    type="text"
                    maxLength={6}
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF6EE] border border-[#C79A45]/30 rounded-xl text-xs sm:text-sm font-medium"
                  />
                  {errors.pincode && <p className="text-red-600 text-[10px] mt-1">{errors.pincode}</p>}
                </div>
              </div>

              {/* Order Notes */}
              <div>
                <label className="text-xs font-bold text-stone-primary block mb-1">
                  {t('checkout_notes')}
                </label>
                <input
                  type="text"
                  placeholder="e.g. Call before delivery, pack in airtight seal"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-2 bg-[#FAF6EE] border border-[#C79A45]/30 rounded-2xl text-xs sm:text-sm font-medium"
                />
              </div>
            </div>

            {/* Payment Method Card */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#C79A45]/30 shadow-subtle space-y-4">
              <h3 className="font-serif font-bold text-xl text-[#173F35] border-b border-stone-100 pb-3">
                {t('checkout_step_2')}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* 1. Cash on Delivery / Offline */}
                <label
                  className={`relative flex flex-col p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'OFFLINE'
                      ? 'border-[#173F35] bg-[#F8F3E7] shadow-sm'
                      : 'border-stone-200 bg-white hover:bg-[#FAF6EE]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Banknote className="w-5 h-5 text-[#173F35]" />
                      <span className="font-serif font-bold text-stone-primary text-sm">
                        {t('checkout_pay_cod')}
                      </span>
                    </div>
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'OFFLINE'}
                      onChange={() => setPaymentMethod('OFFLINE')}
                      className="accent-[#173F35] w-4 h-4"
                    />
                  </div>
                  <p className="text-xs text-stone-muted">
                    {t('checkout_pay_cod_desc')}
                  </p>
                </label>

                {/* 2. Direct UPI Payment */}
                <label
                  className={`relative flex flex-col p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'MANUAL_UPI'
                      ? 'border-[#173F35] bg-[#F8F3E7] shadow-sm'
                      : 'border-stone-200 bg-white hover:bg-[#FAF6EE]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-5 h-5 text-[#173F35]" />
                      <span className="font-serif font-bold text-stone-primary text-sm">
                        {t('checkout_pay_upi')}
                      </span>
                    </div>
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'MANUAL_UPI'}
                      onChange={() => setPaymentMethod('MANUAL_UPI')}
                      className="accent-[#173F35] w-4 h-4"
                    />
                  </div>
                  <p className="text-xs text-stone-muted">
                    {t('checkout_pay_upi_desc')}
                  </p>
                </label>

                {/* 3. Online Payment / Razorpay */}
                <label
                  className={`relative flex flex-col p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'ONLINE'
                      ? 'border-[#173F35] bg-[#F8F3E7] shadow-sm'
                      : 'border-stone-200 bg-white hover:bg-[#FAF6EE]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-[#173F35]" />
                      <span className="font-serif font-bold text-stone-primary text-sm">
                        {t('checkout_pay_online')}
                      </span>
                    </div>
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'ONLINE'}
                      onChange={() => setPaymentMethod('ONLINE')}
                      className="accent-[#173F35] w-4 h-4"
                    />
                  </div>
                  <p className="text-xs text-stone-muted">
                    {t('checkout_pay_online_desc')}
                  </p>
                </label>
              </div>

              {/* Direct UPI Instructions Box */}
              {paymentMethod === 'MANUAL_UPI' && (
                <div className="bg-[#FAF6EE] border-2 border-[#C79A45] p-5 sm:p-6 rounded-3xl space-y-5 shadow-xs">
                  <div className="text-center space-y-1">
                    <span className="text-[11px] font-black uppercase text-[#173F35] tracking-wider bg-[#C79A45]/25 px-3 py-1 rounded-full inline-block border border-[#C79A45]/40">
                      Direct UPI / Mobile Payment
                    </span>
                    <h4 className="font-serif font-black text-lg text-[#173F35]">
                      Pay {formatINR(total)} via Google Pay / PhonePe / Paytm / BHIM
                    </h4>
                    <p className="text-xs text-stone-muted">
                      {t('checkout_upi_instruction')}
                    </p>
                  </div>

                  {/* UPI Details Card */}
                  <div className="bg-white p-5 rounded-2xl border border-[#C79A45]/30 shadow-xs space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Copy UPI ID */}
                      <div className="p-3.5 bg-[#F8F3E7] rounded-xl border border-[#C79A45]/30">
                        <span className="text-[10px] font-bold text-stone-muted uppercase block mb-0.5">
                          Official UPI ID (VPA):
                        </span>
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-mono font-black text-sm sm:text-base text-[#173F35]">
                            {paymentConfig.businessUpiId || '9542836358@ybl'}
                          </span>
                          <button
                            type="button"
                            onClick={handleCopyUpiId}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white hover:bg-[#FAF6EE] border border-stone-300 text-stone-primary text-[11px] font-bold shadow-xs"
                          >
                            {copiedUpiId ? <Check className="w-3 h-3 text-emerald-700" /> : <Copy className="w-3 h-3 text-[#C79A45]" />}
                            <span>{copiedUpiId ? t('checkout_copied') : t('checkout_copy_upi')}</span>
                          </button>
                        </div>
                      </div>

                      {/* Copy Mobile Number */}
                      <div className="p-3.5 bg-[#F8F3E7] rounded-xl border border-[#C79A45]/30">
                        <span className="text-[10px] font-bold text-stone-muted uppercase block mb-0.5">
                          Payment Phone Number:
                        </span>
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-mono font-black text-sm sm:text-base text-stone-primary">
                            {paymentConfig.businessPaymentMobile || '9542836358'}
                          </span>
                          <button
                            type="button"
                            onClick={handleCopyPaymentNumber}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white hover:bg-[#FAF6EE] border border-stone-300 text-stone-primary text-[11px] font-bold shadow-xs"
                          >
                            {copiedNumber ? <Check className="w-3 h-3 text-emerald-700" /> : <Copy className="w-3 h-3 text-[#C79A45]" />}
                            <span>{copiedNumber ? t('checkout_copied') : t('checkout_copy_phone')}</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Mobile Deep Link */}
                    <a
                      href={`upi://pay?pa=${paymentConfig.businessUpiId || '9542836358@ybl'}&pn=Annapurna%20Aahaar&cu=INR&am=${total}&tn=Annapurna%20Order`}
                      className="w-full bg-[#173F35] hover:bg-[#0C241E] text-[#F8F3E7] py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all active:scale-98"
                    >
                      <Smartphone className="w-4 h-4 text-[#C79A45]" />
                      <span>Tap to Open UPI App & Pay {formatINR(total)} (Mobile)</span>
                    </a>
                  </div>

                  {/* Transaction Reference Input */}
                  <div className="pt-1">
                    <label className="text-xs font-bold text-stone-primary block mb-1">
                      {t('checkout_utr_label')}
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 324567891234 (12-digit UPI reference)"
                      value={manualUpiRef}
                      onChange={(e) => setManualUpiRef(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border-2 border-[#C79A45]/50 focus:border-[#173F35] rounded-2xl text-sm font-mono text-stone-primary shadow-inner"
                    />
                    {errors.manualUpiRef && (
                      <p className="text-red-600 text-xs mt-1 font-semibold">{errors.manualUpiRef}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Order Summary & Place Order Action */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#C79A45]/30 shadow-subtle space-y-6 sticky top-24">
              <h3 className="font-serif font-bold text-xl text-[#173F35] border-b border-stone-100 pb-3">
                {t('cart_title')}
              </h3>

              {/* Items List */}
              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {items.map((item) => {
                  const localized = getLocalizedProduct(item.productId, item.productName, '');
                  return (
                    <div
                      key={`${item.productId}-${item.variantId}`}
                      className="flex items-center justify-between text-xs sm:text-sm py-2 border-b border-stone-100"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={getProductImageUrl(item.imageUrl)}
                          alt={localized.name}
                          className="w-10 h-10 object-contain rounded-lg bg-[#FAF6EE] p-1 border border-stone-200"
                        />
                        <div>
                          <span className="font-bold text-stone-primary block">{localized.name}</span>
                          <span className="text-xs text-stone-muted">
                            {item.weight} × {item.quantity}
                          </span>
                        </div>
                      </div>
                      <span className="font-serif font-black text-stone-primary">
                        {formatINR(item.unitPrice * item.quantity)}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Coupon Application Box */}
              <div className="bg-[#FAF6EE] p-3.5 rounded-2xl border border-[#C79A45]/30 space-y-2">
                <span className="text-xs font-bold text-[#173F35] flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-[#C79A45]" />
                  <span>Have a Coupon or Promo Code?</span>
                </span>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between text-xs bg-white p-2.5 rounded-xl border border-emerald-300">
                    <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                      <span>{appliedCoupon.code} Applied (-{formatINR(couponDiscount)})</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="text-red-600 font-bold hover:underline text-[11px]"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. WELCOME10"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1 bg-white border border-[#C79A45]/40 rounded-xl px-3 py-2 text-xs uppercase font-mono tracking-wider focus:outline-none focus:ring-1 focus:ring-[#173F35]"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      disabled={!couponCode.trim()}
                      className="bg-[#173F35] hover:bg-[#0C241E] text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all disabled:opacity-50"
                    >
                      Apply
                    </button>
                  </div>
                )}
                {couponError && <p className="text-[10px] text-red-600 font-medium">{couponError}</p>}
                {couponSuccess && <p className="text-[10px] text-emerald-700 font-medium">{couponSuccess}</p>}
              </div>

              {/* Pricing Breakdown */}
              <div className="space-y-2 text-xs sm:text-sm border-t border-stone-100 pt-4">
                <div className="flex justify-between text-stone-muted">
                  <span>{t('cart_subtotal')}</span>
                  <span className="font-semibold text-stone-primary">{formatINR(subtotal)}</span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-emerald-800 font-bold">
                    <span>Coupon Discount</span>
                    <span>-{formatINR(couponDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-stone-muted">
                  <span>{t('cart_delivery')}</span>
                  <span>
                    {deliveryFee === 0 ? (
                      <span className="text-emerald-800 font-bold">FREE</span>
                    ) : (
                      formatINR(deliveryFee)
                    )}
                  </span>
                </div>
                <div className="flex justify-between font-serif font-black text-xl text-[#173F35] pt-3 border-t border-stone-200">
                  <span>{t('cart_total')}</span>
                  <span>{formatINR(finalTotal)}</span>
                </div>
              </div>

              {/* Direct WhatsApp Instant Order Button */}
              <a
                href={generateWhatsAppOrderUrl({
                  customerName: formData.name,
                  phone: formData.phone,
                  address: formData.address,
                  city: formData.city,
                  state: formData.state,
                  pincode: formData.pincode,
                  items: items.map((it) => ({
                    name: it.productName,
                    weight: it.weight,
                    quantity: it.quantity,
                    price: it.unitPrice,
                  })),
                  subtotal,
                  discount: couponDiscount,
                  couponCode: appliedCoupon?.code,
                  shippingFee: deliveryFee,
                  grandTotal: finalTotal,
                  paymentPreference:
                    paymentMethod === 'MANUAL_UPI'
                      ? `Direct UPI (${paymentConfig.businessUpiId || '9542836358@ybl'})`
                      : 'Cash on Delivery (COD)',
                  notes: formData.notes,
                })}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white py-3.5 rounded-2xl font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Order on WhatsApp (One-Click)</span>
              </a>

              {/* Submit Action Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#173F35] hover:bg-[#0C241E] text-[#F8F3E7] py-4 rounded-2xl font-bold text-base shadow-lg transition-all flex items-center justify-center gap-2 border border-[#C79A45]/40 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>{t('checkout_placing')}</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 text-[#C79A45]" />
                    <span>{t('checkout_btn_place')} • {formatINR(finalTotal)}</span>
                  </>
                )}
              </button>

              {/* Phone Order Fallback Box */}
              <div className="p-4 bg-[#FAF6EE] rounded-2xl border border-[#C79A45]/30 text-center space-y-1.5">
                <span className="text-xs font-bold text-[#173F35] flex items-center justify-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#C79A45]" />
                  <span>Need assistance placing this order?</span>
                </span>
                <p className="text-[11px] text-stone-muted">
                  Call our 24/7 Telephone Voice Helpline: <a href="tel:9347036152" className="text-[#173F35] font-black hover:underline">9347036152</a>
                </p>
              </div>

              {/* Guarantee */}
              <div className="flex items-center justify-center gap-2 text-xs text-stone-muted pt-1">
                <ShieldCheck className="w-4 h-4 text-emerald-800" />
                <span>100% Secure Checkout & Fresh Packaging Guarantee</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
