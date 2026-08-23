import { Request, Response, NextFunction } from 'express';
import prisma from '../config/prisma';
import { ENV } from '../config/env';
import { realtimeService } from '../services/realtime';
import { notificationService } from '../services/notificationService';
import {
  IvrLanguage,
  getOrCreateSession,
  updateSession,
  ivrSessions,
  PROMPTS,
  buildTwimlResponse,
  getIvrProductMenuText,
  getIvrVariantMenuText,
  getIvrOrderConfirmationText,
} from '../services/ivrService';

// Helper to generate readable Order Number: AA-YYYYMMDD-XXXX
function generateOrderNumber(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `AA-${year}${month}${day}-${randomSuffix}`;
}

/**
 * 1. Incoming Call Webhook (POST/GET /api/ivr/incoming)
 * Answers call on 9347036152, logs session, and prompts for 4 languages.
 */
export const handleIncomingCall = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const callSid = String(req.body.CallSid || req.query.CallSid || `CALL_${Date.now()}`);
    const fromPhone = String(req.body.From || req.query.From || req.body.from || '9848012345').replace(/[^0-9]/g, '').slice(-10) || '9848012345';
    const toPhone = String(req.body.To || req.query.To || ENV.IVR_PHONE_NUMBER || '9347036152');

    // Create or update call record in persistent database
    const call = await prisma.call.upsert({
      where: { callSid },
      update: { status: 'IN_PROGRESS' },
      create: {
        callSid,
        fromPhone,
        toPhone,
        language: 'ENGLISH',
        status: 'IN_PROGRESS',
        startTime: new Date(),
      },
    });

    // Log IVR Interaction
    await prisma.ivrInteraction.create({
      data: {
        callId: call.id,
        language: 'ENGLISH',
        menu: 'LANGUAGE_MENU',
        action: 'CALL_ANSWERED',
        details: `Incoming call from ${fromPhone} on dedicated IVR line ${toPhone}`,
      },
    }).catch(() => {});

    // Broadcast live event to Admin Dashboard
    realtimeService.broadcast('new_ivr_call', {
      callId: call.id,
      callSid: call.callSid,
      fromPhone: call.fromPhone,
      toPhone: call.toPhone,
      startTime: call.startTime,
    });

    updateSession(callSid, { fromPhone, toPhone, step: 'LANGUAGE_SELECT' });

    const twiml = buildTwimlResponse({
      say: PROMPTS.GREETING_LANG_SELECT.ENGLISH,
      language: 'ENGLISH',
      gatherAction: `${ENV.LIVE_SITE_URL}/api/ivr/select-language`,
      numDigits: 1,
      timeout: 8,
    });

    res.type('text/xml').send(twiml);
  } catch (error) {
    next(error);
  }
};

/**
 * 2. Language Selection (POST /api/ivr/select-language)
 */
export const handleSelectLanguage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const callSid = String(req.body.CallSid || req.query.CallSid || req.body.callSid || '');
    const digits = String(req.body.Digits || req.query.Digits || req.body.digits || '1').trim();
    const session = getOrCreateSession(callSid, String(req.body.From || ''));

    let selectedLang: IvrLanguage = 'ENGLISH';
    if (digits === '2') selectedLang = 'MARATHI';
    else if (digits === '3') selectedLang = 'HINDI';
    else if (digits === '4') selectedLang = 'TELUGU';

    updateSession(callSid, { language: selectedLang, step: 'MAIN_MENU' });

    // Update call record in DB
    await prisma.call.updateMany({
      where: { callSid },
      data: { language: selectedLang },
    });

    const callRecord = await prisma.call.findUnique({ where: { callSid } });
    if (callRecord) {
      await prisma.ivrInteraction.create({
        data: {
          callId: callRecord.id,
          language: selectedLang,
          menu: 'LANGUAGE_MENU',
          dtmfInput: digits,
          action: 'LANGUAGE_SELECTED',
          details: `Caller selected language: ${selectedLang}`,
        },
      }).catch(() => {});
    }

    const menuPrompt = PROMPTS.MAIN_MENU[selectedLang];
    const twiml = buildTwimlResponse({
      say: menuPrompt,
      language: selectedLang,
      gatherAction: `${ENV.LIVE_SITE_URL}/api/ivr/main-menu`,
      numDigits: 1,
      timeout: 7,
    });

    res.type('text/xml').send(twiml);
  } catch (error) {
    next(error);
  }
};

/**
 * 3. Main Menu Navigation (POST /api/ivr/main-menu)
 */
export const handleMainMenu = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const callSid = String(req.body.CallSid || req.query.CallSid || req.body.callSid || '');
    const digits = String(req.body.Digits || req.query.Digits || req.body.digits || '1').trim();
    const session = getOrCreateSession(callSid, String(req.body.From || ''));
    const lang = session.language;

    const callRecord = await prisma.call.findUnique({ where: { callSid } });

    // Option 1: Place / Confirm Order
    if (digits === '1') {
      updateSession(callSid, { step: 'PRODUCT_SELECT' });
      if (callRecord) {
        await prisma.call.update({ where: { id: callRecord.id }, data: { selectedOption: '1_ORDER' } });
        await prisma.ivrInteraction.create({
          data: {
            callId: callRecord.id,
            language: lang,
            menu: 'MAIN_MENU',
            dtmfInput: digits,
            action: 'OPTION_SELECTED',
            details: 'Caller selected Place/Confirm Order',
          },
        }).catch(() => {});
      }

      const { text: productMenuText } = await getIvrProductMenuText(lang);
      const twiml = buildTwimlResponse({
        say: productMenuText,
        language: lang,
        gatherAction: `${ENV.LIVE_SITE_URL}/api/ivr/order/select-product`,
        numDigits: 1,
        timeout: 8,
      });
      res.type('text/xml').send(twiml);
      return;
    }

    // Option 2: Track Order
    if (digits === '2') {
      updateSession(callSid, { step: 'TRACK_ORDER' });
      if (callRecord) {
        await prisma.call.update({ where: { id: callRecord.id }, data: { selectedOption: '2_TRACK' } });
        await prisma.ivrInteraction.create({
          data: {
            callId: callRecord.id,
            language: lang,
            menu: 'MAIN_MENU',
            dtmfInput: digits,
            action: 'OPTION_SELECTED',
            details: 'Caller selected Track Order',
          },
        }).catch(() => {});
      }

      // Look up caller's recent order
      const recentOrder = await prisma.order.findFirst({
        where: { customer: { phone: session.fromPhone } },
        orderBy: { createdAt: 'desc' },
      });

      let trackMsg = '';
      if (!recentOrder) {
        trackMsg = lang === 'TELUGU'
          ? 'మీ ఫోన్ నంబర్ పై ఎలాంటి యాక్టివ్ ఆర్డర్ కనుగొనబడలేదు. ఆర్డర్ చేయడానికి దయచేసి 1 నొక్కండి.'
          : lang === 'HINDI'
          ? 'आपके फ़ोन नंबर पर कोई सक्रिय ऑर्डर नहीं मिला। ऑर्डर करने के लिए 1 दबाएँ।'
          : lang === 'MARATHI'
          ? 'आपल्या फोन नंबरवर कोणतीही ऑर्डर सापडली नाही. ऑर्डर करण्यासाठी 1 दाबा.'
          : 'No active orders found for your phone number. To place a new order, press 1.';
      } else {
        trackMsg = lang === 'TELUGU'
          ? `మీ ఆర్డర్ నంబర్ ${recentOrder.orderNumber} ప్రస్తుత స్థితి: ${recentOrder.status}.`
          : lang === 'HINDI'
          ? `आपका ऑर्डर नंबर ${recentOrder.orderNumber} वर्तमान में ${recentOrder.status} है।`
          : lang === 'MARATHI'
          ? `आपली ऑर्डर नंबर ${recentOrder.orderNumber} सध्या ${recentOrder.status} स्थितीत आहे.`
          : `Your order number ${recentOrder.orderNumber} is currently ${recentOrder.status}.`;
      }

      const twiml = buildTwimlResponse({
        say: `${trackMsg} ${PROMPTS.MAIN_MENU[lang]}`,
        language: lang,
        gatherAction: `${ENV.LIVE_SITE_URL}/api/ivr/main-menu`,
        numDigits: 1,
        timeout: 8,
      });
      res.type('text/xml').send(twiml);
      return;
    }

    // Option 3: Cancel Order
    if (digits === '3') {
      updateSession(callSid, { step: 'CANCEL_ORDER' });
      if (callRecord) {
        await prisma.call.update({ where: { id: callRecord.id }, data: { selectedOption: '3_CANCEL' } });
      }

      const cancellableOrder = await prisma.order.findFirst({
        where: {
          customer: { phone: session.fromPhone },
          status: { in: ['PENDING', 'ACCEPTED'] },
        },
        orderBy: { createdAt: 'desc' },
      });

      if (!cancellableOrder) {
        const noCancelMsg = lang === 'TELUGU'
          ? 'మీ ఫోన్ నంబర్ పై రద్దు చేయగల ఆర్డర్లు ఏవీ లేవు.'
          : lang === 'HINDI'
          ? 'आपके नंबर पर कोई रद्द करने योग्य ऑर्डर नहीं है।'
          : lang === 'MARATHI'
          ? 'आपल्या नंबरवर कोणतीही रद्द करण्यायोग्य ऑर्डर नाही.'
          : 'You have no cancellable orders pending at this time.';

        const twiml = buildTwimlResponse({
          say: `${noCancelMsg} ${PROMPTS.MAIN_MENU[lang]}`,
          language: lang,
          gatherAction: `${ENV.LIVE_SITE_URL}/api/ivr/main-menu`,
          numDigits: 1,
        });
        res.type('text/xml').send(twiml);
        return;
      }

      updateSession(callSid, { orderNumberToCancel: cancellableOrder.orderNumber });

      const confirmCancelMsg = lang === 'TELUGU'
        ? `మీరు ఆర్డర్ నంబర్ ${cancellableOrder.orderNumber} ను రద్దు చేయాలనుకుంటున్నారా? రద్దు చేయడానికి 1 నొక్కండి. ఉంచడానికి 2 నొక్కండి.`
        : lang === 'HINDI'
        ? `क्या आप ऑर्डर नंबर ${cancellableOrder.orderNumber} रद्द करना चाहते हैं? पुष्टि के लिए 1 दबाएँ। रखने के लिए 2 दबाएँ।`
        : lang === 'MARATHI'
        ? `आपण ऑर्डर नंबर ${cancellableOrder.orderNumber} रद्द करू इच्छिता? पुष्टीसाठी 1 दाबा. ऑर्डर ठेवण्यासाठी 2 दाबा.`
        : `Do you want to cancel order number ${cancellableOrder.orderNumber}? Press 1 to confirm cancellation. Press 2 to keep your order.`;

      const twiml = buildTwimlResponse({
        say: confirmCancelMsg,
        language: lang,
        gatherAction: `${ENV.LIVE_SITE_URL}/api/ivr/cancel-confirm`,
        numDigits: 1,
      });
      res.type('text/xml').send(twiml);
      return;
    }

    // Option 4: Human Support Transfer
    if (digits === '4') {
      if (callRecord) {
        await prisma.call.update({ where: { id: callRecord.id }, data: { selectedOption: '4_SUPPORT' } });
        await prisma.ivrInteraction.create({
          data: {
            callId: callRecord.id,
            language: lang,
            menu: 'MAIN_MENU',
            dtmfInput: digits,
            action: 'SUPPORT_REQUESTED',
            details: 'Caller requested live customer care agent transfer',
          },
        }).catch(() => {});
      }

      const agentPhone = ENV.AGENT_PHONE_PRIMARY || '6305970844';
      const twiml = buildTwimlResponse({
        say: PROMPTS.SUPPORT_TRANSFER[lang],
        language: lang,
        dialNumber: agentPhone,
      });
      res.type('text/xml').send(twiml);
      return;
    }

    // Default: Repeat or invalid
    const twiml = buildTwimlResponse({
      say: `${PROMPTS.INVALID_OPTION[lang]} ${PROMPTS.MAIN_MENU[lang]}`,
      language: lang,
      gatherAction: `${ENV.LIVE_SITE_URL}/api/ivr/main-menu`,
      numDigits: 1,
    });
    res.type('text/xml').send(twiml);
  } catch (error) {
    next(error);
  }
};

/**
 * 4. Product Selection (POST /api/ivr/order/select-product)
 */
export const handleSelectProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const callSid = String(req.body.CallSid || req.query.CallSid || req.body.callSid || '');
    const digits = String(req.body.Digits || req.query.Digits || req.body.digits || '1').trim();
    const session = getOrCreateSession(callSid, String(req.body.From || ''));
    const lang = session.language;

    if (digits === '0') {
      const twiml = buildTwimlResponse({
        say: PROMPTS.MAIN_MENU[lang],
        language: lang,
        gatherAction: `${ENV.LIVE_SITE_URL}/api/ivr/main-menu`,
        numDigits: 1,
      });
      res.type('text/xml').send(twiml);
      return;
    }

    const products = await prisma.product.findMany({
      where: { isActive: true },
      include: { variants: { where: { isActive: true }, orderBy: { price: 'asc' } } },
      orderBy: { createdAt: 'asc' },
    });

    const index = parseInt(digits, 10) - 1;
    if (isNaN(index) || index < 0 || index >= products.length) {
      const { text: productMenuText } = await getIvrProductMenuText(lang);
      const twiml = buildTwimlResponse({
        say: `${PROMPTS.INVALID_OPTION[lang]} ${productMenuText}`,
        language: lang,
        gatherAction: `${ENV.LIVE_SITE_URL}/api/ivr/order/select-product`,
        numDigits: 1,
      });
      res.type('text/xml').send(twiml);
      return;
    }

    const selectedProduct = products[index];
    updateSession(callSid, { selectedProductId: selectedProduct.id, step: 'VARIANT_SELECT' });

    const callRecord = await prisma.call.findUnique({ where: { callSid } });
    if (callRecord) {
      await prisma.ivrInteraction.create({
        data: {
          callId: callRecord.id,
          language: lang,
          menu: 'PRODUCT_MENU',
          dtmfInput: digits,
          action: 'PRODUCT_SELECTED',
          details: `Caller selected product: ${selectedProduct.name}`,
        },
      }).catch(() => {});
    }

    const variantMenu = await getIvrVariantMenuText(selectedProduct.id, lang);
    const twiml = buildTwimlResponse({
      say: variantMenu?.text || 'Please choose variant.',
      language: lang,
      gatherAction: `${ENV.LIVE_SITE_URL}/api/ivr/order/select-variant`,
      numDigits: 1,
      timeout: 8,
    });
    res.type('text/xml').send(twiml);
  } catch (error) {
    next(error);
  }
};

/**
 * 5. Variant Selection (POST /api/ivr/order/select-variant)
 */
export const handleSelectVariant = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const callSid = String(req.body.CallSid || req.query.CallSid || req.body.callSid || '');
    const digits = String(req.body.Digits || req.query.Digits || req.body.digits || '1').trim();
    const session = getOrCreateSession(callSid, String(req.body.From || ''));
    const lang = session.language;

    if (digits === '0') {
      const { text: productMenuText } = await getIvrProductMenuText(lang);
      const twiml = buildTwimlResponse({
        say: productMenuText,
        language: lang,
        gatherAction: `${ENV.LIVE_SITE_URL}/api/ivr/order/select-product`,
        numDigits: 1,
      });
      res.type('text/xml').send(twiml);
      return;
    }

    if (!session.selectedProductId) {
      const { text: productMenuText } = await getIvrProductMenuText(lang);
      const twiml = buildTwimlResponse({
        say: productMenuText,
        language: lang,
        gatherAction: `${ENV.LIVE_SITE_URL}/api/ivr/order/select-product`,
        numDigits: 1,
      });
      res.type('text/xml').send(twiml);
      return;
    }

    const product = await prisma.product.findUnique({
      where: { id: session.selectedProductId },
      include: { variants: { where: { isActive: true }, orderBy: { price: 'asc' } } },
    });

    const index = parseInt(digits, 10) - 1;
    if (!product || isNaN(index) || index < 0 || index >= product.variants.length) {
      const variantMenu = await getIvrVariantMenuText(session.selectedProductId, lang);
      const twiml = buildTwimlResponse({
        say: `${PROMPTS.INVALID_OPTION[lang]} ${variantMenu?.text}`,
        language: lang,
        gatherAction: `${ENV.LIVE_SITE_URL}/api/ivr/order/select-variant`,
        numDigits: 1,
      });
      res.type('text/xml').send(twiml);
      return;
    }

    const selectedVariant = product.variants[index];
    const quantity = 1;
    const subtotal = selectedVariant.price * quantity;
    const deliveryFee = subtotal >= 500 ? 0.0 : 40.0;
    const total = subtotal + deliveryFee;

    updateSession(callSid, {
      selectedVariantId: selectedVariant.id,
      selectedQuantity: quantity,
      step: 'CONFIRM_ORDER',
    });

    const confirmSpeech = getIvrOrderConfirmationText({
      productName: product.name,
      weight: selectedVariant.weight,
      quantity,
      subtotal,
      deliveryFee,
      total,
      customerPhone: session.fromPhone,
      language: lang,
    });

    const twiml = buildTwimlResponse({
      say: confirmSpeech,
      language: lang,
      gatherAction: `${ENV.LIVE_SITE_URL}/api/ivr/order/confirm`,
      numDigits: 1,
      timeout: 8,
    });
    res.type('text/xml').send(twiml);
  } catch (error) {
    next(error);
  }
};

/**
 * 6. Order Confirmation & Database Creation (POST /api/ivr/order/confirm)
 */
export const handleConfirmOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const callSid = String(req.body.CallSid || req.query.CallSid || req.body.callSid || '');
    const digits = String(req.body.Digits || req.query.Digits || req.body.digits || '1').trim();
    const session = getOrCreateSession(callSid, String(req.body.From || ''));
    const lang = session.language;

    // Change order
    if (digits === '2') {
      const { text: productMenuText } = await getIvrProductMenuText(lang);
      const twiml = buildTwimlResponse({
        say: productMenuText,
        language: lang,
        gatherAction: `${ENV.LIVE_SITE_URL}/api/ivr/order/select-product`,
        numDigits: 1,
      });
      res.type('text/xml').send(twiml);
      return;
    }

    // Cancel order flow
    if (digits === '3') {
      const twiml = buildTwimlResponse({
        say: PROMPTS.MAIN_MENU[lang],
        language: lang,
        gatherAction: `${ENV.LIVE_SITE_URL}/api/ivr/main-menu`,
        numDigits: 1,
      });
      res.type('text/xml').send(twiml);
      return;
    }

    // Confirm Order (1)
    if (digits === '1') {
      const variant = await prisma.productVariant.findUnique({
        where: { id: session.selectedVariantId },
        include: { product: true },
      });

      if (!variant) {
        const twiml = buildTwimlResponse({
          say: `${PROMPTS.INVALID_OPTION[lang]} ${PROMPTS.MAIN_MENU[lang]}`,
          language: lang,
          gatherAction: `${ENV.LIVE_SITE_URL}/api/ivr/main-menu`,
          numDigits: 1,
        });
        res.type('text/xml').send(twiml);
        return;
      }

      const subtotal = variant.price * (session.selectedQuantity || 1);
      const deliveryFee = subtotal >= 500 ? 0.0 : 40.0;
      const total = subtotal + deliveryFee;
      const orderNumber = generateOrderNumber();

      // Find or create customer
      const customer = await prisma.customer.upsert({
        where: { phone: session.fromPhone },
        update: {},
        create: {
          name: `Phone Customer (${session.fromPhone.slice(-4)})`,
          phone: session.fromPhone,
          address: 'Delivery address via phone caller ID, Bhainsa',
          city: 'Bhainsa',
          district: 'Nirmal District',
          state: 'Telangana',
          pincode: '504103',
        },
      });

      // Find call record
      const callRecord = await prisma.call.findUnique({ where: { callSid } });

      // Create Order atomically in PostgreSQL database
      const createdOrder = await prisma.order.create({
        data: {
          orderNumber,
          customerId: customer.id,
          orderSource: 'IVR',
          language: lang,
          callId: callRecord?.id,
          status: 'PENDING',
          paymentMethod: 'OFFLINE',
          paymentStatus: 'PENDING',
          subtotal,
          deliveryFee,
          total,
          deliveryAddress: customer.address,
          city: customer.city,
          district: customer.district,
          state: customer.state,
          pincode: customer.pincode,
          customerNotes: `Placed via Multilingual IVR 9347036152 (${lang})`,
          items: {
            create: [
              {
                productId: variant.productId,
                variantId: variant.id,
                productName: variant.product.name,
                variantName: `${variant.weight} (${variant.unit})`,
                productNameSnapshot: variant.product.name,
                variantNameSnapshot: `${variant.weight} (${variant.unit})`,
                weight: variant.weight,
                unit: variant.unit,
                unitPrice: variant.price,
                quantity: session.selectedQuantity || 1,
                totalPrice: subtotal,
              },
            ],
          },
          payments: {
            create: {
              gateway: 'CASH_ON_DELIVERY',
              amount: total,
              currency: 'INR',
              status: 'PENDING',
              paymentMethod: 'OFFLINE',
            },
          },
          statusHistory: {
            create: {
              newStatus: 'PENDING',
              note: `Order placed via automated IVR System (Language: ${lang})`,
              changedBy: 'IVR_SYSTEM',
            },
          },
        },
        include: {
          customer: true,
          items: true,
          payments: true,
        },
      });

      // Update call record
      if (callRecord) {
        await prisma.call.update({
          where: { id: callRecord.id },
          data: { orderId: createdOrder.id },
        });

        await prisma.ivrInteraction.create({
          data: {
            callId: callRecord.id,
            language: lang,
            menu: 'CONFIRM_MENU',
            dtmfInput: '1',
            action: 'ORDER_CONFIRMED',
            details: `Order #${createdOrder.orderNumber} successfully created via phone IVR`,
            orderId: createdOrder.id,
            customerId: customer.id,
          },
        }).catch(() => {});
      }

      // Real-Time SSE Broadcaster update for Admin Dashboard
      realtimeService.broadcast('new_order', {
        orderId: createdOrder.id,
        orderNumber: createdOrder.orderNumber,
        customerName: customer.name,
        customerPhone: customer.phone,
        total: createdOrder.total,
        orderSource: 'IVR',
        language: lang,
        itemCount: 1,
        paymentMethod: 'OFFLINE',
        createdAt: createdOrder.createdAt,
      });

      realtimeService.broadcast('ivr_order_created', {
        orderId: createdOrder.id,
        orderNumber: createdOrder.orderNumber,
        customerPhone: customer.phone,
        total: createdOrder.total,
        language: lang,
      });

      // Dispatch automated confirmation SMS & Business alert email
      notificationService.sendOrderPlaced(createdOrder as any).catch(() => {});

      let successMsg = '';
      if (lang === 'TELUGU') {
        successMsg = `ధన్యవాదాలు! మీ ఆర్డర్ నంబర్ ${createdOrder.orderNumber}. మొత్తం ధర ${total} రూపాయలు. మా బృందం త్వరలో తయారు చేసి డెలివరీ చేస్తుంది. నమస్కారం.`;
      } else if (lang === 'HINDI') {
        successMsg = `धन्यवाद! आपका ऑर्डर नंबर ${createdOrder.orderNumber} है। कुल राशि ${total} रुपये है। हमारा दल इसे जल्द तैयार करके डिलीवर करेगा। नमस्ते।`;
      } else if (lang === 'MARATHI') {
        successMsg = `धन्यवाद! आपली ऑर्डर नंबर ${createdOrder.orderNumber} आहे. एकूण रक्कम ${total} रुपये आहे. आपली ऑर्डर लवकरच वितरित केली जाईल. नमस्कार.`;
      } else {
        successMsg = `Thank you! Your order number is ${createdOrder.orderNumber} for total ${total} rupees. It will be prepared fresh and delivered. Goodbye.`;
      }

      const twiml = buildTwimlResponse({
        say: successMsg,
        language: lang,
      });
      res.type('text/xml').send(twiml);
      return;
    }

    const twiml = buildTwimlResponse({
      say: PROMPTS.MAIN_MENU[lang],
      language: lang,
      gatherAction: `${ENV.LIVE_SITE_URL}/api/ivr/main-menu`,
      numDigits: 1,
    });
    res.type('text/xml').send(twiml);
  } catch (error) {
    next(error);
  }
};

/**
 * 7. Cancel Confirmation (POST /api/ivr/cancel-confirm)
 */
export const handleCancelConfirm = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const callSid = String(req.body.CallSid || req.query.CallSid || req.body.callSid || '');
    const digits = String(req.body.Digits || req.query.Digits || req.body.digits || '1').trim();
    const session = getOrCreateSession(callSid, String(req.body.From || ''));
    const lang = session.language;

    if (digits === '1' && session.orderNumberToCancel) {
      const order = await prisma.order.findUnique({
        where: { orderNumber: session.orderNumberToCancel },
      });

      if (order && ['PENDING', 'ACCEPTED'].includes(order.status)) {
        await prisma.order.update({
          where: { id: order.id },
          data: {
            status: 'CANCELLED',
            cancelledAt: new Date(),
            statusHistory: {
              create: {
                previousStatus: order.status,
                newStatus: 'CANCELLED',
                note: 'Order cancelled by customer via IVR Phone System',
                changedBy: 'CUSTOMER_IVR',
              },
            },
          },
        });

        // Broadcast to Admin
        realtimeService.broadcast('order_status_updated', {
          orderId: order.id,
          orderNumber: order.orderNumber,
          status: 'CANCELLED',
        });

        const cancelSuccess = lang === 'TELUGU'
          ? `మీ ఆర్డర్ ${order.orderNumber} విజయవంతంగా రద్దు చేయబడింది.`
          : lang === 'HINDI'
          ? `आपका ऑर्डर ${order.orderNumber} सफलतापूर्वक रद्द कर दिया गया है।`
          : lang === 'MARATHI'
          ? `आपली ऑर्डर ${order.orderNumber} यशस्वीरित्या रद्द करण्यात आली आहे.`
          : `Your order ${order.orderNumber} has been successfully cancelled.`;

        const twiml = buildTwimlResponse({
          say: `${cancelSuccess} ${PROMPTS.MAIN_MENU[lang]}`,
          language: lang,
          gatherAction: `${ENV.LIVE_SITE_URL}/api/ivr/main-menu`,
          numDigits: 1,
        });
        res.type('text/xml').send(twiml);
        return;
      }
    }

    const twiml = buildTwimlResponse({
      say: PROMPTS.MAIN_MENU[lang],
      language: lang,
      gatherAction: `${ENV.LIVE_SITE_URL}/api/ivr/main-menu`,
      numDigits: 1,
    });
    res.type('text/xml').send(twiml);
  } catch (error) {
    next(error);
  }
};

/**
 * 8. Status Callback (POST /api/ivr/status-callback)
 */
export const handleStatusCallback = async (req: Request, res: Response): Promise<void> => {
  try {
    const callSid = String(req.body.CallSid || req.query.CallSid || '');
    const callDuration = parseInt(String(req.body.CallDuration || req.query.CallDuration || '0'), 10);
    const callStatus = String(req.body.CallStatus || req.query.CallStatus || 'COMPLETED').toUpperCase();

    if (callSid) {
      await prisma.call.updateMany({
        where: { callSid },
        data: {
          duration: callDuration || 60,
          endTime: new Date(),
          status: callStatus === 'COMPLETED' ? 'COMPLETED' : 'DISCONNECTED',
        },
      });
      ivrSessions.delete(callSid);
    }

    res.status(200).json({ success: true });
  } catch {
    res.status(200).json({ success: true });
  }
};

/**
 * 9. Interactive Simulator Endpoint for E2E Tests & UI Testing (POST /api/ivr/simulate)
 */
export const handleSimulateIvr = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { action, callSid = `SIM_${Date.now()}`, fromPhone = '9848012345', digits = '1', language = 'ENGLISH' } = req.body;

    const session = getOrCreateSession(callSid, fromPhone);
    session.language = language;

    if (action === 'INCOMING') {
      const call = await prisma.call.upsert({
        where: { callSid },
        update: { status: 'IN_PROGRESS' },
        create: {
          callSid,
          fromPhone,
          toPhone: '9347036152',
          language,
          status: 'IN_PROGRESS',
        },
      });

      res.status(200).json({
        success: true,
        callSid,
        prompt: PROMPTS.GREETING_LANG_SELECT.ENGLISH,
        step: 'LANGUAGE_SELECT',
      });
      return;
    }

    if (action === 'SELECT_LANGUAGE') {
      let selectedLang: IvrLanguage = 'ENGLISH';
      if (digits === '2') selectedLang = 'MARATHI';
      else if (digits === '3') selectedLang = 'HINDI';
      else if (digits === '4') selectedLang = 'TELUGU';

      session.language = selectedLang;
      await prisma.call.updateMany({ where: { callSid }, data: { language: selectedLang } });

      res.status(200).json({
        success: true,
        language: selectedLang,
        prompt: PROMPTS.MAIN_MENU[selectedLang],
        step: 'MAIN_MENU',
      });
      return;
    }

    if (action === 'PLACE_ORDER') {
      const products = await prisma.product.findMany({
        where: { isActive: true },
        include: { variants: { where: { isActive: true }, orderBy: { price: 'asc' } } },
      });

      const selectedProduct = products[0]; // Wheat Sevaya or Urad Dal Papad
      const selectedVariant = selectedProduct.variants[0];
      const subtotal = selectedVariant.price;
      const deliveryFee = subtotal >= 500 ? 0.0 : 40.0;
      const total = subtotal + deliveryFee;
      const orderNumber = generateOrderNumber();

      const customer = await prisma.customer.upsert({
        where: { phone: fromPhone },
        update: {},
        create: {
          name: `Phone Customer (${fromPhone.slice(-4)})`,
          phone: fromPhone,
          address: 'Main Road near Gandhi Chowk, Bhainsa',
          city: 'Bhainsa',
          district: 'Nirmal District',
          state: 'Telangana',
          pincode: '504103',
        },
      });

      const callRecord = await prisma.call.findUnique({ where: { callSid } });

      const createdOrder = await prisma.order.create({
        data: {
          orderNumber,
          customerId: customer.id,
          orderSource: 'IVR',
          language,
          callId: callRecord?.id,
          status: 'PENDING',
          paymentMethod: 'OFFLINE',
          paymentStatus: 'PENDING',
          subtotal,
          deliveryFee,
          total,
          deliveryAddress: customer.address,
          city: customer.city,
          district: customer.district,
          state: customer.state,
          pincode: customer.pincode,
          customerNotes: `Placed via IVR Simulator (${language})`,
          items: {
            create: [
              {
                productId: selectedProduct.id,
                variantId: selectedVariant.id,
                productName: selectedProduct.name,
                variantName: `${selectedVariant.weight} (${selectedVariant.unit})`,
                productNameSnapshot: selectedProduct.name,
                variantNameSnapshot: `${selectedVariant.weight} (${selectedVariant.unit})`,
                weight: selectedVariant.weight,
                unit: selectedVariant.unit,
                unitPrice: selectedVariant.price,
                quantity: 1,
                totalPrice: subtotal,
              },
            ],
          },
          payments: {
            create: {
              gateway: 'CASH_ON_DELIVERY',
              amount: total,
              currency: 'INR',
              status: 'PENDING',
              paymentMethod: 'OFFLINE',
            },
          },
          statusHistory: {
            create: {
              newStatus: 'PENDING',
              note: `Order placed via IVR Test (${language})`,
              changedBy: 'IVR_SYSTEM',
            },
          },
        },
        include: { customer: true, items: true, payments: true },
      });

      realtimeService.broadcast('new_order', {
        orderId: createdOrder.id,
        orderNumber: createdOrder.orderNumber,
        customerName: customer.name,
        customerPhone: customer.phone,
        total: createdOrder.total,
        orderSource: 'IVR',
        language,
        itemCount: 1,
        paymentMethod: 'OFFLINE',
        createdAt: createdOrder.createdAt,
      });

      res.status(201).json({
        success: true,
        message: 'IVR Order successfully created and stored in PostgreSQL database!',
        data: createdOrder,
      });
      return;
    }

    res.status(400).json({ success: false, message: 'Unknown simulation action' });
  } catch (error) {
    next(error);
  }
};
