import { apiRequest } from './axios.js';

export const cartApi = {
  getCart: () => apiRequest('/cart'),
  addToCart: (productId, quantity = 1) =>
    apiRequest('/cart', { method: 'POST', body: { productId, quantity } }),
  updateCartItem: (itemId, quantity) =>
    apiRequest(`/cart/${itemId}`, { method: 'PUT', body: { quantity } }),
  removeCartItem: (itemId) => apiRequest(`/cart/${itemId}`, { method: 'DELETE' }),
  clearCart: () => apiRequest('/cart', { method: 'DELETE' }),
};
