import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const toast = useToast();

  useEffect(() => {
    if (user && user.role === 'customer') {
      fetchCart();
    }
  }, [user]);

  const fetchCart = async () => {
    try {
      const { data } = await api.get('/cart');
      setCart(data.data.cart);
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    setLoading(true);
    try {
      const { data } = await api.post('/cart/add', { productId, quantity });
      setCart(data.data.cart);
      toast?.success('Product added to cart');
      return data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add to cart';
      toast?.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateCartItem = async (productId, quantity) => {
    try {
      const { data } = await api.put('/cart/update', { productId, quantity });
      setCart(data.data.cart);
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const { data } = await api.delete(`/cart/remove/${productId}`);
      setCart(data.data.cart);
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const applyCoupon = async (code) => {
    try {
      const { data } = await api.post('/cart/coupon/apply', { code });
      setCart(data.data.cart);
      return data;
    } catch (error) {
      throw error;
    }
  };

  const removeCoupon = async () => {
    try {
      const { data } = await api.delete('/cart/coupon/remove');
      setCart(data.data.cart);
    } catch (error) {
      console.error('Error removing coupon:', error);
    }
  };

  const clearCart = async () => {
    try {
      const { data } = await api.delete('/cart/clear');
      setCart(data.data.cart);
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const value = {
    cart,
    loading,
    addToCart,
    updateCartItem,
    removeFromCart,
    applyCoupon,
    removeCoupon,
    clearCart,
    fetchCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => useContext(CartContext);
