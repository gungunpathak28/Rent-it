import express from "express";
import { startChat, getChats, getMessages, sendMessage } from "../controllers/chatController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/start/:itemId", protect, startChat);
router.get("/", protect, getChats);
router.get("/message/:chatId", protect, getMessages);
router.post("/message", protect, sendMessage);

export default router;
