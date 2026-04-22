import api from './apiClient';

export const reportsService = {
  async getReports(params = {}) {
    const response = await api.get('/reports', { params });
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to fetch reports');
  },

  async getReport(id) {
    const response = await api.get(`/reports/${id}`);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to fetch report');
  },

  async updateStatus(id, status) {
    const response = await api.put(`/reports/${id}/status`, { status });
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to update report status');
  },

  async verifyReport(id) {
    const response = await api.post(`/reports/${id}/verify`);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to verify report');
  },

  async getStats() {
    const response = await api.get('/reports/stats/summary');
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to fetch report stats');
  },
};

export default reportsService;
