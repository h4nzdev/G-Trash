import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Settings, User, Bell, Shield, Database, Save, LogOut } from 'lucide-react';

const SettingsPage = () => {
  const { user, logout } = useAuth();
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    notifications: true,
    emailAlerts: true,
    darkMode: false,
  });

  const handleSave = () => {
    alert('Settings saved successfully!');
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-neutral-900">Settings</h1>
            <p className="text-neutral-600 mt-1 text-sm">Manage your account and system preferences</p>
          </div>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm"
          >
            <Save className="h-4 w-4" />
            Save Changes
          </button>
        </div>
      </div>

      {/* Profile Section */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-primary-muted rounded-xl flex items-center justify-center">
            <User className="h-5 w-5 text-primary" />
          </div>
          <h2 className="text-lg font-bold text-neutral-900">Profile Information</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Full Name</label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Email Address</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm"
            />
          </div>
        </div>
      </div>

      {/* Notifications Section */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
            <Bell className="h-5 w-5 text-blue-600" />
          </div>
          <h2 className="text-lg font-bold text-neutral-900">Notification Preferences</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
            <div>
              <h3 className="font-medium text-neutral-900">Push Notifications</h3>
              <p className="text-sm text-neutral-600">Receive alerts for critical events</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.notifications}
                onChange={(e) => setFormData({ ...formData, notifications: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-neutral-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-muted rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
            <div>
              <h3 className="font-medium text-neutral-900">Email Alerts</h3>
              <p className="text-sm text-neutral-600">Receive critical alerts via email</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.emailAlerts}
                onChange={(e) => setFormData({ ...formData, emailAlerts: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-neutral-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-muted rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Security Section */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
            <Shield className="h-5 w-5 text-green-600" />
          </div>
          <h2 className="text-lg font-bold text-neutral-900">Security</h2>
        </div>

        <div className="space-y-4">
          <button className="w-full flex items-center justify-between p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors">
            <div className="text-left">
              <h3 className="font-medium text-neutral-900">Change Password</h3>
              <p className="text-sm text-neutral-600">Update your account password</p>
            </div>
            <span className="text-neutral-400">→</span>
          </button>

          <button className="w-full flex items-center justify-between p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors">
            <div className="text-left">
              <h3 className="font-medium text-neutral-900">Two-Factor Authentication</h3>
              <p className="text-sm text-neutral-600">Add an extra layer of security</p>
            </div>
            <span className="text-neutral-400">→</span>
          </button>
        </div>
      </div>

      {/* Data Management Section */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
            <Database className="h-5 w-5 text-amber-600" />
          </div>
          <h2 className="text-lg font-bold text-neutral-900">Data Management</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button className="flex items-center justify-center gap-2 p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors">
            <Database className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium">Backup Data</span>
          </button>
          <button className="flex items-center justify-center gap-2 p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors">
            <Database className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium">Export Data</span>
          </button>
          <button className="flex items-center justify-center gap-2 p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors">
            <Database className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium">Clear Cache</span>
          </button>
        </div>
      </div>

      {/* Logout Section */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 p-4 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;
