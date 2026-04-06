require('dotenv').config({ quiet: true });
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 3005;
const IS_VERCEL = process.env.VERCEL === '1';

const dbConnect = require('./db/dbconfig');

const authRoute = require('./routes/authRoute');
const serviceRoute = require("./routes/serviceRoute");
const contactRoute = require("./routes/contactRoute");
const bookingRoute = require("./routes/bookingRoute");
const paymentRoute = require("./routes/paymentRoute");

const cors = require('cors');

// Initial DB connection attempt
dbConnect().catch(err => console.log('Initial DB connect attempt failed:', err.message));

const messageRoute = require("./routes/messageRoute");
const notificationRoute = require("./routes/notificationRoute");
const reviewRoute = require("./routes/reviewRoute");
const complaintRoute = require("./routes/complaintRoute");

const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// Database connection middleware
app.use(async (req, res, next) => {
    try {
        await dbConnect();
        next();
    } catch (err) {
        console.error("Database connection middleware error:", err.message);
        res.status(500).json({ success: false, message: "Database connection failed" });
    }
});

app.use('/uploads', express.static('uploads'));

app.use("/api/auth", authRoute)
app.use("/api/service", serviceRoute)
app.use("/api/contact", contactRoute);
app.use("/api/booking", bookingRoute);
app.use("/api/message", messageRoute);
app.use("/api/notification", notificationRoute);
app.use("/api/payment", paymentRoute);
app.use("/api/review", reviewRoute);
app.use("/api/complaint", complaintRoute);

app.get('/', (req, res) => {
    const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
    res.json({
        message: 'BookyBee API is running!',
        environment: IS_VERCEL ? 'production/vercel' : 'development',
        dbStatus: states[mongoose.connection.readyState] || 'unknown'
    });
});

// Global error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled Server Error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong on the server'
    });
});

// Only listen if not in a Vercel-like serverless environment
if (!IS_VERCEL) {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

module.exports = app;