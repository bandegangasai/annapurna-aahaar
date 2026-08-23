# 🌾 ANNAPURNA AAHAAR (अन्नपूर्णा आहार)
### *Tradition in Every Grain.*
**Handcrafted Indian Heritage Food Products & Multilingual E-Commerce Platform**

[![Live Storefront](https://img.shields.io/badge/🌐_Live_Storefront-Visit_Website-173F35?style=for-the-badge&logo=google-chrome&logoColor=C79A45)](https://bandegangasai.github.io/annapurna-aahaar/)
[![Canonical Domain](https://img.shields.io/badge/🌐_Target_Domain-annapurnaaahaar.in-C79A45?style=for-the-badge&logo=internet-explorer&logoColor=173F35)](https://annapurnaaahaar.in/)
[![Multilingual Support](https://img.shields.io/badge/🎙️_Multilingual_Support-4_Languages-C79A45?style=for-the-badge&logo=translate&logoColor=173F35)](#-key-highlights--architectural-features)
[![License: MIT](https://img.shields.io/badge/License-MIT-A65332?style=for-the-badge)](LICENSE)

---

## 🌟 LIVE APPLICATION ACCESS

> ### 🚀 **Official Production Web Application:**
> ### 👉 **[https://bandegangasai.github.io/annapurna-aahaar/](https://bandegangasai.github.io/annapurna-aahaar/)** 👈
> *(Target Canonical Domain: **[https://annapurnaaahaar.in/](https://annapurnaaahaar.in/)**)*

| Destination | Access URL |
| :--- | :--- |
| 🛍️ **Storefront & Interactive Experience** | [https://bandegangasai.github.io/annapurna-aahaar/](https://bandegangasai.github.io/annapurna-aahaar/) |
| 📦 **Real-Time Order Tracking** | [https://bandegangasai.github.io/annapurna-aahaar/#/track](https://bandegangasai.github.io/annapurna-aahaar/#/track) |
| 🗺️ **XML Sitemap** | [https://annapurnaaahaar.in/sitemap.xml](https://annapurnaaahaar.in/sitemap.xml) |
| 🤖 **Robots Directives** | [https://annapurnaaahaar.in/robots.txt](https://annapurnaaahaar.in/robots.txt) |
| 🐙 **GitHub Source Repository** | [https://github.com/bandegangasai/annapurna-aahaar](https://github.com/bandegangasai/annapurna-aahaar) |

---

## 🏛️ Brand & Product Overview

* **Brand Name**: **Annapurna Aahaar**
* **Tagline**: *"Tradition in Every Grain."*
* **Origin**: **Bhainsa, Nirmal District, Telangana (504103), India**
* **Core Offerings**: Handcrafted sun-cured papads, stone-ground pure turmeric powder, whole-wheat sevaya, and traditional Indian staples.
* **Customer Ordering Channels**: Web store checkout, live order tracking, and 24/7 multilingual telephone voice helpline (`9347036152`).

---

## 🔍 Google Search Discovery & SEO Configuration

The website is engineered for Google Search discoverability, Schema.org semantic crawling, and lightning-fast Core Web Vitals:

* **Official Title**: `Annapurna Aahaar | Traditional Indian Food Products`
* **Official Meta Description**: *"Annapurna Aahaar offers traditional Indian food products including sevaya, papad and turmeric powder from Bhainsa, Nirmal District, Telangana. Order online or call 9347036152."*
* **Target Canonical URL**: `https://annapurnaaahaar.in/`
* **Structured Data (JSON-LD)**:
  * `WebSite` Schema with alternate brand names: *Annapurna Aahaar Bhainsa*, *अन्नपूर्णा आहार*, *అన్నపూర్ణ ఆహార్*.
  * `LocalBusiness` / `Organization` Schema linked to Bhainsa, Nirmal, Telangana (504103).
  * `Product` & `Offer` Schema for all 8 authentic catalog items with exact database pricing in INR.
* **Pre-rendered Initial HTML**: Semantic server-like HTML container inside `#root` so search engine spiders index content immediately without relying solely on client JavaScript execution.

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

## 🌐 Custom Domain & Google Search Console Setup Guide

### Phase 1: Custom Domain (`annapurnaaahaar.in`) DNS Setup
When you purchase `annapurnaaahaar.in` from any domain registrar (e.g. GoDaddy, Namecheap, Hostinger):

1. **Add Apex `A` Records** (Pointing to GitHub Pages):
   ```
   Type: A  | Host: @ | Value: 185.199.108.153
   Type: A  | Host: @ | Value: 185.199.109.153
   Type: A  | Host: @ | Value: 185.199.110.153
   Type: A  | Host: @ | Value: 185.199.111.153
   ```
2. **Add `www` CNAME Record**:
   ```
   Type: CNAME | Host: www | Value: bandegangasai.github.io
   ```
3. **GitHub Pages Custom Domain**:
   - Go to GitHub Repository **Settings** ➔ **Pages** ➔ **Custom domain** ➔ Enter `annapurnaaahaar.in` ➔ Check **Enforce HTTPS**.

---

### Phase 2: Google Search Console Verification & Indexing
To enable customers to find **Annapurna Aahaar** directly on Google Search:

1. Go to **[Google Search Console](https://search.google.com/search-console)**.
2. Click **Add Property** ➔ Select **Domain** ➔ Enter `annapurnaaahaar.in`.
3. Copy the provided TXT record and add it to your DNS settings on your domain registrar to verify ownership.
4. Once verified, open **Sitemaps** in Google Search Console:
   - Enter `sitemap.xml` and click **Submit**.
5. Go to **URL Inspection**:
   - Paste `https://annapurnaaahaar.in/`
   - Click **Test Live URL** ➔ Click **Request Indexing**.
6. Googlebot will crawl the sitemap, index the structured data, and register *Annapurna Aahaar* in Google Search results.

---

## ⚡ Local Development & Setup

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
