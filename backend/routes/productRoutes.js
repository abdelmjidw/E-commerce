import express from "express";
import { 
  getProducts, 
  getOneProduct, 
  createProduct, 
  updateProduct, 
  deleteProduct 
} from "../controllers/productController.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/multer.js";
const router = express.Router();

// Public Routes 
router.get("/", getProducts);
router.get("/:id", getOneProduct);

// Admin Routes 
router.post("/", protect, adminOnly, upload.single("image"), createProduct);
router.put("/:id", protect, adminOnly, upload.single("image"), updateProduct);
router.delete("/:id", protect, adminOnly, deleteProduct);

export default router;