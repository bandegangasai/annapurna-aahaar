import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Package,
  Clock,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Users,
  MessageSquare,
  Search,
  RefreshCw,
  LogOut,
  ChevronRight,
  Eye,
  Check,
  X,
  Truck,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { api } from '../../services/api';
import { Order, AdminStats, ContactMessage } from '../../types';
import { formatINR, formatDate, STATUS_CONFIG } from '../../utils/formatters';
import { SEOHead } from '../../components/common/SEOHead';

export const AdminDashboard: React.FC = () => {
  const { admin, token, isAuthenticated, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<string>('PENDING');
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [rejectModalOrder, setRejectModalOrder] = useState<Order | null>(null);
  const [rejectionNote, setRejectionNote] = useState('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Authentication Guard
  useEffect(() => {
    if (!isAuthenticated || !token) {
      navigate('/admin/login');
    }
  }, [isAuthenticated, token, navigate]);

  const loadDashboardData = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const [statsRes, ordersRes, contactsRes] = await Promise.all([
        api.adminGetStats(token),
        api.adminGetOrders(token, { status: activeTab === 'CONTACTS' ? 'ALL' : activeTab, search: searchTerm }),
        api.adminGetContactMessages(token),
      ]);

      if (statsRes.success) setStats(statsRes.data);
      if (ordersRes.success) setOrders(ordersRes.data);
      if (contactsRes.success) setContactMessages(contactsRes.data);
    } catch (err: any) {
      console.error('Failed to load admin dashboard data:', err);
      showToast(err.message || 'Error loading dashboard data.', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [token, activeTab, searchTerm, showToast]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // Handle Quick Status Transition (Accept, Processing, Ready, Out for Delivery, Delivered)
  const handleUpdateStatus = async (orderId: string, status: string, note?: string) => {
    if (!token) return;
    setIsUpdatingStatus(true);
    try {
      const res = await api.adminUpdateOrderStatus(token, orderId, status, note);
      if (res.success) {
        showToast(`Order #${res.data.orderNumber} status changed to ${status}`, 'success');
        // Update local order list
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? res.data : o))
        );
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder(res.data);
        }
        // Refresh stats
        const updatedStats = await api.adminGetStats(token);
        if (updatedStats.success) setStats(updatedStats.data);
      }
    } catch (err: any) {
      console.error('Status update failed:', err);
      showToast(err.message || 'Failed to update order status.', 'error');
    } finally {
      setIsUpdatingStatus(false);
      setRejectModalOrder(null);
      setRejectionNote('');
    }
  };

  const handleMarkContactRead = async (id: string) => {
    if (!token) return;
    try {
      const res = await api.adminMarkContactRead(token, id);
      if (res.success) {
        setContactMessages((prev) =>
          prev.map((m) => (m.id === id ? { ...m, isRead: true } : m))
        );
        showToast('Enquiry marked as read', 'info');
      }
    } catch (err: any) {
      showToast('Failed to update enquiry status', 'error');
    }
  };

  const statusTabs = [
    { key: 'PENDING', label: 'Pending Approval', count: stats?.pendingOrders || 0, highlight: true },
    { key: 'ALL', label: 'All Orders', count: stats?.totalOrders || 0 },
    { key: 'ACCEPTED', label: 'Accepted', count: stats?.acceptedOrders || 0 },
    { key: 'PROCESSING', label: 'Processing' },
    { key: 'READY', label: 'Ready for Pickup' },
    { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery' },
    { key: 'DELIVERED', label: 'Delivered', count: stats?.deliveredOrders || 0 },
    { key: 'REJECTED', label: 'Rejected', count: stats?.rejectedOrders || 0 },
    { key: 'CONTACTS', label: 'Customer Enquiries', count: stats?.unreadContacts || 0, badgeAlert: true },
  ];

  return (
    <div className="bg-[#FAF4EB] min-h-screen pb-16">
      <SEOHead title="Admin Order Management | Annapurna Aahaar" />

      {/* Top Navbar */}
      <header className="bg-heritage-maroon text-cream-100 px-4 sm:px-8 py-4 shadow-md sticky top-0 z-30 flex items-center justify-between border-b border-amber-900">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-turmeric-600 flex items-center justify-center font-serif font-black text-white text-base">
            AA
          </div>
          <div>
            <h1 className="font-serif font-bold text-lg text-cream-50 leading-tight">
              Annapurna Aahaar — Admin Center
            </h1>
            <span className="text-[11px] text-turmeric-400 font-semibold tracking-wider uppercase">
              Order Fulfillment & Management
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link
            to="/"
            target="_blank"
            className="hidden sm:flex items-center gap-1 text-xs text-cream-300 hover:text-white transition-colors"
          >
            <span>View Live Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={loadDashboardData}
            disabled={isLoading}
            className="p-2 rounded-xl bg-amber-900/40 text-cream-200 hover:text-white hover:bg-amber-900/60 transition-colors"
            title="Refresh dashboard data"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={logout}
            className="flex items-center gap-1.5 bg-red-950/60 hover:bg-red-900 text-red-200 hover:text-white px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors border border-red-800/40"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Card 1: Pending Orders (Highlighted) */}
          <div className="bg-white p-5 rounded-2xl border-2 border-turmeric-500 shadow-md flex items-center gap-4 relative overflow-hidden">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-turmeric-800 flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
                Pending Approval
              </span>
              <span className="font-serif font-black text-2xl sm:text-3xl text-heritage-maroon">
                {stats?.pendingOrders || 0}
              </span>
            </div>
            {stats && stats.pendingOrders > 0 && (
              <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
            )}
          </div>

          {/* Card 2: Total Revenue */}
          <div className="bg-white p-5 rounded-2xl border border-amber-900/10 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
                Total Orders Value
              </span>
              <span className="font-serif font-black text-2xl sm:text-3xl text-stone-900">
                {formatINR(stats?.totalRevenue || 0)}
              </span>
            </div>
          </div>

          {/* Card 3: Total Orders */}
          <div className="bg-white p-5 rounded-2xl border border-amber-900/10 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center shrink-0">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
                All Orders Count
              </span>
              <span className="font-serif font-black text-2xl sm:text-3xl text-stone-900">
                {stats?.totalOrders || 0}
              </span>
            </div>
          </div>

          {/* Card 4: Delivered Orders */}
          <div className="bg-white p-5 rounded-2xl border border-amber-900/10 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-100 text-green-800 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
                Delivered
              </span>
              <span className="font-serif font-black text-2xl sm:text-3xl text-stone-900">
                {stats?.deliveredOrders || 0}
              </span>
            </div>
          </div>

          {/* Card 5: Enquiries */}
          <div className="bg-white p-5 rounded-2xl border border-amber-900/10 shadow-sm flex items-center gap-4 col-span-2 lg:col-span-1">
            <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center shrink-0">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
                Customer Enquiries
              </span>
              <span className="font-serif font-black text-2xl sm:text-3xl text-stone-900">
                {contactMessages.length}
              </span>
            </div>
          </div>
        </div>

        {/* Tab & Search Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-amber-900/10 shadow-sm space-y-4">
          {/* Top Row: Search Input */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                placeholder="Search by customer name, phone, order ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-cream-50 border border-amber-900/15 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-turmeric-500"
              />
            </div>

            <span className="text-xs text-stone-500 font-medium">
              {activeTab === 'CONTACTS'
                ? `Showing ${contactMessages.length} customer messages`
                : `Showing ${orders.length} orders`}
            </span>
          </div>

          {/* Bottom Row: Tab Buttons */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {statusTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`text-xs px-3.5 py-2 rounded-xl font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                  activeTab === tab.key
                    ? 'bg-heritage-maroon text-cream-100 shadow-md'
                    : 'bg-cream-100 text-stone-700 hover:bg-cream-200 border border-amber-900/10'
                }`}
              >
                <span>{tab.label}</span>
                {typeof tab.count === 'number' && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                      activeTab === tab.key
                        ? 'bg-turmeric-500 text-stone-950 font-bold'
                        : tab.highlight
                        ? 'bg-amber-200 text-amber-900'
                        : 'bg-stone-200 text-stone-700'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content Section: Orders Table vs Contact Messages */}
        {activeTab === 'CONTACTS' ? (
          /* Contact Enquiries List */
          <div className="bg-white rounded-3xl border border-amber-900/10 shadow-sm divide-y divide-stone-100 overflow-hidden">
            {contactMessages.length === 0 ? (
              <div className="p-12 text-center text-stone-500 text-sm">
                No customer contact enquiries received yet.
              </div>
            ) : (
              contactMessages.map((msg) => (
                <div key={msg.id} className="p-5 sm:p-6 flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <strong className="text-stone-900 font-serif text-base">{msg.name}</strong>
                      <span className="text-xs text-stone-500 font-mono">+91 {msg.phone}</span>
                      {msg.email && <span className="text-xs text-stone-500">({msg.email})</span>}
                      {!msg.isRead && (
                        <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          NEW
                        </span>
                      )}
                    </div>
                    <div className="text-xs font-semibold text-turmeric-800">{msg.subject}</div>
                    <p className="text-xs sm:text-sm text-stone-700 leading-relaxed bg-cream-50 p-3 rounded-xl border border-amber-900/5">
                      "{msg.message}"
                    </p>
                    <span className="text-[10px] text-stone-400 block">{formatDate(msg.createdAt)}</span>
                  </div>

                  {!msg.isRead && (
                    <button
                      onClick={() => handleMarkContactRead(msg.id)}
                      className="bg-cream-100 hover:bg-cream-200 text-stone-700 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors shrink-0"
                    >
                      Mark as Read
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        ) : (
          /* Orders Table / Cards */
          <div className="space-y-4">
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map((n) => (
                  <div key={n} className="h-24 bg-white rounded-2xl animate-pulse border border-stone-200" />
                ))}
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-amber-900/10 shadow-sm space-y-2">
                <Package className="w-10 h-10 text-stone-300 mx-auto" />
                <h3 className="font-serif font-bold text-stone-800 text-lg">No orders in this category</h3>
                <p className="text-xs text-stone-500">
                  Orders placed by customers will immediately appear here.
                </p>
              </div>
            ) : (
              orders.map((order) => (
                <div
                  key={order.id}
                  className={`bg-white rounded-3xl p-5 sm:p-6 border shadow-sm transition-all duration-200 flex flex-col lg:flex-row lg:items-center justify-between gap-5 ${
                    order.status === 'PENDING'
                      ? 'border-turmeric-400 bg-amber-50/20'
                      : 'border-amber-900/10'
                  }`}
                >
                  {/* Left: Order Info & Customer */}
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-serif font-black text-lg text-heritage-maroon">
                        {order.orderNumber}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold border ${
                          STATUS_CONFIG[order.status]?.bg || 'bg-stone-100'
                        } ${STATUS_CONFIG[order.status]?.text || 'text-stone-800'} ${
                          STATUS_CONFIG[order.status]?.border || 'border-stone-200'
                        }`}
                      >
                        {STATUS_CONFIG[order.status]?.label || order.status}
                      </span>
                      <span className="text-xs text-stone-400">{formatDate(order.createdAt)}</span>
                    </div>

                    {/* Customer details line */}
                    <div className="text-xs text-stone-700 flex flex-wrap items-center gap-x-4 gap-y-1">
                      <span>
                        <strong>Customer:</strong> {order.customer?.name}
                      </span>
                      <span>
                        <strong>Mobile:</strong> +91 {order.customer?.phone}
                      </span>
                      <span>
                        <strong>City:</strong> {order.customer?.city}, {order.customer?.state}
                      </span>
                    </div>

                    {/* Line Items summary */}
                    <div className="text-xs text-stone-600 bg-cream-50 p-2.5 rounded-xl border border-amber-900/5 max-w-2xl">
                      <strong>Items ({order.items.length}):</strong>{' '}
                      {order.items
                        .map((i) => `${i.productName} (${i.variantName}) × ${i.quantity}`)
                        .join(', ')}
                    </div>
                  </div>

                  {/* Middle: Order Total */}
                  <div className="text-left lg:text-right min-w-[120px]">
                    <span className="text-[10px] text-stone-500 uppercase font-bold block">
                      Order Amount
                    </span>
                    <span className="font-serif font-black text-xl text-heritage-maroon">
                      {formatINR(order.total)}
                    </span>
                    <span className="text-[10px] text-stone-400 block">
                      {order.paymentMethod === 'CASH_ON_DELIVERY' ? 'Cash on Delivery' : 'Prepaid'}
                    </span>
                  </div>

                  {/* Right: Direct Action Buttons (ACCEPT / REJECT / ADVANCE) */}
                  <div className="flex flex-wrap items-center gap-2 pt-3 lg:pt-0 border-t lg:border-t-0 border-stone-100">
                    {/* View Modal Trigger */}
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="p-2.5 rounded-xl bg-cream-100 hover:bg-cream-200 text-stone-700 transition-colors border border-amber-900/10"
                      title="View Full Order Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    {/* Workflows based on status */}
                    {order.status === 'PENDING' && (
                      <>
                        <button
                          onClick={() => handleUpdateStatus(order.id, 'ACCEPTED')}
                          disabled={isUpdatingStatus}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1.5 active:scale-95 disabled:opacity-50"
                        >
                          <Check className="w-4 h-4 stroke-[3]" />
                          <span>ACCEPT ORDER</span>
                        </button>

                        <button
                          onClick={() => setRejectModalOrder(order)}
                          disabled={isUpdatingStatus}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 active:scale-95 disabled:opacity-50"
                        >
                          <X className="w-4 h-4" />
                          <span>REJECT</span>
                        </button>
                      </>
                    )}

                    {order.status === 'ACCEPTED' && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, 'PROCESSING')}
                        disabled={isUpdatingStatus}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
                      >
                        <Package className="w-4 h-4" />
                        <span>Start Processing</span>
                      </button>
                    )}

                    {order.status === 'PROCESSING' && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, 'READY')}
                        disabled={isUpdatingStatus}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>Mark Ready</span>
                      </button>
                    )}

                    {order.status === 'READY' && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, 'OUT_FOR_DELIVERY')}
                        disabled={isUpdatingStatus}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
                      >
                        <Truck className="w-4 h-4" />
                        <span>Dispatch / Out for Delivery</span>
                      </button>
                    )}

                    {order.status === 'OUT_FOR_DELIVERY' && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, 'DELIVERED')}
                        disabled={isUpdatingStatus}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Mark Delivered</span>
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>

      {/* Order Details Inspection Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-amber-900/10 space-y-6">
            <div className="flex justify-between items-start border-b border-stone-100 pb-4">
              <div>
                <span className="text-xs text-stone-500 font-bold uppercase">Order Inspection</span>
                <h3 className="font-serif font-black text-2xl text-heritage-maroon">
                  {selectedOrder.orderNumber}
                </h3>
                <span className="text-xs text-stone-400">{formatDate(selectedOrder.createdAt)}</span>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer & Address Details */}
            <div className="bg-[#FAF5EC] p-4 rounded-2xl border border-amber-900/10 text-xs space-y-2">
              <strong className="text-stone-900 font-serif text-sm block">Customer & Shipping Information</strong>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-stone-700">
                <div>Name: <strong>{selectedOrder.customer?.name}</strong></div>
                <div>Phone: <strong>+91 {selectedOrder.customer?.phone}</strong></div>
                {selectedOrder.customer?.email && <div>Email: {selectedOrder.customer?.email}</div>}
                <div>City/State: {selectedOrder.customer?.city}, {selectedOrder.customer?.state}</div>
                <div className="sm:col-span-2">
                  Full Address: <strong>{selectedOrder.customer?.address} - PIN: {selectedOrder.customer?.pincode}</strong>
                </div>
                {selectedOrder.notes && (
                  <div className="sm:col-span-2 text-stone-600 italic">
                    Notes: "{selectedOrder.notes}"
                  </div>
                )}
              </div>
            </div>

            {/* Line Items Table */}
            <div className="space-y-3">
              <strong className="text-stone-900 font-serif text-sm block">Ordered Items</strong>
              <div className="border border-stone-100 rounded-2xl overflow-hidden divide-y divide-stone-100 text-xs">
                {selectedOrder.items.map((item) => (
                  <div key={item.id} className="p-3 flex justify-between items-center">
                    <div>
                      <strong className="text-stone-900 block">{item.productName}</strong>
                      <span className="text-stone-500">{item.variantName} × {item.quantity} units</span>
                    </div>
                    <span className="font-bold text-stone-800">{formatINR(item.totalPrice)}</span>
                  </div>
                ))}
              </div>
              <div className="text-right space-y-1 text-xs pt-1">
                <div>Subtotal: {formatINR(selectedOrder.subtotal)}</div>
                <div>Delivery Fee: {selectedOrder.deliveryFee === 0 ? 'FREE' : formatINR(selectedOrder.deliveryFee)}</div>
                <div className="font-serif font-black text-lg text-heritage-maroon pt-1 border-t border-stone-100">
                  Total: {formatINR(selectedOrder.total)}
                </div>
              </div>
            </div>

            {/* Audit Status History */}
            {selectedOrder.statusHistory && selectedOrder.statusHistory.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-stone-100">
                <strong className="text-stone-900 font-serif text-xs block">Status Change Audit Log</strong>
                <div className="space-y-1.5 max-h-32 overflow-y-auto">
                  {selectedOrder.statusHistory.map((hist) => (
                    <div key={hist.id} className="text-[11px] text-stone-600 bg-stone-50 p-2 rounded-lg flex justify-between">
                      <div>
                        <strong className="text-stone-800">{hist.newStatus}</strong> — {hist.note || 'Status updated'} ({hist.changedBy})
                      </div>
                      <span className="text-stone-400">{formatDate(hist.createdAt)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Reject Confirmation Modal */}
      {rejectModalOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="w-5 h-5" />
              <h3 className="font-serif font-bold text-lg text-stone-900">
                Reject Order #{rejectModalOrder.orderNumber}?
              </h3>
            </div>
            <p className="text-xs text-stone-600">
              Rejecting this order will update the database status to <strong>REJECTED</strong> and notify customer tracking immediately.
            </p>
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                Reason for Rejection (Optional)
              </label>
              <textarea
                rows={2}
                value={rejectionNote}
                onChange={(e) => setRejectionNote(e.target.value)}
                placeholder="e.g. Out of stock, delivery location unserviceable"
                className="w-full px-3 py-2 bg-cream-50 border border-stone-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-red-400"
              />
            </div>
            <div className="flex gap-3 justify-end pt-2">
              <button
                onClick={() => setRejectModalOrder(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100"
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  handleUpdateStatus(
                    rejectModalOrder.id,
                    'REJECTED',
                    rejectionNote || 'Order rejected by administration'
                  )
                }
                className="px-4 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white shadow-md"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
