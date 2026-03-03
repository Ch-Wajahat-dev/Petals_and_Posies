const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    product:  { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name:     String,
    image:    String,
    price:    Number,
    quantity: Number
}, { _id: false });

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [orderItemSchema],
    deliveryInfo: {
        firstName: String,
        lastName:  String,
        email:     String,
        phone:     String,
        address:   String,
        city:      String,
        delivery:  String   // 'standard' | 'express' | 'sameday'
    },
    paymentMethod: { type: String, default: 'cod' },
    giftMessage:   { type: String, default: '' },
    deliveryCost:  { type: Number, default: 0 },
    totalAmount:   { type: Number, required: true },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
