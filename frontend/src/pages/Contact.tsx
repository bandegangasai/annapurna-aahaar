import React, { useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Send,
  CheckCircle2,
  Clock,
  ExternalLink,
  MessageSquare,
} from 'lucide-react';
import { SEOHead } from '../components/common/SEOHead';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';

export const Contact: React.FC = () => {
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const mapSearchUrl =
    'https://www.google.com/maps/search/?api=1&query=Bhainsa,+Nirmal+District,+Telangana+504103';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.phone.trim() || !formData.message.trim()) {
      showToast('Please fill out all required fields.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.submitContact(formData);
      if (res.success) {
        setIsSubmitted(true);
        showToast('Enquiry successfully submitted to Bande Omkar!', 'success');
        setFormData({ name: '', phone: '', email: '', subject: '', message: '' });
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to submit enquiry.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#FAF6EE] min-h-screen py-10 lg:py-16">
      <SEOHead
        title="Contact Us & Bulk Enquiries | Annapurna Aahaar — Bhainsa, Nirmal"
        description="Contact Bande Omkar at Annapurna Aahaar in Bhainsa, Nirmal District, Telangana. Phone: 6305970844 / 8688456925. Email: annapurnaaahaar@gmail.com."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-heritage-antiqueGold uppercase tracking-widest block mb-1">
            Get In Touch
          </span>
          <h1 className="font-serif font-black text-3xl sm:text-4xl text-heritage-maroon">
            Contact Annapurna Aahaar
          </h1>
          <p className="text-stone-600 text-sm sm:text-base mt-2">
            Reach out to <strong>Bande Omkar</strong> for retail orders, bulk supply enquiries, or product queries.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column: Real Verified Contact Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-heritage-gold/30 shadow-sm space-y-6">
              <h3 className="font-serif font-bold text-2xl text-heritage-maroon border-b border-stone-100 pb-3">
                Business Details
              </h3>

              {/* Owner */}
              <div>
                <span className="text-xs font-bold text-stone-500 uppercase">Proprietor / Owner</span>
                <p className="font-serif font-bold text-lg text-stone-900">Bande Omkar</p>
              </div>

              {/* Address */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-stone-500 uppercase">Registered Location</span>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-heritage-gold/20 flex items-center justify-center text-heritage-maroon shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-stone-800 text-sm">
                      Bhainsa, Nirmal District
                    </p>
                    <p className="text-xs text-stone-600">Telangana — 504103, India</p>
                    <a
                      href={mapSearchUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-bold text-heritage-maroon hover:underline mt-2"
                    >
                      <span>Open on Google Maps</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Phone Numbers */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-stone-500 uppercase">Direct Phone Lines</span>
                <div className="space-y-2">
                  <a
                    href="tel:6305970844"
                    className="flex items-center gap-3 p-3 rounded-2xl bg-[#FAF6EE] hover:bg-cream-200 border border-heritage-gold/25 transition-colors group"
                  >
                    <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs text-stone-500 block">Primary Helpline</span>
                      <span className="font-bold text-stone-900 text-sm group-hover:text-heritage-maroon">
                        +91 6305970844
                      </span>
                    </div>
                  </a>

                  <a
                    href="tel:8688456925"
                    className="flex items-center gap-3 p-3 rounded-2xl bg-[#FAF6EE] hover:bg-cream-200 border border-heritage-gold/25 transition-colors group"
                  >
                    <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs text-stone-500 block">Secondary Helpline</span>
                      <span className="font-bold text-stone-900 text-sm group-hover:text-heritage-maroon">
                        +91 8688456925
                      </span>
                    </div>
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-stone-500 uppercase">Email Enquiries</span>
                <a
                  href="mailto:annapurnaaahaar@gmail.com"
                  className="flex items-center gap-3 p-3 rounded-2xl bg-[#FAF6EE] hover:bg-cream-200 border border-heritage-gold/25 transition-colors group"
                >
                  <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs text-stone-500 block">Official Inbox</span>
                    <span className="font-bold text-stone-900 text-sm group-hover:text-heritage-maroon">
                      annapurnaaahaar@gmail.com
                    </span>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-white p-6 sm:p-10 rounded-3xl border border-heritage-gold/30 shadow-md">
              <h3 className="font-serif font-bold text-2xl text-heritage-maroon mb-2">
                Send Us a Message
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 mb-6">
                Fill out the form below and we will respond via call or email within 24 hours.
              </p>

              {isSubmitted ? (
                <div className="p-8 text-center bg-emerald-50 border border-emerald-300 rounded-3xl space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h4 className="font-serif font-bold text-xl text-emerald-900">
                    Thank You! Message Received
                  </h4>
                  <p className="text-xs text-emerald-800 max-w-sm mx-auto">
                    Your enquiry has been securely saved in our database. Bande Omkar will review your request promptly.
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="mt-4 bg-emerald-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-emerald-800 transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-stone-700 block mb-1">
                        Your Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Anand Rao"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2.5 bg-[#FAF6EE] border border-heritage-gold/30 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-heritage-gold text-stone-900 font-medium"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-stone-700 block mb-1">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="10-digit mobile number"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-2.5 bg-[#FAF6EE] border border-heritage-gold/30 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-heritage-gold text-stone-900 font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">
                      Email Address <span className="text-stone-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="email"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2.5 bg-[#FAF6EE] border border-heritage-gold/30 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-heritage-gold text-stone-900 font-medium"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">Subject</label>
                    <input
                      type="text"
                      placeholder="e.g. Bulk order enquiry for weddings / retail shop supply"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-2.5 bg-[#FAF6EE] border border-heritage-gold/30 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-heritage-gold text-stone-900 font-medium"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">
                      Message / Requirement <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Please specify product quantities or questions..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-2.5 bg-[#FAF6EE] border border-heritage-gold/30 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-heritage-gold text-stone-900 font-medium"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-heritage-maroon hover:bg-heritage-darkMaroon text-cream-100 py-4 rounded-2xl font-bold text-sm shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 border border-heritage-gold/30"
                  >
                    <Send className="w-4 h-4 text-heritage-gold" />
                    <span>{isSubmitting ? 'Sending Message...' : 'Submit Message'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
