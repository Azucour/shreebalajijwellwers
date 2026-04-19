# 🏪 Shree Balaji Jewellers — Full Stack Website

A production-ready MERN stack jewellery e-commerce website with a modern gold + dark luxury UI, full admin dashboard, WhatsApp integration, and Cloudinary image storage.

---

## 📁 Project Structure

```
shree-balaji-jewellers/
├── frontend/          ← React + Vite + Tailwind (deploy to Vercel)
└── backend/           ← Node.js + Express + MongoDB (deploy to Render)
```

---

## ⚙️ Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | React 18, Vite, Tailwind CSS, Framer Motion |
| Backend    | Node.js, Express.js               |
| Database   | MongoDB Atlas                     |
| Images     | Cloudinary                        |
| Auth       | JWT (jsonwebtoken + bcryptjs)     |
| Hosting    | Vercel (FE) + Render (BE)         |

---

## 🚀 Local Development Setup

### 1. Clone & Install

```bash
# Backend
cd backend
npm install
cp .env.example .env
# → Fill in your MongoDB URI, Cloudinary keys, JWT secret

# Frontend
cd ../frontend
npm install
cp .env.example .env
# → VITE_API_URL=http://localhost:5000/api
```

### 2. Configure Backend `.env`

```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/shree-balaji-jewellers
JWT_SECRET=super_secret_change_this_in_production_min_32_chars
JWT_EXPIRE=7d

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

FRONTEND_URL=http://localhost:5173
SHOP_WHATSAPP=919876543210

ADMIN_USERNAME=admin
ADMIN_PASSWORD=Admin@123
```

### 3. Seed Admin Account

After the backend is running, run once:

```bash
curl -X POST http://localhost:5000/api/auth/seed
```

This creates the first admin user. After seeding, this endpoint returns an error if admin already exists (safe to call once).

### 4. Run Both Servers

```bash
# Terminal 1 — Backend
cd backend
npm run dev        # nodemon server.js on port 5000

# Terminal 2 — Frontend
cd frontend
npm run dev        # Vite dev server on port 5173
```

Open `http://localhost:5173` for the customer site.  
Open `http://localhost:5173/admin/login` for the admin panel.

---

## 🌐 Deployment

### Backend → Render

1. Push `backend/` folder to a GitHub repo
2. Create a new **Web Service** on [render.com](https://render.com)
3. Connect your repo, set **Build Command**: `npm install`, **Start Command**: `node server.js`
4. Add all environment variables from `.env.example`
5. Deploy — copy your Render URL (e.g. `https://sbj-api.onrender.com`)

### Frontend → Vercel

1. Push `frontend/` folder to GitHub
2. Import project on [vercel.com](https://vercel.com)
3. Set environment variable: `VITE_API_URL=https://sbj-api.onrender.com/api`
4. Deploy — Vercel auto-detects Vite

### First-time seed on production

```bash
curl -X POST https://sbj-api.onrender.com/api/auth/seed
```

---

## 🛠️ Customisation Checklist

Open `frontend/src/utils/constants.js` and update:

```js
export const SHOP = {
  name: 'Shree Balaji Jewellers',
  whatsapp: '91XXXXXXXXXX',     // ← Your WhatsApp number (no + or spaces)
  phone: '+91 XXXXX XXXXX',
  phoneTel: 'tel:+91XXXXXXXXXX',
  email: 'you@example.com',
  address: 'Your full address here',
  instagram: 'https://instagram.com/yourhandle',
  timing: 'Mon–Sun: 10:00 AM – 9:00 PM',
};
```

---

## 📱 Pages & Routes

### Customer
| Route | Page |
|---|---|
| `/` | Homepage (hero, categories, featured, trending, about) |
| `/products` | Product listing with filter, search, sort |
| `/products/:id` | Product detail with image gallery + WhatsApp buy |
| `/contact` | Contact form, map, call/WhatsApp buttons |

### Admin
| Route | Page |
|---|---|
| `/admin/login` | Secure JWT login |
| `/admin` | Dashboard with stats & analytics |
| `/admin/products` | List all products (toggle featured/trending/active) |
| `/admin/products/add` | Add product with Cloudinary image upload |
| `/admin/products/edit/:id` | Edit existing product |

---

## 🔐 Security Features

- JWT authentication for all admin routes
- Password hashing with bcryptjs (12 salt rounds)
- Rate limiting (100 req/15min)
- Helmet.js security headers
- CORS restricted to frontend URL
- Environment variables for all secrets
- Protected admin API routes

---

## 💬 WhatsApp Integration

When a customer clicks **"Buy on WhatsApp"** on any product detail page, it generates:

```
Hello Shree Balaji Jewellers,

I am interested in this product:

🏷️ Product Name: 22K Gold Bridal Necklace Set
💰 Price: ₹45,000
📂 Category: Bridal Sets
🖼️ Product Image: https://res.cloudinary.com/...

Please share more details. Thank you!
```

And redirects to: `https://wa.me/91XXXXXXXXXX?text=...`

---

## 🗄️ MongoDB Schemas

### Product
```js
{
  name, description, category, price, priceVisible,
  weight, purity, images[{url, public_id}],
  stock, featured, trending, isAvailable, tags[], createdAt
}
```

### Admin
```js
{ username, password (bcrypt hashed), name, createdAt }
```

---

## 📦 API Endpoints

### Public
```
GET  /api/products              → List products (filter/search/sort/page)
GET  /api/products/:id          → Single product
GET  /api/health                → Health check
```

### Auth
```
POST /api/auth/login            → Admin login → returns JWT
GET  /api/auth/me               → Get current admin (protected)
POST /api/auth/seed             → One-time admin creation
```

### Admin (JWT required)
```
GET  /api/products/admin/all    → All products (including hidden)
POST /api/products              → Create product
PUT  /api/products/:id          → Update product
DEL  /api/products/:id          → Delete product
POST /api/upload/images         → Upload to Cloudinary
DEL  /api/upload/image/:id      → Delete from Cloudinary
GET  /api/admin/stats           → Dashboard analytics
```

---

## ✨ Features Summary

- ✅ Luxury gold + dark UI with Playfair Display + Poppins fonts
- ✅ Hero slider with 3 auto-rotating banners
- ✅ Category grid (Gold, Silver, Diamond, Rings, Necklaces, Bangles, Earrings, Bridal Sets…)
- ✅ Featured & Trending product sections
- ✅ Product cards with hover zoom, badges, quick-view overlay
- ✅ Full-screen image gallery with zoom on detail page
- ✅ WhatsApp buy button with pre-filled message
- ✅ Click-to-call phone button
- ✅ Contact form → sends via WhatsApp
- ✅ Google Maps embed
- ✅ Sticky floating WhatsApp button
- ✅ Responsive navbar with slide-in mobile menu
- ✅ Skeleton loading for all product grids
- ✅ Framer Motion page & card animations
- ✅ Filter by category, featured, trending + search + sort
- ✅ Pagination
- ✅ Admin login with JWT
- ✅ Admin dashboard with analytics & category bar chart
- ✅ Drag-and-drop Cloudinary image upload (up to 10 images)
- ✅ Toggle featured / trending / visibility per product inline
- ✅ SEO meta tags via react-helmet-async
- ✅ CORS, rate limiting, Helmet.js security
- ✅ Vercel + Render deployment ready

---

*Built with ❤️ for Shree Balaji Jewellers, Kalyān, Maharashtra*
