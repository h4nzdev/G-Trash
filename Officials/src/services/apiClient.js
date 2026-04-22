import axios from 'axios';

// ============================================
// API CLIENT CONFIGURATION
// ============================================

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3003/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ============================================
// REQUEST INTERCEPTOR - Attach auth token
// ============================================

api.interceptors.request.use(
  (config) => {
    try {
      const storedUser = localStorage.getItem('gtrash_official_user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        if (user?.accessToken) {
          config.headers.Authorization = `Bearer ${user.accessToken}`;
        }
      }
    } catch (error) {
      console.error('Error getting auth token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ============================================
// RESPONSE INTERCEPTOR - Handle errors
// ============================================

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear storage and redirect to login
      localStorage.removeItem('gtrash_official_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
