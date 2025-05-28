// src/context/CartContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // Load cart from localStorage or start with empty array
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem('cartItems');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  });

  const [cartMessage, setCartMessage] = useState(null);

  // Save cartItems to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    } catch {
      // handle errors silently or log if you want
    }
  }, [cartItems]);

  const addToCart = (product) => {
    const exists = cartItems.some(item => item._id === product._id);

    if (exists) {
      setCartMessage(`"${product.name}" is already in the cart.`);
      setTimeout(() => setCartMessage(null), 3000); // Clear after 3 seconds
    } else {
      setCartItems([...cartItems, { ...product, duration: 1 }]);
      setCartMessage(null);
    }
  };

  const updateDuration = (index, duration) => {
    const updated = [...cartItems];
    updated[index].duration = duration;
    setCartItems(updated);
  };

  const clearCart = () => setCartItems([]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateDuration,
        clearCart,
        cartMessage,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
