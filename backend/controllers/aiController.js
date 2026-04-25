import Booking from "../models/Booking.js";
import Item from "../models/Item.js";
import mongoose from "mongoose";

export const predictDemand = async (req, res) => {
  try {
    const { itemId } = req.params;

    // ✅ validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      return res.status(400).json({ message: "Invalid Item ID" });
    }

    // ✅ find item
    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // ✅ safe booking fetch
    let bookings = [];
    try {
      bookings = await Booking.find({
        $or: [
          { item: itemId },
          { itemId: itemId }
        ]
      });
    } catch (err) {
      console.log("Booking fetch error:", err.message);
      bookings = [];
    }

    const totalBookings = bookings.length;

    // ✅ demand logic
    let demand = "LOW";
    if (totalBookings > 5) demand = "HIGH";
    else if (totalBookings > 2) demand = "MEDIUM";

    // ✅ dynamic pricing
    let suggestedPrice = item.pricePerDay || 0;

    if (demand === "HIGH") {
      suggestedPrice *= 1.25;
    } else if (demand === "LOW") {
      suggestedPrice *= 0.9;
    }

    res.json({
      demand,
      suggestedPrice: Math.round(suggestedPrice),
      totalBookings
    });

  } catch (error) {
    console.log("AI ERROR:", error.message);

    // ✅ fallback (VERY IMPORTANT)
    res.json({
      demand: "LOW",
      suggestedPrice: 0,
      totalBookings: 0
    });
  }
};
