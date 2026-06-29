# LUMORA — Fine Jewelry E-Commerce Platform

A fully original luxury jewelry e-commerce platform built with **Next.js 16 (App Router) + TypeScript + Tailwind CSS v4 + PostgreSQL + Prisma + Stripe**.

**Brand identity:** Deep Emerald Green (`#0F3D2E`) + Champagne Gold (`#C9A84C`) on Pearl White (`#FAF8F3`).  
**Typography:** Playfair Display (headings) + Inter (body).

---

## ✦ Features

| Area | What's included |
|---|---|
| **Storefront** | Catalog with masonry grid, advanced filters, masonry layout, product detail with image gallery, size/engraving selectors |
| **Auth** | JWT (access 15min + refresh 30 days via HttpOnly cookies), Register/Login/Logout, Admin role |
| **Cart** | Zustand cart (persisted) with drawer, quantity controls, coupon codes |
| **Checkout** | Multi-step: Shipping → Stripe Payment Elements → Confirmation |
| **Orders** | Created server-side, stock decremented, confirmation email via SMTP |
| **Account** | Dashboard, order history with status, wishlist |
| **Admin** | Recharts analytics, order management + status updates, product list |
| **Design Studio** | Step-by-step jewelry configurator (piece → metal → gemstone → setting → engraving) |
| **Design** | Gold shimmer, scroll-triggered animations (Framer Motion), glass morphism, micro-interactions |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- PostgreSQL 15+ (or use Docker Compose)

### 1. Install
```bash
cd luxe-jewels
npm install
```

### 2. Environment
```bash
cp .env.example .env
# Fill in DATABASE_URL, JWT secrets, Stripe keys, Cloudinary, SMTP
```

### 3. Database
```bash
# Start Postgres via Docker (optional)
docker compose up postgres -d

# Push schema
npm run db:push

# Seed sample products + users + coupons
npm run db:seed
```

**Seed credentials:**
- Admin: `admin@lumora.com` / `admin@lumora123`
- Customer: `priya@example.com` / `customer123`
- Coupons: `WELCOME10` (10% off $500+) · `LUMORA500` ($500 off $3k+)

### 4. Run
```bash
npm run dev          # localhost:3000 with hot reload
```

---

## 🐳 Docker

```bash
cp .env.example .env   # fill secrets
docker compose up --build -d
docker compose exec app npx prisma migrate deploy
docker compose exec app npm run db:seed
```

App: `http://localhost:3000`

---

## 🗂 Project Structure

```
app/                  → Next.js pages + API route handlers
  layout.tsx          → Header, Footer, CartDrawer, AuthProvider
  page.tsx            → Homepage
  catalog/            → Product catalog
  product/[slug]/     → Product detail
  cart/               → Cart page
  checkout/           → Multi-step checkout with Stripe
  designer/           → Jewelry design studio
  auth/               → Login / Register
  account/            → User dashboard
  admin/              → Admin dashboard (ADMIN role)
  api/                → REST API (auth, products, orders, payments, admin)

components/           → Header, Footer, ProductCard, CartDrawer, HomeSection…
store/                → Zustand (cart, auth, wishlist)
lib/                  → prisma.ts, auth.ts, stripe.ts, cloudinary.ts, email.ts
prisma/               → schema.prisma + seed.ts
types/index.ts        → Shared TypeScript types
```

---

## 💳 Stripe Webhooks (Local)

```bash
stripe listen --forward-to localhost:3000/api/payments/webhook
# Copy the printed webhook secret to STRIPE_WEBHOOK_SECRET
```

---

## 🎨 Design Tokens

| Token | Value |
|---|---|
| Emerald deep | `#0a2e20` |
| Emerald | `#0f3d2e` |
| Gold | `#c9a84c` |
| Pearl bg | `#faf8f3` |
| Heading font | Playfair Display |
| Body font | Inter |
| Border radius | `2px` (sharp luxury aesthetic) |

Custom CSS classes: `.btn-primary` `.btn-outline-gold` `.section-title` `.gold-shimmer` `.input-base` `.product-card` `.skeleton` `.glass` `.glass-dark`

---

## 🔒 Security

- Passwords: bcrypt 12 rounds
- Auth: JWT via HttpOnly SameSite cookies
- Admin: `requireAdmin()` server-side on every admin route
- Payments: amount re-calculated server-side from DB prices
- Input: Zod validation on all mutation routes

---

## 📋 API Quick Reference

| Method | Path | Auth | Purpose |
|---|---|---|---|
| POST | `/api/auth/register` | — | Create account |
| POST | `/api/auth/login` | — | Login (sets cookies) |
| POST | `/api/auth/logout` | — | Clear tokens |
| GET | `/api/auth/me` | cookie | Current session |
| GET | `/api/products` | — | Catalog (filters, sort, page) |
| POST | `/api/orders` | user | Place order |
| GET | `/api/orders` | user | Order history |
| GET | `/api/coupons?code=X&subtotal=Y` | — | Validate coupon |
| POST | `/api/payments/create-intent` | user | Stripe PaymentIntent |
| POST | `/api/payments/webhook` | Stripe | Webhook |
| GET | `/api/admin/analytics` | admin | Dashboard stats |
| GET/PATCH | `/api/admin/orders` | admin | Orders |
| GET/PATCH/DELETE | `/api/admin/products` | admin | Products |

---

MIT License — Build on it, ship it, make it yours.
