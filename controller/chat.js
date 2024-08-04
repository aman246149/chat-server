const { v4: uuidv4 } = require("uuid");

const UserGroups = require("../models/user_groups");
const { Message } = require("../models/message");

module.exports = (io) => {
    io.on("connection", (socket) => {
        console.log("A user connected: " + socket.id);

        // Join a group chat room
        socket.on("joinGroup", ({ groupName, userName }) => {
            socket.join(groupName);
            console.log(`${socket.id} joined ${groupName} as ${userName}`);
            socket.to(groupName).emit(userName, "is online");
        });

        // Listen for messages in a group chat
        socket.on("groupMessage", async ({ groupName, message, userName, senderId, receiverId }) => {
            console.log(`Message from ${socket.id} in ${groupName}: ${message}`);

            try {
                const newMessage = new Message({
                    message: message,
                    sender: senderId,
                    receiver: receiverId,
                });

                await newMessage.save();

                const updatedGroup = await UserGroups.findOneAndUpdate(
                    { groupId: groupName },
                    { $push: { messages: newMessage.id } },
                    { new: true }
                );

                if (!updatedGroup) {
                    console.log(`Group not found: ${groupName}`);
                    return;
                }

                console.log('Updated group:', updatedGroup);

                socket.to(groupName).emit("newMessage", {
                    sender: socket.id,
                    ...newMessage.toObject(),
                });
                socket.emit("newMessage", {
                    sender: socket.id,
                    ...newMessage.toObject(),
                });
            } catch (error) {
                console.error('Error processing message:', error);
            }
        });

        socket.on("disconnect", () => {
            console.log("User disconnected: " + socket.id);
        });
    });
};

//create user group
const createGroup = async (req, res) => {
    const { groupId, name, limit } = req.body;
    const group = new UserGroups({ groupId, name, limit });
    try {
        //check if group already exists
        const groupExists = await UserGroups.findOne({
            groupId,
        });
        if (groupExists) {
            return res.json(group);
        }
        await group.save();
        res.status(201).json(group);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

//get group By groupId
const getGroups = async (req, res) => {
    try {
        const { groupId } = req.body;
        const group = await UserGroups.findOne(groupId);
        res.json(group);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


//get messages by groupId
const getMessages = async (req, res) => {
    try {
        const groupId = req.query.groupId;
        console.log(groupId);
        const group = await UserGroups.findOne({ groupId: groupId }).populate('messages');
        res.json(group.messages);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
module.exports.createGroup = createGroup;
module.exports.getGroups = getGroups;
module.exports.getMessages = getMessages;
