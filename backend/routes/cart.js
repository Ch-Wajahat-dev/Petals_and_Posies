const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const { protect } = require('../middleware/authMiddleware');

// GET /api/cart
router.get('/', protect, async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
        res.json(cart || { items: [] });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST /api/cart/add  { productId, quantity }
router.post('/add', protect, async (req, res) => {
    try {
        const { productId, quantity = 1 } = req.body;
        let cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            cart = new Cart({ user: req.user._id, items: [] });
        }

        const idx = cart.items.findIndex(i => i.product.toString() === productId);
        if (idx > -1) {
            cart.items[idx].quantity += quantity;
        } else {
            cart.items.push({ product: productId, quantity });
        }

        await cart.save();
        await cart.populate('items.product');
        res.json(cart);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PUT /api/cart/:productId  { quantity }
router.put('/:productId', protect, async (req, res) => {
    try {
        const { quantity } = req.body;
        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) return res.status(404).json({ message: 'Cart not found' });

        const item = cart.items.find(i => i.product.toString() === req.params.productId);
        if (!item) return res.status(404).json({ message: 'Item not in cart' });

        if (quantity < 1) {
            cart.items = cart.items.filter(i => i.product.toString() !== req.params.productId);
        } else {
            item.quantity = quantity;
        }

        await cart.save();
        await cart.populate('items.product');
        res.json(cart);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// DELETE /api/cart/:productId
router.delete('/:productId', protect, async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) return res.status(404).json({ message: 'Cart not found' });

        cart.items = cart.items.filter(i => i.product.toString() !== req.params.productId);
        await cart.save();
        await cart.populate('items.product');
        res.json(cart);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// DELETE /api/cart  (clear entire cart)
router.delete('/', protect, async (req, res) => {
    try {
        await Cart.findOneAndUpdate(
            { user: req.user._id },
            { items: [] },
            { upsert: true }
        );
        res.json({ message: 'Cart cleared' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
