import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  User,
  Bell,
  Shield,
  Database,
  Download,
  LogOut,
  Save,
  Mail,
  Phone,
  MapPin,
} from 'lucide-react';

const SettingsPage = () => {
  const { user, updateProfile, logout } = useAuth();
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    barangay: user?.barangay || '',
    phone: '0917-123-4567',
  });
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    collectionReminders: true,
    systemUpdates: false,
  });

  const handleSave = async () => {
    await updateProfile(formData);
    alert('Profile updated successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
        <h1 className="text-3xl font-bold text-neutral-900">Settings</h1>
        <p className="text-neutral-600 mt-1">Manage your account and preferences</p>
      </div>

      {/* Profile Section */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-primary-muted rounded-xl flex items-center justify-center">
            <User className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-xl font-bold text-neutral-900">Profile Information</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-neutral-800 mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-neutral-800 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-neutral-800 mb-2">
              Barangay
            </label>
            <input
              type="text"
              value={formData.barangay}
              onChange={(e) => setFormData({ ...formData, barangay: e.target.value })}
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-neutral-800 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
            />
          </div>
        </div>

        <button
          onClick={handleSave}
          className="mt-6 flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
        >
          <Save className="h-5 w-5" />
          Save Changes
        </button>
      </div>

      {/* Notification Preferences */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center">
            <Bell className="h-6 w-6 text-amber-600" />
          </div>
          <h2 className="text-xl font-bold text-neutral-900">Notification Preferences</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-neutral-600" />
              <div>
                <h3 className="font-semibold text-neutral-900">Email Alerts</h3>
                <p className="text-sm text-neutral-600">Receive critical alerts via email</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.emailAlerts}
                onChange={(e) => setNotifications({ ...notifications, emailAlerts: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-neutral-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-muted rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-neutral-600" />
              <div>
                <h3 className="font-semibold text-neutral-900">Collection Reminders</h3>
                <p className="text-sm text-neutral-600">Get notified on collection days</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.collectionReminders}
                onChange={(e) => setNotifications({ ...notifications, collectionReminders: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-neutral-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-muted rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-neutral-600" />
              <div>
                <h3 className="font-semibold text-neutral-900">System Updates</h3>
                <p className="text-sm text-neutral-600">Maintenance and feature updates</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.systemUpdates}
                onChange={(e) => setNotifications({ ...notifications, systemUpdates: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-neutral-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-muted rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Data Management */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
            <Database className="h-6 w-6 text-blue-600" />
          </div>
          <h2 className="text-xl font-bold text-neutral-900">Data Management</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="flex items-center justify-center gap-2 p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors">
            <Download className="h-5 w-5 text-primary" />
            <span className="font-medium text-neutral-900">Export Data</span>
          </button>
          <button className="flex items-center justify-center gap-2 p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors">
            <Database className="h-5 w-5 text-primary" />
            <span className="font-medium text-neutral-900">Backup Data</span>
          </button>
        </div>
      </div>

      {/* Security */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
            <Shield className="h-6 w-6 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-neutral-900">Security</h2>
        </div>

        <div className="space-y-3">
          <button className="w-full flex items-center justify-between p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors">
            <div className="text-left">
              <h3 className="font-semibold text-neutral-900">Change Password</h3>
              <p className="text-sm text-neutral-600">Update your account password</p>
            </div>
            <span className="text-neutral-400">→</span>
          </button>

          <button className="w-full flex items-center justify-between p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors">
            <div className="text-left">
              <h3 className="font-semibold text-neutral-900">Two-Factor Authentication</h3>
              <p className="text-sm text-neutral-600">Add an extra layer of security</p>
            </div>
            <span className="text-neutral-400">→</span>
          </button>
        </div>
      </div>

      {/* Logout */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
        <button
          onClick={() => {
            if (confirm('Are you sure you want to logout?')) {
              logout();
            }
          }}
          className="w-full flex items-center justify-center gap-2 p-4 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
        <p className="text-center text-xs text-neutral-500 mt-3">
          One account per household • G-TRASH v1.0.0
        </p>
      </div>
    </div>
  );
};

export default SettingsPage;
