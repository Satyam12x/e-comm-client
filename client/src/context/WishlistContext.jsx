import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const toast = useToast();

  useEffect(() => {
    if (user && user.role === 'customer') {
      fetchWishlist();
    } else {
      setWishlist([]);
    }
  }, [user]);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/wishlist');
      setWishlist(data.data.wishlist || []);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      setWishlist([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleWishlist = async (productId) => {
    setLoading(true);
    try {
      const { data } = await api.put('/wishlist/toggle', { productId });
      setWishlist(data.data.wishlist || []);
      toast?.success(data.message);
      return { success: true, message: data.message };
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      const message = error.response?.data?.message || 'Failed to update wishlist';
      toast?.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some(item => {
      const itemId = typeof item === 'object' ? item._id : item;
      return itemId === productId;
    });
  };

  const removeFromWishlist = async (productId) => {
    setLoading(true);
    try {
      const { data } = await api.delete(`/wishlist/remove/${productId}`);
      setWishlist(data.data.wishlist || []);
      toast?.success(data.message);
      return { success: true, message: data.message };
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      const message = error.response?.data?.message || 'Failed to remove from wishlist';
      toast?.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    wishlist,
    loading,
    toggleWishlist,
    isInWishlist,
    removeFromWishlist,
    fetchWishlist,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

export const useWishlist = () => useContext(WishlistContext);
