const express = require('express');
const router = express.Router();
const complaintController = require('../controllers/complaintController');
const isAutenticated = require('../middleware/isAutenticated');
const restrictTo = require('../middleware/restrictTo');

router.post('/', isAutenticated, complaintController.createComplaint);
router.get('/', isAutenticated, restrictTo('admin'), complaintController.getAllComplaints);
router.patch('/:id', isAutenticated, restrictTo('admin'), complaintController.updateComplaintStatus);

module.exports = router;
