import { createContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const cartItemsFromStorage = localStorage.getItem('cartItems')
      ? JSON.parse(localStorage.getItem('cartItems'))
      : [];
    setCartItems(cartItemsFromStorage);
  }, []);

  const addToCart = (product, qty) => {
    const existItem = cartItems.find((x) => x.product === product._id);

    let newCartItems;
    if (existItem) {
      newCartItems = cartItems.map((x) =>
        x.product === existItem.product
          ? {
              product: product._id,
              name: product.name,
              image: product.image,
              price: product.price,
              countInStock: product.countInStock,
              qty: qty, // Update quantity to new value, or could be x.qty + qty
            }
          : x
      );
    } else {
      newCartItems = [
        ...cartItems,
        {
          product: product._id,
          name: product.name,
          image: product.image,
          price: product.price,
          countInStock: product.countInStock,
          qty,
        },
      ];
    }

    setCartItems(newCartItems);
    localStorage.setItem('cartItems', JSON.stringify(newCartItems));
  };

  const removeFromCart = (id) => {
    const newCartItems = cartItems.filter((x) => x.product !== id);
    setCartItems(newCartItems);
    localStorage.setItem('cartItems', JSON.stringify(newCartItems));
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cartItems');
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
