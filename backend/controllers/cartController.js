import prisma from "../config/db.js";

// Get the user's cart with all items and product details
export const getCart = async (req, res) => {

  const cart = await prisma.cart.findUnique({
    where: { userId: req.user.id },
    include: {
      items: {
        include: {
          product: true
        }
      }
    }
  });

  if (!cart) {
    return res.json({
      items: [],
      totalItems: 0
    });
  }

  res.json({
    items: cart.items,
    totalItems: cart.items.length
  });

};
// Add a product to the cart (or increase quantity if it already exists)
export const addToCart = async (req, res) => {
  const { productId, quantity = 1 } = req.body;

  try {

    const product = await prisma.product.findUnique({
      where: { id: Number(productId) }
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ message: "Not enough stock" });
    }

    let cart = await prisma.cart.findUnique({
      where: { userId: req.user.id }
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: req.user.id }
      });
    }

    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId: Number(productId)
        }
      }
    });

    if (existingItem) {

      const newQty = existingItem.quantity + Number(quantity);

      if (newQty > product.stock) {
        return res.status(400).json({ message: "Stock limit reached" });
      }

      const updatedItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQty },
        include: { product: true }
      });

      return res.json(updatedItem);

    }

    const newItem = await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId: Number(productId),
        quantity: Number(quantity)
      },
      include: { product: true }
    });

    res.status(201).json(newItem);

  } catch (error) {
    res.status(500).json({ message: "Error adding to cart" });
  }
};

// Update the quantity of a specific cart item
export const updateCartItem = async (req, res) => {
  const { id } = req.params; // CartItem ID
  const { quantity } = req.body;

  if (quantity <= 0) {
    return res.status(400).json({ message: "Quantity must be positive" });
  }

  try {
    // Verify the item belongs to the user's cart
    const item = await prisma.cartItem.findUnique({
      where: { id: Number(id) },
      include: { cart: true },
    });

    if (!item || item.cart.userId !== req.user.id) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    const updatedItem = await prisma.cartItem.update({
      where: { id: Number(id) },
      data: { quantity: Number(quantity) },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            imageUrl: true,
            stock: true,
          },
        },
      },
    });

    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: "Error updating cart item", error: error.message });
  }
};

// Remove a specific item from the cart
export const removeFromCart = async (req, res) => {
  const { id } = req.params; // CartItem ID

  try {
    // Verify the item belongs to the user's cart
    const item = await prisma.cartItem.findUnique({
      where: { id: Number(id) },
      include: { cart: true },
    });

    if (!item || item.cart.userId !== req.user.id) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    await prisma.cartItem.delete({
      where: { id: Number(id) },
    });

    res.json({ message: "Item removed from cart" });
  } catch (error) {
    res.status(500).json({ message: "Error removing item from cart", error: error.message });
  }
};

// Clear all items from the user's cart
export const clearCart = async (req, res) => {
  try {
    const cart = await prisma.cart.findUnique({
      where: { userId: req.user.id },
    });

    if (!cart) {
      return res.json({ message: "Cart is already empty" });
    }

    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    res.json({ message: "Cart cleared" });
  } catch (error) {
    res.status(500).json({ message: "Error clearing cart", error: error.message });
  }
};