import api from './apiClient';

// ============================================
// AUTH SERVICE
// ============================================

export const authService = {
  async login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    
    if (response.data.success && response.data.data) {
      const { accessToken, refreshToken, user } = response.data.data;
      
      // Store tokens with user data
      const userWithTokens = {
        ...user,
        accessToken,
        refreshToken,
      };
      
      localStorage.setItem('gtrash_official_user', JSON.stringify(userWithTokens));
      return userWithTokens;
    }
    
    throw new Error(response.data.message || 'Login failed');
  },

  async logout() {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      localStorage.removeItem('gtrash_official_user');
    }
  },

  async getCurrentUser() {
    const response = await api.get('/auth/me');
    
    if (response.data.success && response.data.data?.user) {
      const storedUser = JSON.parse(localStorage.getItem('gtrash_official_user') || '{}');
      const updatedUser = { ...storedUser, ...response.data.data.user };
      localStorage.setItem('gtrash_official_user', JSON.stringify(updatedUser));
      return updatedUser;
    }
    
    throw new Error('Failed to fetch user profile');
  },

  async updateProfile(data) {
    const response = await api.put('/auth/profile', data);
    
    if (response.data.success && response.data.data?.user) {
      const storedUser = JSON.parse(localStorage.getItem('gtrash_official_user') || '{}');
      const updatedUser = { ...storedUser, ...response.data.data.user };
      localStorage.setItem('gtrash_official_user', JSON.stringify(updatedUser));
      return updatedUser;
    }
    
    throw new Error(response.data.message || 'Failed to update profile');
  },

  isAuthenticated() {
    const storedUser = localStorage.getItem('gtrash_official_user');
    return !!storedUser;
  },

  getStoredUser() {
    try {
      const storedUser = localStorage.getItem('gtrash_official_user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error('Error getting stored user:', error);
      return null;
    }
  },
};

export default authService;
