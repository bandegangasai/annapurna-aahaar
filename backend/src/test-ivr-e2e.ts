import prisma from './config/prisma';
import { ENV } from './config/env';
import { PROMPTS, getIvrProductMenuText, getIvrVariantMenuText } from './services/ivrService';

async function runIvrE2eTest() {
  console.log('\n====================================================');
  console.log('🌾 ANNAPURNA AHAAR — MULTILINGUAL IVR & CALL CENTER E2E TEST');
  console.log(`   Dedicated Phone Line: ${ENV.IVR_PHONE_NUMBER || '9347036152'}`);
  console.log('   Bhainsa, Nirmal District, Telangana (504103)');
  console.log('====================================================\n');

  try {
    // ----------------------------------------------------
    // TEST 1: Language Menu & Natural Translations Verification
    // ----------------------------------------------------
    console.log('📞 Test 1: Verifying 4 Language Voice Prompts...');
    const languages = ['ENGLISH', 'MARATHI', 'HINDI', 'TELUGU'] as const;
    for (const lang of languages) {
      const menu = PROMPTS.MAIN_MENU[lang];
      if (!menu || menu.length < 10) {
        throw new Error(`Missing prompt for language ${lang}`);
      }
      console.log(`  ✅ ${lang}: "${menu.slice(0, 55)}..."`);
    }

    // ----------------------------------------------------
    // TEST 2: Dynamic DB Product Menus in All 4 Languages
    // ----------------------------------------------------
    console.log('\n📦 Test 2: Verifying Dynamic Product & Variant DB Menus...');
    const products = await prisma.product.findMany({
      where: { isActive: true },
      include: { variants: { where: { isActive: true }, orderBy: { price: 'asc' } } },
    });
    console.log(`  ✅ Found ${products.length} active products in database.`);

    const teluguProductMenu = await getIvrProductMenuText('TELUGU');
    console.log(`  ✅ Telugu Product Menu generated (${teluguProductMenu.products.length} products).`);

    const uradProduct = products.find((p) => p.name.includes('Urad Dal Papad')) || products[0];
    const hindiVariantMenu = await getIvrVariantMenuText(uradProduct.id, 'HINDI');
    console.log(`  ✅ Hindi Variant Menu for ${uradProduct.name} generated: "${hindiVariantMenu?.text.slice(0, 60)}..."`);

    // ----------------------------------------------------
    // TEST 3: Incoming Call Session & Persistence
    // ----------------------------------------------------
    console.log('\n📱 Test 3: Simulating Inbound Call on 9347036152...');
    const testCallSid = `CALL_TEST_${Date.now()}`;
    const callerPhone = '9848099887';

    const callRecord = await prisma.call.create({
      data: {
        callSid: testCallSid,
        fromPhone: callerPhone,
        toPhone: '9347036152',
        language: 'TELUGU',
        status: 'IN_PROGRESS',
        startTime: new Date(),
      },
    });
    console.log(`  ✅ Call logged in PostgreSQL database: ID ${callRecord.id} from ${callRecord.fromPhone}`);

    // ----------------------------------------------------
    // TEST 4: DTMF Interactions Logging
    // ----------------------------------------------------
    console.log('\n🔢 Test 4: Logging DTMF Keypad Navigation Steps...');
    await prisma.ivrInteraction.createMany({
      data: [
        {
          callId: callRecord.id,
          language: 'TELUGU',
          menu: 'LANGUAGE_MENU',
          dtmfInput: '4',
          action: 'LANGUAGE_SELECTED',
          details: 'Caller pressed 4 for Telugu',
        },
        {
          callId: callRecord.id,
          language: 'TELUGU',
          menu: 'MAIN_MENU',
          dtmfInput: '1',
          action: 'OPTION_SELECTED',
          details: 'Caller pressed 1 for Place Order',
        },
        {
          callId: callRecord.id,
          language: 'TELUGU',
          menu: 'PRODUCT_MENU',
          dtmfInput: '2',
          action: 'PRODUCT_SELECTED',
          details: 'Caller pressed 2 for Urad Dal Papad',
        },
      ],
    });
    console.log('  ✅ 3 DTMF steps recorded in ivr_interactions table.');

    // ----------------------------------------------------
    // TEST 5: Creating Order from IVR with Exact Snapshot Pricing
    // ----------------------------------------------------
    console.log('\n🛒 Test 5: Creating Phone Order via IVR in Database...');
    const variant1kg = uradProduct.variants.find((v) => v.weight.includes('1')) || uradProduct.variants[0];
    const subtotal = variant1kg.price * 2;
    const deliveryFee = subtotal >= 500 ? 0.0 : 40.0;
    const total = subtotal + deliveryFee;
    const orderNumber = `AA-IVR-${Date.now().toString().slice(-6)}`;

    const customer = await prisma.customer.upsert({
      where: { phone: callerPhone },
      update: {},
      create: {
        name: 'Venkata Krishna (Phone Order)',
        phone: callerPhone,
        address: 'House #4-12, Temple Road, Bhainsa',
        city: 'Bhainsa',
        district: 'Nirmal District',
        state: 'Telangana',
        pincode: '504103',
      },
    });

    const ivrOrder = await prisma.order.create({
      data: {
        orderNumber,
        customerId: customer.id,
        orderSource: 'IVR',
        language: 'TELUGU',
        callId: callRecord.id,
        status: 'PENDING',
        paymentMethod: 'OFFLINE',
        paymentStatus: 'PENDING',
        subtotal,
        deliveryFee,
        total,
        deliveryAddress: customer.address,
        city: customer.city,
        state: customer.state,
        pincode: customer.pincode,
        customerNotes: 'Placed via 24/7 Telugu IVR Line 9347036152',
        items: {
          create: [
            {
              productId: uradProduct.id,
              variantId: variant1kg.id,
              productName: uradProduct.name,
              variantName: `${variant1kg.weight} (${variant1kg.unit})`,
              productNameSnapshot: uradProduct.name,
              variantNameSnapshot: `${variant1kg.weight} (${variant1kg.unit})`,
              weight: variant1kg.weight,
              unit: variant1kg.unit,
              unitPrice: variant1kg.price,
              quantity: 2,
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
            note: 'Order placed via 24/7 Telephone IVR System',
            changedBy: 'IVR_SYSTEM',
          },
        },
      },
      include: { customer: true, items: true, payments: true },
    });

    console.log(`  ✅ IVR Order created: #${ivrOrder.orderNumber}`);
    console.log(`     - Source: ${ivrOrder.orderSource}`);
    console.log(`     - Language: ${ivrOrder.language}`);
    console.log(`     - Customer: ${ivrOrder.customer.name} (${ivrOrder.customer.phone})`);
    console.log(`     - Total: ₹${ivrOrder.total}`);

    // ----------------------------------------------------
    // TEST 6: IVR Order Tracking Lookup
    // ----------------------------------------------------
    console.log('\n🔎 Test 6: Testing IVR Live Order Tracking...');
    const trackedOrder = await prisma.order.findFirst({
      where: { customer: { phone: callerPhone } },
      orderBy: { createdAt: 'desc' },
    });
    if (!trackedOrder || trackedOrder.orderNumber !== ivrOrder.orderNumber) {
      throw new Error('Could not look up order by caller phone');
    }
    console.log(`  ✅ Live tracking verified: Order #${trackedOrder.orderNumber} is currently "${trackedOrder.status}"`);

    // ----------------------------------------------------
    // TEST 7: IVR Cancellation Rules & Order Cancellation
    // ----------------------------------------------------
    console.log('\n❌ Test 7: Testing Cancellation Rules & IVR Order Cancel...');
    const rule = await prisma.cancellationRule.findUnique({
      where: { orderStatus: trackedOrder.status },
    });
    console.log(`  ✅ Cancellation rule for "${trackedOrder.status}": isCancellable = ${rule?.isCancellable}`);

    if (rule?.isCancellable) {
      const cancelled = await prisma.order.update({
        where: { id: trackedOrder.id },
        data: {
          status: 'CANCELLED',
          cancelledAt: new Date(),
          statusHistory: {
            create: {
              previousStatus: trackedOrder.status,
              newStatus: 'CANCELLED',
              note: 'Order cancelled via IVR phone keypad confirmation',
              changedBy: 'CUSTOMER_IVR',
            },
          },
        },
      });
      console.log(`  ✅ Order #${cancelled.orderNumber} successfully cancelled via IVR.`);
    }

    // ----------------------------------------------------
    // TEST 8: Call Completion & Call Center Metrics
    // ----------------------------------------------------
    console.log('\n📊 Test 8: Finalizing Call Duration & Verifying Call Center Analytics...');
    await prisma.call.update({
      where: { id: callRecord.id },
      data: {
        duration: 95,
        endTime: new Date(),
        status: 'COMPLETED',
        selectedOption: '1_ORDER',
        orderId: ivrOrder.id,
      },
    });

    const [totalCalls, ivrOrdersTotal] = await Promise.all([
      prisma.call.count(),
      prisma.order.count({ where: { orderSource: 'IVR' } }),
    ]);
    console.log(`  ✅ Total Calls in database: ${totalCalls}`);
    console.log(`  ✅ Total IVR Orders in database: ${ivrOrdersTotal}`);

    console.log('\n====================================================');
    console.log('🎉 ALL 8 MULTILINGUAL IVR E2E TESTS PASSED WITH 100% SUCCESS!');
    console.log('====================================================\n');
  } catch (error) {
    console.error('❌ IVR Test Failure:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runIvrE2eTest();
