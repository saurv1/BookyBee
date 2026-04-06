const bookingModel = require('../model/bookingModel');
const authModel = require('../model/authModel');
const notificationModel = require('../model/notificationModel');
const reviewModel = require('../model/reviewModel');
const complaintModel = require('../model/complaintModel');

const createBooking = async (req, res) => {
    try {
        const { service, provider, date, time, amount, message } = req.body;
        const customerId = req.user._id;
        const customer = await authModel.findById(customerId);

        const newBooking = new bookingModel({
            customer: customerId,
            service,
            provider,
            date,
            time,
            amount,
            message
        });

        await newBooking.save();

        // Create notification for provider
        await notificationModel.create({
            userId: provider,
            title: 'New Booking Request',
            message: `${customer.firstName} ${customer.lastName} has requested a ${service} service on ${date} at ${time}.`,
            type: 'booking',
            bookingId: newBooking._id
        });

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
        const currentYear = new Date().getFullYear();

        const [stats, aggregationResult] = await Promise.all([
            bookingModel.aggregate([
                { $match: { customer: new mongoose.Types.ObjectId(customerId) } },
                {
                    $group: {
                        _id: null,
                        totalBookings: { $sum: 1 },
                        pendingServices: {
                            $sum: { $cond: [{ $in: ["$status", ["Pending", "Confirmed"]] }, 1, 0] }
                        },
                        completedCount: {
                            $sum: { $cond: [{ $eq: ["$status", "Completed"] }, 1, 0] }
                        },
                        totalSpent: {
                            $sum: { $cond: [{ $eq: ["$status", "Completed"] }, "$amount", 0] }
                        }
                    }
                }
            ]),
            bookingModel.aggregate([
                {
                    $match: {
                        customer: new mongoose.Types.ObjectId(customerId),
                        status: "Completed",
                        createdAt: { $gte: new Date(currentYear, 0, 1) }
                    }
                },
                {
                    $group: {
                        _id: { $month: "$createdAt" },
                        amount: { $sum: "$amount" }
                    }
                }
            ])
        ]);

        const dashboardStats = stats[0] || { totalBookings: 0, pendingServices: 0, completedCount: 0, totalSpent: 0 };
        
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const spendingData = months.map((name, index) => {
            const monthData = aggregationResult.find(item => item._id === (index + 1));
            return { name, amount: monthData ? monthData.amount : 0 };
        });

        res.status(200).json({
            success: true,
            stats: {
                totalBookings: dashboardStats.totalBookings,
                pendingServices: dashboardStats.pendingServices,
                completed: dashboardStats.completedCount,
                totalSpent: dashboardStats.totalSpent
            },
            spendingData
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getAdminStats = async (req, res) => {
    try {
        const [totalBookingsCount, customersCount, providersCount, recentBookingsData, allUsers, pendingComplaintsCount, completedStats] = await Promise.all([
            bookingModel.countDocuments(),
            authModel.countDocuments({ role: 'customer' }),
            authModel.countDocuments({ role: { $in: ['provider', 'serviceprovider'] } }),
            bookingModel.find()
                .populate('customer', 'firstName lastName')
                .populate('provider', 'firstName lastName serviceCategory')
                .sort({ createdAt: -1 })
                .limit(5)
                .lean(),
            authModel.find({ role: { $in: ['provider', 'serviceprovider'] } }).limit(3).lean(),
            complaintModel.countDocuments({ status: 'Pending' }),
            bookingModel.aggregate([
                { $match: { status: 'Completed' } },
                { $group: { _id: null, totalTransactions: { $sum: "$amount" } } }
            ])
        ]);

        const totalTransactions = completedStats[0]?.totalTransactions || 0;
        const totalRevenue = totalTransactions * 0.1; // 10% Commission as platform revenue

        // Simple growth tracking
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        // Get service distribution (Aggregation is faster than JS for filtering large datasets)
        const serviceStats = await bookingModel.aggregate([
            { $group: { _id: "$service", count: { $sum: 1 } } }
        ]);

        const COLORS = ['#FFB800', '#6366F1', '#10B981', '#F43F5E', '#8B5CF6', '#06B6D4'];
        const pieData = serviceStats.map((stat, index) => ({
            name: stat._id || 'Other',
            value: stat.count,
            color: COLORS[index % COLORS.length]
        }));

        // Recent Bookings
        const recentBookings = recentBookingsData.map(b => ({
            id: b._id,
            customer: b.customer ? `${b.customer.firstName} ${b.customer.lastName}` : "User",
            service: b.service,
            status: b.status,
            statusColor: b.status === 'Completed' ? 'bg-green-100 text-green-700' :
                        b.status === 'Pending' ? 'bg-orange-100 text-orange-700' :
                        b.status === 'Confirmed' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
        }));

        // Top Providers (Simplified)
        const topProvidersData = allUsers.map(u => ({
            id: u._id,
            name: `${u.firstName} ${u.lastName}`,
            service: u.serviceCategory || 'Service',
            rating: 5.0,
            jobs: 0 // Fetch count separately if needed but for dashboard, 0 or pre-calculated is faster
        }));

        const bookingGrowthCount = await bookingModel.countDocuments({ createdAt: { $gte: startOfMonth } });

        res.status(200).json({
            success: true,
            stats: {
                totalBookings: totalBookingsCount,
                activeUsers: customersCount,
                serviceProviders: providersCount,
                revenue: totalRevenue,
                bookingGrowth: `+${bookingGrowthCount}`,
                revenueGrowth: 'Dynamic',
                pendingComplaints: pendingComplaintsCount
            },
            chartData: [], // Reverting as requested or keeping empty if not used
            pieData: pieData.length > 0 ? pieData : [{ name: 'No Data', value: 1, color: '#CBD5E1' }],
            recentBookings,
            topProviders: topProvidersData
        });
    } catch (error) {
        console.error("Admin Stats Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const getAdminAnalytics = async (req, res) => {
    try {
        const [allBookings, allUsers, allReviews, allComplaints] = await Promise.all([
            bookingModel.find().populate('customer', 'role').populate('provider', 'serviceCategory'),
            authModel.find(),
            reviewModel.find(),
            complaintModel.find()
        ]);

        const now = new Date();
        const currentYear = now.getFullYear();

        // 1. Monthly Revenue & Bookings (Time Series)
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const timeSeriesData = months.map((name, index) => {
            const monthlyBookings = allBookings.filter(b => {
                const d = new Date(b.createdAt);
                return d.getMonth() === index && d.getFullYear() === currentYear;
            });
            const transactions = monthlyBookings.filter(b => b.status === 'Completed').reduce((ss, b) => ss + (b.amount || 0), 0);
            const revenue = transactions * 0.1; // 10% Commission
            return { name, bookings: monthlyBookings.length, revenue };
        });

        // 2. Booking Status Distribution
        const statuses = ['Pending', 'Confirmed', 'Completed', 'Cancelled', 'Rejected'];
        const statusData = statuses.map(status => ({
            name: status,
            value: allBookings.filter(b => b.status === status).length
        }));

        // 3. User Growth (Last 6 Months)
        const userGrowthData = [];
        for (let i = 5; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const mName = months[d.getMonth()];
            const count = allUsers.filter(u => new Date(u.createdAt) <= new Date(now.getFullYear(), now.getMonth() - i + 1, 0)).length;
            userGrowthData.push({ name: mName, users: count });
        }

        // 4. Category Performance
        const categoryStats = {};
        allBookings.forEach(b => {
            const cat = b.provider?.serviceCategory || 'Uncategorized';
            if (!categoryStats[cat]) categoryStats[cat] = { bookings: 0, revenue: 0 };
            categoryStats[cat].bookings++;
            if (b.status === 'Completed') categoryStats[cat].revenue += (b.amount || 0) * 0.1; // 10% Commission
        });

        const categoryData = Object.keys(categoryStats).map(cat => ({
            name: cat,
            bookings: categoryStats[cat].bookings,
            revenue: categoryStats[cat].revenue
        })).sort((a, b) => b.revenue - a.revenue).slice(0, 5);

        // 5. Satisfaction Stats
        const avgRating = allReviews.length > 0 ? (allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length).toFixed(1) : 0;
        const complaintResolutionRate = allComplaints.length > 0 ? ((allComplaints.filter(c => c.status === 'Resolved').length / allComplaints.length) * 100).toFixed(0) : 100;

        res.status(200).json({
            success: true,
            timeSeriesData,
            statusData,
            userGrowthData,
            categoryData,
            summary: {
                avgRating: parseFloat(avgRating),
                complaintResolutionRate: parseInt(complaintResolutionRate),
                totalUsers: allUsers.length,
                totalBookings: allBookings.length
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getProviderStats = async (req, res) => {
    try {
        const providerId = req.params.id;
        const currentYear = new Date().getFullYear();

        const [generalStats, aggregationResult, recentBookingsData, reviewsData] = await Promise.all([
            bookingModel.aggregate([
                { $match: { provider: new mongoose.Types.ObjectId(providerId) } },
                {
                    $group: {
                        _id: null,
                        totalBookings: { $sum: 1 },
                        pendingRequests: {
                            $sum: { $cond: [{ $eq: ["$status", "Pending"] }, 1, 0] },
                        },
                        averageRating: { $avg: "$rating" },
                        totalEarnings: {
                            $sum: { $cond: [{ $eq: ["$status", "Completed"] }, 0, 0] } // Setting to 0 as requested in code
                        }
                    }
                }
            ]),
            bookingModel.aggregate([
                { $match: { provider: new mongoose.Types.ObjectId(providerId) } },
                { $group: { _id: "$service", count: { $sum: 1 } } }
            ]),
            bookingModel.find({ provider: providerId })
                .populate('customer', 'firstName lastName')
                .sort({ createdAt: -1 })
                .limit(5)
                .lean(),
            bookingModel.find({ provider: providerId, rating: { $exists: true, $ne: null } })
                .populate('customer', 'firstName lastName')
                .sort({ updatedAt: -1 })
                .limit(5)
                .lean()
        ]);

        const stats = generalStats[0] || { totalBookings: 0, pendingRequests: 0, totalEarnings: 0, averageRating: 0 };
        
        // Months for earnings trends (last 6 months)
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const earningsData = months.map((name, index) => ({
            name,
            earnings: 0 // Set to 0 as requested
        })).slice(-6);

        const pieData = aggregationResult.map(item => ({
            name: item._id,
            value: item.count,
            color: `#${Math.floor(Math.random() * 16777215).toString(16)}`
        }));

        const recentBookings = recentBookingsData.map(b => ({
            id: b._id,
            name: `${b.customer?.firstName} ${b.customer?.lastName}`,
            service: b.service,
            amount: `Rs ${b.amount}`,
            status: b.status,
            message: b.message,
            statusColor: b.status === 'Completed' ? 'bg-gray-100 text-gray-700' :
                b.status === 'Pending' ? 'bg-orange-100 text-orange-700' :
                    b.status === 'Confirmed' ? 'bg-green-100 text-green-700' :
                        b.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                            'bg-blue-100 text-blue-700'
        }));

        const reviews = reviewsData.map(b => ({
            id: b._id,
            name: `${b.customer?.firstName} ${b.customer?.lastName}`,
            rating: b.rating,
            comment: 'No comment provided',
            date: new Date(b.updatedAt).toLocaleDateString()
        }));

        res.status(200).json({
            success: true,
            stats: {
                totalBookings: stats.totalBookings,
                pendingRequests: stats.pendingRequests,
                totalEarnings: stats.totalEarnings,
                averageRating: parseFloat((stats.averageRating || 0).toFixed(1))
            },
            earningsData,
            pieData: pieData.length > 0 ? pieData : [{ name: 'No Data', value: 1, color: '#CBD5E1' }],
            recentBookings,
            reviews
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const rateBooking = async (req, res) => {
    try {
        const { bookingId, rating } = req.body;
        const customerId = req.user._id;

        const booking = await bookingModel.findOne({ _id: bookingId, customer: customerId });

        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found or you are not authorized' });
        }

        if (booking.status !== 'Completed') {
            return res.status(400).json({ success: false, message: 'You can only rate completed bookings' });
        }

        booking.rating = rating;
        await booking.save();

        res.status(200).json({ success: true, message: 'Rating submitted successfully', booking });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateBookingStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const providerId = req.user._id;

        const booking = await bookingModel.findById(id);

        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        // Only the assigned provider can update status (or admin)
        if (booking.provider.toString() !== providerId.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Not authorized to update this booking' });
        }

        booking.status = status;
        await booking.save();

        res.status(200).json({ success: true, message: `Booking status updated to ${status}`, booking });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getProviderBookings = async (req, res) => {
    try {
        const providerId = req.params.id;
        const bookings = await bookingModel.find({ provider: providerId }).populate('customer', 'firstName lastName phone email address');
        res.status(200).json({ success: true, bookings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getAllBookings = async (req, res) => {
    try {
        const bookings = await bookingModel.find()
            .populate('customer', 'firstName lastName phone email')
            .populate('provider', 'firstName lastName phone email')
            .sort({ createdAt: -1 });
        res.status(200).json({ success: true, bookings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getBookingById = async (req, res) => {
    try {
        const { id } = req.params;
        const booking = await bookingModel.findById(id)
            .populate('customer', 'firstName lastName phone email address')
            .populate('provider', 'firstName lastName phone email serviceCategory price');
        
        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }
        
        res.status(200).json({ success: true, booking });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    createBooking,
    getBookingById,
    getCustomerBookings,
    getCustomerStats,
    getAdminStats,
    getAdminAnalytics,
    getProviderStats,
    getProviderBookings,
    rateBooking,
    updateBookingStatus,
    getAllBookings
};
