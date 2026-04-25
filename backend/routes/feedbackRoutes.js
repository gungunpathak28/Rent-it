import express from "express";
import { addFeedback } from "../controllers/feedbackController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect, addFeedback);

export default router;
