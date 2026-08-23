const API_BASE = import.meta.env.VITE_API_URL || '/api';

export async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {},
  token?: string | null
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'An error occurred during network request.');
  }

  return data;
}

// Public API Services
export const api = {
  // Products
  async getProducts(params?: { category?: string; search?: string; featured?: boolean }) {
    const query = new URLSearchParams();
    if (params?.category && params.category !== 'All') query.append('category', params.category);
    if (params?.search) query.append('search', params.search);
    if (params?.featured) query.append('featured', 'true');

    const url = `/products${query.toString() ? `?${query.toString()}` : ''}`;
    return fetchApi<{ success: boolean; count: number; data: any[] }>(url);
  },

  async getProductBySlug(slug: string) {
    return fetchApi<{ success: boolean; data: any }>(`/products/${slug}`);
  },

  async getCategories() {
    return fetchApi<{ success: boolean; data: Array<{ name: string; count: number }> }>('/products/categories');
  },

  // Orders
  async createOrder(orderPayload: {
    customer: {
      name: string;
      phone: string;
      email?: string;
      address: string;
      city: string;
      district?: string;
      state: string;
      pincode: string;
    };
    items: Array<{
      productId: string;
      variantId: string;
      quantity: number;
    }>;
    notes?: string;
    paymentMethod: 'OFFLINE' | 'ONLINE';
  }) {
    return fetchApi<{ success: boolean; message: string; data: any }>('/orders', {
      method: 'POST',
      body: JSON.stringify(orderPayload),
    });
  },

  async verifyOnlinePayment(payload: {
    orderId: string;
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
  }) {
    return fetchApi<{ success: boolean; message: string; data: any }>('/orders/razorpay-verify', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async getOrderByNumber(orderNumber: string) {
    return fetchApi<{ success: boolean; data: any; message?: string }>(`/orders/${orderNumber}`);
  },

  // Contact
  async submitContact(payload: {
    name: string;
    phone: string;
    email?: string;
    subject?: string;
    message: string;
  }) {
    return fetchApi<{ success: boolean; message: string; data: any }>('/contact', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  // Business Info
  async getBusinessInfo() {
    return fetchApi<{
      name: string;
      tagline: string;
      owner: string;
      location: string;
      pincode: string;
      phones: string[];
      email: string;
    }>('/business-info');
  },

  // Admin APIs
  async adminLogin(payload: { email: string; password: string }) {
    return fetchApi<{
      success: boolean;
      token: string;
      admin: { id: string; name: string; email: string; role: string };
    }>('/admin/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async adminGetStats(token: string) {
    return fetchApi<{ success: boolean; data: any }>('/admin/stats', {}, token);
  },

  async adminGetOrders(
    token: string,
    params?: { status?: string; search?: string; page?: number }
  ) {
    const query = new URLSearchParams();
    if (params?.status && params.status !== 'ALL') query.append('status', params.status);
    if (params?.search) query.append('search', params.search);
    if (params?.page) query.append('page', params.page.toString());

    return fetchApi<{
      success: boolean;
      data: any[];
      pagination: { total: number; page: number; limit: number; totalPages: number };
    }>(`/admin/orders?${query.toString()}`, {}, token);
  },

  async adminGetOrderById(token: string, id: string) {
    return fetchApi<{ success: boolean; data: any }>(`/admin/orders/${id}`, {}, token);
  },

  async adminUpdateOrderStatus(
    token: string,
    id: string,
    status: string,
    paymentStatus?: string,
    note?: string
  ) {
    return fetchApi<{ success: boolean; message: string; data: any }>(
      `/admin/orders/${id}/status`,
      {
        method: 'PATCH',
        body: JSON.stringify({ status, paymentStatus, note }),
      },
      token
    );
  },

  async adminUpdateVariantPrice(
    token: string,
    variantId: string,
    price: number,
    stock?: number
  ) {
    return fetchApi<{ success: boolean; message: string; data: any }>(
      `/admin/variants/${variantId}`,
      {
        method: 'PATCH',
        body: JSON.stringify({ price, stock }),
      },
      token
    );
  },

  async adminGetContactMessages(token: string) {
    return fetchApi<{ success: boolean; data: any[] }>('/admin/contact-messages', {}, token);
  },

  async adminMarkContactRead(token: string, id: string) {
    return fetchApi<{ success: boolean; data: any }>(
      `/admin/contact-messages/${id}/read`,
      { method: 'PATCH' },
      token
    );
  },
};
