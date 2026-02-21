const notificationModel = require('../model/notificationModel');

const getNotifications = async (req, res) => {
    try {
        const userId = req.user._id;
        const notifications = await notificationModel.find({ userId })
            .sort({ createdAt: -1 })
            .limit(20);

        const unreadCount = await notificationModel.countDocuments({ userId, isRead: false });

        res.status(200).json({ success: true, data: notifications, unreadCount });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        await notificationModel.findByIdAndUpdate(id, { isRead: true });
        res.status(200).json({ success: true, message: "Notification marked as read" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const markAllAsRead = async (req, res) => {
    try {
        const userId = req.user._id;
        await notificationModel.updateMany({ userId, isRead: false }, { isRead: true });
        res.status(200).json({ success: true, message: "All notifications marked as read" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const markByTypeAsRead = async (req, res) => {
    try {
        const userId = req.user._id;
        const { type } = req.params;
        await notificationModel.updateMany({ userId, type, isRead: false }, { isRead: true });
        res.status(200).json({ success: true, message: `All ${type} notifications marked as read` });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getNotifications,
    markAsRead,
    markAllAsRead,
    markByTypeAsRead
};
