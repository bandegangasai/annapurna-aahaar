import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Truck,
  CheckCircle2,
  Lock,
  ArrowLeft,
  AlertCircle,
  ShoppingBag,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';
import { formatINR, validateIndianMobile, validateIndianPincode } from '../utils/formatters';
import { SEOHead } from '../components/common/SEOHead';

export const Checkout: React.FC = () => {
  const { items, subtotal, deliveryFee, total, clearCart } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const indianStates = [
    'Andhra Pradesh',
    'Arunachal Pradesh',
    'Assam',
    'Bihar',
    'Chhattisgarh',
    'Goa',
    'Gujarat',
    'Haryana',
    'Himachal Pradesh',
    'Jharkhand',
    'Karnataka',
    'Kerala',
    'Madhya Pradesh',
    'Maharashtra',
    'Manipur',
    'Meghalaya',
    'Mizoram',
    'Nagaland',
    'Odisha',
    'Punjab',
    'Rajasthan',
    'Sikkim',
    'Tamil Nadu',
    'Telangana',
    'Tripura',
    'Uttar Pradesh',
    'Uttarakhand',
    'West Bengal',
    'Delhi NCR',
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error on edit
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      newErrors.name = 'Please enter your full name';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Mobile number is required';
    } else if (!validateIndianMobile(formData.phone)) {
      newErrors.phone = 'Enter a valid 10-digit Indian mobile number (e.g. 9876543210)';
    }

    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.address.trim() || formData.address.trim().length < 5) {
      newErrors.address = 'Please provide complete house/flat no., street and locality';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!formData.state) {
      newErrors.state = 'Please select your state';
    }

    if (!formData.pincode.trim()) {
      newErrors.pincode = 'PIN Code is required';
    } else if (!validateIndianPincode(formData.pincode)) {
      newErrors.pincode = 'Enter a valid 6-digit Indian PIN code';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) {
      showToast('Your cart is empty. Please add products first.', 'error');
      navigate('/products');
      return;
    }

    if (!validateForm()) {
      showToast('Please fix the errors in the checkout form.', 'error');
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
          state: formData.state.trim(),
          pincode: formData.pincode.trim(),
        },
        items: items.map((i) => ({
          productId: i.productId,
          variantId: i.variantId,
          quantity: i.quantity,
        })),
        notes: formData.notes.trim() || undefined,
        paymentMethod: 'CASH_ON_DELIVERY',
      };

      const res = await api.createOrder(orderPayload);

      if (res.success && res.data) {
        clearCart();
        showToast('Order placed successfully!', 'success');
        navigate(`/order-success/${res.data.orderNumber}`, {
          state: { order: res.data },
        });
      }
    } catch (err: any) {
      console.error('Order creation error:', err);
      showToast(err.message || 'Failed to place order. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif font-bold text-2xl text-stone-900">Your Cart is Empty</h2>
        <p className="text-stone-600">Please add items to your cart before proceeding to checkout.</p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 bg-heritage-maroon text-cream-100 px-6 py-2.5 rounded-xl font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Browse Products</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#FCF9F2] min-h-screen py-10 lg:py-14">
      <SEOHead
        title="Checkout | Annapurna Aahaar"
        description="Secure customer checkout with Cash on Delivery for Annapurna Aahaar."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            to="/cart"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-heritage-maroon transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Cart</span>
          </Link>
          <h1 className="font-serif font-black text-3xl sm:text-4xl text-heritage-maroon">
            Customer Checkout
          </h1>
          <p className="text-stone-600 text-sm mt-1">
            Provide your shipping details. Pay conveniently with Cash or UPI upon delivery.
          </p>
        </div>

        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Customer & Address Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-amber-900/10 shadow-sm space-y-6">
            <h2 className="font-serif font-bold text-xl text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-3">
              <span className="w-7 h-7 rounded-full bg-turmeric-100 text-turmeric-800 text-xs flex items-center justify-center font-sans font-bold">
                1
              </span>
              <span>Delivery Details</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Ramesh Kumar Sharma"
                  className={`w-full px-4 py-3 bg-cream-50 border rounded-xl text-sm focus:outline-none focus:ring-2 text-stone-900 ${
                    errors.name
                      ? 'border-red-400 focus:ring-red-400'
                      : 'border-amber-900/15 focus:ring-turmeric-500'
                  }`}
                />
                {errors.name && (
                  <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.name}</span>
                  </p>
                )}
              </div>

              {/* Mobile Phone */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-500">
                    +91
                  </span>
                  <input
                    type="tel"
                    name="phone"
                    maxLength={10}
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="9876543210"
                    className={`w-full pl-12 pr-4 py-3 bg-cream-50 border rounded-xl text-sm focus:outline-none focus:ring-2 text-stone-900 ${
                      errors.phone
                        ? 'border-red-400 focus:ring-red-400'
                        : 'border-amber-900/15 focus:ring-turmeric-500'
                    }`}
                  />
                </div>
                {errors.phone && (
                  <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.phone}</span>
                  </p>
                )}
              </div>

              {/* Email (Optional) */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Email Address <span className="text-stone-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="ramesh@example.com"
                  className={`w-full px-4 py-3 bg-cream-50 border rounded-xl text-sm focus:outline-none focus:ring-2 text-stone-900 ${
                    errors.email
                      ? 'border-red-400 focus:ring-red-400'
                      : 'border-amber-900/15 focus:ring-turmeric-500'
                  }`}
                />
                {errors.email && (
                  <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.email}</span>
                  </p>
                )}
              </div>

              {/* Street Address */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Complete Delivery Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Flat / House No., Building Name, Street / Colony, Landmark"
                  className={`w-full px-4 py-3 bg-cream-50 border rounded-xl text-sm focus:outline-none focus:ring-2 text-stone-900 ${
                    errors.address
                      ? 'border-red-400 focus:ring-red-400'
                      : 'border-amber-900/15 focus:ring-turmeric-500'
                  }`}
                />
                {errors.address && (
                  <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.address}</span>
                  </p>
                )}
              </div>

              {/* City */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  City / Town <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="e.g. Pune"
                  className={`w-full px-4 py-3 bg-cream-50 border rounded-xl text-sm focus:outline-none focus:ring-2 text-stone-900 ${
                    errors.city
                      ? 'border-red-400 focus:ring-red-400'
                      : 'border-amber-900/15 focus:ring-turmeric-500'
                  }`}
                />
                {errors.city && (
                  <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.city}</span>
                  </p>
                )}
              </div>

              {/* State */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  State <span className="text-red-500">*</span>
                </label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-cream-50 border rounded-xl text-sm focus:outline-none focus:ring-2 text-stone-900 ${
                    errors.state
                      ? 'border-red-400 focus:ring-red-400'
                      : 'border-amber-900/15 focus:ring-turmeric-500'
                  }`}
                >
                  <option value="">Select State</option>
                  {indianStates.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                {errors.state && (
                  <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.state}</span>
                  </p>
                )}
              </div>

              {/* PIN Code */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  PIN Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="pincode"
                  maxLength={6}
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="e.g. 411001"
                  className={`w-full px-4 py-3 bg-cream-50 border rounded-xl text-sm focus:outline-none focus:ring-2 text-stone-900 ${
                    errors.pincode
                      ? 'border-red-400 focus:ring-red-400'
                      : 'border-amber-900/15 focus:ring-turmeric-500'
                  }`}
                />
                {errors.pincode && (
                  <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.pincode}</span>
                  </p>
                )}
              </div>

              {/* Order Notes */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Delivery Notes <span className="text-stone-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="e.g. Ring doorbell, deliver after 4 PM"
                  className="w-full px-4 py-3 bg-cream-50 border border-amber-900/15 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-turmeric-500 text-stone-900"
                />
              </div>
            </div>

            {/* Payment Method Section */}
            <div className="pt-4 border-t border-stone-100 space-y-3">
              <h3 className="font-serif font-bold text-lg text-stone-900 flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-turmeric-100 text-turmeric-800 text-xs flex items-center justify-center font-sans font-bold">
                  2
                </span>
                <span>Payment Mode</span>
              </h3>

              <div className="border-2 border-turmeric-600 bg-amber-50/70 rounded-2xl p-4 flex items-start gap-3">
                <input
                  type="radio"
                  id="cod"
                  name="payment"
                  checked
                  readOnly
                  className="mt-1 text-turmeric-600 focus:ring-turmeric-500 h-4 w-4"
                />
                <label htmlFor="cod" className="cursor-pointer">
                  <span className="font-bold text-stone-900 text-sm block">
                    Cash / UPI on Delivery (Pay on Delivery)
                  </span>
                  <span className="text-xs text-stone-600 leading-relaxed block mt-0.5">
                    Pay securely with Cash or any UPI App (Google Pay, PhonePe, Paytm) when the delivery executive arrives with your authentic food package.
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Right: Order Items & Pay Summary */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-amber-900/10 shadow-lg space-y-6">
            <h2 className="font-serif font-bold text-xl text-stone-900 border-b border-stone-100 pb-3">
              Your Order ({items.length} {items.length === 1 ? 'item' : 'items'})
            </h2>

            {/* Mini Items List */}
            <div className="max-h-60 overflow-y-auto space-y-3 pr-1 divide-y divide-stone-100">
              {items.map((item) => (
                <div
                  key={`${item.productId}-${item.variantId}`}
                  className="pt-2 first:pt-0 flex items-center justify-between gap-3 text-sm"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={item.imageUrl}
                      alt={item.productName}
                      className="w-10 h-10 rounded-lg object-cover bg-cream-100 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="font-semibold text-stone-800 truncate text-xs sm:text-sm">
                        {item.productName}
                      </div>
                      <div className="text-[11px] text-stone-500">
                        {item.weight} × {item.quantity}
                      </div>
                    </div>
                  </div>
                  <span className="font-serif font-bold text-heritage-maroon shrink-0">
                    {formatINR(item.unitPrice * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Financials */}
            <div className="border-t border-stone-100 pt-4 space-y-2.5 text-sm">
              <div className="flex justify-between text-stone-600">
                <span>Items Subtotal</span>
                <span className="font-semibold text-stone-900">{formatINR(subtotal)}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Delivery Fee</span>
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

            {/* Trust Assurances */}
            <div className="bg-cream-50 p-4 rounded-2xl border border-amber-900/10 space-y-2 text-xs text-stone-600">
              <div className="flex items-center gap-2 font-semibold text-stone-800">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>100% Genuine Annapurna Aahaar Guarantee</span>
              </div>
              <p className="text-[11px] text-stone-500">
                Your order is sent directly to our dispatch kitchen where it is verified and freshly packed.
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-turmeric-600 via-amber-600 to-heritage-maroon hover:from-turmeric-700 hover:to-amber-900 text-cream-50 py-4 rounded-xl font-bold text-base shadow-xl shadow-turmeric-600/25 transition-all transform active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing Order...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Place Order ({formatINR(total)})</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
