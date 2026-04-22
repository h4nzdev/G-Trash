import React, { useState, useMemo } from "react";
import {
  Bug,
  AlertTriangle,
  CheckCircle,
  Clock,
  Filter,
  Search,
  Download,
  RefreshCw,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  Target,
  MessageCircle,
  User,
  Calendar,
  Tag,
  MoreVertical,
  Eye,
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

const BugReportsPage = () => {
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedReport, setSelectedReport] = useState(null);
  const [chartView, setChartView] = useState("status");

  const bugReports = [
    {
      id: 1,
      title: "Map not loading on mobile devices",
      description:
        "Users report that the heatmap map fails to load on iOS devices when using Safari browser.",
      status: "Open",
      priority: "High",
      category: "Frontend",
      reportedBy: "Maria Santos",
      date: "2026-04-05",
      comments: 3,
      assignee: "John Dev",
    },
    {
      id: 2,
      title: "Notification sound not playing",
      description:
        "Push notification sound is not triggered when new alerts are received.",
      status: "In Progress",
      priority: "Medium",
      category: "Backend",
      reportedBy: "John Reyes",
      date: "2026-04-04",
      comments: 5,
      assignee: "Sarah Chen",
    },
    {
      id: 3,
      title: "Data export CSV format incorrect",
      description:
        "Exported CSV files have misaligned columns when opened in Excel.",
      status: "Open",
      priority: "Low",
      category: "Backend",
      reportedBy: "Ana Cruz",
      date: "2026-04-03",
      comments: 2,
      assignee: "Mike Johnson",
    },
    {
      id: 4,
      title: "User feedback form submission fails",
      description:
        "Submitting feedback results in a 500 error on the server side.",
      status: "Resolved",
      priority: "Critical",
      category: "Backend",
      reportedBy: "Pedro Garcia",
      date: "2026-04-02",
      comments: 8,
      assignee: "Alex Rivera",
    },
    {
      id: 5,
      title: "Dark mode toggle not working",
      description: "Toggling dark mode does not persist after page refresh.",
      status: "Open",
      priority: "Medium",
      category: "Frontend",
      reportedBy: "Lisa Wong",
      date: "2026-04-01",
      comments: 4,
      assignee: "John Dev",
    },
    {
      id: 6,
      title: "Truck location updates delayed",
      description:
        "GPS location updates for trucks are delayed by 5-10 minutes.",
      status: "In Progress",
      priority: "High",
      category: "Backend",
      reportedBy: "Carlos Mendoza",
      date: "2026-03-31",
      comments: 6,
      assignee: "Sarah Chen",
    },
    {
      id: 7,
      title: "Login session expires too quickly",
      description: "Users are being logged out after 15 minutes of inactivity.",
      status: "Open",
      priority: "Medium",
      category: "Security",
      reportedBy: "Elena Reyes",
      date: "2026-03-30",
      comments: 3,
      assignee: "Mike Johnson",
    },
    {
      id: 8,
      title: "Reports page pagination broken",
      description:
        "Pagination on reports page resets to page 1 when filtering.",
      status: "Resolved",
      priority: "Low",
      category: "Frontend",
      reportedBy: "Ramon Bautista",
      date: "2026-03-29",
      comments: 2,
      assignee: "John Dev",
    },
  ];

  const stats = {
    total: bugReports.length,
    open: bugReports.filter((b) => b.status === "Open").length,
    inProgress: bugReports.filter((b) => b.status === "In Progress").length,
    resolved: bugReports.filter((b) => b.status === "Resolved").length,
    critical: bugReports.filter((b) => b.priority === "Critical").length,
    high: bugReports.filter((b) => b.priority === "High").length,
    avgResolutionTime: "3.2 days",
    resolutionRate: 67,
  };

  // Chart Data
  const statusDistribution = useMemo(
    () =>
      [
        { name: "Open", value: stats.open, color: "#EF4444" },
        { name: "In Progress", value: stats.inProgress, color: "#3B82F6" },
        { name: "Resolved", value: stats.resolved, color: "#22C55E" },
      ].filter((d) => d.value > 0),
    [stats],
  );

  const priorityDistribution = useMemo(
    () =>
      [
        { name: "Critical", value: stats.critical, color: "#991B1B" },
        { name: "High", value: stats.high, color: "#EF4444" },
        {
          name: "Medium",
          value: bugReports.filter((b) => b.priority === "Medium").length,
          color: "#F59E0B",
        },
        {
          name: "Low",
          value: bugReports.filter((b) => b.priority === "Low").length,
          color: "#22C55E",
        },
      ].filter((d) => d.value > 0),
    [stats],
  );

  const categoryDistribution = useMemo(() => {
    const categories = {};
    bugReports.forEach((r) => {
      categories[r.category] = (categories[r.category] || 0) + 1;
    });
    return Object.entries(categories).map(([name, value]) => ({ name, value }));
  }, []);

  const weeklyTrend = useMemo(
    () => [
      { week: "Week 1", reported: 8, resolved: 5 },
      { week: "Week 2", reported: 12, resolved: 8 },
      { week: "Week 3", reported: 10, resolved: 7 },
      { week: "Week 4", reported: 15, resolved: 10 },
    ],
    [],
  );

  const assigneeData = useMemo(() => {
    const assignees = {};
    bugReports.forEach((r) => {
      if (r.assignee) {
        assignees[r.assignee] = (assignees[r.assignee] || 0) + 1;
      }
    });
    return Object.entries(assignees).map(([name, value]) => ({ name, value }));
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "Open":
        return "bg-red-100 text-red-800";
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      case "Resolved":
        return "bg-green-100 text-green-800";
      default:
        return "bg-neutral-100 text-neutral-800";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Critical":
        return "bg-red-200 text-red-900 border-red-300";
      case "High":
        return "bg-red-100 text-red-800 border-red-200";
      case "Medium":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "Low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-neutral-100 text-neutral-800";
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "Open":
        return "#EF4444";
      case "In Progress":
        return "#3B82F6";
      case "Resolved":
        return "#22C55E";
      default:
        return "#6B7280";
    }
  };

  const filteredReports = bugReports.filter((report) => {
    const matchesStatus =
      filterStatus === "all" || report.status === filterStatus;
    const matchesPriority =
      filterPriority === "all" || report.priority === filterPriority;
    const matchesSearch =
      searchTerm === "" ||
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesPriority && matchesSearch;
  });

  const COLORS = [
    "#EF4444",
    "#3B82F6",
    "#22C55E",
    "#F59E0B",
    "#8B5CF6",
    "#EC4899",
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-neutral-900">
              Bug Reports
            </h1>
            <p className="text-neutral-600 mt-1 text-sm">
              Manage bug reports and user feedback
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button className="p-2 hover:bg-neutral-100 rounded-lg transition-colors">
              <RefreshCw className="h-5 w-5 text-neutral-600" />
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors text-sm">
              <Download className="h-4 w-4" />
              Export
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm">
              <Bug className="h-4 w-4" />
              New Report
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
        <div className="bg-gradient-to-br from-neutral-50 to-neutral-100 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Bug className="h-4 w-4 text-neutral-600" />
            <span className="text-xs font-medium text-neutral-700">Total</span>
          </div>
          <p className="text-xl font-bold text-neutral-900">{stats.total}</p>
          <p className="text-xs text-neutral-500 mt-1">reports</p>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <span className="text-xs font-medium text-red-700">Open</span>
          </div>
          <p className="text-xl font-bold text-red-900">{stats.open}</p>
          <p className="text-xs text-red-600 mt-1">pending</p>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="h-4 w-4 text-blue-600" />
            <span className="text-xs font-medium text-blue-700">
              In Progress
            </span>
          </div>
          <p className="text-xl font-bold text-blue-900">{stats.inProgress}</p>
          <p className="text-xs text-blue-600 mt-1">active</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span className="text-xs font-medium text-green-700">Resolved</span>
          </div>
          <p className="text-xl font-bold text-green-900">{stats.resolved}</p>
          <p className="text-xs text-green-600 mt-1">completed</p>
        </div>
        <div className="bg-gradient-to-br from-red-100 to-red-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-4 w-4 text-red-800" />
            <span className="text-xs font-medium text-red-800">Critical</span>
          </div>
          <p className="text-xl font-bold text-red-900">{stats.critical}</p>
          <p className="text-xs text-red-700 mt-1">urgent</p>
        </div>
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-amber-600" />
            <span className="text-xs font-medium text-amber-700">High</span>
          </div>
          <p className="text-xl font-bold text-amber-900">{stats.high}</p>
          <p className="text-xs text-amber-600 mt-1">priority</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Target className="h-4 w-4 text-purple-600" />
            <span className="text-xs font-medium text-purple-700">
              Resolution
            </span>
          </div>
          <p className="text-xl font-bold text-purple-900">
            {stats.resolutionRate}%
          </p>
          <p className="text-xs text-purple-600 mt-1">rate</p>
        </div>
        <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-4 w-4 text-cyan-600" />
            <span className="text-xs font-medium text-cyan-700">Avg Time</span>
          </div>
          <p className="text-xl font-bold text-cyan-900">
            {stats.avgResolutionTime}
          </p>
          <p className="text-xs text-cyan-600 mt-1">to resolve</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200">
          <div className="p-5 border-b border-neutral-200">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-neutral-900">
                Status Distribution
              </h2>
              <div className="flex gap-1">
                <button
                  onClick={() => setChartView("status")}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    chartView === "status"
                      ? "bg-primary text-white"
                      : "bg-neutral-100 text-neutral-600"
                  }`}
                >
                  Status
                </button>
                <button
                  onClick={() => setChartView("priority")}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    chartView === "priority"
                      ? "bg-primary text-white"
                      : "bg-neutral-100 text-neutral-600"
                  }`}
                >
                  Priority
                </button>
              </div>
            </div>
          </div>
          <div className="p-5">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={
                    chartView === "status"
                      ? statusDistribution
                      : priorityDistribution
                  }
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {(chartView === "status"
                    ? statusDistribution
                    : priorityDistribution
                  ).map((entry, index) => (
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

        {/* Weekly Trend */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200">
          <div className="p-5 border-b border-neutral-200">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-neutral-900">
                Weekly Trend
              </h2>
              <BarChart3 className="h-4 w-4 text-neutral-500" />
            </div>
          </div>
          <div className="p-5">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart
                data={weeklyTrend}
                margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
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
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ paddingTop: 16 }}
                />
                <Bar
                  dataKey="reported"
                  fill="#EF4444"
                  radius={[4, 4, 0, 0]}
                  name="Reported"
                  maxBarSize={40}
                />
                <Bar
                  dataKey="resolved"
                  fill="#22C55E"
                  radius={[4, 4, 0, 0]}
                  name="Resolved"
                  maxBarSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Second Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200">
          <div className="p-5 border-b border-neutral-200">
            <h2 className="text-base font-bold text-neutral-900">
              By Category
            </h2>
          </div>
          <div className="p-5">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={categoryDistribution} layout="horizontal">
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
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="value"
                  fill="#8B5CF6"
                  radius={[4, 4, 0, 0]}
                  name="Reports"
                  maxBarSize={50}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Assignee Workload */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200">
          <div className="p-5 border-b border-neutral-200">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-neutral-900">
                Assignee Workload
              </h2>
              <User className="h-4 w-4 text-neutral-500" />
            </div>
          </div>
          <div className="p-5">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={assigneeData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: "#737373" }}
                  axisLine={{ stroke: "#E5E5E5" }}
                  tickLine={false}
                  angle={-20}
                  textAnchor="end"
                  height={50}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: "#737373" }}
                  axisLine={{ stroke: "#E5E5E5" }}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="value"
                  fill="#EC4899"
                  radius={[4, 4, 0, 0]}
                  name="Assigned"
                  maxBarSize={50}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-neutral-200">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search bug reports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm"
            >
              <option value="all">All Status</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm"
            >
              <option value="all">All Priority</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs text-neutral-500">
            {filteredReports.length} report
            {filteredReports.length !== 1 ? "s" : ""} found
          </span>
          {(filterStatus !== "all" ||
            filterPriority !== "all" ||
            searchTerm) && (
            <button
              onClick={() => {
                setFilterStatus("all");
                setFilterPriority("all");
                setSearchTerm("");
              }}
              className="text-xs text-primary hover:text-primary-dark font-medium"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Bug Reports List */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
        <div className="divide-y divide-neutral-200">
          {filteredReports.map((report) => (
            <div
              key={report.id}
              className="p-5 hover:bg-neutral-50 transition-colors cursor-pointer"
              onClick={() =>
                setSelectedReport(
                  selectedReport?.id === report.id ? null : report,
                )
              }
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{
                      backgroundColor:
                        getStatusBadgeColor(report.status) + "20",
                    }}
                  >
                    <Bug
                      className="h-4 w-4"
                      style={{ color: getStatusBadgeColor(report.status) }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-semibold text-neutral-900 text-sm">
                        {report.title}
                      </h3>
                      <span
                        className={`px-2 py-0.5 text-xs font-medium rounded-full border ${getPriorityColor(report.priority)}`}
                      >
                        {report.priority}
                      </span>
                    </div>
                    <p className="text-sm text-neutral-600 mb-2 line-clamp-2">
                      {report.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-500">
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {report.reportedBy}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {report.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="h-3 w-3" />
                        {report.comments} comments
                      </span>
                      <span className="flex items-center gap-1">
                        <Tag className="h-3 w-3" />
                        {report.category}
                      </span>
                      {report.assignee && (
                        <span className="flex items-center gap-1 text-blue-600">
                          <CheckCircle className="h-3 w-3" />
                          {report.assignee}
                        </span>
                      )}
                    </div>

                    {/* Expanded Content */}
                    {selectedReport?.id === report.id && (
                      <div className="mt-4 pt-4 border-t border-neutral-200">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-xs text-neutral-500 mb-1">
                              Full Description
                            </p>
                            <p className="text-neutral-700">
                              {report.description}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-neutral-500 mb-1">
                              Steps to Reproduce
                            </p>
                            <ol className="list-decimal list-inside text-neutral-600 space-y-1">
                              <li>Open the application</li>
                              <li>Navigate to the affected page</li>
                              <li>Observe the issue</li>
                            </ol>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-4">
                          <button className="px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-medium">
                            Update Status
                          </button>
                          <button className="px-3 py-1.5 border border-neutral-300 text-neutral-700 rounded-lg text-xs font-medium">
                            Add Comment
                          </button>
                          <button className="px-3 py-1.5 border border-neutral-300 text-neutral-700 rounded-lg text-xs font-medium">
                            Assign
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <span
                    className={`px-2.5 py-1 text-xs font-medium rounded-full ${getStatusColor(report.status)}`}
                  >
                    {report.status}
                  </span>
                  <button className="p-1.5 hover:bg-neutral-100 rounded-lg transition-colors">
                    <MoreVertical className="h-4 w-4 text-neutral-400" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredReports.length === 0 && (
          <div className="p-12 text-center">
            <Bug className="h-12 w-12 text-neutral-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-neutral-900 mb-1">
              No bug reports found
            </h3>
            <p className="text-sm text-neutral-500">
              Try adjusting your filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BugReportsPage;
