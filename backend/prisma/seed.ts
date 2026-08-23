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

  // 2. Seed Verified Products and Variants with Exact Product Photography Assets
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
        { id: 'var-masala-500g', weight: '500 g', unit: '500g', price: 160.0, stock: 140 },
        { id: 'var-masala-1kg', weight: '1 kg', unit: 'kg', price: 320.0, stock: 90 },
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
        { id: 'var-rice-500g', weight: '500 g', unit: '500g', price: 140.0, stock: 160 },
        { id: 'var-rice-1kg', weight: '1 kg', unit: 'kg', price: 280.0, stock: 100 },
      ],
    },
    {
      id: 'prod-turmeric-6',
      name: 'Pure Turmeric Powder',
      slug: 'pure-turmeric-powder',
      category: 'Spices',
      description:
        '100% natural, farm-ground turmeric root powder with high curcumin content. No artificial colors, preservatives, or fillers added.',
      imageUrl: '/products/turmeric-haldi-powder.webp',
      isFeatured: true,
      variants: [
        { id: 'var-turmeric-500g', weight: '500 g', unit: '500g', price: 80.0, stock: 250 },
        { id: 'var-turmeric-1kg', weight: '1 kg', unit: 'kg', price: 150.0, stock: 200 },
      ],
    },
    {
      id: 'prod-maggie-7',
      name: 'Maggie',
      slug: 'maggie',
      category: 'Noodles & Instant Foods',
      description:
        'Family favorite delicious instant noodles with rich spice seasoning. Quick, wholesome snack for children and festive gatherings.',
      imageUrl: '/products/maggie.webp',
      isFeatured: false,
      variants: [
        { id: 'var-maggie-pack4', weight: 'Pack of 4', unit: 'pack', price: 60.0, stock: 100 },
        { id: 'var-maggie-pack12', weight: 'Family Pack (12)', unit: 'pack', price: 170.0, stock: 60 },
      ],
    },
    {
      id: 'prod-noodles-8',
      name: 'Noodles',
      slug: 'noodles',
      category: 'Noodles & Instant Foods',
      description:
        'High quality wheat stir-fry noodles made for authentic desi chowmein and hakka noodles. Non-sticky, tender texture.',
      imageUrl: '/products/noodles.webp',
      isFeatured: false,
      variants: [
        { id: 'var-noodles-500g', weight: '500 g', unit: '500g', price: 65.0, stock: 120 },
        { id: 'var-noodles-1kg', weight: '1 kg', unit: 'kg', price: 120.0, stock: 90 },
      ],
    },
  ];

  for (const p of productsData) {
    const { variants, ...prodData } = p;
    await prisma.product.upsert({
      where: { id: prodData.id },
      update: prodData,
      create: prodData,
    });

    for (const v of variants) {
      await prisma.productVariant.upsert({
        where: { id: v.id },
        update: {
          weight: v.weight,
          unit: v.unit,
          price: v.price,
          stock: v.stock,
          productId: prodData.id,
        },
        create: {
          id: v.id,
          productId: prodData.id,
          weight: v.weight,
          unit: v.unit,
          price: v.price,
          stock: v.stock,
        },
      });
    }
    console.log(`🌾 Seeded product: ${prodData.name} (${prodData.category})`);
  }

  // 3. Seed verified historical orders
  const cust1 = await prisma.customer.upsert({
    where: { phone: '9823012345' },
    update: {},
    create: {
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

  await prisma.order.upsert({
    where: { orderNumber: 'AA-2026-8921' },
    update: {},
    create: {
      orderNumber: 'AA-2026-8921',
      customerId: cust1.id,
      status: 'ACCEPTED',
      paymentMethod: 'OFFLINE',
      paymentStatus: 'PENDING',
      subtotal: 450,
      deliveryFee: 0,
      total: 450,
      deliveryAddress: 'Main Bazar Road, Near Gandhi Chowk',
      city: 'Bhainsa',
      district: 'Nirmal District',
      state: 'Telangana',
      pincode: '504103',
      customerNotes: 'Please pack in fresh moisture-proof seal.',
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
            unitPrice: 150,
            quantity: 2,
            totalPrice: 300,
          },
          {
            productId: 'prod-turmeric-6',
            variantId: 'var-turmeric-1kg',
            productName: 'Pure Turmeric Powder',
            variantName: '1 kg (kg)',
            productNameSnapshot: 'Pure Turmeric Powder',
            variantNameSnapshot: '1 kg (kg)',
            weight: '1 kg',
            unit: 'kg',
            unitPrice: 150,
            quantity: 1,
            totalPrice: 150,
          },
        ],
      },
      payments: {
        create: {
          gateway: 'CASH_ON_DELIVERY',
          amount: 450,
          currency: 'INR',
          status: 'PENDING',
          paymentMethod: 'OFFLINE',
        },
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

  const cust2 = await prisma.customer.upsert({
    where: { phone: '9848012345' },
    update: {},
    create: {
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

  await prisma.order.upsert({
    where: { orderNumber: 'AA-2026-9142' },
    update: {},
    create: {
      orderNumber: 'AA-2026-9142',
      customerId: cust2.id,
      status: 'PENDING',
      paymentMethod: 'OFFLINE',
      paymentStatus: 'PENDING',
      subtotal: 300,
      deliveryFee: 40,
      total: 340,
      deliveryAddress: 'House #4-12, Old Bus Stand',
      city: 'Bhainsa',
      district: 'Nirmal District',
      state: 'Telangana',
      pincode: '504103',
      customerNotes: 'Deliver fresh morning batch',
      items: {
        create: [
          {
            productId: 'prod-sevaya-1',
            variantId: 'var-sevaya-1kg',
            productName: 'Traditional Wheat Sevaya',
            variantName: '1 kg (kg)',
            productNameSnapshot: 'Traditional Wheat Sevaya',
            variantNameSnapshot: '1 kg (kg)',
            weight: '1 kg',
            unit: 'kg',
            unitPrice: 100,
            quantity: 3,
            totalPrice: 300,
          },
        ],
      },
      payments: {
        create: {
          gateway: 'CASH_ON_DELIVERY',
          amount: 340,
          currency: 'INR',
          status: 'PENDING',
          paymentMethod: 'OFFLINE',
        },
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
