import React, { useState, useMemo } from "react";
import {
  Trash2,
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  Filter,
  MapPin,
  Truck,
  Award,
  ChevronRight,
  RefreshCw,
  BarChart3,
  Target,
  Zap,
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

const TrashCollectionPage = () => {
  const [filterBarangay, setFilterBarangay] = useState("all");
  const [filterPeriod, setFilterPeriod] = useState("week");
  const [chartView, setChartView] = useState("trend");

  const barangays = [
    {
      name: "Brgy. Lahug",
      collected: 2450,
      target: 3000,
      percentage: 82,
      color: "#22C55E",
    },
    {
      name: "Brgy. Apas",
      collected: 1890,
      target: 2500,
      percentage: 76,
      color: "#F59E0B",
    },
    {
      name: "Brgy. Kasambagan",
      collected: 3120,
      target: 3000,
      percentage: 104,
      color: "#3B82F6",
    },
    {
      name: "Brgy. Budlaan",
      collected: 2780,
      target: 2800,
      percentage: 99,
      color: "#8B5CF6",
    },
    {
      name: "Brgy. Capitol",
      collected: 2100,
      target: 2500,
      percentage: 84,
      color: "#EC4899",
    },
    {
      name: "Brgy. Banilad",
      collected: 1950,
      target: 2200,
      percentage: 89,
      color: "#14B8A6",
    },
  ];

  const collectionHistory = [
    { date: "2026-04-06", day: "Monday", total: 12.5, trucks: 8 },
    { date: "2026-04-05", day: "Sunday", total: 8.2, trucks: 5 },
    { date: "2026-04-04", day: "Saturday", total: 14.1, trucks: 10 },
    { date: "2026-04-03", day: "Friday", total: 11.8, trucks: 9 },
    { date: "2026-04-02", day: "Thursday", total: 10.5, trucks: 7 },
    { date: "2026-04-01", day: "Wednesday", total: 9.8, trucks: 6 },
    { date: "2026-03-31", day: "Tuesday", total: 13.2, trucks: 9 },
  ];

  // Chart Data
  const weeklyTrend = useMemo(
    () => [
      { day: "Mon", collected: 12.5, target: 12.0 },
      { day: "Tue", collected: 13.2, target: 12.0 },
      { day: "Wed", collected: 9.8, target: 12.0 },
      { day: "Thu", collected: 10.5, target: 12.0 },
      { day: "Fri", collected: 11.8, target: 12.0 },
      { day: "Sat", collected: 14.1, target: 12.0 },
      { day: "Sun", collected: 8.2, target: 10.0 },
    ],
    [],
  );

  const monthlyTrend = useMemo(
    () => [
      { week: "Week 1", collected: 48.5, target: 45.0 },
      { week: "Week 2", collected: 52.3, target: 45.0 },
      { week: "Week 3", collected: 44.8, target: 45.0 },
      { week: "Week 4", collected: 55.2, target: 45.0 },
    ],
    [],
  );

  const wasteTypeData = useMemo(
    () => [
      { name: "Biodegradable", value: 45, color: "#22C55E" },
      { name: "Recyclable", value: 30, color: "#3B82F6" },
      { name: "Residual", value: 20, color: "#F59E0B" },
      { name: "Special/Hazardous", value: 5, color: "#EF4444" },
    ],
    [],
  );

  const truckEfficiency = useMemo(
    () => [
      { name: "GT-101", efficiency: 95, collected: 4.2 },
      { name: "GT-102", efficiency: 88, collected: 3.8 },
      { name: "GT-103", efficiency: 92, collected: 4.5 },
      { name: "GT-104", efficiency: 85, collected: 3.5 },
      { name: "GT-105", efficiency: 90, collected: 4.0 },
    ],
    [],
  );

  const stats = {
    totalCollected: "80.1 tons",
    weeklyAverage: "11.4 tons",
    totalTrucks: 12,
    efficiency: 92,
    monthlyGrowth: "+8.5%",
    topBarangay: "Kasambagan",
    topBarangayValue: "3,120 kg",
    completionRate: "94%",
  };

  const getPercentageColor = (percentage) => {
    if (percentage >= 100) return "text-green-600";
    if (percentage >= 80) return "text-amber-600";
    return "text-red-600";
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 100) return "bg-green-500";
    if (percentage >= 80) return "bg-amber-500";
    return "bg-red-500";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-neutral-900">
              Trash Collection
            </h1>
            <p className="text-neutral-600 mt-1 text-sm">
              Monitor total trash collected across barangays
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={filterBarangay}
              onChange={(e) => setFilterBarangay(e.target.value)}
              className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm"
            >
              <option value="all">All Barangays</option>
              {barangays.map((b) => (
                <option key={b.name} value={b.name}>
                  {b.name}
                </option>
              ))}
            </select>
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
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-primary-muted to-primary-muted/50 rounded-xl p-5 shadow-sm border border-primary-light">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
              <Trash2 className="h-5 w-5 text-primary" />
            </div>
            <div className="flex items-center gap-1 text-sm font-medium text-green-600">
              <TrendingUp className="h-4 w-4" />
              +12.3%
            </div>
          </div>
          <h3 className="text-2xl font-bold text-neutral-900">
            {stats.totalCollected}
          </h3>
          <p className="text-sm text-neutral-600 mt-1">Total Collected</p>
          <p className="text-xs text-neutral-500 mt-2">
            {stats.monthlyGrowth} vs last month
          </p>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-neutral-200">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
              <Target className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex items-center gap-1 text-sm font-medium text-green-600">
              <TrendingUp className="h-4 w-4" />
              +5.2%
            </div>
          </div>
          <h3 className="text-2xl font-bold text-neutral-900">
            {stats.weeklyAverage}
          </h3>
          <p className="text-sm text-neutral-600 mt-1">Weekly Average</p>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-neutral-200">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
              <Truck className="h-5 w-5 text-amber-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-neutral-900">
            {stats.totalTrucks}
          </h3>
          <p className="text-sm text-neutral-600 mt-1">Active Trucks</p>
          <p className="text-xs text-neutral-500 mt-2">
            {stats.completionRate} route completion
          </p>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-neutral-200">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
              <Award className="h-5 w-5 text-green-600" />
            </div>
            <div className="flex items-center gap-1 text-sm font-medium text-green-600">
              <TrendingUp className="h-4 w-4" />
              +3.1%
            </div>
          </div>
          <h3 className="text-2xl font-bold text-neutral-900">
            {stats.efficiency}%
          </h3>
          <p className="text-sm text-neutral-600 mt-1">Efficiency Rate</p>
        </div>
      </div>

      {/* Top Performer Banner */}
      <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl p-4 border border-amber-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
            <Trophy className="h-5 w-5 text-yellow-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-amber-800">
              Top Performing Barangay
            </p>
            <p className="text-lg font-bold text-neutral-900">
              {stats.topBarangay}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-green-600">
              {stats.topBarangayValue}
            </p>
            <p className="text-xs text-neutral-600">collected this week</p>
          </div>
        </div>
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
                <button
                  onClick={() => setChartView("trend")}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    chartView === "trend"
                      ? "bg-primary text-white"
                      : "bg-neutral-100 text-neutral-600"
                  }`}
                >
                  Daily
                </button>
                <button
                  onClick={() => setChartView("monthly")}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    chartView === "monthly"
                      ? "bg-primary text-white"
                      : "bg-neutral-100 text-neutral-600"
                  }`}
                >
                  Weekly
                </button>
              </div>
            </div>
          </div>
          <div className="p-5">
            <ResponsiveContainer width="100%" height={280}>
              {chartView === "trend" ? (
                <ComposedChart
                  data={weeklyTrend}
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
                </ComposedChart>
              ) : (
                <BarChart
                  data={monthlyTrend}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
                  <XAxis
                    dataKey="week"
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
                  <Bar
                    dataKey="collected"
                    fill="#22C55E"
                    radius={[6, 6, 0, 0]}
                    name="Collected"
                    unit=" tons"
                    maxBarSize={50}
                  />
                  <Bar
                    dataKey="target"
                    fill="#94A3B8"
                    radius={[6, 6, 0, 0]}
                    name="Target"
                    unit=" tons"
                    maxBarSize={50}
                  />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Waste Type Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200">
          <div className="p-5 border-b border-neutral-200">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-neutral-900">
                Waste Type Distribution
              </h2>
              <BarChart3 className="h-4 w-4 text-neutral-500" />
            </div>
          </div>
          <div className="p-5">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={wasteTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {wasteTypeData.map((entry, index) => (
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

      {/* Barangay Performance & Truck Efficiency */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Barangay Performance */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200">
          <div className="p-5 border-b border-neutral-200">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-neutral-900">
                Barangay Performance
              </h2>
              <button className="text-sm text-primary hover:text-primary-dark font-medium flex items-center gap-1">
                View All <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="p-5">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart
                data={barangays}
                layout="vertical"
                margin={{ top: 5, right: 5, left: 60, bottom: 5 }}
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
                  unit="kg"
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fontSize: 12, fill: "#737373" }}
                  axisLine={{ stroke: "#E5E5E5" }}
                  tickLine={false}
                  width={80}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="collected"
                  radius={[0, 4, 4, 0]}
                  maxBarSize={30}
                  name="Collected"
                  unit=" kg"
                >
                  {barangays.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Truck Efficiency */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200">
          <div className="p-5 border-b border-neutral-200">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-neutral-900">
                Truck Efficiency
              </h2>
              <Truck className="h-4 w-4 text-neutral-500" />
            </div>
          </div>
          <div className="p-5">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart
                data={truckEfficiency}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
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
                  domain={[0, 100]}
                  unit="%"
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="efficiency"
                  fill="#3B82F6"
                  radius={[4, 4, 0, 0]}
                  name="Efficiency"
                  unit="%"
                  maxBarSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Collection History Table */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
        <div className="p-5 border-b border-neutral-200">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-neutral-900">
              Recent Collection History
            </h2>
            <button className="text-sm text-primary hover:text-primary-dark font-medium">
              View Full History
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Day
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Total Collected
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Trucks
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  vs Target
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {collectionHistory.slice(0, 5).map((record, index) => {
                const target = 11.0;
                const vsTarget = (
                  ((record.total - target) / target) *
                  100
                ).toFixed(1);
                const isAboveTarget = record.total >= target;

                return (
                  <tr
                    key={index}
                    className="hover:bg-neutral-50 transition-colors"
                  >
                    <td className="px-5 py-4 text-sm text-neutral-900 font-medium">
                      {record.date}
                    </td>
                    <td className="px-5 py-4 text-sm text-neutral-600">
                      {record.day}
                    </td>
                    <td className="px-5 py-4 text-sm font-semibold text-neutral-900">
                      {record.total} tons
                    </td>
                    <td className="px-5 py-4 text-sm text-neutral-600">
                      {record.trucks} trucks
                    </td>
                    <td className="px-5 py-4 text-sm">
                      <span
                        className={`flex items-center gap-1 ${isAboveTarget ? "text-green-600" : "text-red-600"}`}
                      >
                        {isAboveTarget ? (
                          <TrendingUp className="h-3 w-3" />
                        ) : (
                          <TrendingDown className="h-3 w-3" />
                        )}
                        {vsTarget}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Trophy icon component
const Trophy = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16" />
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
  </svg>
);

export default TrashCollectionPage;
