// const mongoose = require('mongoose');

// const messageSchema = new mongoose.Schema({
//     sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//     receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//     content: String,
//     timestamp: { type: Date, default: Date.now },
//     isRead: { type: Boolean, default: false },
// });

// const MessageModel = mongoose.model('Message', messageSchema);
// module.exports = MessageModel;

const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    conversationId:{
        type:String
    },
    senderId: {
        type:String
    },
    receiverId: {
        type:String
    },
    message:{
        type:String
    },
    isRead: { type: Boolean, default: false },
    timestamp: { type: Date, default: Date.now },
});

const MessageModel = mongoose.model('Message', messageSchema);
module.exports = MessageModel;
