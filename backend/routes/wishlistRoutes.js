import express from "express";
import { toggleWishlist, getWishlist } from "../controllers/wishlistController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/toggle/:itemId", protect, toggleWishlist);
router.get("/", protect, getWishlist);

export default router;
