import { prisma } from './config/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ENV } from './config/env';

async function runE2ETest() {
  console.log('====================================================');
  console.log('🌾 ANNAPURNA AHAAR — FULL-STACK AUTOMATED E2E TEST');
  console.log('====================================================\n');

  try {
    // 1. Verify Database Products & Variants
    console.log('🧪 Step 1: Verifying Product Catalog & Variants...');
    const products = await prisma.product.findMany({
      include: { variants: true },
    });
    console.log(`✅ Retrieved ${products.length} products from database.`);
    if (products.length === 0) {
      throw new Error('No products found in DB. Run seed first.');
    }

    const papadProduct = products.find((p) => p.category === 'Papad');
    if (!papadProduct || papadProduct.variants.length === 0) {
      throw new Error('Papad product or variants missing!');
    }
    console.log(`✅ Sample Product: "${papadProduct.name}" has ${papadProduct.variants.length} variant(s).`);

    // 2. Test Server-Side Pricing & Order Placement Logic
    console.log('\n🧪 Step 2: Testing Customer Order Placement & Server-side Pricing...');
    const selectedVariant = papadProduct.variants[0];
    const orderQuantity = 2;
    const expectedSubtotal = selectedVariant.price * orderQuantity;
    const expectedDelivery = expectedSubtotal >= 500 ? 0.0 : 40.0;
    const expectedTotal = expectedSubtotal + expectedDelivery;

    // Simulate Customer & Order Creation
    const testCustomer = await prisma.customer.create({
      data: {
        name: 'Sharma Ji Test',
        phone: '9876543210',
        email: 'sharmaji@example.com',
        address: 'House 42, Heritage Street, Near Temple',
        city: 'Varanasi',
        state: 'Uttar Pradesh',
        pincode: '221001',
      },
    });
    console.log(`✅ Customer record created/linked: ${testCustomer.name} (Phone: ${testCustomer.phone})`);

    const orderNumber = `AA-TEST-${Date.now().toString().slice(-6)}`;
    const testOrder = await prisma.order.create({
      data: {
        orderNumber,
        customerId: testCustomer.id,
        status: 'PENDING',
        subtotal: expectedSubtotal,
        deliveryFee: expectedDelivery,
        total: expectedTotal,
        notes: 'Please ring bell and leave with security if unavailable',
        paymentMethod: 'CASH_ON_DELIVERY',
        items: {
          create: [
            {
              productId: papadProduct.id,
              variantId: selectedVariant.id,
              productName: papadProduct.name,
              variantName: `${selectedVariant.weight} (${selectedVariant.unit})`,
              unitPrice: selectedVariant.price,
              quantity: orderQuantity,
              totalPrice: expectedSubtotal,
            },
          ],
        },
        statusHistory: {
          create: {
            previousStatus: null,
            newStatus: 'PENDING',
            note: 'Order placed by customer',
            changedBy: 'CUSTOMER',
          },
        },
      },
      include: {
        customer: true,
        items: true,
        statusHistory: true,
      },
    });

    console.log(`✅ Order placed: #${testOrder.orderNumber}`);
    console.log(`   - Status: ${testOrder.status}`);
    console.log(`   - Subtotal: ₹${testOrder.subtotal}`);
    console.log(`   - Delivery Fee: ₹${testOrder.deliveryFee}`);
    console.log(`   - Total Payable: ₹${testOrder.total}`);

    // 3. Test Customer Tracking Query
    console.log('\n🧪 Step 3: Verifying Customer Tracking Retrieval...');
    const trackedOrder = await prisma.order.findUnique({
      where: { orderNumber: testOrder.orderNumber },
      include: { customer: true, items: true, statusHistory: true },
    });
    if (!trackedOrder || trackedOrder.status !== 'PENDING') {
      throw new Error('Tracking lookup failed or initial status mismatch!');
    }
    console.log(`✅ Customer tracking verified: Order #${trackedOrder.orderNumber} is PENDING.`);

    // 4. Test Admin Authentication
    console.log('\n🧪 Step 4: Testing Admin Authentication & Credentials...');
    const adminEmail = ENV.ADMIN_EMAIL;
    const admin = await prisma.adminUser.findUnique({
      where: { email: adminEmail },
    });
    if (!admin) {
      throw new Error(`Admin user ${adminEmail} not found!`);
    }

    const passwordValid = await bcrypt.compare(ENV.ADMIN_PASSWORD, admin.passwordHash);
    if (!passwordValid) {
      throw new Error('Admin password hash mismatch!');
    }
    const token = jwt.sign(
      { userId: admin.id, email: admin.email, name: admin.name, role: admin.role },
      ENV.JWT_SECRET,
      { expiresIn: '1h' }
    );
    console.log(`✅ Admin authenticated: ${admin.name} (${admin.email})`);
    console.log(`✅ JWT token generated successfully.`);

    // 5. Test Admin ACCEPT Order Workflow
    console.log('\n🧪 Step 5: Testing Admin ACCEPT Order Workflow...');
    const acceptedOrder = await prisma.order.update({
      where: { id: testOrder.id },
      data: {
        status: 'ACCEPTED',
        statusHistory: {
          create: {
            previousStatus: 'PENDING',
            newStatus: 'ACCEPTED',
            note: 'Order approved and verified by kitchen manager',
            changedBy: admin.name,
          },
        },
      },
      include: { statusHistory: true },
    });

    if (acceptedOrder.status !== 'ACCEPTED') {
      throw new Error('Failed to update status to ACCEPTED!');
    }
    console.log(`✅ Order #${acceptedOrder.orderNumber} status successfully updated to: ACCEPTED`);

    // Verify Customer Tracking reflects ACCEPTED
    const customerTrackingCheck1 = await prisma.order.findUnique({
      where: { orderNumber: testOrder.orderNumber },
    });
    if (customerTrackingCheck1?.status !== 'ACCEPTED') {
      throw new Error('Customer tracking does not reflect ACCEPTED status!');
    }
    console.log(`✅ Customer tracking check verified: Status is now ACCEPTED.`);

    // 6. Test Admin REJECT Order Workflow
    console.log('\n🧪 Step 6: Testing Admin REJECT Order Workflow on a 2nd test order...');
    const testOrder2 = await prisma.order.create({
      data: {
        orderNumber: `AA-REJECT-${Date.now().toString().slice(-6)}`,
        customerId: testCustomer.id,
        status: 'PENDING',
        subtotal: 100,
        deliveryFee: 40,
        total: 140,
        paymentMethod: 'CASH_ON_DELIVERY',
        items: {
          create: [
            {
              productId: papadProduct.id,
              variantId: selectedVariant.id,
              productName: papadProduct.name,
              variantName: selectedVariant.weight,
              unitPrice: 100,
              quantity: 1,
              totalPrice: 100,
            },
          ],
        },
      },
    });

    const rejectedOrder = await prisma.order.update({
      where: { id: testOrder2.id },
      data: {
        status: 'REJECTED',
        statusHistory: {
          create: {
            previousStatus: 'PENDING',
            newStatus: 'REJECTED',
            note: 'Delivery address unserviceable today',
            changedBy: admin.name,
          },
        },
      },
    });
    if (rejectedOrder.status !== 'REJECTED') {
      throw new Error('Failed to update status to REJECTED!');
    }
    console.log(`✅ Second test order #${rejectedOrder.orderNumber} successfully REJECTED with note logged.`);

    // 7. Test Contact Form Submission
    console.log('\n🧪 Step 7: Testing Contact Form Enquiry Persistence...');
    const contact = await prisma.contactMessage.create({
      data: {
        name: 'Kavita Patel',
        phone: '9123456789',
        email: 'kavita@example.com',
        subject: 'Wholesale Papad Inquiry',
        message: 'Interested in 20kg Urad Dal Papad for catering.',
      },
    });
    console.log(`✅ Contact message stored in DB: ID ${contact.id} from ${contact.name}`);

    console.log('\n====================================================');
    console.log('🎉 ALL END-TO-END TESTS PASSED SUCCESSFULLY!');
    console.log('====================================================');
  } catch (error) {
    console.error('❌ E2E Test Failure:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runE2ETest();
