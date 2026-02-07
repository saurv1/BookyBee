const mongoose = require('mongoose');
const authModel = require('./model/authModel');
const bookingModel = require('./model/bookingModel');

const seedData = async () => {
    try {
        await mongoose.connect("mongodb+srv://BookyBee_db_user:formy!fyp@cluster0.i6js2t1.mongodb.net/?appName=Cluster0");
        console.log('Connected to DB for seeding...');

        const customers = await authModel.find({ role: 'customer' });
        const providers = await authModel.find({ role: 'provider' });

        if (customers.length === 0 || providers.length === 0) {
            console.log('Need at least one customer and one provider to seed bookings.');
            process.exit();
        }

        const services = ['House Cleaning', 'Plumbing', 'Electrical', 'Gardening', 'AC Repair'];
        const statuses = ['Pending', 'Confirmed', 'Completed', 'Cancelled'];

        const bookings = [];

        // Create 15 random bookings over the last few months
        for (let i = 0; i < 15; i++) {
            const customer = customers[Math.floor(Math.random() * customers.length)];
            const provider = providers[Math.floor(Math.random() * providers.length)];
            const service = services[Math.floor(Math.random() * services.length)];
            const status = statuses[Math.floor(Math.random() * statuses.length)];
            const amount = Math.floor(Math.random() * 1000) + 300;

            // Random date in the last 6 months
            const date = new Date();
            date.setMonth(date.getMonth() - Math.floor(Math.random() * 6));
            date.setDate(Math.floor(Math.random() * 28) + 1);

            bookings.push({
                customer: customer._id,
                provider: provider._id,
                service,
                status,
                amount,
                date: date.toLocaleDateString(),
                time: "10:00 AM",
                createdAt: date
            });
        }

        await bookingModel.insertMany(bookings);
        console.log(`Successfully seeded ${bookings.length} bookings!`);
        process.exit();
    } catch (error) {
        console.error('Seeding error:', error);
        process.exit(1);
    }
};

seedData();
