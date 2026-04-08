import React, { useState } from 'react';
import {
  BarChart3,
  Filter,
  Download,
  Search,
  ChevronDown,
  Trash2,
  MapPin,
  Clock,
  AlertTriangle,
} from 'lucide-react';

const ReportsPage = () => {
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const mockReports = [
    { id: 1, type: 'Overflowing Trash', location: 'Brgy. Lahug', description: 'Trash bins are overflowing, causing bad odor', status: 'Pending', priority: 'High', reportedBy: 'Maria Santos', date: '2026-03-24', time: '10:30 AM', upvotes: 45 },
    { id: 2, type: 'Bad Smell', location: 'Brgy. Apas', description: 'Strong foul smell from garbage collection point', status: 'In Progress', priority: 'Medium', reportedBy: 'John Reyes', date: '2026-03-24', time: '09:15 AM', upvotes: 28 },
    { id: 3, type: 'Missed Collection', location: 'Brgy. Kasambagan', description: 'Garbage truck missed our street again this week', status: 'Resolved', priority: 'High', reportedBy: 'Ana Cruz', date: '2026-03-23', time: '03:20 PM', upvotes: 67 },
    { id: 4, type: 'Illegal Dumping', location: 'Brgy. Budlaan', description: 'Construction waste dumped near school', status: 'Pending', priority: 'Critical', reportedBy: 'Pedro Garcia', date: '2026-03-23', time: '08:45 AM', upvotes: 89 },
    { id: 5, type: 'Overflowing Trash', location: 'Brgy. Capitol', description: 'Public trash bin overflowing for 2 days', status: 'In Progress', priority: 'Medium', reportedBy: 'Lisa Wong', date: '2026-03-22', time: '02:10 PM', upvotes: 34 },
    { id: 6, type: 'Bad Smell', location: 'Brgy. Lahug', description: 'Decomposing waste causing health concerns', status: 'Resolved', priority: 'High', reportedBy: 'Carlos Mendoza', date: '2026-03-22', time: '11:30 AM', upvotes: 56 },
  ];

  const stats = {
    total: mockReports.length,
    pending: mockReports.filter(r => r.status === 'Pending').length,
    inProgress: mockReports.filter(r => r.status === 'In Progress').length,
    resolved: mockReports.filter(r => r.status === 'Resolved').length,
  };

  const filteredReports = mockReports.filter(report => {
    const matchesStatus = filterStatus === 'all' || report.status === filterStatus;
    const matchesType = filterType === 'all' || report.type === filterType;
    const matchesSearch = searchTerm === '' || 
      report.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesType && matchesSearch;
  });

  const getStatusBadge = (status) => {
    const styles = {
      'Pending': 'bg-amber-100 text-amber-800',
      'In Progress': 'bg-blue-100 text-blue-800',
      'Resolved': 'bg-green-100 text-green-800',
    };
    return styles[status] || 'bg-neutral-100 text-neutral-800';
  };

  const getPriorityBadge = (priority) => {
    const styles = {
      'Low': 'bg-neutral-100 text-neutral-700',
      'Medium': 'bg-amber-100 text-amber-800',
      'High': 'bg-red-100 text-red-800',
      'Critical': 'bg-red-200 text-red-900',
    };
    return styles[priority] || 'bg-neutral-100 text-neutral-700';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">Data Reports</h1>
            <p className="text-neutral-600 mt-1">View and manage community waste reports</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors">
            <Download className="h-5 w-5" />
            <span className="hidden md:inline text-sm font-medium">Export</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-neutral-50 rounded-lg p-4">
            <p className="text-sm text-neutral-600">Total Reports</p>
            <p className="text-2xl font-bold text-neutral-900">{stats.total}</p>
          </div>
          <div className="bg-amber-50 rounded-lg p-4">
            <p className="text-sm text-amber-700">Pending</p>
            <p className="text-2xl font-bold text-amber-900">{stats.pending}</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-blue-700">In Progress</p>
            <p className="text-2xl font-bold text-blue-900">{stats.inProgress}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <p className="text-sm text-green-700">Resolved</p>
            <p className="text-2xl font-bold text-green-900">{stats.resolved}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-500" />
              <input
                type="text"
                placeholder="Search reports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
            >
              <option value="all">All Status</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
            >
              <option value="all">All Types</option>
              <option value="Overflowing Trash">Overflowing Trash</option>
              <option value="Bad Smell">Bad Smell</option>
              <option value="Missed Collection">Missed Collection</option>
              <option value="Illegal Dumping">Illegal Dumping</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reports List */}
      <div className="bg-white rounded-2xl shadow-sm border border-neutral-200">
        <div className="divide-y divide-neutral-200">
          {filteredReports.map((report) => (
            <div key={report.id} className="p-6 hover:bg-neutral-50 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Trash2 className="h-5 w-5 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-neutral-900">{report.type}</h3>
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getPriorityBadge(report.priority)}`}>
                          {report.priority}
                        </span>
                      </div>
                      <p className="text-sm text-neutral-600 mb-2">{report.description}</p>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-600">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{report.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{report.date} at {report.time}</span>
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-neutral-500">
                        Reported by: <span className="font-medium">{report.reportedBy}</span> • 
                        <span className="font-medium">{report.upvotes}</span> upvotes
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusBadge(report.status)}`}>
                    {report.status}
                  </span>
                  <button className="text-sm text-primary hover:text-primary-dark font-medium">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredReports.length === 0 && (
          <div className="p-12 text-center">
            <BarChart3 className="h-16 w-16 text-neutral-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">No reports found</h3>
            <p className="text-neutral-600">Try adjusting your filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsPage;
