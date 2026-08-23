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

  // 2. Clear old product catalog for clean seed
  await prisma.orderItem.deleteMany({});
  await prisma.orderStatusHistory.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.productVariant.deleteMany({});
  await prisma.product.deleteMany({});

  // 3. Seed Verified Products and Variants with Exact Product Photography Assets
  const productsData = [
    {
      id: 'prod-sevaya-1',
      name: 'Traditional Wheat Sevaya',
      slug: 'traditional-wheat-sevaya',
      category: 'Flours & Grains',
      description:
        'Pure, sun-dried traditional whole wheat sevaya (vermicelli) prepared with authentic grain milling techniques. Ideal for authentic sweet kheer, breakfast upma, and festive celebrations.',
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
        'Authentic round Urad Dal Papad crafted with traditional rolling techniques, black pepper, and premium asafoetida (hing). Sun-cured for signature crunch and flavor.',
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
        'Light, aromatic Moong Dal Papad made from high-grade split yellow mung bean flour. Exceptionally crunchy, gentle on digestion, and seasoned with subtle Indian spices.',
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
        'Bold and zesty Indian papad loaded with crushed cumin, cracked black peppercorns, red chili flakes, and traditional digestive spices.',
      imageUrl: '/products/masala-papad.webp',
      isFeatured: true,
      variants: [
        { id: 'var-masala-500g', weight: '500 g', unit: '500g', price: 150.0, stock: 150 },
        { id: 'var-masala-1kg', weight: '1 kg', unit: 'kg', price: 300.0, stock: 90 },
      ],
    },
    {
      id: 'prod-rice-papad-5',
      name: 'Rice Papad',
      slug: 'rice-papad',
      category: 'Papad',
      description:
        'Traditional steamed and sun-dried rice flour papad with a delicate, melt-in-mouth crispiness. Seasoned with cumin and rock salt.',
      imageUrl: '/products/rice-papad.webp',
      isFeatured: false,
      variants: [
        { id: 'var-rice-500g', weight: '500 g', unit: '500g', price: 150.0, stock: 100 },
        { id: 'var-rice-1kg', weight: '1 kg', unit: 'kg', price: 300.0, stock: 60 },
      ],
    },
    {
      id: 'prod-turmeric-6',
      name: 'Pure Turmeric Powder',
      slug: 'pure-turmeric-powder',
      category: 'Spices',
      description:
        '100% pure, natural, golden-yellow turmeric (haldi) powder with high curcumin content. Stone-ground from quality farm turmeric roots without fillers or artificial additives.',
      imageUrl: '/products/turmeric-haldi-powder.webp',
      isFeatured: true,
      variants: [
        { id: 'var-turmeric-500g', weight: '500 g', unit: '500g', price: 80.0, stock: 250 },
        { id: 'var-turmeric-1kg', weight: '1 kg', unit: 'kg', price: 150.0, stock: 150 },
      ],
    },
    {
      id: 'prod-maggie-7',
      name: 'Maggie',
      slug: 'maggie',
      category: 'Noodles & Instant Foods',
      description:
        'Classic Indian-spiced instant noodle packs with rich masala seasoning for quick family snacking. Price configurable by administration.',
      imageUrl: '/products/maggie.webp',
      isFeatured: false,
      variants: [
        { id: 'var-maggie-420g', weight: '420g Pack', unit: 'pack', price: 85.0, stock: 200 },
        { id: 'var-maggie-840g', weight: '840g Pack', unit: 'pack', price: 165.0, stock: 100 },
      ],
    },
    {
      id: 'prod-noodles-8',
      name: 'Noodles',
      slug: 'noodles',
      category: 'Noodles & Instant Foods',
      description:
        'High-protein wheat noodles crafted for Indian-style Hakka and stir-fry preparations. Firm texture and zero chemical preservatives.',
      imageUrl: '/products/noodles.webp',
      isFeatured: false,
      variants: [
        { id: 'var-noodles-500g', weight: '500g Pack', unit: 'pack', price: 95.0, stock: 140 },
        { id: 'var-noodles-1kg', weight: '1 kg Pack', unit: 'pack', price: 180.0, stock: 75 },
      ],
    },
  ];

  for (const item of productsData) {
    const { variants, ...productInfo } = item;
    const createdProduct = await prisma.product.create({
      data: {
        ...productInfo,
        variants: {
          create: variants,
        },
      },
      include: { variants: true },
    });
    console.log(`🌾 Seeded product: ${createdProduct.name} (${createdProduct.category})`);
  }

  // 4. Seed initial real business contact message
  await prisma.contactMessage.create({
    data: {
      name: 'Nirmal Retailer',
      phone: '8688456925',
      email: 'retail@nirmalfood.in',
      subject: 'Bulk Papad Supply in Nirmal District',
      message: 'Hello Bande Omkar ji, requesting bulk delivery of 30kg Urad and Moong Dal Papads to Nirmal market.',
    },
  });

  // 5. Seed verified historical orders
  const cust1 = await prisma.customer.create({
    data: {
      name: 'Ramesh Patel',
      phone: '9823012345',
      email: 'ramesh.patel@example.com',
      address: 'Main Bazar Road, Near Gandhi Chowk',
      city: 'Bhainsa',
      district: 'Nirmal District',
      state: 'Telangana',
      pincode: '504103',
    },
  });

  await prisma.order.create({
    data: {
      orderNumber: 'AA-2026-8921',
      customerId: cust1.id,
      status: 'ACCEPTED',
      paymentMethod: 'OFFLINE_COD',
      paymentStatus: 'PENDING',
      subtotal: 450,
      deliveryFee: 0,
      total: 450,
      notes: 'Please pack in fresh moisture-proof seal.',
      items: {
        create: [
          {
            productId: 'prod-urad-papad-2',
            variantId: 'var-urad-500g',
            productName: 'Urad Dal Papad',
            variantName: '500 g (500g)',
            unitPrice: 150,
            quantity: 2,
            totalPrice: 300,
          },
          {
            productId: 'prod-turmeric-6',
            variantId: 'var-turmeric-1kg',
            productName: 'Pure Turmeric Powder',
            variantName: '1 kg (kg)',
            unitPrice: 150,
            quantity: 1,
            totalPrice: 150,
          },
        ],
      },
      statusHistory: {
        create: [
          {
            newStatus: 'PENDING',
            note: 'Order placed by customer',
            changedBy: 'CUSTOMER',
          },
          {
            previousStatus: 'PENDING',
            newStatus: 'ACCEPTED',
            note: 'Order accepted by Bande Omkar',
            changedBy: 'ADMIN',
          },
        ],
      },
    },
  });

  const cust2 = await prisma.customer.create({
    data: {
      name: 'Kavitha Reddy',
      phone: '9848012345',
      email: 'kavitha.reddy@example.com',
      address: 'House #4-12, Old Bus Stand',
      city: 'Bhainsa',
      district: 'Nirmal District',
      state: 'Telangana',
      pincode: '504103',
    },
  });

  await prisma.order.create({
    data: {
      orderNumber: 'AA-2026-9142',
      customerId: cust2.id,
      status: 'PENDING',
      paymentMethod: 'OFFLINE_COD',
      paymentStatus: 'PENDING',
      subtotal: 300,
      deliveryFee: 40,
      total: 340,
      notes: 'Deliver fresh morning batch',
      items: {
        create: [
          {
            productId: 'prod-sevaya-1',
            variantId: 'var-sevaya-1kg',
            productName: 'Traditional Wheat Sevaya',
            variantName: '1 kg (kg)',
            unitPrice: 100,
            quantity: 3,
            totalPrice: 300,
          },
        ],
      },
      statusHistory: {
        create: [
          {
            newStatus: 'PENDING',
            note: 'Order placed by customer',
            changedBy: 'CUSTOMER',
          },
        ],
      },
    },
  });

  console.log('✅ Annapurna Aahaar database seeded with verified catalog, orders, and Bhainsa business data!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
