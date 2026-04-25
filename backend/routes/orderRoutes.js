import express from "express";
import { getMyOrders } from "../controllers/orderController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/my-orders", protect, getMyOrders);

export default router;
