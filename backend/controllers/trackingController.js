import Booking from "../models/Booking.js";

export const updateTracking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { trackingStatus, location } = req.body;

    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { trackingStatus, location },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
