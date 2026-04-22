import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
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
  Eye,
  EyeOff,
  Lock,
  Globe,
  Moon,
  Sun,
  Smartphone,
  Upload,
  Trash2,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock,
  Calendar,
  Image,
  Camera,
  Key,
  History,
  FileText,
  ChevronRight,
  Languages,
  Monitor,
  Volume2,
  Vibrate,
  Wifi,
  HardDrive,
  Cloud,
  CloudOff,
  Users,
  Building,
  Tag,
  CreditCard,
  HelpCircle,
  MessageCircle,
  BookOpen,
  Flag,
  Share2,
  Star,
  Info,
} from "lucide-react";

const SettingsPage = () => {
  const { user, updateProfile, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Profile Data
  const [formData, setFormData] = useState({
    fullName: user?.fullName || "Admin User",
    email: user?.email || "admin@gtrack.cebu",
    barangay: user?.barangay || "Brgy. Capitol",
    phone: "0917-123-4567",
    role: "Barangay Administrator",
    avatar: null,
  });

  // Notification Settings
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    pushNotifications: true,
    collectionReminders: true,
    systemUpdates: false,
    reportUpdates: true,
    truckAlerts: true,
    pollutionAlerts: true,
    weeklyDigest: true,
    soundEnabled: true,
    vibrationEnabled: false,
  });

  // Appearance Settings
  const [appearance, setAppearance] = useState({
    theme: "light",
    language: "english",
    fontSize: "medium",
    reducedMotion: false,
    highContrast: false,
  });

  // Privacy Settings
  const [privacy, setPrivacy] = useState({
    shareData: true,
    analytics: true,
    locationTracking: true,
    publicProfile: false,
  });

  // Password Change
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Backup & Sync
  const [backupSettings, setBackupSettings] = useState({
    autoBackup: true,
    backupFrequency: "daily",
    syncOverWifi: true,
    lastBackup: "2026-03-24 10:30 AM",
  });

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "appearance", label: "Appearance", icon: Monitor },
    { id: "privacy", label: "Privacy", icon: Shield },
    { id: "security", label: "Security", icon: Lock },
    { id: "backup", label: "Backup & Sync", icon: Cloud },
    { id: "about", label: "About", icon: Info },
  ];

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await updateProfile(formData);
      setSuccessMessage("Profile updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Failed to update profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    setIsLoading(true);
    try {
      // API call to change password
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSuccessMessage("Password changed successfully!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Failed to change password:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
        <h1 className="text-3xl font-bold text-neutral-900">Settings</h1>
        <p className="text-neutral-600 mt-1">
          Manage your account and application preferences
        </p>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <p className="text-green-800">{successMessage}</p>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Tabs */}
        <div className="lg:w-64 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
            <div className="p-4 border-b border-neutral-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary-muted rounded-full flex items-center justify-center">
                  {formData.avatar ? (
                    <img
                      src={formData.avatar}
                      alt="Avatar"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-6 w-6 text-primary" />
                  )}
                </div>
                <div>
                  <p className="font-semibold text-neutral-900">
                    {formData.fullName}
                  </p>
                  <p className="text-xs text-neutral-500">{formData.role}</p>
                </div>
              </div>
            </div>
            <nav className="p-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? "bg-primary-muted text-primary font-medium"
                        : "text-neutral-700 hover:bg-neutral-100"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-sm">{tab.label}</span>
                    <ChevronRight className="h-4 w-4 ml-auto" />
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 space-y-6">
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-primary-muted rounded-xl flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-xl font-bold text-neutral-900">
                    Profile Information
                  </h2>
                </div>

                <div className="flex items-center gap-6 mb-6">
                  <div className="relative">
                    <div className="w-20 h-20 bg-primary-muted rounded-full flex items-center justify-center">
                      {formData.avatar ? (
                        <img
                          src={formData.avatar}
                          alt="Avatar"
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <User className="h-10 w-10 text-primary" />
                      )}
                    </div>
                    <button className="absolute -bottom-1 -right-1 p-2 bg-white rounded-full shadow-md border border-neutral-200 hover:bg-neutral-50">
                      <Camera className="h-4 w-4 text-neutral-600" />
                    </button>
                  </div>
                  <div>
                    <p className="font-medium text-neutral-900">
                      Profile Photo
                    </p>
                    <p className="text-sm text-neutral-600">
                      JPG, PNG or GIF. Max 2MB.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-neutral-800 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) =>
                          setFormData({ ...formData, fullName: e.target.value })
                        }
                        className="w-full pl-10 pr-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-neutral-800 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="w-full pl-10 pr-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-neutral-800 mb-2">
                      Barangay
                    </label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                      <select
                        value={formData.barangay}
                        onChange={(e) =>
                          setFormData({ ...formData, barangay: e.target.value })
                        }
                        className="w-full pl-10 pr-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none appearance-none"
                      >
                        <option>Brgy. Capitol</option>
                        <option>Brgy. Lahug</option>
                        <option>Brgy. Apas</option>
                        <option>Brgy. Kasambagan</option>
                        <option>Brgy. Budlaan</option>
                        <option>Brgy. Guadalupe</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-neutral-800 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className="w-full pl-10 pr-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-neutral-800 mb-2">
                      Role
                    </label>
                    <div className="relative">
                      <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                      <input
                        type="text"
                        value={formData.role}
                        disabled
                        className="w-full pl-10 pr-4 py-2.5 border border-neutral-300 rounded-lg bg-neutral-50 text-neutral-600 outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium disabled:opacity-50"
                  >
                    <Save className="h-5 w-5" />
                    {isLoading ? "Saving..." : "Save Changes"}
                  </button>
                  <button className="px-6 py-2.5 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors font-medium">
                    Cancel
                  </button>
                </div>
              </div>

              {/* Account Stats */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
                <h3 className="font-semibold text-neutral-900 mb-4">
                  Account Statistics
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-neutral-50 rounded-lg">
                    <p className="text-2xl font-bold text-neutral-900">12</p>
                    <p className="text-xs text-neutral-600">
                      Reports Submitted
                    </p>
                  </div>
                  <div className="text-center p-3 bg-neutral-50 rounded-lg">
                    <p className="text-2xl font-bold text-neutral-900">8</p>
                    <p className="text-xs text-neutral-600">Routes Monitored</p>
                  </div>
                  <div className="text-center p-3 bg-neutral-50 rounded-lg">
                    <p className="text-2xl font-bold text-neutral-900">45</p>
                    <p className="text-xs text-neutral-600">Alerts Received</p>
                  </div>
                  <div className="text-center p-3 bg-neutral-50 rounded-lg">
                    <p className="text-2xl font-bold text-neutral-900">28d</p>
                    <p className="text-xs text-neutral-600">Account Age</p>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
                    <Bell className="h-5 w-5 text-amber-600" />
                  </div>
                  <h2 className="text-xl font-bold text-neutral-900">
                    Notification Preferences
                  </h2>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-neutral-600" />
                      <div>
                        <h3 className="font-semibold text-neutral-900">
                          Email Alerts
                        </h3>
                        <p className="text-sm text-neutral-600">
                          Receive critical alerts via email
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifications.emailAlerts}
                        onChange={(e) =>
                          setNotifications({
                            ...notifications,
                            emailAlerts: e.target.checked,
                          })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-neutral-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-muted rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Smartphone className="h-5 w-5 text-neutral-600" />
                      <div>
                        <h3 className="font-semibold text-neutral-900">
                          Push Notifications
                        </h3>
                        <p className="text-sm text-neutral-600">
                          Receive notifications on your device
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifications.pushNotifications}
                        onChange={(e) =>
                          setNotifications({
                            ...notifications,
                            pushNotifications: e.target.checked,
                          })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-neutral-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-muted rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Bell className="h-5 w-5 text-neutral-600" />
                      <div>
                        <h3 className="font-semibold text-neutral-900">
                          Collection Reminders
                        </h3>
                        <p className="text-sm text-neutral-600">
                          Get notified on collection days
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifications.collectionReminders}
                        onChange={(e) =>
                          setNotifications({
                            ...notifications,
                            collectionReminders: e.target.checked,
                          })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-neutral-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-muted rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="h-5 w-5 text-neutral-600" />
                      <div>
                        <h3 className="font-semibold text-neutral-900">
                          Pollution Alerts
                        </h3>
                        <p className="text-sm text-neutral-600">
                          Alert when pollution levels are high
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifications.pollutionAlerts}
                        onChange={(e) =>
                          setNotifications({
                            ...notifications,
                            pollutionAlerts: e.target.checked,
                          })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-neutral-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-muted rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Truck className="h-5 w-5 text-neutral-600" />
                      <div>
                        <h3 className="font-semibold text-neutral-900">
                          Truck Alerts
                        </h3>
                        <p className="text-sm text-neutral-600">
                          Updates on truck locations and delays
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifications.truckAlerts}
                        onChange={(e) =>
                          setNotifications({
                            ...notifications,
                            truckAlerts: e.target.checked,
                          })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-neutral-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-muted rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
                <h3 className="font-semibold text-neutral-900 mb-4">
                  Sound & Vibration
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Volume2 className="h-5 w-5 text-neutral-600" />
                      <div>
                        <h3 className="font-semibold text-neutral-900">
                          Sound Effects
                        </h3>
                        <p className="text-sm text-neutral-600">
                          Play sound for notifications
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifications.soundEnabled}
                        onChange={(e) =>
                          setNotifications({
                            ...notifications,
                            soundEnabled: e.target.checked,
                          })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-neutral-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-muted rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Vibrate className="h-5 w-5 text-neutral-600" />
                      <div>
                        <h3 className="font-semibold text-neutral-900">
                          Vibration
                        </h3>
                        <p className="text-sm text-neutral-600">
                          Vibrate for important alerts
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifications.vibrationEnabled}
                        onChange={(e) =>
                          setNotifications({
                            ...notifications,
                            vibrationEnabled: e.target.checked,
                          })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-neutral-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-muted rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Appearance Tab */}
          {activeTab === "appearance" && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                  <Monitor className="h-5 w-5 text-purple-600" />
                </div>
                <h2 className="text-xl font-bold text-neutral-900">
                  Appearance Settings
                </h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-neutral-800 mb-3">
                    Theme
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <button className="p-4 border-2 border-primary rounded-lg bg-primary-muted">
                      <Sun className="h-6 w-6 text-primary mx-auto mb-2" />
                      <p className="text-sm font-medium text-primary">Light</p>
                    </button>
                    <button className="p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50">
                      <Moon className="h-6 w-6 text-neutral-600 mx-auto mb-2" />
                      <p className="text-sm font-medium text-neutral-700">
                        Dark
                      </p>
                    </button>
                    <button className="p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50">
                      <Monitor className="h-6 w-6 text-neutral-600 mx-auto mb-2" />
                      <p className="text-sm font-medium text-neutral-700">
                        System
                      </p>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-800 mb-3">
                    Language
                  </label>
                  <select className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none">
                    <option>English</option>
                    <option>Tagalog</option>
                    <option>Cebuano</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-800 mb-3">
                    Font Size
                  </label>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 border border-neutral-300 rounded-lg text-sm">
                      Small
                    </button>
                    <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm">
                      Medium
                    </button>
                    <button className="px-4 py-2 border border-neutral-300 rounded-lg text-sm">
                      Large
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                    <Lock className="h-5 w-5 text-green-600" />
                  </div>
                  <h2 className="text-xl font-bold text-neutral-900">
                    Change Password
                  </h2>
                </div>

                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-sm font-semibold text-neutral-800 mb-2">
                      Current Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={passwordData.currentPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            currentPassword: e.target.value,
                          })
                        }
                        className="w-full pl-10 pr-12 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-neutral-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-neutral-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-neutral-800 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={passwordData.newPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            newPassword: e.target.value,
                          })
                        }
                        className="w-full pl-10 pr-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-neutral-800 mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={passwordData.confirmPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            confirmPassword: e.target.value,
                          })
                        }
                        className="w-full pl-10 pr-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handlePasswordChange}
                    disabled={isLoading}
                    className="w-full py-2.5 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium disabled:opacity-50"
                  >
                    {isLoading ? "Updating..." : "Update Password"}
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
                <h3 className="font-semibold text-neutral-900 mb-4">
                  Two-Factor Authentication
                </h3>
                <p className="text-sm text-neutral-600 mb-4">
                  Add an extra layer of security to your account
                </p>
                <button className="flex items-center justify-between w-full p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-primary" />
                    <div className="text-left">
                      <p className="font-medium text-neutral-900">Enable 2FA</p>
                      <p className="text-xs text-neutral-600">
                        Use authenticator app or SMS
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-neutral-400" />
                </button>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
                <h3 className="font-semibold text-neutral-900 mb-4">
                  Login History
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-600">Today, 10:30 AM</span>
                    <span className="text-neutral-500">Chrome on Windows</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-600">Yesterday, 3:15 PM</span>
                    <span className="text-neutral-500">
                      Mobile App on Android
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Backup & Sync Tab */}
          {activeTab === "backup" && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-cyan-50 rounded-xl flex items-center justify-center">
                  <Cloud className="h-5 w-5 text-cyan-600" />
                </div>
                <h2 className="text-xl font-bold text-neutral-900">
                  Backup & Sync
                </h2>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-neutral-50 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-medium text-neutral-900">
                        Last Backup
                      </p>
                      <p className="text-sm text-neutral-600">
                        {backupSettings.lastBackup}
                      </p>
                    </div>
                    <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium">
                      Backup Now
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                  <div>
                    <h3 className="font-semibold text-neutral-900">
                      Auto Backup
                    </h3>
                    <p className="text-sm text-neutral-600">
                      Automatically backup your data
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={backupSettings.autoBackup}
                      onChange={(e) =>
                        setBackupSettings({
                          ...backupSettings,
                          autoBackup: e.target.checked,
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-neutral-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-muted rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                  <div>
                    <h3 className="font-semibold text-neutral-900">
                      Sync over Wi-Fi only
                    </h3>
                    <p className="text-sm text-neutral-600">Save mobile data</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={backupSettings.syncOverWifi}
                      onChange={(e) =>
                        setBackupSettings({
                          ...backupSettings,
                          syncOverWifi: e.target.checked,
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-neutral-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-muted rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* About Tab */}
          {activeTab === "about" && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-primary-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Truck className="h-10 w-10 text-primary" />
                </div>
                <h2 className="text-xl font-bold text-neutral-900">
                  G-TRACK CEBU
                </h2>
                <p className="text-neutral-600">Version 1.0.0</p>
              </div>

              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <HelpCircle className="h-5 w-5 text-primary" />
                    <span className="text-neutral-900">Help Center</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-neutral-400" />
                </button>

                <button className="w-full flex items-center justify-between p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <MessageCircle className="h-5 w-5 text-primary" />
                    <span className="text-neutral-900">Contact Support</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-neutral-400" />
                </button>

                <button className="w-full flex items-center justify-between p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <BookOpen className="h-5 w-5 text-primary" />
                    <span className="text-neutral-900">Privacy Policy</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-neutral-400" />
                </button>

                <button className="w-full flex items-center justify-between p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-primary" />
                    <span className="text-neutral-900">Terms of Service</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-neutral-400" />
                </button>

                <button className="w-full flex items-center justify-between p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <Star className="h-5 w-5 text-primary" />
                    <span className="text-neutral-900">Rate the App</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-neutral-400" />
                </button>

                <button className="w-full flex items-center justify-between p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <Share2 className="h-5 w-5 text-primary" />
                    <span className="text-neutral-900">Share with Friends</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-neutral-400" />
                </button>
              </div>

              <p className="text-center text-xs text-neutral-500 mt-6">
                © 2026 G-TRACK CEBU. All rights reserved.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Account Actions */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
        <h3 className="font-semibold text-neutral-900 mb-4">Account Actions</h3>

        <div className="space-y-3">
          <button className="w-full flex items-center justify-between p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                <Download className="h-4 w-4 text-blue-600" />
              </div>
              <div className="text-left">
                <p className="font-medium text-neutral-900">
                  Export Account Data
                </p>
                <p className="text-xs text-neutral-500">
                  Download a copy of your data
                </p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-neutral-400" />
          </button>

          <button className="w-full flex items-center justify-between p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center">
                <Cloud className="h-4 w-4 text-amber-600" />
              </div>
              <div className="text-left">
                <p className="font-medium text-neutral-900">Create Backup</p>
                <p className="text-xs text-neutral-500">
                  Manually backup your settings
                </p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-neutral-400" />
          </button>

          <button className="w-full flex items-center justify-between p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
                <RefreshCw className="h-4 w-4 text-purple-600" />
              </div>
              <div className="text-left">
                <p className="font-medium text-neutral-900">
                  Restore from Backup
                </p>
                <p className="text-xs text-neutral-500">
                  Restore previous settings
                </p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-neutral-400" />
          </button>

          <div className="border-t border-neutral-200 my-3"></div>

          <button
            onClick={() => {
              if (confirm("Are you sure you want to logout?")) {
                logout();
              }
            }}
            className="w-full flex items-center justify-between p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <LogOut className="h-4 w-4 text-red-600" />
              </div>
              <div className="text-left">
                <p className="font-medium text-red-700">Logout</p>
                <p className="text-xs text-red-500">Sign out of your account</p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-red-400" />
          </button>

          <button
            onClick={() => {
              if (
                confirm(
                  "Are you absolutely sure? This action cannot be undone. All your data will be permanently deleted.",
                )
              ) {
                // Handle delete account
              }
            }}
            className="w-full flex items-center justify-between p-4 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white border border-red-200 rounded-lg flex items-center justify-center">
                <Trash2 className="h-4 w-4 text-red-500" />
              </div>
              <div className="text-left">
                <p className="font-medium text-red-600">Delete Account</p>
                <p className="text-xs text-red-400">
                  Permanently delete your account and data
                </p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-red-400" />
          </button>
        </div>

        <p className="text-center text-xs text-neutral-500 mt-4">
          One account per household • G-TRACK v1.0.0
        </p>
      </div>
    </div>
  );
};

export default SettingsPage;
