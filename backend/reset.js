require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Product = require('./models/Product');

const allProducts = [
    // ── Original 12 ──────────────────────────────────────────────
    { name: 'Floral Bouquet',   image: '02 (2).jpg',               price: 3690, category: 'bouquet',  description: 'Beautiful mixed floral bouquet perfect for any occasion.' },
    { name: 'Solo Tulip',       image: 'p2 (2).jpg',               price: 2499, category: 'tulips',   description: 'Elegant single tulip arrangement.' },
    { name: 'Colorful Roses',   image: 'p3 (2).jpg',               price: 2589, category: 'roses',    description: 'Vibrant mix of colorful roses.' },
    { name: 'Serene Floral',    image: 'p4 (1).jpg',               price: 3499, category: 'bouquet',  description: 'Serene and calming floral arrangement.' },
    { name: 'Vibrant Peony',    image: 'p5 (2).jpg',               price: 2450, category: 'seasonal', description: 'Lush vibrant peonies in full bloom.' },
    { name: 'Elegant Dahlia',   image: 'p4 (4).jpg',               price: 3550, category: 'seasonal', description: 'Sophisticated dahlia arrangement.' },
    { name: 'Elegant Iris',     image: 'p6 (2).jpg',               price: 5689, category: 'seasonal', description: 'Graceful iris flowers with a royal purple hue.' },
    { name: 'Sunny Floral',     image: 'p9 (2).jpg',               price: 6790, category: 'bouquet',  description: 'Bright and cheerful sunflower arrangement.' },
    { name: 'Red Roses',        image: 'p8.jpg',                   price: 5560, category: 'roses',    description: 'Classic red roses — the ultimate symbol of love.' },
    { name: 'Tulip Bouquet',    image: 'p9.jpg',                   price: 3989, category: 'tulips',   description: 'Fresh tulip bouquet in mixed spring colors.' },
    { name: 'Vibrant Blossom',  image: 'p7.jpg',                   price: 6995, category: 'bouquet',  description: 'An explosion of color with vibrant blossoms.' },
    { name: 'Purple Tulips',    image: 'p8 (2).jpg',               price: 5480, category: 'tulips',   description: 'Striking purple tulip bundle.' },

    // ── New 3 (from images uploaded) ─────────────────────────────
    { name: 'Red Rose Vase',    image: '1772698223372-577006.jpg',  price: 4990, category: 'roses',    description: 'A stunning arrangement of fresh red roses in an elegant glass vase — perfect for a romantic dinner or special occasion.' },
    { name: 'Bridal Bouquet',   image: '1772698276827-486496.jpg',  price: 7500, category: 'bouquet',  description: 'Luxurious mixed bridal bouquet featuring roses, ranunculus, and seasonal blooms tied with a satin ribbon.' },
    { name: 'Rainbow Roses',    image: '1772698276828-61475.jpg',   price: 3990, category: 'roses',    description: 'A cheerful mix of multicolored roses arranged in a clear glass vase.' },

    // ── New 4 (from img folder) ───────────────────────────────────
    { name: 'Rose Gift Box',    image: 'o1.jpg',                   price: 5990, category: 'gift',     description: 'Pink roses beautifully arranged in a gift bag with chocolates — perfect for birthdays and anniversaries.' },
    { name: 'Sunflower Bouquet',image: 'o2.jpg',                   price: 3290, category: 'bouquet',  description: 'Fresh sunflowers wrapped in rustic kraft paper — bright, cheerful, and full of warmth.', offer: true, originalPrice: 4290 },
    { name: 'Peach Roses',      image: 'p6.jpg',                   price: 4290, category: 'roses',    description: 'Delicate peach roses in a glass vase, glowing softly in natural light.' },
    { name: 'Pastel Tulips',    image: '1772451833018-391217.jpg',  price: 3590, category: 'tulips',   description: 'Soft lavender tulips arranged in a classic white ceramic pitcher — elegant and serene.' },
];

async function reset() {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            tls: true,
            tlsInsecure: true,
            serverSelectionTimeoutMS: 10000,
        });
        console.log('Connected to MongoDB\n');

        // ── Admin user ────────────────────────────────────────────
        await User.deleteOne({ email: 'admin@petalsposies.com' });
        await User.create({
            name: 'Admin',
            email: 'admin@petalsposies.com',
            password: 'admin123',
            role: 'admin'
        });
        console.log('Admin created:');
        console.log('  Email   : admin@petalsposies.com');
        console.log('  Password: admin123\n');

        // ── Products ──────────────────────────────────────────────
        await Product.deleteMany({});
        await Product.insertMany(allProducts);
        console.log(`${allProducts.length} products inserted:\n`);

        const saved = await Product.find().sort({ createdAt: 1 });
        saved.forEach((p, i) => {
            const badge = p.offer ? `  [OFFER: Rs ${p.originalPrice} → Rs ${p.price}]` : '';
            console.log(`  ${String(i + 1).padStart(2)}. ${p.name.padEnd(22)} Rs ${String(p.price).padStart(5)}  [${p.category}]${badge}`);
        });

        console.log('\nDone.');
        process.exit(0);
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
}

reset();
