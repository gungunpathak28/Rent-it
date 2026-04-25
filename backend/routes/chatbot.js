import express from "express";
import { getBotResponse } from "../controllers/chatbotController.js";
import { optionalProtect } from "../middleware/auth.js";

const router = express.Router();

router.post("/", optionalProtect, getBotResponse);

export default router;
