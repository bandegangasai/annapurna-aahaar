export interface OrderItemRequest {
  productId: string;
  variantId: string;
  quantity: number;
}

export interface CustomerDetails {
  name: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export interface CreateOrderRequest {
  customer: CustomerDetails;
  items: OrderItemRequest[];
  notes?: string;
  paymentMethod?: string;
}

export interface AdminJwtPayload {
  userId: string;
  email: string;
  role: string;
  name: string;
}

export type OrderStatus =
  | 'PENDING'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'PROCESSING'
  | 'READY'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED';
