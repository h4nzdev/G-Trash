import React, { useState } from "react";
import {
  Trophy,
  Award,
  Star,
  TrendingUp,
  Medal,
  Trash2,
  Crown,
  Flame,
  Target,
  Recycle,
  ChevronUp,
  ChevronDown,
  Minus,
  Users,
  Calendar,
  Gift,
  Sparkles,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
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

const LeaderboardPage = () => {
  const [selectedBarangay, setSelectedBarangay] = useState(null);
  const [timeFilter, setTimeFilter] = useState("week");

  const barangayLeaderboard = [
    {
      rank: 1,
      name: "Brgy. Kasambagan",
      score: 95,
      trashCollected: 3120,
      segregation: 92,
      reports: 12,
      trend: "up",
      streak: 15,
      level: 8,
      achievements: 5,
      color: "#FFD700",
    },
    {
      rank: 2,
      name: "Brgy. Budlaan",
      score: 89,
      trashCollected: 2780,
      segregation: 88,
      reports: 8,
      trend: "up",
      streak: 8,
      level: 7,
      achievements: 3,
      color: "#C0C0C0",
    },
    {
      rank: 3,
      name: "Brgy. Capitol",
      score: 84,
      trashCollected: 2100,
      segregation: 85,
      reports: 6,
      trend: "stable",
      streak: 5,
      level: 6,
      achievements: 3,
      color: "#CD7F32",
    },
    {
      rank: 4,
      name: "Brgy. Lahug",
      score: 82,
      trashCollected: 2450,
      segregation: 78,
      reports: 15,
      trend: "down",
      streak: 0,
      level: 6,
      achievements: 2,
      color: "#22C55E",
    },
    {
      rank: 5,
      name: "Brgy. Apas",
      score: 76,
      trashCollected: 1890,
      segregation: 72,
      reports: 18,
      trend: "up",
      streak: 3,
      level: 5,
      achievements: 1,
      color: "#3B82F6",
    },
    {
      rank: 6,
      name: "Brgy. Guadalupe",
      score: 71,
      trashCollected: 1950,
      segregation: 68,
      reports: 10,
      trend: "stable",
      streak: 2,
      level: 5,
      achievements: 1,
      color: "#8B5CF6",
    },
  ];

  const weeklyData = [
    { day: "Mon", Kasambagan: 88, Budlaan: 82, Capitol: 80 },
    { day: "Tue", Kasambagan: 90, Budlaan: 84, Capitol: 81 },
    { day: "Wed", Kasambagan: 92, Budlaan: 86, Capitol: 82 },
    { day: "Thu", Kasambagan: 93, Budlaan: 87, Capitol: 83 },
    { day: "Fri", Kasambagan: 94, Budlaan: 88, Capitol: 84 },
    { day: "Sat", Kasambagan: 95, Budlaan: 89, Capitol: 84 },
    { day: "Sun", Kasambagan: 95, Budlaan: 89, Capitol: 84 },
  ];

  const getRankBadge = (rank) => {
    switch (rank) {
      case 1:
        return (
          <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
            <Crown className="h-5 w-5 text-yellow-600" />
          </div>
        );
      case 2:
        return (
          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
            <Award className="h-5 w-5 text-gray-600" />
          </div>
        );
      case 3:
        return (
          <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
            <Medal className="h-5 w-5 text-amber-600" />
          </div>
        );
      default:
        return (
          <div className="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center">
            <span className="text-sm font-bold text-neutral-600">{rank}</span>
          </div>
        );
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case "up":
        return <ChevronUp className="h-4 w-4 text-green-600" />;
      case "down":
        return <ChevronDown className="h-4 w-4 text-red-600" />;
      default:
        return <Minus className="h-4 w-4 text-neutral-500" />;
    }
  };

  const stats = {
    totalPlayers: barangayLeaderboard.length,
    totalCollected: barangayLeaderboard.reduce(
      (sum, b) => sum + b.trashCollected,
      0,
    ),
    avgScore: Math.round(
      barangayLeaderboard.reduce((sum, b) => sum + b.score, 0) /
        barangayLeaderboard.length,
    ),
    topStreak: Math.max(...barangayLeaderboard.map((b) => b.streak)),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">
              Barangay Leaderboard
            </h1>
            <p className="text-neutral-600 mt-1">
              Rankings based on waste management performance
            </p>
          </div>
          <div className="flex gap-2">
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="season">This Season</option>
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-neutral-50 rounded-lg p-4">
            <p className="text-sm text-neutral-600">Active Players</p>
            <p className="text-2xl font-bold text-neutral-900">
              {stats.totalPlayers}
            </p>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <p className="text-sm text-green-700">Total Collected</p>
            <p className="text-2xl font-bold text-green-900">
              {stats.totalCollected.toLocaleString()} kg
            </p>
          </div>
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-blue-700">Average Score</p>
            <p className="text-2xl font-bold text-blue-900">{stats.avgScore}</p>
          </div>
          <div className="bg-orange-50 rounded-lg p-4">
            <p className="text-sm text-orange-700">Longest Streak</p>
            <p className="text-2xl font-bold text-orange-900">
              {stats.topStreak} 🔥
            </p>
          </div>
        </div>
      </div>

      {/* Top 3 Podium */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
        <h2 className="text-lg font-bold text-neutral-900 mb-4">
          Top Performers
        </h2>
        <div className="grid grid-cols-3 gap-4">
          {barangayLeaderboard.slice(0, 3).map((barangay, index) => (
            <div key={barangay.rank} className="text-center">
              <div className="flex justify-center mb-3">
                {getRankBadge(barangay.rank)}
              </div>
              <h3 className="font-bold text-neutral-900">{barangay.name}</h3>
              <div className="flex items-center justify-center gap-1 mt-1">
                <span
                  className="text-2xl font-bold"
                  style={{ color: barangay.color }}
                >
                  {barangay.score}
                </span>
                {getTrendIcon(barangay.trend)}
              </div>
              <p className="text-xs text-neutral-500 mt-1">
                Level {barangay.level}
              </p>
              {barangay.streak >= 7 && (
                <div className="flex items-center justify-center gap-1 mt-1 text-orange-600">
                  <Flame className="h-3 w-3" />
                  <span className="text-xs">{barangay.streak} day streak</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Performance Trend */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
        <h2 className="text-lg font-bold text-neutral-900 mb-4">
          Performance Trend
        </h2>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
            <XAxis dataKey="day" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} domain={[70, 100]} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="Kasambagan"
              stroke="#FFD700"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="Budlaan"
              stroke="#C0C0C0"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="Capitol"
              stroke="#CD7F32"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Full Leaderboard */}
      <div className="bg-white rounded-2xl shadow-sm border border-neutral-200">
        <div className="p-6 border-b border-neutral-200">
          <h2 className="text-xl font-bold text-neutral-900">
            Complete Rankings
          </h2>
        </div>
        <div className="divide-y divide-neutral-200">
          {barangayLeaderboard.map((barangay) => (
            <div
              key={barangay.rank}
              className="p-6 hover:bg-neutral-50 transition-colors cursor-pointer"
              onClick={() =>
                setSelectedBarangay(
                  selectedBarangay === barangay.name ? null : barangay.name,
                )
              }
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {getRankBadge(barangay.rank)}
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-neutral-900">
                        {barangay.name}
                      </h3>
                      <span className="text-xs px-2 py-0.5 bg-primary-muted text-primary rounded-full">
                        Lvl {barangay.level}
                      </span>
                      {barangay.streak >= 7 && (
                        <span className="flex items-center gap-1 text-xs text-orange-600">
                          <Flame className="h-3 w-3" />
                          {barangay.streak}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-sm text-neutral-600">
                      <span className="flex items-center gap-1">
                        <Trash2 className="h-3 w-3" />
                        {barangay.trashCollected} kg
                      </span>
                      <span className="flex items-center gap-1">
                        <Recycle className="h-3 w-3" />
                        {barangay.segregation}%
                      </span>
                      <span className="flex items-center gap-1">
                        <Target className="h-3 w-3" />
                        {barangay.reports} reports
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2">
                    <p className="text-2xl font-bold text-primary">
                      {barangay.score}
                    </p>
                    {getTrendIcon(barangay.trend)}
                  </div>
                  <p className="text-xs text-neutral-500">
                    {barangay.achievements} achievements
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
          <div className="flex items-center gap-2 mb-4">
            <Trash2 className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-bold text-neutral-900">
              Most Trash Collected
            </h2>
          </div>
          <div className="space-y-3">
            {[...barangayLeaderboard]
              .sort((a, b) => b.trashCollected - a.trashCollected)
              .slice(0, 3)
              .map((barangay, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-neutral-600">
                      #{index + 1}
                    </span>
                    <span className="text-sm font-medium text-neutral-900">
                      {barangay.name}
                    </span>
                  </div>
                  <span className="text-sm font-bold text-primary">
                    {barangay.trashCollected} kg
                  </span>
                </div>
              ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
          <div className="flex items-center gap-2 mb-4">
            <Recycle className="h-5 w-5 text-green-600" />
            <h2 className="text-lg font-bold text-neutral-900">
              Best in Segregation
            </h2>
          </div>
          <div className="space-y-3">
            {[...barangayLeaderboard]
              .sort((a, b) => b.segregation - a.segregation)
              .slice(0, 3)
              .map((barangay, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-neutral-600">
                      #{index + 1}
                    </span>
                    <span className="text-sm font-medium text-neutral-900">
                      {barangay.name}
                    </span>
                  </div>
                  <span className="text-sm font-bold text-green-600">
                    {barangay.segregation}%
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;
