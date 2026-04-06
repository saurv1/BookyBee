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

        const messageStats = await messageModel.aggregate([
            {
                $match: {
                    $or: [
                        { sender: myId },
                        { receiver: myId }
                    ]
                }
            },
            { $sort: { createdAt: -1 } },
            {
                $group: {
                    _id: {
                        $cond: [
                            { $gt: ["$sender", "$receiver"] },
                            { u1: "$sender", u2: "$receiver" },
                            { u1: "$receiver", u2: "$sender" }
                        ]
                    },
                    lastMessage: { $first: "$message" },
                    timestamp: { $first: "$createdAt" },
                    senderId: { $first: "$sender" },
                    receiverId: { $first: "$receiver" }
                }
            }
        ]);

        const chatUsers = await Promise.all(messageStats.map(async (stat) => {
            const otherUserId = stat.senderId.toString() === myId.toString() ? stat.receiverId : stat.senderId;
            const otherUser = await authModel.findById(otherUserId).select('firstName lastName').lean();
            return {
                _id: otherUser._id,
                firstName: otherUser.firstName,
                lastName: otherUser.lastName,
                lastMessage: stat.lastMessage,
                timestamp: stat.timestamp
            };
        }));

        res.status(200).json({ success: true, data: chatUsers });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    sendMessage,
    getMessages,
    getChatList
};
