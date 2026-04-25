import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js";
import itemRoutes from "./routes/items.js";
import bookingRoutes from "./routes/bookings.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import chatbotRoutes from "./routes/chatbot.js";
import userRoutes from "./routes/userRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import trackingRoutes from "./routes/trackingRoutes.js";
import Booking from "./models/Booking.js";
import PaymentConfig from "./models/PaymentConfig.js";

import User from "./models/User.js";
import Order from "./models/Order.js";
import orderRoutes from "./routes/orderRoutes.js";
import feedbackRoutes from "./routes/feedbackRoutes.js";

// Load env variables
dotenv.config();

const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/rentit");

console.log("MongoDB Connected");

// Middleware
app.use(cors({
  origin: "*", // Allows Vercel frontend to connect in production
  credentials: true
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/users", userRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/tracking", trackingRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/feedback", feedbackRoutes);

// Hackathon Admin Payment System API
app.get("/api/payment/config", async (req, res) => {
  try {
    let config = await PaymentConfig.findOne();
    if (!config) {
      config = await PaymentConfig.create({}); // Generate default if none found
    }
    res.json(config);
  } catch (err) {
    res.status(500).json({ message: "Server error fetching config" });
  }
});

app.post("/api/payment/config", async (req, res) => {
  try {
    const { upiId, qrImage } = req.body;
    let config = await PaymentConfig.findOne();
    if (config) {
      config.upiId = upiId;
      config.qrImage = qrImage;
      await config.save();
    } else {
      config = await PaymentConfig.create({ upiId, qrImage });
    }
    res.json(config);
  } catch (err) {
    res.status(500).json({ message: "Server error saving config" });
  }
});

// Hackathon Real Payment API Mapping 
app.post("/api/payment/confirm/:bookingId", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    booking.paymentStatus = "Paid";
    booking.status = "confirmed";
    await booking.save();
    
    // Create Order system record
    const order = await Order.create({
        userId: booking.userId,
        itemId: booking.itemId,
        amount: booking.totalAmount,
        status: "paid"
    });

    // Update user's totalSpent
    const user = await User.findById(booking.userId);
    if (user) {
        user.totalSpent = (user.totalSpent || 0) + booking.totalAmount;
        await user.save();
    }

    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ message: "Server error confirming payment", error: err.message });
  }
});

// Health check route
app.get("/", (req, res) => {
  res.json({ message: "RentIt API is running" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!", error: err.message });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});