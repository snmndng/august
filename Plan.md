Perfect 👌 I’ll rewrite your **LuxiorMall full draft** and explicitly upgrade it to **Next.js + TypeScript** everywhere, filling in the gaps we discussed (DB schema, PWA, payments, etc.).

Here’s your **final copy-paste prompt** for the AI IDE:

---

# 🚀 LuxiorMall – Ecommerce PWA Specification

You are building an ecommerce **Progressive Web App (PWA)** called **LuxiorMall**, using **Next.js with TypeScript**.

---

## 🎯 Purpose

LuxiorMall is a **modern ecommerce platform for customers and product sales**.

* Customers can browse and order products.
* Payments are made in **Kenyan Shillings (KSh)** via **M-Pesa**.
* Admin manages the entire platform.
* Sellers cannot apply directly → **Admin creates sellers by converting normal users into sellers**.

---

## 🎨 Branding

Use LuxiorMall brand colors consistently:

* Luxior Black → `#000000`
* Luxior White → `#ffffff`
* Luxior Peach → `#ffd2aa`
* Luxior Orange → `#ffa555`
* Luxior Deep Orange → `#ff7900`

Style: modern, premium, minimalist, rounded corners, soft shadows, smooth animations.

---

## ⚙️ Tech Stack

* **Framework**: Next.js (App Router) + **TypeScript**
* **Backend APIs**: Next.js API Routes (serverless functions)
* **Database + Auth**: Supabase (Postgres + Supabase Auth with RLS + auto-generated TypeScript types)
* **Storage**: Cloudinary (images/videos for products)
* **Payments**: M-Pesa Daraja API (STK Push, currency in KSh/KES)
* **Deployment**: Vercel (Next.js hosting, CDN, SSL)
* **SEO**: Structured data (JSON-LD), sitemap.xml, robots.txt, Open Graph, Next.js SEO helpers

---

## 👥 User Roles

### Customer

* Browse/search products; SEO-friendly product pages.
* Add to cart, checkout with M-Pesa.
* See **Out of Stock** badge and (optional) **Notify Me** when back in stock.
* Contact via WhatsApp button.
* Install LuxiorMall as a mobile PWA.
* (Optional) Guest checkout.

### Seller (created only by Admin)

* Admin upgrades a user account into a seller.
* Add/edit/delete products; upload images/videos via Cloudinary.
* Manage stock and pricing.
* View orders containing their items.

### Admin

* Create/convert users into sellers.
* Manage products (approve, edit, delete).
* Manage all orders.
* Dashboard with analytics (sales, top categories/sellers).
* Bulk import/export products.
* Deactivate sellers or products if needed.

---

## 🛒 Core Features

* Homepage with featured categories (Shoes, Fashion, Laptops).
* Product pages with SEO + structured data and clean URLs (`/products/:slug`).
* Cart + checkout (M-Pesa STK push).
* Out-of-stock handling (disable add-to-cart; “Notify Me” capture).
* WhatsApp support button (global + product prefill).
* Seller dashboard (created by Admin).
* Admin dashboard for seller/product/order management.
* **PWA support**:

  * `manifest.json` with LuxiorMall branding
  * Service Worker for offline cart and caching
  * Add-to-Home-Screen support
  * Push notifications (future phase)

---

## 📂 Database Schema (Supabase with TypeScript Types)

* **users** → (id, role \[customer/seller/admin], name, email, phone, password)
* **sellers** → (id, user\_id, business\_name, created\_by\_admin)
* **categories** → (id, name, slug)
* **products** → (id, seller\_id, category\_id, name, description, price, currency, stock, created\_at)
* **product\_media** → (id, product\_id, media\_url, type \[image/video])
* **cart\_items** → (id, user\_id, product\_id, quantity, created\_at)
* **orders** → (id, user\_id, total\_price, payment\_status, mpesa\_transaction\_id, created\_at)
* **order\_items** → (id, order\_id, product\_id, quantity, price)
* **notify\_me** → (id, user\_id, product\_id, created\_at)
* **support\_requests** → (id, user\_id, message, via\_whatsapp, created\_at)

Supabase should generate **TypeScript types** for all tables to enforce type safety across the app.

---

## 💳 Payments (M-Pesa Daraja API)

* Checkout triggers **STK push** on customer’s phone.
* Next.js API routes handle:

  * `/api/payments/initiate` → initiate M-Pesa payment.
  * `/api/payments/callback` → handle Daraja callback, update order.
* Orders updated with **payment status + transaction ID**.
* Deduct stock only after confirmed payment.
* Handle failed/cancelled payments.

---

## 📈 SEO

* Product URLs like `/products/:slug`.
* Structured product data (JSON-LD: name, price, stock, currency KES).
* Sitemap.xml + robots.txt auto-generated.
* Open Graph & Twitter meta tags.
* Mobile-first, fast load times (Cloudinary optimized images).
* (Future) Google Merchant Center feed.

---

## 🚀 Deployment

* Deploy on **Vercel** (`luxiormall.com`).
* Connect Supabase (DB + Auth).
* Connect Cloudinary.
* Add M-Pesa credentials as environment variables.
* Ensure app is PWA installable on mobile devices.

---

## 🛤️ Roadmap

**Phase 1 (MVP, 2 months)**

* Core ecommerce (products, cart, checkout, payments).
* Admin converts users into sellers.
* Admin + Seller dashboards.
* PWA support (offline cart, installable).

**Phase 2 (3–5 months)**

* Push notifications (order updates).
* Advanced analytics.
* Blog for SEO growth.
* Shipping/delivery options.

**Phase 3 (6+ months)**

* Native mobile apps (React Native/Expo).
* Advanced features: discounts, referrals, delivery tracking.
* Returns/refunds flow.

---

👉 Now: **Generate the scaffolded codebase in Next.js + TypeScript** for this ecommerce PWA with the above requirements, ready to run with Supabase + Cloudinary + M-Pesa API, deployable on Vercel.

---

Would you like me to also **design an architecture diagram** (frontend, backend, DB, M-Pesa, Cloudinary) so you can give it to devs or pitch it visually?
