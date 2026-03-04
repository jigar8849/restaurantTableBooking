const Booking = require('../models/Booking');
const Table = require('../models/Table');

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res) => {
    const { tableId, date, timeSlot, partySize } = req.body;

    try {
        const table = await Table.findById(tableId);

        if (!table) {
            return res.status(404).json({ message: 'Table not found' });
        }

        // Check availability
        // Simple check: strict equality on date and timeSlot. 
        // In production, would need overlap logic if timeSlot is range.
        // Assuming timeSlot is fixed string "19:00-20:00" for now as per plan.
        const existingBooking = await Booking.findOne({
            table: tableId,
            date,
            timeSlot,
            status: { $ne: 'Cancelled' }
        });

        if (existingBooking) {
            return res.status(400).json({ message: 'Table already booked for this slot' });
        }

        const booking = await Booking.create({
            user: req.user._id,
            table: tableId,
            date,
            timeSlot,
            partySize,
        });

        res.status(201).json(booking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get logged in user bookings
// @route   GET /api/bookings/mybookings
// @access  Private
const getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user._id }).populate('table');
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Private/Employee/Admin
const getBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({}).populate('user', 'id name email').populate('table');
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
// @access  Private/Employee/Admin
const updateBookingStatus = async (req, res) => {
    const { status } = req.body;
    try {
        const booking = await Booking.findById(req.params.id);

        if (booking) {
            booking.status = status;
            const updatedBooking = await booking.save();
            res.json(updatedBooking);
        } else {
            res.status(404).json({ message: 'Booking not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createBooking, getMyBookings, getBookings, updateBookingStatus };
