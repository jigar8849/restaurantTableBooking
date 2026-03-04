const Razorpay = require('razorpay');
const crypto = require('crypto');
const Payment = require('../models/Payment');
const Booking = require('../models/Booking');

// Initialize Razorpay
// NOTE: Using Test Keys from env or dummy for now until user provides them
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_dummy',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_secret',
});

// @desc    Create Razorpay Order
// @route   POST /api/payments/create-order
// @access  Private
const createOrder = async (req, res) => {
    const { amount, bookingId } = req.body;

    try {
        const options = {
            amount: amount * 100, // amount in smallest currency unit (paise)
            currency: 'INR',
            receipt: `receipt_order_${bookingId}`,
        };

        const order = await razorpay.orders.create(options);

        if (!order) return res.status(500).send('Some error occured');

        res.json(order);
    } catch (error) {
        res.status(500).send(error);
    }
};

// @desc    Verify Payment
// @route   POST /api/payments/verify
// @access  Private
const verifyPayment = async (req, res) => {
    const {
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
        bookingId,
        amount,
    } = req.body;

    try {
        const body = razorpayOrderId + '|' + razorpayPaymentId;

        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'dummy_secret')
            .update(body.toString())
            .digest('hex');

        const isAuthentic = expectedSignature === razorpaySignature;

        if (isAuthentic) {
            // Save payment to DB
            const payment = await Payment.create({
                booking: bookingId,
                amount: amount,
                method: 'Razorpay',
                status: 'Completed',
                razorpayOrderId,
                razorpayPaymentId,
                razorpaySignature,
            });

            // Update Booking Payment Status
            const booking = await Booking.findById(bookingId);
            if (booking) {
                booking.payment = payment._id;
                // booking.status = 'Confirmed'; // Optional: Auto confirm on payment?
                await booking.save();
            }

            res.json({
                message: 'Payment success',
                paymentId: razorpayPaymentId,
                orderId: razorpayOrderId,
            });
        } else {
            res.status(400).json({
                message: 'Invalid signature',
            });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createOrder, verifyPayment };
