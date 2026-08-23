import tls from 'tls';
import { ENV } from '../config/env';
import prisma from '../config/prisma';

interface OrderNotificationData {
  id: string;
  orderNumber: string;
  total: number;
  subtotal: number;
  deliveryFee: number;
  paymentMethod: string;
  paymentStatus: string;
  status: string;
  createdAt: Date;
  customerNotes?: string | null;
  customer: {
    name: string;
    phone: string;
    email?: string | null;
    address: string;
    city: string;
    district?: string | null;
    state: string;
    pincode: string;
  };
  items: Array<{
    productNameSnapshot?: string;
    productName?: string;
    variantNameSnapshot?: string;
    variantName?: string;
    unitPrice: number;
    totalPrice: number;
    quantity: number;
    weight?: string;
  }>;
}

/**
 * Lightweight native TLS SMTP client for Gmail (zero third-party package runtime failure risk)
 */
async function sendSmtpEmailNative(options: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}): Promise<boolean> {
  const { to, subject, html, text } = options;
  const user = ENV.GMAIL_USER || 'annapurnaaahaar@gmail.com';
  const pass = ENV.GMAIL_APP_PASSWORD;

  if (!pass) {
    console.log(`[Notification: Email Simulated] To: ${to} | Subject: ${subject}`);
    return true;
  }

  return new Promise((resolve) => {
    try {
      const socket = tls.connect(
        {
          host: ENV.SMTP_HOST || 'smtp.gmail.com',
          port: ENV.SMTP_PORT || 465,
          rejectUnauthorized: false,
        },
        () => {
          let step = 0;
          const authUserB64 = Buffer.from(user).toString('base64');
          const authPassB64 = Buffer.from(pass.replace(/\s+/g, '')).toString('base64');

          socket.on('data', (chunk) => {
            const res = chunk.toString();
            // Simple state machine for SMTP conversation
            if (res.startsWith('220') && step === 0) {
              step = 1;
              socket.write(`EHLO annapurnaaahaar.in\r\n`);
            } else if (res.startsWith('250') && step === 1) {
              step = 2;
              socket.write(`AUTH LOGIN\r\n`);
            } else if (res.startsWith('334') && step === 2) {
              step = 3;
              socket.write(`${authUserB64}\r\n`);
            } else if (res.startsWith('334') && step === 3) {
              step = 4;
              socket.write(`${authPassB64}\r\n`);
            } else if (res.startsWith('235') && step === 4) {
              step = 5;
              socket.write(`MAIL FROM:<${user}>\r\n`);
            } else if (res.startsWith('250') && step === 5) {
              step = 6;
              socket.write(`RCPT TO:<${to}>\r\n`);
            } else if (res.startsWith('250') && step === 6) {
              step = 7;
              socket.write(`DATA\r\n`);
            } else if (res.startsWith('354') && step === 7) {
              step = 8;
              const boundary = `----=_Part_${Date.now()}`;
              const message = [
                `From: "Annapurna Aahaar" <${user}>`,
                `To: <${to}>`,
                `Subject: =?UTF-8?B?${Buffer.from(subject).toString('base64')}?=`,
                `MIME-Version: 1.0`,
                `Content-Type: multipart/alternative; boundary="${boundary}"`,
                ``,
                `--${boundary}`,
                `Content-Type: text/plain; charset=UTF-8`,
                ``,
                text || 'Order notification from Annapurna Aahaar',
                ``,
                `--${boundary}`,
                `Content-Type: text/html; charset=UTF-8`,
                ``,
                html,
                ``,
                `--${boundary}--`,
                `.`,
                ``,
              ].join('\r\n');

              socket.write(message);
            } else if (res.startsWith('250') && step === 8) {
              step = 9;
              socket.write(`QUIT\r\n`);
              socket.end();
              resolve(true);
            } else if (res.startsWith('5') || res.startsWith('4')) {
              console.warn(`[SMTP Warning] Response from server: ${res.trim()}`);
              socket.end();
              resolve(false);
            }
          });
        }
      );

      socket.on('error', (err) => {
        console.warn(`[SMTP Connection Note]: ${err.message}`);
        resolve(false);
      });

      socket.setTimeout(8000, () => {
        socket.destroy();
        resolve(false);
      });
    } catch (e) {
      console.warn('[SMTP Error Note]', e);
      resolve(false);
    }
  });
}

/**
 * Dispatch SMS via HTTP Gateway or log format
 */
async function sendSmsNotification(phone: string, text: string): Promise<boolean> {
  try {
    console.log(`📱 [SMS/WhatsApp Dispatch] To: ${phone} | Text: "${text}"`);

    // If a live SMS Gateway API Key is set, trigger HTTP request
    if (ENV.SMS_API_KEY) {
      try {
        await fetch('https://www.fast2sms.com/dev/bulkV2', {
          method: 'POST',
          headers: {
            authorization: ENV.SMS_API_KEY,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            route: 'q',
            message: text,
            language: 'english',
            numbers: phone.replace(/[^0-9]/g, '').slice(-10),
          }),
        });
      } catch (smsErr) {
        console.warn('[SMS Gateway Dispatch Note]:', smsErr);
      }
    }
    return true;
  } catch {
    return false;
  }
}

export class NotificationService {
  /**
   * 1. Send notifications when an order is created:
   *   - Email to Customer's registered email
   *   - Email alert to annapurnaaahaar@gmail.com
   *   - SMS message to Customer's registered mobile
   *   - SMS alert to Business mobile (6305970844)
   */
  public async sendOrderPlaced(order: OrderNotificationData): Promise<void> {
    const customer = order.customer;
    const trackingUrl = `${ENV.LIVE_SITE_URL}/#/track/${encodeURIComponent(order.orderNumber)}`;
    const adminUrl = `${ENV.LIVE_SITE_URL}/#/admin/dashboard`;

    const formattedTotal = `₹${order.total}`;
    const itemsListHtml = order.items
      .map(
        (it) => `
        <tr style="border-bottom: 1px solid #f1e5d1;">
          <td style="padding: 10px 8px; font-weight: bold; color: #292524;">
            ${it.productNameSnapshot || it.productName} 
            <span style="display:block; font-size: 11px; color: #78716c; font-weight: normal;">
              ${it.variantNameSnapshot || it.variantName || it.weight || ''} × ${it.quantity}
            </span>
          </td>
          <td style="padding: 10px 8px; text-align: right; font-weight: bold; color: #800000;">
            ₹${it.totalPrice || it.unitPrice * it.quantity}
          </td>
        </tr>`
      )
      .join('');

    const itemsSummaryText = order.items
      .map((it) => `${it.productNameSnapshot || it.productName} (${it.variantNameSnapshot || it.variantName}) x${it.quantity}`)
      .join(', ');

    // ------------------------------------------------------------
    // A) Email to Customer (if customer email provided)
    // ------------------------------------------------------------
    if (customer.email && customer.email.includes('@')) {
      const customerSubject = `🌾 Order Confirmed! [#${order.orderNumber}] — Annapurna Aahaar`;
      const customerHtml = `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"></head>
        <body style="font-family: Arial, sans-serif; background-color: #FAF6EE; margin: 0; padding: 20px; color: #292524;">
          <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 20px; border: 2px solid #e7d8c0; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
            <div style="background-color: #800000; padding: 25px 20px; text-align: center; color: #FAF6EE;">
              <h1 style="margin: 0; font-family: Georgia, serif; font-size: 24px; letter-spacing: 1px;">Annapurna Aahaar</h1>
              <p style="margin: 4px 0 0 0; font-size: 12px; color: #D4AF37; font-style: italic;">Tradition in Every Grain.</p>
            </div>
            
            <div style="padding: 25px;">
              <h2 style="font-size: 18px; color: #800000; margin-top: 0;">Namaste ${customer.name},</h2>
              <p style="font-size: 14px; line-height: 1.5; color: #44403c;">
                Thank you for ordering with <strong>Annapurna Aahaar</strong>. We have received your order <strong>#${order.orderNumber}</strong> and it is being prepared with traditional hygiene and purity in Bhainsa, Nirmal District, Telangana.
              </p>

              <div style="background-color: #FAF6EE; padding: 15px; border-radius: 12px; margin: 20px 0; border: 1px solid #e7d8c0;">
                <h3 style="margin: 0 0 10px 0; font-size: 14px; color: #800000; text-transform: uppercase;">Order Details</h3>
                <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                  ${itemsListHtml}
                </table>
                <div style="margin-top: 15px; padding-top: 10px; border-top: 2px solid #dcd1be; display: flex; justify-content: space-between;">
                  <strong style="font-size: 15px; color: #800000;">Grand Total: ${formattedTotal}</strong>
                  <span style="font-size: 12px; color: #57534e;">Payment: <strong>${order.paymentMethod} (${order.paymentStatus})</strong></span>
                </div>
              </div>

              <div style="margin-bottom: 20px; font-size: 13px; color: #57534e;">
                <strong style="color: #292524; display: block; margin-bottom: 4px;">Delivery Address:</strong>
                ${customer.address}, ${customer.city}, ${customer.state} - ${customer.pincode}<br>
                <strong>Phone:</strong> ${customer.phone}
              </div>

              <div style="text-align: center; margin: 30px 0 10px 0;">
                <a href="${trackingUrl}" style="background-color: #800000; color: #ffffff; padding: 12px 25px; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 14px; display: inline-block;">
                  📍 Track Order Status Live
                </a>
              </div>
            </div>

            <div style="background-color: #FAF6EE; padding: 15px 20px; text-align: center; font-size: 11px; color: #78716c; border-top: 1px solid #e7d8c0;">
              <strong>Annapurna Aahaar</strong> | Bhainsa, Nirmal District, Telangana (504103)<br>
              Proprietor: Bande Omkar | Phones: 6305970844, 8688456925 | Email: annapurnaaahaar@gmail.com
            </div>
          </div>
        </body>
        </html>
      `;

      sendSmtpEmailNative({
        to: customer.email,
        subject: customerSubject,
        html: customerHtml,
        text: `Namaste ${customer.name}, your Annapurna Aahaar order #${order.orderNumber} for ${formattedTotal} has been placed. Track live at: ${trackingUrl}`,
      });
    }

    // ------------------------------------------------------------
    // B) Alert Email to Business: annapurnaaahaar@gmail.com
    // ------------------------------------------------------------
    const businessEmail = ENV.BUSINESS_EMAIL || 'annapurnaaahaar@gmail.com';
    const businessSubject = `🔔 NEW CUSTOMER ORDER: #${order.orderNumber} (${formattedTotal}) — Annapurna Aahaar`;
    const businessHtml = `
      <!DOCTYPE html>
      <html>
      <body style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px; margin: 0;">
        <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 2px solid #800000; overflow: hidden;">
          <div style="background-color: #800000; padding: 20px; color: #ffffff; text-align: center;">
            <h2 style="margin: 0; font-size: 20px;">🚨 NEW CUSTOMER ORDER RECEIVED!</h2>
            <p style="margin: 5px 0 0 0; font-size: 13px; color: #FAF6EE;">Annapurna Aahaar Business Management Alert</p>
          </div>

          <div style="padding: 20px; font-size: 13px; color: #292524;">
            <p style="font-size: 16px; font-weight: bold; color: #800000; margin-top: 0;">
              Order #${order.orderNumber} — Total: ${formattedTotal}
            </p>

            <div style="background-color: #fdfaf3; padding: 12px; border-radius: 10px; margin-bottom: 15px; border: 1px solid #e7d8c0;">
              <strong>Customer Information:</strong><br>
              <strong>Name:</strong> ${customer.name}<br>
              <strong>Phone:</strong> <a href="tel:${customer.phone}" style="color: #800000; font-weight: bold;">${customer.phone}</a><br>
              ${customer.email ? `<strong>Email:</strong> ${customer.email}<br>` : ''}
              <strong>Address:</strong> ${customer.address}, ${customer.city}, ${customer.state} - ${customer.pincode}<br>
              ${order.customerNotes ? `<strong>Note:</strong> <em style="color: #b45309;">${order.customerNotes}</em><br>` : ''}
            </div>

            <div style="margin-bottom: 15px;">
              <strong>Items Ordered:</strong>
              <table style="width: 100%; border-collapse: collapse; margin-top: 8px;">
                ${itemsListHtml}
              </table>
            </div>

            <div style="background-color: #e0f2fe; padding: 10px; border-radius: 8px; margin-bottom: 20px; color: #0369a1; font-weight: bold;">
              Payment Mode: ${order.paymentMethod} | Status: ${order.paymentStatus}
            </div>

            <div style="text-align: center;">
              <a href="${adminUrl}" style="background-color: #15803d; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 14px; display: inline-block;">
                ⚡ Open Admin Portal to Accept / Process Order
              </a>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    sendSmtpEmailNative({
      to: businessEmail,
      subject: businessSubject,
      html: businessHtml,
      text: `New Order #${order.orderNumber} from ${customer.name} (${customer.phone}) for ${formattedTotal}. Items: ${itemsSummaryText}. Open Admin: ${adminUrl}`,
    });

    // ------------------------------------------------------------
    // C) SMS Message to Customer Mobile
    // ------------------------------------------------------------
    const customerSmsText = `Namaste ${customer.name}! Your Annapurna Aahaar order #${order.orderNumber} of Rs.${order.total} has been received. Track live: ${trackingUrl} - Annapurna Aahaar, Bhainsa`;
    await sendSmsNotification(customer.phone, customerSmsText);

    // ------------------------------------------------------------
    // D) SMS Alert to Business Phone (6305970844)
    // ------------------------------------------------------------
    const businessPhone = ENV.BUSINESS_PHONE_PRIMARY || '6305970844';
    const businessSmsText = `New Order #${order.orderNumber} from ${customer.name} (${customer.phone}) for Rs.${order.total}. Payment: ${order.paymentMethod}. Admin: ${adminUrl}`;
    await sendSmsNotification(businessPhone, businessSmsText);

    // Record in Audit Log
    try {
      await prisma.auditLog.create({
        data: {
          action: 'NOTIFICATIONS_DISPATCHED',
          entity: 'Order',
          entityId: order.id,
          details: `Order #${order.orderNumber} notifications sent to Customer (${customer.phone}, ${customer.email || 'no email'}) and Business (${businessEmail}, ${businessPhone})`,
        },
      });
    } catch {}
  }

  /**
   * 2. Send status update notifications to customer
   */
  public async sendStatusUpdate(
    order: OrderNotificationData,
    newStatus: string,
    note?: string
  ): Promise<void> {
    const customer = order.customer;
    const trackingUrl = `${ENV.LIVE_SITE_URL}/#/track/${encodeURIComponent(order.orderNumber)}`;

    // Status Email to Customer
    if (customer.email && customer.email.includes('@')) {
      const subject = `📦 Order Update: #${order.orderNumber} is now ${newStatus} — Annapurna Aahaar`;
      const html = `
        <!DOCTYPE html>
        <html>
        <body style="font-family: Arial, sans-serif; background-color: #FAF6EE; padding: 20px; margin: 0;">
          <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 20px; border: 2px solid #e7d8c0; padding: 25px;">
            <h2 style="color: #800000; margin-top: 0;">Namaste ${customer.name},</h2>
            <p style="font-size: 15px; color: #292524;">
              Your order <strong>#${order.orderNumber}</strong> status has been updated to:
            </p>
            <div style="background-color: #800000; color: #FAF6EE; padding: 12px 20px; border-radius: 12px; text-align: center; font-size: 16px; font-weight: bold; margin: 15px 0;">
              ${newStatus}
            </div>
            ${note ? `<p style="font-size: 13px; color: #78716c;"><strong>Kitchen Note:</strong> ${note}</p>` : ''}
            <div style="text-align: center; margin-top: 25px;">
              <a href="${trackingUrl}" style="background-color: #800000; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 13px; display: inline-block;">
                View Live Tracking Timeline
              </a>
            </div>
          </div>
        </body>
        </html>
      `;

      sendSmtpEmailNative({
        to: customer.email,
        subject,
        html,
        text: `Your Annapurna Aahaar order #${order.orderNumber} status is now: ${newStatus}. Track at: ${trackingUrl}`,
      });
    }

    // SMS to Customer
    const smsText = `Annapurna Aahaar Update: Your order #${order.orderNumber} is now ${newStatus}. Track live: ${trackingUrl}`;
    await sendSmsNotification(customer.phone, smsText);
  }
}

export const notificationService = new NotificationService();
