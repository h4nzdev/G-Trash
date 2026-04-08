import React, { useState } from 'react';
import { Bug, AlertTriangle, CheckCircle, Clock, Filter, Search } from 'lucide-react';

const BugReportsPage = () => {
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const bugReports = [
    {
      id: 1,
      title: 'Map not loading on mobile devices',
      description: 'Users report that the heatmap map fails to load on iOS devices when using Safari browser.',
      status: 'Open',
      priority: 'High',
      category: 'Frontend',
      reportedBy: 'Maria Santos',
      date: '2026-04-05',
      comments: 3,
    },
    {
      id: 2,
      title: 'Notification sound not playing',
      description: 'Push notification sound is not triggered when new alerts are received.',
      status: 'In Progress',
      priority: 'Medium',
      category: 'Backend',
      reportedBy: 'John Reyes',
      date: '2026-04-04',
      comments: 5,
    },
    {
      id: 3,
      title: 'Data export CSV format incorrect',
      description: 'Exported CSV files have misaligned columns when opened in Excel.',
      status: 'Open',
      priority: 'Low',
      category: 'Backend',
      reportedBy: 'Ana Cruz',
      date: '2026-04-03',
      comments: 2,
    },
    {
      id: 4,
      title: 'User feedback form submission fails',
      description: 'Submitting feedback results in a 500 error on the server side.',
      status: 'Resolved',
      priority: 'Critical',
      category: 'Backend',
      reportedBy: 'Pedro Garcia',
      date: '2026-04-02',
      comments: 8,
    },
    {
      id: 5,
      title: 'Dark mode toggle not working',
      description: 'Toggling dark mode does not persist after page refresh.',
      status: 'Open',
      priority: 'Medium',
      category: 'Frontend',
      reportedBy: 'Lisa Wong',
      date: '2026-04-01',
      comments: 4,
    },
    {
      id: 6,
      title: 'Truck location updates delayed',
      description: 'GPS location updates for trucks are delayed by 5-10 minutes.',
      status: 'In Progress',
      priority: 'High',
      category: 'Backend',
      reportedBy: 'Carlos Mendoza',
      date: '2026-03-31',
      comments: 6,
    },
  ];

  const stats = {
    total: bugReports.length,
    open: bugReports.filter(b => b.status === 'Open').length,
    inProgress: bugReports.filter(b => b.status === 'In Progress').length,
    resolved: bugReports.filter(b => b.status === 'Resolved').length,
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Open': return 'bg-red-100 text-red-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-neutral-100 text-neutral-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Critical': return 'bg-red-200 text-red-900';
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-amber-100 text-amber-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-neutral-100 text-neutral-800';
    }
  };

  const filteredReports = bugReports.filter(report => {
    const matchesStatus = filterStatus === 'all' || report.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || report.priority === filterPriority;
    const matchesSearch = searchTerm === '' ||
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesPriority && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-neutral-900">Bug Reports</h1>
            <p className="text-neutral-600 mt-1 text-sm">Manage bug reports and user feedback</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm">
            <Bug className="h-4 w-4" />
            New Report
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-neutral-50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Bug className="h-5 w-5 text-neutral-600" />
            <span className="text-sm font-medium text-neutral-700">Total</span>
          </div>
          <p className="text-2xl font-bold text-neutral-900">{stats.total}</p>
        </div>
        <div className="bg-red-50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <span className="text-sm font-medium text-red-700">Open</span>
          </div>
          <p className="text-2xl font-bold text-red-900">{stats.open}</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">In Progress</span>
          </div>
          <p className="text-2xl font-bold text-blue-900">{stats.inProgress}</p>
        </div>
        <div className="bg-green-50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="text-sm font-medium text-green-700">Resolved</span>
          </div>
          <p className="text-2xl font-bold text-green-900">{stats.resolved}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-500" />
              <input
                type="text"
                placeholder="Search bug reports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm"
            >
              <option value="all">All Status</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm"
            >
              <option value="all">All Priority</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bug Reports List */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200">
        <div className="divide-y divide-neutral-200">
          {filteredReports.map((report) => (
            <div key={report.id} className="p-6 hover:bg-neutral-50 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Bug className="h-5 w-5 text-neutral-500" />
                    <h3 className="font-semibold text-neutral-900">{report.title}</h3>
                  </div>
                  <p className="text-sm text-neutral-600 mb-3">{report.description}</p>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-500">
                    <span>Reported by: <span className="font-medium text-neutral-700">{report.reportedBy}</span></span>
                    <span>{report.date}</span>
                    <span className="flex items-center gap-1">
                      <span className="font-medium text-neutral-700">{report.comments}</span> comments
                    </span>
                    <span>Category: <span className="font-medium text-neutral-700">{report.category}</span></span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(report.status)}`}>
                    {report.status}
                  </span>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${getPriorityColor(report.priority)}`}>
                    {report.priority}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredReports.length === 0 && (
          <div className="p-12 text-center">
            <Bug className="h-16 w-16 text-neutral-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">No bug reports found</h3>
            <p className="text-neutral-600">Try adjusting your filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BugReportsPage;
