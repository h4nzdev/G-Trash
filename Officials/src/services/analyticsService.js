import api from './apiClient';

export const analyticsService = {
  async getDashboardStats() {
    const response = await api.get('/analytics/dashboard');
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to fetch dashboard stats');
  },

  async getReportsTrend(months = 6) {
    const response = await api.get('/analytics/reports/trend', { params: { months } });
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to fetch reports trend');
  },

  async getCollectionEfficiency() {
    const response = await api.get('/analytics/collection/efficiency');
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to fetch collection efficiency');
  },

  async getUrgencyDistribution() {
    const response = await api.get('/analytics/urgency/distribution');
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to fetch urgency distribution');
  },
};

export default analyticsService;
