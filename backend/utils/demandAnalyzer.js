import Booking from "../models/Booking.js";

export const analyzeDemand = async (itemId, category, location) => {
  // simulate demand using bookings count
  const count = await Booking.countDocuments({ item: itemId });

  let demand = "LOW";

  if (count > 5) demand = "HIGH";
  else if (count > 2) demand = "MEDIUM";

  return {
    demand,
    bookings: count
  };
};
