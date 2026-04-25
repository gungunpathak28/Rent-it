import express from "express";
import { getCart, addToCart, removeFromCart } from "../controllers/cartController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// All cart actions require authentication
router.use(protect);

router.get("/", getCart);
router.post("/add", addToCart);
router.delete("/remove", removeFromCart);

export default router;
