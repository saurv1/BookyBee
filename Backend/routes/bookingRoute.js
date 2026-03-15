const express = require('express');
const router = express.Router();
const { createBooking, getCustomerBookings, getCustomerStats, getAdminStats, getAdminAnalytics, getProviderStats, rateBooking, updateBookingStatus, getProviderBookings, getAllBookings } = require('../controllers/bookingController');
const isAutenticated = require('../middleware/isAutenticated');
const restrictTo = require('../middleware/restrictTo');

router.post('/create', isAutenticated, createBooking);
router.get('/customer/:id', isAutenticated, getCustomerBookings);
router.get('/stats/:id', isAutenticated, getCustomerStats);
router.get('/admin/stats', isAutenticated, restrictTo('admin'), getAdminStats);
router.get('/admin/analytics', isAutenticated, restrictTo('admin'), getAdminAnalytics);
router.get('/admin/all', isAutenticated, restrictTo('admin'), getAllBookings);
router.get('/provider/stats/:id', isAutenticated, restrictTo('provider', 'admin'), getProviderStats);
router.get('/provider/:id', isAutenticated, restrictTo('provider', 'admin'), getProviderBookings);
router.post('/rate', isAutenticated, rateBooking);
router.put('/status/:id', isAutenticated, updateBookingStatus);

module.exports = router;
