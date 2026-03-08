require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Product = require('./models/Product');

const newProducts = [
    {
        name: 'Rose Gift Box',
        image: 'o1.jpg',
        price: 5990,
        category: 'gift',
        description: 'Pink roses beautifully arranged in a gift bag with chocolates — the perfect gift for birthdays and anniversaries.',
        stock: 100
    },
    {
        name: 'Sunflower Bouquet',
        image: 'o2.jpg',
        price: 3290,
        originalPrice: 4290,
        offer: true,
        category: 'bouquet',
        description: 'Fresh sunflowers wrapped in rustic kraft paper — bright, cheerful, and full of warmth.',
        stock: 100
    },
    {
        name: 'Peach Roses',
        image: 'p6.jpg',
        price: 4290,
        category: 'roses',
        description: 'Delicate peach roses in a glass vase, glowing softly in natural light.',
        stock: 100
    },
    {
        name: 'Pastel Tulips',
        image: '1772451833018-391217.jpg',
        price: 3590,
        category: 'tulips',
        description: 'Soft lavender tulips arranged in a classic white ceramic pitcher — elegant and serene.',
        stock: 100
    }
];

async function setup() {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            tls: true,
            tlsInsecure: true,
            serverSelectionTimeoutMS: 10000,
        });
        console.log('Connected to MongoDB\n');

        // ── 1. Admin user ──────────────────────────────────────────
        const adminEmail = 'admin@petalsposies.com';
        let admin = await User.findOne({ email: adminEmail });
        if (!admin) {
            await User.create({
                name: 'Admin',
                email: adminEmail,
                password: 'admin123',
                role: 'admin'
            });
            console.log('Admin created: admin@petalsposies.com / admin123');
        } else {
            console.log('Admin already exists: admin@petalsposies.com / admin123');
        }

        // ── 2. New products ────────────────────────────────────────
        console.log('\nAdding new products...');
        for (const p of newProducts) {
            const exists = await Product.findOne({ image: p.image });
            if (exists) {
                console.log(` - SKIP  "${p.name}" (already in DB)`);
            } else {
                await Product.create(p);
                const badge = p.offer ? ' [OFFER 20% OFF]' : '';
                console.log(` - ADDED "${p.name}"${badge} — Rs ${p.price}`);
            }
        }

        // ── 3. List all products ───────────────────────────────────
        const all = await Product.find().sort({ createdAt: 1 });
        console.log(`\n── All Products (${all.length} total) ──────────────────────`);
        all.forEach((p, i) => {
            const offerBadge = p.offer ? ` 🏷 OFFER (was Rs ${p.originalPrice})` : '';
            console.log(`${String(i + 1).padStart(2)}. ${p.name.padEnd(22)} Rs ${String(p.price).padStart(5)}  [${p.category}]${offerBadge}`);
        });

        console.log('\nSetup complete.');
        process.exit(0);
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
}

setup();
