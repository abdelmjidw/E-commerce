import express from "express";
import { 
  createOrder, 
  getMyOrders, 
  getAllOrders 
} from "../controllers/orderController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// User Routes (للمستخدم المسجل)
router.post("/", protect, createOrder);
router.get("/my-orders", protect, getMyOrders);

// Admin Routes (لمشاهدة كل طلبات المتجر)
router.get("/all", protect, adminOnly, getAllOrders);

export default router;