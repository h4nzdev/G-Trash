import React, { useState, useMemo, useEffect } from "react";
import reportsService from "../services/reportsService";
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
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, investigating: 0, resolved: 0 });
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("priority");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedReports, setSelectedReports] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showCharts, setShowCharts] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [chartView, setChartView] = useState("distribution");
  const [isLoading, setIsLoading] = useState(true);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchReports();
    fetchStats();
  }, [filterStatus, filterType, sortBy, sortOrder, currentPage]);

  const fetchReports = async () => {
    try {
      setIsLoading(true);
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        status: filterStatus === "all" ? undefined : filterStatus,
        type: filterType === "all" ? undefined : filterType,
        sortBy: sortBy,
      };
      const response = await reportsService.getReports(params);
      if (response && response.reports) {
        setReports(response.reports);
      }
    } catch (error) {
      console.error("Failed to fetch reports:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await reportsService.getStats();
      if (response) {
        setStats({
          total: response.total || 0,
          pending: response.pending || 0,
          investigating: response.investigating || 0,
          resolved: response.resolved || 0,
        });
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await reportsService.updateStatus(id, newStatus);
      fetchReports();
      fetchStats();
      if (selectedReport?.id === id) {
        setSelectedReport({ ...selectedReport, status: newStatus });
      }
    } catch (error) {
      alert("Failed to update status");
    }
  };

  // Chart data calculations
  const reportsByType = useMemo(() => {
    const types = {};
    reports.forEach((report) => {
      types[report.type] = (types[report.type] || 0) + 1;
    });
    return Object.entries(types).map(([name, value]) => ({ name, value }));
  }, [reports]);

  const statusDistribution = useMemo(() => {
    return [
      { name: "Pending", value: stats.pending, color: "#F59E0B" },
      { name: "Investigating", value: stats.investigating, color: "#3B82F6" },
      { name: "Resolved", value: stats.resolved, color: "#22C55E" },
    ];
  }, [stats]);

  const COLORS = {
    safe: "#22C55E",
    moderate: "#F59E0B",
    high: "#EF4444",
    critical: "#991B1B",
    blue: "#3B82F6",
    purple: "#8B5CF6",
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: "bg-amber-100 text-amber-800",
      investigating: "bg-blue-100 text-blue-800",
      resolved: "bg-green-100 text-green-800",
    };
    return styles[status] || "bg-neutral-100 text-neutral-800";
  };

  const getPriorityBadge = (priority) => {
    if (priority > 50) return "bg-red-200 text-red-900";
    if (priority > 20) return "bg-red-100 text-red-800";
    if (priority > 0) return "bg-amber-100 text-amber-800";
    return "bg-neutral-100 text-neutral-700";
  };

  const paginatedReports = reports;

  const handleSelectAll = () => {
    if (selectedReports.length === paginatedReports.length && paginatedReports.length > 0) {
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

  const handleBulkStatusUpdate = async (newStatus) => {
    try {
      await Promise.all(selectedReports.map(id => reportsService.updateStatus(id, newStatus)));
      fetchReports();
      fetchStats();
      setSelectedReports([]);
      alert(`Updated ${selectedReports.length} reports to ${newStatus}`);
    } catch (error) {
      alert("Failed to update some reports");
    }
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(reports, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = `reports-${new Date().toISOString().split("T")[0]}.json`;
    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  const formatTimeAgo = (ts) => {
    const date = new Date(ts);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    return date.toLocaleDateString();
  };

  const getPriorityLevel = (priority) => {
    if (priority > 50) return { label: "Critical", color: "bg-red-200 text-red-900" };
    if (priority > 20) return { label: "High", color: "bg-red-100 text-red-800" };
    if (priority > 0) return { label: "Medium", color: "bg-amber-100 text-amber-800" };
    return { label: "Low", color: "bg-neutral-100 text-neutral-700" };
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
              {stats.investigating}
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
          {paginatedReports.map((report) => {
            const priorityLevel = getPriorityLevel(report.priority_score);
            return (
              <div key={report.id} className="px-5 py-4 hover:bg-neutral-50 transition-colors">
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
                            {report.type.toUpperCase()}
                          </h3>
                          <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${priorityLevel.color}`}>
                            {priorityLevel.label}
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
                            <span>{formatTimeAgo(report.created_at)}</span>
                          </div>
                          <span>
                            By:{" "}
                            <span className="font-medium">
                              {report.user_name}
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="w-24">
                    <span
                      className={`px-2.5 py-1 text-xs font-medium rounded-full ${getStatusBadge(report.status)}`}
                    >
                      {report.status.toUpperCase()}
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
            );
          })}
        </div>
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
                      {selectedReport.type.toUpperCase()}
                    </h3>
                    <div className="flex gap-2 mt-1">
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getPriorityLevel(selectedReport.priority_score).color}`}>
                        {getPriorityLevel(selectedReport.priority_score).label}
                      </span>
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusBadge(selectedReport.status)}`}>
                        {selectedReport.status.toUpperCase()}
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
                      Reported At
                    </label>
                    <p className="mt-1 text-sm text-neutral-700 flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-neutral-400" />
                      {new Date(selectedReport.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 mt-5 pt-5 border-t border-neutral-200">
                  {selectedReport.status !== 'resolved' && (
                    <button 
                      onClick={() => handleUpdateStatus(selectedReport.id, 'resolved')}
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
                      Mark as Resolved
                    </button>
                  )}
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
        </div>
      )}
    </div>
  );
};

export default ReportsPage;
