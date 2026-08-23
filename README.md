# 🌾 Annapurna Aahaar — Multilingual IVR, Telephone Ordering, E-Commerce & Admin Suite

> **"Tradition in Every Grain."**  
> *Authentic Indian Taste from Bhainsa, Nirmal District, Telangana (504103)*

Annapurna Aahaar is a production-grade, culturally authentic e-commerce and automated telephony platform crafted for **Bande Omkar** in **Bhainsa, Nirmal District, Telangana (504103)**. Customers can order online via desktop/mobile or dial our **24/7 Telephone IVR Hotline (`9347036152`)** in 4 Indian languages.

---

## 🏛️ Verified Business & Telephony Profile

| Attribute | Details |
| :--- | :--- |
| **Business Name** | **Annapurna Aahaar** |
| **Tagline** | *"Tradition in Every Grain."* |
| **Proprietor / Owner** | **Bande Omkar** |
| **Location** | **Bhainsa, Nirmal District, Telangana — 504103** |
| **Dedicated IVR Hotline** | **`9347036152`** (24/7 Multilingual Automated Voice Ordering) |
| **Kitchen Helplines** | `+91 6305970844`, `+91 8688456925` |
| **Business Payment Mobile** | `9542826358` |
| **Business UPI ID** | `9542826358@ybl` (India Post Payment Bank - 3676) |
| **Business Email** | `annapurnaaahaar@gmail.com` |
| **Admin Portal** | `https://bandegangasai.github.io/annapurna-aahaar/#/admin/dashboard` |

---

## 📞 24/7 Multilingual IVR Telephony Engine

Customers who cannot comfortably use the website can place, track, or manage orders by phone by calling **`9347036152`**.

### Supported Languages:
1. **English**: Clear, concise natural voice prompts.
2. **मराठी (Marathi)**: Authentic regional Marathi voice prompts.
3. **हिंदी (Hindi)**: Natural conversational Hindi pronunciation.
4. **తెలుగు (Telugu)**: Regional Telugu voice prompts.

### Call Flow & DTMF Keypad Actions:
```
Caller Dials 9347036152
       ↓
Language Menu:
  [1] English  [2] मराठी  [3] हिंदी  [4] తెలుగు
       ↓
Main Voice Menu:
  [1] Place / Confirm Order
      → Dynamic Product Selection (1-8)
      → Dynamic Variant Weight Selection
      → Voice Order Summary Read-back
      → Confirm (1) / Change (2) / Cancel (3)
      → Atomic Order creation in PostgreSQL (orderSource: 'IVR')
      → Real-Time SSE alert to Admin Dashboard & SMS/Email Dispatch
  [2] Track Live Order Status
      → Caller ID lookup → Live database status speech
  [3] Cancel Order
      → Cancellation Rule evaluation → Confirmation → Cancel update
  [4] Human Customer Support
      → Transfer to Agent (6305970844 / 8688456925)
  [9] Repeat Menu
```

---

## 🏗️ Unified Database & Real-Time Architecture

Website orders and Telephone IVR orders flow into the **same single source of truth PostgreSQL database** with real-time Server-Sent Events (SSE) updates to the Admin Dashboard.

```
                   ┌──────────────────────────────────────┐
                   │    CUSTOMER CHANNELS (WEB / PHONE)   │
                   └──────────────────┬───────────────────┘
                                      │
              ┌───────────────────────┴───────────────────────┐
              ▼                                               ▼
   [ Website Checkout ]                            [ Customer Dials 9347036152 ]
   • Online / COD / UPI                            • IVR Webhook (/api/ivr/incoming)
              │                                               │
              └───────────────────────┬───────────────────────┘
                                      │
                                      ▼
                   ┌──────────────────────────────────────┐
                   │       CENTRAL BACKEND ON RENDER      │
                   │ • Dynamic Pricing Engine             │
                   │ • TwiML/VoiceXML Generator           │
                   │ • Gmail SMTP & SMS Dispatcher        │
                   │ • SSE Real-Time Broadcaster          │
                   └──────────────────┬───────────────────┘
                                      │
                                      ▼
                   ┌──────────────────────────────────────┐
                   │       POSTGRESQL (PRISMA ORM)        │
                   │ • Orders (WEBSITE / IVR)             │
                   │ • Calls & IvrInteractions (DTMF)     │
                   │ • Payments & Frozen Snapshots        │
                   └──────────────────────────────────────┘
```

---

## ⚙️ Telephony & Webhook Deployment

### Public Webhook Endpoints:
* **Incoming Call Webhook**: `https://annapurna-aahaar-1.onrender.com/api/ivr/incoming`
* **Language Selection**: `https://annapurna-aahaar-1.onrender.com/api/ivr/select-language`
* **Main Menu**: `https://annapurna-aahaar-1.onrender.com/api/ivr/main-menu`
* **Product Menu**: `https://annapurna-aahaar-1.onrender.com/api/ivr/order/select-product`
* **Variant Menu**: `https://annapurna-aahaar-1.onrender.com/api/ivr/order/select-variant`
* **Order Confirmation**: `https://annapurna-aahaar-1.onrender.com/api/ivr/order/confirm`
* **Cancel Confirmation**: `https://annapurna-aahaar-1.onrender.com/api/ivr/cancel-confirm`
* **Status Callback**: `https://annapurna-aahaar-1.onrender.com/api/ivr/status-callback`

### Telephony Provider Setup (Twilio / Exotel / Plivo):
In your telecom provider console for number **`9347036152`**, configure the incoming voice webhook URL to:
```
https://annapurna-aahaar-1.onrender.com/api/ivr/incoming (HTTP POST)
```

---

## 📊 Admin Dashboard Features (`/#/admin/dashboard`)

1. **Live Orders Stream**:
   - Visual badges for `orderSource` (🌐 `WEBSITE` vs 📞 `IVR`) and `language` (`ENGLISH`, `MARATHI`, `HINDI`, `TELUGU`).
   - One-click Accept, Reject, Process, and Dispatch controls.
2. **Call Center Suite (`/admin/call-center`)**:
   - KPIs: Total Calls, Today's Calls, Completed, Missed, IVR Orders, Average Duration.
   - Multilingual distribution metrics across English, Marathi, Hindi, Telugu.
   - Call logs table with Caller ID, Duration, Menu Option, and DTMF interaction drilldown.
3. **Payment Verification**:
   - Manual UPI verification queue for direct transfers to `9542826358@ybl`.
4. **Sales & Analytics**:
   - Breakdown by channel: Website Sales vs. IVR Sales vs. Phone Sales.
   - Breakdown by payment mode: Online vs. COD vs. Manual UPI.
5. **CSV Exports**:
   - Orders CSV, Sales CSV, Payments CSV, Call Records CSV, and IVR Interactions CSV.

---

## 🧪 Automated Test Suites

```bash
# Run website e-commerce and checkout test suite
cd backend
npm run test:e2e

# Run multilingual IVR telephony test suite
npm run test:ivr:e2e
```

---

## 🌐 Live Production Links

* 🛍️ **Storefront**: [**https://bandegangasai.github.io/annapurna-aahaar/**](https://bandegangasai.github.io/annapurna-aahaar/)
* 📦 **Live Customer Tracking**: [**https://bandegangasai.github.io/annapurna-aahaar/#/track**](https://bandegangasai.github.io/annapurna-aahaar/#/track)
* 🔐 **Admin Management Portal**: [**https://bandegangasai.github.io/annapurna-aahaar/#/admin/dashboard**](https://bandegangasai.github.io/annapurna-aahaar/#/admin/dashboard)
  * **Email**: `admin@annapurnaaahaar.in`
  * **Password**: `Admin@Annapurna2026`
* ☁️ **Backend API**: [**https://annapurna-aahaar-1.onrender.com**](https://annapurna-aahaar-1.onrender.com)
* 🐙 **GitHub Repository**: [**https://github.com/bandegangasai/annapurna-aahaar**](https://github.com/bandegangasai/annapurna-aahaar)
