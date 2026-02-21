const messageModel = require('../model/messageModel');
const notificationModel = require('../model/notificationModel');
const authModel = require('../model/authModel');

const sendMessage = async (req, res) => {
    try {
        const { receiverId, message } = req.body;
        const senderId = req.user._id;

        if (!receiverId || !message) {
            return res.status(400).json({ success: false, message: "Receiver and message are required" });
        }

        const newMessage = await messageModel.create({
            sender: senderId,
            receiver: receiverId,
            message: message
        });

        const sender = await authModel.findById(senderId);

        // Create notification for receiver
        await notificationModel.create({
            userId: receiverId,
            title: 'New Message',
            message: `${sender.firstName} sent you a message: "${message.substring(0, 50)}${message.length > 50 ? '...' : ''}"`,
            type: 'chat'
        });

        res.status(201).json({ success: true, data: newMessage });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getMessages = async (req, res) => {
    try {
        const { userId } = req.params;
        const myId = req.user._id;

        const messages = await messageModel.find({
            $or: [
                { sender: myId, receiver: userId },
                { sender: userId, receiver: myId }
            ]
        }).sort({ createdAt: 1 });

        res.status(200).json({ success: true, data: messages });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getChatList = async (req, res) => {
    try {
        const myId = req.user._id;

        // Find all unique users I have chatted with
        const messages = await messageModel.find({
            $or: [{ sender: myId }, { receiver: myId }]
        }).populate('sender receiver', 'firstName lastName firstName lastName');

        const chatUsers = new Map();

        messages.forEach(msg => {
            const otherUser = msg.sender._id.toString() === myId.toString() ? msg.receiver : msg.sender;
            chatUsers.set(otherUser._id.toString(), {
                _id: otherUser._id,
                firstName: otherUser.firstName,
                lastName: otherUser.lastName,
                lastMessage: msg.message,
                timestamp: msg.createdAt
            });
        });

        res.status(200).json({ success: true, data: Array.from(chatUsers.values()) });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    sendMessage,
    getMessages,
    getChatList
};
