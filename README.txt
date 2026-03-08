============================================================
  PETALS & POSIES — Online Flower Shop
  Full-Stack Web Application
============================================================

PROJECT OVERVIEW
----------------
Petals & Posies is an online flower shop web application that
allows customers to browse and purchase flowers, manage a cart,
place orders, and interact with a chatbot assistant. Admins can
manage products, offers, and orders through a protected dashboard.

------------------------------------------------------------
TECH STACK
------------------------------------------------------------
Frontend  : HTML, CSS, Vanilla JavaScript
Backend   : Node.js, Express.js
Database  : MongoDB (via Mongoose)
Auth      : JSON Web Tokens (JWT)
File Upload: Multer (images saved to web/img/)

------------------------------------------------------------
PROJECT STRUCTURE
------------------------------------------------------------
group3/
├── backend/
│   ├── server.js              # Express app entry point
│   ├── seed.js                # Manual DB seeder script
│   ├── setup.js               # Setup utility
│   ├── reset.js               # DB reset utility
│   ├── add-products.js        # Utility to add products
│   ├── list-products.js       # Utility to list products
│   ├── check-admin.js         # Utility to check admin user
│   ├── package.json
│   ├── config/
│   │   └── db.js              # MongoDB connection + auto-seed
│   ├── middleware/
│   │   └── authMiddleware.js  # JWT protect & adminOnly guards
│   ├── models/
│   │   ├── User.js            # User schema (name, email, password, role)
│   │   ├── Product.js         # Product schema (name, image, price, category, stock, offer)
│   │   ├── Cart.js            # Cart schema (user, items[])
│   │   ├── Order.js           # Order schema (user, items, delivery, payment, status)
│   │   └── Offer.js           # Offer/promotion schema
│   └── routes/
│       ├── auth.js            # Register, login, /me
│       ├── products.js        # CRUD for products (admin upload via multer)
│       ├── cart.js            # Add, update, remove, clear cart
│       ├── orders.js          # Create order, view my orders, admin order mgmt
│       ├── offers.js          # Promotional offers CRUD (admin)
│       └── newsletter.js      # Newsletter subscription
└── web/
    ├── index.html             # Home / landing page
    ├── login.html             # Login page
    ├── signup.html            # Registration page
    ├── cart.html              # Shopping cart page
    ├── checkout.html          # Checkout / order placement
    ├── orders.html            # User order history
    ├── admin.html             # Admin dashboard (protected)
    ├── chatbot.js             # Chatbot assistant logic
    ├── main.js                # Shared frontend utilities
    ├── app.js                 # Frontend app logic
    ├── script.js              # Additional frontend scripts
    ├── styl.css / style.css / Stylee.css   # Stylesheets
    └── img/                   # Product and offer images

------------------------------------------------------------
PREREQUISITES
------------------------------------------------------------
- Node.js v18 or higher
- MongoDB (local instance or MongoDB Atlas cloud URI)
- npm

------------------------------------------------------------
INSTALLATION & SETUP
------------------------------------------------------------
1. Clone or download the project.

2. Navigate to the backend folder:
     cd group3/backend

3. Install dependencies:
     npm install

4. Create a .env file in the backend/ folder with:
     MONGO_URI=mongodb://localhost:27017/petals-posies
     JWT_SECRET=your_secret_key_here
     PORT=3000

   For MongoDB Atlas, replace MONGO_URI with your Atlas
   connection string.

5. Start the server:
     npm start          (production)
     npm run dev        (development with nodemon auto-restart)

6. Open your browser and go to:
     http://localhost:3000

The database is auto-seeded on first startup with:
  - A default admin account
  - 19 sample flower products

------------------------------------------------------------
DEFAULT ADMIN CREDENTIALS
------------------------------------------------------------
  Email    : admin@petalsposies.com
  Password : admin123

IMPORTANT: Change the admin password after first login in a
production environment.

------------------------------------------------------------
API ENDPOINTS
------------------------------------------------------------
AUTH
  POST   /api/auth/register       Register a new user
  POST   /api/auth/login          Login (returns JWT token)
  GET    /api/auth/me             Get current user info (auth)

PRODUCTS
  GET    /api/products            List all products
                                  Query params: search, category, limit
  GET    /api/products/:id        Get single product
  POST   /api/products            Create product (admin, multipart)
  PUT    /api/products/:id        Update product (admin, multipart)
  DELETE /api/products/:id        Delete product (admin)

CART
  GET    /api/cart                Get user cart (auth)
  POST   /api/cart/add            Add item to cart (auth)
  PUT    /api/cart/:productId     Update item quantity (auth)
  DELETE /api/cart/:productId     Remove item from cart (auth)
  DELETE /api/cart                Clear entire cart (auth)

ORDERS
  POST   /api/orders              Place a new order (auth)
  GET    /api/orders/my           Get current user's orders (auth)
  GET    /api/orders              Get all orders (admin)
  PATCH  /api/orders/:id/status   Update order status (admin)

OFFERS
  GET    /api/offers              List active offers (public)
  GET    /api/offers/all          List all offers (admin)
  POST   /api/offers              Create offer (admin, multipart)
  PATCH  /api/offers/:id/toggle   Toggle offer active/inactive (admin)
  DELETE /api/offers/:id          Delete offer (admin)

NEWSLETTER
  POST   /api/newsletter          Subscribe to newsletter

PAGES
  GET    /admin.html              Admin dashboard (JWT token required
                                  via ?token= query param)

------------------------------------------------------------
PRODUCT CATEGORIES
------------------------------------------------------------
  bouquet, roses, tulips, seasonal, gift

------------------------------------------------------------
DELIVERY OPTIONS & FEES
------------------------------------------------------------
  standard  — Free (PKR 0)
  express   — PKR 200
  sameday   — PKR 350

------------------------------------------------------------
FEATURES
------------------------------------------------------------
  - Browse flowers by category or search by name
  - User registration and login with JWT authentication
  - Persistent server-side shopping cart
  - Checkout with delivery options and gift messages
  - Order placement and order history for logged-in users
  - Promotional offers / deals section
  - Admin dashboard: manage products, offers, and orders
  - Image upload for products and offers (max 5MB per image)
  - Admin-protected route served server-side
  - Chatbot assistant on the frontend
  - Newsletter subscription

------------------------------------------------------------
SCRIPTS (run from backend/)
------------------------------------------------------------
  npm start            Start the server
  npm run dev          Start with nodemon (auto-restart)
  node seed.js         Manually seed DB (admin + products)
  node reset.js        Reset / clear the database
  node add-products.js Add additional products
  node list-products.js List all products in DB
  node check-admin.js  Check if admin user exists

------------------------------------------------------------
DEPENDENCIES
------------------------------------------------------------
  express            Web framework
  mongoose           MongoDB ODM
  bcryptjs           Password hashing
  jsonwebtoken       JWT authentication
  dotenv             Environment variable management
  cors               Cross-origin resource sharing
  multer             File/image upload handling
  express-validator  Request validation

Dev:
  nodemon            Auto-restart on file changes

------------------------------------------------------------
NOTES
------------------------------------------------------------
- Uploaded images are stored in web/img/ and served as static
  files by Express.
- The admin page (/admin.html) is protected server-side: the
  JWT token must be passed as a query parameter (?token=...).
  Only users with role "admin" can access it.
- The database auto-seeds on every server start if the admin
  user or products are missing.

============================================================
