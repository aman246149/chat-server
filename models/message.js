const mongoose = require('mongoose');

//define status of message as enum
const status = ['sent', 'delivered', 'read', 'unread'];

const messageSchema = new mongoose.Schema({
    message: { type: String, required: true },
    sender: { type: String, required: true },
    receiverStatus: { type: String, default: 'unread' },
    senderStatus: { type: String, default: 'sent' },
    receiver: { type: String, required: true },
    timestamp: { type: Number, default: Date.now },
});

const Message = mongoose.model('Message', messageSchema);

module.exports = { Message, messageSchema };