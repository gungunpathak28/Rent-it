import Chat from "../models/chatModel.js";
import Message from "../models/messageModel.js";
import Item from "../models/Item.js";

export const startChat = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const { itemId } = req.params;

    const item = await Item.findById(itemId);
    if (!item) return res.status(404).json({ message: "Item not found" });

    const ownerId = item.ownerId; // The owner of the item

    if (userId.toString() === ownerId.toString()) {
      return res.status(400).json({ message: "Cannot chat with yourself" });
    }

    // Check if chat already exists
    let chat = await Chat.findOne({
      users: { $all: [userId, ownerId] },
      item: itemId
    });

    if (!chat) {
      chat = await Chat.create({
        users: [userId, ownerId],
        item: itemId,
        lastMessage: "Chat started"
      });
    }

    res.json({ success: true, chatId: chat._id });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getChats = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const chats = await Chat.find({ users: userId })
      .populate("users", "name profileImage")
      .populate("item", "name image")
      .sort({ updatedAt: -1 });

    res.json(chats);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const messages = await Message.find({ chatId }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { chatId, text } = req.body;
    const sender = req.user.id || req.user._id;

    const message = await Message.create({ chatId, sender, text });

    await Chat.findByIdAndUpdate(chatId, { lastMessage: text });

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
