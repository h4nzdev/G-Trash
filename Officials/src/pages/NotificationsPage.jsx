import React, { useState, useMemo } from "react";
import {
  Bell,
  AlertTriangle,
  Info,
  CheckCircle,
  X,
  Trash2,
  Filter,
  Search,
  CheckCheck,
  Archive,
  Settings,
  Clock,
  MapPin,
  Truck,
  Users,
  Calendar,
  ChevronDown,
  ChevronRight,
  MoreVertical,
  BellOff,
  Volume2,
  Download,
  RefreshCw,
  Inbox,
  AlertCircle,
  TrendingUp,
  BarChart3,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts";

// Custom Tooltip
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-lg border border-neutral-200">
        <p className="font-medium text-neutral-900 mb-2">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }} className="text-sm">
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const NotificationsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterRead, setFilterRead] = useState("all");
  const [selectedNotifications, setSelectedNotifications] = useState([]);
  const [viewMode, setViewMode] = useState("list"); // list, grouped, analytics
  const [expandedGroups, setExpandedGroups] = useState(["today", "yesterday"]);
  const [showSettings, setShowSettings] = useState(false);

  // Enhanced notifications data
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "alert",
      title: "High Pollution Alert",
      message:
        "Brgy. Apas pollution level reached 85%. Immediate action required.",
      time: "5 minutes ago",
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      read: false,
      priority: "High",
      category: "pollution",
      actionable: true,
      actionLabel: "View Details",
      actionLink: "/heatmap",
      metadata: {
        location: "Brgy. Apas",
        value: "85%",
        threshold: "75%",
      },
    },
    {
      id: 2,
      type: "info",
      title: "Collection Schedule Updated",
      message: "Brgy. Lahug collection time changed to 8:00 AM tomorrow.",
      time: "1 hour ago",
      timestamp: new Date(Date.now() - 60 * 60 * 1000),
      read: false,
      priority: "Medium",
      category: "schedule",
      actionable: true,
      actionLabel: "View Schedule",
      actionLink: "/schedules",
      metadata: {
        route: "Lahug Route",
        oldTime: "7:00 AM",
        newTime: "8:00 AM",
      },
    },
    {
      id: 3,
      type: "success",
      title: "Route Completed",
      message:
        "GT-103 completed Guadalupe route successfully. 580kg collected.",
      time: "2 hours ago",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: true,
      priority: "Low",
      category: "collection",
      actionable: false,
      metadata: {
        truck: "GT-103",
        route: "Guadalupe Route",
        collected: "580kg",
      },
    },
    {
      id: 4,
      type: "alert",
      title: "Overflowing Trash Report",
      message: "New report from Brgy. Budlaan: Illegal dumping near school.",
      time: "3 hours ago",
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
      read: true,
      priority: "High",
      category: "report",
      actionable: true,
      actionLabel: "View Report",
      actionLink: "/reports",
      metadata: {
        location: "Brgy. Budlaan",
        reportType: "Illegal Dumping",
        reporter: "Pedro Garcia",
      },
    },
    {
      id: 5,
      type: "info",
      title: "System Maintenance",
      message:
        "Scheduled maintenance on March 30, 2026 from 2:00 AM - 4:00 AM.",
      time: "1 day ago",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      read: true,
      priority: "Low",
      category: "system",
      actionable: false,
      metadata: {
        date: "March 30, 2026",
        duration: "2 hours",
      },
    },
    {
      id: 6,
      type: "alert",
      title: "Truck Delay",
      message: "GT-101 is running 30 minutes behind schedule on Lahug Route.",
      time: "4 hours ago",
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      read: false,
      priority: "Medium",
      category: "collection",
      actionable: true,
      actionLabel: "Track Truck",
      actionLink: "/tracking",
      metadata: {
        truck: "GT-101",
        route: "Lahug Route",
        delay: "30 minutes",
      },
    },
    {
      id: 7,
      type: "success",
      title: "Report Resolved",
      message: "Overflowing trash report at Brgy. Capitol has been resolved.",
      time: "6 hours ago",
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      read: true,
      priority: "Medium",
      category: "report",
      actionable: false,
      metadata: {
        location: "Brgy. Capitol",
        reportId: "#RPT-2024-089",
      },
    },
    {
      id: 8,
      type: "alert",
      title: "Critical Methane Levels",
      message: "Brgy. Kasambagan methane levels exceed safety threshold.",
      time: "8 hours ago",
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
      read: true,
      priority: "Critical",
      category: "pollution",
      actionable: true,
      actionLabel: "View Heatmap",
      actionLink: "/heatmap",
      metadata: {
        location: "Brgy. Kasambagan",
        methane: "5.2 ppm",
        threshold: "3.0 ppm",
      },
    },
    {
      id: 9,
      type: "info",
      title: "New Driver Assigned",
      message: "Maria Garcia assigned to GT-103 for Budlaan Route.",
      time: "Yesterday",
      timestamp: new Date(Date.now() - 30 * 60 * 60 * 1000),
      read: true,
      priority: "Low",
      category: "staff",
      actionable: false,
      metadata: {
        driver: "Maria Garcia",
        truck: "GT-103",
        route: "Budlaan Route",
      },
    },
    {
      id: 10,
      type: "alert",
      title: "Missed Collection",
      message: "Brgy. Mabolo reported missed collection this morning.",
      time: "Yesterday",
      timestamp: new Date(Date.now() - 28 * 60 * 60 * 1000),
      read: false,
      priority: "High",
      category: "collection",
      actionable: true,
      actionLabel: "Reschedule",
      actionLink: "/schedules",
      metadata: {
        location: "Brgy. Mabolo",
        scheduledTime: "7:00 AM",
        reason: "Truck breakdown",
      },
    },
  ]);

  const getNotificationIcon = (type) => {
    switch (type) {
      case "alert":
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case "info":
        return <Info className="h-5 w-5 text-blue-600" />;
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      default:
        return <Bell className="h-5 w-5 text-neutral-600" />;
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case "pollution":
        return <AlertTriangle className="h-4 w-4" />;
      case "schedule":
        return <Calendar className="h-4 w-4" />;
      case "collection":
        return <Truck className="h-4 w-4" />;
      case "report":
        return <MapPin className="h-4 w-4" />;
      case "system":
        return <Settings className="h-4 w-4" />;
      case "staff":
        return <Users className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Critical":
        return "bg-red-200 text-red-900 border-red-300";
      case "High":
        return "bg-red-100 text-red-800 border-red-200";
      case "Medium":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "Low":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-neutral-100 text-neutral-800 border-neutral-200";
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "alert":
        return "border-l-4 border-l-red-500";
      case "info":
        return "border-l-4 border-l-blue-500";
      case "success":
        return "border-l-4 border-l-green-500";
      default:
        return "";
    }
  };

  // Filter notifications
  const filteredNotifications = useMemo(() => {
    return notifications.filter((notification) => {
      const matchesSearch =
        notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notification.message.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType =
        filterType === "all" || notification.type === filterType;
      const matchesPriority =
        filterPriority === "all" || notification.priority === filterPriority;
      const matchesRead =
        filterRead === "all" ||
        (filterRead === "unread" && !notification.read) ||
        (filterRead === "read" && notification.read);
      return matchesSearch && matchesType && matchesPriority && matchesRead;
    });
  }, [notifications, searchTerm, filterType, filterPriority, filterRead]);

  // Group notifications
  const groupedNotifications = useMemo(() => {
    const groups = {
      today: [],
      yesterday: [],
      thisWeek: [],
      older: [],
    };

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    filteredNotifications.forEach((notification) => {
      const notifDate = new Date(notification.timestamp);
      if (notifDate >= today) {
        groups.today.push(notification);
      } else if (notifDate >= yesterday) {
        groups.yesterday.push(notification);
      } else if (notifDate >= weekAgo) {
        groups.thisWeek.push(notification);
      } else {
        groups.older.push(notification);
      }
    });

    return groups;
  }, [filteredNotifications]);

  // Statistics
  const stats = useMemo(() => {
    const total = notifications.length;
    const unread = notifications.filter((n) => !n.read).length;
    const critical = notifications.filter(
      (n) => n.priority === "Critical",
    ).length;
    const high = notifications.filter((n) => n.priority === "High").length;
    const alerts = notifications.filter((n) => n.type === "alert").length;
    const today = notifications.filter(
      (n) => new Date(n.timestamp) >= new Date().setHours(0, 0, 0, 0),
    ).length;

    return { total, unread, critical, high, alerts, today };
  }, [notifications]);

  // Chart data
  const notificationsByType = useMemo(() => {
    const types = {};
    notifications.forEach((n) => {
      types[n.type] = (types[n.type] || 0) + 1;
    });
    return Object.entries(types).map(([name, value]) => ({ name, value }));
  }, [notifications]);

  const notificationsByCategory = useMemo(() => {
    const categories = {};
    notifications.forEach((n) => {
      categories[n.category] = (categories[n.category] || 0) + 1;
    });
    return Object.entries(categories).map(([name, value]) => ({ name, value }));
  }, [notifications]);

  const priorityData = [
    { name: "Critical", value: stats.critical, color: "#991B1B" },
    { name: "High", value: stats.high, color: "#EF4444" },
    {
      name: "Medium",
      value: notifications.filter((n) => n.priority === "Medium").length,
      color: "#F59E0B",
    },
    {
      name: "Low",
      value: notifications.filter((n) => n.priority === "Low").length,
      color: "#3B82F6",
    },
  ];

  const weeklyData = [
    { day: "Mon", alerts: 8, info: 5, success: 3 },
    { day: "Tue", alerts: 6, info: 7, success: 4 },
    { day: "Wed", alerts: 10, info: 4, success: 5 },
    { day: "Thu", alerts: 7, info: 6, success: 3 },
    { day: "Fri", alerts: 5, info: 8, success: 6 },
    { day: "Sat", alerts: 3, info: 3, success: 2 },
    { day: "Sun", alerts: 2, info: 2, success: 1 },
  ];

  const handleMarkAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleDelete = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    setSelectedNotifications((prev) => prev.filter((nId) => nId !== id));
  };

  const handleDeleteSelected = () => {
    setNotifications((prev) =>
      prev.filter((n) => !selectedNotifications.includes(n.id)),
    );
    setSelectedNotifications([]);
  };

  const handleSelectAll = () => {
    if (selectedNotifications.length === filteredNotifications.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(filteredNotifications.map((n) => n.id));
    }
  };

  const handleSelectNotification = (id) => {
    setSelectedNotifications((prev) =>
      prev.includes(id) ? prev.filter((nId) => nId !== id) : [...prev, id],
    );
  };

  const handleArchive = (id) => {
    // In a real app, this would move to archive
    handleDelete(id);
  };

  const COLORS = ["#EF4444", "#3B82F6", "#22C55E", "#F59E0B", "#8B5CF6"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">
              Notifications
            </h1>
            <p className="text-neutral-600 mt-1">
              Manage alerts and system notifications
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="flex bg-neutral-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode("list")}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  viewMode === "list"
                    ? "bg-white text-primary shadow-sm"
                    : "text-neutral-600"
                }`}
              >
                List
              </button>
              <button
                onClick={() => setViewMode("grouped")}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  viewMode === "grouped"
                    ? "bg-white text-primary shadow-sm"
                    : "text-neutral-600"
                }`}
              >
                Grouped
              </button>
              <button
                onClick={() => setViewMode("analytics")}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1 ${
                  viewMode === "analytics"
                    ? "bg-white text-primary shadow-sm"
                    : "text-neutral-600"
                }`}
              >
                <BarChart3 className="h-4 w-4" />
                Analytics
              </button>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors">
              <Settings className="h-5 w-5" />
              <span className="text-sm font-medium">Settings</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mt-6">
          <div className="bg-gradient-to-br from-neutral-50 to-neutral-100 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Bell className="h-4 w-4 text-neutral-600" />
              <span className="text-xs font-medium text-neutral-700">
                Total
              </span>
            </div>
            <p className="text-2xl font-bold text-neutral-900">{stats.total}</p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Inbox className="h-4 w-4 text-blue-600" />
              <span className="text-xs font-medium text-blue-700">Unread</span>
            </div>
            <p className="text-2xl font-bold text-blue-900">{stats.unread}</p>
          </div>
          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <span className="text-xs font-medium text-red-700">Alerts</span>
            </div>
            <p className="text-2xl font-bold text-red-900">{stats.alerts}</p>
          </div>
          <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <span className="text-xs font-medium text-amber-700">
                Critical
              </span>
            </div>
            <p className="text-2xl font-bold text-amber-900">
              {stats.critical}
            </p>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-orange-600" />
              <span className="text-xs font-medium text-orange-700">High</span>
            </div>
            <p className="text-2xl font-bold text-orange-900">{stats.high}</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-green-600" />
              <span className="text-xs font-medium text-green-700">Today</span>
            </div>
            <p className="text-2xl font-bold text-green-900">{stats.today}</p>
          </div>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-neutral-200">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-500" />
              <input
                type="text"
                placeholder="Search notifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              >
                <option value="all">All Types</option>
                <option value="alert">Alerts</option>
                <option value="info">Info</option>
                <option value="success">Success</option>
              </select>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              >
                <option value="all">All Priorities</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
              <select
                value={filterRead}
                onChange={(e) => setFilterRead(e.target.value)}
                className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              >
                <option value="all">All</option>
                <option value="unread">Unread</option>
                <option value="read">Read</option>
              </select>
            </div>
          </div>

          {/* Bulk Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handleSelectAll}
                className="text-sm text-primary hover:text-primary-dark font-medium"
              >
                {selectedNotifications.length === filteredNotifications.length
                  ? "Deselect All"
                  : "Select All"}
              </button>
              {selectedNotifications.length > 0 && (
                <span className="text-sm text-neutral-600">
                  {selectedNotifications.length} selected
                </span>
              )}
            </div>
            <div className="flex gap-2">
              {stats.unread > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
                >
                  <CheckCheck className="h-4 w-4" />
                  Mark all as read
                </button>
              )}
              {selectedNotifications.length > 0 && (
                <>
                  <button
                    onClick={() => {
                      selectedNotifications.forEach(handleMarkAsRead);
                      setSelectedNotifications([]);
                    }}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <CheckCheck className="h-4 w-4" />
                    Mark as read
                  </button>
                  <button
                    onClick={handleDeleteSelected}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                </>
              )}
              <button className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors">
                <Download className="h-4 w-4" />
                Export
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {viewMode === "list" && (
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
          <div className="divide-y divide-neutral-200">
            {filteredNotifications.length === 0 ? (
              <div className="p-12 text-center">
                <Bell className="h-16 w-16 text-neutral-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                  No notifications
                </h3>
                <p className="text-neutral-600">You're all caught up!</p>
              </div>
            ) : (
              filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-6 hover:bg-neutral-50 transition-colors relative ${getTypeColor(notification.type)} ${
                    !notification.read ? "bg-blue-50/30" : ""
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <input
                      type="checkbox"
                      checked={selectedNotifications.includes(notification.id)}
                      onChange={() => handleSelectNotification(notification.id)}
                      className="mt-1 rounded border-neutral-300 text-primary focus:ring-primary"
                    />

                    <div className="flex-shrink-0">
                      {getNotificationIcon(notification.type)}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-neutral-900">
                              {notification.title}
                            </h3>
                            {!notification.read && (
                              <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                New
                              </span>
                            )}
                            <span
                              className={`px-2 py-0.5 text-xs font-medium rounded-full border ${getPriorityColor(notification.priority)}`}
                            >
                              {notification.priority}
                            </span>
                          </div>
                          <p className="text-sm text-neutral-700">
                            {notification.message}
                          </p>

                          {/* Metadata */}
                          {notification.metadata && (
                            <div className="flex flex-wrap gap-3 mt-2">
                              {notification.metadata.location && (
                                <span className="text-xs text-neutral-500 flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {notification.metadata.location}
                                </span>
                              )}
                              {notification.metadata.route && (
                                <span className="text-xs text-neutral-500 flex items-center gap-1">
                                  <Truck className="h-3 w-3" />
                                  {notification.metadata.route}
                                </span>
                              )}
                              {notification.metadata.value && (
                                <span className="text-xs font-medium text-red-600">
                                  {notification.metadata.value}
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-1">
                          {notification.actionable && (
                            <button className="px-3 py-1.5 text-xs font-medium bg-primary-muted text-primary rounded-lg hover:bg-primary-light hover:text-white transition-colors">
                              {notification.actionLabel}
                            </button>
                          )}
                          <button className="p-2 hover:bg-neutral-100 rounded-lg transition-colors">
                            <MoreVertical className="h-4 w-4 text-neutral-500" />
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-neutral-500">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {notification.time}
                        </span>
                        <span className="flex items-center gap-1">
                          {getCategoryIcon(notification.category)}
                          <span className="capitalize">
                            {notification.category}
                          </span>
                        </span>
                        <div className="flex gap-2 ml-auto">
                          {!notification.read && (
                            <button
                              onClick={() => handleMarkAsRead(notification.id)}
                              className="hover:text-blue-600"
                            >
                              Mark as read
                            </button>
                          )}
                          <button
                            onClick={() => handleArchive(notification.id)}
                            className="hover:text-neutral-700"
                          >
                            Archive
                          </button>
                          <button
                            onClick={() => handleDelete(notification.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {viewMode === "grouped" && (
        <div className="space-y-4">
          {Object.entries(groupedNotifications).map(
            ([group, groupNotifications]) => {
              if (groupNotifications.length === 0) return null;

              const groupTitles = {
                today: "Today",
                yesterday: "Yesterday",
                thisWeek: "This Week",
                older: "Older",
              };

              return (
                <div
                  key={group}
                  className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden"
                >
                  <button
                    onClick={() =>
                      setExpandedGroups((prev) =>
                        prev.includes(group)
                          ? prev.filter((g) => g !== group)
                          : [...prev, group],
                      )
                    }
                    className="w-full px-6 py-4 bg-neutral-50 border-b border-neutral-200 flex items-center justify-between hover:bg-neutral-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {expandedGroups.includes(group) ? (
                        <ChevronDown className="h-5 w-5 text-neutral-600" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-neutral-600" />
                      )}
                      <h3 className="font-semibold text-neutral-900">
                        {groupTitles[group]}
                      </h3>
                      <span className="text-sm text-neutral-600">
                        ({groupNotifications.length})
                      </span>
                    </div>
                    <span className="text-xs text-neutral-500">
                      {groupNotifications.filter((n) => !n.read).length} unread
                    </span>
                  </button>

                  {expandedGroups.includes(group) && (
                    <div className="divide-y divide-neutral-200">
                      {groupNotifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-6 hover:bg-neutral-50 transition-colors ${getTypeColor(notification.type)} ${
                            !notification.read ? "bg-blue-50/30" : ""
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
                                    <h3 className="font-semibold text-neutral-900">
                                      {notification.title}
                                    </h3>
                                    {!notification.read && (
                                      <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                        New
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-sm text-neutral-700">
                                    {notification.message}
                                  </p>
                                </div>
                                <span
                                  className={`px-2 py-0.5 text-xs font-medium rounded-full ${getPriorityColor(notification.priority)}`}
                                >
                                  {notification.priority}
                                </span>
                              </div>
                              <div className="flex items-center gap-3 text-xs text-neutral-500">
                                <span>{notification.time}</span>
                                {!notification.read && (
                                  <button
                                    onClick={() =>
                                      handleMarkAsRead(notification.id)
                                    }
                                    className="text-blue-600 hover:text-blue-700"
                                  >
                                    Mark as read
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            },
          )}
        </div>
      )}

      {viewMode === "analytics" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
              <h3 className="font-bold text-neutral-900 mb-4">
                Notifications by Type
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={notificationsByType}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {notificationsByType.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
              <h3 className="font-bold text-neutral-900 mb-4">
                Priority Distribution
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={priorityData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {priorityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
            <h3 className="font-bold text-neutral-900 mb-4">
              Weekly Notification Trends
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="alerts"
                  stackId="1"
                  stroke="#EF4444"
                  fill="#EF4444"
                  fillOpacity={0.3}
                />
                <Area
                  type="monotone"
                  dataKey="info"
                  stackId="1"
                  stroke="#3B82F6"
                  fill="#3B82F6"
                  fillOpacity={0.3}
                />
                <Area
                  type="monotone"
                  dataKey="success"
                  stackId="1"
                  stroke="#22C55E"
                  fill="#22C55E"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
            <h3 className="font-bold text-neutral-900 mb-4">
              Notifications by Category
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={notificationsByCategory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Notification Settings Modal - Simplified */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Notification Settings</h2>
            {/* Settings content would go here */}
            <button
              onClick={() => setShowSettings(false)}
              className="w-full px-4 py-2 bg-primary text-white rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
