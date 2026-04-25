import express from "express";
import {
  createBooking,
  getUserBookings,
  getOwnerBookings,
  updateBookingStatus,
  getBookingById,
} from "../controllers/bookingController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect, authorize("renter", "owner"), createBooking);
router.get("/my-bookings", protect, authorize("renter", "owner"), getUserBookings);
router.get("/owner-bookings", protect, authorize("owner"), getOwnerBookings);
router.route("/:id").get(protect, getBookingById).put(protect, updateBookingStatus);

export default router;
