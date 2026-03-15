require('dotenv').config({ quiet: true });
const express = require('express');
const app = express();
const PORT = 3005;

const dbConnect = require('./db/dbconfig');

const authRoute = require('./routes/authRoute');
const serviceRoute = require("./routes/serviceRoute");
const contactRoute = require("./routes/contactRoute");
const bookingRoute = require("./routes/bookingRoute");
const paymentRoute = require("./routes/paymentRoute");

const cors = require('cors');

// Connect to the database
dbConnect();

const messageRoute = require("./routes/messageRoute");
const notificationRoute = require("./routes/notificationRoute");
const reviewRoute = require("./routes/reviewRoute");
const complaintRoute = require("./routes/complaintRoute");

app.use(cors());
app.use(express.json());
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
    res.send('Hello World!');
});



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});