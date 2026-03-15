const express = require('express');
const router = express.Router();
const Review = require('../model/reviewModel');

router.post('/add', async (req, res) => {
    try {
        const { bookingId, reviewerId, targetId, role, rating, feedback } = req.body;
        const newReview = new Review({
            bookingId,
            reviewerId,
            targetId,
            role,
            rating,
            feedback
        });
        await newReview.save();
        res.status(201).json({ success: true, message: 'Review submitted successfully', review: newReview });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

router.get('/target/:targetId', async (req, res) => {
    try {
        const reviews = await Review.find({ targetId: req.params.targetId })
            .populate('reviewerId', 'firstName lastName')
            .populate('bookingId', 'service date')
            .sort({ createdAt: -1 });
        res.status(200).json({ success: true, reviews });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

router.get('/admin/all', async (req, res) => {
    try {
        const reviews = await Review.find({})
            .populate({ path: 'reviewerId', select: 'firstName lastName email' })
            .populate({ path: 'targetId', select: 'firstName lastName email' })
            .populate({ path: 'bookingId', select: 'service date' })
            .sort({ createdAt: -1 });
        res.status(200).json({ success: true, reviews });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
