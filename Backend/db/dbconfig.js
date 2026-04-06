const mongoose = require('mongoose');
let isConnected = false;

const dbConnect = async () => {
    if (isConnected) {
        return;
    }

    try {
        if (!process.env.MONGO_URI) {
            console.error('MONGO_URI is not defined in environment variables');
            return;
        }

        const db = await mongoose.connect(process.env.MONGO_URI, {
            // Options are usually no longer needed in Mongoose 6+, but including common ones for safety
            serverSelectionTimeoutMS: 5000, 
        });

        isConnected = db.connections[0].readyState === 1;
        console.log('Database connected successfully');

    } catch (err) {
        console.error('Database connection error details:', {
            message: err.message,
            code: err.code,
            name: err.name
        });
        isConnected = false;
        throw err; // Re-throw to handle it in a middleware if needed
    }
}


module.exports = dbConnect;


