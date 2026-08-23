# 🌾 ANNAPURNA AAHAAR (अन्नपूर्णा आहार)
### *Tradition in Every Grain.*
**Handcrafted Indian Heritage Food Products & Multilingual Voice Telephony Platform**

[![Live Storefront](https://img.shields.io/badge/🌐_Live_Storefront-Visit_Website-173F35?style=for-the-badge&logo=google-chrome&logoColor=C79A45)](https://bandegangasai.github.io/annapurna-aahaar/)
[![Live Backend API](https://img.shields.io/badge/☁️_Render_Backend-Online-0C241E?style=for-the-badge&logo=render&logoColor=white)](https://annapurna-aahaar-1.onrender.com/health/detailed)
[![24/7 Voice IVR Hotline](https://img.shields.io/badge/📞_24%2F7_Voice_IVR-9347036152-C79A45?style=for-the-badge&logo=phone&logoColor=173F35)](tel:9347036152)
[![License: MIT](https://img.shields.io/badge/License-MIT-A65332?style=for-the-badge)](LICENSE)

---

## 🌟 LIVE APPLICATION LINKS

> ### 🚀 **Official Production Web Application:**
> ### 👉 **[https://bandegangasai.github.io/annapurna-aahaar/](https://bandegangasai.github.io/annapurna-aahaar/)** 👈

| Destination | Direct Production URL |
| :--- | :--- |
| 🛍️ **Storefront & 3D Experience** | [https://bandegangasai.github.io/annapurna-aahaar/](https://bandegangasai.github.io/annapurna-aahaar/) |
| 📦 **Live Real-Time Order Tracking** | [https://bandegangasai.github.io/annapurna-aahaar/#/track](https://bandegangasai.github.io/annapurna-aahaar/#/track) |
| 🔐 **Admin Management & Call Center** | [https://bandegangasai.github.io/annapurna-aahaar/#/admin/dashboard](https://bandegangasai.github.io/annapurna-aahaar/#/admin/dashboard) |
| 🩺 **Backend Health & System Telemetry** | [https://annapurna-aahaar-1.onrender.com/health/detailed](https://annapurna-aahaar-1.onrender.com/health/detailed) |
| 🐙 **GitHub Source Repository** | [https://github.com/bandegangasai/annapurna-aahaar](https://github.com/bandegangasai/annapurna-aahaar) |

---

## 🏛️ Business & Enterprise Profile

* **Business Name**: **Annapurna Aahaar**
* **Tagline**: *"Tradition in Every Grain."*
* **Proprietor & Founder**: **Bande Omkar**
* **Registered Location**: **Bhainsa, Nirmal District, Telangana — 504103, India**
* **24/7 Dedicated IVR Telephone Hotline**: **`9347036152`** (`tel:9347036152`)
* **Official Payment Mobile & UPI ID**: **`9542836358`** &nbsp;|&nbsp; **`9542836358@ybl`** (India Post Payment Bank - 3676)
* **Kitchen Helplines**: `+91 6305970844` / `+91 8688456925`
* **Official Email**: `annapurnaaahaar@gmail.com`
* **Admin Login**: `admin@annapurnaaahaar.in` / `Admin@Annapurna2026`

---

## 💎 Key Highlights & Architectural Features

### 1. 🎨 Premium Indian Heritage Brand Design (60-30-10 Rule)
* **Color System**:
  * **Deep Forest Green (`#173F35`)** — 25% primary brand identity and structural elegance.
  * **Warm Ivory (`#F8F3E7`)** — 60% warm, authentic traditional canvas.
  * **Antique Gold (`#C79A45`)** — 10% premium borders, medals, accents, and icons.
  * **Terracotta (`#A65332`)** — 5% Indian clay & earth contrast.
* **Typography**:
  * English / Headings: *Playfair Display* + *Inter*
  * Marathi / Hindi: *Noto Sans Devanagari*
  * Telugu: *Noto Sans Telugu*

### 2. 🌐 Full Multilingual Internationalization (4 Languages)
* Instant switcher at the top of every screen: **`[ 🌐 English ] [ मराठी ] [ हिन्दी ] [ తెలుగు ]`**.
* Zero language mixing: complete localization for Navbar, Hero banner, Catalog, Product Descriptions, Weight Selectors, Shopping Basket, Checkout Forms, Live Order Tracking, Success confirmations, and Contact Forms.
* Stored in `localStorage` for instant return-visit recognition.

### 3. ✨ 3D Interactive Heritage Scene (Three.js + WebGL)
* Lightweight interactive 3D composition with:
  * Traditional Indian Brass Thali base with raised rim.
  * Authentic Stone Milling Chakki (dark terracotta & forest stone).
  * Central brass grain hopper and wooden turning handle (*hatha*).
  * Glowing Golden Turmeric / Grain essence sphere with gentle distortion.
  * Handcrafted sun-cured floating papad disk.
  * Floating golden spice particles.
* **Performance Safeguards**: Pauses on off-screen scroll via `IntersectionObserver`, supports `prefers-reduced-motion`, and provides crisp 2D fallback for non-WebGL devices.

### 4. 📞 Production 24/7 Telephone Voice IVR (`9347036152`)
* Customers who cannot comfortably navigate a website can dial **`9347036152`** from any basic phone or smartphone.
* **Strict State Machine**: Once language is chosen (`1` English, `2` Marathi, `3` Hindi, `4` Telugu), the entire call continues exclusively in that selected language.
* **Keypad (DTMF) Voice Options**:
  * `[1]` Order Placement & Quantity Selection
  * `[2]` Live Order Status Tracking
  * `[3]` Order Cancellation
  * `[4]` Connect to Kitchen Helpline (`6305970844`)
  * `[9]` Change Language
* **PostgreSQL Session Recovery**: Multi-step IVR state preserved across webhooks with resilient database persistence.

### 5. 💳 Robust Payment Architecture
* **Cash on Delivery (COD)**: Doorstep cash payment or delivery QR scan.
* **Direct UPI Transfer**: Integrated 1-click copy for UPI ID (`9542836358@ybl`) and Mobile (`9542836358`), mobile deep links (`upi://pay`), and 12-digit UTR validation.
* **Online Gateway**: Razorpay integration for UPI, NetBanking, Debit/Credit Cards.

### 6. 📊 Real-Time Admin Portal & Call Center Dashboard
* Real-time live order stream with source badges (🌐 `WEBSITE` vs 📞 `IVR`).
* One-click order lifecycle progression: `PENDING` ➔ `ACCEPTED` ➔ `PROCESSING` ➔ `READY` ➔ `OUT_FOR_DELIVERY` ➔ `DELIVERED` (or `REJECTED`).
* Dedicated Call Center tab with total calls, language distribution breakdown, and detailed DTMF interaction logs.
* System Health monitor tracking database connection, IVR webhooks, payment config, and telephony uptime.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend UI** | React 18, TypeScript, Vite 6, Tailwind CSS 3, Framer Motion, Lucide Icons |
| **3D Rendering** | Three.js, React Three Fiber (`@react-three/fiber`), Drei (`@react-three/drei`) |
| **Backend API** | Node.js, Express, TypeScript, Zod Schema Validation |
| **Database & ORM** | PostgreSQL, Prisma ORM 5 |
| **Telephony & Voice** | TwiML XML Generator, AWS Polly TTS (Voices: *Aditi*, *Chitra*, *Kajal*), Webhooks |
| **Testing** | Automated End-to-End Suite (`test:e2e`), Production IVR Test Battery (`test:ivr:e2e`) |
| **Deployment** | GitHub Pages (Frontend), Render (Backend), GitHub Actions / Workflows |

---

## 📂 Project Structure

```
annapurna-aahaar/
├── frontend/                     # React + Vite + Three.js Storefront
│   ├── public/                   # Static assets, robots.txt, sitemap.xml
│   │   ├── images/               # Authentic photography & logos
│   │   ├── products/             # Verified product catalog images
│   │   ├── robots.txt            # Search engine indexing directives
│   │   └── sitemap.xml           # Canonical XML sitemap
│   ├── src/
│   │   ├── components/
│   │   │   ├── 3d/               # HeroScene.tsx (Three.js Heritage 3D Composition)
│   │   │   ├── cart/             # CartDrawer.tsx (Slide-out shopping basket)
│   │   │   ├── common/           # Navbar.tsx, Footer.tsx, SEOHead.tsx
│   │   │   ├── ivr/              # IvrCallModal.tsx (Interactive Voice Simulator)
│   │   │   └── product/          # ProductCard3D.tsx (Interactive product card)
│   │   ├── context/
│   │   │   ├── AuthContext.tsx   # Admin session authentication
│   │   │   ├── CartContext.tsx   # Persistent shopping cart state
│   │   │   ├── LanguageContext.tsx # 4-Language i18n Dictionary & Switcher
│   │   │   └── ToastContext.tsx  # Notification system
│   │   ├── pages/                # Home, Products, ProductDetail, Cart, Checkout, OrderSuccess, OrderTrack, OurStory, WhyUs, Contact, AdminLogin, AdminDashboard
│   │   ├── services/api.ts       # Unified API client & offline fallback cache
│   │   └── utils/formatters.ts   # Currency (INR ₹), DateTime, and image URLs
│   ├── index.html                # Google Fonts preloads, SEO, Schema.org LocalBusiness JSON-LD
│   └── tailwind.config.js        # Forest Green, Antique Gold, Warm Ivory, Terracotta palette
│
├── backend/                      # Express REST API & IVR Service
│   ├── prisma/
│   │   ├── schema.prisma         # Database schema (Orders, Customer, Products, Calls, IvrSession, Payments)
│   │   └── seed.ts               # Production seed (Products, Variants, Admin User)
│   ├── src/
│   │   ├── config/               # Prisma client, Environment variables
│   │   ├── controllers/          # orderController, paymentController, ivrController, adminController
│   │   ├── routes/               # ivrRoutes, orderRoutes, productRoutes, healthRoutes, adminRoutes
│   │   ├── services/             # ivrStateMachine, promptService, notificationService, razorpay
│   │   ├── test-e2e.ts           # Full-stack e-commerce automated test suite
│   │   ├── test-ivr-e2e.ts       # Multilingual IVR state machine test battery
│   │   └── server.ts             # Express entry point
│   └── tsconfig.json
│
└── README.md                     # Documentation & live production guide
```

---

## ⚡ Local Development & Setup

### Prerequisites
* Node.js v18+ & npm
* PostgreSQL database instance (or Supabase / Neon / Local Postgres)

### 1. Backend Setup
```bash
cd backend
npm install

# Configure environment variables in .env
cp .env.example .env

# Generate Prisma Client & Push Database Schema
npm run prisma:generate
npm run prisma:push

# Seed Products, Variants, and Default Admin
npm run prisma:seed

# Start Development Server (Port 5000)
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
# Run End-to-End E-Commerce & Checkout Suite
cd backend
npm run test:e2e

# Run Multilingual IVR Telephony State Machine Battery
npm run test:ivr:e2e
```

---

## 📞 Telephony Webhook Configuration

For telecom providers (Twilio / Exotel / Plivo / Knowlarity) configured with business phone number **`9347036152`**:

* **Incoming Call Voice Webhook (POST)**: `https://annapurna-aahaar-1.onrender.com/api/ivr/webhook`
* **Status Callback (POST)**: `https://annapurna-aahaar-1.onrender.com/api/ivr/status-callback`

---

## 📄 License & Ownership

© 2026 **Annapurna Aahaar**. All rights reserved.  
Founded & Managed by **Bande Omkar** in **Bhainsa, Nirmal District, Telangana (504103)**.
