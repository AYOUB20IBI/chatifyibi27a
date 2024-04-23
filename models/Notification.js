const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    conversationId: { type: String, required: true },
    senderId: { type: String, required: true },
    receiverId: { type: String, required: true },
    unreadCount: { type: Number, default: 0 },
});

const NotificationModel = mongoose.model('Notification', notificationSchema);

module.exports = NotificationModel;
