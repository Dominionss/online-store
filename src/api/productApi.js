import { apiRequest, createQuery } from './axios.js';

export const productApi = {
  getProducts: (params) => apiRequest(`/products${createQuery(params)}`),
  getProduct: (id) => apiRequest(`/products/${id}`),
  searchProducts: (params) => apiRequest(`/products/search${createQuery(params)}`),
  getProductsByCategory: (categoryId, params) =>
    apiRequest(`/products/category/${categoryId}${createQuery(params)}`),
  createProduct: (payload) => apiRequest('/products', { method: 'POST', body: payload }),
  updateProduct: (id, payload) => apiRequest(`/products/${id}`, { method: 'PUT', body: payload }),
  deleteProduct: (id) => apiRequest(`/products/${id}`, { method: 'DELETE' }),
  getReviews: (id) => apiRequest(`/products/${id}/reviews`),
  createReview: (id, payload) => apiRequest(`/products/${id}/reviews`, { method: 'POST', body: payload }),
};

export const categoryApi = {
  getCategories: () => apiRequest('/categories'),
  createCategory: (payload) => apiRequest('/categories', { method: 'POST', body: payload }),
};
