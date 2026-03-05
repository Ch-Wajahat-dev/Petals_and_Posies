# 🌸 Petals & Posies — Online Flower Shop

> A full-stack e-commerce web application for a local flower shop, built with Node.js, Express, MongoDB, and vanilla HTML/CSS/JavaScript.

---

## 📌 Project Overview

**Petals & Posies** is a complete online flower shop system developed as a university final project (BS Computer Science — GC University Faisalabad). It allows customers to browse flowers, add them to a cart, place orders with delivery details, and track their order status. The shop owner can manage products, orders, and limited-time offers through a secure admin dashboard.

---

## ✨ Features

### 👤 Customer Side
- Browse all flower products with images and prices
- Search flowers by name
- Add items to cart (with quantity control)
- Limited Time Offers section with live countdown timer
- User registration and login (JWT-based authentication)
- Checkout with full delivery details and payment method selection
- Gift message option at checkout
- View personal order history and status
- AI-powered chatbot for instant help

### 🔐 Admin Side
- Secure admin panel (two-layer JWT protection)
- Add, edit, and delete products with image upload
- View and update order statuses (Pending → Confirmed → Shipped → Delivered)
- Create and manage Limited Time Offers with images and countdown
- Activate / deactivate offers

### 🌐 General
- Fully responsive design (mobile-friendly on all pages)
- Page loader animation on every page
- Floating chatbot with pre-defined Q&A about products, occasions, delivery, and cart help
- Fixed pink navbar consistent across all pages
- Footer with contact info and social links

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas (cloud) |
| Authentication | JSON Web Tokens (JWT) |
| Password Security | bcryptjs |
| File Uploads | Multer |
| Input Validation | express-validator |
| Dev Tool | Nodemon |

---

## 📁 Project Structure

```
gomal project/
├── backend/
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── middleware/
│   │   └── authMiddleware.js      # JWT protect + adminOnly
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Order.js
│   │   ├── Cart.js
│   │   └── Offer.js
│   ├── routes/
│   │   ├── auth.js                # Register / Login / Me
│   │   ├── products.js            # Product CRUD
│   │   ├── orders.js              # Order placement & tracking
│   │   ├── cart.js                # Cart management
│   │   ├── newsletter.js          # Newsletter subscribe
│   │   └── offers.js              # Offer CRUD
│   ├── server.js                  # Express entry point
│   ├── seed.js                    # DB seeder (products + admin)
│   └── package.json
│
└── web/
    ├── index.html                 # Home page
    ├── cart.html                  # Shop & cart page
    ├── checkout.html              # Order checkout
    ├── login.html                 # Login / Signup
    ├── signup.html                # Signup page
    ├── orders.html                # My Orders
    ├── admin.html                 # Admin dashboard
    ├── style.css                  # Main styles (index)
    ├── styl.css                   # Shop page styles
    ├── Stylee.css                 # Login/signup styles
    ├── main.js                    # Shared JS (navbar, auth, loader)
    ├── app.js                     # Cart & shop logic
    ├── script.js                  # Login/signup API calls
    ├── chatbot.js                 # Chatbot widget
    └── img/                       # Product images & assets
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v18+
- A [MongoDB Atlas](https://www.mongodb.com/atlas) account (free tier works)

### 1. Clone the repository
```bash
git clone https://github.com/Ch-Wajahat-dev/flowes.git
cd flowes
```

### 2. Install dependencies
```bash
cd backend
npm install
```

### 3. Create environment file
Create a `.env` file inside the `backend/` folder:
```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/petalsposies
JWT_SECRET=your_secret_key_here
PORT=3000
```

### 4. Seed the database
```bash
node seed.js
```
This creates **12 flower products** and an **admin user** in the database.

### 5. Start the server
```bash
npm run dev        # development (nodemon)
# or
npm start          # production
```

### 6. Open the app
```
http://localhost:3000
```

---

## 🔑 Default Admin Credentials

| Field | Value |
|---|---|
| Email | admin@petalsposies.com |
| Password | admin123 |

> ⚠️ Change the admin password after first login in a production environment.

---

## 🔗 API Endpoints

### Auth
| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| GET | `/api/auth/me` | Protected |

### Products
| Method | Endpoint | Access |
|---|---|---|
| GET | `/api/products` | Public |
| GET | `/api/products/:id` | Public |
| POST | `/api/products` | Admin |
| PUT | `/api/products/:id` | Admin |
| DELETE | `/api/products/:id` | Admin |

### Orders
| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/orders` | Auth |
| GET | `/api/orders/my` | Auth |
| GET | `/api/orders` | Admin |
| PATCH | `/api/orders/:id/status` | Admin |

### Cart
| Method | Endpoint | Access |
|---|---|---|
| GET | `/api/cart` | Auth |
| POST | `/api/cart/add` | Auth |
| PUT | `/api/cart/:productId` | Auth |
| DELETE | `/api/cart/:productId` | Auth |

### Offers
| Method | Endpoint | Access |
|---|---|---|
| GET | `/api/offers` | Public |
| POST | `/api/offers` | Admin |
| PATCH | `/api/offers/:id/toggle` | Admin |
| DELETE | `/api/offers/:id` | Admin |

---

## 🌸 Product Catalog (Seeded)

| Product | Category | Price (PKR) |
|---|---|---|
| Floral Bouquet | Bouquet | 3,690 |
| Solo Tulip | Tulips | 2,499 |
| Colorful Roses | Roses | 2,589 |
| Serene Floral | Bouquet | 3,499 |
| Vibrant Peony | Seasonal | 2,450 |
| Elegant Dahlia | Seasonal | 3,550 |
| Elegant Iris | Seasonal | 5,689 |
| Sunny Floral | Bouquet | 6,790 |
| Red Roses | Roses | 5,560 |
| Tulip Bouquet | Tulips | 3,989 |
| Vibrant Blossom | Bouquet | 6,995 |
| Purple Tulips | Tulips | 5,480 |

---

## 📞 Shop Contact

| | |
|---|---|
| 📍 Address | Main Bazar, Shop #09, Street #01, PirMahal |
| 📞 Phone | +92 304 1169537 |
| 📧 Email | samda6@gmail.com |

---

## 👨‍💻 Developer

**Ch. Wajahat Amjad**
BS Computer Science — GC University Faisalabad

---

## 📄 License

This project is developed for academic purposes.
