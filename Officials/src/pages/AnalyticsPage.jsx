import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Calendar,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';

const AnalyticsPage = () => {
  const pollutionTrend = [
    { month: 'Jan', value: 45 },
    { month: 'Feb', value: 52 },
    { month: 'Mar', value: 48 },
    { month: 'Apr', value: 61 },
    { month: 'May', value: 55 },
    { month: 'Jun', value: 67 },
  ];

  const collectionStats = [
    { barangay: 'Brgy. Lahug', collected: 2450, target: 3000, percentage: 82 },
    { barangay: 'Brgy. Apas', collected: 1890, target: 2500, percentage: 76 },
    { barangay: 'Brgy. Kasambagan', collected: 3120, target: 3000, percentage: 104 },
    { barangay: 'Brgy. Budlaan', collected: 2780, target: 2800, percentage: 99 },
    { barangay: 'Brgy. Capitol', collected: 2100, target: 2500, percentage: 84 },
  ];

  const urgencyLevels = [
    { level: 'Critical', count: 3, color: 'bg-red-500', bgColor: 'bg-red-50' },
    { level: 'High', count: 8, color: 'bg-orange-500', bgColor: 'bg-orange-50' },
    { level: 'Medium', count: 15, color: 'bg-amber-500', bgColor: 'bg-amber-50' },
    { level: 'Low', count: 42, color: 'bg-green-500', bgColor: 'bg-green-50' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
        <h1 className="text-3xl font-bold text-neutral-900">Analytics Dashboard</h1>
        <p className="text-neutral-600 mt-1">Data-driven insights for waste management</p>
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

      {/* Pollution Trend Chart */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-neutral-900">Pollution Trend (Last 6 Months)</h2>
          <Calendar className="h-5 w-5 text-neutral-500" />
        </div>
        <div className="flex items-end justify-between h-64 gap-2">
          {pollutionTrend.map((item, index) => (
            <div key={index} className="flex-1 flex flex-col items-center gap-2">
              <div
                className="w-full bg-gradient-to-t from-primary to-primary-light rounded-t-lg transition-all hover:opacity-80"
                style={{ height: `${(item.value / 70) * 100}%` }}
              />
              <span className="text-sm font-medium text-neutral-700">{item.month}</span>
              <span className="text-xs text-neutral-500">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Collection Performance */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
        <h2 className="text-xl font-bold text-neutral-900 mb-6">Collection Performance by Barangay</h2>
        <div className="space-y-4">
          {collectionStats.map((stat, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-neutral-900">{stat.barangay}</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-neutral-600">
                    {stat.collected.toLocaleString()} / {stat.target.toLocaleString()} kg
                  </span>
                  <span className={`text-sm font-bold ${
                    stat.percentage >= 100 ? 'text-green-600' : 'text-amber-600'
                  }`}>
                    {stat.percentage}%
                  </span>
                </div>
              </div>
              <div className="w-full bg-neutral-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all ${
                    stat.percentage >= 100 ? 'bg-green-500' : 'bg-amber-500'
                  }`}
                  style={{ width: `${Math.min(stat.percentage, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Urgency Levels */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
        <h2 className="text-xl font-bold text-neutral-900 mb-6">Urgency Level Distribution</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {urgencyLevels.map((level, index) => (
            <div key={index} className={`${level.bgColor} rounded-xl p-6 text-center`}>
              <div className={`w-16 h-16 ${level.color} rounded-full mx-auto mb-3 flex items-center justify-center`}>
                <span className="text-white text-2xl font-bold">{level.count}</span>
              </div>
              <p className="text-sm font-semibold text-neutral-900">{level.level}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
