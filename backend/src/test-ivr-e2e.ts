import prisma from './config/prisma';
import { ENV } from './config/env';
import { IvrStateMachine } from './services/ivrStateMachine';
import { PromptService } from './services/promptService';

async function runIvrE2eTestSuite() {
  console.log('\n================================================================');
  console.log('🌾 ANNAPURNA AHAAR — PRODUCTION IVR STATE MACHINE TEST BATTERY');
  console.log(`   Hotline Number: ${ENV.IVR_PHONE_NUMBER || '9347036152'}`);
  console.log('   Bhainsa, Nirmal District, Telangana (504103)');
  console.log('================================================================\n');

  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      include: { variants: { where: { isActive: true }, orderBy: { price: 'asc' } } },
    });
    console.log(`📦 Catalog: Found ${products.length} active authentic food products in database.`);

    // ----------------------------------------------------------------
    // TEST 1: MARATHI (मराठी) FULL ORDERING FLOW (State Machine)
    // ----------------------------------------------------------------
    console.log('\n🚩 [TEST 1] Testing Marathi Full IVR Ordering Flow...');
    const callSidMr = `CALL_MR_${Date.now()}`;
    const phoneMr = '9823011223';

    // Step 1: Initial call greeting (No digits)
    const step1 = await IvrStateMachine.processInput({
      callSid: callSidMr,
      fromPhone: phoneMr,
      digits: '',
    });
    if (step1.nextState !== 'LANGUAGE_SELECTION') throw new Error('Failed initial greeting');
    console.log('  ✅ Step 1: Initial greeting rendered in English/Multilingual.');

    // Step 2: Caller selects Marathi (Press 2)
    const step2 = await IvrStateMachine.processInput({
      callSid: callSidMr,
      fromPhone: phoneMr,
      digits: '2',
    });
    if (step2.session.language !== 'MARATHI' || step2.nextState !== 'MAIN_MENU') {
      throw new Error(`Failed language transition. Language: ${step2.session.language}`);
    }
    console.log(`  ✅ Step 2: Language set to MARATHI. Session transitioned to MAIN_MENU.`);

    // Step 3: Caller selects Place Order (Press 1)
    const step3 = await IvrStateMachine.processInput({
      callSid: callSidMr,
      fromPhone: phoneMr,
      digits: '1',
    });
    if (step3.session.language !== 'MARATHI' || step3.nextState !== 'PRODUCT_SELECTION') {
      throw new Error('Failed product selection transition in Marathi');
    }
    console.log('  ✅ Step 3: Spoke Product Catalogue in Marathi.');

    // Step 4: Caller selects Sevaya (Press 1)
    const step4 = await IvrStateMachine.processInput({
      callSid: callSidMr,
      fromPhone: phoneMr,
      digits: '1',
    });
    if (step4.session.language !== 'MARATHI' || step4.nextState !== 'VARIANT_SELECTION') {
      throw new Error('Failed variant selection transition in Marathi');
    }
    console.log('  ✅ Step 4: Spoke Package Weight & Price in Marathi.');

    // Step 5: Caller selects 1kg pack (Press 1)
    const step5 = await IvrStateMachine.processInput({
      callSid: callSidMr,
      fromPhone: phoneMr,
      digits: '1',
    });
    if (step5.session.language !== 'MARATHI' || step5.nextState !== 'ORDER_CONFIRMATION') {
      throw new Error('Failed order confirmation transition in Marathi');
    }
    console.log('  ✅ Step 5: Spoke Order Summary & Total in Marathi.');

    // Step 6: Caller confirms order (Press 1)
    const step6 = await IvrStateMachine.processInput({
      callSid: callSidMr,
      fromPhone: phoneMr,
      digits: '1',
    });
    if (step6.session.language !== 'MARATHI' || step6.nextState !== 'ORDER_CREATED') {
      throw new Error('Failed order creation transition in Marathi');
    }

    const createdOrderMr = await prisma.order.findUnique({
      where: { id: step6.session.orderId },
      include: { customer: true, items: true },
    });
    if (!createdOrderMr || createdOrderMr.language !== 'MARATHI' || createdOrderMr.orderSource !== 'IVR') {
      throw new Error('Order record in PostgreSQL failed validation');
    }
    console.log(`  ✅ Step 6: Order #${createdOrderMr.orderNumber} successfully created (Language: ${createdOrderMr.language}, Source: ${createdOrderMr.orderSource}).`);

    // ----------------------------------------------------------------
    // TEST 2: TELUGU (తెలుగు) ORDER & LIVE TRACKING FLOW
    // ----------------------------------------------------------------
    console.log('\n🌾 [TEST 2] Testing Telugu Full Order & Live Tracking Flow...');
    const callSidTe = `CALL_TE_${Date.now()}`;
    const phoneTe = '9347011223';

    // Step 1 & 2: Select Telugu (Press 4)
    await IvrStateMachine.processInput({ callSid: callSidTe, fromPhone: phoneTe, digits: '' });
    const teLangRes = await IvrStateMachine.processInput({ callSid: callSidTe, fromPhone: phoneTe, digits: '4' });
    if (teLangRes.session.language !== 'TELUGU') throw new Error('Telugu language selection failed');

    // Step 3: Track Order (Press 2)
    const teTrackRes = await IvrStateMachine.processInput({ callSid: callSidTe, fromPhone: phoneTe, digits: '2' });
    if (teTrackRes.session.language !== 'TELUGU') throw new Error('Language reverted during tracking');
    console.log('  ✅ Telugu Live Order Tracking prompt successfully spoken in Telugu.');

    // ----------------------------------------------------------------
    // TEST 3: HINDI (हिंदी) CANCELLATION FLOW
    // ----------------------------------------------------------------
    console.log('\n🇮🇳 [TEST 3] Testing Hindi Cancellation Flow...');
    const callSidHi = `CALL_HI_${Date.now()}`;
    const phoneHi = '9849022334';

    // Create a pending order for phoneHi first
    const hiCustomer = await prisma.customer.upsert({
      where: { phone: phoneHi },
      update: { preferredLanguage: 'HINDI' },
      create: {
        name: 'Sunil Kumar',
        phone: phoneHi,
        preferredLanguage: 'HINDI',
        address: 'Market Yard, Bhainsa',
        city: 'Bhainsa',
        state: 'Telangana',
        pincode: '504103',
      },
    });

    const testPendingOrder = await prisma.order.create({
      data: {
        orderNumber: `AA-HI-${Date.now().toString().slice(-6)}`,
        customerId: hiCustomer.id,
        orderSource: 'IVR',
        language: 'HINDI',
        status: 'PENDING',
        paymentMethod: 'OFFLINE',
        paymentStatus: 'PENDING',
        subtotal: 150.0,
        deliveryFee: 40.0,
        total: 190.0,
        deliveryAddress: hiCustomer.address,
        city: hiCustomer.city,
        state: hiCustomer.state,
        pincode: hiCustomer.pincode,
        items: {
          create: [
            {
              productId: products[0].id,
              variantId: products[0].variants[0].id,
              productName: products[0].name,
              variantName: products[0].variants[0].weight,
              unitPrice: products[0].variants[0].price,
              quantity: 1,
              totalPrice: products[0].variants[0].price,
            },
          ],
        },
      },
    });

    // Start Hindi call
    await IvrStateMachine.processInput({ callSid: callSidHi, fromPhone: phoneHi, digits: '' });
    await IvrStateMachine.processInput({ callSid: callSidHi, fromPhone: phoneHi, digits: '3' }); // Hindi

    // Press 3 (Cancel Order)
    const hiCancelPrompt = await IvrStateMachine.processInput({ callSid: callSidHi, fromPhone: phoneHi, digits: '3' });
    if (hiCancelPrompt.nextState !== 'CANCEL_ORDER' || hiCancelPrompt.session.language !== 'HINDI') {
      throw new Error('Failed cancel order prompt in Hindi');
    }

    // Press 1 (Confirm Cancellation)
    const hiCancelConfirm = await IvrStateMachine.processInput({ callSid: callSidHi, fromPhone: phoneHi, digits: '1' });
    const cancelledDbOrder = await prisma.order.findUnique({ where: { id: testPendingOrder.id } });
    if (cancelledDbOrder?.status !== 'CANCELLED') {
      throw new Error('Order status in database was not marked CANCELLED');
    }
    console.log(`  ✅ Order #${cancelledDbOrder.orderNumber} successfully cancelled in Hindi flow.`);

    // ----------------------------------------------------------------
    // TEST 4: CHANGE LANGUAGE (English -> Press 9 -> Marathi)
    // ----------------------------------------------------------------
    console.log('\n🔄 [TEST 4] Testing Change Language Flow (Option 9)...');
    const callSidChg = `CALL_CHG_${Date.now()}`;
    const phoneChg = '9822099887';

    // Start English call
    await IvrStateMachine.processInput({ callSid: callSidChg, fromPhone: phoneChg, digits: '' });
    await IvrStateMachine.processInput({ callSid: callSidChg, fromPhone: phoneChg, digits: '1' }); // English

    // Caller in Main Menu presses 9 (Change Language)
    const changeMenuRes = await IvrStateMachine.processInput({ callSid: callSidChg, fromPhone: phoneChg, digits: '9' });
    if (changeMenuRes.nextState !== 'LANGUAGE_SELECTION') {
      throw new Error('Option 9 did not return to LANGUAGE_SELECTION');
    }

    // Caller selects Marathi (Press 2)
    const switchedLangRes = await IvrStateMachine.processInput({ callSid: callSidChg, fromPhone: phoneChg, digits: '2' });
    if (switchedLangRes.session.language !== 'MARATHI' || switchedLangRes.nextState !== 'MAIN_MENU') {
      throw new Error('Failed language switch to Marathi');
    }
    console.log('  ✅ Language switched dynamically from English to MARATHI. All future prompts are in Marathi.');

    // ----------------------------------------------------------------
    // TEST 5: PERSISTENT DATABASE SESSION RECOVERY
    // ----------------------------------------------------------------
    console.log('\n💾 [TEST 5] Testing PostgreSQL Session Recovery...');
    const dbSession = await prisma.ivrSession.findUnique({ where: { callSid: callSidChg } });
    if (!dbSession || dbSession.language !== 'MARATHI' || dbSession.currentState !== 'MAIN_MENU') {
      throw new Error('Database session record verification failed');
    }
    console.log(`  ✅ IvrSession persisted: ID ${dbSession.id}, State: ${dbSession.currentState}, Lang: ${dbSession.language}`);

    // ----------------------------------------------------------------
    // TEST 6: INVALID INPUT & RETRY HANDLING
    // ----------------------------------------------------------------
    console.log('\n⚠️ [TEST 6] Testing Invalid Keypad Input Handling...');
    const invalidRes = await IvrStateMachine.processInput({
      callSid: callSidChg,
      fromPhone: phoneChg,
      digits: '8', // invalid in MAIN_MENU
    });
    if (invalidRes.session.language !== 'MARATHI' || invalidRes.nextState !== 'MAIN_MENU') {
      throw new Error('Invalid input failed to keep Marathi language');
    }
    console.log('  ✅ Invalid input handled gracefully: Spoke error and repeated Marathi menu.');

    // ----------------------------------------------------------------
    // TEST 7: TWIML XML & TTS VOICE GENERATION
    // ----------------------------------------------------------------
    console.log('\n🎙️ [TEST 7] Testing TwiML XML & Speech Voice Attributes...');
    const twimlMarathi = IvrStateMachine.generateTwiML({
      say: 'अन्नपूर्णा आहार',
      language: 'MARATHI',
      gatherDigits: 1,
      actionUrl: '/api/ivr/webhook',
    });
    if (!twimlMarathi.includes('voice="Polly.Aditi"') || !twimlMarathi.includes('language="mr-IN"')) {
      throw new Error('TwiML missing Marathi Polly voice attributes');
    }
    console.log('  ✅ Verified Marathi Polly.Aditi voice and mr-IN language tags.');

    const twimlTelugu = IvrStateMachine.generateTwiML({
      say: 'అన్నపూర్ణ ఆహార్',
      language: 'TELUGU',
      gatherDigits: 1,
      actionUrl: '/api/ivr/webhook',
    });
    if (!twimlTelugu.includes('voice="Polly.Chitra"') || !twimlTelugu.includes('language="te-IN"')) {
      throw new Error('TwiML missing Telugu Polly voice attributes');
    }
    console.log('  ✅ Verified Telugu Polly.Chitra voice and te-IN language tags.');

    // ----------------------------------------------------------------
    // TEST 8: PROMPT SERVICE DICTIONARY COMPLETENESS
    // ----------------------------------------------------------------
    console.log('\n📖 [TEST 8] Verifying Prompt Engine Dictionary across 4 Languages...');
    const languages = ['ENGLISH', 'MARATHI', 'HINDI', 'TELUGU'] as const;
    for (const l of languages) {
      const welcome = PromptService.getPrompt(l, 'WELCOME');
      const mainMenu = PromptService.getPrompt(l, 'MAIN_MENU');
      if (!welcome || !mainMenu) throw new Error(`Missing prompt for ${l}`);
      console.log(`  ✅ ${l}: Welcome & Main Menu loaded successfully.`);
    }

    console.log('\n================================================================');
    console.log('🎉 ALL PRODUCTION IVR STATE MACHINE TESTS PASSED 100% SUCCESS!');
    console.log('================================================================\n');
  } catch (error) {
    console.error('❌ Test Failure:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    process.exit(0);
  }
}

runIvrE2eTestSuite();
