const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));

app.use(helmet());
app.use(morgan('dev'));

// Database Connection
connectDB();

const authRoutes = require('./routes/authRoutes');

const tableRoutes = require('./routes/tableRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

const paymentRoutes = require('./routes/paymentRoutes');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tables', tableRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', require('./routes/adminRoutes'));

app.get('/', (req, res) => {
    res.send('API is running...');
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0",() => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
