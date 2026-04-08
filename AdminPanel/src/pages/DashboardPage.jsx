import React from 'react';
import { useAuth } from '../contexts/AuthContext';
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
} from 'lucide-react';

const DashboardPage = () => {
  const { user } = useAuth();

  // Mock data
  const stats = [
    {
      label: 'Total Trash Collected',
      value: '24.5 tons',
      change: '+12.3%',
      trend: 'up',
      icon: Trash2,
      color: 'bg-primary',
      bgColor: 'bg-primary-muted',
    },
    {
      label: 'Active Trucks',
      value: '12',
      change: '+3',
      trend: 'up',
      icon: Truck,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'High Urgency Areas',
      value: '5',
      change: '-2',
      trend: 'down',
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      label: 'Bug Reports',
      value: '8',
      change: '+2',
      trend: 'up',
      icon: Bug,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
    },
  ];

  const urgencyLevels = [
    { level: 'Critical', count: 2, color: 'bg-red-500', percentage: '15%' },
    { level: 'High', count: 5, color: 'bg-orange-500', percentage: '35%' },
    { level: 'Medium', count: 12, color: 'bg-yellow-500', percentage: '50%' },
    { level: 'Low', count: 25, color: 'bg-green-500', percentage: '85%' },
  ];

  const recentReports = [
    { id: 1, type: 'Overflowing Trash', location: 'Brgy. Lahug', status: 'Pending', priority: 'High', time: '2h ago' },
    { id: 2, type: 'Bad Smell', location: 'Brgy. Apas', status: 'Resolved', priority: 'Medium', time: '4h ago' },
    { id: 3, type: 'Missed Collection', location: 'Brgy. Kasambagan', status: 'In Progress', priority: 'High', time: '5h ago' },
    { id: 4, type: 'Illegal Dumping', location: 'Brgy. Budlaan', status: 'Pending', priority: 'Critical', time: '6h ago' },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-amber-100 text-amber-800';
      case 'Resolved': return 'bg-green-100 text-green-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'High': return 'bg-red-100 text-red-800';
      case 'Critical': return 'bg-red-200 text-red-900';
      case 'Medium': return 'bg-amber-100 text-amber-800';
      default: return 'bg-neutral-100 text-neutral-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-neutral-900">
              Welcome back, {user?.fullName?.split(' ')[0]}! 👋
            </h1>
            <p className="text-neutral-600 mt-1 text-sm">
              Here's an overview of the waste monitoring system.
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-primary-muted rounded-lg">
            <Bell className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-primary">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </span>
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
                <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className={`flex items-center gap-1 text-sm font-medium ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.trend === 'up' ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  {stat.change}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-neutral-900">{stat.value}</h3>
              <p className="text-sm text-neutral-600 mt-1">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Charts and Reports Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Urgency Levels */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200">
          <div className="p-6 border-b border-neutral-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-neutral-900">Urgency Level Distribution</h2>
              <AlertTriangle className="h-5 w-5 text-neutral-500" />
            </div>
          </div>
          <div className="p-6 space-y-4">
            {urgencyLevels.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-neutral-900">{item.level}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-neutral-900">{item.count} areas</span>
                    <span className={`w-3 h-3 rounded-full ${item.color}`}></span>
                  </div>
                </div>
                <div className="w-full bg-neutral-200 rounded-full h-2">
                  <div
                    className={`${item.color} h-2 rounded-full transition-all`}
                    style={{ width: item.percentage }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Reports */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200">
          <div className="p-6 border-b border-neutral-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-neutral-900">Recent Reports</h2>
              <button className="text-sm text-primary hover:text-primary-dark font-medium">
                View All
              </button>
            </div>
          </div>
          <div className="divide-y divide-neutral-200">
            {recentReports.map((report) => (
              <div key={report.id} className="p-4 hover:bg-neutral-50 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="font-semibold text-neutral-900">{report.type}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Map className="h-3 w-3 text-neutral-500" />
                      <span className="text-sm text-neutral-600">{report.location}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(report.status)}`}>
                      {report.status}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(report.priority)}`}>
                      {report.priority}
                    </span>
                    <span className="text-xs text-neutral-500">{report.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
        <h2 className="text-lg font-bold text-neutral-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          <button className="p-4 bg-primary-muted rounded-xl hover:bg-primary hover:text-white transition-colors text-primary">
            <Map className="h-6 w-6 mx-auto mb-2" />
            <span className="text-sm font-medium">View Heatmap</span>
          </button>
          <button className="p-4 bg-blue-50 rounded-xl hover:bg-blue-600 hover:text-white transition-colors text-blue-600">
            <Truck className="h-6 w-6 mx-auto mb-2" />
            <span className="text-sm font-medium">Track Trucks</span>
          </button>
          <button className="p-4 bg-red-50 rounded-xl hover:bg-red-600 hover:text-white transition-colors text-red-600">
            <AlertTriangle className="h-6 w-6 mx-auto mb-2" />
            <span className="text-sm font-medium">View Alerts</span>
          </button>
          <button className="p-4 bg-green-50 rounded-xl hover:bg-green-600 hover:text-white transition-colors text-green-600">
            <BarChart3 className="h-6 w-6 mx-auto mb-2" />
            <span className="text-sm font-medium">Analytics</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
