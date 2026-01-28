const mongoose = require('mongoose');

const serviceproviderSchema = new mongoose.Schema({
    service: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    
    UserId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    }

}, { timestamps: true });

const serviceModel = mongoose.model('service', serviceproviderSchema);

module.exports = serviceModel;