export interface ProductVariant {
  id: string;
  productId: string;
  weight: string;
  unit: string;
  price: number;
  discountPrice?: number;
  stock: number;
  sku?: string;
  isActive: boolean;
}

export interface Review {
  id: string;
  productId: string;
  productName?: string;
  customerName: string;
  customerLocation?: string;
  rating: number; // 1 to 5
  title?: string;
  comment: string;
  isApproved: boolean;
  createdAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number; // e.g. 10 for 10% or 50 for ₹50
  minOrderAmount: number; // e.g. ₹250
  maxDiscount?: number; // e.g. ₹100 for percentage
  isActive: boolean;
  expiryDate?: string;
  usageCount?: number;
  description?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  imageUrl: string;
  gallery?: string[];
  isFeatured: boolean;
  isActive: boolean;
  sku?: string;
  ingredients?: string;
  packagingInfo?: string;
  seoTitle?: string;
  seoDescription?: string;
  variants: ProductVariant[];
  related?: Product[];
  reviews?: Review[];
  averageRating?: number;
  totalReviews?: number;
}

export interface StorePolicySettings {
  businessName: string;
  tagline: string;
  owner: string;
  location: string;
  pincode: string;
  phone: string;
  email: string;
  businessHours: string;
  upiId: string;
  shippingFee: number;
  freeShippingThreshold: number;
  estimatedDeliveryDays: string;
  shippingRegions: string;
  returnWindowDays: number;
  returnEligibility: string;
  refundPolicy: string;
  cancellationPolicy: string;
  announcementBanner?: string;
  seoTitle?: string;
  seoDescription?: string;
}

export interface CartItem {
  productId: string;
  variantId: string;
  productName: string;
  slug: string;
  imageUrl: string;
  weight: string;
  unit: string;
  unitPrice: number;
  quantity: number;
}

export interface Customer {
  id?: string;
  name: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  district?: string;
  state: string;
  pincode: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  variantId: string;
  productName: string;
  variantName: string;
  productNameSnapshot?: string;
  variantNameSnapshot?: string;
  weight?: string;
  unit?: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
}

export interface OrderStatusHistory {
  id: string;
  orderId: string;
  previousStatus: string | null;
  newStatus: string;
  note?: string;
  changedBy: string;
  createdAt: string;
}

export interface Payment {
  id: string;
  orderId: string;
  gateway: string;
  gatewayOrderId?: string;
  gatewayPaymentId?: string;
  transactionReference?: string;
  amount: number;
  currency: string;
  status: 'PENDING' | 'PROCESSING' | 'PAID' | 'FAILED' | 'REFUNDED' | 'PENDING_VERIFICATION';
  paymentMethod: string;
  manualUpiPhone?: string;
  manualUpiRef?: string;
  manualUpiNotes?: string;
  verifiedBy?: string;
  verifiedAt?: string;
  verificationNote?: string;
  failureReason?: string;
  createdAt: string;
  updatedAt?: string;
  order?: Order;
}

export interface IvrInteraction {
  id: string;
  callId: string;
  language: string;
  menu: string;
  dtmfInput?: string;
  action: string;
  details?: string;
  orderId?: string;
  customerId?: string;
  timestamp: string;
}

export interface Call {
  id: string;
  callSid: string;
  fromPhone: string;
  toPhone: string;
  language: string;
  startTime: string;
  endTime?: string;
  duration: number;
  status: string;
  selectedOption?: string;
  orderId?: string;
  orders?: Array<{ id: string; orderNumber: string; total: number; status: string }>;
  interactions?: IvrInteraction[];
  createdAt: string;
}

export interface CallCenterStats {
  totalCalls: number;
  todayCalls: number;
  completedCalls: number;
  missedCalls: number;
  ivrOrdersCount: number;
  avgDuration: number;
  languageCounts: Record<string, number>;
  optionCounts: Record<string, number>;
  ivrPhoneNumber: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customer: Customer;
  orderSource?: 'WEBSITE' | 'IVR' | 'ADMIN' | 'PHONE';
  language?: 'ENGLISH' | 'MARATHI' | 'HINDI' | 'TELUGU';
  callId?: string;
  call?: Call;
  status:
    | 'PENDING'
    | 'ACCEPTED'
    | 'REJECTED'
    | 'PROCESSING'
    | 'READY'
    | 'OUT_FOR_DELIVERY'
    | 'DELIVERED'
    | 'CANCELLED';
  subtotal: number;
  discountAmount?: number;
  couponCode?: string;
  deliveryFee: number;
  total: number;
  deliveryAddress?: string;
  city?: string;
  district?: string;
  state?: string;
  pincode?: string;
  customerNotes?: string;
  notes?: string; // backward compatible alias
  adminNotes?: string;
  paymentMethod: string; // 'OFFLINE', 'ONLINE', 'MANUAL_UPI'
  paymentStatus: 'PENDING' | 'PROCESSING' | 'PAID' | 'FAILED' | 'REFUNDED' | 'PENDING_VERIFICATION';
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  acceptedAt?: string;
  rejectedAt?: string;
  completedAt?: string;
  cancelledAt?: string;
  items: OrderItem[];
  payments?: Payment[];
  statusHistory: OrderStatusHistory[];
  createdAt: string;
  updatedAt: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface AdminStats {
  totalOrders: number;
  todayOrders?: number;
  pendingOrders: number;
  acceptedOrders: number;
  processingOrders: number;
  deliveredOrders: number;
  rejectedOrders: number;
  paidOrdersCount: number;
  paymentsToVerify?: number;
  totalRevenue: number;
  onlineOrdersCount?: number;
  offlineOrdersCount?: number;
  manualUpiOrdersCount?: number;
  websiteOrdersCount?: number;
  ivrOrdersCount?: number;
  totalCalls?: number;
  todayCalls?: number;
  totalCustomers: number;
  unreadContacts: number;
  business: {
    name: string;
    tagline: string;
    owner: string;
    location: string;
    pincode: string;
    phones: string[];
    ivrNumber?: string;
    paymentMobile?: string;
    upiId?: string | null;
    email: string;
  };
}

export interface CustomerSummary {
  id: string;
  name: string;
  phone: string;
  email?: string;
  preferredLanguage?: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  totalOrders: number;
  totalSpent: number;
  ivrOrdersCount?: number;
  webOrdersCount?: number;
  firstOrder: string;
  lastOrder: string;
  orders: Array<{
    id: string;
    orderNumber: string;
    total: number;
    status: string;
    orderSource?: string;
    createdAt: string;
  }>;
}

export interface SalesReport {
  totalOrders: number;
  paidRevenue: number;
  pendingRevenue: number;
  totalRevenue: number;
  websiteSales?: number;
  ivrSales?: number;
  phoneSales?: number;
  onlineRevenue?: number;
  offlineRevenue?: number;
  manualUpiRevenue?: number;
  salesByLanguage?: Record<string, { count: number; total: number }>;
  topProducts: Array<{
    name: string;
    quantity: number;
    revenue: number;
  }>;
}

export interface ContactMessage {
  id: string;
  name: string;
  phone: string;
  email?: string;
  subject?: string;
  message: string;
  callId?: string;
  language?: string;
  isRead: boolean;
  createdAt: string;
}
