import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { cartApi } from '../api/cartApi.js';
import { useAuth } from '../hooks/useAuth.js';

export const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { token } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const refreshCart = useCallback(async () => {
    if (!token) {
      setItems([]);
      return [];
    }

    setLoading(true);
    setError('');
    try {
      const data = await cartApi.getCart();
      setItems(data);
      return data;
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addToCart = async (productId, quantity = 1) => {
    const data = await cartApi.addToCart(productId, quantity);
    setItems(data);
    return data;
  };

  const updateCartItem = async (itemId, quantity) => {
    const data = await cartApi.updateCartItem(itemId, quantity);
    setItems(data);
    return data;
  };

  const removeCartItem = async (itemId) => {
    const data = await cartApi.removeCartItem(itemId);
    setItems(data);
    return data;
  };

  const clearCart = async () => {
    await cartApi.clearCart();
    setItems([]);
  };

  const subtotal = items.reduce((sum, item) => {
    const product = item.productId;
    return sum + (product?.discountPrice || product?.price || 0) * item.quantity;
  }, 0);
  const shipping = subtotal === 0 || subtotal >= 75 ? 0 : 8.99;
  const count = items.reduce((sum, item) => sum + item.quantity, 0);

  const value = useMemo(
    () => ({
      items,
      loading,
      error,
      count,
      subtotal,
      shipping,
      total: subtotal + shipping,
      refreshCart,
      addToCart,
      updateCartItem,
      removeCartItem,
      clearCart,
    }),
    [count, error, items, loading, refreshCart, shipping, subtotal],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
