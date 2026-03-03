const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
    title:       { type: String, required: true },
    subtitle:    { type: String, default: 'Limited Time Offer' },
    discount:    { type: String, default: '-20%' },
    description: { type: String, default: '' },
    price:       { type: Number, required: true },
    targetDate:  { type: Date, required: true },
    image1:      { type: String, default: '' },
    image2:      { type: String, default: '' },
    isActive:    { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Offer', offerSchema);
