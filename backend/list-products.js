require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

async function listProducts() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const products = await Product.find().sort({ createdAt: 1 });
        console.log(`\nTotal products: ${products.length}\n`);
        products.forEach((p, i) => {
            console.log(`${i + 1}. ${p.name}`);
            console.log(`   ID:       ${p._id}`);
            console.log(`   Category: ${p.category}`);
            console.log(`   Price:    Rs ${p.price}`);
            console.log(`   Image:    ${p.image}`);
            console.log(`   Stock:    ${p.stock}`);
            console.log('');
        });
        process.exit(0);
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
}

listProducts();
