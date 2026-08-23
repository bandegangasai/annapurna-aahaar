import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  MessageSquare,
} from 'lucide-react';
import { api } from '../services/api';
import { validateIndianMobile } from '../utils/formatters';
import { useToast } from '../context/ToastContext';
import { SEOHead } from '../components/common/SEOHead';

export const Contact: React.FC = () => {
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: 'General Enquiry',
    message: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      newErrors.name = 'Please enter your full name';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Mobile number is required';
    } else if (!validateIndianMobile(formData.phone)) {
      newErrors.phone = 'Please enter a valid 10-digit Indian mobile number';
    }

    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.message.trim() || formData.message.trim().length < 5) {
      newErrors.message = 'Please provide a message with at least 5 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      showToast('Please fix the errors before submitting.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.submitContact(formData);
      if (res.success) {
        setIsSubmitted(true);
        showToast('Your message has been sent successfully!', 'success');
        setFormData({
          name: '',
          phone: '',
          email: '',
          subject: 'General Enquiry',
          message: '',
        });
      }
    } catch (err: any) {
      console.error('Contact submission error:', err);
      showToast(err.message || 'Failed to submit enquiry. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#FCF9F2] min-h-screen py-10 lg:py-16">
      <SEOHead
        title="Contact Us & Bulk Enquiries | Annapurna Aahaar"
        description="Reach out to Annapurna Aahaar for order support, retail distribution, wholesale inquiries, and product questions."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-turmeric-700 bg-turmeric-100/70 border border-turmeric-300/40 px-3.5 py-1.5 rounded-full uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            We Value Your Connection
          </span>
          <h1 className="font-serif font-black text-3xl sm:text-4xl lg:text-5xl text-heritage-maroon">
            Contact & Bulk Enquiries
          </h1>
          <p className="text-stone-700 text-sm sm:text-base">
            Have questions about our authentic food products, bulk wedding orders, or distribution? Send us a message and our team will get in touch.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Contact Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 border border-amber-900/10 shadow-lg">
            {isSubmitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-serif font-bold text-2xl text-stone-900">
                  Enquiry Received!
                </h3>
                <p className="text-sm text-stone-600 max-w-md mx-auto">
                  Thank you for reaching out to Annapurna Aahaar. Our customer care representative will contact you via phone or email shortly.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="mt-4 bg-heritage-maroon text-cream-100 px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-turmeric-900 transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="font-serif font-bold text-xl text-stone-900 border-b border-stone-100 pb-3 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-turmeric-600" />
                  <span>Send a Message</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                      Your Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Anand Vardhan"
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

                  {/* Phone */}
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

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                      Email Address <span className="text-stone-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="anand@example.com"
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

                  {/* Subject */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                      Subject / Enquiry Type
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-cream-50 border border-amber-900/15 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-turmeric-500 text-stone-900 font-medium"
                    >
                      <option value="General Enquiry">General Product Enquiry</option>
                      <option value="Wholesale & Bulk Orders">Wholesale & Bulk Papad / Sevaya Orders</option>
                      <option value="Distributor Inquiry">Retail & Dealership Partnership</option>
                      <option value="Order Assistance">Help with Existing Order</option>
                      <option value="Feedback">Product Feedback</option>
                    </select>
                  </div>

                  {/* Message */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                      Your Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={4}
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Please describe your requirements or inquiry in detail..."
                      className={`w-full px-4 py-3 bg-cream-50 border rounded-xl text-sm focus:outline-none focus:ring-2 text-stone-900 ${
                        errors.message
                          ? 'border-red-400 focus:ring-red-400'
                          : 'border-amber-900/15 focus:ring-turmeric-500'
                      }`}
                    />
                    {errors.message && (
                      <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>{errors.message}</span>
                      </p>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-turmeric-600 to-amber-700 hover:from-turmeric-700 hover:to-amber-800 text-white py-3.5 rounded-xl font-bold text-sm sm:text-base shadow-lg shadow-turmeric-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Sending Enquiry...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Message</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Business Info Cards */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-heritage-maroon rounded-3xl p-6 sm:p-8 text-cream-100 space-y-6 shadow-xl border border-amber-900/40">
              <div>
                <span className="text-xs font-bold text-turmeric-400 uppercase tracking-widest block">
                  Connect Directly
                </span>
                <h3 className="font-serif font-bold text-2xl text-cream-50 mt-1">
                  Annapurna Aahaar
                </h3>
                <p className="text-xs text-cream-300 italic mt-0.5">"Tradition in Every Grain."</p>
              </div>

              <div className="space-y-4 text-sm text-cream-200">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-900/60 flex items-center justify-center shrink-0 border border-amber-700/40">
                    <MapPin className="w-4 h-4 text-turmeric-400" />
                  </div>
                  <div>
                    <strong className="text-cream-100 block">Dispatch & Milling Facility</strong>
                    <span className="text-xs text-cream-300">
                      Near Traditional Grain Market, Industrial Area, India
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-900/60 flex items-center justify-center shrink-0 border border-amber-700/40">
                    <Phone className="w-4 h-4 text-turmeric-400" />
                  </div>
                  <div>
                    <strong className="text-cream-100 block">Customer Helpline</strong>
                    <span className="text-xs text-cream-300">+91 98765 43210</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-900/60 flex items-center justify-center shrink-0 border border-amber-700/40">
                    <Mail className="w-4 h-4 text-turmeric-400" />
                  </div>
                  <div>
                    <strong className="text-cream-100 block">Email Address</strong>
                    <span className="text-xs text-cream-300">contact@annapurnaaahaar.in</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-900/60 flex items-center justify-center shrink-0 border border-amber-700/40">
                    <Clock className="w-4 h-4 text-turmeric-400" />
                  </div>
                  <div>
                    <strong className="text-cream-100 block">Milling & Support Hours</strong>
                    <span className="text-xs text-cream-300">
                      Monday to Saturday: 9:00 AM - 7:00 PM IST
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Wholesale Card */}
            <div className="bg-white rounded-3xl p-6 border border-amber-900/10 shadow-sm space-y-3">
              <span className="text-xs font-bold text-turmeric-800 bg-turmeric-100 px-2.5 py-1 rounded-full uppercase">
                Wholesale & Weddings
              </span>
              <h4 className="font-serif font-bold text-lg text-stone-900">
                Bulk Indian Food Supply
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Planning bulk orders for catering, restaurants, community events, or festive family gatherings? We provide customized 10kg to 100kg batch orders at wholesale rates.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
