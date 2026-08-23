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
      name: 'Traditional Wheat Sevaya',
      slug: 'traditional-wheat-sevaya',
      category: 'Flours & Grains',
      description:
        'Pure, sun-dried traditional whole wheat sevaya (vermicelli) prepared with authentic grain milling techniques. Ideal for authentic sweet kheer, breakfast upma, and festive celebrations.',
      imageUrl: '/products/sevaya.svg',
      isFeatured: true,
      variants: [
        { weight: '1 kg', unit: 'kg', price: 100.0, stock: 150 },
        { weight: '2 kg', unit: 'kg', price: 200.0, stock: 80 },
        { weight: '5 kg', unit: 'kg', price: 500.0, stock: 40 },
      ],
    },
    {
      name: 'Urad Dal Papad',
      slug: 'urad-dal-papad',
      category: 'Papad',
      description:
        'Authentic round Urad Dal Papad crafted with traditional rolling techniques, black pepper, and premium asafoetida (hing). Sun-cured for signature crunch and flavor.',
      imageUrl: '/products/urad-dal-papad.svg',
      isFeatured: true,
      variants: [
        { weight: '500 g', unit: '500g', price: 150.0, stock: 200 },
        { weight: '1 kg', unit: 'kg', price: 300.0, stock: 120 },
      ],
    },
    {
      name: 'Moong Dal Papad',
      slug: 'moong-dal-papad',
      category: 'Papad',
      description:
        'Light, aromatic Moong Dal Papad made from high-grade split yellow mung bean flour. Exceptionally crunchy, gentle on digestion, and seasoned with subtle Indian spices.',
      imageUrl: '/products/moong-dal-papad.svg',
      isFeatured: true,
      variants: [
        { weight: '500 g', unit: '500g', price: 150.0, stock: 180 },
        { weight: '1 kg', unit: 'kg', price: 300.0, stock: 100 },
      ],
    },
    {
      name: 'Masala Papad',
      slug: 'masala-papad',
      category: 'Papad',
      description:
        'Bold and zesty Indian papad loaded with crushed cumin, cracked black peppercorns, red chili flakes, and traditional digestive spices.',
      imageUrl: '/products/masala-papad.svg',
      isFeatured: true,
      variants: [
        { weight: '500 g', unit: '500g', price: 150.0, stock: 150 },
        { weight: '1 kg', unit: 'kg', price: 300.0, stock: 90 },
      ],
    },
    {
      name: 'Rice Papad',
      slug: 'rice-papad',
      category: 'Papad',
      description:
        'Traditional steamed and sun-dried rice flour papad with a delicate, melt-in-mouth crispiness. Seasoned with cumin and rock salt.',
      imageUrl: '/products/rice-papad.svg',
      isFeatured: false,
      variants: [
        { weight: '500 g', unit: '500g', price: 150.0, stock: 100 },
        { weight: '1 kg', unit: 'kg', price: 300.0, stock: 60 },
      ],
    },
    {
      name: 'Pure Turmeric Powder',
      slug: 'pure-turmeric-powder',
      category: 'Spices',
      description:
        '100% pure, natural, golden-yellow turmeric (haldi) powder with high curcumin content. Stone-ground from quality farm turmeric roots without fillers or artificial additives.',
      imageUrl: '/products/turmeric-haldi-powder.svg',
      isFeatured: true,
      variants: [
        { weight: '500 g', unit: '500g', price: 80.0, stock: 250 },
        { weight: '1 kg', unit: 'kg', price: 150.0, stock: 150 },
      ],
    },
    {
      name: 'Maggie',
      slug: 'maggie',
      category: 'Noodles & Instant Foods',
      description:
        'Classic Indian-spiced instant noodle packs with rich masala seasoning for quick family snacking. Price configurable by administration.',
      imageUrl: '/products/maggie.svg',
      isFeatured: false,
      variants: [
        { weight: '420g Pack', unit: 'pack', price: 85.0, stock: 200 },
        { weight: '840g Pack', unit: 'pack', price: 165.0, stock: 100 },
      ],
    },
    {
      name: 'Noodles',
      slug: 'noodles',
      category: 'Noodles & Instant Foods',
      description:
        'High-protein wheat noodles crafted for Indian-style Hakka and stir-fry preparations. Firm texture and zero chemical preservatives.',
      imageUrl: '/products/noodles.svg',
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

  console.log('✅ Annapurna Aahaar database seeded with verified catalog and Bhainsa business data!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
