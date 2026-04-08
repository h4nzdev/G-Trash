import React from 'react';
import { Bell, AlertTriangle, Info, CheckCircle, X, Trash2 } from 'lucide-react';

const NotificationsPage = () => {
  const notifications = [
    {
      id: 1,
      type: 'alert',
      title: 'High Pollution Alert',
      message: 'Brgy. Apas pollution level reached 85%. Immediate action required.',
      time: '5 minutes ago',
      read: false,
      priority: 'High',
    },
    {
      id: 2,
      type: 'info',
      title: 'Collection Schedule Updated',
      message: 'Brgy. Lahug collection time changed to 8:00 AM tomorrow.',
      time: '1 hour ago',
      read: false,
      priority: 'Medium',
    },
    {
      id: 3,
      type: 'success',
      title: 'Route Completed',
      message: 'GT-103 completed Guadalupe route successfully. 580kg collected.',
      time: '2 hours ago',
      read: true,
      priority: 'Low',
    },
    {
      id: 4,
      type: 'alert',
      title: 'Overflowing Trash Report',
      message: 'New report from Brgy. Budlaan: Illegal dumping near school.',
      time: '3 hours ago',
      read: true,
      priority: 'High',
    },
    {
      id: 5,
      type: 'info',
      title: 'System Maintenance',
      message: 'Scheduled maintenance on March 30, 2026 from 2:00 AM - 4:00 AM.',
      time: '1 day ago',
      read: true,
      priority: 'Low',
    },
  ];

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'alert': return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case 'info': return <Info className="h-5 w-5 text-blue-600" />;
      case 'success': return <CheckCircle className="h-5 w-5 text-green-600" />;
      default: return <Bell className="h-5 w-5 text-neutral-600" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-amber-100 text-amber-800';
      case 'Low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-neutral-100 text-neutral-800';
    }
  };

  const stats = {
    total: notifications.length,
    unread: notifications.filter(n => !n.read).length,
    highPriority: notifications.filter(n => n.priority === 'High').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">Notifications</h1>
            <p className="text-neutral-600 mt-1">Manage alerts and system notifications</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-neutral-50 rounded-lg p-4">
            <p className="text-sm text-neutral-600">Total</p>
            <p className="text-2xl font-bold text-neutral-900">{stats.total}</p>
          </div>
          <div className="bg-red-50 rounded-lg p-4">
            <p className="text-sm text-red-700">Unread</p>
            <p className="text-2xl font-bold text-red-900">{stats.unread}</p>
          </div>
          <div className="bg-amber-50 rounded-lg p-4">
            <p className="text-sm text-amber-700">High Priority</p>
            <p className="text-2xl font-bold text-amber-900">{stats.highPriority}</p>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-2xl shadow-sm border border-neutral-200">
        <div className="divide-y divide-neutral-200">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-6 hover:bg-neutral-50 transition-colors ${
                !notification.read ? 'bg-blue-50/50' : ''
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-neutral-900">{notification.title}</h3>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-600 rounded-full" />
                        )}
                      </div>
                      <p className="text-sm text-neutral-700">{notification.message}</p>
                    </div>
                    <button className="text-neutral-400 hover:text-neutral-600">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-neutral-500">
                    <span>{notification.time}</span>
                    <span className={`px-2 py-0.5 rounded-full font-medium ${getPriorityColor(notification.priority)}`}>
                      {notification.priority} Priority
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
        <h2 className="text-xl font-bold text-neutral-900 mb-4">Notification Settings</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
            <div>
              <h3 className="font-semibold text-neutral-900">High Priority Alerts</h3>
              <p className="text-sm text-neutral-600">Get notified for critical pollution levels</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-neutral-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-muted rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
            <div>
              <h3 className="font-semibold text-neutral-900">Collection Reminders</h3>
              <p className="text-sm text-neutral-600">Notifications for scheduled collections</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-neutral-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-muted rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
            <div>
              <h3 className="font-semibold text-neutral-900">System Updates</h3>
              <p className="text-sm text-neutral-600">Maintenance and update notifications</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-neutral-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-muted rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
