import React, { useState, useMemo } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  Trash2,
  Map,
  Truck,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Bug,
  Bell,
  Calendar,
  Clock,
  MapPin,
  Users,
  Activity,
  ChevronRight,
  RefreshCw,
  Download,
  Filter,
} from "lucide-react";
import {
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
  LineChart,
  Line,
  RadialBarChart,
  RadialBar,
} from "recharts";

// Custom Tooltip
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white px-4 py-3 rounded-lg shadow-lg border border-neutral-200">
        <p className="text-sm font-medium text-neutral-900 mb-2">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }} className="text-sm">
            <span className="font-medium">{entry.name}:</span> {entry.value}{" "}
            {entry.unit || ""}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const DashboardPage = () => {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState("week");
  const [selectedPeriod, setSelectedPeriod] = useState("week");

  // Mock data
  const stats = [
    {
      label: "Total Trash Collected",
      value: "24.5 tons",
      change: "+12.3%",
      trend: "up",
      icon: Trash2,
      color: "text-primary",
      bgColor: "bg-primary-muted",
    },
    {
      label: "Active Trucks",
      value: "12",
      change: "+3",
      trend: "up",
      icon: Truck,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      label: "High Urgency Areas",
      value: "5",
      change: "-2",
      trend: "down",
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      label: "Bug Reports",
      value: "8",
      change: "+2",
      trend: "up",
      icon: Bug,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
    },
  ];

  const urgencyLevels = [
    { level: "Critical", count: 2, color: "#991B1B", percentage: 15 },
    { level: "High", count: 5, color: "#EF4444", percentage: 35 },
    { level: "Medium", count: 12, color: "#F59E0B", percentage: 50 },
    { level: "Low", count: 25, color: "#22C55E", percentage: 85 },
  ];

  const recentReports = [
    {
      id: 1,
      type: "Overflowing Trash",
      location: "Brgy. Lahug",
      status: "Pending",
      priority: "High",
      time: "2h ago",
    },
    {
      id: 2,
      type: "Bad Smell",
      location: "Brgy. Apas",
      status: "Resolved",
      priority: "Medium",
      time: "4h ago",
    },
    {
      id: 3,
      type: "Missed Collection",
      location: "Brgy. Kasambagan",
      status: "In Progress",
      priority: "High",
      time: "5h ago",
    },
    {
      id: 4,
      type: "Illegal Dumping",
      location: "Brgy. Budlaan",
      status: "Pending",
      priority: "Critical",
      time: "6h ago",
    },
  ];

  // Chart Data
  const collectionTrend = useMemo(
    () => [
      { day: "Mon", collected: 3.2, target: 3.5 },
      { day: "Tue", collected: 3.8, target: 3.5 },
      { day: "Wed", collected: 4.1, target: 3.5 },
      { day: "Thu", collected: 3.5, target: 3.5 },
      { day: "Fri", collected: 4.5, target: 3.5 },
      { day: "Sat", collected: 3.0, target: 3.0 },
      { day: "Sun", collected: 2.4, target: 2.5 },
    ],
    [],
  );

  const weeklyReports = useMemo(
    () => [
      { day: "Mon", reports: 12, resolved: 8 },
      { day: "Tue", reports: 15, resolved: 10 },
      { day: "Wed", reports: 10, resolved: 7 },
      { day: "Thu", reports: 18, resolved: 12 },
      { day: "Fri", reports: 14, resolved: 11 },
      { day: "Sat", reports: 8, resolved: 6 },
      { day: "Sun", reports: 5, resolved: 4 },
    ],
    [],
  );

  const reportTypeData = useMemo(
    () => [
      { name: "Overflowing", value: 35, color: "#EF4444" },
      { name: "Bad Smell", value: 25, color: "#F59E0B" },
      { name: "Missed Collection", value: 20, color: "#3B82F6" },
      { name: "Illegal Dumping", value: 15, color: "#991B1B" },
      { name: "Others", value: 5, color: "#8B5CF6" },
    ],
    [],
  );

  const barangayData = useMemo(
    () => [
      { name: "Lahug", reports: 28, resolved: 22 },
      { name: "Apas", reports: 22, resolved: 18 },
      { name: "Kasambagan", reports: 18, resolved: 15 },
      { name: "Budlaan", reports: 15, resolved: 10 },
      { name: "Capitol", reports: 12, resolved: 11 },
      { name: "Mabolo", reports: 10, resolved: 8 },
    ],
    [],
  );

  const pollutionData = useMemo(
    () => [
      { time: "00:00", aqi: 45 },
      { time: "04:00", aqi: 42 },
      { time: "08:00", aqi: 58 },
      { time: "12:00", aqi: 72 },
      { time: "16:00", aqi: 65 },
      { time: "20:00", aqi: 52 },
    ],
    [],
  );

  const truckStatusData = useMemo(
    () => [
      { name: "On Route", value: 8, color: "#22C55E" },
      { name: "Returning", value: 3, color: "#F59E0B" },
      { name: "Maintenance", value: 1, color: "#EF4444" },
    ],
    [],
  );

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
      case "Medium":
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-neutral-100 text-neutral-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-neutral-900">
              Welcome back, {user?.fullName?.split(" ")[0]}! 👋
            </h1>
            <p className="text-neutral-600 mt-1 text-sm">
              Here's an overview of the waste monitoring system.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-4 py-2 bg-primary-muted rounded-lg">
              <Calendar className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            <button className="p-2 hover:bg-neutral-100 rounded-lg transition-colors">
              <RefreshCw className="h-5 w-5 text-neutral-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white rounded-xl p-5 lg:p-6 shadow-sm border border-neutral-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}
                >
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div
                  className={`flex items-center gap-1 text-sm font-medium ${
                    stat.trend === "up" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {stat.trend === "up" ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  {stat.change}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-neutral-900">
                {stat.value}
              </h3>
              <p className="text-sm text-neutral-600 mt-1">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Collection Trend */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200">
          <div className="p-5 border-b border-neutral-200">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-neutral-900">
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
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart
                data={collectionTrend}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="collectedGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#22C55E" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 12, fill: "#737373" }}
                  axisLine={{ stroke: "#E5E5E5" }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: "#737373" }}
                  axisLine={{ stroke: "#E5E5E5" }}
                  tickLine={false}
                  unit="t"
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ paddingTop: 16 }}
                />
                <Area
                  type="monotone"
                  dataKey="collected"
                  stroke="#22C55E"
                  strokeWidth={2}
                  fill="url(#collectedGradient)"
                  name="Collected"
                  unit=" tons"
                />
                <Line
                  type="monotone"
                  dataKey="target"
                  stroke="#94A3B8"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Target"
                  unit=" tons"
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Report Type Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200">
          <div className="p-5 border-b border-neutral-200">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-neutral-900">
                Report Types
              </h2>
              <BarChart3 className="h-4 w-4 text-neutral-500" />
            </div>
          </div>
          <div className="p-5">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={reportTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={95}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {reportTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  layout="horizontal"
                  verticalAlign="bottom"
                  align="center"
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ paddingTop: 16 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Second Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Reports */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-neutral-200">
          <div className="p-5 border-b border-neutral-200">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-neutral-900">
                Weekly Reports Overview
              </h2>
              <button className="text-sm text-primary hover:text-primary-dark font-medium flex items-center gap-1">
                View Details <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="p-5">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart
                data={weeklyReports}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 12, fill: "#737373" }}
                  axisLine={{ stroke: "#E5E5E5" }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: "#737373" }}
                  axisLine={{ stroke: "#E5E5E5" }}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ paddingTop: 16 }}
                />
                <Bar
                  dataKey="reports"
                  fill="#EF4444"
                  radius={[4, 4, 0, 0]}
                  name="Total Reports"
                />
                <Bar
                  dataKey="resolved"
                  fill="#22C55E"
                  radius={[4, 4, 0, 0]}
                  name="Resolved"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Truck Status */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200">
          <div className="p-5 border-b border-neutral-200">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-neutral-900">
                Truck Status
              </h2>
              <Truck className="h-4 w-4 text-neutral-500" />
            </div>
          </div>
          <div className="p-5">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={truckStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {truckStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  layout="horizontal"
                  verticalAlign="bottom"
                  align="center"
                  iconType="circle"
                  iconSize={8}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 pt-4 border-t border-neutral-200">
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-600">Total Active:</span>
                <span className="font-bold text-neutral-900">11 trucks</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-neutral-600">Avg. Efficiency:</span>
                <span className="font-bold text-green-600">92%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row - Urgency, Reports, Pollution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Urgency Levels */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200">
          <div className="p-5 border-b border-neutral-200">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-neutral-900">
                Urgency Levels
              </h2>
              <AlertTriangle className="h-4 w-4 text-neutral-500" />
            </div>
          </div>
          <div className="p-5 space-y-4">
            {urgencyLevels.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm font-medium text-neutral-900">
                      {item.level}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-neutral-900">
                    {item.count} areas
                  </span>
                </div>
                <div className="w-full bg-neutral-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{
                      width: `${item.percentage}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Reports */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200">
          <div className="p-5 border-b border-neutral-200">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-neutral-900">
                Recent Reports
              </h2>
              <button className="text-sm text-primary hover:text-primary-dark font-medium">
                View All
              </button>
            </div>
          </div>
          <div className="divide-y divide-neutral-200">
            {recentReports.map((report) => (
              <div
                key={report.id}
                className="p-4 hover:bg-neutral-50 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-neutral-900 truncate">
                      {report.type}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <MapPin className="h-3 w-3 text-neutral-500 flex-shrink-0" />
                      <span className="text-xs text-neutral-600 truncate">
                        {report.location}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <span
                      className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(report.status)}`}
                    >
                      {report.status}
                    </span>
                    <span
                      className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(report.priority)}`}
                    >
                      {report.priority}
                    </span>
                    <span className="text-xs text-neutral-500">
                      {report.time}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pollution Trend */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200">
          <div className="p-5 border-b border-neutral-200">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-neutral-900">
                AQI Trend (24h)
              </h2>
              <Activity className="h-4 w-4 text-neutral-500" />
            </div>
          </div>
          <div className="p-5">
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart
                data={pollutionData}
                margin={{ top: 5, right: 5, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="aqiGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
                <XAxis
                  dataKey="time"
                  tick={{ fontSize: 11, fill: "#737373" }}
                  axisLine={{ stroke: "#E5E5E5" }}
                  tickLine={false}
                  interval={1}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#737373" }}
                  axisLine={{ stroke: "#E5E5E5" }}
                  tickLine={false}
                  domain={[0, 100]}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="aqi"
                  stroke="#F59E0B"
                  strokeWidth={2}
                  fill="url(#aqiGradient)"
                  name="AQI"
                />
              </AreaChart>
            </ResponsiveContainer>
            <div className="mt-3 flex items-center justify-between text-sm">
              <div>
                <span className="text-neutral-600">Current AQI:</span>
                <span className="ml-2 font-bold text-amber-600">52</span>
              </div>
              <div>
                <span className="text-neutral-600">Status:</span>
                <span className="ml-2 font-medium text-amber-600">
                  Moderate
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Barangay Performance */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200">
        <div className="p-5 border-b border-neutral-200">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-neutral-900">
              Barangay Performance
            </h2>
            <button className="text-sm text-primary hover:text-primary-dark font-medium">
              View All Barangays
            </button>
          </div>
        </div>
        <div className="p-5">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart
              data={barangayData}
              layout="horizontal"
              margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12, fill: "#737373" }}
                axisLine={{ stroke: "#E5E5E5" }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "#737373" }}
                axisLine={{ stroke: "#E5E5E5" }}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ paddingTop: 16 }}
              />
              <Bar
                dataKey="reports"
                fill="#EF4444"
                radius={[4, 4, 0, 0]}
                name="Total Reports"
                maxBarSize={40}
              />
              <Bar
                dataKey="resolved"
                fill="#22C55E"
                radius={[4, 4, 0, 0]}
                name="Resolved"
                maxBarSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
        <h2 className="text-base font-bold text-neutral-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          <button className="group p-4 bg-primary-muted rounded-xl hover:bg-primary transition-all duration-200">
            <Map className="h-6 w-6 mx-auto mb-2 text-primary group-hover:text-white transition-colors" />
            <span className="text-sm font-medium text-primary group-hover:text-white transition-colors">
              View Heatmap
            </span>
          </button>
          <button className="group p-4 bg-blue-50 rounded-xl hover:bg-blue-600 transition-all duration-200">
            <Truck className="h-6 w-6 mx-auto mb-2 text-blue-600 group-hover:text-white transition-colors" />
            <span className="text-sm font-medium text-blue-600 group-hover:text-white transition-colors">
              Track Trucks
            </span>
          </button>
          <button className="group p-4 bg-red-50 rounded-xl hover:bg-red-600 transition-all duration-200">
            <AlertTriangle className="h-6 w-6 mx-auto mb-2 text-red-600 group-hover:text-white transition-colors" />
            <span className="text-sm font-medium text-red-600 group-hover:text-white transition-colors">
              View Alerts
            </span>
          </button>
          <button className="group p-4 bg-green-50 rounded-xl hover:bg-green-600 transition-all duration-200">
            <BarChart3 className="h-6 w-6 mx-auto mb-2 text-green-600 group-hover:text-white transition-colors" />
            <span className="text-sm font-medium text-green-600 group-hover:text-white transition-colors">
              Analytics
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
