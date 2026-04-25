import express from "express";
import Booking from "../models/Booking.js";

const router = express.Router();

router.put("/update/:bookingId", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.trackingStatus = req.body.trackingStatus;
    booking.location = req.body.location;

    await booking.save();

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
