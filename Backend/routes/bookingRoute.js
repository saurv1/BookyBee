const express = require('express');
const router = express.Router();
const { createBooking, getCustomerBookings, getCustomerStats, getAdminStats, getProviderStats } = require('../controllers/bookingController');
const isAutenticated = require('../middleware/isAutenticated');
const restrictTo = require('../middleware/restrictTo');

router.post('/create', isAutenticated, createBooking);
router.get('/customer/:id', isAutenticated, getCustomerBookings);
router.get('/stats/:id', isAutenticated, getCustomerStats);
router.get('/admin/stats', isAutenticated, restrictTo('admin'), getAdminStats);
router.get('/provider/stats/:id', isAutenticated, restrictTo('provider', 'admin'), getProviderStats);

module.exports = router;
