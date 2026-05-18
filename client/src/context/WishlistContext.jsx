import { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import AuthContext from './AuthContext';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      fetchWishlist();
    } else {
      setWishlistItems([]);
    }
  }, [user]);

  const fetchWishlist = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/users/wishlist');
      setWishlistItems(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      setLoading(false);
    }
  };

  const addToWishlist = async (productId) => {
    try {
      await api.post(`/users/wishlist/${productId}`);
      fetchWishlist();
    } catch (error) {
      alert(error.response?.data?.message || 'Error adding to wishlist');
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      await api.delete(`/users/wishlist/${productId}`);
      fetchWishlist();
    } catch (error) {
      alert(error.response?.data?.message || 'Error removing from wishlist');
    }
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some((item) => item._id === productId);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        loading,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export default WishlistContext;
