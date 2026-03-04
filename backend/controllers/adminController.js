const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const User = require('../models/User');
const Table = require('../models/Table');

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
    try {
        const totalBookings = await Booking.countDocuments();
        const totalUsers = await User.countDocuments();
        const totalTables = await Table.countDocuments();

        // Calculate total earnings
        const payments = await Payment.find({ status: 'Completed' });
        const totalEarnings = payments.reduce((acc, curr) => acc + curr.amount, 0);

        // Bookings by status
        const pendingBookings = await Booking.countDocuments({ status: 'Pending' });
        const confirmedBookings = await Booking.countDocuments({ status: 'Confirmed' });
        const completedBookings = await Booking.countDocuments({ status: 'Completed' });
        const cancelledBookings = await Booking.countDocuments({ status: 'Cancelled' });

        // Recent bookings (last 5)
        const recentBookings = await Booking.find({})
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('user', 'name')
            .populate('table', 'tableNumber');

        res.json({
            totalBookings,
            totalUsers,
            totalTables,
            totalEarnings,
            bookingStats: {
                pending: pendingBookings,
                confirmed: confirmedBookings,
                completed: completedBookings,
                cancelled: cancelledBookings,
            },
            recentBookings,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getDashboardStats };
