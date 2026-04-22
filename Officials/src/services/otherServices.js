import api from './apiClient';

export const schedulesService = {
  async getSchedules(params = {}) {
    const response = await api.get('/schedules', { params });
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to fetch schedules');
  },

  async updateSchedule(id, data) {
    const response = await api.put(`/schedules/${id}`, data);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to update schedule');
  },
};

export const trucksService = {
  async getTruckLocations() {
    const response = await api.get('/trucks/locations');
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to fetch truck locations');
  },

  async getTruckRoutes() {
    const response = await api.get('/trucks/routes');
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to fetch truck routes');
  },
};

export const notificationsService = {
  async getNotifications(params = {}) {
    const response = await api.get('/notifications', { params });
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to fetch notifications');
  },

  async markAsRead(id) {
    const response = await api.put(`/notifications/${id}/read`);
    if (response.data.success) {
      return true;
    }
    throw new Error(response.data.message || 'Failed to mark as read');
  },

  async getUnreadCount() {
    const response = await api.get('/notifications/unread-count');
    if (response.data.success && response.data.data) {
      return response.data.data.unreadCount;
    }
    throw new Error(response.data.message || 'Failed to get unread count');
  },
};

export default { schedulesService, trucksService, notificationsService };
