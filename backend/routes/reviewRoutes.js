import express from "express";
import {
  getReviews,
  getOneReview,
  createReview,
  updateReview,
  deleteReview,
} from "../controllers/reviewController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public
router.get("/", getReviews);
router.get("/:id", getOneReview);

// Protected (only logged-in users can create/update/delete their reviews)
router.post("/", protect, createReview);
router.put("/:id", protect, updateReview);
router.delete("/:id", protect, deleteReview);

export default router;
