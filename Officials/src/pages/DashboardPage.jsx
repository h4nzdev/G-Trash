import React from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  TrendingUp,
  TrendingDown,
  Truck,
  MapPin,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
} from "lucide-react";

const DashboardPage = () => {
  const { user } = useAuth();

  // Mock data - replace with real API calls
  const stats = [
    {
      label: "Total Trash Collected",
      value: "12,458 kg",
      change: "+8.5%",
      trend: "up",
      icon: TrendingUp,
      color: "text-primary",
      bgColor: "bg-primary-muted",
    },
    {
      label: "Active Trucks",
      value: "8",
      change: "+2",
      trend: "up",
      icon: Truck,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      label: "Pending Reports",
      value: "23",
      change: "-5",
      trend: "down",
      icon: AlertTriangle,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
    },
    {
      label: "Completed Routes",
      value: "156",
      change: "+12",
      trend: "up",
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
  ];

  const recentReports = [
    {
      id: 1,
      type: "Overflowing Trash",
      location: "Brgy. Lahug",
      status: "Pending",
      priority: "High",
      time: "2h ago",
    },
    {
      id: 2,
      type: "Bad Smell",
      location: "Brgy. Apas",
      status: "Resolved",
      priority: "Medium",
      time: "4h ago",
    },
    {
      id: 3,
      type: "Missed Collection",
      location: "Brgy. Kasambagan",
      status: "In Progress",
      priority: "High",
      time: "5h ago",
    },
    {
      id: 4,
      type: "Illegal Dumping",
      location: "Brgy. Budlaan",
      status: "Pending",
      priority: "Critical",
      time: "6h ago",
    },
  ];

  const pollutionLevels = [
    {
      barangay: "Brgy. Lahug",
      level: 72,
      status: "Moderate",
      color: "bg-amber-500",
    },
    { barangay: "Brgy. Apas", level: 85, status: "High", color: "bg-red-500" },
    {
      barangay: "Brgy. Kasambagan",
      level: 45,
      status: "Safe",
      color: "bg-green-500",
    },
    {
      barangay: "Brgy. Budlaan",
      level: 68,
      status: "Moderate",
      color: "bg-amber-500",
    },
    {
      barangay: "Brgy. Capitol",
      level: 38,
      status: "Safe",
      color: "bg-green-500",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-amber-100 text-amber-800";
      case "Resolved":
        return "bg-green-100 text-green-800";
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      case "High":
        return "bg-red-100 text-red-800";
      case "Critical":
        return "bg-red-200 text-red-900";
      case "Moderate":
        return "bg-amber-100 text-amber-800";
      case "Safe":
        return "bg-green-100 text-green-800";
      default:
        return "bg-neutral-100 text-neutral-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="space-y-6 lg:space-y-8">
          {/* Header Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-200/80 transition-all duration-200 hover:shadow-md">
            <div className="p-5 lg:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-neutral-900 tracking-tight">
                    Welcome back, {user?.fullName?.split(" ")[0]}! 👋
                  </h1>
                  <p className="text-neutral-600 mt-1 text-sm lg:text-base">
                    Here's what's happening with waste management today.
                  </p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2.5 bg-primary-muted rounded-xl flex-shrink-0">
                  <Clock className="h-4 w-4 text-primary" />
                  <span className="text-xs sm:text-sm font-medium text-primary whitespace-nowrap">
                    {new Date().toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="group bg-white rounded-2xl p-5 shadow-sm border border-neutral-200/80 transition-all duration-200 hover:shadow-md hover:border-neutral-300"
                >
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div
                      className={`w-11 h-11 ${stat.bgColor} rounded-xl flex items-center justify-center transition-transform group-hover:scale-105`}
                    >
                      <Icon className={`h-5 w-5 ${stat.color}`} />
                    </div>
                    <div
                      className={`flex items-center gap-1 text-xs font-semibold ${
                        stat.trend === "up" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {stat.trend === "up" ? (
                        <TrendingUp className="h-3.5 w-3.5" />
                      ) : (
                        <TrendingDown className="h-3.5 w-3.5" />
                      )}
                      <span className="hidden sm:inline">{stat.change}</span>
                    </div>
                  </div>
                  <h3 className="text-xl lg:text-2xl font-bold text-neutral-900">
                    {stat.value}
                  </h3>
                  <p className="text-sm text-neutral-600 mt-1 font-medium">
                    {stat.label}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Charts and Reports Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
            {/* Recent Reports */}
            <div className="bg-white rounded-2xl shadow-sm border border-neutral-200/80 overflow-hidden transition-all duration-200 hover:shadow-md">
              <div className="px-5 py-4 border-b border-neutral-200 bg-neutral-50/40">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-base lg:text-lg font-bold text-neutral-900">
                    Recent Reports
                  </h2>
                  <button className="text-xs font-semibold text-primary hover:text-primary-dark transition-colors">
                    View All
                  </button>
                </div>
              </div>
              <div className="divide-y divide-neutral-200">
                {recentReports.slice(0, 3).map((report) => (
                  <div
                    key={report.id}
                    className="px-5 py-4 hover:bg-neutral-50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-neutral-900">
                          {report.type}
                        </p>
                        <div className="flex items-center gap-1.5 mt-1.5">
                          <MapPin className="h-3.5 w-3.5 text-neutral-500 flex-shrink-0" />
                          <span className="text-xs text-neutral-600">
                            {report.location}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                        <span
                          className={`px-2.5 py-1 text-xs font-semibold rounded-full ${getStatusColor(report.status)}`}
                        >
                          {report.status}
                        </span>
                        <span className="text-xs text-neutral-500">
                          {report.time}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pollution Levels */}
            <div className="bg-white rounded-2xl shadow-sm border border-neutral-200/80 overflow-hidden transition-all duration-200 hover:shadow-md">
              <div className="px-5 py-4 border-b border-neutral-200 bg-neutral-50/40">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-base lg:text-lg font-bold text-neutral-900">
                    Pollution Levels
                  </h2>
                  <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-neutral-500" />
                </div>
              </div>
              <div className="px-5 py-4 space-y-4">
                {pollutionLevels.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm font-semibold text-neutral-900">
                        {item.barangay}
                      </span>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-sm font-bold text-neutral-900">
                          {item.level}%
                        </span>
                        <span
                          className={`px-2.5 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}
                        >
                          {item.status}
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-neutral-200 rounded-full h-2.5 overflow-hidden">
                      <div
                        className={`${item.color} h-2.5 rounded-full transition-all duration-500 ease-out`}
                        style={{ width: `${item.level}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-200/80 transition-all duration-200 hover:shadow-md">
            <div className="p-5 lg:p-6">
              <h2 className="text-base lg:text-lg font-bold text-neutral-900 mb-4">
                Quick Actions
              </h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <button className="group flex flex-col items-center justify-center gap-2 p-4 bg-primary-muted rounded-xl hover:bg-primary transition-all duration-200 text-primary hover:text-white">
                  <MapPin className="h-5 w-5 transition-transform group-hover:scale-110" />
                  <span className="text-xs sm:text-sm font-semibold">
                    View Heatmap
                  </span>
                </button>
                <button className="group flex flex-col items-center justify-center gap-2 p-4 bg-blue-50 rounded-xl hover:bg-blue-600 transition-all duration-200 text-blue-600 hover:text-white">
                  <Truck className="h-5 w-5 transition-transform group-hover:scale-110" />
                  <span className="text-xs sm:text-sm font-semibold">
                    Track Trucks
                  </span>
                </button>
                <button className="group flex flex-col items-center justify-center gap-2 p-4 bg-amber-50 rounded-xl hover:bg-amber-600 transition-all duration-200 text-amber-600 hover:text-white">
                  <AlertTriangle className="h-5 w-5 transition-transform group-hover:scale-110" />
                  <span className="text-xs sm:text-sm font-semibold">
                    View Alerts
                  </span>
                </button>
                <button className="group flex flex-col items-center justify-center gap-2 p-4 bg-green-50 rounded-xl hover:bg-green-600 transition-all duration-200 text-green-600 hover:text-white">
                  <BarChart3 className="h-5 w-5 transition-transform group-hover:scale-110" />
                  <span className="text-xs sm:text-sm font-semibold">
                    Analytics
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
