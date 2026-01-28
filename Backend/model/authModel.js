const mongoose = require('mongoose');

const authSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        // unique: true
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
    phone:{
        type: Number,
        required:true,
        unique:true
    },
    role: {
        type: String,
        enum:["customer","serviceprovider","admin"],
        default:"customer",
    },
    otp:{
        type: String,
        required: true
    }
});

const authModel = mongoose.model('user', authSchema);

module.exports = authModel;