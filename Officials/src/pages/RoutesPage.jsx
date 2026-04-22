import React, { useState, useMemo } from "react";
import {
  Route,
  MapPin,
  Clock,
  Truck,
  ChevronRight,
  Search,
  Filter,
  Calendar,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  XCircle,
  Navigation,
  BarChart3,
  Download,
  Plus,
  Edit3,
  Trash2,
  Users,
  Gauge,
  ArrowRight,
  Map as MapIcon,
  Layers,
  Maximize2,
  Eye,
  EyeOff,
} from "lucide-react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
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

// Fix for default marker icon
import L from "leaflet";
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// Cebu City center
const CEBU_CENTER = [10.3157, 123.8854];

// Map fit component
function MapFit({ routes, selectedRoute }) {
  const map = useMap();
  React.useEffect(() => {
    if (selectedRoute) {
      const route = routes.find((r) => r.id === selectedRoute);
      if (route && route.coordinates) {
        const bounds = L.latLngBounds(route.coordinates);
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    } else if (routes.length > 0) {
      const allCoords = routes.flatMap((r) => r.coordinates || []);
      if (allCoords.length > 0) {
        map.fitBounds(L.latLngBounds(allCoords), { padding: [50, 50] });
      }
    }
  }, [routes, selectedRoute, map]);
  return null;
}

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

const RoutesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [viewMode, setViewMode] = useState("grid"); // grid, map, analytics
  const [showCompleted, setShowCompleted] = useState(true);
  const [mapLayer, setMapLayer] = useState("standard");
  const [expandedRoute, setExpandedRoute] = useState(null);

  // Enhanced routes data with coordinates
  const routes = [
    {
      id: "route-1",
      name: "Lahug Route",
      barangay: "Brgy. Lahug",
      stops: [
        {
          name: "Ayala Center",
          time: "7:00 AM",
          lat: 10.3175,
          lng: 123.905,
          collected: 450,
          target: 500,
        },
        {
          name: "SM City Cebu",
          time: "7:45 AM",
          lat: 10.311,
          lng: 123.918,
          collected: 380,
          target: 450,
        },
        {
          name: "IT Park",
          time: "8:30 AM",
          lat: 10.3275,
          lng: 123.907,
          collected: 520,
          target: 550,
        },
        {
          name: "Banilad",
          time: "9:15 AM",
          lat: 10.342,
          lng: 123.912,
          collected: 300,
          target: 400,
        },
        {
          name: "Lahug Proper",
          time: "10:00 AM",
          lat: 10.3328,
          lng: 123.901,
          collected: 480,
          target: 500,
        },
      ],
      distance: "12.5 km",
      duration: "4 hours",
      schedule: "7:00 AM - 11:00 AM",
      truck: "GT-101",
      driver: "Juan Dela Cruz",
      status: "Active",
      coverage: 85,
      efficiency: 92,
      totalWaste: 2130,
      targetWaste: 2400,
      color: "#22C55E",
      coordinates: [
        [10.3175, 123.905],
        [10.311, 123.918],
        [10.3275, 123.907],
        [10.342, 123.912],
        [10.3328, 123.901],
      ],
      performanceHistory: [
        { date: "Mon", efficiency: 88, waste: 2050 },
        { date: "Tue", efficiency: 91, waste: 2180 },
        { date: "Wed", efficiency: 85, waste: 1980 },
        { date: "Thu", efficiency: 92, waste: 2130 },
        { date: "Fri", efficiency: 89, waste: 2100 },
      ],
    },
    {
      id: "route-2",
      name: "Apas Route",
      barangay: "Brgy. Apas",
      stops: [
        {
          name: "Apas Market",
          time: "6:00 AM",
          lat: 10.305,
          lng: 123.892,
          collected: 420,
          target: 450,
        },
        {
          name: "Kasambagan",
          time: "6:45 AM",
          lat: 10.318,
          lng: 123.895,
          collected: 380,
          target: 400,
        },
        {
          name: "Pasil",
          time: "7:30 AM",
          lat: 10.295,
          lng: 123.88,
          collected: 450,
          target: 500,
        },
        {
          name: "Mambaling",
          time: "8:15 AM",
          lat: 10.288,
          lng: 123.875,
          collected: 350,
          target: 450,
        },
        {
          name: "Tisa",
          time: "9:00 AM",
          lat: 10.298,
          lng: 123.882,
          collected: 290,
          target: 400,
        },
      ],
      distance: "10.8 km",
      duration: "4 hours",
      schedule: "6:00 AM - 10:00 AM",
      truck: "GT-102",
      driver: "Pedro Penduko",
      status: "Active",
      coverage: 72,
      efficiency: 78,
      totalWaste: 1890,
      targetWaste: 2200,
      color: "#F59E0B",
      coordinates: [
        [10.305, 123.892],
        [10.318, 123.895],
        [10.295, 123.88],
        [10.288, 123.875],
        [10.298, 123.882],
      ],
      performanceHistory: [
        { date: "Mon", efficiency: 75, waste: 1750 },
        { date: "Tue", efficiency: 80, waste: 1920 },
        { date: "Wed", efficiency: 76, waste: 1800 },
        { date: "Thu", efficiency: 78, waste: 1890 },
        { date: "Fri", efficiency: 81, waste: 1950 },
      ],
    },
    {
      id: "route-3",
      name: "Guadalupe Route",
      barangay: "Brgy. Guadalupe",
      stops: [
        {
          name: "Guadalupe Church",
          time: "8:00 AM",
          lat: 10.3157,
          lng: 123.8854,
          collected: 480,
          target: 480,
        },
        {
          name: "Mabolo",
          time: "8:45 AM",
          lat: 10.32,
          lng: 123.88,
          collected: 520,
          target: 520,
        },
        {
          name: "Paknaan",
          time: "9:30 AM",
          lat: 10.325,
          lng: 123.875,
          collected: 460,
          target: 460,
        },
        {
          name: "Mandaue Border",
          time: "10:15 AM",
          lat: 10.33,
          lng: 123.87,
          collected: 490,
          target: 490,
        },
        {
          name: "Cabancalan",
          time: "11:00 AM",
          lat: 10.335,
          lng: 123.865,
          collected: 510,
          target: 510,
        },
      ],
      distance: "14.2 km",
      duration: "4.5 hours",
      schedule: "8:00 AM - 12:30 PM",
      truck: "GT-103",
      driver: "Maria Makiling",
      status: "Completed",
      coverage: 100,
      efficiency: 100,
      totalWaste: 2460,
      targetWaste: 2460,
      color: "#3B82F6",
      coordinates: [
        [10.3157, 123.8854],
        [10.32, 123.88],
        [10.325, 123.875],
        [10.33, 123.87],
        [10.335, 123.865],
      ],
      performanceHistory: [
        { date: "Mon", efficiency: 95, waste: 2350 },
        { date: "Tue", efficiency: 98, waste: 2410 },
        { date: "Wed", efficiency: 97, waste: 2390 },
        { date: "Thu", efficiency: 100, waste: 2460 },
        { date: "Fri", efficiency: 96, waste: 2380 },
      ],
    },
    {
      id: "route-4",
      name: "Capitol Route",
      barangay: "Brgy. Capitol",
      stops: [
        {
          name: "Capitol Site",
          time: "9:00 AM",
          lat: 10.315,
          lng: 123.89,
          collected: 0,
          target: 500,
        },
        {
          name: "Kamputhaw",
          time: "9:45 AM",
          lat: 10.31,
          lng: 123.895,
          collected: 0,
          target: 450,
        },
        {
          name: "San Nicolas",
          time: "10:30 AM",
          lat: 10.305,
          lng: 123.9,
          collected: 0,
          target: 400,
        },
        {
          name: "Ermita",
          time: "11:15 AM",
          lat: 10.3,
          lng: 123.905,
          collected: 0,
          target: 450,
        },
        {
          name: "Sambag",
          time: "12:00 PM",
          lat: 10.295,
          lng: 123.91,
          collected: 0,
          target: 500,
        },
      ],
      distance: "9.5 km",
      duration: "3.5 hours",
      schedule: "9:00 AM - 12:30 PM",
      truck: "GT-104",
      driver: "Jose Rizal",
      status: "Pending",
      coverage: 0,
      efficiency: 0,
      totalWaste: 0,
      targetWaste: 2300,
      color: "#9CA3AF",
      coordinates: [
        [10.315, 123.89],
        [10.31, 123.895],
        [10.305, 123.9],
        [10.3, 123.905],
        [10.295, 123.91],
      ],
      performanceHistory: [
        { date: "Mon", efficiency: 85, waste: 2100 },
        { date: "Tue", efficiency: 88, waste: 2180 },
        { date: "Wed", efficiency: 82, waste: 2050 },
        { date: "Thu", efficiency: 0, waste: 0 },
        { date: "Fri", efficiency: 0, waste: 0 },
      ],
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Completed":
        return "bg-blue-100 text-blue-800";
      case "Pending":
        return "bg-amber-100 text-amber-800";
      case "Delayed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-neutral-100 text-neutral-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Active":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "Completed":
        return <CheckCircle className="h-4 w-4 text-blue-600" />;
      case "Pending":
        return <Clock className="h-4 w-4 text-amber-600" />;
      case "Delayed":
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-neutral-600" />;
    }
  };

  // Filter routes
  const filteredRoutes = routes.filter((route) => {
    const matchesSearch =
      route.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      route.barangay.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || route.status === filterStatus;
    const matchesShow = showCompleted ? true : route.status !== "Completed";
    return matchesSearch && matchesStatus && matchesShow;
  });

  // Calculate statistics
  const stats = useMemo(() => {
    const active = routes.filter((r) => r.status === "Active").length;
    const completed = routes.filter((r) => r.status === "Completed").length;
    const pending = routes.filter((r) => r.status === "Pending").length;
    const avgEfficiency =
      routes.reduce((sum, r) => sum + r.efficiency, 0) / routes.length;
    const totalWaste = routes.reduce((sum, r) => sum + r.totalWaste, 0);
    const totalTarget = routes.reduce((sum, r) => sum + r.targetWaste, 0);

    return {
      total: routes.length,
      active,
      completed,
      pending,
      avgEfficiency: Math.round(avgEfficiency),
      totalWaste: totalWaste.toLocaleString(),
      totalTarget: totalTarget.toLocaleString(),
      completionRate: Math.round((completed / routes.length) * 100),
    };
  }, [routes]);

  // Chart data
  const efficiencyData = routes.map((r) => ({
    name: r.name.replace(" Route", ""),
    efficiency: r.efficiency,
    target: 85,
  }));

  const wasteData = routes.map((r) => ({
    name: r.name.replace(" Route", ""),
    collected: r.totalWaste,
    target: r.targetWaste,
  }));

  const mapTileUrl = {
    standard: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    satellite:
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  }[mapLayer];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">
              Barangay Routes
            </h1>
            <p className="text-neutral-600 mt-1">
              Collection routes and coverage management
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="flex bg-neutral-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  viewMode === "grid"
                    ? "bg-white text-primary shadow-sm"
                    : "text-neutral-600"
                }`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode("map")}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  viewMode === "map"
                    ? "bg-white text-primary shadow-sm"
                    : "text-neutral-600"
                }`}
              >
                Map
              </button>
              <button
                onClick={() => setViewMode("analytics")}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  viewMode === "analytics"
                    ? "bg-white text-primary shadow-sm"
                    : "text-neutral-600"
                }`}
              >
                Analytics
              </button>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors">
              <Plus className="h-5 w-5" />
              <span className="text-sm font-medium">New Route</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mt-6">
          <div className="bg-gradient-to-br from-neutral-50 to-neutral-100 rounded-xl p-4">
            <p className="text-xs text-neutral-600 mb-1">Total Routes</p>
            <p className="text-2xl font-bold text-neutral-900">{stats.total}</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4">
            <p className="text-xs text-green-700 mb-1">Active</p>
            <p className="text-2xl font-bold text-green-900">{stats.active}</p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
            <p className="text-xs text-blue-700 mb-1">Completed</p>
            <p className="text-2xl font-bold text-blue-900">
              {stats.completed}
            </p>
          </div>
          <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-4">
            <p className="text-xs text-amber-700 mb-1">Pending</p>
            <p className="text-2xl font-bold text-amber-900">{stats.pending}</p>
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
              placeholder="Search routes or barangays..."
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
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
            </select>
            <button
              onClick={() => setShowCompleted(!showCompleted)}
              className="flex items-center gap-2 px-4 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors"
            >
              {showCompleted ? (
                <Eye className="h-5 w-5" />
              ) : (
                <EyeOff className="h-5 w-5" />
              )}
              <span className="text-sm">
                {showCompleted ? "Hide" : "Show"} Completed
              </span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors">
              <Download className="h-5 w-5" />
              <span className="text-sm">Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 gap-6">
          {filteredRoutes.map((route) => (
            <div
              key={route.id}
              className="bg-white rounded-2xl shadow-sm border border-neutral-200 hover:shadow-md transition-all"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: route.color + "20" }}
                    >
                      <Route
                        className="h-7 w-7"
                        style={{ color: route.color }}
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-bold text-lg text-neutral-900">
                          {route.name}
                        </h3>
                        <span
                          className={`px-2.5 py-1 text-xs font-medium rounded-full ${getStatusColor(route.status)}`}
                        >
                          {route.status}
                        </span>
                      </div>
                      <p className="text-sm text-neutral-600">
                        {route.barangay}
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs text-neutral-500 flex items-center gap-1">
                          <Truck className="h-3 w-3" />
                          {route.truck}
                        </span>
                        <span className="text-xs text-neutral-500 flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {route.driver}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedRoute(route.id)}
                      className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                    >
                      <MapIcon className="h-5 w-5 text-neutral-600" />
                    </button>
                    <button className="p-2 hover:bg-neutral-100 rounded-lg transition-colors">
                      <Edit3 className="h-5 w-5 text-neutral-600" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="bg-neutral-50 rounded-lg p-3">
                    <p className="text-xs text-neutral-600 mb-1">Distance</p>
                    <p className="text-lg font-semibold text-neutral-900">
                      {route.distance}
                    </p>
                  </div>
                  <div className="bg-neutral-50 rounded-lg p-3">
                    <p className="text-xs text-neutral-600 mb-1">Duration</p>
                    <p className="text-lg font-semibold text-neutral-900">
                      {route.duration}
                    </p>
                  </div>
                  <div className="bg-neutral-50 rounded-lg p-3">
                    <p className="text-xs text-neutral-600 mb-1">
                      Waste Collected
                    </p>
                    <p className="text-lg font-semibold text-neutral-900">
                      {route.totalWaste.toLocaleString()} /{" "}
                      {route.targetWaste.toLocaleString()} kg
                    </p>
                  </div>
                  <div className="bg-neutral-50 rounded-lg p-3">
                    <p className="text-xs text-neutral-600 mb-1">Efficiency</p>
                    <div className="flex items-center gap-2">
                      <p className="text-lg font-semibold text-neutral-900">
                        {route.efficiency}%
                      </p>
                      {route.efficiency >= 90 ? (
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      ) : route.efficiency >= 70 ? (
                        <TrendingUp className="h-4 w-4 text-amber-600" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-neutral-700">
                      Route Progress
                    </span>
                    <span
                      className="text-sm font-bold"
                      style={{ color: route.color }}
                    >
                      {route.coverage}%
                    </span>
                  </div>
                  <div className="w-full bg-neutral-200 rounded-full h-2.5">
                    <div
                      className="h-2.5 rounded-full transition-all"
                      style={{
                        width: `${route.coverage}%`,
                        backgroundColor: route.color,
                      }}
                    />
                  </div>
                </div>

                <button
                  onClick={() =>
                    setExpandedRoute(
                      expandedRoute === route.id ? null : route.id,
                    )
                  }
                  className="w-full text-left"
                >
                  <div className="flex items-center justify-between text-sm text-primary hover:text-primary-dark">
                    <span className="font-medium">
                      {expandedRoute === route.id ? "Hide" : "Show"} Stops (
                      {route.stops.length})
                    </span>
                    <ChevronRight
                      className={`h-4 w-4 transition-transform ${expandedRoute === route.id ? "rotate-90" : ""}`}
                    />
                  </div>
                </button>

                {expandedRoute === route.id && (
                  <div className="mt-4 pt-4 border-t border-neutral-200">
                    <div className="space-y-3">
                      {route.stops.map((stop, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white text-sm font-bold"
                            style={{ backgroundColor: route.color }}
                          >
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium text-neutral-900">
                                {stop.name}
                              </span>
                              <span className="text-xs text-neutral-500">
                                {stop.time}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-neutral-600">
                                Collected: {stop.collected} / {stop.target} kg
                              </span>
                              <span
                                className="font-medium"
                                style={{ color: route.color }}
                              >
                                {Math.round(
                                  (stop.collected / stop.target) * 100,
                                )}
                                %
                              </span>
                            </div>
                            <div className="w-full bg-neutral-200 rounded-full h-1.5 mt-1">
                              <div
                                className="h-1.5 rounded-full transition-all"
                                style={{
                                  width: `${(stop.collected / stop.target) * 100}%`,
                                  backgroundColor: route.color,
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {viewMode === "map" && (
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
          <div className="p-4 border-b border-neutral-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapIcon className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-bold text-neutral-900">
                Route Map - Cebu City
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={selectedRoute || ""}
                onChange={(e) => setSelectedRoute(e.target.value || null)}
                className="px-3 py-1.5 border border-neutral-300 rounded-lg text-sm"
              >
                <option value="">All Routes</option>
                {routes.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
              <select
                value={mapLayer}
                onChange={(e) => setMapLayer(e.target.value)}
                className="px-3 py-1.5 border border-neutral-300 rounded-lg text-sm"
              >
                <option value="standard">Standard</option>
                <option value="satellite">Satellite</option>
              </select>
              <button className="p-2 hover:bg-neutral-100 rounded-lg transition-colors">
                <Layers className="h-5 w-5" />
              </button>
              <button className="p-2 hover:bg-neutral-100 rounded-lg transition-colors">
                <Maximize2 className="h-5 w-5" />
              </button>
            </div>
          </div>
          <div style={{ height: "600px" }}>
            <MapContainer
              center={CEBU_CENTER}
              zoom={13}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url={mapTileUrl}
              />
              <MapFit routes={routes} selectedRoute={selectedRoute} />

              {routes
                .filter((r) => !selectedRoute || r.id === selectedRoute)
                .map((route) => (
                  <React.Fragment key={route.id}>
                    <Polyline
                      positions={route.coordinates}
                      color={route.color}
                      weight={4}
                      opacity={0.7}
                    />
                    {route.stops.map((stop, idx) => (
                      <Marker key={idx} position={[stop.lat, stop.lng]}>
                        <Popup>
                          <div className="text-sm min-w-[200px]">
                            <h3 className="font-bold text-neutral-900 mb-1">
                              {stop.name}
                            </h3>
                            <p className="text-xs text-neutral-600 mb-2">
                              {route.name}
                            </p>
                            <div className="space-y-1">
                              <p className="text-sm">
                                <span className="font-medium">Time:</span>{" "}
                                {stop.time}
                              </p>
                              <p className="text-sm">
                                <span className="font-medium">Collected:</span>{" "}
                                {stop.collected} / {stop.target} kg
                              </p>
                              <div className="w-full bg-neutral-200 rounded-full h-2 mt-1">
                                <div
                                  className="h-2 rounded-full"
                                  style={{
                                    width: `${(stop.collected / stop.target) * 100}%`,
                                    backgroundColor: route.color,
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </Popup>
                      </Marker>
                    ))}
                  </React.Fragment>
                ))}
            </MapContainer>
          </div>
        </div>
      )}

      {viewMode === "analytics" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
              <h3 className="font-bold text-neutral-900 mb-4">
                Route Efficiency
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={efficiencyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} domain={[0, 100]} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar
                    dataKey="efficiency"
                    fill="#22C55E"
                    name="Current Efficiency"
                    unit="%"
                  />
                  <Bar
                    dataKey="target"
                    fill="#94A3B8"
                    name="Target (85%)"
                    unit="%"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
              <h3 className="font-bold text-neutral-900 mb-4">
                Waste Collection
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={wasteData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar
                    dataKey="collected"
                    fill="#3B82F6"
                    name="Collected"
                    unit="kg"
                  />
                  <Bar
                    dataKey="target"
                    fill="#F59E0B"
                    name="Target"
                    unit="kg"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
            <h3 className="font-bold text-neutral-900 mb-4">
              Performance Trends
            </h3>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                {routes
                  .filter(
                    (r) => r.status === "Active" || r.status === "Completed",
                  )
                  .map((route, idx) => (
                    <Line
                      key={route.id}
                      type="monotone"
                      data={route.performanceHistory}
                      dataKey="efficiency"
                      stroke={route.color}
                      name={route.name}
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      unit="%"
                    />
                  ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoutesPage;
