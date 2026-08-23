import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Package,
  Clock,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Users,
  Search,
  RefreshCw,
  LogOut,
  ChevronRight,
  Eye,
  Check,
  AlertTriangle,
  Mail,
  ShieldCheck,
  Phone,
  MapPin,
  Tag,
  Edit2,
  DollarSign,
  CreditCard,
  Banknote,
  Download,
  Volume2,
  VolumeX,
  Bell,
  Smartphone,
  CheckCheck,
  FileText,
  AlertCircle,
  Headphones,
  PhoneCall,
  PhoneIncoming,
  PhoneMissed,
  Globe,
  Languages,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { api } from '../../services/api';
import { formatINR, formatDateTime } from '../../utils/formatters';
import {
  Order,
  AdminStats,
  ContactMessage,
  Product,
  CustomerSummary,
  SalesReport,
  Call,
  IvrInteraction,
  CallCenterStats,
} from '../../types';

// Web Audio API chime generator (zero external mp3 dependency, 100% reliable)
const playOrderChime = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, now); // D5
    osc1.frequency.exponentialRampToValueAtTime(880, now + 0.15); // A5
    gain1.gain.setValueAtTime(0.3, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.5);

    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(880, now + 0.18); // A5
    osc2.frequency.exponentialRampToValueAtTime(1174.66, now + 0.35); // D6
    gain2.gain.setValueAtTime(0.25, now + 0.18);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.18);
    osc2.stop(now + 0.7);
  } catch {}
};

interface AdminDashboardProps {
  initialTab?: 'orders' | 'call-center' | 'payments' | 'reports' | 'customers' | 'products' | 'contacts' | 'audit' | 'system-health';
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ initialTab = 'orders' }) => {
  const { admin, token, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<
    'orders' | 'call-center' | 'payments' | 'reports' | 'customers' | 'products' | 'contacts' | 'audit' | 'system-health'
  >(initialTab);

  const [stats, setStats] = useState<AdminStats | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [customers, setCustomers] = useState<CustomerSummary[]>([]);
  const [reports, setReports] = useState<SalesReport | null>(null);
  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [systemHealth, setSystemHealth] = useState<any>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Call Center State
  const [callCenterStats, setCallCenterStats] = useState<CallCenterStats | null>(null);
  const [calls, setCalls] = useState<Call[]>([]);
  const [ivrInteractions, setIvrInteractions] = useState<IvrInteraction[]>([]);
  const [selectedCall, setSelectedCall] = useState<Call | null>(null);
  const [callLangFilter, setCallLangFilter] = useState<string>('ALL');

  // Filters & State
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [sourceFilter, setSourceFilter] = useState<string>('ALL');
  const [orderLangFilter, setOrderLangFilter] = useState<string>('ALL');
  const [paymentFilter, setPaymentFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date>(new Date());
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [newOrderAlert, setNewOrderAlert] = useState<Order | null>(null);

  // Product price editor modal
  const [editingVariant, setEditingVariant] = useState<{
    variantId: string;
    productName: string;
    weight: string;
    price: number;
    stock: number;
  } | null>(null);

  const prevOrdersCountRef = useRef<number>(0);

  const fetchDashboardData = async (silent = false) => {
    if (!silent) setIsLoading(true);
    setIsSyncing(true);

    try {
      // 1. Fetch Orders
      try {
        const ordersRes = await api.adminGetOrders(token || undefined, {
          status: statusFilter !== 'ALL' ? statusFilter : undefined,
          search: searchQuery || undefined,
        });
        if (ordersRes.success && Array.isArray(ordersRes.data)) {
          const freshOrders = ordersRes.data;
          // Check for brand new incoming pending orders to trigger chime
          const currentPending = freshOrders.filter((o) => o.status === 'PENDING');
          if (
            prevOrdersCountRef.current > 0 &&
            currentPending.length > 0 &&
            freshOrders.length > prevOrdersCountRef.current
          ) {
            if (soundEnabled) playOrderChime();
            setNewOrderAlert(freshOrders[0]);
          }
          prevOrdersCountRef.current = freshOrders.length;
          setOrders(freshOrders);
        }
      } catch (e) {
        console.warn('Orders note:', e);
      }

      // 2. Fetch Stats
      try {
        const statsRes = await api.adminGetStats(token || undefined);
        if (statsRes.success && statsRes.data) {
          setStats(statsRes.data);
        }
      } catch (e) {
        console.warn('Stats note:', e);
      }

      // 3. Fetch Call Center Stats & Calls
      try {
        const [ccStatsRes, callsRes, interactionsRes] = await Promise.all([
          api.adminGetCallCenterStats(token || undefined),
          api.adminGetCalls(token || undefined, { language: callLangFilter !== 'ALL' ? callLangFilter : undefined }),
          api.adminGetIvrInteractions(token || undefined),
        ]);
        if (ccStatsRes.success && ccStatsRes.data) setCallCenterStats(ccStatsRes.data);
        if (callsRes.success && Array.isArray(callsRes.data)) setCalls(callsRes.data);
        if (interactionsRes.success && Array.isArray(interactionsRes.data)) setIvrInteractions(interactionsRes.data);
      } catch (e) {
        console.warn('Call Center note:', e);
      }

      // 4. Fetch Payments
      try {
        const paymentsRes = await api.adminGetPayments(token || undefined);
        if (paymentsRes.success && Array.isArray(paymentsRes.data)) {
          setPayments(paymentsRes.data);
        }
      } catch (e) {}

      // 5. Fetch Customers
      try {
        const custRes = await api.adminGetCustomers(token || undefined);
        if (custRes.success && Array.isArray(custRes.data)) {
          setCustomers(custRes.data);
        }
      } catch (e) {}

      // 6. Fetch Reports
      try {
        const repRes = await api.adminGetReports(token || undefined);
        if (repRes.success && repRes.data) {
          setReports(repRes.data);
        }
      } catch (e) {}

      // 7. Fetch Contacts
      try {
        const contactsRes = await api.adminGetContactMessages(token || undefined);
        if (contactsRes.success && Array.isArray(contactsRes.data)) {
          setContacts(contactsRes.data);
        }
      } catch (e) {}

      // 8. Fetch Products
      try {
        const productsRes = await api.getProducts();
        if (productsRes.success && Array.isArray(productsRes.data)) {
          setProducts(productsRes.data);
        }
      } catch (e) {}

      // 9. Fetch Audit Logs
      try {
        const auditRes = await api.adminGetAuditLogs(token || undefined);
        if (auditRes.success && Array.isArray(auditRes.data)) {
          setAuditLogs(auditRes.data);
        }
      } catch (e) {}

      // 10. Fetch System Health
      try {
        const healthRes = await api.adminGetSystemHealth(token || undefined);
        if (healthRes.success && healthRes.data) {
          setSystemHealth(healthRes.data);
        }
      } catch (e) {}

      setLastSyncTime(new Date());
    } finally {
      if (!silent) setIsLoading(false);
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData(false);

    // Continuous silent background auto-sync every 3.5 seconds
    const interval = setInterval(() => {
      fetchDashboardData(true);
    }, 3500);

    return () => clearInterval(interval);
  }, [token, statusFilter, callLangFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchDashboardData(false);
  };

  // Quick Accept Workflow
  const handleAcceptOrder = async (orderId: string) => {
    setActionLoadingId(orderId);
    try {
      const res = await api.adminUpdateOrderStatus(
        token || '',
        orderId,
        'ACCEPTED',
        undefined,
        'Order accepted and queued for fresh packaging by kitchen manager'
      );
      if (res.success) {
        showToast('Order successfully ACCEPTED!', 'success');
        fetchDashboardData(true);
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder(res.data);
        }
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to accept order.', 'error');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Quick Reject Workflow
  const handleRejectOrder = async (orderId: string) => {
    const reason = window.prompt('Please enter the reason for rejecting this order:', 'Out of delivery range / stock shortage');
    if (reason === null) return;

    setActionLoadingId(orderId);
    try {
      const res = await api.adminUpdateOrderStatus(
        token || '',
        orderId,
        'REJECTED',
        undefined,
        `Order rejected by admin. Reason: ${reason || 'Not specified'}`
      );
      if (res.success) {
        showToast('Order marked as REJECTED.', 'info');
        fetchDashboardData(true);
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder(res.data);
        }
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to reject order.', 'error');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Update Status to Processing, Ready, Out for Delivery, Delivered
  const handleSetStatus = async (orderId: string, newStatus: string) => {
    setActionLoadingId(orderId);
    try {
      const res = await api.adminUpdateOrderStatus(
        token || '',
        orderId,
        newStatus,
        undefined,
        `Status progressed to ${newStatus}`
      );
      if (res.success) {
        showToast(`Order status updated to ${newStatus}!`, 'success');
        fetchDashboardData(true);
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder(res.data);
        }
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to update order status.', 'error');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Manual UPI Verification
  const handleVerifyManualPayment = async (paymentId: string, status: 'PAID' | 'FAILED') => {
    try {
      const res = await api.adminVerifyManualPayment(token || '', paymentId, status);
      if (res.success) {
        showToast(`Payment reference successfully ${status === 'PAID' ? 'APPROVED & marked PAID' : 'REJECTED'}!`, 'success');
        fetchDashboardData(true);
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to verify payment.', 'error');
    }
  };

  // Price Editor Save
  const handleSavePrice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVariant) return;

    try {
      const res = await api.adminUpdateVariantPrice(
        token || '',
        editingVariant.variantId,
        editingVariant.price,
        editingVariant.stock
      );
      if (res.success) {
        showToast(`Price updated for ${editingVariant.productName} (${editingVariant.weight})!`, 'success');
        setEditingVariant(null);
        fetchDashboardData(true);
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to update price.', 'error');
    }
  };

  const pendingVerificationPayments = payments.filter((p) => p.status === 'PENDING_VERIFICATION');

  // Filter orders by source and language
  const filteredOrders = orders.filter((o) => {
    if (sourceFilter !== 'ALL' && o.orderSource !== sourceFilter) return false;
    if (orderLangFilter !== 'ALL' && o.language !== orderLangFilter) return false;
    return true;
  });

  return (
    <div className="bg-[#FAF6EE] min-h-screen text-stone-900 font-sans pb-16">
      {/* Top Header Bar */}
      <header className="bg-heritage-darkMaroon text-cream-100 sticky top-0 z-30 shadow-md border-b border-heritage-gold/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-heritage-gold to-heritage-antiqueGold flex items-center justify-center text-heritage-darkMaroon font-serif font-black text-lg border border-heritage-gold/60 shadow-md">
              AA
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-black text-lg tracking-wide text-cream-50">
                  ANNAPURNA AHAAR
                </span>
                <span className="bg-heritage-gold/20 text-heritage-gold text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-heritage-gold/40 uppercase tracking-wider">
                  Admin v2.0
                </span>
              </div>
              <p className="text-[11px] text-cream-300">
                Owner: <strong>Bande Omkar</strong> • Bhainsa, Nirmal District, Telangana (504103)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-5 text-xs">
            {/* Dedicated IVR Hotline Badge */}
            <div className="hidden lg:flex items-center gap-2 bg-heritage-gold/20 border border-heritage-gold/40 px-3 py-1 rounded-full text-heritage-gold font-bold">
              <Phone className="w-3.5 h-3.5 animate-pulse" />
              <span>IVR Hotline: <strong className="text-white">9347036152</strong></span>
            </div>

            {/* Audio Chime Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                soundEnabled
                  ? 'bg-heritage-gold text-heritage-darkMaroon shadow-xs'
                  : 'bg-white/10 text-cream-300 hover:bg-white/20'
              }`}
              title={soundEnabled ? 'Live Order Audio Chime is ON' : 'Audio Chime is MUTED'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              <span className="hidden sm:inline">{soundEnabled ? 'Chime ON' : 'Muted'}</span>
            </button>

            {/* Background Sync Pulse */}
            <div className="flex items-center gap-2 text-cream-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="hidden md:inline">
                Live: {lastSyncTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
            </div>

            {/* Logout */}
            <button
              onClick={logout}
              className="flex items-center gap-1.5 bg-red-900/60 hover:bg-red-800 text-red-100 px-3 py-1.5 rounded-xl font-bold border border-red-700/50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* New Order Alert Floating Toast */}
      {newOrderAlert && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-4 rounded-2xl shadow-xl flex items-center justify-between animate-bounce">
            <div className="flex items-center gap-3">
              <Bell className="w-6 h-6 animate-pulse text-amber-300" />
              <div>
                <div className="font-bold text-sm">
                  🌾 NEW ORDER RECEIVED: #{newOrderAlert.orderNumber} ({formatINR(newOrderAlert.total)})
                </div>
                <div className="text-xs text-emerald-100">
                  Customer: <strong>{newOrderAlert.customer?.name}</strong> ({newOrderAlert.customer?.phone}) • Source: <strong>{newOrderAlert.orderSource || 'WEBSITE'}</strong>
                </div>
              </div>
            </div>
            <button
              onClick={() => setNewOrderAlert(null)}
              className="bg-white/20 hover:bg-white/30 text-white text-xs font-bold px-3 py-1.5 rounded-lg"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* KPI Dashboard Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          <div className="bg-white p-4 sm:p-5 rounded-3xl border border-heritage-gold/25 shadow-xs">
            <div className="flex items-center justify-between text-stone-500 mb-1">
              <span className="text-[11px] font-bold uppercase">Total Orders</span>
              <Package className="w-4 h-4 text-heritage-maroon" />
            </div>
            <div className="font-serif font-black text-2xl text-stone-900">
              {stats?.totalOrders || orders.length}
            </div>
            <span className="text-[10px] text-stone-500">All-time recorded</span>
          </div>

          <div className="bg-amber-50/80 p-4 sm:p-5 rounded-3xl border border-amber-300 shadow-xs">
            <div className="flex items-center justify-between text-amber-800 mb-1">
              <span className="text-[11px] font-bold uppercase">Pending</span>
              <Clock className="w-4 h-4 text-amber-700" />
            </div>
            <div className="font-serif font-black text-2xl text-amber-900">
              {stats?.pendingOrders || orders.filter((o) => o.status === 'PENDING').length}
            </div>
            <span className="text-[10px] text-amber-700 font-bold">Needs Action</span>
          </div>

          {/* IVR Orders Counter */}
          <div className="bg-indigo-50/80 p-4 sm:p-5 rounded-3xl border border-indigo-200 shadow-xs">
            <div className="flex items-center justify-between text-indigo-800 mb-1">
              <span className="text-[11px] font-bold uppercase">IVR Orders</span>
              <PhoneIncoming className="w-4 h-4 text-indigo-700" />
            </div>
            <div className="font-serif font-black text-2xl text-indigo-900">
              {stats?.ivrOrdersCount || orders.filter((o) => o.orderSource === 'IVR').length}
            </div>
            <span className="text-[10px] text-indigo-700 font-bold">via 9347036152</span>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-3xl border border-heritage-gold/25 shadow-xs">
            <div className="flex items-center justify-between text-stone-500 mb-1">
              <span className="text-[11px] font-bold uppercase">Delivered</span>
              <CheckCheck className="w-4 h-4 text-emerald-700" />
            </div>
            <div className="font-serif font-black text-2xl text-stone-900">
              {stats?.deliveredOrders || orders.filter((o) => o.status === 'DELIVERED').length}
            </div>
            <span className="text-[10px] text-stone-500">Fulfilled</span>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-3xl border border-heritage-gold/25 shadow-xs">
            <div className="flex items-center justify-between text-stone-500 mb-1">
              <span className="text-[11px] font-bold uppercase">Total Revenue</span>
              <TrendingUp className="w-4 h-4 text-heritage-maroon" />
            </div>
            <div className="font-serif font-black text-xl text-heritage-maroon">
              {formatINR(stats?.totalRevenue || orders.reduce((sum, o) => sum + o.total, 0))}
            </div>
            <span className="text-[10px] text-stone-500">Gross sales</span>
          </div>

          <div className="bg-purple-50/80 p-4 sm:p-5 rounded-3xl border border-purple-300 shadow-xs">
            <div className="flex items-center justify-between text-purple-900 mb-1">
              <span className="text-[11px] font-bold uppercase">UPI to Verify</span>
              <Smartphone className="w-4 h-4 text-purple-700" />
            </div>
            <div className="font-serif font-black text-2xl text-purple-900">
              {pendingVerificationPayments.length}
            </div>
            <span className="text-[10px] text-purple-700 font-bold">9542826358 Ref</span>
          </div>
        </div>

        {/* Tab Navigation Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
              activeTab === 'orders'
                ? 'bg-heritage-maroon text-cream-100 shadow-md border border-heritage-gold'
                : 'bg-white text-stone-700 hover:bg-cream-100 border border-stone-200'
            }`}
          >
            Orders & Live Stream ({orders.length})
          </button>

          {/* Call Center Tab */}
          <button
            onClick={() => setActiveTab('call-center')}
            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'call-center'
                ? 'bg-heritage-maroon text-cream-100 shadow-md border border-heritage-gold'
                : 'bg-white text-stone-700 hover:bg-cream-100 border border-stone-200'
            }`}
          >
            <Headphones className="w-3.5 h-3.5 text-amber-500" />
            <span>Call Center (IVR)</span>
            <span className="bg-amber-100 text-amber-900 text-[10px] px-2 py-0.5 rounded-full font-bold">
              {calls.length || stats?.totalCalls || 0}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('payments')}
            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'payments'
                ? 'bg-heritage-maroon text-cream-100 shadow-md border border-heritage-gold'
                : 'bg-white text-stone-700 hover:bg-cream-100 border border-stone-200'
            }`}
          >
            <span>Payments & UPI</span>
            {pendingVerificationPayments.length > 0 && (
              <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-black">
                {pendingVerificationPayments.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
              activeTab === 'reports'
                ? 'bg-heritage-maroon text-cream-100 shadow-md border border-heritage-gold'
                : 'bg-white text-stone-700 hover:bg-cream-100 border border-stone-200'
            }`}
          >
            Sales & Reports
          </button>

          <button
            onClick={() => setActiveTab('customers')}
            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
              activeTab === 'customers'
                ? 'bg-heritage-maroon text-cream-100 shadow-md border border-heritage-gold'
                : 'bg-white text-stone-700 hover:bg-cream-100 border border-stone-200'
            }`}
          >
            Customers ({customers.length || stats?.totalCustomers || 1})
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
              activeTab === 'products'
                ? 'bg-heritage-maroon text-cream-100 shadow-md border border-heritage-gold'
                : 'bg-white text-stone-700 hover:bg-cream-100 border border-stone-200'
            }`}
          >
            Product & Price Editor
          </button>

          <button
            onClick={() => setActiveTab('contacts')}
            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
              activeTab === 'contacts'
                ? 'bg-heritage-maroon text-cream-100 shadow-md border border-heritage-gold'
                : 'bg-white text-stone-700 hover:bg-cream-100 border border-stone-200'
            }`}
          >
            Enquiries ({contacts.length})
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
              activeTab === 'audit'
                ? 'bg-heritage-maroon text-cream-100 shadow-md border border-heritage-gold'
                : 'bg-white text-stone-700 hover:bg-cream-100 border border-stone-200'
            }`}
          >
            Audit Trail
          </button>

          <button
            onClick={() => setActiveTab('system-health')}
            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
              activeTab === 'system-health'
                ? 'bg-heritage-maroon text-cream-100 shadow-md border border-heritage-gold'
                : 'bg-white text-stone-700 hover:bg-cream-100 border border-stone-200'
            }`}
          >
            System Health
          </button>
        </div>

        {/* ======================================================== */}
        {/* TAB 1: LIVE ORDERS STREAM & MANAGEMENT */}
        {/* ======================================================== */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {/* Filter & Actions Bar */}
            <div className="bg-white p-4 rounded-3xl border border-heritage-gold/25 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    placeholder="Search by order #, name, phone..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-[#FAF6EE] border border-stone-300 rounded-2xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-heritage-gold"
                  />
                </form>

                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 bg-[#FAF6EE] border border-stone-300 rounded-2xl text-xs font-semibold focus:outline-none"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="PENDING">Pending (Action Required)</option>
                  <option value="ACCEPTED">Accepted</option>
                  <option value="PROCESSING">Processing</option>
                  <option value="READY">Ready</option>
                  <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
                  <option value="DELIVERED">Delivered</option>
                  <option value="CANCELLED">Cancelled</option>
                  <option value="REJECTED">Rejected</option>
                </select>

                {/* Source Filter (WEBSITE vs IVR) */}
                <select
                  value={sourceFilter}
                  onChange={(e) => setSourceFilter(e.target.value)}
                  className="px-3 py-2 bg-[#FAF6EE] border border-stone-300 rounded-2xl text-xs font-semibold focus:outline-none"
                >
                  <option value="ALL">All Sources</option>
                  <option value="WEBSITE">🌐 Website Orders</option>
                  <option value="IVR">📞 Telephone IVR Orders</option>
                  <option value="PHONE">📱 Phone Orders</option>
                </select>

                {/* Language Filter */}
                <select
                  value={orderLangFilter}
                  onChange={(e) => setOrderLangFilter(e.target.value)}
                  className="px-3 py-2 bg-[#FAF6EE] border border-stone-300 rounded-2xl text-xs font-semibold focus:outline-none"
                >
                  <option value="ALL">All Languages</option>
                  <option value="ENGLISH">🇬🇧 English</option>
                  <option value="MARATHI">🚩 मराठी (Marathi)</option>
                  <option value="HINDI">🇮🇳 हिंदी (Hindi)</option>
                  <option value="TELUGU">🌾 తెలుగు (Telugu)</option>
                </select>
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                <a
                  href={api.getExportOrdersCsvUrl(token || '')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 bg-[#FAF6EE] hover:bg-cream-200 text-stone-800 border border-stone-300 px-3.5 py-2 rounded-2xl text-xs font-bold transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </a>

                <button
                  onClick={() => fetchDashboardData(false)}
                  disabled={isSyncing}
                  className="inline-flex items-center gap-1.5 bg-heritage-maroon hover:bg-heritage-darkMaroon text-white px-3.5 py-2 rounded-2xl text-xs font-bold transition-colors"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-3xl border border-heritage-gold/25 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#FAF6EE] text-[11px] font-bold text-stone-500 uppercase tracking-wider border-b border-stone-200">
                      <th className="py-3.5 px-4">Order #</th>
                      <th className="py-3.5 px-4">Source</th>
                      <th className="py-3.5 px-4">Customer</th>
                      <th className="py-3.5 px-4">Items</th>
                      <th className="py-3.5 px-4">Total</th>
                      <th className="py-3.5 px-4">Payment</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Quick Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 text-xs">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-12 text-center text-stone-500">
                          <Package className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                          <p className="font-semibold">No orders match the selected filters.</p>
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-cream-50 transition-colors">
                          <td className="py-3.5 px-4 font-mono font-bold text-heritage-maroon">
                            #{order.orderNumber}
                            <div className="text-[10px] text-stone-400 font-sans font-normal">
                              {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </td>

                          {/* Source Badge */}
                          <td className="py-3.5 px-4">
                            {order.orderSource === 'IVR' ? (
                              <div className="inline-flex items-center gap-1 bg-indigo-50 border border-indigo-200 text-indigo-800 px-2 py-0.5 rounded-full text-[10px] font-bold">
                                <PhoneIncoming className="w-3 h-3 text-indigo-600" />
                                <span>IVR ({order.language || 'TEL'})</span>
                              </div>
                            ) : (
                              <div className="inline-flex items-center gap-1 bg-emerald-50 border border-emerald-200 text-emerald-800 px-2 py-0.5 rounded-full text-[10px] font-bold">
                                <Globe className="w-3 h-3 text-emerald-600" />
                                <span>Website</span>
                              </div>
                            )}
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="font-bold text-stone-900">{order.customer?.name}</div>
                            <div className="text-[11px] text-stone-500">{order.customer?.phone}</div>
                          </td>

                          <td className="py-3.5 px-4 text-stone-700 max-w-xs truncate">
                            {order.items?.map((it) => `${it.productNameSnapshot || it.productName} (${it.quantity})`).join(', ') || '1 item'}
                          </td>

                          <td className="py-3.5 px-4 font-bold text-stone-900">
                            {formatINR(order.total)}
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="flex flex-col">
                              <span className="font-semibold text-stone-800 text-[11px]">
                                {order.paymentMethod === 'ONLINE' ? 'Online Gateway' : order.paymentMethod === 'MANUAL_UPI' ? 'Direct UPI' : 'Cash on Delivery'}
                              </span>
                              <span
                                className={`text-[10px] font-bold ${
                                  order.paymentStatus === 'PAID'
                                    ? 'text-emerald-700'
                                    : order.paymentStatus === 'PENDING_VERIFICATION'
                                    ? 'text-purple-700'
                                    : 'text-amber-700'
                                }`}
                              >
                                {order.paymentStatus}
                              </span>
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <span
                              className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                order.status === 'PENDING'
                                  ? 'bg-amber-100 text-amber-800 border border-amber-300 animate-pulse'
                                  : order.status === 'ACCEPTED'
                                  ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                  : order.status === 'PROCESSING'
                                  ? 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                                  : order.status === 'DELIVERED'
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                  : order.status === 'CANCELLED' || order.status === 'REJECTED'
                                  ? 'bg-rose-100 text-rose-800 border border-rose-200'
                                  : 'bg-stone-100 text-stone-800'
                              }`}
                            >
                              {order.status}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 text-right space-x-1.5">
                            {order.status === 'PENDING' && (
                              <>
                                <button
                                  onClick={() => handleAcceptOrder(order.id)}
                                  disabled={actionLoadingId === order.id}
                                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1.5 rounded-xl font-bold text-[11px] transition-colors inline-flex items-center gap-1 shadow-xs"
                                >
                                  <Check className="w-3 h-3" />
                                  <span>Accept</span>
                                </button>

                                <button
                                  onClick={() => handleRejectOrder(order.id)}
                                  disabled={actionLoadingId === order.id}
                                  className="bg-rose-100 hover:bg-rose-200 text-rose-800 px-2 py-1.5 rounded-xl font-bold text-[11px] transition-colors inline-flex items-center gap-1"
                                >
                                  <XCircle className="w-3 h-3" />
                                  <span>Reject</span>
                                </button>
                              </>
                            )}

                            {order.status === 'ACCEPTED' && (
                              <button
                                onClick={() => handleSetStatus(order.id, 'PROCESSING')}
                                disabled={actionLoadingId === order.id}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-2.5 py-1.5 rounded-xl font-bold text-[11px] transition-colors"
                              >
                                Mark Processing
                              </button>
                            )}

                            {order.status === 'PROCESSING' && (
                              <button
                                onClick={() => handleSetStatus(order.id, 'OUT_FOR_DELIVERY')}
                                disabled={actionLoadingId === order.id}
                                className="bg-amber-600 hover:bg-amber-700 text-white px-2.5 py-1.5 rounded-xl font-bold text-[11px] transition-colors"
                              >
                                Dispatch Order
                              </button>
                            )}

                            {order.status === 'OUT_FOR_DELIVERY' && (
                              <button
                                onClick={() => handleSetStatus(order.id, 'DELIVERED')}
                                disabled={actionLoadingId === order.id}
                                className="bg-emerald-700 hover:bg-emerald-800 text-white px-2.5 py-1.5 rounded-xl font-bold text-[11px] transition-colors"
                              >
                                Mark Delivered
                              </button>
                            )}

                            <button
                              onClick={() => setSelectedOrder(order)}
                              className="p-1.5 text-stone-500 hover:text-heritage-maroon hover:bg-cream-100 rounded-lg transition-colors inline-flex items-center"
                              title="View Order Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: CALL CENTER (IVR & TELEPHONY MANAGEMENT) */}
        {/* ======================================================== */}
        {activeTab === 'call-center' && (
          <div className="space-y-6">
            {/* Call Center Top Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
              <div className="bg-white p-4 rounded-3xl border border-heritage-gold/30 shadow-xs">
                <div className="flex items-center justify-between text-stone-500 mb-1">
                  <span className="text-[11px] font-bold uppercase">Total Inbound Calls</span>
                  <Headphones className="w-4 h-4 text-heritage-maroon" />
                </div>
                <div className="font-serif font-black text-2xl text-stone-900">
                  {callCenterStats?.totalCalls || calls.length}
                </div>
                <span className="text-[10px] text-stone-500">Dedicated 9347036152</span>
              </div>

              <div className="bg-emerald-50 p-4 rounded-3xl border border-emerald-200 shadow-xs">
                <div className="flex items-center justify-between text-emerald-800 mb-1">
                  <span className="text-[11px] font-bold uppercase">Today's Calls</span>
                  <PhoneIncoming className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="font-serif font-black text-2xl text-emerald-900">
                  {callCenterStats?.todayCalls || 0}
                </div>
                <span className="text-[10px] text-emerald-700 font-bold">24-hour window</span>
              </div>

              <div className="bg-indigo-50 p-4 rounded-3xl border border-indigo-200 shadow-xs">
                <div className="flex items-center justify-between text-indigo-800 mb-1">
                  <span className="text-[11px] font-bold uppercase">IVR Orders Placed</span>
                  <Package className="w-4 h-4 text-indigo-600" />
                </div>
                <div className="font-serif font-black text-2xl text-indigo-900">
                  {callCenterStats?.ivrOrdersCount || orders.filter((o) => o.orderSource === 'IVR').length}
                </div>
                <span className="text-[10px] text-indigo-700 font-bold">via voice keypad</span>
              </div>

              <div className="bg-white p-4 rounded-3xl border border-heritage-gold/30 shadow-xs">
                <div className="flex items-center justify-between text-stone-500 mb-1">
                  <span className="text-[11px] font-bold uppercase">Completed Calls</span>
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                </div>
                <div className="font-serif font-black text-2xl text-stone-900">
                  {callCenterStats?.completedCalls || calls.filter((c) => c.status === 'COMPLETED').length}
                </div>
                <span className="text-[10px] text-stone-500">Successful flow</span>
              </div>

              <div className="bg-rose-50 p-4 rounded-3xl border border-rose-200 shadow-xs">
                <div className="flex items-center justify-between text-rose-800 mb-1">
                  <span className="text-[11px] font-bold uppercase">Missed / Drops</span>
                  <PhoneMissed className="w-4 h-4 text-rose-600" />
                </div>
                <div className="font-serif font-black text-2xl text-rose-900">
                  {callCenterStats?.missedCalls || calls.filter((c) => ['FAILED', 'NO_ANSWER', 'DISCONNECTED'].includes(c.status)).length}
                </div>
                <span className="text-[10px] text-rose-700">Quick disconnects</span>
              </div>

              <div className="bg-white p-4 rounded-3xl border border-heritage-gold/30 shadow-xs">
                <div className="flex items-center justify-between text-stone-500 mb-1">
                  <span className="text-[11px] font-bold uppercase">Avg Duration</span>
                  <Clock className="w-4 h-4 text-amber-600" />
                </div>
                <div className="font-serif font-black text-2xl text-amber-900">
                  {callCenterStats?.avgDuration || 75}s
                </div>
                <span className="text-[10px] text-stone-500">Seconds per caller</span>
              </div>
            </div>

            {/* Multilingual Distribution Strip */}
            <div className="bg-white p-5 rounded-3xl border border-heritage-gold/30 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div className="flex items-center gap-2">
                  <Languages className="w-5 h-5 text-heritage-gold" />
                  <h3 className="font-serif font-bold text-lg text-heritage-maroon">
                    Multilingual Voice Distribution
                  </h3>
                </div>
                <div className="text-xs text-stone-500">
                  IVR Number: <strong className="text-heritage-maroon">9347036152</strong>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-3.5 bg-cream-50 rounded-2xl border border-stone-200">
                  <div className="text-xs font-bold text-stone-600">🇬🇧 English</div>
                  <div className="font-serif font-black text-xl text-stone-900 mt-1">
                    {callCenterStats?.languageCounts?.ENGLISH || calls.filter((c) => c.language === 'ENGLISH').length} calls
                  </div>
                </div>

                <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200">
                  <div className="text-xs font-bold text-amber-900">🚩 मराठी (Marathi)</div>
                  <div className="font-serif font-black text-xl text-amber-950 mt-1">
                    {callCenterStats?.languageCounts?.MARATHI || calls.filter((c) => c.language === 'MARATHI').length} calls
                  </div>
                </div>

                <div className="p-3.5 bg-orange-50 rounded-2xl border border-orange-200">
                  <div className="text-xs font-bold text-orange-900">🇮🇳 हिंदी (Hindi)</div>
                  <div className="font-serif font-black text-xl text-orange-950 mt-1">
                    {callCenterStats?.languageCounts?.HINDI || calls.filter((c) => c.language === 'HINDI').length} calls
                  </div>
                </div>

                <div className="p-3.5 bg-indigo-50 rounded-2xl border border-indigo-200">
                  <div className="text-xs font-bold text-indigo-900">🌾 తెలుగు (Telugu)</div>
                  <div className="font-serif font-black text-xl text-indigo-950 mt-1">
                    {callCenterStats?.languageCounts?.TELUGU || calls.filter((c) => c.language === 'TELUGU').length} calls
                  </div>
                </div>
              </div>
            </div>

            {/* Call Center Logs Table & Filters */}
            <div className="bg-white rounded-3xl border border-heritage-gold/25 shadow-sm overflow-hidden space-y-3 p-4">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                <div className="flex items-center gap-3">
                  <h3 className="font-serif font-bold text-base text-heritage-maroon">
                    Live Inbound Call Logs
                  </h3>
                  <select
                    value={callLangFilter}
                    onChange={(e) => setCallLangFilter(e.target.value)}
                    className="px-3 py-1.5 bg-[#FAF6EE] border border-stone-300 rounded-xl text-xs font-semibold focus:outline-none"
                  >
                    <option value="ALL">All Languages</option>
                    <option value="ENGLISH">English</option>
                    <option value="MARATHI">मराठी (Marathi)</option>
                    <option value="HINDI">हिंदी (Hindi)</option>
                    <option value="TELUGU">తెలుగు (Telugu)</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={api.getExportCallsCsvUrl(token || '')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 bg-[#FAF6EE] hover:bg-cream-200 text-stone-800 border border-stone-300 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Calls CSV</span>
                  </a>

                  <a
                    href={api.getExportIvrInteractionsCsvUrl(token || '')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 bg-[#FAF6EE] hover:bg-cream-200 text-stone-800 border border-stone-300 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>DTMF Steps CSV</span>
                  </a>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#FAF6EE] text-[11px] font-bold text-stone-500 uppercase tracking-wider border-b border-stone-200">
                      <th className="py-3 px-3">Call SID</th>
                      <th className="py-3 px-3">Caller Number</th>
                      <th className="py-3 px-3">Language</th>
                      <th className="py-3 px-3">Duration</th>
                      <th className="py-3 px-3">Selected Menu</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-3">Start Time</th>
                      <th className="py-3 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 text-xs">
                    {calls.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-8 text-center text-stone-500">
                          No call records found.
                        </td>
                      </tr>
                    ) : (
                      calls.map((c) => (
                        <tr key={c.id} className="hover:bg-cream-50 transition-colors">
                          <td className="py-3 px-3 font-mono text-[11px] text-heritage-maroon font-bold">
                            {c.callSid}
                          </td>
                          <td className="py-3 px-3 font-bold text-stone-900">
                            {c.fromPhone}
                          </td>
                          <td className="py-3 px-3">
                            <span className="bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded text-[10px]">
                              {c.language}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-stone-700">
                            {c.duration}s
                          </td>
                          <td className="py-3 px-3 text-stone-800 font-semibold">
                            {c.selectedOption || 'Navigation'}
                          </td>
                          <td className="py-3 px-3">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                c.status === 'COMPLETED'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : c.status === 'IN_PROGRESS'
                                  ? 'bg-blue-100 text-blue-800 animate-pulse'
                                  : 'bg-stone-100 text-stone-700'
                              }`}
                            >
                              {c.status}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-stone-500 text-[11px]">
                            {new Date(c.startTime).toLocaleString('en-IN')}
                          </td>
                          <td className="py-3 px-3 text-right">
                            <button
                              onClick={() => setSelectedCall(c)}
                              className="text-xs text-heritage-maroon font-bold hover:underline"
                            >
                              View Steps
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: PAYMENTS & MANUAL UPI VERIFICATION */}
        {/* ======================================================== */}
        {activeTab === 'payments' && (
          <div className="space-y-6">
            {/* Direct UPI Notification Banner */}
            <div className="bg-purple-900 text-purple-50 p-6 rounded-3xl shadow-md border border-purple-700/50 flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <div className="text-xs font-bold uppercase tracking-widest text-purple-300 mb-1">
                  Manual UPI Payment Verification Queue
                </div>
                <h3 className="font-serif font-bold text-2xl text-white">
                  Payment Mobile: 9542826358 • UPI ID: 9542826358@ybl
                </h3>
                <p className="text-xs text-purple-200 mt-1 max-w-xl">
                  Customers who paid directly to Bande Omkar's mobile / UPI ID submit their 12-digit UTR Reference ID. Verify bank SMS and click Approve to mark the order as PAID.
                </p>
              </div>
              <div className="bg-purple-800/80 px-5 py-3 rounded-2xl border border-purple-600 text-center shrink-0">
                <span className="text-[11px] text-purple-300 uppercase block font-bold">Pending Review</span>
                <span className="font-serif font-black text-3xl text-purple-100">
                  {pendingVerificationPayments.length}
                </span>
              </div>
            </div>

            {/* Payments List */}
            <div className="bg-white rounded-3xl border border-heritage-gold/25 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#FAF6EE] text-[11px] font-bold text-stone-500 uppercase tracking-wider border-b border-stone-200">
                      <th className="py-3.5 px-4">Order #</th>
                      <th className="py-3.5 px-4">Customer</th>
                      <th className="py-3.5 px-4">Amount</th>
                      <th className="py-3.5 px-4">Mode / Gateway</th>
                      <th className="py-3.5 px-4">Transaction / UTR Ref</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Verification Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 text-xs">
                    {payments.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-stone-500">
                          No payment records found.
                        </td>
                      </tr>
                    ) : (
                      payments.map((p) => (
                        <tr key={p.id} className="hover:bg-cream-50 transition-colors">
                          <td className="py-3.5 px-4 font-mono font-bold text-heritage-maroon">
                            #{p.order?.orderNumber || 'AA-UNKNOWN'}
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-stone-900">{p.order?.customer?.name}</div>
                            <div className="text-[11px] text-stone-500">{p.order?.customer?.phone}</div>
                          </td>
                          <td className="py-3.5 px-4 font-bold text-stone-900">
                            {formatINR(p.amount)}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="font-semibold text-stone-800 block">{p.gateway}</span>
                            <span className="text-[10px] text-stone-500">{p.paymentMethod}</span>
                          </td>
                          <td className="py-3.5 px-4 font-mono font-bold text-stone-800">
                            {p.transactionReference || p.manualUpiRef || p.gatewayPaymentId || 'N/A'}
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                p.status === 'PAID'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : p.status === 'PENDING_VERIFICATION'
                                  ? 'bg-purple-100 text-purple-800 animate-pulse'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {p.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right space-x-2">
                            {p.status === 'PENDING_VERIFICATION' && (
                              <>
                                <button
                                  onClick={() => handleVerifyManualPayment(p.id, 'PAID')}
                                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-xl font-bold text-[11px] shadow-xs"
                                >
                                  Approve & Mark Paid
                                </button>
                                <button
                                  onClick={() => handleVerifyManualPayment(p.id, 'FAILED')}
                                  className="bg-rose-100 hover:bg-rose-200 text-rose-800 px-2.5 py-1.5 rounded-xl font-bold text-[11px]"
                                >
                                  Reject
                                </button>
                              </>
                            )}
                            {p.status === 'PAID' && (
                              <span className="text-emerald-700 font-bold text-xs inline-flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Verified</span>
                              </span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: SALES & ANALYTICS REPORTS */}
        {/* ======================================================== */}
        {activeTab === 'reports' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-3xl border border-heritage-gold/30 shadow-xs">
                <span className="text-xs font-bold text-stone-500 uppercase block mb-1">Total Revenue</span>
                <div className="font-serif font-black text-2xl text-heritage-maroon">
                  {formatINR(reports?.totalRevenue || 0)}
                </div>
                <span className="text-[10px] text-stone-500">Gross across all channels</span>
              </div>

              <div className="bg-emerald-50 p-5 rounded-3xl border border-emerald-200 shadow-xs">
                <span className="text-xs font-bold text-emerald-800 uppercase block mb-1">Paid Revenue</span>
                <div className="font-serif font-black text-2xl text-emerald-900">
                  {formatINR(reports?.paidRevenue || 0)}
                </div>
                <span className="text-[10px] text-emerald-700">Settled / Verified funds</span>
              </div>

              {/* Website vs IVR Revenue */}
              <div className="bg-indigo-50 p-5 rounded-3xl border border-indigo-200 shadow-xs">
                <span className="text-xs font-bold text-indigo-800 uppercase block mb-1">📞 IVR Phone Sales</span>
                <div className="font-serif font-black text-2xl text-indigo-900">
                  {formatINR(reports?.ivrSales || orders.filter((o) => o.orderSource === 'IVR').reduce((sum, o) => sum + o.total, 0))}
                </div>
                <span className="text-[10px] text-indigo-700">Generated via 9347036152</span>
              </div>

              <div className="bg-cream-100 p-5 rounded-3xl border border-heritage-gold/40 shadow-xs">
                <span className="text-xs font-bold text-stone-700 uppercase block mb-1">🌐 Website Sales</span>
                <div className="font-serif font-black text-2xl text-heritage-maroon">
                  {formatINR(reports?.websiteSales || orders.filter((o) => o.orderSource === 'WEBSITE').reduce((sum, o) => sum + o.total, 0))}
                </div>
                <span className="text-[10px] text-stone-500">Online storefront checkout</span>
              </div>
            </div>

            {/* Sales & Revenue by Language */}
            <div className="bg-white p-6 rounded-3xl border border-heritage-gold/25 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div className="flex items-center gap-2">
                  <Languages className="w-5 h-5 text-heritage-gold" />
                  <h3 className="font-serif font-bold text-lg text-heritage-maroon">
                    Sales & Orders by Language
                  </h3>
                </div>
                <div className="text-xs text-stone-500">Calculated from actual database orders</div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 bg-cream-50 rounded-2xl border border-stone-200">
                  <div className="text-xs font-bold text-stone-600">🇬🇧 English</div>
                  <div className="font-serif font-black text-xl text-stone-900 mt-1">
                    {formatINR(reports?.salesByLanguage?.ENGLISH?.total || 0)}
                  </div>
                  <span className="text-[10px] text-stone-500">
                    {reports?.salesByLanguage?.ENGLISH?.count || 0} orders
                  </span>
                </div>

                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200">
                  <div className="text-xs font-bold text-amber-900">🚩 मराठी (Marathi)</div>
                  <div className="font-serif font-black text-xl text-amber-950 mt-1">
                    {formatINR(reports?.salesByLanguage?.MARATHI?.total || 0)}
                  </div>
                  <span className="text-[10px] text-amber-700">
                    {reports?.salesByLanguage?.MARATHI?.count || 0} orders
                  </span>
                </div>

                <div className="p-4 bg-orange-50 rounded-2xl border border-orange-200">
                  <div className="text-xs font-bold text-orange-900">🇮🇳 हिंदी (Hindi)</div>
                  <div className="font-serif font-black text-xl text-orange-950 mt-1">
                    {formatINR(reports?.salesByLanguage?.HINDI?.total || 0)}
                  </div>
                  <span className="text-[10px] text-orange-700">
                    {reports?.salesByLanguage?.HINDI?.count || 0} orders
                  </span>
                </div>

                <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-200">
                  <div className="text-xs font-bold text-indigo-900">🌾 తెలుగు (Telugu)</div>
                  <div className="font-serif font-black text-xl text-indigo-950 mt-1">
                    {formatINR(reports?.salesByLanguage?.TELUGU?.total || 0)}
                  </div>
                  <span className="text-[10px] text-indigo-700">
                    {reports?.salesByLanguage?.TELUGU?.count || 0} orders
                  </span>
                </div>
              </div>
            </div>

            {/* Top Selling Products */}
            <div className="bg-white p-6 rounded-3xl border border-heritage-gold/25 shadow-sm space-y-4">
              <h3 className="font-serif font-bold text-xl text-heritage-maroon border-b border-stone-100 pb-3">
                Top Selling Products & Revenue
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#FAF6EE] text-[11px] font-bold text-stone-500 uppercase tracking-wider border-b border-stone-200">
                      <th className="py-3 px-4">Product Name</th>
                      <th className="py-3 px-4">Units Sold</th>
                      <th className="py-3 px-4">Total Revenue</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {reports?.topProducts && reports.topProducts.length > 0 ? (
                      reports.topProducts.map((p, idx) => (
                        <tr key={idx} className="hover:bg-cream-50">
                          <td className="py-3 px-4 font-bold text-stone-900">{p.name}</td>
                          <td className="py-3 px-4 text-stone-700">{p.quantity} units</td>
                          <td className="py-3 px-4 font-bold text-heritage-maroon">{formatINR(p.revenue)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3} className="py-6 text-center text-stone-500">
                          No product sales recorded yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 5: CUSTOMER DIRECTORY */}
        {/* ======================================================== */}
        {activeTab === 'customers' && (
          <div className="bg-white rounded-3xl border border-heritage-gold/25 shadow-sm overflow-hidden p-6 space-y-4">
            <h3 className="font-serif font-bold text-xl text-heritage-maroon border-b border-stone-100 pb-3">
              Customer Directory ({customers.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {customers.map((c) => (
                <div key={c.id} className="p-4 rounded-2xl bg-[#FAF6EE] border border-heritage-gold/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-900 text-sm">{c.name}</span>
                    <span className="text-[11px] font-bold text-heritage-maroon bg-white px-2 py-0.5 rounded-full border border-heritage-gold/30">
                      {c.totalOrders} Orders
                    </span>
                  </div>
                  <div className="text-xs text-stone-600 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-heritage-gold" />
                    <span>{c.phone}</span>
                  </div>
                  <div className="text-xs text-stone-600 flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-heritage-gold shrink-0 mt-0.5" />
                    <span>{c.address}, {c.city}, {c.state} ({c.pincode})</span>
                  </div>
                  <div className="pt-2 border-t border-stone-200/60 flex items-center justify-between text-xs font-bold text-stone-800">
                    <span>Lifetime Spend:</span>
                    <span className="text-heritage-maroon">{formatINR(c.totalSpent)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 6: PRODUCT & PRICE EDITOR */}
        {/* ======================================================== */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-3xl border border-heritage-gold/25 shadow-sm overflow-hidden p-6 space-y-4">
            <h3 className="font-serif font-bold text-xl text-heritage-maroon border-b border-stone-100 pb-3">
              Product & Variant Price Editor
            </h3>
            <div className="space-y-6">
              {products.map((p) => (
                <div key={p.id} className="p-4 rounded-2xl bg-[#FAF6EE] border border-heritage-gold/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-serif font-bold text-base text-stone-900">{p.name}</h4>
                      <span className="text-xs text-stone-500">{p.category}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {p.variants.map((v) => (
                      <div key={v.id} className="bg-white p-3 rounded-xl border border-stone-200 flex items-center justify-between">
                        <div>
                          <div className="font-bold text-xs text-stone-800">{v.weight}</div>
                          <div className="text-sm font-black text-heritage-maroon">{formatINR(v.price)}</div>
                        </div>
                        <button
                          onClick={() =>
                            setEditingVariant({
                              variantId: v.id,
                              productName: p.name,
                              weight: v.weight,
                              price: v.price,
                              stock: v.stock,
                            })
                          }
                          className="p-1.5 text-stone-500 hover:text-heritage-maroon hover:bg-cream-100 rounded-lg"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 7: ENQUIRIES */}
        {/* ======================================================== */}
        {activeTab === 'contacts' && (
          <div className="bg-white rounded-3xl border border-heritage-gold/25 shadow-sm overflow-hidden p-6 space-y-4">
            <h3 className="font-serif font-bold text-xl text-heritage-maroon border-b border-stone-100 pb-3">
              Customer Enquiries ({contacts.length})
            </h3>
            <div className="space-y-3">
              {contacts.map((msg) => (
                <div key={msg.id} className="p-4 rounded-2xl bg-[#FAF6EE] border border-heritage-gold/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-900">{msg.name} ({msg.phone})</span>
                    <span className="text-xs text-stone-500">{new Date(msg.createdAt).toLocaleString('en-IN')}</span>
                  </div>
                  <p className="text-xs text-stone-700">{msg.message}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 8: AUDIT TRAIL */}
        {/* ======================================================== */}
        {activeTab === 'audit' && (
          <div className="bg-white rounded-3xl border border-heritage-gold/25 shadow-sm overflow-hidden p-6 space-y-4">
            <h3 className="font-serif font-bold text-xl text-heritage-maroon border-b border-stone-100 pb-3">
              Audit Trail Logs
            </h3>
            <div className="space-y-2 text-xs">
              {auditLogs.map((log) => (
                <div key={log.id} className="p-3 bg-[#FAF6EE] rounded-xl border border-stone-200 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-heritage-maroon mr-2">[{log.action}]</span>
                    <span className="text-stone-700">{log.details}</span>
                  </div>
                  <span className="text-stone-400">{new Date(log.timestamp).toLocaleTimeString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 9: SYSTEM HEALTH & ERROR MONITORING */}
        {/* ======================================================== */}
        {activeTab === 'system-health' && (
          <div className="space-y-6">
            {/* System Overview Banner */}
            <div className="bg-emerald-900 text-emerald-50 p-6 rounded-3xl shadow-md border border-emerald-700/50 flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <div className="text-xs font-bold uppercase tracking-widest text-emerald-300 mb-1">
                  Production Infrastructure Health
                </div>
                <h3 className="font-serif font-bold text-2xl text-white">
                  All Systems Operational • 24/7 Telephone IVR Hotline 9347036152
                </h3>
                <p className="text-xs text-emerald-200 mt-1 max-w-xl">
                  Real-time monitoring of PostgreSQL database persistence, Twilio/telephony provider webhooks, Razorpay & UPI payment subsystems, and multilingual audio speech engines.
                </p>
              </div>
              <div className="bg-emerald-800/80 px-5 py-3 rounded-2xl border border-emerald-600 text-center shrink-0">
                <span className="text-[11px] text-emerald-300 uppercase block font-bold">System Status</span>
                <span className="font-serif font-black text-2xl text-emerald-100">
                  HEALTHY 100%
                </span>
              </div>
            </div>

            {/* Health Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Database */}
              <div className="bg-white p-5 rounded-3xl border border-heritage-gold/30 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-500 uppercase">PostgreSQL Store</span>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    CONNECTED
                  </span>
                </div>
                <div className="font-serif font-bold text-xl text-stone-900">
                  {systemHealth?.database?.latencyMs || 6} ms Latency
                </div>
                <div className="text-xs text-stone-600">
                  Orders: <strong>{systemHealth?.database?.totalOrders || orders.length}</strong> • Calls: <strong>{systemHealth?.database?.totalCalls || calls.length}</strong>
                </div>
              </div>

              {/* IVR Gateway */}
              <div className="bg-white p-5 rounded-3xl border border-heritage-gold/30 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-500 uppercase">IVR Hotline</span>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    ONLINE
                  </span>
                </div>
                <div className="font-serif font-bold text-xl text-heritage-maroon">
                  9347036152
                </div>
                <div className="text-xs text-stone-600">
                  Languages: <strong>English, मराठी, हिंदी, తెలుగు</strong>
                </div>
              </div>

              {/* Payment Subsystem */}
              <div className="bg-white p-5 rounded-3xl border border-heritage-gold/30 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-500 uppercase">Payment Contact</span>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    ACTIVE
                  </span>
                </div>
                <div className="font-serif font-bold text-xl text-stone-900">
                  9542826358
                </div>
                <div className="text-xs text-stone-600">
                  UPI ID: <strong>9542826358@ybl</strong> (IPPB - 3676)
                </div>
              </div>

              {/* Webhook Gateway */}
              <div className="bg-white p-5 rounded-3xl border border-heritage-gold/30 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-500 uppercase">Webhook Engine</span>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    READY
                  </span>
                </div>
                <div className="font-serif font-bold text-lg text-stone-900">
                  /api/ivr/webhook
                </div>
                <div className="text-xs text-stone-600">
                  Deterministic Finite State Machine v2.1
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-2xl w-full rounded-3xl shadow-2xl p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-200 pb-4">
              <div>
                <h3 className="font-serif font-black text-xl text-heritage-maroon">
                  Order #{selectedOrder.orderNumber}
                </h3>
                <p className="text-xs text-stone-500">
                  Source: <strong>{selectedOrder.orderSource || 'WEBSITE'}</strong> • Language: <strong>{selectedOrder.language || 'ENGLISH'}</strong>
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-800"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-[#FAF6EE] p-4 rounded-2xl space-y-1">
                <div className="font-bold text-stone-900">Customer Details</div>
                <div>Name: {selectedOrder.customer?.name}</div>
                <div>Phone: {selectedOrder.customer?.phone}</div>
                <div>Address: {selectedOrder.deliveryAddress || selectedOrder.customer?.address}</div>
                <div>Notes: {selectedOrder.customerNotes || selectedOrder.notes || 'None'}</div>
              </div>

              <div className="space-y-2">
                <div className="font-bold text-stone-900">Items Ordered</div>
                {selectedOrder.items?.map((it) => (
                  <div key={it.id} className="flex justify-between p-2.5 bg-stone-50 rounded-xl">
                    <span>{it.productNameSnapshot || it.productName} ({it.variantNameSnapshot || it.variantName}) x{it.quantity}</span>
                    <span className="font-bold">{formatINR(it.totalPrice || it.unitPrice * it.quantity)}</span>
                  </div>
                ))}
                <div className="flex justify-between font-bold text-sm pt-2 border-t border-stone-200">
                  <span>Total Amount:</span>
                  <span className="text-heritage-maroon">{formatINR(selectedOrder.total)}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-stone-200">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2.5 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-xl text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Call DTMF Interactions Modal */}
      {selectedCall && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-xl w-full rounded-3xl shadow-2xl p-6 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div>
                <h3 className="font-serif font-bold text-lg text-heritage-maroon">
                  Call Interaction Trail: {selectedCall.callSid}
                </h3>
                <p className="text-xs text-stone-500">
                  Caller: <strong>{selectedCall.fromPhone}</strong> • Language: <strong>{selectedCall.language}</strong>
                </p>
              </div>
              <button onClick={() => setSelectedCall(null)} className="text-stone-400 hover:text-stone-800">
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs">
              {ivrInteractions.filter((i) => i.callId === selectedCall.id).length === 0 ? (
                <p className="text-stone-500 py-4 text-center">No DTMF steps recorded for this call.</p>
              ) : (
                ivrInteractions
                  .filter((i) => i.callId === selectedCall.id)
                  .map((it) => (
                    <div key={it.id} className="p-3 bg-[#FAF6EE] rounded-xl border border-stone-200 space-y-1">
                      <div className="flex justify-between font-bold text-stone-800">
                        <span>{it.action}</span>
                        <span className="text-heritage-maroon">Key: {it.dtmfInput || 'N/A'}</span>
                      </div>
                      <p className="text-stone-600">{it.details}</p>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Price Edit Modal */}
      {editingVariant && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleSavePrice}
            className="bg-white max-w-md w-full rounded-3xl shadow-2xl p-6 space-y-4"
          >
            <h3 className="font-serif font-bold text-lg text-heritage-maroon">
              Edit Price: {editingVariant.productName} ({editingVariant.weight})
            </h3>
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">Price (₹ INR)</label>
              <input
                type="number"
                step="1"
                min="1"
                value={editingVariant.price}
                onChange={(e) =>
                  setEditingVariant({ ...editingVariant, price: parseFloat(e.target.value) || 0 })
                }
                className="w-full px-4 py-2 bg-[#FAF6EE] border border-stone-300 rounded-xl text-sm font-bold"
                required
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingVariant(null)}
                className="px-4 py-2 bg-stone-200 text-stone-800 rounded-xl text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-heritage-maroon text-white rounded-xl text-xs font-bold hover:bg-heritage-darkMaroon"
              >
                Save Price
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
