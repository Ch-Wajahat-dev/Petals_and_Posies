require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth',       require('./routes/auth'));
app.use('/api/products',   require('./routes/products'));
app.use('/api/orders',     require('./routes/orders'));
app.use('/api/cart',       require('./routes/cart'));
app.use('/api/newsletter', require('./routes/newsletter'));
app.use('/api/offers',    require('./routes/offers'));

// Protected server-side route for admin page
const jwt = require('jsonwebtoken');
const User = require('./models/User');

app.get('/admin.html', async (req, res) => {
    try {
        const token = req.query.token;
        if (!token) return res.redirect('/login.html?msg=admin');

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('role');
        if (!user || user.role !== 'admin') return res.redirect('/login.html?msg=admin');

        res.sendFile(path.join(__dirname, '../web/admin.html'));
    } catch {
        res.redirect('/login.html?msg=admin');
    }
});

// Serve frontend static files
app.use(express.static(path.join(__dirname, '../web')));

// Fallback: serve index.html for any unmatched route
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../web/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
