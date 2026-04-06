const jobModel = require('../model/serviceModel');
const authModel = require('../model/authModel');
const bookingModel = require('../model/bookingModel');

const createService = async (req, res) => {
    try {
        const { service, description, location, price } = req.body;
        if (!service || !description || !location || !price) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newService = await jobModel.create({
            service,
            description,
            location,
            price,
            UserId: req.user._id
        });

        return res.status(201).json({
            message: "Service created successfully",
            data: newService
        });

    } catch (error) {
        return res.status(500).json({ message: "Something went wrong", error: error.message });
    }

}
exports.createService = createService;



const getAllServices = async (req, res) => {
    try {
        const services = await jobModel.find().populate("UserId", "firstName lastName email").lean();

        return res.status(200).json({
            message: "Services fetched successfully",
            data: services
        });

    } catch (error) {
        return res.status(500).json({ message: "Something went wrong", error: error.message });
    }
}
exports.getAllServices = getAllServices;




const getSingleService = async (req, res) => {
    try {
        const serviceId = req.params.id;

        let service = await jobModel.findById(serviceId).populate("UserId", "firstName lastName email phone address isAvailable");

        if (!service) {
            // Check if it's a provider's user ID directly
            const provider = await authModel.findOne({ _id: serviceId, role: 'provider' });
            if (provider) {
                service = {
                    _id: provider._id,
                    service: provider.serviceCategory,
                    description: "Professional " + provider.serviceCategory + " services.",
                    location: provider.address || "Location not specified",
                    price: provider.price,
                    UserId: provider
                };
            }
        }

        if (!service) {
            return res.status(404).json({ message: "Service not found" });
        }

        return res.status(200).json({
            message: "Service fetched successfully",
            data: service
        });

    } catch (error) {
        return res.status(500).json({ message: "Something went wrong", error: error.message });
    }
}
exports.getSingleService = getSingleService;




const updateService = async (req, res) => {
    try {
        const serviceId = req.params.id;
        const { service, description, location, price } = req.body;

        const job = await jobModel.findById(serviceId);

        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }

        if (job.UserId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "You are not authorized to update this job" });
        }

        // job.title = title || job.title;
        // job.description = description || job.description;
        // job.location = location || job.location;
        // job.salary = salary || job.salary;
        // job.company = company || job.company;

        // await job.save();

        // Alternatively, using findByIdAndUpdate

        const updatedService = await jobModel.findByIdAndUpdate(serviceId, {
            service,
            description,
            location,
            price
        }, { new: true });

        return res.status(200).json({
            message: "Service updated successfully",
            data: updatedService
        });

    } catch (error) {
        return res.status(500).json({ message: "Something went wrong", error: error.message });
    }
}

exports.updateService = updateService;


const deleteService = async (req, res) => {
    try {
        const serviceId = req.params.id;

        const service = await jobModel.findById(serviceId);

        if (!service) {
            return res.status(404).json({ message: "Service not found" });
        }

        if (service.UserId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "You are not authorized to delete this service" });
        }

        await jobModel.findByIdAndDelete(serviceId);

        return res.status(200).json({
            message: "Service deleted successfully"
        });

    } catch (error) {
        return res.status(500).json({ message: "Something went wrong", error: error.message });
    }
}
exports.deleteService = deleteService;

const getAdminServices = async (req, res) => {
    try {
        const [servicesData, activeBookingStats, completedRevenueStats] = await Promise.all([
            authModel.aggregate([
                { $match: { role: 'provider' } },
                {
                    $group: {
                        _id: "$serviceCategory",
                        providerCount: { $sum: 1 }
                    }
                }
            ]),
            bookingModel.aggregate([
                { $match: { status: { $in: ['Pending', 'Confirmed'] } } },
                { $group: { _id: "$service", activeCount: { $sum: 1 } } }
            ]),
            bookingModel.aggregate([
                { $match: { status: 'Completed' } },
                { $group: { _id: "$service", revenue: { $sum: "$amount" }, totalCount: { $sum: 1 } } }
            ])
        ]);

        const servicesMap = {};

        // Merge stats
        servicesData.forEach(item => {
            const name = item._id || 'Other';
            servicesMap[name] = {
                name,
                providerCount: item.providerCount,
                bookingCount: 0,
                activeBookings: 0,
                revenue: 0
            };
        });

        activeBookingStats.forEach(item => {
            const name = item._id || 'Other';
            if (servicesMap[name]) {
                servicesMap[name].activeBookings = item.activeCount;
                servicesMap[name].bookingCount += item.activeCount;
            } else {
                servicesMap[name] = { name, providerCount: 0, bookingCount: item.activeCount, activeBookings: item.activeCount, revenue: 0 };
            }
        });

        completedRevenueStats.forEach(item => {
            const name = item._id || 'Other';
            if (servicesMap[name]) {
                servicesMap[name].revenue = item.revenue;
                servicesMap[name].bookingCount += item.totalCount;
            } else {
                servicesMap[name] = { name, providerCount: 0, bookingCount: item.totalCount, activeBookings: 0, revenue: item.revenue };
            }
        });

        const servicesResult = Object.values(servicesMap).sort((a, b) => b.providerCount - a.providerCount);

        return res.status(200).json({
            success: true,
            data: servicesResult
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

const getServicesByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        // Create a regex that handles both spaces and hyphens flexibly
        const normalizedCategory = category.replace(/[\s-]/g, '[\\s-]');
        const categoryRegex = new RegExp(normalizedCategory, 'i');

        // 1. Get explicit service listings and providers in parallel
        const [servicesListing, providersByProfile] = await Promise.all([
            jobModel.find({ service: { $regex: categoryRegex } })
                .populate("UserId", "firstName lastName email phone address serviceCategory price isAvailable")
                .lean(),
            authModel.find({
                role: 'provider',
                serviceCategory: { $regex: categoryRegex }
            }).lean()
        ]);

        // Get all unique provider IDs involved
        const providerIds = [
            ...new Set([
                ...servicesListing.map(s => s.UserId?._id.toString()).filter(Boolean),
                ...providersByProfile.map(p => p._id.toString())
            ])
        ];

        // Fetch ratings for all providers in one aggregate query
        const ratingStatsData = await bookingModel.aggregate([
            { $match: { provider: { $in: providerIds.map(id => new mongoose.Types.ObjectId(id)) }, rating: { $exists: true } } },
            { $group: { _id: "$provider", avgRating: { $avg: "$rating" }, totalCount: { $sum: 1 } } }
        ]);

        const ratingsMap = {};
        ratingStatsData.forEach(item => { ratingsMap[item._id.toString()] = { avg: item.avgRating, count: item.totalCount }; });

        // Combine them into a uniform format
        const combined = new Map();

        // Add listings first
        for (const s of servicesListing) {
            if (s.UserId) {
                const providerId = s.UserId._id.toString();
                const r = ratingsMap[providerId] || { avg: 0, count: 0 };

                combined.set(providerId, {
                    _id: s._id,
                    service: s.service,
                    description: s.description,
                    location: s.location,
                    price: s.price,
                    UserId: s.UserId,
                    rating: parseFloat(r.avg.toFixed(1)),
                    reviewCount: r.count
                });
            }
        }

        // Add providers from authModel if not already added
        for (const p of providersByProfile) {
            const providerId = p._id.toString();
            if (!combined.has(providerId)) {
                const r = ratingsMap[providerId] || { avg: 0, count: 0 };
                combined.set(providerId, {
                    _id: p._id,
                    service: p.serviceCategory,
                    description: "Professional " + p.serviceCategory + " services.",
                    location: p.address || "Location not specified",
                    price: p.price,
                    UserId: p,
                    rating: parseFloat(r.avg.toFixed(1)),
                    reviewCount: r.count
                });
            }
        }

        // Add providers from authModel if not already added
        for (const p of providersByProfile) {
            const providerId = p._id.toString();
            if (!combined.has(providerId)) {
                // Fetch bookings to calculate rating
                const bookings = await bookingModel.find({ provider: providerId, rating: { $exists: true } });
                const avgRating = bookings.length > 0
                    ? bookings.reduce((sum, b) => sum + b.rating, 0) / bookings.length
                    : 0;

                combined.set(providerId, {
                    _id: p._id, // Use user ID as listing ID if no listing exists
                    service: p.serviceCategory,
                    description: "Professional " + p.serviceCategory + " services.",
                    location: p.address || "Location not specified",
                    price: p.price,
                    UserId: {
                        _id: p._id,
                        firstName: p.firstName,
                        lastName: p.lastName,
                        email: p.email,
                        phone: p.phone,
                        address: p.address,
                        isAvailable: p.isAvailable
                    },
                    rating: parseFloat(avgRating.toFixed(1)),
                    reviewCount: bookings.length
                });
            }
        }

        return res.status(200).json({
            message: "Services fetched successfully",
            data: Array.from(combined.values())
        });
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong", error: error.message });
    }
}

exports.getAdminServices = getAdminServices;
exports.getServicesByCategory = getServicesByCategory;
