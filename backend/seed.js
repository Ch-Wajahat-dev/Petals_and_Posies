require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Product = require('./models/Product');

const products = [
    
    { name: 'Floral Bouquet',   image: '02 (2).jpg',  price: 3690, category: 'bouquet',  description: 'Beautiful mixed floral bouquet perfect for any occasion.' },
    { name: 'Solo Tulip',       image: 'p2 (2).jpg',  price: 2499, category: 'tulips',   description: 'Elegant single tulip arrangement.' },
    { name: 'Colorful Roses',   image: 'p3 (2).jpg',  price: 2589, category: 'roses',    description: 'Vibrant mix of colorful roses.' },
    { name: 'Serene Floral',    image: 'p4 (1).jpg',  price: 3499, category: 'bouquet',  description: 'Serene and calming floral arrangement.' },
    { name: 'Vibrant Peony',    image: 'p5 (2).jpg',  price: 2450, category: 'seasonal', description: 'Lush vibrant peonies in full bloom.' },
    { name: 'Elegant Dahlia',   image: 'p4 (4).jpg',  price: 3550, category: 'seasonal', description: 'Sophisticated dahlia arrangement.' },
    { name: 'Elegant Iris',     image: 'p6 (2).jpg',  price: 5689, category: 'seasonal', description: 'Graceful iris flowers with a royal purple hue.' },
    { name: 'Sunny Floral',     image: 'p9 (2).jpg',  price: 6790, category: 'bouquet',  description: 'Bright and cheerful sunflower arrangement.' },
    { name: 'Red Roses',        image: 'p8.jpg',       price: 5560, category: 'roses',    description: 'Classic red roses — the ultimate symbol of love.' },
    { name: 'Tulip Bouquet',    image: 'p9.jpg',       price: 3989, category: 'tulips',   description: 'Fresh tulip bouquet in mixed spring colors.' },
    { name: 'Vibrant Blossom',  image: 'p7.jpg',       price: 6995, category: 'bouquet',  description: 'An explosion of color with vibrant blossoms.' },
    { name: 'Purple Tulips',    image: 'p8 (2).jpg',  price: 5480, category: 'tulips',   description: 'Striking purple tulip bundle.' }
];

async function seed() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Seed admin user
        const adminEmail = 'admin@petalsposies.com';
        let admin = await User.findOne({ email: adminEmail });
        if (!admin) {
            admin = await User.create({
                name: 'Admin',
                email: adminEmail,
                password: 'admin123',
                role: 'admin'
            });
            console.log('Admin user created:', adminEmail, '/ admin123');
        } else {
            console.log('Admin user already exists, skipping.');
        }

        // Seed products
        const existing = await Product.countDocuments();
        if (existing === 0) {
            await Product.insertMany(products);
            console.log(`${products.length} products seeded.`);
        } else {
            console.log(`Products already exist (${existing}), skipping seed.`);
        }

        console.log('Seeding complete.');
        process.exit(0);
    } catch (err) {
        console.error('Seed error:', err.message);
        process.exit(1);
    }
}

seed();
