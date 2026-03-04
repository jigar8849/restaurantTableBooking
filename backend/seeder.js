const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Table = require('./models/Table');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const importData = async () => {
    try {
        await User.deleteMany();
        await Table.deleteMany();

        const createdUsers = await User.insertMany([
            {
                name: 'Admin User',
                email: 'admin@example.com',
                password: 'password123', // Will be hashed by pre-save hook? No, insertMany doesn't trigger pre-save hooks on some versions/configs unless specified or using create.
                role: 'admin',
            },
            {
                name: 'Employee User',
                email: 'staff@example.com',
                password: 'password123',
                role: 'employee',
            },
            {
                name: 'John Doe',
                email: 'customer@example.com',
                password: 'password123',
                role: 'customer',
            },
        ]);

        // Fix passwords (since insertMany might skip hashing middleware, safer to use create loop or manual hash)
        // Actually, for simplicity, let's just use a loop for users to ensure hashing using User.create
        await User.deleteMany(); // Clear again

        await User.create({
            name: 'Admin User',
            email: 'admin@example.com',
            password: 'password123',
            role: 'admin',
        });

        await User.create({
            name: 'Employee User',
            email: 'staff@example.com',
            password: 'password123',
            role: 'employee',
        });

        await User.create({
            name: 'John Doe',
            email: 'customer@example.com',
            password: 'password123',
            role: 'customer',
        });


        const tables = [
            { tableNumber: 1, capacity: 2, location: 'Window' },
            { tableNumber: 2, capacity: 2, location: 'Window' },
            { tableNumber: 3, capacity: 4, location: 'Center' },
            { tableNumber: 4, capacity: 4, location: 'Center' },
            { tableNumber: 5, capacity: 6, location: 'Private' },
            { tableNumber: 6, capacity: 8, location: 'Outdoor' },
        ];

        await Table.insertMany(tables);

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await User.deleteMany();
        await Table.deleteMany();
        await Booking.deleteMany();
        await Payment.deleteMany();

        console.log('Data Destroyed!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}
