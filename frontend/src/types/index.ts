export interface ProductVariant {
  id: string;
  productId: string;
  weight: string;
  unit: string;
  price: number;
  stock: number;
  isActive: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  imageUrl: string;
  isFeatured: boolean;
  isActive: boolean;
  variants: ProductVariant[];
  related?: Product[];
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

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customer: Customer;
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
  deliveryFee: number;
  total: number;
  notes?: string;
  paymentMethod: string; // 'OFFLINE_COD' or 'ONLINE_RAZORPAY'
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  items: OrderItem[];
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

export interface BusinessInfo {
  name: string;
  tagline: string;
  owner: string;
  location: string;
  pincode: string;
  phones: string[];
  email: string;
}

export interface AdminStats {
  totalOrders: number;
  pendingOrders: number;
  acceptedOrders: number;
  processingOrders: number;
  deliveredOrders: number;
  rejectedOrders: number;
  paidOrdersCount: number;
  totalRevenue: number;
  totalCustomers: number;
  unreadContacts: number;
  business?: BusinessInfo;
}

export interface ContactMessage {
  id: string;
  name: string;
  phone: string;
  email?: string;
  subject?: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}
