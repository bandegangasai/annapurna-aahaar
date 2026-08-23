import React, { useState, useEffect } from 'react';
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
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { api } from '../../services/api';
import { formatINR, formatDateTime } from '../../utils/formatters';
import { Order, AdminStats, ContactMessage, Product } from '../../types';

export const AdminDashboard: React.FC = () => {
  const { admin, token, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'contacts'>('orders');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Filters & State
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Product price editor modal
  const [editingVariant, setEditingVariant] = useState<{
    variantId: string;
    productName: string;
    weight: string;
    price: number;
    stock: number;
  } | null>(null);

  const [lastSyncTime, setLastSyncTime] = useState<Date>(new Date());
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

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
          setOrders(ordersRes.data);
        }
      } catch (e) {
        console.warn('Orders fetch note:', e);
      }

      // 2. Fetch Stats
      try {
        const statsRes = await api.adminGetStats(token || undefined);
        if (statsRes.success && statsRes.data) {
          setStats(statsRes.data);
        }
      } catch (e) {
        console.warn('Stats fetch note:', e);
      }

      // 3. Fetch Contacts
      try {
        const contactsRes = await api.adminGetContactMessages(token || undefined);
        if (contactsRes.success && Array.isArray(contactsRes.data)) {
          setContacts(contactsRes.data);
        }
      } catch (e) {
        console.warn('Contacts fetch note:', e);
      }

      // 4. Fetch Products
      try {
        const productsRes = await api.getProducts();
        if (productsRes.success && Array.isArray(productsRes.data)) {
          setProducts(productsRes.data);
        }
      } catch (e) {
        console.warn('Products fetch note:', e);
      }

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
    if (!token) return;
    setActionLoadingId(orderId);
    try {
      const res = await api.adminUpdateOrderStatus(
        token,
        orderId,
        'ACCEPTED',
        undefined,
        'Accepted and sent to kitchen for preparation'
      );
      if (res.success) {
        showToast('Order successfully ACCEPTED!', 'success');
        fetchDashboardData();
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
    if (!token) return;
    const reason = window.prompt('Please enter a rejection reason for this order (optional):');
    if (reason === null) return; // User cancelled prompt

    setActionLoadingId(orderId);
    try {
      const res = await api.adminUpdateOrderStatus(
        token,
        orderId,
        'REJECTED',
        undefined,
        reason || 'Unable to fulfill order'
      );
      if (res.success) {
        showToast('Order has been REJECTED.', 'info');
        fetchDashboardData();
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
    if (!token) return;
    setActionLoadingId(orderId);
    try {
      const res = await api.adminUpdateOrderStatus(token, orderId, newStatus, paymentStatus);
      if (res.success) {
        showToast(`Order status updated to ${newStatus}!`, 'success');
        fetchDashboardData();
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

  // Update Product Variant Price
  const handleSaveVariantPrice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !editingVariant) return;

    try {
      const res = await api.adminUpdateVariantPrice(
        token,
        editingVariant.variantId,
        editingVariant.price,
        editingVariant.stock
      );
      if (res.success) {
        showToast(`Updated price for ${editingVariant.productName} (${editingVariant.weight})!`, 'success');
        setEditingVariant(null);
        fetchDashboardData();
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to update price.', 'error');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="bg-[#FAF6EE] min-h-screen pb-16">
      {/* Top Admin Header Bar */}
      <div className="bg-heritage-darkMaroon text-cream-100 border-b-2 border-heritage-gold/30 px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-heritage-maroon flex items-center justify-center font-serif font-black text-lg text-heritage-gold border border-heritage-gold/40">
              AA
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-lg text-cream-50">
                  Annapurna Aahaar Admin Portal
                </span>
                <span className="bg-heritage-gold text-heritage-darkMaroon text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                  Live Center
                </span>
              </div>
              <p className="text-xs text-cream-300">
                Owner: <strong>Bande Omkar</strong> | Bhainsa, Nirmal District, Telangana (504103)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            <div className="text-right hidden sm:block text-xs">
              <span className="text-cream-300">Logged in as</span>
              <p className="font-bold text-heritage-gold">{admin?.name || 'Bande Omkar'}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 bg-red-950/80 hover:bg-red-900 text-red-200 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors border border-red-800"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Prominent New Pending Orders Alert Banner */}
        {stats && stats.pendingOrders > 0 && (
          <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 text-white rounded-3xl p-5 sm:p-6 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4 animate-pulse">
            <div className="flex items-center gap-3 text-center sm:text-left">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-serif font-black text-xl text-white">
                  {stats.pendingOrders} NEW PENDING ORDER{stats.pendingOrders > 1 ? 'S' : ''} AWAITING ACTION!
                </h3>
                <p className="text-xs text-white/90">
                  Please review customer address and click <strong>ACCEPT ORDER</strong> or <strong>REJECT ORDER</strong> below.
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setActiveTab('orders');
                setStatusFilter('PENDING');
              }}
              className="bg-white text-amber-900 px-6 py-2.5 rounded-2xl text-xs font-black shadow-md hover:bg-cream-100 transition-colors uppercase tracking-wider shrink-0"
            >
              Review Pending Orders →
            </button>
          </div>
        )}

        {/* Metric Cards Grid */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
            <div className="bg-white p-5 rounded-3xl border border-heritage-gold/30 shadow-sm space-y-1">
              <span className="text-xs text-stone-500 uppercase font-bold">Total Orders</span>
              <p className="font-serif font-black text-2xl text-stone-900">{stats.totalOrders}</p>
            </div>

            <div className="bg-amber-50 p-5 rounded-3xl border border-amber-300 shadow-sm space-y-1">
              <span className="text-xs text-amber-800 uppercase font-bold">Pending Review</span>
              <p className="font-serif font-black text-2xl text-amber-900">{stats.pendingOrders}</p>
            </div>

            <div className="bg-emerald-50 p-5 rounded-3xl border border-emerald-300 shadow-sm space-y-1">
              <span className="text-xs text-emerald-800 uppercase font-bold">Accepted / Active</span>
              <p className="font-serif font-black text-2xl text-emerald-900">
                {stats.acceptedOrders + stats.processingOrders}
              </p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-heritage-gold/30 shadow-sm space-y-1">
              <span className="text-xs text-stone-500 uppercase font-bold">Delivered</span>
              <p className="font-serif font-black text-2xl text-emerald-700">{stats.deliveredOrders}</p>
            </div>

            <div className="bg-heritage-darkMaroon text-cream-100 p-5 rounded-3xl border border-heritage-gold shadow-sm space-y-1 col-span-2 lg:col-span-1">
              <span className="text-xs text-heritage-gold uppercase font-bold">Total Revenue</span>
              <p className="font-serif font-black text-2xl text-cream-50">
                {formatINR(stats.totalRevenue)}
              </p>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex items-center gap-3 border-b border-heritage-gold/30 pb-2">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-5 py-2.5 rounded-2xl text-sm font-bold transition-all ${
              activeTab === 'orders'
                ? 'bg-heritage-maroon text-cream-100 shadow-md border border-heritage-gold'
                : 'bg-white text-stone-700 hover:bg-cream-100 border border-stone-200'
            }`}
          >
            Order Management ({orders.length})
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`px-5 py-2.5 rounded-2xl text-sm font-bold transition-all ${
              activeTab === 'products'
                ? 'bg-heritage-maroon text-cream-100 shadow-md border border-heritage-gold'
                : 'bg-white text-stone-700 hover:bg-cream-100 border border-stone-200'
            }`}
          >
            Product & Price Editor
          </button>

          <button
            onClick={() => setActiveTab('contacts')}
            className={`px-5 py-2.5 rounded-2xl text-sm font-bold transition-all ${
              activeTab === 'contacts'
                ? 'bg-heritage-maroon text-cream-100 shadow-md border border-heritage-gold'
                : 'bg-white text-stone-700 hover:bg-cream-100 border border-stone-200'
            }`}
          >
            Customer Enquiries ({contacts.length})
          </button>

          <div className="ml-auto flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              Live Cloud Sync
            </span>
            <button
              onClick={() => fetchDashboardData(false)}
              title="Force Sync All Orders"
              disabled={isSyncing}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-cream-100 border border-heritage-gold/30 text-stone-700 text-xs font-bold shadow-xs active:scale-95 transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-heritage-maroon' : ''}`} />
              <span>Sync Orders</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Orders Management */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {/* Filter Bar */}
            <div className="bg-white p-4 sm:p-5 rounded-3xl border border-heritage-gold/25 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
              {/* Status Filter Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 w-full md:w-auto scrollbar-none">
                {['ALL', 'PENDING', 'ACCEPTED', 'PROCESSING', 'DELIVERED', 'REJECTED'].map((st) => (
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

              {/* Search Order / Phone */}
              <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 w-full md:w-72">
                <input
                  type="text"
                  placeholder="Search Order # or phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#FAF6EE] border border-heritage-gold/30 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-heritage-gold"
                />
                <button
                  type="submit"
                  className="bg-heritage-maroon text-cream-100 px-3.5 py-2 rounded-xl text-xs font-bold"
                >
                  Search
                </button>
              </form>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-3xl border border-heritage-gold/30 shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-[#FAF6EE] text-stone-700 font-bold border-b border-heritage-gold/20">
                    <tr>
                      <th className="p-4">Order Details</th>
                      <th className="p-4">Customer & Location</th>
                      <th className="p-4">Total Amount</th>
                      <th className="p-4">Payment</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {orders.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-stone-500">
                          No orders found matching this filter.
                        </td>
                      </tr>
                    ) : (
                      orders.map((ord) => {
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
                            {/* Order # & Date */}
                            <td className="p-4">
                              <span className="font-mono font-bold text-heritage-maroon block">
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
                              <span className="font-bold text-stone-900 block">
                                {custName}
                              </span>
                              <span className="text-xs text-stone-600 block">
                                📞 {custPhone}
                              </span>
                              <span className="text-[11px] text-stone-500 block line-clamp-1">
                                📍 {custCity}, {custState} ({custPincode})
                              </span>
                            </td>

                            {/* Total */}
                            <td className="p-4 font-serif font-bold text-base text-stone-900">
                              {formatINR(ord.total || 0)}
                            </td>

                            {/* Payment */}
                            <td className="p-4">
                              <span className="font-medium text-xs text-stone-800 block">
                                {ord.paymentMethod === 'ONLINE_RAZORPAY' ? 'Online' : 'Cash on Delivery'}
                              </span>
                              <span
                                className={`inline-block text-[10px] font-black px-2 py-0.5 rounded-full mt-1 ${
                                  ord.paymentStatus === 'PAID'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-amber-100 text-amber-900'
                                }`}
                              >
                                {ord.paymentStatus || 'PENDING'}
                              </span>
                            </td>

                            {/* Status */}
                            <td className="p-4">
                              <span
                                className={`inline-flex items-center gap-1 text-xs font-black px-3 py-1 rounded-full ${
                                  ord.status === 'PENDING'
                                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                    : ord.status === 'ACCEPTED'
                                    ? 'bg-blue-100 text-blue-900 border border-blue-300'
                                    : ord.status === 'PROCESSING'
                                    ? 'bg-purple-100 text-purple-900 border border-purple-300'
                                    : ord.status === 'DELIVERED'
                                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                    : 'bg-red-100 text-red-900 border border-red-300'
                                }`}
                              >
                                {ord.status}
                              </span>
                            </td>

                            {/* Actions Column */}
                            <td className="p-4 text-right space-y-1.5">
                              {isPending ? (
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    onClick={() => handleAcceptOrder(ord.id)}
                                    disabled={actionLoadingId === ord.id}
                                    className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black px-3.5 py-1.5 rounded-xl shadow-sm transition-all active:scale-95 flex items-center gap-1"
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                    <span>ACCEPT</span>
                                  </button>
                                  <button
                                    onClick={() => handleRejectOrder(ord.id)}
                                    disabled={actionLoadingId === ord.id}
                                    className="bg-red-700 hover:bg-red-800 text-white text-xs font-black px-3 py-1.5 rounded-xl shadow-sm transition-all active:scale-95 flex items-center gap-1"
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
                                  <span>View & Update</span>
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

        {/* Tab 2: Product & Price Editor */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-heritage-gold/30 shadow-md space-y-6">
            <div>
              <h3 className="font-serif font-bold text-2xl text-heritage-maroon">
                Product Catalog & Price Manager
              </h3>
              <p className="text-xs text-stone-600">
                Update dynamic variant prices (e.g. 500g, 1kg, 2kg) and manage inventory directly.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((prod) => (
                <div
                  key={prod.id}
                  className="bg-[#FAF6EE] rounded-2xl p-4 border border-heritage-gold/30 flex flex-col justify-between"
                >
                  <div>
                    <div className="aspect-square bg-white rounded-xl p-2 mb-3 border border-stone-200 flex items-center justify-center">
                      <img src={prod.imageUrl} alt={prod.name} className="w-full h-full object-contain" />
                    </div>
                    <span className="text-[10px] font-bold text-heritage-maroon uppercase bg-heritage-gold/20 px-2 py-0.5 rounded-full">
                      {prod.category}
                    </span>
                    <h4 className="font-serif font-bold text-base text-stone-900 mt-1 line-clamp-1">
                      {prod.name}
                    </h4>
                  </div>

                  <div className="mt-4 pt-3 border-t border-stone-200 space-y-2">
                    <span className="text-[11px] font-bold text-stone-500 uppercase">Variants & Pricing:</span>
                    {prod.variants.map((v) => (
                      <div
                        key={v.id}
                        className="flex items-center justify-between text-xs bg-white p-2 rounded-xl border border-stone-200"
                      >
                        <div>
                          <span className="font-bold text-stone-800">{v.weight}</span>
                          <span className="text-stone-500 block font-semibold text-[11px]">
                            {formatINR(v.price)}
                          </span>
                        </div>
                        <button
                          onClick={() =>
                            setEditingVariant({
                              variantId: v.id,
                              productName: prod.name,
                              weight: v.weight,
                              price: v.price,
                              stock: v.stock,
                            })
                          }
                          className="p-1.5 rounded-lg bg-heritage-gold/20 text-heritage-darkMaroon hover:bg-heritage-gold/40 transition-colors"
                          title="Edit Price"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Customer Enquiries */}
        {activeTab === 'contacts' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-heritage-gold/30 shadow-md space-y-6">
            <h3 className="font-serif font-bold text-2xl text-heritage-maroon">
              Customer Enquiries & Messages
            </h3>

            <div className="space-y-4">
              {contacts.length === 0 ? (
                <p className="text-stone-500 text-center py-8">No customer messages received yet.</p>
              ) : (
                contacts.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-5 rounded-2xl border transition-all ${
                      msg.isRead
                        ? 'bg-[#FAF6EE] border-stone-200'
                        : 'bg-cream-100 border-heritage-gold shadow-sm'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-2 gap-1">
                      <div className="flex items-center gap-2">
                        <span className="font-serif font-bold text-base text-stone-900">
                          {msg.name}
                        </span>
                        <span className="text-xs text-stone-600">📞 {msg.phone}</span>
                        {msg.email && <span className="text-xs text-stone-500">✉️ {msg.email}</span>}
                      </div>
                      <span className="text-[11px] text-stone-400">
                        {formatDateTime(msg.createdAt)}
                      </span>
                    </div>
                    {msg.subject && (
                      <p className="font-bold text-xs text-heritage-maroon mb-1">{msg.subject}</p>
                    )}
                    <p className="text-xs text-stone-700 leading-relaxed bg-white p-3 rounded-xl border border-stone-200">
                      {msg.message}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Order Detail & Status Update Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 border-2 border-heritage-gold/40 shadow-2xl space-y-6 animate-scaleIn">
            <div className="flex justify-between items-start border-b border-stone-100 pb-4">
              <div>
                <span className="text-xs text-stone-500 uppercase font-bold">Order Details</span>
                <h3 className="font-mono font-black text-2xl text-heritage-maroon">
                  #{selectedOrder.orderNumber}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-stone-400 hover:text-stone-700 text-2xl font-bold"
              >
                ✕
              </button>
            </div>

            {/* Status Selector Controls */}
            <div className="bg-[#FAF6EE] p-4 rounded-2xl border border-heritage-gold/30 space-y-3">
              <span className="text-xs font-bold text-stone-700 uppercase block">
                Update Order Status:
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  'PENDING',
                  'ACCEPTED',
                  'PROCESSING',
                  'READY',
                  'OUT_FOR_DELIVERY',
                  'DELIVERED',
                  'REJECTED',
                ].map((st) => (
                  <button
                    key={st}
                    onClick={() => handleStatusChange(selectedOrder.id, st)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      selectedOrder.status === st
                        ? 'bg-heritage-maroon text-cream-100 shadow-md border border-heritage-gold'
                        : 'bg-white text-stone-800 hover:bg-cream-200 border border-stone-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              {/* Payment Status Toggle */}
              <div className="pt-3 border-t border-stone-200 flex items-center justify-between text-xs">
                <span className="font-bold text-stone-700">Payment Status:</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleStatusChange(selectedOrder.id, selectedOrder.status, 'PAID')}
                    className={`px-3 py-1 rounded-xl font-bold ${
                      selectedOrder.paymentStatus === 'PAID'
                        ? 'bg-emerald-700 text-white'
                        : 'bg-white border border-stone-200 text-stone-700'
                    }`}
                  >
                    Mark PAID
                  </button>
                  <button
                    onClick={() => handleStatusChange(selectedOrder.id, selectedOrder.status, 'PENDING')}
                    className={`px-3 py-1 rounded-xl font-bold ${
                      selectedOrder.paymentStatus === 'PENDING'
                        ? 'bg-amber-600 text-white'
                        : 'bg-white border border-stone-200 text-stone-700'
                    }`}
                  >
                    Mark PENDING
                  </button>
                </div>
              </div>
            </div>

            {/* Customer Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-stone-50 rounded-xl">
                <span className="font-bold text-stone-700 block mb-1">Customer Info:</span>
                <p className="font-semibold text-stone-900">{selectedOrder.customer?.name || 'Customer'}</p>
                <p className="text-stone-600">Phone: {selectedOrder.customer?.phone || 'No phone'}</p>
                {selectedOrder.customer?.email && (
                  <p className="text-stone-600">Email: {selectedOrder.customer.email}</p>
                )}
              </div>

              <div className="p-3 bg-stone-50 rounded-xl">
                <span className="font-bold text-stone-700 block mb-1">Delivery Address:</span>
                <p className="text-stone-700">
                  {selectedOrder.customer?.address || ''}, {selectedOrder.customer?.city || 'Bhainsa'},{' '}
                  {selectedOrder.customer?.state || 'Telangana'} - {selectedOrder.customer?.pincode || '504103'}
                </p>
                {selectedOrder.notes && (
                  <p className="text-amber-800 font-medium mt-1">Note: {selectedOrder.notes}</p>
                )}
              </div>
            </div>

            {/* Line Items */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-stone-700 uppercase block">Items:</span>
              <div className="divide-y divide-stone-100 border border-stone-200 rounded-xl p-3 max-h-48 overflow-y-auto">
                {(selectedOrder.items || []).map((it) => (
                  <div key={it.id || it.variantId} className="py-2 flex justify-between text-xs">
                    <div>
                      <span className="font-bold text-stone-900">{it.productName}</span>
                      <span className="text-stone-500 block">
                        {it.variantName} × {it.quantity}
                      </span>
                    </div>
                    <span className="font-serif font-bold text-stone-900">
                      {formatINR(it.totalPrice || it.unitPrice * it.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-baseline pt-3 border-t border-stone-200">
              <span className="font-bold text-stone-700 text-sm">Total Payable:</span>
              <span className="font-serif font-black text-2xl text-heritage-maroon">
                {formatINR(selectedOrder.total)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Product Price Editor Modal */}
      {editingVariant && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveVariantPrice}
            className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 border-2 border-heritage-gold/40 shadow-2xl space-y-4"
          >
            <div className="flex justify-between items-start border-b border-stone-100 pb-3">
              <div>
                <span className="text-xs text-stone-500 uppercase font-bold">Edit Variant Price</span>
                <h3 className="font-serif font-bold text-xl text-heritage-maroon">
                  {editingVariant.productName}
                </h3>
                <span className="text-xs text-stone-600 font-semibold">
                  Pack Size: {editingVariant.weight}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setEditingVariant(null)}
                className="text-stone-400 hover:text-stone-700 text-xl font-bold"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">
                New Price (INR) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                step="1"
                required
                value={editingVariant.price}
                onChange={(e) =>
                  setEditingVariant({ ...editingVariant, price: parseFloat(e.target.value) || 0 })
                }
                className="w-full px-4 py-2.5 bg-[#FAF6EE] border border-heritage-gold/30 rounded-2xl text-sm font-bold text-stone-900"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">Stock Quantity</label>
              <input
                type="number"
                min="0"
                step="1"
                value={editingVariant.stock}
                onChange={(e) =>
                  setEditingVariant({ ...editingVariant, stock: parseInt(e.target.value, 10) || 0 })
                }
                className="w-full px-4 py-2.5 bg-[#FAF6EE] border border-heritage-gold/30 rounded-2xl text-sm font-bold text-stone-900"
              />
            </div>

            <div className="pt-2 flex gap-3">
              <button
                type="submit"
                className="flex-1 bg-heritage-maroon text-cream-100 py-3 rounded-2xl font-bold text-xs hover:bg-heritage-darkMaroon transition-colors"
              >
                Save Price
              </button>
              <button
                type="button"
                onClick={() => setEditingVariant(null)}
                className="px-4 py-3 rounded-2xl bg-stone-100 text-stone-700 font-bold text-xs hover:bg-stone-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
