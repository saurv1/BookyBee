const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    service: {
        type: String,
        required: true
    },
    provider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    date: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled', 'Rejected'],
        default: 'Pending'
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    message: {
        type: String
    },
    paymentStatus: {
        type: String,
        enum: ['UNPAID', 'PENDING', 'COMPLETED', 'FAILED'],
        default: 'UNPAID'
    }
}, { timestamps: true });

bookingSchema.index({ customer: 1 });
bookingSchema.index({ provider: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ createdAt: -1 });

const bookingModel = mongoose.model('booking', bookingSchema);

module.exports = bookingModel;
