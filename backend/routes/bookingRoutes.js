const express = require('express');
const router = express.Router();
const { createBooking, getMyBookings, getBookings, updateBookingStatus } = require('../controllers/bookingController');
const { protect, employee, admin } = require('../middleware/authMiddleware');

router.route('/').post(protect, createBooking).get(protect, employee, getBookings);
router.route('/mybookings').get(protect, getMyBookings);
router.route('/:id/status').put(protect, employee, updateBookingStatus);

module.exports = router;
