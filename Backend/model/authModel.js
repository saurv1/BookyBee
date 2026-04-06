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
        required: true
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
    district: {
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
    isPasswordResetVerified: {
        type: Boolean,
        default: false,
        select: false
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    profilePicture: {
        type: String,
        default: ""
    },
    verificationExpiresAt: {
        type: Date,
        index: { expires: '10m' } // Automatically delete unverified records after 10 minutes
    }
});

const authModel = mongoose.model('user', authSchema);

module.exports = authModel;