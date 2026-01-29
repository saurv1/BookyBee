const express = require('express');
const app = express();
const PORT = 3005;

const dbConnect = require('./db/dbconfig');

const authRoute = require('./routes/authRoute');
const serviceRoute = require("./routes/serviceRoute");
const contactRoute = require("./routes/contactRoute");

const cors = require('cors');

// Connect to the database
dbConnect();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoute)
app.use("/api/service", serviceRoute)
app.use("/api/contact", contactRoute);

app.get('/', (req, res) => {
    res.send('Hello World!');
});



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});