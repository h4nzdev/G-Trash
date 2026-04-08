import React, { useState } from 'react';
import { BarChart3, TrendingUp, TrendingDown, AlertTriangle, Filter } from 'lucide-react';

const AnalyticsPage = () => {
  const [filterPeriod, setFilterPeriod] = useState('month');

  const problemScaling = [
    { urgency: 'Critical', current: 2, previous: 1, change: '+100%', trend: 'up' },
    { urgency: 'High', current: 5, previous: 7, change: '-29%', trend: 'down' },
    { urgency: 'Medium', current: 12, previous: 10, change: '+20%', trend: 'up' },
    { urgency: 'Low', current: 25, previous: 28, change: '-11%', trend: 'down' },
  ];

  const monthlyData = [
    { month: 'Jan', reports: 45, resolved: 38 },
    { month: 'Feb', reports: 52, resolved: 45 },
    { month: 'Mar', reports: 48, resolved: 42 },
    { month: 'Apr', reports: 61, resolved: 50 },
    { month: 'May', reports: 55, resolved: 48 },
    { month: 'Jun', reports: 67, resolved: 58 },
  ];

  const topIssues = [
    { issue: 'Overflowing Trash', count: 156, percentage: 35 },
    { issue: 'Bad Smell', count: 98, percentage: 22 },
    { issue: 'Missed Collection', count: 87, percentage: 20 },
    { issue: 'Illegal Dumping', count: 65, percentage: 15 },
    { issue: 'Other', count: 35, percentage: 8 },
  ];

  const stats = {
    totalReports: 441,
    resolvedReports: 323,
    resolutionRate: 73,
    avgResponseTime: '2.5 days',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-neutral-900">Analytics</h1>
            <p className="text-neutral-600 mt-1 text-sm">Analyze problem scaling based on urgency and trends</p>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={filterPeriod}
              onChange={(e) => setFilterPeriod(e.target.value)}
              className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <div className="bg-white rounded-xl p-5 lg:p-6 shadow-sm border border-neutral-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-primary-muted rounded-xl flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
            <div className="flex items-center gap-1 text-sm font-medium text-green-600">
              <TrendingUp className="h-4 w-4" />
              +12.3%
            </div>
          </div>
          <h3 className="text-2xl font-bold text-neutral-900">{stats.totalReports}</h3>
          <p className="text-sm text-neutral-600 mt-1">Total Reports</p>
        </div>

        <div className="bg-white rounded-xl p-5 lg:p-6 shadow-sm border border-neutral-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div className="flex items-center gap-1 text-sm font-medium text-green-600">
              <TrendingUp className="h-4 w-4" />
              +8.5%
            </div>
          </div>
          <h3 className="text-2xl font-bold text-neutral-900">{stats.resolvedReports}</h3>
          <p className="text-sm text-neutral-600 mt-1">Resolved Reports</p>
        </div>

        <div className="bg-white rounded-xl p-5 lg:p-6 shadow-sm border border-neutral-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-neutral-900">{stats.resolutionRate}%</h3>
          <p className="text-sm text-neutral-600 mt-1">Resolution Rate</p>
        </div>

        <div className="bg-white rounded-xl p-5 lg:p-6 shadow-sm border border-neutral-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center">
              <Filter className="h-6 w-6 text-amber-600" />
            </div>
            <div className="flex items-center gap-1 text-sm font-medium text-green-600">
              <TrendingDown className="h-4 w-4" />
              -0.5 days
            </div>
          </div>
          <h3 className="text-2xl font-bold text-neutral-900">{stats.avgResponseTime}</h3>
          <p className="text-sm text-neutral-600 mt-1">Avg Response Time</p>
        </div>
      </div>

      {/* Problem Scaling */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200">
        <div className="p-6 border-b border-neutral-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-neutral-900">Problem Scaling by Urgency</h2>
            <AlertTriangle className="h-5 w-5 text-neutral-500" />
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {problemScaling.map((item, index) => (
              <div key={index} className="bg-neutral-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-neutral-900">{item.urgency}</span>
                  <div className={`flex items-center gap-1 text-sm font-medium ${
                    item.trend === 'up' ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {item.trend === 'up' ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : (
                      <TrendingDown className="h-4 w-4" />
                    )}
                    {item.change}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-xs text-neutral-500">Current</p>
                    <p className="text-xl font-bold text-neutral-900">{item.current}</p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500">Previous</p>
                    <p className="text-xl font-bold text-neutral-600">{item.previous}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly Trends */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200">
        <div className="p-6 border-b border-neutral-200">
          <h2 className="text-lg font-bold text-neutral-900">Monthly Report Trends</h2>
        </div>
        <div className="p-6">
          <div className="flex items-end justify-between h-64 gap-2">
            {monthlyData.map((item, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex gap-1 items-end h-48">
                  <div
                    className="flex-1 bg-primary rounded-t transition-all hover:opacity-80"
                    style={{ height: `${(item.reports / 70) * 100}%` }}
                    title={`Reports: ${item.reports}`}
                  />
                  <div
                    className="flex-1 bg-green-500 rounded-t transition-all hover:opacity-80"
                    style={{ height: `${(item.resolved / 70) * 100}%` }}
                    title={`Resolved: ${item.resolved}`}
                  />
                </div>
                <span className="text-sm font-medium text-neutral-700">{item.month}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-primary rounded"></div>
              <span className="text-sm text-neutral-600">Total Reports</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span className="text-sm text-neutral-600">Resolved</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Issues */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200">
        <div className="p-6 border-b border-neutral-200">
          <h2 className="text-lg font-bold text-neutral-900">Top Reported Issues</h2>
        </div>
        <div className="p-6 space-y-4">
          {topIssues.map((issue, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-neutral-900">{issue.issue}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-neutral-600">{issue.count} reports</span>
                  <span className="text-sm font-bold text-primary">{issue.percentage}%</span>
                </div>
              </div>
              <div className="w-full bg-neutral-200 rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${issue.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
