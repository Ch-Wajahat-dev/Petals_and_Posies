require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

async function check() {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            tls: true,
            tlsInsecure: true,
            serverSelectionTimeoutMS: 10000,
        });
        console.log('Connected to MongoDB\n');

        const totalUsers = await User.countDocuments();
        const totalProducts = await mongoose.connection.db.collection('products').countDocuments();
        console.log(`Users in DB    : ${totalUsers}`);
        console.log(`Products in DB : ${totalProducts}\n`);

        const admin = await User.findOne({ email: 'admin@petalsposies.com' });
        if (!admin) {
            console.log('Admin user NOT FOUND — reset.js did not run or failed.\n');
            console.log('Creating admin now...');
            await User.create({ name: 'Admin', email: 'admin@petalsposies.com', password: 'admin123', role: 'admin' });
            console.log('Admin created successfully.');
        } else {
            console.log(`Admin found: ${admin.email} (role: ${admin.role})`);
            const match = await bcrypt.compare('admin123', admin.password);
            console.log(`Password "admin123" matches: ${match}`);
            if (!match) {
                console.log('\nPassword mismatch — resetting password...');
                admin.password = 'admin123';
                await admin.save();
                console.log('Password reset to admin123.');
            }
        }

        process.exit(0);
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
}

check();
