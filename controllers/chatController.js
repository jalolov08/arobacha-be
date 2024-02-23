const Chat = require("../models/Chat");
const Message = require("../models/Message");
const { getReceiverSocketId, io } = require("../socket/socket");
async function sendMessage(req, res) {
  try {
    const { id: receiverId } = req.params;
    const { message } = req.body;
    const senderId = req.user._id;

    let chat = await Chat.findOne({
      participants: { $all: [senderId, receiverId] },
    });
    if (!chat) {
      chat = await Chat.create({
        participants: [senderId, receiverId],
      });
    }
    const newMessage = new Message({
      senderId,
      receiverId,
      message,
    });
    if (newMessage) {
      chat.messages.push(newMessage._id);
    }
    await Promise.all([chat.save(), newMessage.save()]);

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", { message: newMessage });
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
async function getMessages(req, res) {
  try {
    const { id: userToChatId } = req.params;
    const senderId = req.user._id;
    const chat = await Chat.findOne({
      participants: { $all: [senderId, userToChatId] },
    }).populate("messages");
    if (!chat) return res.status(200).json([]);
    const messages = chat.messages;
    res.status(200).json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
module.exports = {
  sendMessage,
  getMessages,
};
