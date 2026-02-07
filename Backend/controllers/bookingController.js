const bookingModel = require('../model/bookingModel');
const authModel = require('../model/authModel');

const createBooking = async (req, res) => {
    try {
        const { service, provider, date, time, amount } = req.body;
        const customer = req.user._id; // From auth middleware

        const newBooking = new bookingModel({
            customer,
            service,
            provider,
            date,
            time,
            amount
        });

        await newBooking.save();
        res.status(201).json({ success: true, message: 'Booking created successfully', booking: newBooking });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getCustomerBookings = async (req, res) => {
    try {
        const customerId = req.params.id;
        const bookings = await bookingModel.find({ customer: customerId }).populate('provider', 'firstName lastName phone');
        res.status(200).json({ success: true, bookings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getCustomerStats = async (req, res) => {
    try {
        const customerId = req.params.id;
        const bookings = await bookingModel.find({ customer: customerId });

        const totalBookings = bookings.length;
        const pendingServices = bookings.filter(b => b.status === 'Pending' || b.status === 'Confirmed').length;
        const completedServices = bookings.filter(b => b.status === 'Completed').length;
        const totalSpent = 0; // Set to 0 as requested

        // For spending chart - last 12 months (dummy logic for now, or group by month)
        // Grouping by month for the current year
        const currentYear = new Date().getFullYear();
        const monthlySpending = Array(12).fill(0);
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        bookings.forEach(booking => {
            if (booking.status === 'Completed') {
                const date = new Date(booking.createdAt);
                if (date.getFullYear() === currentYear) {
                    monthlySpending[date.getMonth()] += 0; // Set to 0 as requested
                }
            }
        });

        const spendingData = months.map((name, index) => ({
            name,
            amount: monthlySpending[index]
        }));

        res.status(200).json({
            success: true,
            stats: {
                totalBookings,
                pendingServices,
                completed: completedServices,
                totalSpent
            },
            spendingData
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getAdminStats = async (req, res) => {
    try {
        const [totalBookingsCount, customersCount, providersCount, allBookings, allUsers] = await Promise.all([
            bookingModel.countDocuments(),
            authModel.countDocuments({ role: 'customer' }),
            authModel.countDocuments({ role: { $in: ['provider', 'serviceprovider'] } }),
            bookingModel.find().populate('customer', 'firstName lastName').populate('provider', 'firstName lastName serviceCategory').sort({ createdAt: -1 }),
            authModel.find({ role: { $in: ['provider', 'serviceprovider'] } })
        ]);

        console.log("Admin Stats Debug - Customers:", customersCount, "Providers:", providersCount);

        const completedBookings = allBookings.filter(b => b.status === 'Completed');
        const totalRevenue = 0; // Set to 0 as requested

        // Booking Trends (last 6 months)
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const currentYear = new Date().getFullYear();
        const monthlyBookings = Array(12).fill(0);

        allBookings.forEach(booking => {
            const date = new Date(booking.createdAt);
            if (date.getFullYear() === currentYear) {
                monthlyBookings[date.getMonth()]++;
            }
        });

        const chartData = months.map((name, index) => ({
            name,
            bookings: monthlyBookings[index]
        })).slice(-6); // Last 6 months

        // Service Distribution
        const serviceCounts = {};
        allBookings.forEach(booking => {
            serviceCounts[booking.service] = (serviceCounts[booking.service] || 0) + 1;
        });

        const pieData = Object.keys(serviceCounts).map(service => ({
            name: service,
            value: serviceCounts[service],
            color: `#${Math.floor(Math.random() * 16777215).toString(16)}` // Random colors for now
        }));

        // Top Service Providers (based on job count)
        const providerStats = {};
        allBookings.forEach(booking => {
            if (booking.provider && booking.provider._id) {
                const providerId = booking.provider._id.toString();
                providerStats[providerId] = (providerStats[providerId] || 0) + 1;
            }
        });

        const sortedProviderIds = Object.keys(providerStats).sort((a, b) => providerStats[b] - providerStats[a]).slice(0, 3);
        const topProviders = await Promise.all(sortedProviderIds.map(async (id) => {
            const provider = await authModel.findById(id);
            return {
                id: provider._id,
                name: `${provider.firstName} ${provider.lastName}`,
                service: provider.serviceCategory || 'Service',
                rating: 5.0, // Placeholder as rating system is not yet implemented
                jobs: providerStats[id]
            };
        }));

        // Recent Bookings
        const recentBookings = allBookings.slice(0, 5).map(b => ({
            id: b._id,
            customer: `${b.customer?.firstName} ${b.customer?.lastName}`,
            service: b.service,
            status: b.status,
            statusColor: b.status === 'Completed' ? 'bg-green-100 text-green-700' :
                b.status === 'Pending' ? 'bg-orange-100 text-orange-700' :
                    'bg-blue-100 text-blue-700'
        }));

        res.status(200).json({
            success: true,
            stats: {
                totalBookings: totalBookingsCount,
                activeUsers: customersCount,
                serviceProviders: providersCount,
                revenue: totalRevenue
            },
            chartData,
            pieData: pieData.length > 0 ? pieData : [{ name: 'No Data', value: 1, color: '#CBD5E1' }],
            recentBookings,
            topProviders
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getProviderStats = async (req, res) => {
    try {
        const providerId = req.params.id;
        const bookings = await bookingModel.find({ provider: providerId }).populate('customer', 'firstName lastName');

        const totalBookings = bookings.length;
        const pendingRequests = bookings.filter(b => b.status === 'Pending').length;
        const totalEarnings = 0; // Set to 0 as requested

        // Earnings Trends (last 6 months)
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const currentYear = new Date().getFullYear();
        const monthlyEarnings = Array(12).fill(0);

        bookings.forEach(booking => {
            if (booking.status === 'Completed') {
                const date = new Date(booking.createdAt);
                if (date.getFullYear() === currentYear) {
                    monthlyEarnings[date.getMonth()] += 0; // Set to 0 as requested
                }
            }
        });

        const earningsData = months.map((name, index) => ({
            name,
            earnings: monthlyEarnings[index]
        })).slice(-6);

        // Service Distribution (for this provider's services)
        const serviceCounts = {};
        bookings.forEach(booking => {
            serviceCounts[booking.service] = (serviceCounts[booking.service] || 0) + 1;
        });

        const pieData = Object.keys(serviceCounts).map(service => ({
            name: service,
            value: serviceCounts[service],
            color: `#${Math.floor(Math.random() * 16777215).toString(16)}`
        }));

        // Recent Bookings
        const recentBookings = bookings.slice(0, 5).map(b => ({
            id: b._id,
            name: `${b.customer?.firstName} ${b.customer?.lastName}`,
            service: b.service,
            amount: `Rs ${b.amount}`,
            status: b.status,
            statusColor: b.status === 'Completed' ? 'bg-gray-100 text-gray-700' :
                b.status === 'Pending' ? 'bg-orange-100 text-orange-700' :
                    b.status === 'Confirmed' ? 'bg-green-100 text-green-700' :
                        'bg-blue-100 text-blue-700'
        }));

        res.status(200).json({
            success: true,
            stats: {
                totalBookings,
                pendingRequests,
                totalEarnings,
                averageRating: 5.0 // Placeholder
            },
            earningsData,
            pieData: pieData.length > 0 ? pieData : [{ name: 'No Data', value: 1, color: '#CBD5E1' }],
            recentBookings
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    createBooking,
    getCustomerBookings,
    getCustomerStats,
    getAdminStats,
    getProviderStats
};
