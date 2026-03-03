const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const Product = require('../models/Product');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Multer: save uploads to web/img/
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../web/img'));
    },
    filename: (req, file, cb) => {
        const unique = Date.now() + '-' + Math.round(Math.random() * 1e6);
        cb(null, unique + path.extname(file.originalname));
    }
});
const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) cb(null, true);
        else cb(new Error('Only image files allowed'));
    },
    limits: { fileSize: 5 * 1024 * 1024 } // 5 MB
});

// GET /api/products
router.get('/', async (req, res) => {
    try {
        const { search, category, limit } = req.query;
        const filter = {};
        if (search) filter.name = { $regex: search, $options: 'i' };
        if (category) filter.category = category;
        let query = Product.find(filter).sort({ createdAt: -1 });
        if (limit) query = query.limit(Number(limit));
        const products = await query;
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST /api/products (admin) — accepts multipart/form-data with optional image file
router.post('/', protect, adminOnly, upload.single('imageFile'), async (req, res) => {
    try {
        const data = { ...req.body };
        if (req.file) data.image = req.file.filename;
        if (!data.image) return res.status(400).json({ message: 'Image is required' });
        data.price = Number(data.price);
        data.stock = Number(data.stock) || 100;
        const product = await Product.create(data);
        res.status(201).json(product);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT /api/products/:id (admin) — accepts multipart/form-data with optional new image
router.put('/:id', protect, adminOnly, upload.single('imageFile'), async (req, res) => {
    try {
        const data = { ...req.body };
        if (req.file) data.image = req.file.filename;
        data.price = Number(data.price);
        data.stock = Number(data.stock);
        const product = await Product.findByIdAndUpdate(req.params.id, data, {
            new: true, runValidators: true
        });
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE /api/products/:id (admin)
router.delete('/:id', protect, adminOnly, async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json({ message: 'Product deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
