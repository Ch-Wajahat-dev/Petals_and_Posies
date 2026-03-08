require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const newProducts = [
    {
        name: 'Red Rose Vase',
        image: '1772698223372-577006.jpg',
        price: 4990,
        category: 'roses',
        description: 'A stunning arrangement of fresh red roses in an elegant glass vase — perfect for a romantic dinner or special occasion.',
        stock: 100
    },
    {
        name: 'Bridal Bouquet',
        image: '1772698276827-486496.jpg',
        price: 7500,
        category: 'bouquet',
        description: 'Luxurious mixed bridal bouquet featuring roses, ranunculus, and seasonal blooms tied with a satin ribbon.',
        stock: 100
    },
    {
        name: 'Rainbow Roses',
        image: '1772698276828-61475.jpg',
        price: 3990,
        category: 'roses',
        description: 'A cheerful mix of multicolored roses — purple, orange, pink, red, and yellow — arranged in a clear glass vase.',
        stock: 100
    }
];

async function addProducts() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const result = await Product.insertMany(newProducts);
        console.log(`${result.length} products added:`);
        result.forEach(p => console.log(` - ${p.name} (${p._id})`));

        process.exit(0);
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
}

addProducts();
