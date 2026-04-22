import React, { useState, useMemo } from "react";
import {
  Calendar,
  Clock,
  Truck,
  MapPin,
  Plus,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Download,
  Edit3,
  Trash2,
  CheckCircle,
  AlertCircle,
  XCircle,
  Users,
  Gauge,
  Navigation,
  Calendar as CalendarIcon,
  List,
  Grid,
  BarChart3,
  TrendingUp,
  Clock4,
  Repeat,
  Bell,
  MoreVertical,
  Eye,
  Copy,
  History,
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
  AreaChart,
  Area,
} from "recharts";

// Custom Tooltip
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-lg border border-neutral-200">
        <p className="font-medium text-neutral-900 mb-2">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }} className="text-sm">
            {entry.name}: {entry.value} {entry.unit || ""}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Mini Calendar Component
const MiniCalendar = ({ currentDate, onDateSelect, schedules }) => {
  const [viewDate, setViewDate] = useState(new Date());

  const daysInMonth = new Date(
    viewDate.getFullYear(),
    viewDate.getMonth() + 1,
    0,
  ).getDate();
  const firstDayOfMonth = new Date(
    viewDate.getFullYear(),
    viewDate.getMonth(),
    1,
  ).getDay();

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const getSchedulesForDate = (date) => {
    const dateStr = `${viewDate.getFullYear()}-${String(viewDate.getMonth() + 1).padStart(2, "0")}-${String(date).padStart(2, "0")}`;
    return schedules.filter((s) => s.date === dateStr);
  };

  const changeMonth = (delta) => {
    setViewDate(
      new Date(viewDate.getFullYear(), viewDate.getMonth() + delta, 1),
    );
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-neutral-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-neutral-900">
          {monthNames[viewDate.getMonth()]} {viewDate.getFullYear()}
        </h3>
        <div className="flex gap-1">
          <button
            onClick={() => changeMonth(-1)}
            className="p-1 hover:bg-neutral-100 rounded"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => changeMonth(1)}
            className="p-1 hover:bg-neutral-100 rounded"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-medium text-neutral-500"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
          <div key={`empty-${i}`} className="h-8" />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const date = i + 1;
          const dateSchedules = getSchedulesForDate(date);
          const hasSchedule = dateSchedules.length > 0;
          const isToday =
            new Date().toDateString() ===
            new Date(
              viewDate.getFullYear(),
              viewDate.getMonth(),
              date,
            ).toDateString();

          return (
            <button
              key={date}
              onClick={() => {
                const selectedDate = `${viewDate.getFullYear()}-${String(viewDate.getMonth() + 1).padStart(2, "0")}-${String(date).padStart(2, "0")}`;
                onDateSelect(selectedDate);
              }}
              className={`h-8 rounded-lg text-sm font-medium transition-colors relative
                ${
                  isToday
                    ? "bg-primary text-white"
                    : hasSchedule
                      ? "bg-primary-muted text-primary hover:bg-primary-light hover:text-white"
                      : "hover:bg-neutral-100 text-neutral-700"
                }`}
            >
              {date}
              {hasSchedule && !isToday && (
                <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

const SchedulesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterRoute, setFilterRoute] = useState("all");
  const [viewMode, setViewMode] = useState("list"); // list, calendar, analytics
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [showRecurringModal, setShowRecurringModal] = useState(false);

  // Enhanced schedules data
  const schedules = [
    {
      id: 1,
      date: "2026-03-24",
      day: "Monday",
      time: "7:00 AM - 11:00 AM",
      route: "Lahug Route",
      routeDetails:
        "Ayala Center → SM City Cebu → IT Park → Banilad → Lahug Proper",
      barangay: "Brgy. Lahug",
      truck: "GT-101",
      driver: "Juan Dela Cruz",
      driverContact: "+63 912 345 6789",
      status: "Completed",
      recurring: "Weekly",
      wasteCollected: 2130,
      targetWaste: 2400,
      efficiency: 92,
      startTime: "7:00 AM",
      endTime: "11:00 AM",
      stops: 5,
      completedStops: 5,
      notes: "All stops completed on time",
    },
    {
      id: 2,
      date: "2026-03-24",
      day: "Monday",
      time: "8:00 AM - 12:00 PM",
      route: "Apas Route",
      routeDetails: "Apas Market → Kasambagan → Pasil → Mambaling → Tisa",
      barangay: "Brgy. Apas",
      truck: "GT-102",
      driver: "Pedro Santos",
      driverContact: "+63 923 456 7890",
      status: "In Progress",
      recurring: "Weekly",
      wasteCollected: 1200,
      targetWaste: 2200,
      efficiency: 78,
      startTime: "8:00 AM",
      endTime: "12:00 PM",
      stops: 5,
      completedStops: 3,
      notes: "Running 15 minutes behind schedule",
    },
    {
      id: 3,
      date: "2026-03-25",
      day: "Tuesday",
      time: "6:00 AM - 10:00 AM",
      route: "Budlaan Route",
      routeDetails:
        "Budlaan → Guadalupe Church → Mabolo → Paknaan → Mandaue Border",
      barangay: "Brgy. Budlaan",
      truck: "GT-103",
      driver: "Maria Garcia",
      driverContact: "+63 934 567 8901",
      status: "Scheduled",
      recurring: "Weekly",
      wasteCollected: 0,
      targetWaste: 2100,
      efficiency: 0,
      startTime: "6:00 AM",
      endTime: "10:00 AM",
      stops: 5,
      completedStops: 0,
      notes: "Driver confirmed",
    },
    {
      id: 4,
      date: "2026-03-25",
      day: "Tuesday",
      time: "9:00 AM - 1:00 PM",
      route: "Capitol Route",
      routeDetails: "Capitol Site → Kamputhaw → San Nicolas → Ermita → Sambag",
      barangay: "Brgy. Capitol",
      truck: "GT-104",
      driver: "Carlos Reyes",
      driverContact: "+63 945 678 9012",
      status: "Scheduled",
      recurring: "Daily",
      wasteCollected: 0,
      targetWaste: 2300,
      efficiency: 0,
      startTime: "9:00 AM",
      endTime: "1:00 PM",
      stops: 5,
      completedStops: 0,
      notes: "Truck maintenance scheduled after route",
    },
    {
      id: 5,
      date: "2026-03-26",
      day: "Wednesday",
      time: "7:00 AM - 11:00 AM",
      route: "Lahug Route",
      routeDetails:
        "IT Park → Banilad → Lahug Proper → Ayala Center → SM City Cebu",
      barangay: "Brgy. Lahug",
      truck: "GT-101",
      driver: "Juan Dela Cruz",
      driverContact: "+63 912 345 6789",
      status: "Scheduled",
      recurring: "Weekly",
      wasteCollected: 0,
      targetWaste: 2400,
      efficiency: 0,
      startTime: "7:00 AM",
      endTime: "11:00 AM",
      stops: 5,
      completedStops: 0,
      notes: "",
    },
    {
      id: 6,
      date: "2026-03-26",
      day: "Wednesday",
      time: "1:00 PM - 5:00 PM",
      route: "Guadalupe Route",
      routeDetails:
        "Guadalupe Church → Mabolo → Paknaan → Mandaue Border → Cabancalan",
      barangay: "Brgy. Guadalupe",
      truck: "GT-105",
      driver: "Ana Rivera",
      driverContact: "+63 956 789 0123",
      status: "Scheduled",
      recurring: "Weekly",
      wasteCollected: 0,
      targetWaste: 2000,
      efficiency: 0,
      startTime: "1:00 PM",
      endTime: "5:00 PM",
      stops: 5,
      completedStops: 0,
      notes: "Afternoon route",
    },
    {
      id: 7,
      date: "2026-03-23",
      day: "Sunday",
      time: "7:00 AM - 11:00 AM",
      route: "Lahug Route",
      routeDetails:
        "Ayala Center → SM City Cebu → IT Park → Banilad → Lahug Proper",
      barangay: "Brgy. Lahug",
      truck: "GT-101",
      driver: "Juan Dela Cruz",
      driverContact: "+63 912 345 6789",
      status: "Completed",
      recurring: "Weekly",
      wasteCollected: 2250,
      targetWaste: 2400,
      efficiency: 94,
      startTime: "7:00 AM",
      endTime: "11:00 AM",
      stops: 5,
      completedStops: 5,
      notes: "Exceeded target at IT Park",
    },
    {
      id: 8,
      date: "2026-03-27",
      day: "Thursday",
      time: "8:00 AM - 12:00 PM",
      route: "Apas Route",
      routeDetails: "Apas Market → Kasambagan → Pasil → Mambaling → Tisa",
      barangay: "Brgy. Apas",
      truck: "GT-102",
      driver: "Pedro Santos",
      driverContact: "+63 923 456 7890",
      status: "Scheduled",
      recurring: "Weekly",
      wasteCollected: 0,
      targetWaste: 2200,
      efficiency: 0,
      startTime: "8:00 AM",
      endTime: "12:00 PM",
      stops: 5,
      completedStops: 0,
      notes: "",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800";
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      case "Scheduled":
        return "bg-amber-100 text-amber-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      case "Delayed":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-neutral-100 text-neutral-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Completed":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "In Progress":
        return <Clock className="h-5 w-5 text-blue-600" />;
      case "Scheduled":
        return <Calendar className="h-5 w-5 text-amber-600" />;
      case "Cancelled":
        return <XCircle className="h-5 w-5 text-red-600" />;
      case "Delayed":
        return <AlertCircle className="h-5 w-5 text-orange-600" />;
      default:
        return <AlertCircle className="h-5 w-5 text-neutral-600" />;
    }
  };

  // Filter schedules
  const filteredSchedules = schedules.filter((schedule) => {
    const matchesSearch =
      schedule.route.toLowerCase().includes(searchTerm.toLowerCase()) ||
      schedule.barangay.toLowerCase().includes(searchTerm.toLowerCase()) ||
      schedule.driver.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || schedule.status === filterStatus;
    const matchesRoute =
      filterRoute === "all" || schedule.route === filterRoute;
    const matchesDate = !selectedDate || schedule.date === selectedDate;
    return matchesSearch && matchesStatus && matchesRoute && matchesDate;
  });

  // Group schedules by date
  const groupedSchedules = useMemo(() => {
    const groups = {};
    filteredSchedules.forEach((schedule) => {
      if (!groups[schedule.date]) {
        groups[schedule.date] = [];
      }
      groups[schedule.date].push(schedule);
    });
    return Object.entries(groups).sort((a, b) => a[0].localeCompare(b[0]));
  }, [filteredSchedules]);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = schedules.length;
    const completed = schedules.filter((s) => s.status === "Completed").length;
    const inProgress = schedules.filter(
      (s) => s.status === "In Progress",
    ).length;
    const scheduled = schedules.filter((s) => s.status === "Scheduled").length;
    const avgEfficiency = schedules
      .filter((s) => s.efficiency > 0)
      .reduce((sum, s, _, arr) => sum + s.efficiency / arr.length, 0);
    const totalWaste = schedules.reduce((sum, s) => sum + s.wasteCollected, 0);

    return {
      total,
      completed,
      inProgress,
      scheduled,
      avgEfficiency: Math.round(avgEfficiency) || 0,
      totalWaste: totalWaste.toLocaleString(),
      completionRate:
        Math.round((completed / (completed + inProgress + scheduled)) * 100) ||
        0,
    };
  }, [schedules]);

  // Chart data
  const statusData = [
    { name: "Completed", value: stats.completed, color: "#22C55E" },
    { name: "In Progress", value: stats.inProgress, color: "#3B82F6" },
    { name: "Scheduled", value: stats.scheduled, color: "#F59E0B" },
  ];

  const routePerformanceData = useMemo(() => {
    const routes = {};
    schedules
      .filter((s) => s.efficiency > 0)
      .forEach((s) => {
        if (!routes[s.route]) {
          routes[s.route] = { total: 0, count: 0 };
        }
        routes[s.route].total += s.efficiency;
        routes[s.route].count++;
      });
    return Object.entries(routes).map(([name, data]) => ({
      name: name.replace(" Route", ""),
      efficiency: Math.round(data.total / data.count),
    }));
  }, [schedules]);

  const weeklyData = [
    { day: "Mon", scheduled: 3, completed: 2 },
    { day: "Tue", scheduled: 2, completed: 0 },
    { day: "Wed", scheduled: 2, completed: 0 },
    { day: "Thu", scheduled: 2, completed: 0 },
    { day: "Fri", scheduled: 0, completed: 0 },
    { day: "Sat", scheduled: 0, completed: 0 },
    { day: "Sun", scheduled: 1, completed: 1 },
  ];

  const uniqueRoutes = [...new Set(schedules.map((s) => s.route))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">
              Collection Schedules
            </h1>
            <p className="text-neutral-600 mt-1">
              Manage and monitor collection schedules
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="flex bg-neutral-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode("list")}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1 ${
                  viewMode === "list"
                    ? "bg-white text-primary shadow-sm"
                    : "text-neutral-600"
                }`}
              >
                <List className="h-4 w-4" />
                List
              </button>
              <button
                onClick={() => setViewMode("calendar")}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1 ${
                  viewMode === "calendar"
                    ? "bg-white text-primary shadow-sm"
                    : "text-neutral-600"
                }`}
              >
                <CalendarIcon className="h-4 w-4" />
                Calendar
              </button>
              <button
                onClick={() => setViewMode("analytics")}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1 ${
                  viewMode === "analytics"
                    ? "bg-white text-primary shadow-sm"
                    : "text-neutral-600"
                }`}
              >
                <BarChart3 className="h-4 w-4" />
                Analytics
              </button>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors">
              <Plus className="h-5 w-5" />
              <span className="text-sm font-medium">New Schedule</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mt-6">
          <div className="bg-gradient-to-br from-neutral-50 to-neutral-100 rounded-xl p-4">
            <p className="text-xs text-neutral-600 mb-1">Total Schedules</p>
            <p className="text-2xl font-bold text-neutral-900">{stats.total}</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4">
            <p className="text-xs text-green-700 mb-1">Completed</p>
            <p className="text-2xl font-bold text-green-900">
              {stats.completed}
            </p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
            <p className="text-xs text-blue-700 mb-1">In Progress</p>
            <p className="text-2xl font-bold text-blue-900">
              {stats.inProgress}
            </p>
          </div>
          <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-4">
            <p className="text-xs text-amber-700 mb-1">Scheduled</p>
            <p className="text-2xl font-bold text-amber-900">
              {stats.scheduled}
            </p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4">
            <p className="text-xs text-purple-700 mb-1">Avg Efficiency</p>
            <p className="text-2xl font-bold text-purple-900">
              {stats.avgEfficiency}%
            </p>
          </div>
          <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-xl p-4">
            <p className="text-xs text-cyan-700 mb-1">Waste Collected</p>
            <p className="text-2xl font-bold text-cyan-900">
              {stats.totalWaste}kg
            </p>
          </div>
          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-4">
            <p className="text-xs text-indigo-700 mb-1">Completion Rate</p>
            <p className="text-2xl font-bold text-indigo-900">
              {stats.completionRate}%
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-neutral-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-500" />
            <input
              type="text"
              placeholder="Search routes, barangays, or drivers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
            >
              <option value="all">All Status</option>
              <option value="Scheduled">Scheduled</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <select
              value={filterRoute}
              onChange={(e) => setFilterRoute(e.target.value)}
              className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
            >
              <option value="all">All Routes</option>
              {uniqueRoutes.map((route) => (
                <option key={route} value={route}>
                  {route}
                </option>
              ))}
            </select>
            {selectedDate && (
              <button
                onClick={() => setSelectedDate(null)}
                className="px-4 py-2 bg-primary-muted text-primary rounded-lg text-sm font-medium"
              >
                Clear Date Filter
              </button>
            )}
            <button className="flex items-center gap-2 px-4 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors">
              <Download className="h-5 w-5" />
              <span className="text-sm">Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {viewMode === "list" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {groupedSchedules.map(([date, dateSchedules]) => (
              <div
                key={date}
                className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden"
              >
                <div className="px-6 py-4 bg-neutral-50 border-b border-neutral-200">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    <h3 className="font-bold text-neutral-900">
                      {new Date(date).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </h3>
                    <span className="text-sm text-neutral-600 ml-2">
                      {dateSchedules.length} schedule
                      {dateSchedules.length > 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
                <div className="divide-y divide-neutral-200">
                  {dateSchedules.map((schedule) => (
                    <div
                      key={schedule.id}
                      className="p-6 hover:bg-neutral-50 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="w-12 h-12 bg-primary-muted rounded-xl flex items-center justify-center flex-shrink-0">
                            <Clock className="h-6 w-6 text-primary" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-bold text-neutral-900">
                                {schedule.route}
                              </h4>
                              <span
                                className={`px-2.5 py-1 text-xs font-medium rounded-full ${getStatusColor(schedule.status)}`}
                              >
                                {schedule.status}
                              </span>
                              {schedule.recurring && (
                                <span className="flex items-center gap-1 text-xs text-neutral-500">
                                  <Repeat className="h-3 w-3" />
                                  {schedule.recurring}
                                </span>
                              )}
                            </div>

                            <div className="grid grid-cols-2 gap-3 mb-3">
                              <div className="flex items-center gap-2 text-sm text-neutral-700">
                                <Clock className="h-4 w-4 text-primary" />
                                <span>{schedule.time}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-neutral-700">
                                <MapPin className="h-4 w-4 text-primary" />
                                <span>{schedule.barangay}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-neutral-700">
                                <Truck className="h-4 w-4 text-primary" />
                                <span>{schedule.truck}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-neutral-700">
                                <Users className="h-4 w-4 text-primary" />
                                <span>{schedule.driver}</span>
                              </div>
                            </div>

                            {schedule.status !== "Scheduled" && (
                              <div className="mb-3">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-xs text-neutral-600">
                                    Progress
                                  </span>
                                  <span className="text-xs font-medium">
                                    {schedule.completedStops}/{schedule.stops}{" "}
                                    stops
                                  </span>
                                </div>
                                <div className="w-full bg-neutral-200 rounded-full h-2">
                                  <div
                                    className={`h-2 rounded-full transition-all ${
                                      schedule.status === "Completed"
                                        ? "bg-green-500"
                                        : "bg-blue-500"
                                    }`}
                                    style={{
                                      width: `${(schedule.completedStops / schedule.stops) * 100}%`,
                                    }}
                                  />
                                </div>
                              </div>
                            )}

                            {schedule.notes && (
                              <p className="text-xs text-neutral-500 mt-2 flex items-start gap-1">
                                <AlertCircle className="h-3 w-3 flex-shrink-0 mt-0.5" />
                                {schedule.notes}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <button className="p-2 hover:bg-neutral-100 rounded-lg transition-colors">
                            <Eye className="h-4 w-4 text-neutral-600" />
                          </button>
                          <button className="p-2 hover:bg-neutral-100 rounded-lg transition-colors">
                            <Edit3 className="h-4 w-4 text-neutral-600" />
                          </button>
                          <button className="p-2 hover:bg-neutral-100 rounded-lg transition-colors">
                            <MoreVertical className="h-4 w-4 text-neutral-600" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-6">
            <MiniCalendar
              currentDate={new Date()}
              onDateSelect={setSelectedDate}
              schedules={schedules}
            />

            <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
              <h3 className="font-bold text-neutral-900 mb-4">
                Today's Summary
              </h3>
              <div className="space-y-3">
                {schedules
                  .filter((s) => s.date === "2026-03-24")
                  .map((s) => (
                    <div
                      key={s.id}
                      className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-neutral-900">
                          {s.route}
                        </p>
                        <p className="text-xs text-neutral-600">{s.time}</p>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(s.status)}`}
                      >
                        {s.status}
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-primary-muted to-primary-light/20 rounded-xl p-6 shadow-sm border border-primary-light">
              <h3 className="font-bold text-neutral-900 mb-3 flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                Upcoming Reminders
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Clock4 className="h-4 w-4 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-neutral-900">
                      Lahug Route
                    </p>
                    <p className="text-xs text-neutral-600">
                      Starts in 2 hours (7:00 AM)
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Truck className="h-4 w-4 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-neutral-900">
                      GT-104 Maintenance
                    </p>
                    <p className="text-xs text-neutral-600">
                      Scheduled for tomorrow
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {viewMode === "calendar" && (
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-neutral-900">March 2026</h2>
            <div className="flex gap-2">
              <button className="p-2 hover:bg-neutral-100 rounded-lg">
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium">
                Today
              </button>
              <button className="p-2 hover:bg-neutral-100 rounded-lg">
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="text-center text-sm font-medium text-neutral-600 py-2"
              >
                {day}
              </div>
            ))}

            {/* Calendar grid would go here - simplified for brevity */}
            <div className="col-span-7 text-center py-12 text-neutral-500">
              Full calendar view with drag-and-drop scheduling
              <p className="text-sm mt-2">
                Integrate with FullCalendar or React Big Calendar
              </p>
            </div>
          </div>
        </div>
      )}

      {viewMode === "analytics" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
              <h3 className="font-bold text-neutral-900 mb-4">
                Schedule Status Distribution
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
              <h3 className="font-bold text-neutral-900 mb-4">
                Route Performance
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={routePerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} domain={[0, 100]} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="efficiency"
                    fill="#22C55E"
                    name="Efficiency"
                    unit="%"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
            <h3 className="font-bold text-neutral-900 mb-4">
              Weekly Schedule Overview
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar
                  dataKey="scheduled"
                  fill="#F59E0B"
                  name="Scheduled"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="completed"
                  fill="#22C55E"
                  name="Completed"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
            <h3 className="font-bold text-neutral-900 mb-4">
              Efficiency Trends
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart
                data={schedules.filter((s) => s.efficiency > 0).slice(0, 5)}
              >
                <defs>
                  <linearGradient
                    id="efficiencyGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#22C55E" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} domain={[0, 100]} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="efficiency"
                  stroke="#22C55E"
                  strokeWidth={2}
                  fill="url(#efficiencyGradient)"
                  name="Efficiency"
                  unit="%"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchedulesPage;
