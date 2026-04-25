import express from "express";
import { addReview, getItemReviews } from "../controllers/reviewController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/add", protect, addReview);
router.get("/:itemId", getItemReviews);

export default router;
