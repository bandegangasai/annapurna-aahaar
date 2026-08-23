import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, ShieldCheck, ArrowLeft, AlertCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { SEOHead } from '../../components/common/SEOHead';

export const AdminLogin: React.FC = () => {
  const { login, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('admin@annapurnaaahaar.in');
  const [password, setPassword] = useState('Admin@Annapurna2026');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If already logged in, redirect to dashboard
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await login(email.trim(), password);
      showToast('Admin logged in successfully!', 'success');
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid admin credentials.');
      showToast(err.message || 'Login failed', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#FAF4EB] min-h-screen py-16 flex flex-col justify-center items-center px-4">
      <SEOHead title="Admin Login | Annapurna Aahaar" />

      <div className="max-w-md w-full space-y-8">
        <div className="text-center space-y-3">
          <Link to="/" className="inline-flex items-center gap-2 text-xs font-semibold text-stone-500 hover:text-heritage-maroon transition-colors mb-2">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Storefront</span>
          </Link>

          <div className="w-16 h-16 rounded-full bg-heritage-maroon text-cream-100 flex items-center justify-center mx-auto shadow-xl border-2 border-turmeric-400">
            <span className="font-serif font-black text-2xl text-turmeric-300">AA</span>
          </div>

          <h1 className="font-serif font-black text-3xl text-heritage-maroon">
            Admin Portal Login
          </h1>
          <p className="text-xs text-stone-600">
            Secure management of orders, customer enquiries, and catalog for Annapurna Aahaar.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-amber-900/10 shadow-xl space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 p-3.5 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@annapurnaaahaar.in"
                  className="w-full pl-10 pr-4 py-3 bg-cream-50 border border-amber-900/15 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-turmeric-500 text-stone-900 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-cream-50 border border-amber-900/15 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-turmeric-500 text-stone-900 font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-heritage-maroon to-turmeric-900 hover:from-turmeric-900 hover:to-heritage-maroon text-cream-100 py-3.5 rounded-xl font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-turmeric-400" />
                  <span>Sign In to Dashboard</span>
                </>
              )}
            </button>
          </form>

          {/* Seed Credentials Hint */}
          <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200/70 text-xs text-amber-950 space-y-1">
            <div className="flex items-center gap-1.5 font-bold">
              <Sparkles className="w-3.5 h-3.5 text-turmeric-700" />
              <span>Default Administrator Credentials:</span>
            </div>
            <div className="font-mono text-[11px] text-stone-700 pl-5">
              Email: <strong>admin@annapurnaaahaar.in</strong>
              <br />
              Password: <strong>Admin@Annapurna2026</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
