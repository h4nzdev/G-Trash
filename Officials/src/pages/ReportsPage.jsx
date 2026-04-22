import React, { useState, useMemo } from "react";
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
  TrendingUp,
  Calendar,
  ChevronLeft,
  ChevronRight,
  X,
  CheckSquare,
  Square,
  MoreVertical,
  ArrowUp,
  ArrowDown,
  LayoutGrid,
  List,
} from "lucide-react";
import {
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
  Area,
  AreaChart,
} from "recharts";

// Custom Tooltip for cleaner display
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white px-4 py-3 rounded-lg shadow-lg border border-neutral-200">
        <p className="text-sm font-medium text-neutral-900 mb-2">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }} className="text-sm">
            <span className="font-medium">{entry.name}:</span> {entry.value}{" "}
            {entry.unit || "reports"}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const ReportsPage = () => {
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedReports, setSelectedReports] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showCharts, setShowCharts] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [dateRange, setDateRange] = useState("all");
  const [chartView, setChartView] = useState("distribution");
  const itemsPerPage = 5;

  const mockReports = [
    {
      id: 1,
      type: "Overflowing Trash",
      location: "Brgy. Lahug",
      description: "Trash bins are overflowing, causing bad odor",
      status: "Pending",
      priority: "High",
      reportedBy: "Maria Santos",
      date: "2026-03-24",
      time: "10:30 AM",
      upvotes: 45,
      coordinates: { lat: 10.3157, lng: 123.8854 },
    },
    {
      id: 2,
      type: "Bad Smell",
      location: "Brgy. Apas",
      description: "Strong foul smell from garbage collection point",
      status: "In Progress",
      priority: "Medium",
      reportedBy: "John Reyes",
      date: "2026-03-24",
      time: "09:15 AM",
      upvotes: 28,
      coordinates: { lat: 10.3257, lng: 123.8954 },
    },
    {
      id: 3,
      type: "Missed Collection",
      location: "Brgy. Kasambagan",
      description: "Garbage truck missed our street again this week",
      status: "Resolved",
      priority: "High",
      reportedBy: "Ana Cruz",
      date: "2026-03-23",
      time: "03:20 PM",
      upvotes: 67,
      coordinates: { lat: 10.3357, lng: 123.8754 },
    },
    {
      id: 4,
      type: "Illegal Dumping",
      location: "Brgy. Budlaan",
      description: "Construction waste dumped near school",
      status: "Pending",
      priority: "Critical",
      reportedBy: "Pedro Garcia",
      date: "2026-03-23",
      time: "08:45 AM",
      upvotes: 89,
      coordinates: { lat: 10.3457, lng: 123.8654 },
    },
    {
      id: 5,
      type: "Overflowing Trash",
      location: "Brgy. Capitol",
      description: "Public trash bin overflowing for 2 days",
      status: "In Progress",
      priority: "Medium",
      reportedBy: "Lisa Wong",
      date: "2026-03-22",
      time: "02:10 PM",
      upvotes: 34,
      coordinates: { lat: 10.3057, lng: 123.9054 },
    },
    {
      id: 6,
      type: "Bad Smell",
      location: "Brgy. Lahug",
      description: "Decomposing waste causing health concerns",
      status: "Resolved",
      priority: "High",
      reportedBy: "Carlos Mendoza",
      date: "2026-03-22",
      time: "11:30 AM",
      upvotes: 56,
      coordinates: { lat: 10.3157, lng: 123.8854 },
    },
    {
      id: 7,
      type: "Overflowing Trash",
      location: "Brgy. Mabolo",
      description: "Public market trash area overflow",
      status: "Pending",
      priority: "High",
      reportedBy: "Elena Reyes",
      date: "2026-03-21",
      time: "04:15 PM",
      upvotes: 72,
      coordinates: { lat: 10.3257, lng: 123.8754 },
    },
    {
      id: 8,
      type: "Illegal Dumping",
      location: "Brgy. Luz",
      description: "Industrial waste in residential area",
      status: "In Progress",
      priority: "Critical",
      reportedBy: "Ramon Bautista",
      date: "2026-03-20",
      time: "01:30 PM",
      upvotes: 95,
      coordinates: { lat: 10.2957, lng: 123.8954 },
    },
  ];

  const stats = {
    total: mockReports.length,
    pending: mockReports.filter((r) => r.status === "Pending").length,
    inProgress: mockReports.filter((r) => r.status === "In Progress").length,
    resolved: mockReports.filter((r) => r.status === "Resolved").length,
  };

  // Chart data
  const reportsByType = useMemo(() => {
    const types = {};
    mockReports.forEach((report) => {
      types[report.type] = (types[report.type] || 0) + 1;
    });
    return Object.entries(types).map(([name, value]) => ({ name, value }));
  }, []);

  const reportsByBarangay = useMemo(() => {
    const barangays = {};
    mockReports.forEach((report) => {
      barangays[report.location] = (barangays[report.location] || 0) + 1;
    });
    return Object.entries(barangays)
      .map(([name, value]) => ({ name: name.replace("Brgy. ", ""), value }))
      .sort((a, b) => b.value - a.value);
  }, []);

  const priorityDistribution = useMemo(() => {
    const priorities = {};
    mockReports.forEach((report) => {
      priorities[report.priority] = (priorities[report.priority] || 0) + 1;
    });
    return Object.entries(priorities).map(([name, value]) => ({ name, value }));
  }, []);

  const statusDistribution = useMemo(() => {
    return [
      { name: "Pending", value: stats.pending, color: "#F59E0B" },
      { name: "In Progress", value: stats.inProgress, color: "#3B82F6" },
      { name: "Resolved", value: stats.resolved, color: "#22C55E" },
    ];
  }, [stats]);

  const weeklyTrend = useMemo(() => {
    return [
      { day: "Mon", reports: 12, resolved: 8 },
      { day: "Tue", reports: 15, resolved: 10 },
      { day: "Wed", reports: 10, resolved: 7 },
      { day: "Thu", reports: 18, resolved: 12 },
      { day: "Fri", reports: 14, resolved: 11 },
      { day: "Sat", reports: 8, resolved: 6 },
      { day: "Sun", reports: 5, resolved: 4 },
    ];
  }, []);

  const COLORS = {
    safe: "#22C55E",
    moderate: "#F59E0B",
    high: "#EF4444",
    critical: "#991B1B",
    blue: "#3B82F6",
    purple: "#8B5CF6",
  };

  // Filter and sort reports
  const filteredReports = useMemo(() => {
    let filtered = mockReports.filter((report) => {
      const matchesStatus =
        filterStatus === "all" || report.status === filterStatus;
      const matchesType = filterType === "all" || report.type === filterType;
      const matchesSearch =
        searchTerm === "" ||
        report.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.description.toLowerCase().includes(searchTerm.toLowerCase());

      let matchesDate = true;
      if (dateRange !== "all") {
        const reportDate = new Date(report.date);
        const today = new Date();
        if (dateRange === "today") {
          matchesDate = reportDate.toDateString() === today.toDateString();
        } else if (dateRange === "week") {
          const weekAgo = new Date(today.setDate(today.getDate() - 7));
          matchesDate = reportDate >= weekAgo;
        } else if (dateRange === "month") {
          const monthAgo = new Date(today.setMonth(today.getMonth() - 1));
          matchesDate = reportDate >= monthAgo;
        }
      }

      return matchesStatus && matchesType && matchesSearch && matchesDate;
    });

    filtered.sort((a, b) => {
      let comparison = 0;
      if (sortBy === "date") {
        comparison =
          new Date(a.date + " " + a.time) - new Date(b.date + " " + b.time);
      } else if (sortBy === "upvotes") {
        comparison = a.upvotes - b.upvotes;
      } else if (sortBy === "priority") {
        const priorityOrder = { Critical: 4, High: 3, Medium: 2, Low: 1 };
        comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

    return filtered;
  }, [filterStatus, filterType, searchTerm, sortBy, sortOrder, dateRange]);

  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);
  const paginatedReports = filteredReports.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const getStatusBadge = (status) => {
    const styles = {
      Pending: "bg-amber-100 text-amber-800",
      "In Progress": "bg-blue-100 text-blue-800",
      Resolved: "bg-green-100 text-green-800",
    };
    return styles[status] || "bg-neutral-100 text-neutral-800";
  };

  const getPriorityBadge = (priority) => {
    const styles = {
      Low: "bg-neutral-100 text-neutral-700",
      Medium: "bg-amber-100 text-amber-800",
      High: "bg-red-100 text-red-800",
      Critical: "bg-red-200 text-red-900",
    };
    return styles[priority] || "bg-neutral-100 text-neutral-700";
  };

  const handleSelectAll = () => {
    if (selectedReports.length === paginatedReports.length) {
      setSelectedReports([]);
    } else {
      setSelectedReports(paginatedReports.map((r) => r.id));
    }
  };

  const handleSelectReport = (id) => {
    setSelectedReports((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id],
    );
  };

  const handleBulkStatusUpdate = (newStatus) => {
    console.log(`Updating ${selectedReports.length} reports to ${newStatus}`);
    setSelectedReports([]);
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(filteredReports, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = `reports-${new Date().toISOString().split("T")[0]}.json`;
    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">
              Data Reports
            </h1>
            <p className="text-neutral-600 mt-1">
              View and manage community waste reports
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowCharts(!showCharts)}
              className="flex items-center gap-2 px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors"
            >
              <BarChart3 className="h-5 w-5" />
              <span className="hidden md:inline text-sm font-medium">
                {showCharts ? "Hide Charts" : "Show Charts"}
              </span>
            </button>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              <Download className="h-5 w-5" />
              <span className="hidden md:inline text-sm font-medium">
                Export
              </span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-neutral-50 rounded-xl p-4">
            <p className="text-sm text-neutral-600">Total Reports</p>
            <p className="text-2xl font-bold text-neutral-900">{stats.total}</p>
          </div>
          <div className="bg-amber-50 rounded-xl p-4">
            <p className="text-sm text-amber-700">Pending</p>
            <p className="text-2xl font-bold text-amber-900">{stats.pending}</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-4">
            <p className="text-sm text-blue-700">In Progress</p>
            <p className="text-2xl font-bold text-blue-900">
              {stats.inProgress}
            </p>
          </div>
          <div className="bg-green-50 rounded-xl p-4">
            <p className="text-sm text-green-700">Resolved</p>
            <p className="text-2xl font-bold text-green-900">
              {stats.resolved}
            </p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      {showCharts && (
        <div className="space-y-6">
          {/* Chart View Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setChartView("distribution")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                chartView === "distribution"
                  ? "bg-primary text-white"
                  : "bg-white text-neutral-700 border border-neutral-300 hover:bg-neutral-50"
              }`}
            >
              Distribution
            </button>
            <button
              onClick={() => setChartView("trends")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                chartView === "trends"
                  ? "bg-primary text-white"
                  : "bg-white text-neutral-700 border border-neutral-300 hover:bg-neutral-50"
              }`}
            >
              Trends
            </button>
          </div>

          {chartView === "distribution" ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Reports by Type */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
                <h3 className="font-semibold text-neutral-900 mb-4">
                  Reports by Type
                </h3>
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={reportsByType}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {reportsByType.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            Object.values(COLORS)[
                              index % Object.values(COLORS).length
                            ]
                          }
                        />
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

              {/* Status Distribution */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
                <h3 className="font-semibold text-neutral-900 mb-4">
                  Status Distribution
                </h3>
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={statusDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {statusDistribution.map((entry, index) => (
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

              {/* Reports by Barangay */}
              <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
                <h3 className="font-semibold text-neutral-900 mb-4">
                  Reports by Barangay
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={reportsByBarangay}
                    margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                  >
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
                      fill={COLORS.blue}
                      radius={[6, 6, 0, 0]}
                      maxBarSize={50}
                      name="Reports"
                      unit=""
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Weekly Trend */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
                <h3 className="font-semibold text-neutral-900 mb-4">
                  Weekly Report Trends
                </h3>
                <ResponsiveContainer width="100%" height={320}>
                  <AreaChart
                    data={weeklyTrend}
                    margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
                  >
                    <defs>
                      <linearGradient
                        id="reportsGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor={COLORS.blue}
                          stopOpacity={0.2}
                        />
                        <stop
                          offset="95%"
                          stopColor={COLORS.blue}
                          stopOpacity={0}
                        />
                      </linearGradient>
                      <linearGradient
                        id="resolvedGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor={COLORS.safe}
                          stopOpacity={0.2}
                        />
                        <stop
                          offset="95%"
                          stopColor={COLORS.safe}
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
                    <XAxis
                      dataKey="day"
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
                      wrapperStyle={{ paddingTop: 20 }}
                    />
                    <Area
                      type="monotone"
                      dataKey="reports"
                      stroke={COLORS.blue}
                      strokeWidth={2}
                      fill="url(#reportsGradient)"
                      name="Total Reports"
                    />
                    <Area
                      type="monotone"
                      dataKey="resolved"
                      stroke={COLORS.safe}
                      strokeWidth={2}
                      fill="url(#resolvedGradient)"
                      name="Resolved"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Priority Distribution Bar */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
                <h3 className="font-semibold text-neutral-900 mb-4">
                  Priority Distribution
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart
                    data={priorityDistribution}
                    layout="horizontal"
                    margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
                  >
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
                      radius={[6, 6, 0, 0]}
                      maxBarSize={60}
                      name="Reports"
                    >
                      {priorityDistribution.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            entry.name === "Critical"
                              ? COLORS.critical
                              : entry.name === "High"
                                ? COLORS.high
                                : entry.name === "Medium"
                                  ? COLORS.moderate
                                  : COLORS.safe
                          }
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-neutral-200">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search reports..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm"
              >
                <option value="all">All Status</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm"
              >
                <option value="all">All Types</option>
                <option value="Overflowing Trash">Overflowing Trash</option>
                <option value="Bad Smell">Bad Smell</option>
                <option value="Missed Collection">Missed Collection</option>
                <option value="Illegal Dumping">Illegal Dumping</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-neutral-600">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1.5 border border-neutral-300 rounded-lg text-sm"
            >
              <option value="date">Date</option>
              <option value="upvotes">Upvotes</option>
              <option value="priority">Priority</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="p-1.5 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              {sortOrder === "asc" ? (
                <ArrowUp className="h-4 w-4" />
              ) : (
                <ArrowDown className="h-4 w-4" />
              )}
            </button>
            <span className="text-sm text-neutral-500 ml-auto">
              {filteredReports.length} reports found
            </span>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedReports.length > 0 && (
        <div className="bg-primary-muted rounded-xl p-4 border border-primary-light">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckSquare className="h-5 w-5 text-primary" />
              <span className="font-medium text-neutral-900">
                {selectedReports.length} report
                {selectedReports.length > 1 ? "s" : ""} selected
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleBulkStatusUpdate("In Progress")}
                className="px-3 py-1.5 bg-blue-100 text-blue-800 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors"
              >
                Mark In Progress
              </button>
              <button
                onClick={() => handleBulkStatusUpdate("Resolved")}
                className="px-3 py-1.5 bg-green-100 text-green-800 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors"
              >
                Mark Resolved
              </button>
              <button
                onClick={() => setSelectedReports([])}
                className="px-3 py-1.5 bg-neutral-100 text-neutral-700 rounded-lg text-sm font-medium hover:bg-neutral-200 transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reports List */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
        <div className="px-5 py-3 bg-neutral-50 border-b border-neutral-200 flex items-center gap-4">
          <button
            onClick={handleSelectAll}
            className="p-1 hover:bg-neutral-200 rounded transition-colors"
          >
            {selectedReports.length === paginatedReports.length &&
            paginatedReports.length > 0 ? (
              <CheckSquare className="h-4 w-4 text-primary" />
            ) : (
              <Square className="h-4 w-4 text-neutral-400" />
            )}
          </button>
          <span className="text-xs font-medium text-neutral-600 uppercase tracking-wider flex-1">
            Report Details
          </span>
          <span className="text-xs font-medium text-neutral-600 uppercase tracking-wider w-24">
            Status
          </span>
          <span className="text-xs font-medium text-neutral-600 uppercase tracking-wider w-24">
            Actions
          </span>
        </div>

        <div className="divide-y divide-neutral-200">
          {paginatedReports.map((report) => (
            <div
              key={report.id}
              className="px-5 py-4 hover:bg-neutral-50 transition-colors"
            >
              <div className="flex items-start gap-4">
                <button
                  onClick={() => handleSelectReport(report.id)}
                  className="p-1 hover:bg-neutral-200 rounded transition-colors mt-1"
                >
                  {selectedReports.includes(report.id) ? (
                    <CheckSquare className="h-4 w-4 text-primary" />
                  ) : (
                    <Square className="h-4 w-4 text-neutral-400" />
                  )}
                </button>

                <div className="flex-1">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-neutral-900 text-sm">
                          {report.type}
                        </h3>
                        <span
                          className={`px-2 py-0.5 text-xs font-medium rounded-full ${getPriorityBadge(report.priority)}`}
                        >
                          {report.priority}
                        </span>
                      </div>
                      <p className="text-sm text-neutral-600 mb-2">
                        {report.description}
                      </p>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-500">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span>{report.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>
                            {report.date} at {report.time}
                          </span>
                        </div>
                        <span>
                          By:{" "}
                          <span className="font-medium">
                            {report.reportedBy}
                          </span>
                        </span>
                        <span className="flex items-center gap-1 text-amber-600">
                          <TrendingUp className="h-3 w-3" />
                          <span className="font-medium">{report.upvotes}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="w-24">
                  <span
                    className={`px-2.5 py-1 text-xs font-medium rounded-full ${getStatusBadge(report.status)}`}
                  >
                    {report.status}
                  </span>
                </div>

                <div className="w-24">
                  <button
                    onClick={() => setSelectedReport(report)}
                    className="text-sm text-primary hover:text-primary-dark font-medium"
                  >
                    View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredReports.length === 0 && (
          <div className="p-12 text-center">
            <BarChart3 className="h-12 w-12 text-neutral-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-neutral-900 mb-1">
              No reports found
            </h3>
            <p className="text-sm text-neutral-500">
              Try adjusting your filters
            </p>
          </div>
        )}

        {totalPages > 1 && (
          <div className="px-5 py-4 border-t border-neutral-200 flex items-center justify-between">
            <p className="text-xs text-neutral-500">
              Showing {(currentPage - 1) * itemsPerPage + 1}-
              {Math.min(currentPage * itemsPerPage, filteredReports.length)} of{" "}
              {filteredReports.length}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 hover:bg-neutral-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                let pageNum = i + 1;
                if (totalPages > 5) {
                  if (currentPage > 3) {
                    pageNum = currentPage - 3 + i;
                  }
                  if (currentPage > totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  }
                }
                if (pageNum <= totalPages) {
                  return (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-7 h-7 rounded-lg text-xs font-medium transition-colors ${
                        currentPage === pageNum
                          ? "bg-primary text-white"
                          : "hover:bg-neutral-100 text-neutral-600"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                }
                return null;
              })}
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="p-1.5 hover:bg-neutral-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedReport && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedReport(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-neutral-900">
                  Report Details
                </h2>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="p-1.5 hover:bg-neutral-100 rounded-lg transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-red-50 rounded-xl flex items-center justify-center">
                    <Trash2 className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-base text-neutral-900">
                      {selectedReport.type}
                    </h3>
                    <div className="flex gap-2 mt-1">
                      <span
                        className={`px-2 py-0.5 text-xs font-medium rounded-full ${getPriorityBadge(selectedReport.priority)}`}
                      >
                        {selectedReport.priority}
                      </span>
                      <span
                        className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusBadge(selectedReport.status)}`}
                      >
                        {selectedReport.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Description
                  </label>
                  <p className="mt-1 text-sm text-neutral-700">
                    {selectedReport.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Location
                    </label>
                    <p className="mt-1 text-sm text-neutral-700 flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-neutral-400" />
                      {selectedReport.location}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Reported
                    </label>
                    <p className="mt-1 text-sm text-neutral-700 flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-neutral-400" />
                      {selectedReport.date} at {selectedReport.time}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Reported By
                    </label>
                    <p className="mt-1 text-sm text-neutral-700">
                      {selectedReport.reportedBy}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Upvotes
                    </label>
                    <p className="mt-1 text-sm text-neutral-700 flex items-center gap-1">
                      <TrendingUp className="h-3.5 w-3.5 text-amber-600" />
                      {selectedReport.upvotes}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mt-5 pt-5 border-t border-neutral-200">
                <button className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-medium">
                  Update Status
                </button>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="flex-1 px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors text-sm font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsPage;