const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['booking', 'chat', 'system'],
        default: 'booking'
    },
    bookingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'booking'
    },
    isRead: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const notificationModel = mongoose.model('notification', notificationSchema);

module.exports = notificationModel;
