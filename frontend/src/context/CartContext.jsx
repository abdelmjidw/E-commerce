import React, { createContext, useContext, useState, useEffect } from "react";
import API from "../api/api";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const { isAuthenticated } = useAuth();

  // fetch cart
const fetchCart = async () => {
  if (!isAuthenticated) {
    setCart([]);
    return;
  }
  try {
    const res = await API.get("/api/cart");
    setCart(res.data.items || []);
  } catch (err) {
    console.error("Erreur de chargement du panier:", err);
    setCart([]);
  }
};

  useEffect(() => {
    fetchCart();
  }, [isAuthenticated]);

  // add product
  const addToCart = async (product, quantity = 1) => {
    try {
      await API.post("/api/cart", {
        productId: product.id,
        quantity,
      });

      fetchCart();
    } catch (err) {
      console.error("Add to cart error:", err);
    }
  };

  // update quantity
  const updateQuantity = async (cartItemId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      await API.put(`/api/cart/${cartItemId}`, {
        quantity: newQuantity,
      });

      setCart((prev) =>
        prev.map((item) =>
          item.id === cartItemId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    } catch (err) {
      console.error("Update quantity error:", err);
    }
  };

  // remove item
  const removeFromCart = async (cartItemId) => {
    try {
      await API.delete(`/api/cart/${cartItemId}`);

      setCart((prev) =>
        prev.filter((item) => item.id !== cartItemId)
      );
    } catch (err) {
      console.error("Remove item error:", err);
    }
  };

  // clear cart
  const clearCart = () => {
    setCart([]);
  };

  // total price
  const totalPrice = cart.reduce((acc, item) => {
    const price = Number(item?.product?.price) || 0;
    const quantity = Number(item?.quantity) || 0;
    return acc + price * quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        totalPrice,
        fetchCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
};