const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const getStoredToken = () => localStorage.getItem('marketplaceToken');

export const apiRequest = async (endpoint, options = {}) => {
  const token = options.token ?? getStoredToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    method: options.method || 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const isJson = response.headers.get('content-type')?.includes('application/json');
  const data = isJson ? await response.json() : null;

  if (!response.ok) {
    throw new Error(data?.message || 'API request failed');
  }

  return data;
};

export const createQuery = (params = {}) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query.set(key, value);
    }
  });

  const queryString = query.toString();
  return queryString ? `?${queryString}` : '';
};
