import React, { useState } from 'react';
import {
  Trash2,
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  Filter,
} from 'lucide-react';

const TrashCollectionPage = () => {
  const [filterBarangay, setFilterBarangay] = useState('all');
  const [filterPeriod, setFilterPeriod] = useState('week');

  const barangays = [
    { name: 'Brgy. Lahug', collected: 2450, target: 3000, percentage: 82 },
    { name: 'Brgy. Apas', collected: 1890, target: 2500, percentage: 76 },
    { name: 'Brgy. Kasambagan', collected: 3120, target: 3000, percentage: 104 },
    { name: 'Brgy. Budlaan', collected: 2780, target: 2800, percentage: 99 },
    { name: 'Brgy. Capitol', collected: 2100, target: 2500, percentage: 84 },
    { name: 'Brgy. Banilad', collected: 1950, target: 2200, percentage: 89 },
  ];

  const collectionHistory = [
    { date: '2026-04-06', day: 'Monday', total: '12.5 tons', trucks: 8 },
    { date: '2026-04-05', day: 'Sunday', total: '8.2 tons', trucks: 5 },
    { date: '2026-04-04', day: 'Saturday', total: '14.1 tons', trucks: 10 },
    { date: '2026-04-03', day: 'Friday', total: '11.8 tons', trucks: 9 },
    { date: '2026-04-02', day: 'Thursday', total: '10.5 tons', trucks: 7 },
  ];

  const stats = {
    totalCollected: '24.5 tons',
    weeklyAverage: '11.4 tons',
    totalTrucks: 12,
    efficiency: 92,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-neutral-900">Trash Collection</h1>
            <p className="text-neutral-600 mt-1 text-sm">Monitor total trash collected across barangays</p>
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
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm">
              <Download className="h-4 w-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <div className="bg-white rounded-xl p-5 lg:p-6 shadow-sm border border-neutral-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-primary-muted rounded-xl flex items-center justify-center">
              <Trash2 className="h-6 w-6 text-primary" />
            </div>
            <div className="flex items-center gap-1 text-sm font-medium text-green-600">
              <TrendingUp className="h-4 w-4" />
              +12.3%
            </div>
          </div>
          <h3 className="text-2xl font-bold text-neutral-900">{stats.totalCollected}</h3>
          <p className="text-sm text-neutral-600 mt-1">Total Collected</p>
        </div>

        <div className="bg-white rounded-xl p-5 lg:p-6 shadow-sm border border-neutral-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex items-center gap-1 text-sm font-medium text-green-600">
              <TrendingUp className="h-4 w-4" />
              +5.2%
            </div>
          </div>
          <h3 className="text-2xl font-bold text-neutral-900">{stats.weeklyAverage}</h3>
          <p className="text-sm text-neutral-600 mt-1">Weekly Average</p>
        </div>

        <div className="bg-white rounded-xl p-5 lg:p-6 shadow-sm border border-neutral-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center">
              <Calendar className="h-6 w-6 text-amber-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-neutral-900">{stats.totalTrucks}</h3>
          <p className="text-sm text-neutral-600 mt-1">Active Trucks</p>
        </div>

        <div className="bg-white rounded-xl p-5 lg:p-6 shadow-sm border border-neutral-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div className="flex items-center gap-1 text-sm font-medium text-green-600">
              <TrendingUp className="h-4 w-4" />
              +3.1%
            </div>
          </div>
          <h3 className="text-2xl font-bold text-neutral-900">{stats.efficiency}%</h3>
          <p className="text-sm text-neutral-600 mt-1">Efficiency Rate</p>
        </div>
      </div>

      {/* Barangay Performance */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200">
        <div className="p-6 border-b border-neutral-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-neutral-900">Barangay Collection Performance</h2>
            <button className="flex items-center gap-2 px-4 py-2 bg-neutral-100 rounded-lg hover:bg-neutral-200 transition-colors text-sm">
              <Filter className="h-4 w-4" />
              Filter
            </button>
          </div>
        </div>
        <div className="p-6 space-y-4">
          {barangays.map((barangay, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-neutral-900">{barangay.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-neutral-600">
                    {barangay.collected.toLocaleString()} / {barangay.target.toLocaleString()} kg
                  </span>
                  <span className={`text-sm font-bold ${
                    barangay.percentage >= 100 ? 'text-green-600' : 'text-amber-600'
                  }`}>
                    {barangay.percentage}%
                  </span>
                </div>
              </div>
              <div className="w-full bg-neutral-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all ${
                    barangay.percentage >= 100 ? 'bg-green-500' : 'bg-amber-500'
                  }`}
                  style={{ width: `${Math.min(barangay.percentage, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Collection History */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200">
        <div className="p-6 border-b border-neutral-200">
          <h2 className="text-lg font-bold text-neutral-900">Recent Collection History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Day</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Total Collected</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Trucks Deployed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {collectionHistory.map((record, index) => (
                <tr key={index} className="hover:bg-neutral-50">
                  <td className="px-6 py-4 text-sm text-neutral-900">{record.date}</td>
                  <td className="px-6 py-4 text-sm text-neutral-600">{record.day}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-neutral-900">{record.total}</td>
                  <td className="px-6 py-4 text-sm text-neutral-600">{record.trucks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TrashCollectionPage;
