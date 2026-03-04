const mongoose = require('mongoose');

const bookingSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        table: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Table',
        },
        date: {
            type: String, // Storing as string YYYY-MM-DD for simplicity in querying slots, or Date object
            required: true,
        },
        timeSlot: {
            type: String, // e.g., "19:00 - 20:00"
            required: true,
        },
        partySize: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'],
            default: 'Pending',
        },
        payment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Payment'
        }
    },
    {
        timestamps: true,
    }
);

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
