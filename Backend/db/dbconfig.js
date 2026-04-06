const mongoose = require('mongoose');

const dbConnect = async () => {
    try {
        if (!process.env.MONGO_URI) {
            console.error('MONGO_URI is not defined in environment variables');
            return;
        }
        await mongoose.connect(process.env.MONGO_URI)
        console.log('Database connected successfully');

    } catch (err) {
        console.error('Database connection error details:', {
            message: err.message,
            code: err.code,
            name: err.name
        });
    }
}


module.exports = dbConnect;


