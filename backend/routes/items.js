import express from "express";
import {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
  getMyItems,
  getRecommendedItems,
} from "../controllers/itemController.js";
import { protect, authorize, optionalProtect } from "../middleware/auth.js";

const router = express.Router();

router.get("/recommend", optionalProtect, getRecommendedItems);

router.route("/").get(getAllItems).post(protect, authorize("owner"), createItem);

router.get("/my-items", protect, authorize("owner"), getMyItems);

router
  .route("/:id")
  .get(getItemById)
  .put(protect, authorize("owner"), updateItem)
  .delete(protect, authorize("owner"), deleteItem);

export default router;
