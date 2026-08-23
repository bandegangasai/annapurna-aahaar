import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, ArrowLeft, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { SEOHead } from '../../components/common/SEOHead';

export const AdminLogin: React.FC = () => {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      showToast('Please enter your email and password.', 'error');
      return;
    }

    setIsLoading(true);
    try {
      await login(email.trim(), password);
      showToast('Welcome back to Annapurna Aahaar Admin Portal!', 'success');
      navigate('/admin/dashboard');
    } catch (err: any) {
      showToast(err.message || 'Login failed. Please verify credentials.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('admin@annapurnaaahaar.in');
    setPassword('Admin@Annapurna2026');
  };

  return (
    <div className="bg-[#FAF6EE] min-h-screen py-16 flex items-center justify-center px-4">
      <SEOHead
        title="Admin Portal Login | Annapurna Aahaar"
        description="Administrative access for Annapurna Aahaar store and order fulfillment."
      />

      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-heritage-maroon mb-6 bg-white px-4 py-2 rounded-full border border-heritage-gold/20 shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Storefront</span>
          </Link>

          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-heritage-gold to-heritage-antiqueGold p-0.5 mx-auto mb-3 shadow-md">
            <div className="w-full h-full rounded-full bg-heritage-maroon flex items-center justify-center border border-heritage-gold/40">
              <span className="font-serif font-black text-2xl text-heritage-gold">AA</span>
            </div>
          </div>

          <h1 className="font-serif font-black text-3xl text-heritage-maroon">
            Admin Management
          </h1>
          <p className="text-xs text-stone-600 mt-1">
            Annapurna Aahaar — Bhainsa, Nirmal District, Telangana (504103)
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border-2 border-heritage-gold/30 shadow-xl space-y-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">
                Admin Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="email"
                  required
                  placeholder="admin@annapurnaaahaar.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#FAF6EE] border border-heritage-gold/30 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-heritage-gold text-stone-900 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#FAF6EE] border border-heritage-gold/30 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-heritage-gold text-stone-900 font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-heritage-maroon to-heritage-darkMaroon hover:from-heritage-darkMaroon hover:to-heritage-maroon text-cream-100 py-3.5 rounded-2xl font-bold text-sm shadow-md transition-all disabled:opacity-50 border border-heritage-gold/30"
            >
              {isLoading ? 'Signing In...' : 'Sign In to Dashboard'}
            </button>
          </form>

          {/* Quick Demo Credentials Autofill */}
          <div className="pt-3 border-t border-stone-100 text-center">
            <button
              type="button"
              onClick={handleFillDemo}
              className="text-xs font-bold text-heritage-antiqueGold hover:text-heritage-maroon underline"
            >
              Autofill Default Admin Credentials
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-stone-500 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <span>Encrypted JWT Authentication & RBAC Session Security</span>
        </div>
      </div>
    </div>
  );
};
