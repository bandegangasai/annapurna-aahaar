# 🌾 Annapurna Aahaar — Full-Stack 3D E-Commerce Platform

> **"Tradition in Every Grain."**  
> *Pure Ingredients. Authentic Indian Taste.*

Annapurna Aahaar is a production-grade, culturally authentic full-stack 3D Indian food e-commerce platform crafted for **Bande Omkar** in **Bhainsa, Nirmal District, Telangana (504103)**.

---

## 🏛️ Verified Business Information

| Attribute | Details |
| :--- | :--- |
| **Business Name** | **Annapurna Aahaar** |
| **Tagline** | *"Tradition in Every Grain."* |
| **Proprietor / Owner** | **Bande Omkar** |
| **Location** | **Bhainsa, Nirmal District, Telangana — 504103** |
| **Phone Lines** | `+91 6305970844`, `+91 8688456925` |
| **Email** | `annapurnaaahaar@gmail.com` |
| **Preferred Domain** | `annapurnaaahaar.in` |

---

## 🚀 Key Highlights & Architectural Features

### 1. Indian Cultural Visual Language & 3D Experience
- **Color Palette**: Deep Royal Maroon (`#4A0E17`), Antique Gold (`#C89B3C`), Warm Sandalwood Cream (`#FAF6EE`), and Terracotta (`#9A3412`).
- **Interactive 3D Hero Scene**: Traditional stone mill (Chakki) with rotating grindstone, grain hopper, and orbiting spice/wheat particles powered by Three.js & React Three Fiber (with automatic 2D animated fallback).
- **Exact Product Photography**: Dedicated, authentic vector assets in `/products/` for all 8 products (Sevaya, Urad Dal Papad, Moong Dal Papad, Masala Papad, Rice Papad, Pure Golden Turmeric, Maggie, and Desi Noodles) — **zero unrelated stock food (no broccoli, no samosas)**.
- **Zero Fabricated Claims**: No fake review stars, no fake establishment dates ("since 19xx"), no fabricated awards.

### 2. Verified Product Catalog & Dynamic Pricing
- **Traditional Wheat Sevaya** (`Flours & Grains`): 1 kg (₹100), 2 kg (₹200), 5 kg (₹500).
- **Handcrafted Papads** (`Papad`):
  - Urad Dal Papad: 500 g (₹150), 1 kg (₹300)
  - Moong Dal Papad: 500 g (₹150), 1 kg (₹300)
  - Masala Papad: 500 g (₹150), 1 kg (₹300)
  - Rice Papad: 500 g (₹150), 1 kg (₹300)
- **Pure Turmeric Powder** (`Spices`): 500 g (₹80), 1 kg (₹150).
- **Noodles & Instant Foods**: Maggie & Desi Noodles (Admin configurable).

### 3. Dual Payment Infrastructure (Online + Offline)
- **Online Payments (Razorpay)**:
  - Backend order creation (`POST /api/orders`)
  - Server-side cryptographic HMAC SHA256 signature verification (`POST /api/orders/razorpay-verify`)
  - Seamless frontend modal and sandbox simulation.
- **Cash on Delivery (Pay Offline)**:
  - Stored with `paymentMethod = "OFFLINE_COD"`, `paymentStatus = "PENDING"`.
  - Admin can update payment status (`PAID` / `PENDING`) directly from the dashboard.

### 4. Real-Time Order Tracking & Admin Fulfillment Center
- **Customer Live Timeline**: 6-step progress bar (`PENDING` ➔ `ACCEPTED` ➔ `PROCESSING` ➔ `READY` ➔ `OUT FOR DELIVERY` ➔ `DELIVERED` or `REJECTED`) with real-time auto-polling.
- **Admin Center (`/admin/login`)**:
  - Prominent **NEW ORDER ALERT** banner and badges
  - One-click **ACCEPT** & **REJECT** actions
  - Dynamic product price and inventory editor
  - Customer contact enquiries reader.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Three.js, `@react-three/fiber`, `@react-three/drei`, Framer Motion, Lucide Icons.
- **Backend**: Node.js, Express.js, TypeScript, Prisma ORM, Zod, JWT, bcryptjs, crypto.
- **Database**: SQLite (local development zero-config) / PostgreSQL (production).
- **Payments**: Razorpay SDK / API integration.
- **SEO**: JSON-LD Structured Data (`LocalBusiness` & `Organization`), Canonical URLs, Open Graph, `sitemap.xml`, `robots.txt`.

---

## 🏃 Local Setup & Development

### 1. Clone & Install Dependencies
```bash
# In backend
cd backend
npm install
npm run prisma:generate
npm run prisma:push
npm run prisma:seed

# In frontend
cd ../frontend
npm install
```

### 2. Run Development Servers
```bash
# Terminal 1: Backend API (port 5000)
cd backend
npm run dev

# Terminal 2: Frontend Client (port 5173)
cd frontend
npm run dev
```

### 3. Run Automated End-to-End Test Suite
```bash
cd backend
npm run test:e2e
```

---

## 🔐 Credentials & Default Logins

- **Admin Login URL**: `http://localhost:5173/admin/login`
- **Admin Email**: `admin@annapurnaaahaar.in`
- **Admin Password**: `Admin@Annapurna2026`

---

## 🌐 Production Deployment Guide

### Frontend (Vercel)
1. Import repository on [Vercel](https://vercel.com).
2. Set Root Directory to `frontend`.
3. Configure Environment Variables:
   - `VITE_API_URL`: URL of deployed backend (e.g. `https://api.annapurnaaahaar.in/api`).
4. Add custom domain `annapurnaaahaar.in` with CNAME `cname.vercel-dns.com`.

### Backend (Render / Railway)
1. Deploy `backend` as a Web Service.
2. Build Command: `npm install && npm run prisma:generate && npm run build`
3. Start Command: `npm start`
4. Set Environment Variables:
   - `DATABASE_URL`: Production PostgreSQL connection string (Neon / Supabase / Render Postgres).
   - `JWT_SECRET`: Secure production secret key.
   - `RAZORPAY_KEY_ID`: Production Razorpay Key ID.
   - `RAZORPAY_KEY_SECRET`: Production Razorpay Key Secret.
   - `CLIENT_URL`: `https://annapurnaaahaar.in`
