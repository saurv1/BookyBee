const mongoose = require('mongoose');

const authSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    address: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["customer", "provider", "admin"],
        default: "customer",
    },
    serviceCategory: {
        type: String,
        required: function () { return this.role === 'provider'; }
    },
    price: {
        type: Number,
        required: function () { return this.role === 'provider'; }
    },
    otp: {
        type: String,
        required: false // making it optional as it's not always present at registration
    },
    isOtpVerified: {
        type: Boolean,
        default: false,
        select: false
    },
    isAvailable: {
        type: Boolean,
        default: true
    }
});

const authModel = mongoose.model('user', authSchema);

module.exports = authModel;