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
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { api } from '../../services/api';
import { formatINR, formatDateTime } from '../../utils/formatters';
import { Order, AdminStats, ContactMessage, Product, CustomerSummary, SalesReport } from '../../types';

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

export const AdminDashboard: React.FC = () => {
  const { admin, token, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<
    'orders' | 'payments' | 'reports' | 'customers' | 'products' | 'contacts' | 'audit'
  >('orders');

  const [stats, setStats] = useState<AdminStats | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [customers, setCustomers] = useState<CustomerSummary[]>([]);
  const [reports, setReports] = useState<SalesReport | null>(null);
  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Filters & State
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
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

      // 3. Fetch Payments
      try {
        const paymentsRes = await api.adminGetPayments(token || undefined);
        if (paymentsRes.success && Array.isArray(paymentsRes.data)) {
          setPayments(paymentsRes.data);
        }
      } catch (e) {}

      // 4. Fetch Customers
      try {
        const custRes = await api.adminGetCustomers(token || undefined);
        if (custRes.success && Array.isArray(custRes.data)) {
          setCustomers(custRes.data);
        }
      } catch (e) {}

      // 5. Fetch Reports
      try {
        const repRes = await api.adminGetReports(token || undefined);
        if (repRes.success && repRes.data) {
          setReports(repRes.data);
        }
      } catch (e) {}

      // 6. Fetch Contacts
      try {
        const contactsRes = await api.adminGetContactMessages(token || undefined);
        if (contactsRes.success && Array.isArray(contactsRes.data)) {
          setContacts(contactsRes.data);
        }
      } catch (e) {}

      // 7. Fetch Products
      try {
        const productsRes = await api.getProducts();
        if (productsRes.success && Array.isArray(productsRes.data)) {
          setProducts(productsRes.data);
        }
      } catch (e) {}

      // 8. Fetch Audit Logs
      try {
        const auditRes = await api.adminGetAuditLogs(token || undefined);
        if (auditRes.success && Array.isArray(auditRes.data)) {
          setAuditLogs(auditRes.data);
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
  }, [token, statusFilter]);

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
    const reason = window.prompt('Please enter a rejection reason (optional):');
    if (reason === null) return;

    setActionLoadingId(orderId);
    try {
      const res = await api.adminUpdateOrderStatus(
        token || '',
        orderId,
        'REJECTED',
        undefined,
        reason || 'Unable to fulfill order'
      );
      if (res.success) {
        showToast('Order has been REJECTED.', 'info');
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

  // Status Change
  const handleStatusChange = async (orderId: string, newStatus: string, paymentStatus?: string) => {
    setActionLoadingId(orderId);
    try {
      const res = await api.adminUpdateOrderStatus(token || '', orderId, newStatus, paymentStatus);
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
    setActionLoadingId(paymentId);
    try {
      const res = await api.adminVerifyManualPayment(
        token || '',
        paymentId,
        status,
        status === 'PAID' ? 'Verified received on business phone 9542826358' : 'UTR could not be matched'
      );
      if (res.success) {
        showToast(`Payment ${status === 'PAID' ? 'APPROVED & marked as PAID' : 'REJECTED'}!`, 'success');
        fetchDashboardData(true);
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to verify payment.', 'error');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Variant Price Update
  const handleSaveVariantPrice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVariant) return;

    try {
      const res = await api.adminUpdateVariantPrice(
        token || '',
        editingVariant.variantId,
        Number(editingVariant.price),
        Number(editingVariant.stock)
      );
      if (res.success) {
        showToast('Product variant price updated successfully!', 'success');
        setEditingVariant(null);
        fetchDashboardData(true);
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to update variant price.', 'error');
    }
  };

  // Filtered Orders
  const filteredOrders = orders.filter((o) => {
    if (statusFilter !== 'ALL' && o.status !== statusFilter) return false;
    if (paymentFilter !== 'ALL') {
      if (paymentFilter === 'ONLINE' && o.paymentMethod !== 'ONLINE') return false;
      if (paymentFilter === 'OFFLINE' && o.paymentMethod !== 'OFFLINE') return false;
      if (paymentFilter === 'MANUAL_UPI' && o.paymentMethod !== 'MANUAL_UPI') return false;
      if (paymentFilter === 'PAID' && o.paymentStatus !== 'PAID') return false;
      if (paymentFilter === 'PENDING' && o.paymentStatus !== 'PENDING') return false;
      if (paymentFilter === 'PENDING_VERIFICATION' && o.paymentStatus !== 'PENDING_VERIFICATION') return false;
    }
    return true;
  });

  const pendingVerificationPayments = payments.filter((p) => p.status === 'PENDING_VERIFICATION');

  return (
    <div className="bg-[#FAF6EE] min-h-screen py-6 lg:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Top Header Card */}
        <div className="bg-white p-5 sm:p-7 rounded-3xl border border-heritage-gold/30 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-heritage-maroon text-cream-100 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full tracking-wider">
                Management Portal
              </span>
              <span className="text-xs font-bold text-heritage-antiqueGold">
                Bhainsa, Nirmal District, Telangana (504103)
              </span>
            </div>
            <h1 className="font-serif font-black text-2xl sm:text-3xl text-heritage-maroon mt-1">
              Annapurna Aahaar Admin
            </h1>
            <p className="text-xs text-stone-500 font-medium">
              Proprietor: <strong className="text-stone-800">Bande Omkar</strong> | Phones: 6305970844, 8688456925 | Payment Contact: 9542826358
            </p>
          </div>

          {/* Sync & Audio Controls */}
          <div className="flex flex-wrap items-center gap-2.5 self-end md:self-auto">
            {/* Live Indicator */}
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-300/80 px-3.5 py-2 rounded-2xl shadow-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span>Real-Time Cloud Stream</span>
            </span>

            {/* Sound Toggle */}
            <button
              onClick={() => {
                setSoundEnabled(!soundEnabled);
                if (!soundEnabled) playOrderChime();
              }}
              title={soundEnabled ? 'Order audio chime enabled' : 'Order audio chime muted'}
              className={`p-2.5 rounded-2xl border transition-all ${
                soundEnabled
                  ? 'bg-amber-50 text-amber-900 border-amber-300'
                  : 'bg-stone-100 text-stone-500 border-stone-200'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Manual Sync */}
            <button
              onClick={() => fetchDashboardData(false)}
              disabled={isSyncing}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-white hover:bg-cream-100 border border-heritage-gold/40 text-stone-800 text-xs font-bold shadow-xs active:scale-95 transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-heritage-maroon' : ''}`} />
              <span>Sync Now</span>
            </button>

            {/* Logout */}
            <button
              onClick={logout}
              className="p-2.5 rounded-2xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Incoming New Order Banner */}
        {newOrderAlert && (
          <div className="bg-emerald-600 text-white p-4 rounded-3xl shadow-lg flex items-center justify-between animate-pulse">
            <div className="flex items-center gap-3">
              <Bell className="w-6 h-6 animate-bounce" />
              <div>
                <span className="font-bold text-sm block">🔔 NEW INCOMING ORDER RECEIVED!</span>
                <span className="text-xs text-emerald-100">
                  Order #{newOrderAlert.orderNumber} from {newOrderAlert.customer?.name || 'Customer'} (Total: {formatINR(newOrderAlert.total)})
                </span>
              </div>
            </div>
            <button
              onClick={() => {
                setSelectedOrder(newOrderAlert);
                setNewOrderAlert(null);
              }}
              className="bg-white text-emerald-900 px-4 py-1.5 rounded-xl text-xs font-black hover:bg-emerald-50 transition-all shadow-sm"
            >
              View Order
            </button>
          </div>
        )}

        {/* KPI Overview Cards */}
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

          <div className="bg-white p-4 sm:p-5 rounded-3xl border border-heritage-gold/25 shadow-xs">
            <div className="flex items-center justify-between text-stone-500 mb-1">
              <span className="text-[11px] font-bold uppercase">Accepted</span>
              <CheckCircle2 className="w-4 h-4 text-blue-700" />
            </div>
            <div className="font-serif font-black text-2xl text-stone-900">
              {stats?.acceptedOrders || orders.filter((o) => o.status === 'ACCEPTED').length}
            </div>
            <span className="text-[10px] text-stone-500">In Preparation</span>
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
            Orders & Live History ({orders.length})
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
        </div>

        {/* ======================================================== */}
        {/* TAB 1: ORDERS MANAGEMENT & LIVE STREAM */}
        {/* ======================================================== */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {/* Filter & Search Bar */}
            <div className="bg-white p-4 sm:p-5 rounded-3xl border border-heritage-gold/25 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
              {/* Status Filters */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 w-full md:w-auto scrollbar-none">
                {['ALL', 'PENDING', 'ACCEPTED', 'PROCESSING', 'READY', 'OUT_FOR_DELIVERY', 'DELIVERED', 'REJECTED', 'CANCELLED'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                      statusFilter === st
                        ? 'bg-heritage-maroon text-cream-100 shadow-sm'
                        : 'bg-[#FAF6EE] text-stone-700 hover:bg-cream-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              {/* Payment Filter & Search Form */}
              <div className="flex items-center gap-2 w-full md:w-auto">
                <select
                  value={paymentFilter}
                  onChange={(e) => setPaymentFilter(e.target.value)}
                  className="px-3 py-2 bg-[#FAF6EE] border border-heritage-gold/30 rounded-xl text-xs font-bold text-stone-800 focus:outline-none"
                >
                  <option value="ALL">All Payments</option>
                  <option value="ONLINE">Online Gateway</option>
                  <option value="MANUAL_UPI">Direct UPI (9542826358)</option>
                  <option value="OFFLINE">Cash on Delivery</option>
                  <option value="PAID">PAID Only</option>
                  <option value="PENDING_VERIFICATION">Needs UPI Verification</option>
                </select>

                <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 flex-1 md:w-64">
                  <input
                    type="text"
                    placeholder="Search Order # or phone..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-3.5 py-2 bg-[#FAF6EE] border border-heritage-gold/30 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-heritage-gold"
                  />
                  <button
                    type="submit"
                    className="bg-heritage-maroon text-cream-100 p-2 rounded-xl text-xs font-bold"
                  >
                    <Search className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-3xl border border-heritage-gold/30 shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-[#FAF6EE] border-b border-stone-200 text-stone-600 font-bold text-xs uppercase tracking-wider">
                      <th className="p-4">Order # & Time</th>
                      <th className="p-4">Customer & Location</th>
                      <th className="p-4">Amount</th>
                      <th className="p-4">Payment Method</th>
                      <th className="p-4">Order Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-10 text-center text-stone-500 font-medium">
                          No orders found matching the selected filters.
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((ord) => {
                        const isPending = ord.status === 'PENDING';
                        const itemCount = (ord.items || []).length;
                        const custName = ord.customer?.name || 'Customer';
                        const custPhone = ord.customer?.phone || 'No phone provided';
                        const custCity = ord.customer?.city || 'Bhainsa';
                        const custState = ord.customer?.state || 'Telangana';
                        const custPincode = ord.customer?.pincode || '504103';

                        return (
                          <tr
                            key={ord.id || ord.orderNumber}
                            className={`hover:bg-cream-50/80 transition-colors ${
                              isPending ? 'bg-amber-50/50' : ''
                            }`}
                          >
                            {/* Order Number & Date */}
                            <td className="p-4">
                              <span className="font-mono font-black text-heritage-maroon block">
                                #{ord.orderNumber}
                              </span>
                              <span className="text-[11px] text-stone-400">
                                {formatDateTime(ord.createdAt)}
                              </span>
                              <div className="text-[11px] text-stone-600 mt-1">
                                {itemCount} item{itemCount !== 1 ? 's' : ''}
                              </div>
                            </td>

                            {/* Customer */}
                            <td className="p-4">
                              <span className="font-bold text-stone-900 block">{custName}</span>
                              <span className="text-xs text-stone-600 block">📞 {custPhone}</span>
                              <span className="text-[11px] text-stone-500 block line-clamp-1">
                                📍 {custCity}, {custState} ({custPincode})
                              </span>
                            </td>

                            {/* Total Amount */}
                            <td className="p-4 font-serif font-bold text-base text-stone-900">
                              {formatINR(ord.total || 0)}
                            </td>

                            {/* Payment Method */}
                            <td className="p-4">
                              <span className="font-bold text-xs text-stone-800 block">
                                {ord.paymentMethod === 'ONLINE'
                                  ? 'Online Gateway'
                                  : ord.paymentMethod === 'MANUAL_UPI'
                                  ? 'Direct UPI (9542826358)'
                                  : 'Cash on Delivery'}
                              </span>
                              <span
                                className={`inline-block text-[10px] font-black px-2.5 py-0.5 rounded-full mt-1 ${
                                  ord.paymentStatus === 'PAID'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : ord.paymentStatus === 'PENDING_VERIFICATION'
                                    ? 'bg-purple-100 text-purple-900 border border-purple-300 animate-pulse'
                                    : 'bg-amber-100 text-amber-900'
                                }`}
                              >
                                {ord.paymentStatus === 'PENDING_VERIFICATION' ? 'VERIFY UPI' : ord.paymentStatus || 'PENDING'}
                              </span>
                            </td>

                            {/* Order Status */}
                            <td className="p-4">
                              <span
                                className={`inline-flex items-center gap-1 text-xs font-black px-3 py-1 rounded-full ${
                                  ord.status === 'PENDING'
                                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                    : ord.status === 'ACCEPTED'
                                    ? 'bg-blue-100 text-blue-900 border border-blue-300'
                                    : ord.status === 'PROCESSING'
                                    ? 'bg-purple-100 text-purple-900 border border-purple-300'
                                    : ord.status === 'READY'
                                    ? 'bg-indigo-100 text-indigo-900 border border-indigo-300'
                                    : ord.status === 'OUT_FOR_DELIVERY'
                                    ? 'bg-orange-100 text-orange-900 border border-orange-300'
                                    : ord.status === 'DELIVERED'
                                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                    : 'bg-red-100 text-red-900 border border-red-300'
                                }`}
                              >
                                {ord.status}
                              </span>
                            </td>

                            {/* Actions */}
                            <td className="p-4 text-right space-y-1.5">
                              {isPending ? (
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    onClick={() => handleAcceptOrder(ord.id)}
                                    disabled={actionLoadingId === ord.id}
                                    className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black px-3.5 py-1.5 rounded-xl shadow-xs transition-all active:scale-95 flex items-center gap-1"
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                    <span>ACCEPT</span>
                                  </button>
                                  <button
                                    onClick={() => handleRejectOrder(ord.id)}
                                    disabled={actionLoadingId === ord.id}
                                    className="bg-red-700 hover:bg-red-800 text-white text-xs font-black px-3 py-1.5 rounded-xl shadow-xs transition-all active:scale-95 flex items-center gap-1"
                                  >
                                    <XCircle className="w-3.5 h-3.5" />
                                    <span>REJECT</span>
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => setSelectedOrder(ord)}
                                  className="inline-flex items-center gap-1 text-xs font-bold text-heritage-maroon hover:underline bg-[#FAF6EE] px-3 py-1.5 rounded-xl border border-heritage-gold/30"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                  <span>View & Manage</span>
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: PAYMENTS & MANUAL UPI VERIFICATION */}
        {/* ======================================================== */}
        {activeTab === 'payments' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-3xl border border-heritage-gold/30 shadow-sm">
              <h3 className="font-serif font-bold text-xl text-heritage-maroon mb-2">
                Business Payment Verification Queue
              </h3>
              <p className="text-xs text-stone-600">
                Customers paying directly to mobile number <strong className="text-heritage-maroon">9542826358</strong> will appear here for verification.
              </p>
            </div>

            {/* Pending Verification Table */}
            <div className="bg-white rounded-3xl border border-purple-200 shadow-md overflow-hidden">
              <div className="p-4 bg-purple-50 border-b border-purple-200 flex justify-between items-center">
                <span className="font-bold text-xs uppercase tracking-wider text-purple-900">
                  Manual UPI Payments Requiring Approval ({pendingVerificationPayments.length})
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-[#FAF6EE] text-stone-600 font-bold border-b border-stone-200">
                      <th className="p-3.5">Order #</th>
                      <th className="p-3.5">Customer & Phone</th>
                      <th className="p-3.5">Amount</th>
                      <th className="p-3.5">Transaction Ref / UTR</th>
                      <th className="p-3.5">Payment Mobile</th>
                      <th className="p-3.5 text-right">Verification Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {pendingVerificationPayments.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-stone-500 font-medium">
                          No pending UPI payments to verify. All payments are up to date!
                        </td>
                      </tr>
                    ) : (
                      pendingVerificationPayments.map((p) => (
                        <tr key={p.id} className="hover:bg-purple-50/50">
                          <td className="p-3.5 font-mono font-bold text-heritage-maroon">
                            #{p.order?.orderNumber || 'AA-ORDER'}
                          </td>
                          <td className="p-3.5">
                            <span className="font-bold text-stone-900 block">{p.order?.customer?.name || 'Customer'}</span>
                            <span className="text-xs text-stone-600">{p.order?.customer?.phone || ''}</span>
                          </td>
                          <td className="p-3.5 font-serif font-black text-stone-900">{formatINR(p.amount)}</td>
                          <td className="p-3.5 font-mono font-bold text-purple-950 bg-purple-50 px-2 py-1 rounded">
                            {p.transactionReference || p.manualUpiRef || 'N/A'}
                          </td>
                          <td className="p-3.5 font-mono font-bold text-stone-700">{p.manualUpiPhone || '9542826358'}</td>
                          <td className="p-3.5 text-right space-x-2">
                            <button
                              onClick={() => handleVerifyManualPayment(p.id, 'PAID')}
                              disabled={actionLoadingId === p.id}
                              className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-xs"
                            >
                              Approve PAID
                            </button>
                            <button
                              onClick={() => handleVerifyManualPayment(p.id, 'FAILED')}
                              disabled={actionLoadingId === p.id}
                              className="bg-red-700 hover:bg-red-800 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-xs"
                            >
                              Reject
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
        {/* TAB 3: SALES REPORTS & CSV EXPORT */}
        {/* ======================================================== */}
        {activeTab === 'reports' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-heritage-gold/30 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="font-serif font-bold text-xl text-heritage-maroon">
                  Business Sales & Order Analytics
                </h3>
                <p className="text-xs text-stone-600 mt-1">
                  Complete order summary for Annapurna Aahaar (Bhainsa, Telangana)
                </p>
              </div>

              <a
                href={api.getExportOrdersCsvUrl(token || '')}
                download
                target="_blank"
                rel="noreferrer"
                className="bg-heritage-maroon hover:bg-[#681818] text-cream-100 px-5 py-2.5 rounded-2xl text-xs font-bold shadow-md flex items-center gap-2 transition-all active:scale-95"
              >
                <Download className="w-4 h-4" />
                <span>Export Orders to CSV</span>
              </a>
            </div>

            {/* Top Products Table */}
            <div className="bg-white p-6 rounded-3xl border border-heritage-gold/30 shadow-md">
              <h4 className="font-serif font-bold text-lg text-stone-900 mb-4">
                Top Selling Products & Revenue Breakdown
              </h4>
              <div className="divide-y divide-stone-100">
                {(reports?.topProducts || []).length === 0 ? (
                  <p className="text-xs text-stone-500 py-4">No sales recorded yet.</p>
                ) : (
                  reports?.topProducts.map((p, idx) => (
                    <div key={p.name} className="py-3 flex justify-between items-center text-xs sm:text-sm">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-cream-200 text-heritage-maroon font-bold flex items-center justify-center text-xs">
                          {idx + 1}
                        </span>
                        <div>
                          <span className="font-bold text-stone-900 block">{p.name}</span>
                          <span className="text-stone-500 text-xs">{p.quantity} units sold</span>
                        </div>
                      </div>
                      <span className="font-serif font-black text-heritage-maroon">{formatINR(p.revenue)}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: CUSTOMER DIRECTORY */}
        {/* ======================================================== */}
        {activeTab === 'customers' && (
          <div className="bg-white rounded-3xl border border-heritage-gold/30 shadow-md overflow-hidden">
            <div className="p-5 border-b border-stone-100">
              <h3 className="font-serif font-bold text-xl text-heritage-maroon">
                Registered Customer Directory ({customers.length})
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="bg-[#FAF6EE] text-stone-600 font-bold border-b border-stone-200">
                    <th className="p-4">Customer</th>
                    <th className="p-4">Mobile</th>
                    <th className="p-4">City / Address</th>
                    <th className="p-4">Total Orders</th>
                    <th className="p-4">Lifetime Spend</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {customers.map((c) => (
                    <tr key={c.id || c.phone} className="hover:bg-cream-50/50">
                      <td className="p-4 font-bold text-stone-900">{c.name}</td>
                      <td className="p-4 font-mono">{c.phone}</td>
                      <td className="p-4 text-stone-600">{c.address}, {c.city}</td>
                      <td className="p-4 font-bold">{c.totalOrders} order(s)</td>
                      <td className="p-4 font-serif font-black text-heritage-maroon">{formatINR(c.totalSpent || 0)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 5: PRODUCT & PRICE EDITOR */}
        {/* ======================================================== */}
        {activeTab === 'products' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p) => (
              <div key={p.id} className="bg-white p-5 rounded-3xl border border-heritage-gold/30 shadow-sm space-y-4">
                <div className="flex items-center gap-3">
                  <img
                    src={p.imageUrl}
                    alt={p.name}
                    className="w-14 h-14 object-contain rounded-2xl bg-cream-100 p-1 border border-stone-200"
                  />
                  <div>
                    <span className="text-[10px] font-bold uppercase text-heritage-antiqueGold tracking-wider block">
                      {p.category}
                    </span>
                    <h4 className="font-serif font-bold text-stone-900 text-base">{p.name}</h4>
                  </div>
                </div>

                <div className="space-y-2 border-t border-stone-100 pt-3">
                  <span className="text-xs font-bold text-stone-700 uppercase block">Weight Variants:</span>
                  <div className="space-y-2">
                    {p.variants.map((v) => (
                      <div
                        key={v.id}
                        className="flex justify-between items-center bg-[#FAF6EE] p-3 rounded-2xl border border-heritage-gold/20"
                      >
                        <div>
                          <span className="font-bold text-xs text-stone-900 block">{v.weight}</span>
                          <span className="text-[11px] text-stone-500">Stock: {v.stock} units</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-serif font-black text-sm text-heritage-maroon">{formatINR(v.price)}</span>
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
                            className="p-1.5 rounded-xl bg-white hover:bg-cream-200 border border-stone-300 text-stone-700"
                            title="Edit Price"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 6: CUSTOMER ENQUIRIES */}
        {/* ======================================================== */}
        {activeTab === 'contacts' && (
          <div className="bg-white rounded-3xl border border-heritage-gold/30 shadow-md overflow-hidden">
            <div className="p-5 border-b border-stone-100">
              <h3 className="font-serif font-bold text-xl text-heritage-maroon">
                Customer Messages & Enquiries ({contacts.length})
              </h3>
            </div>
            <div className="divide-y divide-stone-100">
              {contacts.length === 0 ? (
                <p className="p-8 text-center text-stone-500 text-xs font-medium">No contact messages yet.</p>
              ) : (
                contacts.map((msg) => (
                  <div key={msg.id} className="p-5 hover:bg-cream-50/50 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-bold text-stone-900 block">{msg.name}</span>
                        <span className="text-xs text-stone-600">📞 {msg.phone} {msg.email && `| ✉️ ${msg.email}`}</span>
                      </div>
                      <span className="text-[11px] text-stone-400">{formatDateTime(msg.createdAt)}</span>
                    </div>
                    <p className="text-xs text-stone-700 bg-[#FAF6EE] p-3 rounded-xl border border-stone-200">
                      <strong>Subject: {msg.subject || 'Enquiry'}</strong> — {msg.message}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 7: AUDIT LOGS */}
        {/* ======================================================== */}
        {activeTab === 'audit' && (
          <div className="bg-white rounded-3xl border border-heritage-gold/30 shadow-md overflow-hidden">
            <div className="p-5 border-b border-stone-100">
              <h3 className="font-serif font-bold text-xl text-heritage-maroon">
                Administrative Audit Logs & Records ({auditLogs.length})
              </h3>
            </div>
            <div className="divide-y divide-stone-100 max-h-96 overflow-y-auto">
              {auditLogs.length === 0 ? (
                <p className="p-8 text-center text-stone-500 text-xs">No audit logs recorded yet.</p>
              ) : (
                auditLogs.map((log) => (
                  <div key={log.id} className="p-4 text-xs flex justify-between items-center">
                    <div>
                      <span className="font-bold text-heritage-maroon block">{log.action}</span>
                      <span className="text-stone-700">{log.details}</span>
                    </div>
                    <span className="text-[11px] text-stone-400">{formatDateTime(log.timestamp)}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* ORDER DETAILS MODAL */}
        {/* ======================================================== */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white max-w-2xl w-full rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center border-b border-stone-200 pb-4">
                <div>
                  <span className="text-xs font-bold text-heritage-antiqueGold uppercase tracking-wider block">
                    Order Details
                  </span>
                  <h3 className="font-serif font-bold text-2xl text-heritage-maroon">
                    #{selectedOrder.orderNumber}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 text-stone-400 hover:text-stone-800 rounded-full hover:bg-stone-100"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              {/* Status Switcher */}
              <div className="bg-[#FAF6EE] p-4 rounded-2xl border border-heritage-gold/30 space-y-2">
                <span className="text-xs font-bold text-stone-700 uppercase block">Update Order Status:</span>
                <div className="flex flex-wrap gap-2">
                  {['PENDING', 'ACCEPTED', 'PROCESSING', 'READY', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED', 'REJECTED'].map((st) => (
                    <button
                      key={st}
                      onClick={() => handleStatusChange(selectedOrder.id, st)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        selectedOrder.status === st
                          ? 'bg-heritage-maroon text-white shadow-md'
                          : 'bg-white border border-stone-200 text-stone-700 hover:bg-cream-100'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Customer & Address */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-stone-50 rounded-2xl space-y-1">
                  <span className="font-bold text-stone-700 block mb-1">Customer Info:</span>
                  <p className="font-bold text-stone-900 text-sm">{selectedOrder.customer?.name || 'Customer'}</p>
                  <p className="text-stone-600">Phone: {selectedOrder.customer?.phone || 'N/A'}</p>
                  {selectedOrder.customer?.email && <p className="text-stone-600">Email: {selectedOrder.customer.email}</p>}
                </div>

                <div className="p-4 bg-stone-50 rounded-2xl space-y-1">
                  <span className="font-bold text-stone-700 block mb-1">Delivery Address:</span>
                  <p className="text-stone-700">
                    {selectedOrder.customer?.address || ''}, {selectedOrder.customer?.city || 'Bhainsa'}, {selectedOrder.customer?.state || 'Telangana'} - {selectedOrder.customer?.pincode || '504103'}
                  </p>
                  {selectedOrder.customerNotes && (
                    <p className="text-amber-900 font-bold mt-1">Note: {selectedOrder.customerNotes}</p>
                  )}
                </div>
              </div>

              {/* Items Ordered (Preserved Snapshots) */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-stone-700 uppercase block">Items in this order:</span>
                <div className="divide-y divide-stone-100 border border-stone-200 rounded-2xl p-4 bg-stone-50/50">
                  {(selectedOrder.items || []).map((it) => (
                    <div key={it.id || it.variantId} className="py-2.5 flex justify-between text-xs sm:text-sm">
                      <div>
                        <span className="font-bold text-stone-900 block">{it.productNameSnapshot || it.productName}</span>
                        <span className="text-stone-500 text-xs">
                          {it.variantNameSnapshot || it.variantName} × {it.quantity}
                        </span>
                      </div>
                      <span className="font-serif font-black text-heritage-maroon">
                        {formatINR(it.totalPrice || it.unitPrice * it.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between font-serif font-black text-lg text-heritage-maroon pt-2 px-2">
                  <span>Grand Total:</span>
                  <span>{formatINR(selectedOrder.total)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Product Variant Price Modal */}
        {editingVariant && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white max-w-md w-full rounded-3xl shadow-2xl p-6 sm:p-8 space-y-5">
              <h3 className="font-serif font-bold text-xl text-heritage-maroon">
                Update Price & Stock
              </h3>
              <p className="text-xs text-stone-600">
                {editingVariant.productName} — <strong>{editingVariant.weight}</strong>
              </p>
              <form onSubmit={handleSaveVariantPrice} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">Unit Price (₹)</label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={editingVariant.price}
                    onChange={(e) => setEditingVariant({ ...editingVariant, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-2.5 bg-[#FAF6EE] border border-heritage-gold/40 rounded-xl text-sm font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">Stock Units</label>
                  <input
                    type="number"
                    min="0"
                    value={editingVariant.stock}
                    onChange={(e) => setEditingVariant({ ...editingVariant, stock: parseInt(e.target.value, 10) || 0 })}
                    className="w-full px-4 py-2.5 bg-[#FAF6EE] border border-heritage-gold/40 rounded-xl text-sm font-bold"
                  />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingVariant(null)}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-stone-100 hover:bg-stone-200 text-stone-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl text-xs font-bold bg-heritage-maroon hover:bg-[#681818] text-cream-100 shadow-md"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
