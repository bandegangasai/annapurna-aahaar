import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log('🌾 Starting Annapurna Aahaar Database Seeding...');

  // 1. Seed Admin User
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@annapurnaaahaar.in';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@Annapurna2026';
  const adminName = process.env.ADMIN_NAME || 'Annapurna Admin';

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

  // 3. Seed Products and Variants
  const productsData = [
    {
      name: 'Traditional Wheat Sevaya',
      slug: 'traditional-wheat-sevaya',
      category: 'Flours & Grains',
      description:
        'Pure, sun-dried traditional wheat sevaya (vermicelli) prepared from premium whole wheat grains. Ideal for authentic sweet kheer, savory breakfast upma, and festive Indian desserts.',
      imageUrl: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80',
      rating: 4.9,
      isFeatured: true,
      variants: [
        { weight: '1 kg', unit: 'kg', price: 100.0, stock: 150 },
        { weight: '2 kg', unit: 'kg', price: 200.0, stock: 80 },
        { weight: '5 kg', unit: 'kg', price: 480.0, stock: 40 },
      ],
    },
    {
      name: 'Authentic Urad Dal Papad',
      slug: 'urad-dal-papad',
      category: 'Papad',
      description:
        'Crispy, sun-dried authentic Urad Dal Papad crafted with traditional rolling techniques, black pepper, and premium asafoetida (hing). Expands into crunchy perfection when roasted or fried.',
      imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
      rating: 5.0,
      isFeatured: true,
      variants: [
        { weight: '500g', unit: '500g', price: 150.0, stock: 200 },
        { weight: '1 kg', unit: 'kg', price: 300.0, stock: 120 },
        { weight: '2 kg', unit: 'kg', price: 580.0, stock: 50 },
      ],
    },
    {
      name: 'Special Moong Dal Papad',
      slug: 'moong-dal-papad',
      category: 'Papad',
      description:
        'Light, aromatic Moong Dal Papad made from high-grade split yellow mung bean flour. Exceptionally crunchy, gentle on the stomach, and infused with traditional spices.',
      imageUrl: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80',
      rating: 4.8,
      isFeatured: true,
      variants: [
        { weight: '500g', unit: '500g', price: 150.0, stock: 180 },
        { weight: '1 kg', unit: 'kg', price: 300.0, stock: 100 },
      ],
    },
    {
      name: 'Spicy Masala Papad',
      slug: 'masala-papad',
      category: 'Papad',
      description:
        'Bold and zesty Indian papad loaded with crushed cumin, cracked black peppercorns, red chili flakes, and digestive spices. The ultimate accompaniment for Indian meals.',
      imageUrl: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=800&q=80',
      rating: 4.9,
      isFeatured: true,
      variants: [
        { weight: '500g', unit: '500g', price: 150.0, stock: 150 },
        { weight: '1 kg', unit: 'kg', price: 300.0, stock: 90 },
      ],
    },
    {
      name: 'Crispy Rice Papad (Chawal Papad)',
      slug: 'rice-papad',
      category: 'Papad',
      description:
        'Delicate, steamed and sun-dried rice flour papad with a delightful melt-in-the-mouth texture. Seasoned with cumin and salt for traditional taste.',
      imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
      rating: 4.7,
      isFeatured: false,
      variants: [
        { weight: '500g', unit: '500g', price: 150.0, stock: 100 },
        { weight: '1 kg', unit: 'kg', price: 300.0, stock: 60 },
      ],
    },
    {
      name: 'Pure Golden Turmeric Powder (Haldi)',
      slug: 'pure-turmeric-powder',
      category: 'Spices',
      description:
        '100% natural, farm-sourced turmeric powder with rich curcumin potency. Cleanly washed, sun-cured, and slowly ground to preserve essential oils, vibrant color, and therapeutic benefits.',
      imageUrl: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80',
      rating: 5.0,
      isFeatured: true,
      variants: [
        { weight: '500g', unit: '500g', price: 80.0, stock: 250 },
        { weight: '1 kg', unit: 'kg', price: 150.0, stock: 150 },
        { weight: '2 kg', unit: 'kg', price: 290.0, stock: 80 },
      ],
    },
    {
      name: 'Maggie Masala Instant Noodles',
      slug: 'maggie-masala-noodles',
      category: 'Noodles',
      description:
        'Beloved Indian spiced instant noodles with rich masala spice blend. Convenient family pack for quick, comforting, and tasty snacking.',
      imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80',
      rating: 4.8,
      isFeatured: false,
      variants: [
        { weight: '420g Pack', unit: 'pack', price: 85.0, stock: 200 },
        { weight: '840g Twin Pack', unit: 'pack', price: 165.0, stock: 100 },
      ],
    },
    {
      name: 'Authentic Desi Wheat Noodles',
      slug: 'authentic-desi-noodles',
      category: 'Noodles',
      description:
        'Premium high-protein wheat noodles crafted for Indian-style Hakka and stir-fry preparations. Firm texture, non-sticky, with zero chemical preservatives.',
      imageUrl: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=800&q=80',
      rating: 4.7,
      isFeatured: false,
      variants: [
        { weight: '500g Pack', unit: 'pack', price: 95.0, stock: 140 },
        { weight: '1 kg Pack', unit: 'pack', price: 180.0, stock: 75 },
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
    console.log(`🌾 Created product: ${createdProduct.name} (${createdProduct.variants.length} variants)`);
  }

  // 4. Seed initial sample contact message
  await prisma.contactMessage.create({
    data: {
      name: 'Rajesh Sharma',
      phone: '9876543210',
      email: 'rajesh.sharma@example.com',
      subject: 'Wholesale & Bulk Papad Enquiry',
      message: 'Hello Annapurna Aahaar, I would like to inquire about bulk ordering for 50kg Urad Dal Papad for an upcoming wedding in Delhi.',
    },
  });

  console.log('✅ Seed complete! Annapurna Aahaar database is ready.');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
