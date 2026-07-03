import { apiRequest } from './axios.js';

export const authApi = {
  register: (payload) => apiRequest('/auth/register', { method: 'POST', body: payload, token: null }),
  login: (payload) => apiRequest('/auth/login', { method: 'POST', body: payload, token: null }),
  getProfile: () => apiRequest('/auth/profile'),
  updateProfile: (payload) => apiRequest('/auth/profile', { method: 'PUT', body: payload }),
};
