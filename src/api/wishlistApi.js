import { apiRequest } from './axios.js';

export const wishlistApi = {
  getWishlist: () => apiRequest('/wishlist'),
  addToWishlist: (productId) => apiRequest('/wishlist', { method: 'POST', body: { productId } }),
  removeFromWishlist: (productId) => apiRequest(`/wishlist/${productId}`, { method: 'DELETE' }),
};
