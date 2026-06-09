# 🛒 ShopEZ — Full Stack MERN E-Commerce Application

A complete e-commerce web application built with the **MERN Stack** (MongoDB, Express.js, React.js, Node.js). ShopEZ includes product browsing, cart management, order placement, payment simulation, user profiles, and a full admin dashboard.

---

## 🚀 Live Features

| Feature | Description |
|---|---|
| 🏠 Landing Page | Hero section, category tiles, features showcase |
| 🛍️ Products Page | Browse all products with filters and sorting |
| 🔍 Search & Filter | Search by name, filter by category, price range, stock |
| 🔼🔽 Sort | Low to High, High to Low, Top Rated, Newest |
| 🛒 Cart | Add, remove, increase/decrease quantity |
| 💳 Checkout | Shipping details + 5 payment options |
| 📦 Orders | View order history with status tracking |
| 👤 User Profile | View and edit profile details + order history |
| ⭐ Reviews | Write and view product reviews |
| ⚙️ Admin Dashboard | Stats, all orders, update order status |
| 📦 Admin Products | View, search, filter, edit, delete products |
| ➕ Admin New Product | Add new products with live preview |

---

## 🧰 Tech Stack

### Frontend
- React.js
- Redux Toolkit (State Management)
- React Router DOM (Navigation)
- Axios (API calls)

### Backend
- Node.js
- Express.js
- JSON Web Token (JWT Authentication)
- Bcrypt.js (Password Hashing)

### Database
- MongoDB
- Mongoose (ODM)

---

## 📁 Project Structure

```
shopez/
│
├── server/                        ← Backend (Node + Express)
│   ├── config/
│   │   └── db.js                  ← MongoDB connection
│   ├── controllers/
│   │   ├── authController.js      ← Register, Login, Profile
│   │   ├── productController.js   ← Product CRUD + Reviews
│   │   └── orderController.js     ← Order management
│   ├── middleware/
│   │   └── authMiddleware.js      ← JWT auth + Admin check
│   ├── models/
│   │   ├── User.js                ← User schema
│   │   ├── Product.js             ← Product schema
│   │   └── Order.js               ← Order schema
│   ├── routes/
│   │   ├── authRoutes.js          ← /api/auth/*
│   │   ├── productRoutes.js       ← /api/products/*
│   │   └── orderRoutes.js         ← /api/orders/*
│   ├── index.js                   ← Server entry point
│   ├── seed.js                    ← Sample data seeder
│   ├── .env                       ← Environment variables
│   └── package.json
│
└── client/                        ← Frontend (React)
    ├── public/
    │   └── index.html
    └── src/
        ├── components/
        │   ├── Navbar.js           ← Navigation bar
        │   └── ProductCard.js      ← Product display card
        ├── pages/
        │   ├── LandingPage.js      ← Home / Landing
        │   ├── ProductsPage.js     ← All products + filters
        │   ├── ProductPage.js      ← Single product + reviews
        │   ├── CartPage.js         ← Shopping cart
        │   ├── CheckoutPage.js     ← Checkout + payment
        │   ├── OrdersPage.js       ← My orders
        │   ├── UserProfilePage.js  ← User profile
        │   ├── LoginPage.js        ← Login
        │   ├── RegisterPage.js     ← Register
        │   ├── AdminDashboardPage.js   ← Admin stats + orders
        │   ├── AdminAllProductsPage.js ← Admin product list
        │   └── AdminNewProductPage.js  ← Add / Edit product
        ├── redux/
        │   ├── store.js
        │   └── slices/
        │       ├── authSlice.js
        │       ├── productSlice.js
        │       ├── cartSlice.js
        │       └── orderSlice.js
        ├── App.js
        └── index.js
```

---

## ⚙️ Prerequisites

Make sure these are installed on your PC before running:

| Tool | Download |
|---|---|
| Node.js (LTS) | https://nodejs.org |
| MongoDB Community | https://www.mongodb.com/try/download/community |
| VS Code | https://code.visualstudio.com |

Verify installation:
```bash
node -v
npm -v
mongod --version
```

---

## 🏃 Getting Started

### 1. Clone or Download the project
```bash
git clone https://github.com/yourusername/shopez.git
```
Or download the ZIP and extract it.

### 2. Start MongoDB
```bash
# Windows (run as Administrator)
net start MongoDB

# Mac
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

### 3. Setup and run Backend
```bash
cd server
npm install
npm run dev
```
✅ You should see:
```
Server running on http://localhost:5000
MongoDB Connected: localhost
```

### 4. Seed the database (first time only)
Open a new terminal:
```bash
cd server
node seed.js
```
✅ You should see:
```
✅ 6 products inserted!
```

### 5. Setup and run Frontend
Open another new terminal:
```bash
cd client
npm install
npm start
```
✅ Browser opens at **http://localhost:3000**

---

## 🌐 App URLs

| Page | URL |
|---|---|
| Landing Page | http://localhost:3000 |
| Products | http://localhost:3000/products |
| Login | http://localhost:3000/login |
| Register | http://localhost:3000/register |
| Cart | http://localhost:3000/cart |
| Profile | http://localhost:3000/profile |
| Admin Dashboard | http://localhost:3000/admin |

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login user |
| GET | /api/auth/profile | Get user profile |
| PUT | /api/auth/profile | Update user profile |

### Products
| Method | Endpoint | Description |
|---|---|---|
| GET | /api/products | Get all products |
| GET | /api/products/:id | Get single product |
| POST | /api/products | Create product (Admin) |
| PUT | /api/products/:id | Update product (Admin) |
| DELETE | /api/products/:id | Delete product (Admin) |
| POST | /api/products/:id/reviews | Add review |

### Orders
| Method | Endpoint | Description |
|---|---|---|
| POST | /api/orders | Create order |
| GET | /api/orders/myorders | Get my orders |
| GET | /api/orders/:id | Get order by ID |
| PUT | /api/orders/:id/pay | Mark as paid |
| GET | /api/orders | Get all orders (Admin) |
| PUT | /api/orders/:id/status | Update status (Admin) |

---

## 🔐 Environment Variables

Create a `.env` file inside the `server/` folder:

```env
MONGO_URI=mongodb://localhost:27017/shopez
JWT_SECRET=shopez_super_secret_key_2024
PORT=5000
```

---

## 👑 Admin Access

To make a user an admin:

1. Open **MongoDB Compass**
2. Connect to `mongodb://localhost:27017`
3. Open **shopez** database → **users** collection
4. Find your user → Edit document
5. Change `isAdmin` from `false` to `true`
6. Click **Update**
7. Log out and log back in
8. Admin menu appears in the navbar ✅

---

## 💳 Payment Methods (Demo)

ShopEZ includes 5 simulated payment options:

- 📱 UPI (GPay, PhonePe, Paytm)
- 💳 Credit / Debit Card
- 🏦 Net Banking
- 👛 Wallets (Paytm, Amazon Pay)
- 💵 Cash on Delivery

> ⚠️ Demo mode only — no real payment is charged.

---

## 🐛 Common Issues

| Error | Fix |
|---|---|
| `MongoDB connection failed` | Start MongoDB service first |
| `Port 5000 already in use` | Change PORT in .env to 5001 |
| `Cannot find module` | Run `npm install` in that folder |
| `Blank white page` | Check VS Code terminal for React errors |
| `Not authorized` | Login again — JWT token may have expired |

---

## 📸 Pages Overview

- **Landing Page** — Welcome page with categories and features
- **Products Page** — Browse with search, filter, and sort
- **Product Detail** — Full details with reviews
- **Cart** — Manage items and quantities
- **Checkout** — Shipping address + payment selection
- **Orders** — Track all your orders
- **Profile** — View and edit your details
- **Admin Dashboard** — Manage orders and products

---

## 🛠️ Built With

- **MongoDB** — NoSQL database
- **Express.js** — Backend web framework
- **React.js** — Frontend UI library
- **Node.js** — JavaScript runtime
- **Redux Toolkit** — State management
- **JWT** — Authentication
- **Bcrypt** — Password security

---


