import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  TrendingUp,
  TrendingDown,
  Truck,
  MapPin,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  Calendar,
  Users,
  Trash2,
  Activity,
  ArrowRight,
  MoreVertical,
  RefreshCw,
  Zap,
  Target,
  Award,
  ChevronRight,
  Bell,
  Navigation,
  Droplets,
  Thermometer,
} from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
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
} from "recharts";

// Custom Tooltip
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border border-neutral-200">
        <p className="font-medium text-neutral-900 mb-1 text-sm">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }} className="text-xs">
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const DashboardPage = () => {
  const { user } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("week");

  // Mock data - replace with real API calls
  const stats = [
    {
      label: "Total Trash Collected",
      value: "12,458 kg",
      change: "+8.5%",
      trend: "up",
      icon: Trash2,
      color: "text-primary",
      bgColor: "bg-primary-muted",
      detail: "↑ 1,234 kg from last week",
    },
    {
      label: "Active Trucks",
      value: "8",
      change: "+2",
      trend: "up",
      icon: Truck,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      detail: "6 on route, 2 returning",
    },
    {
      label: "Pending Reports",
      value: "23",
      change: "-5",
      trend: "down",
      icon: AlertTriangle,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      detail: "5 high priority",
    },
    {
      label: "Completed Routes",
      value: "156",
      change: "+12",
      trend: "up",
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
      detail: "↑ 8.3% completion rate",
    },
  ];

  const recentReports = [
    {
      id: 1,
      type: "Overflowing Trash",
      location: "Brgy. Lahug",
      status: "Pending",
      priority: "High",
      time: "2h ago",
      reportedBy: "Maria Santos",
    },
    {
      id: 2,
      type: "Bad Smell",
      location: "Brgy. Apas",
      status: "Resolved",
      priority: "Medium",
      time: "4h ago",
      reportedBy: "John Reyes",
    },
    {
      id: 3,
      type: "Missed Collection",
      location: "Brgy. Kasambagan",
      status: "In Progress",
      priority: "High",
      time: "5h ago",
      reportedBy: "Ana Cruz",
    },
    {
      id: 4,
      type: "Illegal Dumping",
      location: "Brgy. Budlaan",
      status: "Pending",
      priority: "Critical",
      time: "6h ago",
      reportedBy: "Pedro Garcia",
    },
  ];

  const pollutionLevels = [
    {
      barangay: "Brgy. Lahug",
      level: 72,
      status: "Moderate",
      color: "bg-amber-500",
      trend: "up",
      change: "+5%",
    },
    {
      barangay: "Brgy. Apas",
      level: 85,
      status: "High",
      color: "bg-red-500",
      trend: "up",
      change: "+12%",
    },
    {
      barangay: "Brgy. Kasambagan",
      level: 45,
      status: "Safe",
      color: "bg-green-500",
      trend: "down",
      change: "-3%",
    },
    {
      barangay: "Brgy. Budlaan",
      level: 68,
      status: "Moderate",
      color: "bg-amber-500",
      trend: "stable",
      change: "0%",
    },
    {
      barangay: "Brgy. Capitol",
      level: 38,
      status: "Safe",
      color: "bg-green-500",
      trend: "down",
      change: "-8%",
    },
  ];

  const activeTrucks = [
    {
      id: "GT-101",
      route: "Lahug Route",
      driver: "Juan Dela Cruz",
      status: "On Route",
      progress: 65,
      eta: "45 min",
    },
    {
      id: "GT-102",
      route: "Apas Route",
      driver: "Pedro Santos",
      status: "Collecting",
      progress: 42,
      eta: "1.5 hrs",
    },
    {
      id: "GT-103",
      route: "Guadalupe Route",
      driver: "Maria Garcia",
      status: "Returning",
      progress: 90,
      eta: "20 min",
    },
    {
      id: "GT-104",
      route: "Capitol Route",
      driver: "Carlos Reyes",
      status: "On Route",
      progress: 28,
      eta: "2 hrs",
    },
  ];

  const collectionTrend = [
    { day: "Mon", collected: 1850, target: 2000 },
    { day: "Tue", collected: 2100, target: 2000 },
    { day: "Wed", collected: 1950, target: 2000 },
    { day: "Thu", collected: 2300, target: 2000 },
    { day: "Fri", collected: 1750, target: 2000 },
    { day: "Sat", collected: 1500, target: 1800 },
    { day: "Sun", collected: 1008, target: 1500 },
  ];

  const upcomingSchedules = [
    {
      id: 1,
      route: "Lahug Route",
      time: "7:00 AM",
      truck: "GT-101",
      status: "On Time",
    },
    {
      id: 2,
      route: "Apas Route",
      time: "8:00 AM",
      truck: "GT-102",
      status: "Delayed",
    },
    {
      id: 3,
      route: "Budlaan Route",
      time: "6:00 AM",
      truck: "GT-105",
      status: "On Time",
    },
  ];

  const priorityData = [
    { name: "Critical", value: 3, color: "#991B1B" },
    { name: "High", value: 8, color: "#EF4444" },
    { name: "Medium", value: 15, color: "#F59E0B" },
    { name: "Low", value: 42, color: "#22C55E" },
  ];

  const COLORS = ["#991B1B", "#EF4444", "#F59E0B", "#22C55E"];

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-amber-100 text-amber-800";
      case "Resolved":
        return "bg-green-100 text-green-800";
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      case "High":
        return "bg-red-100 text-red-800";
      case "Critical":
        return "bg-red-200 text-red-900";
      case "Moderate":
        return "bg-amber-100 text-amber-800";
      case "Safe":
        return "bg-green-100 text-green-800";
      case "On Route":
        return "bg-blue-100 text-blue-800";
      case "Collecting":
        return "bg-green-100 text-green-800";
      case "Returning":
        return "bg-purple-100 text-purple-800";
      case "On Time":
        return "bg-green-100 text-green-800";
      case "Delayed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-neutral-100 text-neutral-800";
    }
  };

  const getTrendIcon = (trend) => {
    if (trend === "up") return <TrendingUp className="h-3 w-3 text-red-500" />;
    if (trend === "down")
      return <TrendingDown className="h-3 w-3 text-green-500" />;
    return null;
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
      <div className="mx-auto py-6 lg:py-8">
        <div className="space-y-6 lg:space-y-8">
          {/* Header Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-200/80 transition-all duration-200 hover:shadow-md">
            <div className="p-5 lg:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-neutral-900 tracking-tight">
                    Welcome back, {user?.fullName?.split(" ")[0]}! 👋
                  </h1>
                  <p className="text-neutral-600 mt-1 text-sm lg:text-base">
                    Here's what's happening with waste management today.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-4 py-2.5 bg-primary-muted rounded-xl">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span className="text-xs sm:text-sm font-medium text-primary">
                      {new Date().toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <button
                    onClick={handleRefresh}
                    className="p-2.5 hover:bg-neutral-100 rounded-xl transition-colors"
                  >
                    <RefreshCw
                      className={`h-5 w-5 text-neutral-600 ${isRefreshing ? "animate-spin" : ""}`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="group bg-white rounded-2xl p-5 shadow-sm border border-neutral-200/80 transition-all duration-200 hover:shadow-md hover:border-neutral-300"
                >
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div
                      className={`w-11 h-11 ${stat.bgColor} rounded-xl flex items-center justify-center transition-transform group-hover:scale-105`}
                    >
                      <Icon className={`h-5 w-5 ${stat.color}`} />
                    </div>
                    <div
                      className={`flex items-center gap-1 text-xs font-semibold ${
                        stat.trend === "up" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {stat.trend === "up" ? (
                        <TrendingUp className="h-3.5 w-3.5" />
                      ) : (
                        <TrendingDown className="h-3.5 w-3.5" />
                      )}
                      <span>{stat.change}</span>
                    </div>
                  </div>
                  <h3 className="text-xl lg:text-2xl font-bold text-neutral-900">
                    {stat.value}
                  </h3>
                  <p className="text-sm text-neutral-600 mt-1 font-medium">
                    {stat.label}
                  </p>
                  <p className="text-xs text-neutral-500 mt-2">{stat.detail}</p>
                </div>
              );
            })}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Left Column - 2 cols */}
            <div className="lg:col-span-2 space-y-6">
              {/* Collection Trend Chart */}
              <div className="bg-white rounded-2xl shadow-sm border border-neutral-200/80 overflow-hidden">
                <div className="px-5 py-4 border-b border-neutral-200 bg-neutral-50/40">
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="text-base lg:text-lg font-bold text-neutral-900">
                      Collection Trend
                    </h2>
                    <div className="flex gap-1">
                      {["week", "month", "year"].map((period) => (
                        <button
                          key={period}
                          onClick={() => setSelectedPeriod(period)}
                          className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                            selectedPeriod === period
                              ? "bg-primary text-white"
                              : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                          }`}
                        >
                          {period.charAt(0).toUpperCase() + period.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <ResponsiveContainer width="100%" height={250}>
                    <AreaChart data={collectionTrend}>
                      <defs>
                        <linearGradient
                          id="collectedGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#22C55E"
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor="#22C55E"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
                      <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="collected"
                        stroke="#22C55E"
                        strokeWidth={2}
                        fill="url(#collectedGradient)"
                        name="Collected (kg)"
                      />
                      <Line
                        type="monotone"
                        dataKey="target"
                        stroke="#94A3B8"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        name="Target (kg)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Active Trucks */}
              <div className="bg-white rounded-2xl shadow-sm border border-neutral-200/80 overflow-hidden">
                <div className="px-5 py-4 border-b border-neutral-200 bg-neutral-50/40">
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="text-base lg:text-lg font-bold text-neutral-900">
                      Active Trucks
                    </h2>
                    <button className="text-xs font-semibold text-primary hover:text-primary-dark transition-colors flex items-center gap-1">
                      View All <ChevronRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
                <div className="divide-y divide-neutral-200">
                  {activeTrucks.map((truck) => (
                    <div
                      key={truck.id}
                      className="px-5 py-4 hover:bg-neutral-50 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-sm text-neutral-900">
                              {truck.id}
                            </span>
                            <span className="text-xs text-neutral-500">•</span>
                            <span className="text-sm text-neutral-700">
                              {truck.route}
                            </span>
                          </div>
                          <p className="text-xs text-neutral-600">
                            {truck.driver}
                          </p>
                        </div>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(truck.status)}`}
                        >
                          {truck.status}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-neutral-600">Progress</span>
                          <span className="font-medium text-neutral-900">
                            {truck.progress}%
                          </span>
                        </div>
                        <div className="w-full bg-neutral-200 rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all"
                            style={{ width: `${truck.progress}%` }}
                          />
                        </div>
                        <p className="text-xs text-neutral-500 mt-1">
                          ETA: {truck.eta}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Recent Reports */}
              <div className="bg-white rounded-2xl shadow-sm border border-neutral-200/80 overflow-hidden">
                <div className="px-5 py-4 border-b border-neutral-200 bg-neutral-50/40">
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="text-base lg:text-lg font-bold text-neutral-900">
                      Recent Reports
                    </h2>
                    <button className="text-xs font-semibold text-primary hover:text-primary-dark transition-colors">
                      View All
                    </button>
                  </div>
                </div>
                <div className="divide-y divide-neutral-200">
                  {recentReports.slice(0, 4).map((report) => (
                    <div
                      key={report.id}
                      className="px-5 py-3 hover:bg-neutral-50 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-semibold text-sm text-neutral-900">
                              {report.type}
                            </p>
                            <span
                              className={`px-1.5 py-0.5 text-xs font-medium rounded ${getStatusColor(report.priority)}`}
                            >
                              {report.priority}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <MapPin className="h-3 w-3 text-neutral-500 flex-shrink-0" />
                            <span className="text-xs text-neutral-600 truncate">
                              {report.location}
                            </span>
                          </div>
                          <p className="text-xs text-neutral-500 mt-1">
                            {report.reportedBy} • {report.time}
                          </p>
                        </div>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(report.status)}`}
                        >
                          {report.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Priority Distribution */}
              <div className="bg-white rounded-2xl shadow-sm border border-neutral-200/80 overflow-hidden">
                <div className="px-5 py-4 border-b border-neutral-200 bg-neutral-50/40">
                  <h2 className="text-base lg:text-lg font-bold text-neutral-900">
                    Report Priority Distribution
                  </h2>
                </div>
                <div className="p-4">
                  <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie
                        data={priorityData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={70}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {priorityData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend
                        layout="horizontal"
                        verticalAlign="bottom"
                        align="center"
                        iconSize={8}
                        fontSize={11}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Upcoming Schedules */}
              <div className="bg-white rounded-2xl shadow-sm border border-neutral-200/80 overflow-hidden">
                <div className="px-5 py-4 border-b border-neutral-200 bg-neutral-50/40">
                  <h2 className="text-base lg:text-lg font-bold text-neutral-900">
                    Upcoming Schedules
                  </h2>
                </div>
                <div className="divide-y divide-neutral-200">
                  {upcomingSchedules.map((schedule) => (
                    <div
                      key={schedule.id}
                      className="px-5 py-3 hover:bg-neutral-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm text-neutral-900">
                            {schedule.route}
                          </p>
                          <p className="text-xs text-neutral-600">
                            {schedule.time} • {schedule.truck}
                          </p>
                        </div>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(schedule.status)}`}
                        >
                          {schedule.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Pollution Levels and Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Pollution Levels */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-neutral-200/80 overflow-hidden">
              <div className="px-5 py-4 border-b border-neutral-200 bg-neutral-50/40">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-base lg:text-lg font-bold text-neutral-900">
                    Pollution Levels by Barangay
                  </h2>
                  <button className="text-xs font-semibold text-primary hover:text-primary-dark transition-colors flex items-center gap-1">
                    View Heatmap <ChevronRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
              <div className="p-5">
                <div className="space-y-4">
                  {pollutionLevels.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-neutral-900">
                            {item.barangay}
                          </span>
                          <div className="flex items-center gap-1">
                            {getTrendIcon(item.trend)}
                            <span
                              className={`text-xs ${
                                item.trend === "up"
                                  ? "text-red-500"
                                  : item.trend === "down"
                                    ? "text-green-500"
                                    : "text-neutral-500"
                              }`}
                            >
                              {item.change}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-sm font-bold text-neutral-900">
                            {item.level}%
                          </span>
                          <span
                            className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}
                          >
                            {item.status}
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-neutral-200 rounded-full h-2.5 overflow-hidden">
                        <div
                          className={`${item.color} h-2.5 rounded-full transition-all duration-500 ease-out`}
                          style={{ width: `${item.level}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-sm border border-neutral-200/80 overflow-hidden">
              <div className="px-5 py-4 border-b border-neutral-200 bg-neutral-50/40">
                <h2 className="text-base lg:text-lg font-bold text-neutral-900">
                  Quick Actions
                </h2>
              </div>
              <div className="p-5">
                <div className="grid grid-cols-2 gap-3">
                  <button className="group flex flex-col items-center justify-center gap-2 p-4 bg-primary-muted rounded-xl hover:bg-primary transition-all duration-200">
                    <MapPin className="h-5 w-5 text-primary group-hover:text-white transition-colors" />
                    <span className="text-xs font-semibold text-primary group-hover:text-white">
                      View Heatmap
                    </span>
                  </button>
                  <button className="group flex flex-col items-center justify-center gap-2 p-4 bg-blue-50 rounded-xl hover:bg-blue-600 transition-all duration-200">
                    <Truck className="h-5 w-5 text-blue-600 group-hover:text-white transition-colors" />
                    <span className="text-xs font-semibold text-blue-600 group-hover:text-white">
                      Track Trucks
                    </span>
                  </button>
                  <button className="group flex flex-col items-center justify-center gap-2 p-4 bg-amber-50 rounded-xl hover:bg-amber-600 transition-all duration-200">
                    <AlertTriangle className="h-5 w-5 text-amber-600 group-hover:text-white transition-colors" />
                    <span className="text-xs font-semibold text-amber-600 group-hover:text-white">
                      View Alerts
                    </span>
                  </button>
                  <button className="group flex flex-col items-center justify-center gap-2 p-4 bg-green-50 rounded-xl hover:bg-green-600 transition-all duration-200">
                    <BarChart3 className="h-5 w-5 text-green-600 group-hover:text-white transition-colors" />
                    <span className="text-xs font-semibold text-green-600 group-hover:text-white">
                      Analytics
                    </span>
                  </button>
                  <button className="group flex flex-col items-center justify-center gap-2 p-4 bg-purple-50 rounded-xl hover:bg-purple-600 transition-all duration-200">
                    <Bell className="h-5 w-5 text-purple-600 group-hover:text-white transition-colors" />
                    <span className="text-xs font-semibold text-purple-600 group-hover:text-white">
                      Notifications
                    </span>
                  </button>
                  <button className="group flex flex-col items-center justify-center gap-2 p-4 bg-cyan-50 rounded-xl hover:bg-cyan-600 transition-all duration-200">
                    <Calendar className="h-5 w-5 text-cyan-600 group-hover:text-white transition-colors" />
                    <span className="text-xs font-semibold text-cyan-600 group-hover:text-white">
                      Schedules
                    </span>
                  </button>
                </div>

                {/* System Status */}
                <div className="mt-5 pt-5 border-t border-neutral-200">
                  <h3 className="text-sm font-semibold text-neutral-900 mb-3">
                    System Status
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-neutral-600">
                        API Status
                      </span>
                      <span className="flex items-center gap-1 text-xs text-green-600">
                        <CheckCircle className="h-3 w-3" /> Operational
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-neutral-600">
                        Last Backup
                      </span>
                      <span className="text-xs text-neutral-700">
                        2 hours ago
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-neutral-600">
                        Active Users
                      </span>
                      <span className="text-xs text-neutral-700">
                        24 online
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
