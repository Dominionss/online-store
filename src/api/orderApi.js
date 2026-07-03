import { apiRequest } from './axios.js';

export const orderApi = {
  createOrder: (payload) => apiRequest('/orders', { method: 'POST', body: payload }),
  getMyOrders: () => apiRequest('/orders/my-orders'),
  getOrder: (id) => apiRequest(`/orders/${id}`),
  getAllOrders: (status) => apiRequest(`/orders${status ? `?status=${status}` : ''}`),
  updateOrderStatus: (id, status) =>
    apiRequest(`/orders/${id}/status`, { method: 'PUT', body: { status } }),
};

export const adminApi = {
  getDashboardStats: () => apiRequest('/admin/dashboard'),
  getUsers: () => apiRequest('/admin/users'),
  updateUserRole: (id, role) => apiRequest(`/admin/users/${id}/role`, { method: 'PUT', body: { role } }),
  deleteUser: (id) => apiRequest(`/admin/users/${id}`, { method: 'DELETE' }),
};
