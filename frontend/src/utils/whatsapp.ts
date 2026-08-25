/**
 * Annapurna Aahaar — WhatsApp Direct Ordering Generator
 * Formats structured, professional order messages for direct placement via WhatsApp.
 */

export interface WhatsAppOrderPayload {
  customerName?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  items: Array<{
    name: string;
    weight: string;
    quantity: number;
    price: number;
  }>;
  subtotal: number;
  discount?: number;
  couponCode?: string;
  shippingFee: number;
  grandTotal: number;
  paymentPreference?: string;
  notes?: string;
}

export const OFFICIAL_WHATSAPP_NUMBER = '919542836358'; // Official WhatsApp & Support Line

export function generateWhatsAppOrderUrl(payload: WhatsAppOrderPayload, targetPhone = OFFICIAL_WHATSAPP_NUMBER): string {
  const cleanPhone = targetPhone.replace(/\D/g, '');
  const finalPhone = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;

  let message = `🌾 *ANNAPURNA AAHAAR — DIRECT ORDER* 🌾\n\n`;
  message += `Hello Annapurna Aahaar, I would like to place an order from your official store:\n\n`;

  if (payload.customerName) {
    message += `👤 *Customer Details:*\n`;
    message += `• *Name:* ${payload.customerName}\n`;
    if (payload.phone) message += `• *Phone:* ${payload.phone}\n`;
    if (payload.address) {
      message += `• *Address:* ${payload.address}`;
      if (payload.city) message += `, ${payload.city}`;
      if (payload.state) message += `, ${payload.state}`;
      if (payload.pincode) message += ` - ${payload.pincode}`;
      message += `\n`;
    }
    message += `\n`;
  }

  message += `📦 *Ordered Items:*\n`;
  payload.items.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    message += `${index + 1}. *${item.name}* (${item.weight}) x ${item.quantity} = ₹${itemTotal.toFixed(0)}\n`;
  });

  message += `\n💰 *Bill Summary:*\n`;
  message += `• Items Subtotal: ₹${payload.subtotal.toFixed(0)}\n`;
  if (payload.discount && payload.discount > 0) {
    message += `• Discount (${payload.couponCode || 'Promo'}): -₹${payload.discount.toFixed(0)}\n`;
  }
  message += `• Shipping Delivery: ${payload.shippingFee === 0 ? 'FREE' : `₹${payload.shippingFee.toFixed(0)}`}\n`;
  message += `• *Grand Total: ₹${payload.grandTotal.toFixed(0)}*\n\n`;

  if (payload.paymentPreference) {
    message += `💳 *Payment Mode:* ${payload.paymentPreference}\n`;
  }
  if (payload.notes) {
    message += `📝 *Notes:* ${payload.notes}\n`;
  }

  message += `\n_Please confirm availability and dispatch details. Thank you!_ 🙏`;

  return `https://wa.me/${finalPhone}?text=${encodeURIComponent(message)}`;
}

export function generateSingleProductWhatsAppUrl(
  productName: string,
  variantWeight: string,
  price: number,
  quantity = 1,
  targetPhone = OFFICIAL_WHATSAPP_NUMBER
): string {
  const total = price * quantity;
  return generateWhatsAppOrderUrl(
    {
      items: [{ name: productName, weight: variantWeight, quantity, price }],
      subtotal: total,
      shippingFee: total >= 500 ? 0 : 40,
      grandTotal: total >= 500 ? total : total + 40,
      paymentPreference: 'Cash on Delivery / UPI (9542836358@ybl)',
    },
    targetPhone
  );
}
