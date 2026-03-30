const mongoose = require('mongoose');

const tempAuthSchema = new mongoose.Schema({
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
    district: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["customer", "provider"],
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
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 600 // Auto-delete after 10 minutes (600 seconds)
    }
});

const tempAuthModel = mongoose.model('tempUser', tempAuthSchema);

module.exports = tempAuthModel;
