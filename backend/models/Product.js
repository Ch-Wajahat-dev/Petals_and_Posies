const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name:        { type: String, required: true, trim: true },
    image:       { type: String, required: true },
    price:       { type: Number, required: true },
    description: { type: String, default: '' },
    category:    {
        type: String,
        enum: ['bouquet', 'roses', 'tulips', 'seasonal', 'gift'],
        default: 'bouquet'
    },
    stock:         { type: Number, default: 100 },
    offer:         { type: Boolean, default: false },
    originalPrice: { type: Number, default: null }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
