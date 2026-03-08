const mongoose = require('mongoose');



const connectDB = async (retries = 5) => {
    for (let i = 1; i <= retries; i++) {
        try {
            await mongoose.connect(process.env.MONGO_URI, {
                serverSelectionTimeoutMS: 15000,
                socketTimeoutMS: 45000,
            });
            console.log('MongoDB connected');
            await autoSeed();
            return;
        } catch (err) {
            console.error(`MongoDB attempt ${i}/${retries} failed: ${err.message}`);
            if (i === retries) { process.exit(1); }
            await new Promise(r => setTimeout(r, 6000 * i)); // wait 3s, 6s, 9s…
        }
    }
};

async function autoSeed() {
    const User    = require('../models/User');
    const Product = require('../models/Product');

    // ── Admin user ────────────────────────────────────────────────
    const adminExists = await User.findOne({ email: 'admin@petalsposies.com' });
    if (!adminExists) {
        await User.create({
            name:     'Admin',
            email:    'admin@petalsposies.com',
            password: 'admin123',
            role:     'admin'
        });
        console.log('Admin created: admin@petalsposies.com / admin123');
    }

    // ── Products ──────────────────────────────────────────────────
    const count = await Product.countDocuments();
    if (count === 0) {
        const products = [
            { name: 'Floral Bouquet',    image: '02 (2).jpg',              price: 3690, category: 'bouquet',  description: 'Beautiful mixed floral bouquet perfect for any occasion.' },
            { name: 'Solo Tulip',        image: 'p2 (2).jpg',              price: 2499, category: 'tulips',   description: 'Elegant single tulip arrangement.' },
            { name: 'Colorful Roses',    image: 'p3 (2).jpg',              price: 2589, category: 'roses',    description: 'Vibrant mix of colorful roses.' },
            { name: 'Serene Floral',     image: 'p4 (1).jpg',              price: 3499, category: 'bouquet',  description: 'Serene and calming floral arrangement.' },
            { name: 'Vibrant Peony',     image: 'p5 (2).jpg',              price: 2450, category: 'seasonal', description: 'Lush vibrant peonies in full bloom.' },
            { name: 'Elegant Dahlia',    image: 'p4 (4).jpg',              price: 3550, category: 'seasonal', description: 'Sophisticated dahlia arrangement.' },
            { name: 'Elegant Iris',      image: 'p6 (2).jpg',              price: 5689, category: 'seasonal', description: 'Graceful iris flowers with a royal purple hue.' },
            { name: 'Sunny Floral',      image: 'p9 (2).jpg',              price: 6790, category: 'bouquet',  description: 'Bright and cheerful sunflower arrangement.' },
            { name: 'Red Roses',         image: 'p8.jpg',                  price: 5560, category: 'roses',    description: 'Classic red roses — the ultimate symbol of love.' },
            { name: 'Tulip Bouquet',     image: 'p9.jpg',                  price: 3989, category: 'tulips',   description: 'Fresh tulip bouquet in mixed spring colors.' },
            { name: 'Vibrant Blossom',   image: 'p7.jpg',                  price: 6995, category: 'bouquet',  description: 'An explosion of color with vibrant blossoms.' },
            { name: 'Purple Tulips',     image: 'p8 (2).jpg',              price: 5480, category: 'tulips',   description: 'Striking purple tulip bundle.' },
            { name: 'Red Rose Vase',     image: '1772698223372-577006.jpg', price: 4990, category: 'roses',    description: 'A stunning arrangement of fresh red roses in an elegant glass vase.' },
            { name: 'Bridal Bouquet',    image: '1772698276827-486496.jpg', price: 7500, category: 'bouquet',  description: 'Luxurious mixed bridal bouquet tied with a satin ribbon.' },
            { name: 'Rainbow Roses',     image: '1772698276828-61475.jpg',  price: 3990, category: 'roses',    description: 'A cheerful mix of multicolored roses in a clear glass vase.' },
            { name: 'Rose Gift Box',     image: 'o1.jpg',                  price: 5990, category: 'gift',     description: 'Pink roses in a gift bag with chocolates — perfect for birthdays.' },
            { name: 'Sunflower Bouquet', image: 'o2.jpg',                  price: 3290, category: 'bouquet',  description: 'Fresh sunflowers in rustic kraft paper.', offer: true, originalPrice: 4290 },
            { name: 'Peach Roses',       image: 'p6.jpg',                  price: 4290, category: 'roses',    description: 'Delicate peach roses glowing softly in natural light.' },
            { name: 'Pastel Tulips',     image: '1772451833018-391217.jpg', price: 3590, category: 'tulips',   description: 'Soft lavender tulips in a classic white ceramic pitcher.' },
        ];
        await Product.insertMany(products);
        console.log(`${products.length} products seeded.`);
    }
}

module.exports = connectDB;
