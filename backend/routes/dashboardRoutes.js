import express from "express";
import {
  getDashboardStats,
  getAllProductsAdmin,
  updateOrderStatus,
} from "../controllers/dashboardController.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

// جميع المسارات هنا تحتاج صلاحية أدمن
router.use(protect, adminOnly);

router.get("/stats", getDashboardStats);
router.get("/products", getAllProductsAdmin);
router.put("/orders/:id", updateOrderStatus);

export default router;
