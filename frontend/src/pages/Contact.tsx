import React, { useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Send,
  CheckCircle2,
  ExternalLink,
  CreditCard,
} from 'lucide-react';
import { SEOHead } from '../components/common/SEOHead';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';

export const Contact: React.FC = () => {
  const { showToast } = useToast();
  const { t } = useLanguage();

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
    <div className="bg-[#F8F3E7] min-h-screen py-10 lg:py-16 text-[#252525]">
      <SEOHead
        title="Contact Us | Annapurna Aahaar"
        description="Contact Annapurna Aahaar in Bhainsa, Nirmal District, Telangana (504103). 24/7 Telephone Helpline: 9347036152. Email: annapurnaaahaar@gmail.com."
        url="https://annapurnaaahaar.in/#/contact"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-[#C79A45] uppercase tracking-widest block mb-1">
            Get In Touch
          </span>
          <h1 className="font-serif font-black text-3xl sm:text-4xl text-[#173F35]">
            {t('contact_title')}
          </h1>
          <p className="text-stone-muted text-sm sm:text-base mt-2">
            {t('contact_subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column: Business & Phone Details */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#C79A45]/30 shadow-subtle space-y-6">
              <h3 className="font-serif font-bold text-2xl text-[#173F35] border-b border-stone-100 pb-3">
                {t('footer_contact_info')}
              </h3>

              {/* Owner */}
              <div>
                <span className="text-xs font-bold text-stone-muted uppercase">Proprietor / Founder</span>
                <p className="font-serif font-bold text-lg text-stone-primary">Bande Omkar</p>
              </div>

              {/* Address */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-stone-muted uppercase">Registered Location</span>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#173F35]/10 flex items-center justify-center text-[#173F35] shrink-0 border border-[#C79A45]/30">
                    <MapPin className="w-5 h-5 text-[#C79A45]" />
                  </div>
                  <div>
                    <p className="font-semibold text-stone-primary text-sm">
                      Bhainsa, Nirmal District
                    </p>
                    <p className="text-xs text-stone-muted">Telangana — 504103, India</p>
                    <a
                      href={mapSearchUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#173F35] hover:underline mt-2"
                    >
                      <span>Open on Google Maps</span>
                      <ExternalLink className="w-3 h-3 text-[#C79A45]" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Phone Numbers */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-stone-muted uppercase">Direct Phone Lines</span>
                <div className="space-y-2">
                  {/* Dedicated 24/7 IVR Phone Ordering Hotline */}
                  <a
                    href="tel:9347036152"
                    className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#FAF6EE] hover:bg-[#F1E9D5] border-2 border-[#C79A45] transition-all group shadow-xs"
                  >
                    <div className="w-10 h-10 rounded-2xl bg-[#173F35] flex items-center justify-center text-[#C79A45] shadow-xs">
                      <Phone className="w-5 h-5 animate-pulse" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-[#173F35] bg-[#C79A45]/25 px-2 py-0.5 rounded-full uppercase tracking-wider">
                          24/7 Voice IVR Hotline
                        </span>
                      </div>
                      <span className="font-serif font-black text-stone-primary text-base group-hover:text-[#173F35] block mt-0.5">
                        9347036152
                      </span>
                      <span className="text-[10px] text-stone-muted block">
                        English, मराठी, हिंदी, తెలుగు
                      </span>
                    </div>
                  </a>

                  {/* Payment Mobile */}
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#FAF6EE] border border-[#C79A45]/25">
                    <div className="w-9 h-9 rounded-xl bg-[#173F35]/10 flex items-center justify-center text-[#173F35]">
                      <CreditCard className="w-4 h-4 text-[#C79A45]" />
                    </div>
                    <div>
                      <span className="text-xs text-stone-muted block">{t('footer_payment_helpline')} (UPI: 9542836358@ybl)</span>
                      <span className="font-bold text-stone-primary text-sm">
                        9542836358
                      </span>
                    </div>
                  </div>

                  <a
                    href="tel:6305970844"
                    className="flex items-center gap-3 p-3 rounded-2xl bg-[#FAF6EE] hover:bg-[#F1E9D5] border border-[#C79A45]/25 transition-colors group"
                  >
                    <div className="w-9 h-9 rounded-xl bg-[#173F35]/10 flex items-center justify-center text-[#173F35]">
                      <Phone className="w-4 h-4 text-[#C79A45]" />
                    </div>
                    <div>
                      <span className="text-xs text-stone-muted block">Primary Kitchen Helpline</span>
                      <span className="font-bold text-stone-primary text-sm group-hover:text-[#173F35]">
                        +91 6305970844
                      </span>
                    </div>
                  </a>

                  <a
                    href="tel:8688456925"
                    className="flex items-center gap-3 p-3 rounded-2xl bg-[#FAF6EE] hover:bg-[#F1E9D5] border border-[#C79A45]/25 transition-colors group"
                  >
                    <div className="w-9 h-9 rounded-xl bg-[#173F35]/10 flex items-center justify-center text-[#173F35]">
                      <Phone className="w-4 h-4 text-[#C79A45]" />
                    </div>
                    <div>
                      <span className="text-xs text-stone-muted block">Secondary Kitchen Helpline</span>
                      <span className="font-bold text-stone-primary text-sm group-hover:text-[#173F35]">
                        +91 8688456925
                      </span>
                    </div>
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-stone-muted uppercase">Email Enquiries</span>
                <a
                  href="mailto:annapurnaaahaar@gmail.com"
                  className="flex items-center gap-3 p-3 rounded-2xl bg-[#FAF6EE] hover:bg-[#F1E9D5] border border-[#C79A45]/25 transition-colors group"
                >
                  <div className="w-9 h-9 rounded-xl bg-[#173F35]/10 flex items-center justify-center text-[#173F35]">
                    <Mail className="w-4 h-4 text-[#C79A45]" />
                  </div>
                  <div>
                    <span className="text-xs text-stone-muted block">Official Inbox</span>
                    <span className="font-bold text-stone-primary text-sm group-hover:text-[#173F35]">
                      annapurnaaahaar@gmail.com
                    </span>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-white p-6 sm:p-10 rounded-3xl border border-[#C79A45]/30 shadow-subtle">
              <h3 className="font-serif font-bold text-2xl text-[#173F35] mb-2">
                {t('contact_title')}
              </h3>
              <p className="text-xs sm:text-sm text-stone-muted mb-6">
                Fill in your contact details below and our team will get back to you promptly.
              </p>

              {isSubmitted ? (
                <div className="p-8 bg-[#FAF6EE] rounded-3xl border-2 border-[#C79A45]/40 text-center space-y-3">
                  <div className="w-14 h-14 bg-[#173F35] rounded-full flex items-center justify-center mx-auto text-[#C79A45]">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="font-serif font-bold text-xl text-[#173F35]">Thank You for Reaching Out!</h4>
                  <p className="text-xs text-stone-muted max-w-sm mx-auto">
                    Your message has been received by Bande Omkar. We will get back to your phone or email shortly.
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="mt-2 text-xs font-bold text-[#173F35] underline"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-stone-primary block mb-1">
                        {t('contact_name')} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Your full name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2.5 bg-[#FAF6EE] border border-[#C79A45]/30 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C79A45] text-stone-primary font-medium"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-stone-primary block mb-1">
                        {t('contact_phone')} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        placeholder="10-digit mobile number"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-2.5 bg-[#FAF6EE] border border-[#C79A45]/30 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C79A45] text-stone-primary font-medium"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-stone-primary block mb-1">
                        {t('contact_email')}
                      </label>
                      <input
                        type="email"
                        placeholder="yourname@gmail.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-2.5 bg-[#FAF6EE] border border-[#C79A45]/30 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C79A45] text-stone-primary font-medium"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-stone-primary block mb-1">
                        Subject
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Bulk order enquiry, Papad varieties"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-4 py-2.5 bg-[#FAF6EE] border border-[#C79A45]/30 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C79A45] text-stone-primary font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-stone-primary block mb-1">
                      {t('contact_message')} <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Write your message, order requirement, or feedback here..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-2.5 bg-[#FAF6EE] border border-[#C79A45]/30 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C79A45] text-stone-primary font-medium"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#173F35] hover:bg-[#0C241E] text-[#F8F3E7] py-3.5 rounded-2xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 border border-[#C79A45]/40 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>{t('contact_sending')}</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4 text-[#C79A45]" />
                        <span>{t('contact_btn_send')}</span>
                      </>
                    )}
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

export default Contact;
