import express from "express";
import { getAllUsers, getAllItems, getAllBookings, deleteUser, deleteItem } from "../controllers/adminController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);
router.use(authorize("admin")); // strictly enforcing admin access

router.get("/users", getAllUsers);
router.get("/items", getAllItems);
router.get("/bookings", getAllBookings);

router.delete("/users/:id", deleteUser);
router.delete("/items/:id", deleteItem);

export default router;
