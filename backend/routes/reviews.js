import express from "express";
import { createReview, getItemReviews } from "../controllers/reviewController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect, authorize("renter"), createReview);
router.get("/item/:itemId", getItemReviews);

export default router;
