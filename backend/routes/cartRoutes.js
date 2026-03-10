import express from "express";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from "../controllers/cartController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// All cart routes require authentication
router.use(protect);

// GET /api/cart - Get the user's cart
router.get("/", getCart);

// POST /api/cart - Add an item to the cart (body: { productId, quantity })
router.post("/", addToCart);

// PUT /api/cart/:id - Update a cart item (body: { quantity })
router.put("/:id", updateCartItem);

// DELETE /api/cart/:id - Remove a cart item
router.delete("/:id", removeFromCart);

// DELETE /api/cart - Clear the entire cart
router.delete("/", clearCart);

export default router;