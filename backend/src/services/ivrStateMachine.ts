import prisma from '../config/prisma';
import { ENV } from '../config/env';
import { PromptService, IvrLanguage, PromptKey } from './promptService';
import { realtimeService } from './realtime';
import { notificationService } from './notificationService';

export type IvrState =
  | 'LANGUAGE_SELECTION'
  | 'MAIN_MENU'
  | 'PRODUCT_SELECTION'
  | 'VARIANT_SELECTION'
  | 'QUANTITY_SELECTION'
  | 'ADDRESS_COLLECTION'
  | 'PAYMENT_SELECTION'
  | 'ORDER_CONFIRMATION'
  | 'ORDER_CREATED'
  | 'TRACK_ORDER'
  | 'CANCEL_ORDER'
  | 'AGENT_SUPPORT'
  | 'COMPLETED'
  | 'TERMINATED';

export interface ProcessInputResult {
  twiml: string;
  session: any;
  promptText: string;
  nextState: IvrState;
}

// Generate readable order number: AA-YYYYMMDD-XXXX
function generateOrderNumber(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `AA-${year}${month}${day}-${randomSuffix}`;
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export class IvrStateMachine {
  /**
   * Get or create a persistent IVR session in PostgreSQL
   */
  public static async getOrCreateSession(
    callSid: string,
    fromPhone: string,
    toPhone: string = ENV.IVR_PHONE_NUMBER || '9347036152'
  ) {
    const cleanPhone =
      String(fromPhone || '')
        .replace(/[^0-9]/g, '')
        .slice(-10) || '9848012345';

    // 1. Try to find existing session
    let session = await prisma.ivrSession.findUnique({
      where: { callSid },
    });

    if (!session) {
      // Check customer's existing preferred language
      const customer = await prisma.customer.findUnique({
        where: { phone: cleanPhone },
      });

      const initialLang: IvrLanguage = (customer?.preferredLanguage as IvrLanguage) || 'ENGLISH';

      // Create Call record if not exists
      await prisma.call.upsert({
        where: { callSid },
        update: { status: 'IN_PROGRESS' },
        create: {
          callSid,
          fromPhone: cleanPhone,
          toPhone,
          language: initialLang,
          status: 'IN_PROGRESS',
          startTime: new Date(),
          customerId: customer?.id,
        },
      });

      // Create persistent session
      session = await prisma.ivrSession.create({
        data: {
          callSid,
          fromPhone: cleanPhone,
          toPhone,
          language: initialLang,
          currentState: 'LANGUAGE_SELECTION',
          currentMenu: 'LANGUAGE_MENU',
          currentStep: 'GREETING',
          customerId: customer?.id,
          sessionStatus: 'ACTIVE',
        },
      });

      // Log IVR Interaction
      const call = await prisma.call.findUnique({ where: { callSid } });
      if (call) {
        await prisma.ivrInteraction.create({
          data: {
            callId: call.id,
            language: initialLang,
            menu: 'LANGUAGE_MENU',
            action: 'CALL_ANSWERED',
            details: `Call started from ${cleanPhone} on ${toPhone}`,
            customerId: customer?.id,
          },
        });
      }

      // Broadcast real-time call event to Admin Dashboard
      realtimeService.broadcast('new_ivr_call', {
        callSid,
        fromPhone: cleanPhone,
        toPhone,
        language: initialLang,
        startTime: new Date(),
      });
    }

    return session;
  }

  /**
   * Deterministic State Transition and Input Processor
   */
  public static async processInput(params: {
    callSid: string;
    digits?: string;
    fromPhone?: string;
    baseUrl?: string;
  }): Promise<ProcessInputResult> {
    const { callSid, fromPhone = '', digits = '' } = params;
    const cleanDigits = String(digits || '').trim();

    // 1. Retrieve current persistent session from PostgreSQL
    const session = await IvrStateMachine.getOrCreateSession(callSid, fromPhone);
    const lang = (session.language as IvrLanguage) || 'ENGLISH';
    const currentState = (session.currentState as IvrState) || 'LANGUAGE_SELECTION';

    const callRecord = await prisma.call.findUnique({ where: { callSid } });

    // Determine correct backend base URL for webhooks
    const baseUrl =
      params.baseUrl ||
      ENV.IVR_BASE_URL ||
      ENV.BACKEND_URL ||
      'https://annapurna-aahaar-1.onrender.com';

    // ----------------------------------------------------
    // STATE 1: LANGUAGE_SELECTION
    // ----------------------------------------------------
    if (currentState === 'LANGUAGE_SELECTION') {
      if (!cleanDigits) {
        // Initial greeting & prompt
        const prompt = `${PromptService.getPrompt(lang, 'WELCOME')} ${PromptService.getPrompt(lang, 'LANGUAGE_MENU')}`;
        const twiml = IvrStateMachine.generateTwiML({
          say: prompt,
          language: lang,
          gatherDigits: 1,
          gatherTimeout: 8,
          actionUrl: `${baseUrl}/api/ivr/webhook`,
        });
        return { twiml, session, promptText: prompt, nextState: 'LANGUAGE_SELECTION' };
      }

      let selectedLang: IvrLanguage = 'ENGLISH';
      if (cleanDigits === '2') selectedLang = 'MARATHI';
      else if (cleanDigits === '3') selectedLang = 'HINDI';
      else if (cleanDigits === '4') selectedLang = 'TELUGU';
      else if (cleanDigits === '1') selectedLang = 'ENGLISH';
      else {
        // Invalid language choice
        const invalidPrompt = `${PromptService.getPrompt(lang, 'INVALID_INPUT')} ${PromptService.getPrompt(lang, 'LANGUAGE_MENU')}`;
        const twiml = IvrStateMachine.generateTwiML({
          say: invalidPrompt,
          language: lang,
          gatherDigits: 1,
          actionUrl: `${baseUrl}/api/ivr/webhook`,
        });
        return { twiml, session, promptText: invalidPrompt, nextState: 'LANGUAGE_SELECTION' };
      }

      // Update session language & transition to MAIN_MENU
      const updatedSession = await prisma.ivrSession.update({
        where: { callSid },
        data: {
          language: selectedLang,
          currentState: 'MAIN_MENU',
          previousState: 'LANGUAGE_SELECTION',
          currentMenu: 'MAIN_MENU',
          lastInput: cleanDigits,
          retryCount: 0,
          lastActivity: new Date(),
        },
      });

      // Update call record & customer preferredLanguage
      await prisma.call.updateMany({
        where: { callSid },
        data: { language: selectedLang },
      });
      if (session.fromPhone) {
        await prisma.customer.updateMany({
          where: { phone: session.fromPhone },
          data: { preferredLanguage: selectedLang },
        });
      }

      if (callRecord) {
        await prisma.ivrInteraction.create({
          data: {
            callId: callRecord.id,
            language: selectedLang,
            menu: 'LANGUAGE_MENU',
            dtmfInput: cleanDigits,
            action: session.previousState ? 'LANGUAGE_CHANGED' : 'LANGUAGE_SELECTED',
            details: `Caller selected language: ${selectedLang}`,
          },
        });
      }

      const mainPrompt = PromptService.getPrompt(selectedLang, 'MAIN_MENU');
      const twiml = IvrStateMachine.generateTwiML({
        say: mainPrompt,
        language: selectedLang,
        gatherDigits: 1,
        gatherTimeout: 8,
        actionUrl: `${baseUrl}/api/ivr/webhook`,
      });

      return { twiml, session: updatedSession, promptText: mainPrompt, nextState: 'MAIN_MENU' };
    }

    // ----------------------------------------------------
    // STATE 2: MAIN_MENU
    // ----------------------------------------------------
    if (currentState === 'MAIN_MENU') {
      // Option 1: Place / Confirm Order
      if (cleanDigits === '1') {
        const products = await prisma.product.findMany({
          where: { isActive: true },
          include: { variants: { where: { isActive: true }, orderBy: { price: 'asc' } } },
          orderBy: { createdAt: 'asc' },
        });

        const productMenuText = IvrStateMachine.buildProductMenuPrompt(products, lang);

        const updatedSession = await prisma.ivrSession.update({
          where: { callSid },
          data: {
            currentState: 'PRODUCT_SELECTION',
            previousState: 'MAIN_MENU',
            currentMenu: 'PRODUCT_MENU',
            lastInput: cleanDigits,
            retryCount: 0,
            lastActivity: new Date(),
          },
        });

        if (callRecord) {
          await prisma.call.update({ where: { id: callRecord.id }, data: { selectedOption: '1_ORDER' } });
          await prisma.ivrInteraction.create({
            data: {
              callId: callRecord.id,
              language: lang,
              menu: 'MAIN_MENU',
              dtmfInput: '1',
              action: 'OPTION_SELECTED',
              details: 'Caller selected 1: Place / Confirm Order',
            },
          });
        }

        const twiml = IvrStateMachine.generateTwiML({
          say: productMenuText,
          language: lang,
          gatherDigits: 1,
          gatherTimeout: 8,
          actionUrl: `${baseUrl}/api/ivr/webhook`,
        });

        return { twiml, session: updatedSession, promptText: productMenuText, nextState: 'PRODUCT_SELECTION' };
      }

      // Option 2: Track Order
      if (cleanDigits === '2') {
        const recentOrder = await prisma.order.findFirst({
          where: { customer: { phone: session.fromPhone } },
          orderBy: { createdAt: 'desc' },
        });

        let trackDetail = '';
        let trackPrompt = '';

        if (!recentOrder) {
          trackPrompt = `${PromptService.getPrompt(lang, 'ORDER_NOT_FOUND')} ${PromptService.getPrompt(lang, 'MAIN_MENU')}`;
        } else {
          const statusKey = `ORDER_${recentOrder.status}` as PromptKey;
          trackDetail = PromptService.getPrompt(lang, statusKey);
          trackPrompt = `${PromptService.getPrompt(lang, 'ORDER_TRACKING', {
            orderNumber: recentOrder.orderNumber,
            status: recentOrder.status,
            statusDetail: trackDetail,
          })} ${PromptService.getPrompt(lang, 'MAIN_MENU')}`;
        }

        const updatedSession = await prisma.ivrSession.update({
          where: { callSid },
          data: {
            currentState: 'MAIN_MENU',
            previousState: 'MAIN_MENU',
            lastInput: cleanDigits,
            retryCount: 0,
            lastActivity: new Date(),
          },
        });

        if (callRecord) {
          await prisma.call.update({ where: { id: callRecord.id }, data: { selectedOption: '2_TRACK' } });
          await prisma.ivrInteraction.create({
            data: {
              callId: callRecord.id,
              language: lang,
              menu: 'MAIN_MENU',
              dtmfInput: '2',
              action: 'ORDER_TRACKED',
              details: `Caller tracked order #${recentOrder?.orderNumber || 'NONE'}`,
            },
          });
        }

        const twiml = IvrStateMachine.generateTwiML({
          say: trackPrompt,
          language: lang,
          gatherDigits: 1,
          gatherTimeout: 8,
          actionUrl: `${baseUrl}/api/ivr/webhook`,
        });

        return { twiml, session: updatedSession, promptText: trackPrompt, nextState: 'MAIN_MENU' };
      }

      // Option 3: Cancel Order
      if (cleanDigits === '3') {
        const cancellableOrder = await prisma.order.findFirst({
          where: {
            customer: { phone: session.fromPhone },
            status: { in: ['PENDING', 'ACCEPTED'] },
          },
          orderBy: { createdAt: 'desc' },
        });

        if (!cancellableOrder) {
          const noCancelPrompt = `${PromptService.getPrompt(lang, 'ORDER_NOT_FOUND')} ${PromptService.getPrompt(lang, 'MAIN_MENU')}`;
          const twiml = IvrStateMachine.generateTwiML({
            say: noCancelPrompt,
            language: lang,
            gatherDigits: 1,
            actionUrl: `${baseUrl}/api/ivr/webhook`,
          });
          return { twiml, session, promptText: noCancelPrompt, nextState: 'MAIN_MENU' };
        }

        const updatedSession = await prisma.ivrSession.update({
          where: { callSid },
          data: {
            currentState: 'CANCEL_ORDER',
            previousState: 'MAIN_MENU',
            currentMenu: 'CANCEL_MENU',
            orderId: cancellableOrder.id,
            lastInput: cleanDigits,
            retryCount: 0,
            lastActivity: new Date(),
          },
        });

        if (callRecord) {
          await prisma.call.update({ where: { id: callRecord.id }, data: { selectedOption: '3_CANCEL' } });
        }

        const cancelPrompt = PromptService.getPrompt(lang, 'ORDER_CANCEL', {
          orderNumber: cancellableOrder.orderNumber,
        });

        const twiml = IvrStateMachine.generateTwiML({
          say: cancelPrompt,
          language: lang,
          gatherDigits: 1,
          gatherTimeout: 8,
          actionUrl: `${baseUrl}/api/ivr/webhook`,
        });

        return { twiml, session: updatedSession, promptText: cancelPrompt, nextState: 'CANCEL_ORDER' };
      }

      // Option 4: Customer Support Transfer
      if (cleanDigits === '4') {
        const supportPrompt = PromptService.getPrompt(lang, 'CUSTOMER_SUPPORT');
        const agentNumber = ENV.AGENT_PHONE_PRIMARY || ENV.BUSINESS_PHONE_PRIMARY || '6305970844';

        const updatedSession = await prisma.ivrSession.update({
          where: { callSid },
          data: {
            currentState: 'AGENT_SUPPORT',
            previousState: 'MAIN_MENU',
            lastInput: cleanDigits,
            sessionStatus: 'COMPLETED',
            lastActivity: new Date(),
          },
        });

        if (callRecord) {
          await prisma.call.update({ where: { id: callRecord.id }, data: { selectedOption: '4_SUPPORT' } });
          await prisma.ivrInteraction.create({
            data: {
              callId: callRecord.id,
              language: lang,
              menu: 'MAIN_MENU',
              dtmfInput: '4',
              action: 'CUSTOMER_SUPPORT_REQUESTED',
              details: `Transferring call to support agent ${agentNumber}`,
            },
          });
        }

        const twiml = IvrStateMachine.generateTwiML({
          say: supportPrompt,
          language: lang,
          dialNumber: agentNumber,
          actionUrl: `${baseUrl}/api/ivr/status-callback`,
        });

        return { twiml, session: updatedSession, promptText: supportPrompt, nextState: 'AGENT_SUPPORT' };
      }

      // Option 9: Change Language
      if (cleanDigits === '9') {
        const updatedSession = await prisma.ivrSession.update({
          where: { callSid },
          data: {
            currentState: 'LANGUAGE_SELECTION',
            previousState: 'MAIN_MENU',
            currentMenu: 'LANGUAGE_MENU',
            lastInput: cleanDigits,
            retryCount: 0,
            lastActivity: new Date(),
          },
        });

        if (callRecord) {
          await prisma.ivrInteraction.create({
            data: {
              callId: callRecord.id,
              language: lang,
              menu: 'MAIN_MENU',
              dtmfInput: '9',
              action: 'LANGUAGE_CHANGED',
              details: `Caller requested language change from ${lang}`,
            },
          });
        }

        const langPrompt = PromptService.getPrompt(lang, 'LANGUAGE_MENU');
        const twiml = IvrStateMachine.generateTwiML({
          say: langPrompt,
          language: lang,
          gatherDigits: 1,
          gatherTimeout: 8,
          actionUrl: `${baseUrl}/api/ivr/webhook`,
        });

        return { twiml, session: updatedSession, promptText: langPrompt, nextState: 'LANGUAGE_SELECTION' };
      }

      // Invalid input in MAIN_MENU
      const invalidPrompt = `${PromptService.getPrompt(lang, 'INVALID_INPUT')} ${PromptService.getPrompt(lang, 'MAIN_MENU')}`;
      const twiml = IvrStateMachine.generateTwiML({
        say: invalidPrompt,
        language: lang,
        gatherDigits: 1,
        actionUrl: `${baseUrl}/api/ivr/webhook`,
      });
      return { twiml, session, promptText: invalidPrompt, nextState: 'MAIN_MENU' };
    }

    // ----------------------------------------------------
    // STATE 3: PRODUCT_SELECTION
    // ----------------------------------------------------
    if (currentState === 'PRODUCT_SELECTION') {
      if (cleanDigits === '0') {
        // Return to Main Menu
        const updatedSession = await prisma.ivrSession.update({
          where: { callSid },
          data: {
            currentState: 'MAIN_MENU',
            previousState: 'PRODUCT_SELECTION',
            currentMenu: 'MAIN_MENU',
            lastInput: cleanDigits,
            retryCount: 0,
            lastActivity: new Date(),
          },
        });

        const mainPrompt = PromptService.getPrompt(lang, 'MAIN_MENU');
        const twiml = IvrStateMachine.generateTwiML({
          say: mainPrompt,
          language: lang,
          gatherDigits: 1,
          actionUrl: `${baseUrl}/api/ivr/webhook`,
        });
        return { twiml, session: updatedSession, promptText: mainPrompt, nextState: 'MAIN_MENU' };
      }

      const products = await prisma.product.findMany({
        where: { isActive: true },
        include: { variants: { where: { isActive: true }, orderBy: { price: 'asc' } } },
        orderBy: { createdAt: 'asc' },
      });

      if (cleanDigits === '9') {
        // Repeat Product Menu
        const productMenuText = IvrStateMachine.buildProductMenuPrompt(products, lang);
        const twiml = IvrStateMachine.generateTwiML({
          say: productMenuText,
          language: lang,
          gatherDigits: 1,
          actionUrl: `${baseUrl}/api/ivr/webhook`,
        });
        return { twiml, session, promptText: productMenuText, nextState: 'PRODUCT_SELECTION' };
      }

      const productIdx = parseInt(cleanDigits, 10) - 1;
      if (isNaN(productIdx) || productIdx < 0 || productIdx >= products.length) {
        const retryPrompt = `${PromptService.getPrompt(lang, 'INVALID_INPUT')} ${IvrStateMachine.buildProductMenuPrompt(products, lang)}`;
        const twiml = IvrStateMachine.generateTwiML({
          say: retryPrompt,
          language: lang,
          gatherDigits: 1,
          actionUrl: `${baseUrl}/api/ivr/webhook`,
        });
        return { twiml, session, promptText: retryPrompt, nextState: 'PRODUCT_SELECTION' };
      }

      const selectedProduct = products[productIdx];
      const variantPrompt = IvrStateMachine.buildVariantMenuPrompt(selectedProduct, lang);

      const updatedSession = await prisma.ivrSession.update({
        where: { callSid },
        data: {
          currentState: 'VARIANT_SELECTION',
          previousState: 'PRODUCT_SELECTION',
          currentMenu: 'VARIANT_MENU',
          selectedProductId: selectedProduct.id,
          lastInput: cleanDigits,
          retryCount: 0,
          lastActivity: new Date(),
        },
      });

      if (callRecord) {
        await prisma.ivrInteraction.create({
          data: {
            callId: callRecord.id,
            language: lang,
            menu: 'PRODUCT_MENU',
            dtmfInput: cleanDigits,
            action: 'PRODUCT_SELECTED',
            details: `Caller selected product: ${selectedProduct.name}`,
          },
        });
      }

      const twiml = IvrStateMachine.generateTwiML({
        say: variantPrompt,
        language: lang,
        gatherDigits: 1,
        gatherTimeout: 8,
        actionUrl: `${baseUrl}/api/ivr/webhook`,
      });

      return { twiml, session: updatedSession, promptText: variantPrompt, nextState: 'VARIANT_SELECTION' };
    }

    // ----------------------------------------------------
    // STATE 4: VARIANT_SELECTION
    // ----------------------------------------------------
    if (currentState === 'VARIANT_SELECTION') {
      if (cleanDigits === '0') {
        // Return to Product Selection
        const products = await prisma.product.findMany({
          where: { isActive: true },
          include: { variants: { where: { isActive: true }, orderBy: { price: 'asc' } } },
          orderBy: { createdAt: 'asc' },
        });

        const updatedSession = await prisma.ivrSession.update({
          where: { callSid },
          data: {
            currentState: 'PRODUCT_SELECTION',
            previousState: 'VARIANT_SELECTION',
            currentMenu: 'PRODUCT_MENU',
            lastInput: cleanDigits,
            retryCount: 0,
            lastActivity: new Date(),
          },
        });

        const productMenuText = IvrStateMachine.buildProductMenuPrompt(products, lang);
        const twiml = IvrStateMachine.generateTwiML({
          say: productMenuText,
          language: lang,
          gatherDigits: 1,
          actionUrl: `${baseUrl}/api/ivr/webhook`,
        });
        return { twiml, session: updatedSession, promptText: productMenuText, nextState: 'PRODUCT_SELECTION' };
      }

      if (!session.selectedProductId) {
        // Fallback if missing product
        const mainPrompt = PromptService.getPrompt(lang, 'MAIN_MENU');
        const twiml = IvrStateMachine.generateTwiML({
          say: mainPrompt,
          language: lang,
          gatherDigits: 1,
          actionUrl: `${baseUrl}/api/ivr/webhook`,
        });
        return { twiml, session, promptText: mainPrompt, nextState: 'MAIN_MENU' };
      }

      const product = await prisma.product.findUnique({
        where: { id: session.selectedProductId },
        include: { variants: { where: { isActive: true }, orderBy: { price: 'asc' } } },
      });

      const variantIdx = parseInt(cleanDigits, 10) - 1;
      if (!product || isNaN(variantIdx) || variantIdx < 0 || variantIdx >= product.variants.length) {
        const variantPrompt = `${PromptService.getPrompt(lang, 'INVALID_INPUT')} ${IvrStateMachine.buildVariantMenuPrompt(product, lang)}`;
        const twiml = IvrStateMachine.generateTwiML({
          say: variantPrompt,
          language: lang,
          gatherDigits: 1,
          actionUrl: `${baseUrl}/api/ivr/webhook`,
        });
        return { twiml, session, promptText: variantPrompt, nextState: 'VARIANT_SELECTION' };
      }

      const selectedVariant = product.variants[variantIdx];
      const quantity = 1;
      const subtotal = selectedVariant.price * quantity;
      const deliveryFee = subtotal >= 500 ? 0.0 : 40.0;
      const total = subtotal + deliveryFee;

      const summaryText = `${quantity} pack of ${product.name} (${selectedVariant.weight}) for ${subtotal} rupees, plus ${deliveryFee} rupees delivery fee`;
      const orderSummaryPrompt = `${PromptService.getPrompt(lang, 'ORDER_SUMMARY', {
        summary: summaryText,
        total,
      })} ${PromptService.getPrompt(lang, 'CONFIRM_ORDER')}`;

      const updatedSession = await prisma.ivrSession.update({
        where: { callSid },
        data: {
          currentState: 'ORDER_CONFIRMATION',
          previousState: 'VARIANT_SELECTION',
          currentMenu: 'CONFIRM_MENU',
          selectedVariantId: selectedVariant.id,
          selectedQuantity: quantity,
          lastInput: cleanDigits,
          retryCount: 0,
          lastActivity: new Date(),
        },
      });

      if (callRecord) {
        await prisma.ivrInteraction.create({
          data: {
            callId: callRecord.id,
            language: lang,
            menu: 'VARIANT_MENU',
            dtmfInput: cleanDigits,
            action: 'WEIGHT_SELECTED',
            details: `Caller selected weight: ${selectedVariant.weight} (₹${selectedVariant.price})`,
          },
        });
      }

      const twiml = IvrStateMachine.generateTwiML({
        say: orderSummaryPrompt,
        language: lang,
        gatherDigits: 1,
        gatherTimeout: 8,
        actionUrl: `${baseUrl}/api/ivr/webhook`,
      });

      return { twiml, session: updatedSession, promptText: orderSummaryPrompt, nextState: 'ORDER_CONFIRMATION' };
    }

    // ----------------------------------------------------
    // STATE 5: ORDER_CONFIRMATION
    // ----------------------------------------------------
    if (currentState === 'ORDER_CONFIRMATION') {
      // Option 2: Change Order
      if (cleanDigits === '2') {
        const products = await prisma.product.findMany({
          where: { isActive: true },
          include: { variants: { where: { isActive: true }, orderBy: { price: 'asc' } } },
          orderBy: { createdAt: 'asc' },
        });

        const updatedSession = await prisma.ivrSession.update({
          where: { callSid },
          data: {
            currentState: 'PRODUCT_SELECTION',
            previousState: 'ORDER_CONFIRMATION',
            currentMenu: 'PRODUCT_MENU',
            lastInput: cleanDigits,
            retryCount: 0,
            lastActivity: new Date(),
          },
        });

        const productMenuText = IvrStateMachine.buildProductMenuPrompt(products, lang);
        const twiml = IvrStateMachine.generateTwiML({
          say: productMenuText,
          language: lang,
          gatherDigits: 1,
          actionUrl: `${baseUrl}/api/ivr/webhook`,
        });
        return { twiml, session: updatedSession, promptText: productMenuText, nextState: 'PRODUCT_SELECTION' };
      }

      // Option 3: Cancel Order & Return to Main Menu
      if (cleanDigits === '3') {
        const updatedSession = await prisma.ivrSession.update({
          where: { callSid },
          data: {
            currentState: 'MAIN_MENU',
            previousState: 'ORDER_CONFIRMATION',
            currentMenu: 'MAIN_MENU',
            lastInput: cleanDigits,
            retryCount: 0,
            lastActivity: new Date(),
          },
        });

        const mainPrompt = PromptService.getPrompt(lang, 'MAIN_MENU');
        const twiml = IvrStateMachine.generateTwiML({
          say: mainPrompt,
          language: lang,
          gatherDigits: 1,
          actionUrl: `${baseUrl}/api/ivr/webhook`,
        });
        return { twiml, session: updatedSession, promptText: mainPrompt, nextState: 'MAIN_MENU' };
      }

      // Option 1: CONFIRM ORDER & CREATE PERMANENT DATABASE RECORD
      if (cleanDigits === '1') {
        const variant = await prisma.productVariant.findUnique({
          where: { id: session.selectedVariantId || '' },
          include: { product: true },
        });

        if (!variant) {
          const mainPrompt = `${PromptService.getPrompt(lang, 'INVALID_INPUT')} ${PromptService.getPrompt(lang, 'MAIN_MENU')}`;
          const twiml = IvrStateMachine.generateTwiML({
            say: mainPrompt,
            language: lang,
            gatherDigits: 1,
            actionUrl: `${baseUrl}/api/ivr/webhook`,
          });
          return { twiml, session, promptText: mainPrompt, nextState: 'MAIN_MENU' };
        }

        const quantity = session.selectedQuantity || 1;
        const subtotal = variant.price * quantity;
        const deliveryFee = subtotal >= 500 ? 0.0 : 40.0;
        const total = subtotal + deliveryFee;
        const orderNumber = generateOrderNumber();

        // 1. Upsert customer in PostgreSQL
        const customer = await prisma.customer.upsert({
          where: { phone: session.fromPhone },
          update: { preferredLanguage: lang },
          create: {
            name: `Phone Customer (${session.fromPhone.slice(-4)})`,
            phone: session.fromPhone,
            preferredLanguage: lang,
            address: 'Delivery address recorded via telephone caller ID, Bhainsa',
            city: 'Bhainsa',
            district: 'Nirmal District',
            state: 'Telangana',
            pincode: '504103',
          },
        });

        // 2. Atomically create Order in database with orderSource='IVR' & language=session.language
        const order = await prisma.order.create({
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
                  quantity,
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
          include: { customer: true, items: true, payments: true },
        });

        // 3. Update session
        const updatedSession = await prisma.ivrSession.update({
          where: { callSid },
          data: {
            currentState: 'ORDER_CREATED',
            previousState: 'ORDER_CONFIRMATION',
            orderId: order.id,
            customerId: customer.id,
            sessionStatus: 'COMPLETED',
            lastInput: cleanDigits,
            retryCount: 0,
            lastActivity: new Date(),
          },
        });

        // 4. Update call record & interaction
        if (callRecord) {
          await prisma.call.update({
            where: { id: callRecord.id },
            data: { orderId: order.id, customerId: customer.id, status: 'COMPLETED' },
          });

          await prisma.ivrInteraction.create({
            data: {
              callId: callRecord.id,
              language: lang,
              menu: 'CONFIRM_MENU',
              dtmfInput: '1',
              action: 'ORDER_CONFIRMED',
              details: `Order #${order.orderNumber} successfully created via phone IVR (${lang})`,
              orderId: order.id,
              customerId: customer.id,
            },
          });
        }

        // 5. Broadcast real-time SSE event to Admin Dashboard
        realtimeService.broadcast('new_order', {
          orderId: order.id,
          orderNumber: order.orderNumber,
          customerName: customer.name,
          customerPhone: customer.phone,
          total: order.total,
          orderSource: 'IVR',
          language: lang,
          itemCount: 1,
          paymentMethod: 'OFFLINE',
          createdAt: order.createdAt,
        });

        // 6. Send SMS & Business Email Notification
        notificationService.sendOrderPlaced(order as any).catch(() => {});

        // 7. Spoken thank you message
        const createdPrompt = PromptService.getPrompt(lang, 'ORDER_CREATED', {
          orderNumber: order.orderNumber,
          total,
        });

        const twiml = IvrStateMachine.generateTwiML({
          say: createdPrompt,
          language: lang,
          hangup: true,
        });

        return { twiml, session: updatedSession, promptText: createdPrompt, nextState: 'ORDER_CREATED' };
      }

      // Invalid input in ORDER_CONFIRMATION
      const confirmPrompt = `${PromptService.getPrompt(lang, 'INVALID_INPUT')} ${PromptService.getPrompt(lang, 'CONFIRM_ORDER')}`;
      const twiml = IvrStateMachine.generateTwiML({
        say: confirmPrompt,
        language: lang,
        gatherDigits: 1,
        actionUrl: `${baseUrl}/api/ivr/webhook`,
      });
      return { twiml, session, promptText: confirmPrompt, nextState: 'ORDER_CONFIRMATION' };
    }

    // ----------------------------------------------------
    // STATE 6: CANCEL_ORDER
    // ----------------------------------------------------
    if (currentState === 'CANCEL_ORDER') {
      if (cleanDigits === '1' && session.orderId) {
        const order = await prisma.order.findUnique({ where: { id: session.orderId } });
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

          if (callRecord) {
            await prisma.ivrInteraction.create({
              data: {
                callId: callRecord.id,
                language: lang,
                menu: 'CANCEL_MENU',
                dtmfInput: '1',
                action: 'ORDER_CANCELLED',
                details: `Order #${order.orderNumber} cancelled by caller via IVR (${lang})`,
                orderId: order.id,
              },
            });
          }

          realtimeService.broadcast('order_status_updated', {
            orderId: order.id,
            orderNumber: order.orderNumber,
            status: 'CANCELLED',
          });

          const cancelSuccessPrompt = `${PromptService.getPrompt(lang, 'CANCEL_CONFIRMATION', {
            orderNumber: order.orderNumber,
          })} ${PromptService.getPrompt(lang, 'MAIN_MENU')}`;

          const updatedSession = await prisma.ivrSession.update({
            where: { callSid },
            data: {
              currentState: 'MAIN_MENU',
              previousState: 'CANCEL_ORDER',
              currentMenu: 'MAIN_MENU',
              lastInput: cleanDigits,
              retryCount: 0,
              lastActivity: new Date(),
            },
          });

          const twiml = IvrStateMachine.generateTwiML({
            say: cancelSuccessPrompt,
            language: lang,
            gatherDigits: 1,
            actionUrl: `${baseUrl}/api/ivr/webhook`,
          });
          return { twiml, session: updatedSession, promptText: cancelSuccessPrompt, nextState: 'MAIN_MENU' };
        }
      }

      // Return to main menu if 2 pressed or order not cancellable
      const updatedSession = await prisma.ivrSession.update({
        where: { callSid },
        data: {
          currentState: 'MAIN_MENU',
          previousState: 'CANCEL_ORDER',
          currentMenu: 'MAIN_MENU',
          lastInput: cleanDigits,
          retryCount: 0,
          lastActivity: new Date(),
        },
      });

      const mainPrompt = PromptService.getPrompt(lang, 'MAIN_MENU');
      const twiml = IvrStateMachine.generateTwiML({
        say: mainPrompt,
        language: lang,
        gatherDigits: 1,
        actionUrl: `${baseUrl}/api/ivr/webhook`,
      });
      return { twiml, session: updatedSession, promptText: mainPrompt, nextState: 'MAIN_MENU' };
    }

    // Fallback: Default to Main Menu
    const defaultPrompt = PromptService.getPrompt(lang, 'MAIN_MENU');
    const twiml = IvrStateMachine.generateTwiML({
      say: defaultPrompt,
      language: lang,
      gatherDigits: 1,
      actionUrl: `${baseUrl}/api/ivr/webhook`,
    });
    return { twiml, session, promptText: defaultPrompt, nextState: 'MAIN_MENU' };
  }

  /**
   * Helper to build dynamic product menu text in caller's exact chosen language
   */
  public static buildProductMenuPrompt(products: any[], language: IvrLanguage): string {
    let prompt = '';
    if (language === 'MARATHI') {
      prompt = 'कृपया उत्पादन निवडा: ';
      products.forEach((p, idx) => {
        prompt += `${p.name} साठी ${idx + 1} दाबा. `;
      });
      prompt += 'यादी पुन्हा ऐकण्यासाठी 9 दाबा. मुख्य मेनूसाठी 0 दाबा.';
    } else if (language === 'HINDI') {
      prompt = 'कृपया उत्पाद चुनें: ';
      products.forEach((p, idx) => {
        prompt += `${p.name} के लिए ${idx + 1} दबाएँ। `;
      });
      prompt += 'सूची दोबारा सुनने के लिए 9 दबाएँ। मुख्य मेनू के लिए 0 दबाएँ।';
    } else if (language === 'TELUGU') {
      prompt = 'దయచేసి ప్రోడక్ట్ ఎంచుకోండి: ';
      products.forEach((p, idx) => {
        prompt += `${p.name} కొరకు ${idx + 1} నొక్కండి. `;
      });
      prompt += 'జాబితా మళ్లీ వినడానికి 9 నొక్కండి. మెయిన్ మెనూ కోసం 0 నొక్కండి.';
    } else {
      prompt = 'Please select a product: ';
      products.forEach((p, idx) => {
        prompt += `For ${p.name}, press ${idx + 1}. `;
      });
      prompt += 'To repeat products, press 9. To return to main menu, press 0.';
    }
    return prompt;
  }

  /**
   * Helper to build dynamic variant menu text in caller's exact chosen language
   */
  public static buildVariantMenuPrompt(product: any, language: IvrLanguage): string {
    if (!product || !product.variants) return PromptService.getPrompt(language, 'INVALID_INPUT');

    let prompt = '';
    if (language === 'MARATHI') {
      prompt = `आपण ${product.name} निवडले आहे. कृपया पॅकेटचे वजन निवडा: `;
      product.variants.forEach((v: any, idx: number) => {
        prompt += `${v.weight} किंमत ${v.price} रुपयांसाठी ${idx + 1} दाबा. `;
      });
      prompt += 'मागे जाण्यासाठी 0 दाबा.';
    } else if (language === 'HINDI') {
      prompt = `आपने ${product.name} चुना है। कृपया पैकेट का वजन चुनें: `;
      product.variants.forEach((v: any, idx: number) => {
        prompt += `${v.weight} कीमत ${v.price} रुपये के लिए ${idx + 1} दबाएँ। `;
      });
      prompt += 'वापस जाने के लिए 0 दबाएँ।';
    } else if (language === 'TELUGU') {
      prompt = `మీరు ${product.name} ఎంచుకున్నారు. దయచేసి ప్యాకెట్ బరువు ఎంచుకోండి: `;
      product.variants.forEach((v: any, idx: number) => {
        prompt += `${v.weight} ధర ${v.price} రూపాయల కొరకు ${idx + 1} నొక్కండి. `;
      });
      prompt += 'వెనుకకు వెళ్లడానికి 0 నొక్కండి.';
    } else {
      prompt = `You selected ${product.name}. Please select package weight: `;
      product.variants.forEach((v: any, idx: number) => {
        prompt += `For ${v.weight} at ${v.price} rupees, press ${idx + 1}. `;
      });
      prompt += 'To return, press 0.';
    }
    return prompt;
  }

  /**
   * Generates telephony-compliant TwiML / VoiceXML with correct backend-relative action URLs and Polly voices
   */
  public static generateTwiML(options: {
    say: string;
    language: IvrLanguage;
    gatherDigits?: number;
    gatherTimeout?: number;
    dialNumber?: string;
    hangup?: boolean;
    actionUrl?: string;
  }): string {
    const { say, language = 'ENGLISH', gatherDigits = 1, gatherTimeout = 6, dialNumber, hangup, actionUrl } = options;

    let voice = 'Polly.Aditi';
    let langCode = 'en-IN';
    if (language === 'HINDI') {
      voice = 'Polly.Aditi';
      langCode = 'hi-IN';
    } else if (language === 'MARATHI') {
      voice = 'Polly.Aditi';
      langCode = 'mr-IN';
    } else if (language === 'TELUGU') {
      voice = 'Polly.Chitra';
      langCode = 'te-IN';
    }

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<Response>\n`;

    if (dialNumber) {
      xml += `  <Say language="${langCode}" voice="${voice}">${escapeXml(say)}</Say>\n`;
      xml += `  <Dial timeout="25" action="${actionUrl || '/api/ivr/status-callback'}">${dialNumber}</Dial>\n`;
    } else if (gatherDigits && actionUrl) {
      xml += `  <Gather action="${actionUrl}" method="POST" numDigits="${gatherDigits}" timeout="${gatherTimeout}">\n`;
      xml += `    <Say language="${langCode}" voice="${voice}">${escapeXml(say)}</Say>\n`;
      xml += `  </Gather>\n`;
      xml += `  <Redirect method="POST">${actionUrl}</Redirect>\n`;
    } else {
      xml += `  <Say language="${langCode}" voice="${voice}">${escapeXml(say)}</Say>\n`;
      if (hangup) {
        xml += `  <Hangup/>\n`;
      }
    }

    xml += `</Response>`;
    return xml;
  }
}
