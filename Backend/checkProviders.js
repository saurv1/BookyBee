const mongoose = require('mongoose');

const authSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    role: String,
    serviceCategory: String,
    email: String
});

const authModel = mongoose.model('users', authSchema); // authModel uses 'users' collection in authModel.js

const serviceSchema = new mongoose.Schema({
    service: String,
    description: String,
    location: String,
    price: Number,
    UserId: { type: mongoose.Schema.Types.ObjectId, ref: 'users' }
});

const serviceModel = mongoose.model('services', serviceSchema);

const check = async () => {
    try {
        await mongoose.connect("mongodb+srv://BookyBee_db_user:formy!fyp@cluster0.i6js2t1.mongodb.net/?appName=Cluster0");
        console.log('Connected to DB');

        const providers = await authModel.find({ role: 'provider' });
        console.log('--- Providers in User Collection ---');
        if (providers.length === 0) {
            console.log('No users found with role "provider".');
        } else {
            providers.forEach(p => {
                console.log(`${p.firstName} ${p.lastName} (${p.email}) - Category: ${p.serviceCategory}`);
            });
        }

        const services = await serviceModel.find({}).populate('UserId');
        console.log('\n--- Service Listings in Service Collection ---');
        if (services.length === 0) {
            console.log('No listings found in service collection.');
        } else {
            services.forEach(s => {
                console.log(`${s.service} - Rs ${s.price} at ${s.location} (Provider: ${s.UserId ? s.UserId.firstName : 'Unknown'})`);
            });
        }
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

check();
