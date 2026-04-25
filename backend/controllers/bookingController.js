import Booking from "../models/Booking.js";
import Item from "../models/Item.js";

export const createBooking = async (req, res) => {
  try {
    const item = await Item.findById(req.body.itemId);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    const { itemId, startDate, endDate, totalAmount, quantity, isInsured } = req.body;

    if (item.availableQuantity < (quantity || 1)) {
      return res.status(400).json({
        message: "Not enough stock available"
      });
    }

    const booking = await Booking.create({
      userId: req.user._id,
      itemId: itemId,
      startDate: startDate,
      endDate: endDate,
      totalAmount: totalAmount,
      quantity: quantity || 1,
      isInsured: isInsured || false,
      status: "completed",
      trackingStatus: "Preparing",
      location: "Warehouse",
      locationCoords: {
        lat: 28.6139,
        lng: 77.2090
      }
    });

    item.availableQuantity -= (quantity || 1);
    item.bookingCount = (item.bookingCount || 0) + 1;
    
    if (item.category === "Cameras & Photography") {
      item.category = "Cameras";
    }

    await item.save();

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id || req.user._id })
      .populate("itemId") // IMPORTANT
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOwnerBookings = async (req, res) => {
  try {
    const items = await Item.find({ owner: req.user.id || req.user._id });
    const ownerItemIds = items.map((item) => item._id);
    const bookings = await Booking.find({ itemId: { $in: ownerItemIds } })
      .populate("itemId")
      .populate("userId");

    res.json(bookings);
  } catch (err) {
    console.error("OWNER BOOKINGS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const { status, paymentStatus } = req.body;

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const previousStatus = booking.status;
    if (status) booking.status = status;
    if (paymentStatus) booking.paymentStatus = paymentStatus;

    if (status && (status === "completed" || status === "cancelled") && previousStatus !== "completed" && previousStatus !== "cancelled") {
      const item = await Item.findById(booking.itemId);
      if (item) {
        item.availableQuantity += 1;
        await item.save();
      }
    }

    const updatedBooking = await booking.save();
    res.json(updatedBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("itemId", "name image category pricePerDay ownerId")
      .populate("userId", "name email");

    if (booking) {
      res.json(booking);
    } else {
      res.status(404).json({ message: "Booking not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
