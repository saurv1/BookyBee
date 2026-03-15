const Complaint = require('../model/complaintModel');
const User = require('../model/authModel');
const sendEmail = require('../Services/sendEmail');

exports.createComplaint = async (req, res) => {
    try {
        const { subject, message } = req.body;
        const userId = req.user.id;

        const complaint = new Complaint({
            user: userId,
            subject,
            message
        });

        await complaint.save();

        // Get user details for the email
        const user = await User.findById(userId);

        // Send email to Admin
        const adminEmail = process.env.ADMIN_EMAIL || "bookybee.service@gmail.com";
        await sendEmail({
            email: adminEmail,
            subject: `New Complaint: ${subject}`,
            message: `You have received a new complaint from ${user.firstName} ${user.lastName} (${user.email}).\n\nSubject: ${subject}\n\nMessage:\n${message}`
        });

        // Send confirmation email to user
        await sendEmail({
            email: user.email,
            subject: `Complaint Received: ${subject}`,
            message: `Hi ${user.firstName},\n\nWe have received your complaint regarding "${subject}". Our team will look into it and get back to you soon.\n\nThank you for your patience.\n\nBest regards,\nBookyBee Team`
        });

        res.status(201).json({
            success: true,
            message: "Complaint submitted successfully and email notification sent.",
            complaint
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Failed to submit complaint"
        });
    }
};

exports.getAllComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find().populate('user', 'firstName lastName email role').sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            complaints
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch complaints"
        });
    }
};

exports.updateComplaintStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const complaint = await Complaint.findByIdAndUpdate(id, { status }, { new: true });

        res.status(200).json({
            success: true,
            message: `Complaint status updated to ${status}`,
            complaint
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to update complaint status"
        });
    }
};
