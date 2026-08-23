import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log('🌾 Seeding Annapurna Aahaar (Bande Omkar - Bhainsa, Telangana)...');

  // 1. Seed Admin User
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@annapurnaaahaar.in';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@Annapurna2026';
  const adminName = 'Bande Omkar (Admin)';

  const passwordHash = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash,
      name: adminName,
    },
    create: {
      email: adminEmail,
      passwordHash,
      name: adminName,
      role: 'ADMIN',
    },
  });

  console.log(`✅ Admin user seeded: ${admin.email}`);

  // 2. Seed Verified Products and Variants with Exact Catalog Prices
  const productsData = [
    {
      id: 'prod-sevaya-1',
      name: 'Traditional Wheat Sevaya',
      slug: 'traditional-wheat-sevaya',
      category: 'Flours & Grains',
      description:
        'Pure, sun-dried traditional whole wheat sevaya (vermicelli) prepared with authentic grain milling techniques in Bhainsa. Ideal for sweet kheer, breakfast upma, and festive celebrations.',
      imageUrl: '/products/sevaya.webp',
      isFeatured: true,
      variants: [
        { id: 'var-sevaya-1kg', weight: '1 kg', unit: 'kg', price: 100.0, stock: 150 },
        { id: 'var-sevaya-2kg', weight: '2 kg', unit: 'kg', price: 200.0, stock: 80 },
        { id: 'var-sevaya-5kg', weight: '5 kg', unit: 'kg', price: 500.0, stock: 40 },
      ],
    },
    {
      id: 'prod-urad-papad-2',
      name: 'Urad Dal Papad',
      slug: 'urad-dal-papad',
      category: 'Papad',
      description:
        'Crispy, spiced sun-dried papads crafted from pure urad dal flour with hand-ground black pepper, hing, and traditional Bhainsa masala blend.',
      imageUrl: '/products/urad-dal-papad.webp',
      isFeatured: true,
      variants: [
        { id: 'var-urad-500g', weight: '500 g', unit: '500g', price: 150.0, stock: 200 },
        { id: 'var-urad-1kg', weight: '1 kg', unit: 'kg', price: 300.0, stock: 120 },
      ],
    },
    {
      id: 'prod-moong-papad-3',
      name: 'Moong Dal Papad',
      slug: 'moong-dal-papad',
      category: 'Papad',
      description:
        'Light, aromatic, and easy to digest papads made from premium moong lentils, seasoned with cumin seeds and mild spices. Perfect everyday accompaniment.',
      imageUrl: '/products/moong-dal-papad.webp',
      isFeatured: true,
      variants: [
        { id: 'var-moong-500g', weight: '500 g', unit: '500g', price: 150.0, stock: 180 },
        { id: 'var-moong-1kg', weight: '1 kg', unit: 'kg', price: 300.0, stock: 100 },
      ],
    },
    {
      id: 'prod-masala-papad-4',
      name: 'Masala Papad',
      slug: 'masala-papad',
      category: 'Papad',
      description:
        'Specialty zesty papad packed with crushed red chillies, black pepper, and secret family spices for that extra crunch and punch with every meal.',
      imageUrl: '/products/masala-papad.webp',
      isFeatured: false,
      variants: [
        { id: 'var-masala-500g', weight: '500 g', unit: '500g', price: 150.0, stock: 140 },
        { id: 'var-masala-1kg', weight: '1 kg', unit: 'kg', price: 300.0, stock: 90 },
      ],
    },
    {
      id: 'prod-rice-papad-5',
      name: 'Rice Papad',
      slug: 'rice-papad',
      category: 'Papad',
      description:
        'Delicate, melt-in-mouth sun-dried rice crisps (Biyyam Appadalu) prepared using time-honored southern village recipes. Light, golden, and delicious.',
      imageUrl: '/products/rice-papad.webp',
      isFeatured: false,
      variants: [
        { id: 'var-rice-500g', weight: '500 g', unit: '500g', price: 150.0, stock: 160 },
        { id: 'var-rice-1kg', weight: '1 kg', unit: 'kg', price: 300.0, stock: 110 },
      ],
    },
    {
      id: 'prod-turmeric-6',
      name: 'Pure Turmeric Powder (Haldi)',
      slug: 'pure-turmeric-powder',
      category: 'Spices',
      description:
        'Pure farm-sourced Nizamabad-Nirmal turmeric ground at low temperatures to preserve high curcumin content and rich golden-yellow natural aroma.',
      imageUrl: '/products/turmeric-haldi-powder.webp',
      isFeatured: true,
      variants: [
        { id: 'var-turmeric-1kg', weight: '1 kg', unit: 'kg', price: 150.0, stock: 250 },
      ],
    },
    {
      id: 'prod-maggie-7',
      name: 'Traditional Wheat Maggie',
      slug: 'traditional-wheat-maggie',
      category: 'Noodles & Instant Foods',
      description:
        'Nutritious, whole wheat instant noodles crafted without harmful preservatives or artificial palm oil additives. Kid-friendly, healthy, and easy to cook.',
      imageUrl: '/products/maggie.webp',
      isFeatured: false,
      variants: [
        { id: 'var-maggie-pack', weight: '1 Pack (400g)', unit: 'pack', price: 80.0, stock: 100 },
      ],
    },
    {
      id: 'prod-noodles-8',
      name: 'Handcrafted Desi Noodles',
      slug: 'handcrafted-desi-noodles',
      category: 'Noodles & Instant Foods',
      description:
        'Authentic cottage-industry milled noodles prepared using high-protein durum wheat flour. Boils tender, firm, and non-sticky.',
      imageUrl: '/products/noodles.webp',
      isFeatured: false,
      variants: [
        { id: 'var-noodles-pack', weight: '1 Pack (400g)', unit: 'pack', price: 80.0, stock: 120 },
      ],
    },
  ];

  for (const p of productsData) {
    const { variants, ...prodFields } = p;
    const createdProduct = await prisma.product.upsert({
      where: { id: prodFields.id },
      update: prodFields,
      create: prodFields,
    });

    for (const v of variants) {
      await prisma.productVariant.upsert({
        where: { id: v.id },
        update: {
          productId: createdProduct.id,
          weight: v.weight,
          unit: v.unit,
          price: v.price,
          stock: v.stock,
        },
        create: {
          id: v.id,
          productId: createdProduct.id,
          weight: v.weight,
          unit: v.unit,
          price: v.price,
          stock: v.stock,
        },
      });
    }
  }

  console.log(`✅ Seeded ${productsData.length} products with variants.`);

  // 3. Seed Default Cancellation Rules
  const cancellationRules = [
    { orderStatus: 'PENDING', isCancellable: true, requiresAdminOtp: false, description: 'Pending orders can be cancelled immediately by customer via IVR or Web' },
    { orderStatus: 'ACCEPTED', isCancellable: true, requiresAdminOtp: false, description: 'Accepted orders can be cancelled before processing starts' },
    { orderStatus: 'PROCESSING', isCancellable: false, requiresAdminOtp: true, description: 'Order in preparation requires customer care confirmation' },
    { orderStatus: 'READY', isCancellable: false, requiresAdminOtp: true, description: 'Order packaged and ready for dispatch' },
    { orderStatus: 'OUT_FOR_DELIVERY', isCancellable: false, requiresAdminOtp: true, description: 'Order dispatched with delivery partner' },
    { orderStatus: 'DELIVERED', isCancellable: false, requiresAdminOtp: false, description: 'Delivered orders cannot be cancelled' },
  ];

  for (const rule of cancellationRules) {
    await prisma.cancellationRule.upsert({
      where: { orderStatus: rule.orderStatus },
      update: rule,
      create: rule,
    });
  }

  console.log('✅ Seeded order cancellation rules.');

  // 4. Seed Verified Customer & Orders (Website & IVR)
  const cust1 = await prisma.customer.upsert({
    where: { phone: '9823012345' },
    update: {
      name: 'Ramesh Patel',
      address: 'Shop No. 4, Main Market, Gandhi Chowk',
      city: 'Bhainsa',
      district: 'Nirmal District',
      state: 'Telangana',
      pincode: '504103',
    },
    create: {
      name: 'Ramesh Patel',
      phone: '9823012345',
      email: 'ramesh.patel@example.com',
      address: 'Shop No. 4, Main Market, Gandhi Chowk',
      city: 'Bhainsa',
      district: 'Nirmal District',
      state: 'Telangana',
      pincode: '504103',
    },
  });

  const cust2 = await prisma.customer.upsert({
    where: { phone: '9848012345' },
    update: {
      name: 'Kavitha Reddy',
      address: 'House #3-45, Shivaji Nagar',
      city: 'Bhainsa',
      district: 'Nirmal District',
      state: 'Telangana',
      pincode: '504103',
    },
    create: {
      name: 'Kavitha Reddy',
      phone: '9848012345',
      email: 'kavitha.reddy@example.com',
      address: 'House #3-45, Shivaji Nagar',
      city: 'Bhainsa',
      district: 'Nirmal District',
      state: 'Telangana',
      pincode: '504103',
    },
  });

  // Seed sample IVR Call & Order
  const sampleCall = await prisma.call.upsert({
    where: { callSid: 'CALL_IVR_DEMO_TELUGU_01' },
    update: {
      fromPhone: cust2.phone,
      toPhone: '9347036152',
      language: 'TELUGU',
      duration: 125,
      status: 'COMPLETED',
      selectedOption: '1_ORDER',
    },
    create: {
      callSid: 'CALL_IVR_DEMO_TELUGU_01',
      fromPhone: cust2.phone,
      toPhone: '9347036152',
      language: 'TELUGU',
      duration: 125,
      status: 'COMPLETED',
      selectedOption: '1_ORDER',
    },
  });

  await prisma.ivrInteraction.createMany({
    data: [
      {
        callId: sampleCall.id,
        language: 'TELUGU',
        menu: 'LANGUAGE_MENU',
        dtmfInput: '4',
        action: 'LANGUAGE_SELECTED',
        details: 'Caller selected Telugu (తెలుగు)',
      },
      {
        callId: sampleCall.id,
        language: 'TELUGU',
        menu: 'MAIN_MENU',
        dtmfInput: '1',
        action: 'OPTION_SELECTED',
        details: 'Caller selected Place/Confirm Order',
      },
      {
        callId: sampleCall.id,
        language: 'TELUGU',
        menu: 'PRODUCT_MENU',
        dtmfInput: '2',
        action: 'PRODUCT_SELECTED',
        details: 'Caller selected Urad Dal Papad',
      },
      {
        callId: sampleCall.id,
        language: 'TELUGU',
        menu: 'CONFIRM_MENU',
        dtmfInput: '1',
        action: 'ORDER_CONFIRMED',
        details: 'Caller confirmed order via phone keypad',
      },
    ],
  }).catch(() => {});

  const order1 = await prisma.order.upsert({
    where: { orderNumber: 'AA-2026-8921' },
    update: {
      orderSource: 'WEBSITE',
      language: 'ENGLISH',
      status: 'ACCEPTED',
      paymentMethod: 'OFFLINE',
      paymentStatus: 'PENDING',
      subtotal: 450.0,
      deliveryFee: 0.0,
      total: 450.0,
    },
    create: {
      orderNumber: 'AA-2026-8921',
      customerId: cust1.id,
      orderSource: 'WEBSITE',
      language: 'ENGLISH',
      status: 'ACCEPTED',
      paymentMethod: 'OFFLINE',
      paymentStatus: 'PENDING',
      subtotal: 450.0,
      deliveryFee: 0.0,
      total: 450.0,
      deliveryAddress: cust1.address,
      city: cust1.city,
      district: cust1.district,
      state: cust1.state,
      pincode: cust1.pincode,
      customerNotes: 'Please pack in airtight bag',
      items: {
        create: [
          {
            productId: 'prod-urad-papad-2',
            variantId: 'var-urad-500g',
            productName: 'Urad Dal Papad',
            variantName: '500 g (500g)',
            productNameSnapshot: 'Urad Dal Papad',
            variantNameSnapshot: '500 g (500g)',
            weight: '500 g',
            unit: '500g',
            unitPrice: 150.0,
            quantity: 3,
            totalPrice: 450.0,
          },
        ],
      },
      payments: {
        create: {
          gateway: 'CASH_ON_DELIVERY',
          amount: 450.0,
          currency: 'INR',
          status: 'PENDING',
          paymentMethod: 'OFFLINE',
        },
      },
      statusHistory: {
        create: {
          newStatus: 'ACCEPTED',
          note: 'Initial order accepted by kitchen manager',
          changedBy: 'ADMIN',
        },
      },
    },
  });

  const order2 = await prisma.order.upsert({
    where: { orderNumber: 'AA-20260824-0012' },
    update: {
      orderSource: 'IVR',
      language: 'TELUGU',
      callId: sampleCall.id,
      status: 'PENDING',
      paymentMethod: 'OFFLINE',
      paymentStatus: 'PENDING',
      subtotal: 300.0,
      deliveryFee: 40.0,
      total: 340.0,
    },
    create: {
      orderNumber: 'AA-20260824-0012',
      customerId: cust2.id,
      orderSource: 'IVR',
      language: 'TELUGU',
      callId: sampleCall.id,
      status: 'PENDING',
      paymentMethod: 'OFFLINE',
      paymentStatus: 'PENDING',
      subtotal: 300.0,
      deliveryFee: 40.0,
      total: 340.0,
      deliveryAddress: cust2.address,
      city: cust2.city,
      district: cust2.district,
      state: cust2.state,
      pincode: cust2.pincode,
      customerNotes: 'Placed via Multilingual IVR (Telugu: 9347036152)',
      items: {
        create: [
          {
            productId: 'prod-urad-papad-2',
            variantId: 'var-urad-1kg',
            productName: 'Urad Dal Papad',
            variantName: '1 kg (kg)',
            productNameSnapshot: 'Urad Dal Papad',
            variantNameSnapshot: '1 kg (kg)',
            weight: '1 kg',
            unit: 'kg',
            unitPrice: 300.0,
            quantity: 1,
            totalPrice: 300.0,
          },
        ],
      },
      payments: {
        create: {
          gateway: 'CASH_ON_DELIVERY',
          amount: 340.0,
          currency: 'INR',
          status: 'PENDING',
          paymentMethod: 'OFFLINE',
        },
      },
      statusHistory: {
        create: {
          newStatus: 'PENDING',
          note: 'Order placed via 24/7 Telephone IVR (Telugu language)',
          changedBy: 'IVR_SYSTEM',
        },
      },
    },
  });

  console.log(`✅ Seeded sample persistent orders: #${order1.orderNumber} (Website) and #${order2.orderNumber} (IVR).`);
  console.log('🌾 Annapurna Aahaar database initialization complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
