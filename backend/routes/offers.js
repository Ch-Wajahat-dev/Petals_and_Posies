const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const Offer = require('../models/Offer');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Multer: save offer images to web/img/
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, path.join(__dirname, '../../web/img')),
    filename:    (req, file, cb) => {
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
    limits: { fileSize: 5 * 1024 * 1024 }
});

// GET /api/offers  — public, returns all active offers
router.get('/', async (req, res) => {
    try {
        const offers = await Offer.find({ isActive: true }).sort({ createdAt: -1 });
        res.json(offers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /api/offers/all  — admin, returns all offers including inactive
router.get('/all', protect, adminOnly, async (req, res) => {
    try {
        const offers = await Offer.find().sort({ createdAt: -1 });
        res.json(offers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST /api/offers  — admin, create offer with optional images
router.post('/', protect, adminOnly, upload.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 }
]), async (req, res) => {
    try {
        const data = { ...req.body };
        data.price      = Number(data.price);
        data.targetDate = new Date(data.targetDate);
        if (req.files?.image1) data.image1 = req.files.image1[0].filename;
        if (req.files?.image2) data.image2 = req.files.image2[0].filename;
        const offer = await Offer.create(data);
        res.status(201).json(offer);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PATCH /api/offers/:id/toggle  — admin, toggle active/inactive
router.patch('/:id/toggle', protect, adminOnly, async (req, res) => {
    try {
        const offer = await Offer.findById(req.params.id);
        if (!offer) return res.status(404).json({ message: 'Offer not found' });
        offer.isActive = !offer.isActive;
        await offer.save();
        res.json(offer);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// DELETE /api/offers/:id  — admin
router.delete('/:id', protect, adminOnly, async (req, res) => {
    try {
        const offer = await Offer.findByIdAndDelete(req.params.id);
        if (!offer) return res.status(404).json({ message: 'Offer not found' });
        res.json({ message: 'Offer deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
