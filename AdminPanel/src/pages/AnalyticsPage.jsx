import React, { useState, useMemo } from "react";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Filter,
  Download,
  RefreshCw,
  Calendar,
  ChevronRight,
  Activity,
  Clock,
  Target,
  Award,
  Zap,
  PieChart as PieChartIcon,
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
  ComposedChart,
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

const AnalyticsPage = () => {
  const [filterPeriod, setFilterPeriod] = useState("month");
  const [chartView, setChartView] = useState("trends");
  const [selectedMetric, setSelectedMetric] = useState("all");

  const problemScaling = [
    {
      urgency: "Critical",
      current: 2,
      previous: 1,
      change: "+100%",
      trend: "up",
      color: "#991B1B",
    },
    {
      urgency: "High",
      current: 5,
      previous: 7,
      change: "-29%",
      trend: "down",
      color: "#EF4444",
    },
    {
      urgency: "Medium",
      current: 12,
      previous: 10,
      change: "+20%",
      trend: "up",
      color: "#F59E0B",
    },
    {
      urgency: "Low",
      current: 25,
      previous: 28,
      change: "-11%",
      trend: "down",
      color: "#22C55E",
    },
  ];

  const monthlyData = [
    { month: "Jan", reports: 45, resolved: 38, pending: 7 },
    { month: "Feb", reports: 52, resolved: 45, pending: 7 },
    { month: "Mar", reports: 48, resolved: 42, pending: 6 },
    { month: "Apr", reports: 61, resolved: 50, pending: 11 },
    { month: "May", reports: 55, resolved: 48, pending: 7 },
    { month: "Jun", reports: 67, resolved: 58, pending: 9 },
  ];

  const topIssues = [
    {
      issue: "Overflowing Trash",
      count: 156,
      percentage: 35,
      color: "#EF4444",
    },
    { issue: "Bad Smell", count: 98, percentage: 22, color: "#F59E0B" },
    { issue: "Missed Collection", count: 87, percentage: 20, color: "#3B82F6" },
    { issue: "Illegal Dumping", count: 65, percentage: 15, color: "#991B1B" },
    { issue: "Other", count: 35, percentage: 8, color: "#8B5CF6" },
  ];

  const weeklyTrends = useMemo(
    () => [
      { day: "Mon", reports: 12, resolved: 8, responseTime: 2.1 },
      { day: "Tue", reports: 15, resolved: 10, responseTime: 1.8 },
      { day: "Wed", reports: 10, resolved: 7, responseTime: 2.4 },
      { day: "Thu", reports: 18, resolved: 12, responseTime: 1.5 },
      { day: "Fri", reports: 14, resolved: 11, responseTime: 2.0 },
      { day: "Sat", reports: 8, resolved: 6, responseTime: 2.8 },
      { day: "Sun", reports: 5, resolved: 4, responseTime: 3.2 },
    ],
    [],
  );

  const barangayPerformance = useMemo(
    () => [
      { name: "Lahug", reports: 89, resolved: 72, efficiency: 81 },
      { name: "Apas", reports: 76, resolved: 58, efficiency: 76 },
      { name: "Kasambagan", reports: 65, resolved: 55, efficiency: 85 },
      { name: "Budlaan", reports: 54, resolved: 42, efficiency: 78 },
      { name: "Capitol", reports: 48, resolved: 44, efficiency: 92 },
      { name: "Banilad", reports: 42, resolved: 35, efficiency: 83 },
    ],
    [],
  );

  const urgencyDistribution = useMemo(() => {
    return problemScaling.map((p) => ({
      name: p.urgency,
      value: p.current,
      color: p.color,
    }));
  }, []);

  const resolutionRateTrend = useMemo(
    () => [
      { month: "Jan", rate: 84 },
      { month: "Feb", rate: 87 },
      { month: "Mar", rate: 88 },
      { month: "Apr", rate: 82 },
      { month: "May", rate: 87 },
      { month: "Jun", rate: 87 },
    ],
    [],
  );

  const stats = {
    totalReports: 441,
    resolvedReports: 323,
    resolutionRate: 73,
    avgResponseTime: "2.5 days",
    criticalIssues: 2,
    highPriority: 5,
    pendingReports: 118,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-neutral-900">
              Analytics
            </h1>
            <p className="text-neutral-600 mt-1 text-sm">
              Analyze problem scaling based on urgency and trends
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={filterPeriod}
              onChange={(e) => setFilterPeriod(e.target.value)}
              className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
            <button className="p-2 hover:bg-neutral-100 rounded-lg transition-colors">
              <RefreshCw className="h-5 w-5 text-neutral-600" />
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm">
              <Download className="h-4 w-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-gradient-to-br from-primary-muted to-primary-muted/50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="h-4 w-4 text-primary" />
            <span className="text-xs font-medium text-primary">Total</span>
          </div>
          <p className="text-xl font-bold text-neutral-900">
            {stats.totalReports}
          </p>
          <p className="text-xs text-neutral-500 mt-1">reports</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Target className="h-4 w-4 text-green-600" />
            <span className="text-xs font-medium text-green-700">Resolved</span>
          </div>
          <p className="text-xl font-bold text-green-900">
            {stats.resolvedReports}
          </p>
          <p className="text-xs text-green-600 mt-1">
            {stats.resolutionRate}% rate
          </p>
        </div>
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-4 w-4 text-amber-600" />
            <span className="text-xs font-medium text-amber-700">Pending</span>
          </div>
          <p className="text-xl font-bold text-amber-900">
            {stats.pendingReports}
          </p>
          <p className="text-xs text-amber-600 mt-1">awaiting action</p>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="h-4 w-4 text-blue-600" />
            <span className="text-xs font-medium text-blue-700">Response</span>
          </div>
          <p className="text-xl font-bold text-blue-900">
            {stats.avgResponseTime}
          </p>
          <p className="text-xs text-blue-600 mt-1">average</p>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <span className="text-xs font-medium text-red-700">Critical</span>
          </div>
          <p className="text-xl font-bold text-red-900">
            {stats.criticalIssues}
          </p>
          <p className="text-xs text-red-600 mt-1">urgent</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Award className="h-4 w-4 text-purple-600" />
            <span className="text-xs font-medium text-purple-700">
              Efficiency
            </span>
          </div>
          <p className="text-xl font-bold text-purple-900">
            {stats.resolutionRate}%
          </p>
          <p className="text-xs text-purple-600 mt-1">resolution</p>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trends Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200">
          <div className="p-5 border-b border-neutral-200">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-neutral-900">
                Monthly Report Trends
              </h2>
              <div className="flex gap-1">
                <button
                  onClick={() => setChartView("trends")}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    chartView === "trends"
                      ? "bg-primary text-white"
                      : "bg-neutral-100 text-neutral-600"
                  }`}
                >
                  Trends
                </button>
                <button
                  onClick={() => setChartView("resolution")}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    chartView === "resolution"
                      ? "bg-primary text-white"
                      : "bg-neutral-100 text-neutral-600"
                  }`}
                >
                  Resolution
                </button>
              </div>
            </div>
          </div>
          <div className="p-5">
            <ResponsiveContainer width="100%" height={280}>
              {chartView === "trends" ? (
                <ComposedChart
                  data={monthlyData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
                  <XAxis
                    dataKey="month"
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
                  <Line
                    type="monotone"
                    dataKey="pending"
                    stroke="#F59E0B"
                    strokeWidth={2}
                    name="Pending"
                    dot={{ r: 4, fill: "#F59E0B" }}
                  />
                </ComposedChart>
              ) : (
                <AreaChart
                  data={resolutionRateTrend}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="rateGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 12, fill: "#737373" }}
                    axisLine={{ stroke: "#E5E5E5" }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: "#737373" }}
                    axisLine={{ stroke: "#E5E5E5" }}
                    tickLine={false}
                    domain={[70, 100]}
                    unit="%"
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="rate"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    fill="url(#rateGradient)"
                    name="Resolution Rate"
                    unit="%"
                  />
                </AreaChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Urgency Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200">
          <div className="p-5 border-b border-neutral-200">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-neutral-900">
                Urgency Distribution
              </h2>
              <PieChartIcon className="h-4 w-4 text-neutral-500" />
            </div>
          </div>
          <div className="p-5">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={urgencyDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {urgencyDistribution.map((entry, index) => (
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
                  wrapperStyle={{ paddingTop: 20 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Second Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Issues */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200">
          <div className="p-5 border-b border-neutral-200">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-neutral-900">
                Top Reported Issues
              </h2>
              <button className="text-sm text-primary hover:text-primary-dark font-medium">
                View All
              </button>
            </div>
          </div>
          <div className="p-5">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart
                data={topIssues}
                layout="vertical"
                margin={{ top: 5, right: 5, left: 80, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#E5E5E5"
                  horizontal={true}
                  vertical={false}
                />
                <XAxis
                  type="number"
                  tick={{ fontSize: 11, fill: "#737373" }}
                  axisLine={{ stroke: "#E5E5E5" }}
                  tickLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="issue"
                  tick={{ fontSize: 12, fill: "#737373" }}
                  axisLine={{ stroke: "#E5E5E5" }}
                  tickLine={false}
                  width={90}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="count"
                  radius={[0, 4, 4, 0]}
                  maxBarSize={30}
                  name="Reports"
                >
                  {topIssues.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Barangay Performance */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200">
          <div className="p-5 border-b border-neutral-200">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-neutral-900">
                Barangay Performance
              </h2>
              <Award className="h-4 w-4 text-neutral-500" />
            </div>
          </div>
          <div className="p-5">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart
                data={barangayPerformance}
                margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: "#737373" }}
                  axisLine={{ stroke: "#E5E5E5" }}
                  tickLine={false}
                  angle={-30}
                  textAnchor="end"
                  height={60}
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
                  maxBarSize={35}
                />
                <Bar
                  dataKey="resolved"
                  fill="#22C55E"
                  radius={[4, 4, 0, 0]}
                  name="Resolved"
                  maxBarSize={35}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Problem Scaling & Weekly Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Problem Scaling Cards */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200">
          <div className="p-5 border-b border-neutral-200">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-neutral-900">
                Problem Scaling by Urgency
              </h2>
              <AlertTriangle className="h-4 w-4 text-neutral-500" />
            </div>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-2 gap-3">
              {problemScaling.map((item, index) => (
                <div
                  key={index}
                  className="rounded-xl p-4 border"
                  style={{
                    borderColor: item.color + "40",
                    backgroundColor: item.color + "08",
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className="text-sm font-medium"
                      style={{ color: item.color }}
                    >
                      {item.urgency}
                    </span>
                    <div
                      className={`flex items-center gap-1 text-xs font-medium ${
                        item.trend === "up" ? "text-red-600" : "text-green-600"
                      }`}
                    >
                      {item.trend === "up" ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      {item.change}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-neutral-500">Current</p>
                      <p className="text-xl font-bold text-neutral-900">
                        {item.current}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-neutral-500">Previous</p>
                      <p className="text-lg font-semibold text-neutral-600">
                        {item.previous}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 w-full bg-neutral-200 rounded-full h-1.5">
                    <div
                      className="h-1.5 rounded-full"
                      style={{
                        width: `${(item.current / 30) * 100}%`,
                        backgroundColor: item.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Weekly Trends */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200">
          <div className="p-5 border-b border-neutral-200">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-neutral-900">
                Weekly Activity
              </h2>
              <Calendar className="h-4 w-4 text-neutral-500" />
            </div>
          </div>
          <div className="p-5">
            <ResponsiveContainer width="100%" height={240}>
              <LineChart
                data={weeklyTrends}
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
                  yAxisId="left"
                  tick={{ fontSize: 12, fill: "#737373" }}
                  axisLine={{ stroke: "#E5E5E5" }}
                  tickLine={false}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 12, fill: "#737373" }}
                  axisLine={{ stroke: "#E5E5E5" }}
                  tickLine={false}
                  unit="d"
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ paddingTop: 16 }}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="reports"
                  stroke="#EF4444"
                  strokeWidth={2}
                  name="Reports"
                  dot={{ r: 4, fill: "#EF4444" }}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="resolved"
                  stroke="#22C55E"
                  strokeWidth={2}
                  name="Resolved"
                  dot={{ r: 4, fill: "#22C55E" }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="responseTime"
                  stroke="#F59E0B"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Response Time"
                  dot={{ r: 3, fill: "#F59E0B" }}
                  unit=" days"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Resolution Efficiency */}
      <div className="bg-gradient-to-r from-primary-muted to-green-50 rounded-xl p-6 border border-primary-light">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-primary/20 rounded-xl flex items-center justify-center">
              <Zap className="h-7 w-7 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-neutral-900">
                Resolution Efficiency
              </h3>
              <p className="text-sm text-neutral-600">
                Your team is resolving reports faster than last month
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-primary">
              {stats.resolutionRate}%
            </p>
            <p className="text-sm text-green-600 flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              +5% from last month
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
