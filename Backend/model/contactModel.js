const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"]
    },
    phone: {
        type: String,
        required: [true, "Phone number is required"]
    },
    email: {
        type: String,
        required: [true, "Email is required"]
    },
    message: {
        type: String,
        required: [true, "Message is required"]
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const contactModel = mongoose.model('Contact', contactSchema);
module.exports = contactModel;
