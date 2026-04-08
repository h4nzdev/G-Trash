import React from 'react';
import { Trophy, Award, Star, TrendingUp, Medal, Trash2 } from 'lucide-react';

const LeaderboardPage = () => {
  const barangayLeaderboard = [
    { rank: 1, name: 'Brgy. Kasambagan', score: 95, trashCollected: 3120, segregation: 92, reports: 12, trend: 'up' },
    { rank: 2, name: 'Brgy. Budlaan', score: 89, trashCollected: 2780, segregation: 88, reports: 8, trend: 'up' },
    { rank: 3, name: 'Brgy. Capitol', score: 84, trashCollected: 2100, segregation: 85, reports: 6, trend: 'stable' },
    { rank: 4, name: 'Brgy. Lahug', score: 82, trashCollected: 2450, segregation: 78, reports: 15, trend: 'down' },
    { rank: 5, name: 'Brgy. Apas', score: 76, trashCollected: 1890, segregation: 72, reports: 18, trend: 'up' },
    { rank: 6, name: 'Brgy. Guadalupe', score: 71, trashCollected: 1950, segregation: 68, reports: 10, trend: 'stable' },
  ];

  const getRankBadge = (rank) => {
    switch (rank) {
      case 1: return (
        <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg">
          <Medal className="h-6 w-6 text-white" />
        </div>
      );
      case 2: return (
        <div className="w-12 h-12 bg-gradient-to-br from-gray-300 to-gray-500 rounded-full flex items-center justify-center shadow-lg">
          <Medal className="h-6 w-6 text-white" />
        </div>
      );
      case 3: return (
        <div className="w-12 h-12 bg-gradient-to-br from-amber-600 to-amber-800 rounded-full flex items-center justify-center shadow-lg">
          <Medal className="h-6 w-6 text-white" />
        </div>
      );
      default: return (
        <div className="w-12 h-12 bg-neutral-200 rounded-full flex items-center justify-center">
          <span className="text-lg font-bold text-neutral-700">{rank}</span>
        </div>
      );
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down': return <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />;
      default: return <span className="text-neutral-500">→</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">Barangay Leaderboard</h1>
            <p className="text-neutral-600 mt-1">Rankings based on waste management performance</p>
          </div>
        </div>

        {/* Top 3 Podium */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="text-center">
            <div className="flex justify-center mb-3">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-300 to-gray-500 rounded-full flex items-center justify-center shadow-lg">
                <Award className="h-8 w-8 text-white" />
              </div>
            </div>
            <h3 className="font-bold text-neutral-900">Brgy. Budlaan</h3>
            <p className="text-2xl font-bold text-gray-600 mt-1">89</p>
            <p className="text-xs text-neutral-600">2nd Place</p>
          </div>
          <div className="text-center">
            <div className="flex justify-center mb-3">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-xl">
                <Trophy className="h-10 w-10 text-white" />
              </div>
            </div>
            <h3 className="font-bold text-neutral-900">Brgy. Kasambagan</h3>
            <p className="text-3xl font-bold text-yellow-600 mt-1">95</p>
            <p className="text-xs text-neutral-600">1st Place</p>
          </div>
          <div className="text-center">
            <div className="flex justify-center mb-3">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-600 to-amber-800 rounded-full flex items-center justify-center shadow-lg">
                <Star className="h-8 w-8 text-white" />
              </div>
            </div>
            <h3 className="font-bold text-neutral-900">Brgy. Capitol</h3>
            <p className="text-2xl font-bold text-amber-700 mt-1">84</p>
            <p className="text-xs text-neutral-600">3rd Place</p>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
          <div className="flex items-center gap-2 mb-4">
            <Trash2 className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold text-neutral-900">Most Trash Collected</h2>
          </div>
          <div className="space-y-3">
            {barangayLeaderboard.slice(0, 3).map((barangay, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-neutral-900">#{index + 1}</span>
                  <span className="text-sm font-medium text-neutral-900">{barangay.name}</span>
                </div>
                <span className="text-lg font-bold text-primary">{barangay.trashCollected} kg</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
          <div className="flex items-center gap-2 mb-4">
            <Award className="h-5 w-5 text-gold" />
            <h2 className="text-xl font-bold text-neutral-900">Best in Segregation</h2>
          </div>
          <div className="space-y-3">
            {barangayLeaderboard.slice(0, 3).map((barangay, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-neutral-900">#{index + 1}</span>
                  <span className="text-sm font-medium text-neutral-900">{barangay.name}</span>
                </div>
                <span className="text-lg font-bold text-gold">{barangay.segregation}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Full Leaderboard */}
      <div className="bg-white rounded-2xl shadow-sm border border-neutral-200">
        <div className="p-6 border-b border-neutral-200">
          <h2 className="text-xl font-bold text-neutral-900">Complete Rankings</h2>
        </div>
        <div className="divide-y divide-neutral-200">
          {barangayLeaderboard.map((barangay) => (
            <div key={barangay.rank} className="p-6 hover:bg-neutral-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {getRankBadge(barangay.rank)}
                  <div>
                    <h3 className="font-bold text-neutral-900">{barangay.name}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      {getTrendIcon(barangay.trend)}
                      <span className="text-sm text-neutral-600">
                        {barangay.reports} reports • {barangay.trashCollected} kg
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-primary">{barangay.score}</p>
                  <p className="text-xs text-neutral-600">Performance Score</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;
