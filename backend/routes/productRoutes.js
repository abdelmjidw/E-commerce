import express from "express";
import { 
  getProducts, 
  getOneProduct, 
  createProduct, 
  updateProduct, 
  deleteProduct 
} from "../controllers/productController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public Routes (متاحة للزوار)
router.get("/", getProducts);
router.get("/:id", getOneProduct);

// Admin Routes (محمية للأدمن فقط)
router.post("/", protect, adminOnly, createProduct);
router.put("/:id", protect, adminOnly, updateProduct);
router.delete("/:id", protect, adminOnly, deleteProduct);

export default router;