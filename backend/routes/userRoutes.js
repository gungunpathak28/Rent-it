import express from "express";
import { getMyProfile, updateProfile } from "../controllers/userController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/me", protect, getMyProfile);
router.get("/profile", protect, getMyProfile); // Explicitly requested by user mapping
router.put("/update-profile", protect, updateProfile);

export default router;
