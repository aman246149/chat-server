const mongoose = require('mongoose');
const { messageSchema } = require('./message');
const { Schema } = mongoose;


const userGroupsSchema = new mongoose.Schema({
    groupId: { type: String, required: true },
    name: { type: String, default: '' },
    limit: { type: Number, default: 2 },
    messages: [{ type: Schema.Types.ObjectId, ref: 'Message' }] // This should now be correctly defined
});

const UserGroups = mongoose.model('UserGroups', userGroupsSchema);

module.exports = UserGroups;