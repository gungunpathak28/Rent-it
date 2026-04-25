import express from "express";
import { analyzePrice } from "../utils/priceAnalyzer.js";
import { predictDemand } from "../controllers/aiController.js";
import Booking from "../models/Booking.js";
const router = express.Router();

router.post("/analyze-price", (req, res) => {
  const { price, category } = req.body;
  if (!price || !category) {
      return res.status(400).json({ message: "Price and category required" });
  }
  const result = analyzePrice(price, category);
  res.json(result);
});

router.get("/predict/:itemId", predictDemand);

export default router;
