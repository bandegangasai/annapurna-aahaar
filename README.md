# 🌾 ANNAPURNA AAHAAR (अन्नपूर्णा आहार)
### *Tradition in Every Grain.*
**Handcrafted Indian Heritage Food Products & Multilingual E-Commerce Platform**

[![Live Storefront](https://img.shields.io/badge/🌐_Live_Storefront-Visit_Website-173F35?style=for-the-badge&logo=google-chrome&logoColor=C79A45)](https://bandegangasai.github.io/annapurna-aahaar/)
[![Multilingual Support](https://img.shields.io/badge/🎙️_Multilingual_Support-4_Languages-C79A45?style=for-the-badge&logo=translate&logoColor=173F35)](#-key-highlights--architectural-features)
[![License: MIT](https://img.shields.io/badge/License-MIT-A65332?style=for-the-badge)](LICENSE)

---

## 🌟 LIVE APPLICATION LINK

> ### 🚀 **Official Production Web Application:**
> ### 👉 **[https://bandegangasai.github.io/annapurna-aahaar/](https://bandegangasai.github.io/annapurna-aahaar/)** 👈

| Destination | Access URL |
| :--- | :--- |
| 🛍️ **Storefront & Interactive Experience** | [https://bandegangasai.github.io/annapurna-aahaar/](https://bandegangasai.github.io/annapurna-aahaar/) |
| 📦 **Real-Time Order Tracking** | [https://bandegangasai.github.io/annapurna-aahaar/#/track](https://bandegangasai.github.io/annapurna-aahaar/#/track) |
| 🐙 **GitHub Source Repository** | [https://github.com/bandegangasai/annapurna-aahaar](https://github.com/bandegangasai/annapurna-aahaar) |

---

## 🏛️ Brand & Product Overview

* **Brand Name**: **Annapurna Aahaar**
* **Tagline**: *"Tradition in Every Grain."*
* **Origin**: **Bhainsa, Nirmal District, Telangana (504103), India**
* **Core Offerings**: Handcrafted sun-cured papads, stone-ground pure turmeric powder, whole-wheat sevaya, and traditional Indian staples.
* **Customer Channels**: Web store checkout, live order tracking, and integrated phone ordering support.

---

## 💎 Key Highlights & Architectural Features

### 1. 🎨 Premium Indian Heritage Brand Design (60-30-10 Rule)
* **Color System**:
  * **Deep Forest Green (`#173F35`)** — Primary brand identity and structural elegance.
  * **Warm Ivory (`#F8F3E7`)** — Authentic, traditional background canvas.
  * **Antique Gold (`#C79A45`)** — Premium borders, medals, accents, and buttons.
  * **Terracotta (`#A65332`)** — Indian clay & earth contrast tones.
* **Typography**:
  * English / Headings: *Playfair Display* + *Inter*
  * Marathi / Hindi: *Noto Sans Devanagari*
  * Telugu: *Noto Sans Telugu*

### 2. 🌐 Full Multilingual Internationalization (4 Languages)
* Instant language switcher available across the app: **`[ 🌐 English ] [ मराठी ] [ हिन्दी ] [ తెలుగు ]`**.
* Complete localization for Navbar, Hero section, Catalog, Product Descriptions, Weight Selectors, Shopping Basket, Checkout Forms, Live Order Tracking, Success receipts, and Contact Forms.
* Persisted in `localStorage` for return-visitor preference retention.

### 3. ✨ 3D Interactive Heritage Hero Showcase
* Smooth 3D perspective depth physics with dynamic mouse-tracking parallax (`rotateX`, `rotateY`, `scale3d`).
* Ultra-crisp culinary composition showcasing handcrafted papads, brass vessels with golden turmeric, whole wheat vermicelli, raw grains, and aromatic Indian spices.
* Floating 3D heritage badges with responsive depth layers.

### 4. 📞 Multilingual Telephony & IVR Voice Engine
* Multi-channel customer care support allowing automated telephone interaction in 4 regional languages (English, Marathi, Hindi, Telugu).
* Strict state machine architecture with multi-step session recovery.
* Automated options for direct order placement, live order status lookup, order cancellation, and kitchen support desk routing.

### 5. 💳 Multi-Mode Payment Architecture
* **Cash on Delivery (COD)**: Doorstep cash settlement or delivery QR scan.
* **Direct UPI Transfer**: Integrated 1-click UPI copy, mobile deep link support (`upi://pay`), and 12-digit transaction reference verification.
* **Online Payment Gateway**: Secure digital checkout with support for UPI, NetBanking, and Debit/Credit Cards.

### 6. 📊 Enterprise Management & Live Order Stream
* Real-time order stream with channel source identification (Web Store vs. Phone/IVR).
* Multi-step order lifecycle progression (`PENDING` ➔ `ACCEPTED` ➔ `PROCESSING` ➔ `READY` ➔ `OUT_FOR_DELIVERY` ➔ `DELIVERED`).
* Telephony analytics tracking call frequency, multilingual distribution, and interaction logs.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend UI** | React 18, TypeScript, Vite 6, Tailwind CSS 3, Framer Motion, Lucide Icons |
| **3D & Visuals** | Three.js, React Three Fiber, Framer Motion 3D Depth Physics |
| **Backend API** | Node.js, Express, TypeScript, Zod Validation |
| **Database & ORM** | PostgreSQL, Prisma ORM 5 |
| **Voice & Telephony** | TwiML XML Generator, AWS Polly TTS, Webhook Architecture |
| **Testing** | Automated End-to-End Test Suite (`test:e2e`), IVR State Machine Test Battery (`test:ivr:e2e`) |
| **Deployment** | GitHub Pages (Frontend), Cloud Backend Service (Render) |

---

## 📂 Project Structure

```
annapurna-aahaar/
├── frontend/                     # React + Vite + TypeScript Storefront
│   ├── public/                   # Static assets, robots.txt, sitemap.xml
│   │   ├── images/               # Authentic photography & brand graphics
│   │   ├── products/             # Product catalog images
│   │   ├── robots.txt            # Search engine indexing directives
│   │   └── sitemap.xml           # Canonical XML sitemap
│   ├── src/
│   │   ├── components/
│   │   │   ├── 3d/               # HeroScene.tsx (3D Interactive Perspective Hero)
│   │   │   ├── cart/             # CartDrawer.tsx (Slide-out basket)
│   │   │   ├── common/           # Navbar.tsx, Footer.tsx, SEOHead.tsx
│   │   │   ├── ivr/              # IvrCallModal.tsx (Voice ordering simulator)
│   │   │   └── product/          # ProductCard3D.tsx (Interactive product card)
│   │   ├── context/
│   │   │   ├── AuthContext.tsx   # Session authentication state
│   │   │   ├── CartContext.tsx   # Shopping cart state & persistence
│   │   │   ├── LanguageContext.tsx # 4-Language i18n Dictionary & Switcher
│   │   │   └── ToastContext.tsx  # Toast notification system
│   │   ├── pages/                # Home, Products, ProductDetail, Cart, Checkout, OrderSuccess, OrderTrack, OurStory, WhyUs, Contact, AdminLogin, AdminDashboard
│   │   ├── services/api.ts       # Unified API client & resilient offline fallback cache
│   │   └── utils/formatters.ts   # Currency (INR ₹), DateTime, and image helpers
│   ├── index.html                # Preloads, SEO meta tags, Schema.org LocalBusiness JSON-LD
│   └── tailwind.config.js        # Forest Green, Antique Gold, Warm Ivory, Terracotta palette
│
├── backend/                      # Express REST API & IVR Telephony Service
│   ├── prisma/
│   │   ├── schema.prisma         # Database schema (Orders, Customer, Products, Calls, IvrSession, Payments)
│   │   └── seed.ts               # Database seed (Products, Variants, Admin)
│   ├── src/
│   │   ├── config/               # Prisma client, Environment configuration
│   │   ├── controllers/          # orderController, paymentController, ivrController, adminController
│   │   ├── routes/               # ivrRoutes, orderRoutes, productRoutes, healthRoutes, adminRoutes
│   │   ├── services/             # ivrStateMachine, promptService, notificationService, razorpay
│   │   ├── test-e2e.ts           # E-Commerce automated test suite
│   │   ├── test-ivr-e2e.ts       # Multilingual IVR state machine test battery
│   │   └── server.ts             # Express entry point
│   └── tsconfig.json
│
└── README.md                     # Documentation & project guide
```

---

## ⚡ Local Development & Setup

### Prerequisites
* Node.js v18+ & npm
* PostgreSQL database instance (or SQLite / Local Postgres)

### 1. Backend Setup
```bash
cd backend
npm install

# Configure environment variables from template
cp .env.example .env

# Generate Prisma Client & Push Database Schema
npm run prisma:generate
npm run prisma:push

# Seed Products and Default Catalog
npm run prisma:seed

# Start Development Server
npm run dev
```

### 2. Frontend Setup
```bash
cd frontend
npm install

# Start Vite Development Server
npm run dev
```

### 3. Run Automated Tests
```bash
# Run End-to-End E-Commerce Suite
cd backend
npm run test:e2e

# Run Multilingual IVR Telephony Battery
npm run test:ivr:e2e
```

---

## 📄 License & Ownership

© 2026 **Annapurna Aahaar**. All rights reserved.  
Dedicated to authentic Indian culinary heritage from **Bhainsa, Nirmal District, Telangana (504103)**.
