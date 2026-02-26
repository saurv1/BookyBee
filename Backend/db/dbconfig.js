const mongoose = require('mongoose');

const dbConnect = async () => {
    try {
        await mongoose.connect("mongodb+srv://BookyBee_db_user:formy!fyp@cluster0.i6js2t1.mongodb.net/?appName=Cluster0")
        console.log('Database connected successfully');

    } catch (err) {
        console.error('Database connection error:', err);
    }
}


module.exports = dbConnect;


