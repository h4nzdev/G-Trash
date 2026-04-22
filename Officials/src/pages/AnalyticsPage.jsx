import React from "react";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Calendar,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";

const AnalyticsPage = () => {
  const pollutionTrend = [
    { month: "Jan", value: 45 },
    { month: "Feb", value: 52 },
    { month: "Mar", value: 48 },
    { month: "Apr", value: 61 },
    { month: "May", value: 55 },
    { month: "Jun", value: 67 },
  ];

  const collectionStats = [
    {
      barangay: "Lahug",
      collected: 2450,
      target: 3000,
      percentage: 82,
      remaining: 550,
    },
    {
      barangay: "Apas",
      collected: 1890,
      target: 2500,
      percentage: 76,
      remaining: 610,
    },
    {
      barangay: "Kasambagan",
      collected: 3120,
      target: 3000,
      percentage: 104,
      remaining: -120,
    },
    {
      barangay: "Budlaan",
      collected: 2780,
      target: 2800,
      percentage: 99,
      remaining: 20,
    },
    {
      barangay: "Capitol",
      collected: 2100,
      target: 2500,
      percentage: 84,
      remaining: 400,
    },
  ];

  const urgencyLevels = [
    { level: "Critical", count: 3, color: "#EF4444" },
    { level: "High", count: 8, color: "#F97316" },
    { level: "Medium", count: 15, color: "#F59E0B" },
    { level: "Low", count: 42, color: "#22C55E" },
  ];

  const weeklyCollectionData = [
    { day: "Mon", actual: 1250, target: 1300 },
    { day: "Tue", actual: 1380, target: 1300 },
    { day: "Wed", actual: 1420, target: 1300 },
    { day: "Thu", actual: 1150, target: 1300 },
    { day: "Fri", actual: 1480, target: 1300 },
    { day: "Sat", actual: 1320, target: 1300 },
    { day: "Sun", actual: 980, target: 1300 },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-neutral-200">
          <p className="font-medium text-neutral-900 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {entry.value.toLocaleString()}
              {entry.unit || ""}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
        <h1 className="text-3xl font-bold text-neutral-900">
          Analytics Dashboard
        </h1>
        <p className="text-neutral-600 mt-1">
          Data-driven insights for waste management
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div className="flex items-center gap-1 text-red-600">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm font-medium">+12%</span>
            </div>
          </div>
          <h3 className="text-3xl font-bold text-neutral-900">68</h3>
          <p className="text-sm text-neutral-600 mt-1">High Priority Alerts</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="flex items-center gap-1 text-green-600">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm font-medium">+18%</span>
            </div>
          </div>
          <h3 className="text-3xl font-bold text-neutral-900">89%</h3>
          <p className="text-sm text-neutral-600 mt-1">Collection Efficiency</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
              <Activity className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex items-center gap-1 text-blue-600">
              <TrendingDown className="h-4 w-4" />
              <span className="text-sm font-medium">-5%</span>
            </div>
          </div>
          <h3 className="text-3xl font-bold text-neutral-900">2.3 days</h3>
          <p className="text-sm text-neutral-600 mt-1">Avg Response Time</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pollution Trend Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-neutral-900">
              Pollution Trend
            </h2>
            <Calendar className="h-5 w-5 text-neutral-500" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={pollutionTrend}>
              <defs>
                <linearGradient
                  id="pollutionGradient"
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
                dataKey="month"
                tick={{ fill: "#737373", fontSize: 12 }}
                axisLine={{ stroke: "#E5E5E5" }}
              />
              <YAxis
                tick={{ fill: "#737373", fontSize: 12 }}
                axisLine={{ stroke: "#E5E5E5" }}
                unit="%"
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#22C55E"
                strokeWidth={2}
                fill="url(#pollutionGradient)"
                name="Pollution Level"
                unit="%"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Weekly Collection Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-neutral-900">
              Weekly Collection
            </h2>
            <Calendar className="h-5 w-5 text-neutral-500" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyCollectionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
              <XAxis
                dataKey="day"
                tick={{ fill: "#737373", fontSize: 12 }}
                axisLine={{ stroke: "#E5E5E5" }}
              />
              <YAxis
                tick={{ fill: "#737373", fontSize: 12 }}
                axisLine={{ stroke: "#E5E5E5" }}
                unit="kg"
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar
                dataKey="actual"
                fill="#22C55E"
                name="Actual Collection"
                radius={[4, 4, 0, 0]}
                unit="kg"
              />
              <Bar
                dataKey="target"
                fill="#94A3B8"
                name="Target"
                radius={[4, 4, 0, 0]}
                unit="kg"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Collection Performance and Urgency Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Collection Performance */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
          <h2 className="text-xl font-bold text-neutral-900 mb-6">
            Collection Performance by Barangay
          </h2>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart
              data={collectionStats}
              layout="vertical"
              margin={{ left: 20 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#E5E5E5"
                horizontal={false}
              />
              <XAxis
                type="number"
                tick={{ fill: "#737373", fontSize: 12 }}
                axisLine={{ stroke: "#E5E5E5" }}
                unit="kg"
              />
              <YAxis
                type="category"
                dataKey="barangay"
                tick={{ fill: "#737373", fontSize: 12 }}
                axisLine={{ stroke: "#E5E5E5" }}
                width={80}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar
                dataKey="collected"
                fill="#22C55E"
                name="Collected"
                radius={[0, 4, 4, 0]}
                unit="kg"
              />
              <Bar
                dataKey="remaining"
                fill="#F59E0B"
                name="Remaining"
                radius={[0, 4, 4, 0]}
                unit="kg"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Urgency Levels Distribution */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
          <h2 className="text-xl font-bold text-neutral-900 mb-6">
            Urgency Level Distribution
          </h2>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={urgencyLevels}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={({ level, count, percent }) =>
                  `${level}: ${count} (${(percent * 100).toFixed(0)}%)`
                }
                outerRadius={120}
                fill="#8884d8"
                dataKey="count"
                nameKey="level"
              >
                {urgencyLevels.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>

          {/* Legend */}
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {urgencyLevels.map((level, index) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: level.color }}
                />
                <span className="text-sm text-neutral-700">
                  {level.level}: {level.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {collectionStats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl p-4 shadow-sm border border-neutral-200"
          >
            <p className="text-sm font-medium text-neutral-900 mb-2">
              {stat.barangay}
            </p>
            <div className="flex items-end justify-between">
              <p className="text-2xl font-bold text-neutral-900">
                {stat.percentage}%
              </p>
              <p className="text-xs text-neutral-500">
                {stat.collected.toLocaleString()} /{" "}
                {stat.target.toLocaleString()} kg
              </p>
            </div>
            <div className="w-full bg-neutral-200 rounded-full h-2 mt-3">
              <div
                className={`h-2 rounded-full transition-all ${
                  stat.percentage >= 100 ? "bg-green-500" : "bg-amber-500"
                }`}
                style={{ width: `${Math.min(stat.percentage, 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnalyticsPage;
