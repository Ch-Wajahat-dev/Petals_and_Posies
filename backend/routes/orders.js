const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const DELIVERY_FEES = { standard: 0, express: 200, sameday: 350 };

// POST /api/orders  (create order)
router.post('/', protect, async (req, res) => {
    try {
        const { items, deliveryInfo, paymentMethod, giftMessage } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'Order has no items' });
        }

        const deliveryCost = DELIVERY_FEES[deliveryInfo?.delivery] ?? 0;
        const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
        const totalAmount = subtotal + deliveryCost;

        const order = await Order.create({
            user: req.user._id,
            items,
            deliveryInfo,
            paymentMethod: paymentMethod || 'cod',
            giftMessage: giftMessage || '',
            deliveryCost,
            totalAmount
        });

        // Clear the user's server-side cart after order
        await Cart.findOneAndUpdate(
            { user: req.user._id },
            { items: [] }
        );

        res.status(201).json(order);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /api/orders/my
router.get('/my', protect, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /api/orders  (admin: all orders)
router.get('/', protect, adminOnly, async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('user', 'name email')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PATCH /api/orders/:id/status  (admin)
router.patch('/:id/status', protect, adminOnly, async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        );
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.json(order);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
