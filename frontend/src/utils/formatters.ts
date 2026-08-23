/**
 * Format price in Indian Rupee format (e.g. ₹1,250.00 or ₹150)
 */
export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format ISO date string into readable Indian standard format
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(date);
}

export const formatDateTime = formatDate;

/**
 * Validate 10-digit Indian Mobile Number
 */
export function validateIndianMobile(phone: string): boolean {
  const regex = /^[6-9]\d{9}$/;
  return regex.test(phone.trim());
}

/**
 * Validate 6-digit Indian PIN Code
 */
export function validateIndianPincode(pincode: string): boolean {
  const regex = /^\d{6}$/;
  return regex.test(pincode.trim());
}

/**
 * Order status human-readable labels and color maps
 */
export const STATUS_CONFIG: Record<
  string,
  { label: string; bg: string; text: string; border: string; desc: string }
> = {
  PENDING: {
    label: 'Pending Approval',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    desc: 'Your order has been received and is waiting for confirmation from our kitchen/mill team.',
  },
  ACCEPTED: {
    label: 'Order Accepted',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    desc: 'Our team has verified and accepted your order. Fresh preparation will begin shortly.',
  },
  REJECTED: {
    label: 'Order Rejected',
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-200',
    desc: 'Unfortunately, this order could not be accepted due to high volume or stock availability.',
  },
  PROCESSING: {
    label: 'Packaging & Processing',
    bg: 'bg-indigo-50',
    text: 'text-indigo-700',
    border: 'border-indigo-200',
    desc: 'Your items are being freshly packed with hygienic moisture-proof sealing.',
  },
  READY: {
    label: 'Ready for Dispatch',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    desc: 'Your package is ready and awaiting courier/delivery pickup.',
  },
  OUT_FOR_DELIVERY: {
    label: 'Out for Delivery',
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    border: 'border-purple-200',
    desc: 'Your order is out on the delivery vehicle and will arrive at your address today.',
  },
  CANCELLED: {
    label: 'Cancelled',
    bg: 'bg-stone-100',
    text: 'text-stone-700',
    border: 'border-stone-300',
    desc: 'This order was cancelled.',
  },
};

/**
 * Helper to resolve product image paths correctly on GitHub Pages subpaths,
 * custom domains, mobile browsers, and local development.
 */
export function getProductImageUrl(url?: string | null): string {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url;
  }
  const cleanPath = url.startsWith('/') ? url.slice(1) : url;

  // On GitHub Pages (pathname contains /annapurna-aahaar or host github.io)
  if (
    typeof window !== 'undefined' &&
    (window.location.pathname.includes('/annapurna-aahaar') ||
      window.location.hostname.includes('github.io'))
  ) {
    return `/annapurna-aahaar/${cleanPath}`;
  }

  const baseUrl = import.meta.env.BASE_URL || './';
  const prefix = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  return `${prefix}${cleanPath}`;
}
