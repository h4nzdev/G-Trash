import React, { useState } from 'react';
import { Bell, AlertTriangle, Info, CheckCircle, Filter, Search, Send } from 'lucide-react';

const NotificationsPage = () => {
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const notifications = [
    {
      id: 1,
      title: 'High Pollution Alert - Brgy. Talamban',
      message: 'Pollution levels have exceeded critical threshold. Immediate action required.',
      type: 'alert',
      priority: 'Critical',
      date: '2026-04-06',
      time: '10:30 AM',
      read: false,
    },
    {
      id: 2,
      title: 'System Maintenance Scheduled',
      message: 'The system will undergo maintenance on April 10, 2026 from 2:00 AM - 4:00 AM.',
      type: 'info',
      priority: 'Low',
      date: '2026-04-05',
      time: '3:00 PM',
      read: true,
    },
    {
      id: 3,
      title: 'New Bug Report Submitted',
      message: 'A new critical bug report has been submitted by user Maria Santos.',
      type: 'info',
      priority: 'Medium',
      date: '2026-04-05',
      time: '1:15 PM',
      read: false,
    },
    {
      id: 4,
      title: 'Truck GT-003 Route Completed',
      message: 'Truck GT-003 has completed its assigned route successfully.',
      type: 'success',
      priority: 'Low',
      date: '2026-04-04',
      time: '12:45 PM',
      read: true,
    },
    {
      id: 5,
      title: 'Weekly Report Generated',
      message: 'Your weekly waste collection report is now available for download.',
      type: 'info',
      priority: 'Low',
      date: '2026-04-03',
      time: '9:00 AM',
      read: true,
    },
    {
      id: 6,
      title: 'Overflowing Trash Report - Brgy. Lahug',
      message: 'Multiple reports of overflowing trash bins in Barangay Lahug.',
      type: 'alert',
      priority: 'High',
      date: '2026-04-02',
      time: '4:30 PM',
      read: false,
    },
  ];

  const stats = {
    total: notifications.length,
    unread: notifications.filter(n => !n.read).length,
    alerts: notifications.filter(n => n.type === 'alert').length,
    info: notifications.filter(n => n.type === 'info').length,
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'alert': return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case 'info': return <Info className="h-5 w-5 text-blue-600" />;
      case 'success': return <CheckCircle className="h-5 w-5 text-green-600" />;
      default: return <Bell className="h-5 w-5 text-neutral-600" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Critical': return 'bg-red-200 text-red-900';
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-amber-100 text-amber-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-neutral-100 text-neutral-800';
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesType = filterType === 'all' || notification.type === filterType;
    const matchesSearch = searchTerm === '' ||
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-neutral-900">Notifications</h1>
            <p className="text-neutral-600 mt-1 text-sm">Handle system notifications and updates</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm"
          >
            <Send className="h-4 w-4" />
            Send Notification
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-neutral-50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Bell className="h-5 w-5 text-neutral-600" />
            <span className="text-sm font-medium text-neutral-700">Total</span>
          </div>
          <p className="text-2xl font-bold text-neutral-900">{stats.total}</p>
        </div>
        <div className="bg-red-50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <span className="text-sm font-medium text-red-700">Unread</span>
          </div>
          <p className="text-2xl font-bold text-red-900">{stats.unread}</p>
        </div>
        <div className="bg-red-100 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-5 w-5 text-red-800" />
            <span className="text-sm font-medium text-red-800">Alerts</span>
          </div>
          <p className="text-2xl font-bold text-red-900">{stats.alerts}</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Info className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">Info</span>
          </div>
          <p className="text-2xl font-bold text-blue-900">{stats.info}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-500" />
              <input
                type="text"
                placeholder="Search notifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm"
              />
            </div>
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm"
          >
            <option value="all">All Types</option>
            <option value="alert">Alerts</option>
            <option value="info">Information</option>
            <option value="success">Success</option>
          </select>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200">
        <div className="divide-y divide-neutral-200">
          {filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-6 hover:bg-neutral-50 transition-colors ${
                !notification.read ? 'bg-blue-50/50' : ''
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  {getTypeIcon(notification.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <h3 className="font-semibold text-neutral-900">{notification.title}</h3>
                      <p className="text-sm text-neutral-600 mt-1">{notification.message}</p>
                    </div>
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${getPriorityColor(notification.priority)}`}>
                      {notification.priority}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-neutral-500">
                    <span>{notification.date} at {notification.time}</span>
                    {!notification.read && (
                      <span className="flex items-center gap-1 text-blue-600">
                        <Bell className="h-3 w-3" />
                        Unread
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredNotifications.length === 0 && (
          <div className="p-12 text-center">
            <Bell className="h-16 w-16 text-neutral-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">No notifications found</h3>
            <p className="text-neutral-600">Try adjusting your filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
