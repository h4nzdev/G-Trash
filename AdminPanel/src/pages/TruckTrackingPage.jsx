import React, { useState, useEffect, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import {
  Truck,
  Map,
  TrendingUp,
  TrendingDown,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  ChevronRight,
  Activity,
  Gauge,
  Clock,
  MapPin,
  Users,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  Layers,
  Maximize2,
  BarChart3,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
  RadialBarChart,
  RadialBar,
} from "recharts";
import { truckData, MAP_CENTER, MAP_ZOOM } from "../data/mapData";

// Custom truck icons
const createTruckIcon = (status, progress) => {
  const color =
    status === "Active"
      ? "#10b981"
      : status === "Completed"
        ? "#3b82f6"
        : "#f59e0b";
  return L.divIcon({
    className: "custom-truck-marker",
    html: `<div style="
      background-color: ${color};
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 3px solid white;
      box-shadow: 0 4px 12px rgba(0,0,0,0.25);
      position: relative;
    ">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 17h4V5H2v12h3"/><path d="M20 17h2v-3.34a4 4 0 0 0-1.17-2.83L19 9h-5"/><path d="M14 17h1"/><circle cx="7.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>
      <div style="
        position: absolute;
        bottom: -2px;
        right: -2px;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background-color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 8px;
        font-weight: bold;
        color: ${color};
        border: 1px solid ${color};
      ">${progress}%</div>
    </div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20],
  });
};

// Custom Tooltip for Recharts
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

// Map Controller Component
const MapController = ({ center, zoom }) => {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);

  return null;
};

const TruckTrackingPage = () => {
  const [filterStatus, setFilterStatus] = useState("all");
  const [mapReady, setMapReady] = useState(false);
  const [selectedTruck, setSelectedTruck] = useState(null);
  const [showAllTrucks, setShowAllTrucks] = useState(true);
  const [mapLayer, setMapLayer] = useState("standard");
  const [chartView, setChartView] = useState("efficiency");
  const [expandedTruck, setExpandedTruck] = useState(null);

  useEffect(() => {
    setMapReady(true);
  }, []);

  const stats = {
    total: truckData.length,
    active: truckData.filter((t) => t.status === "Active").length,
    completed: truckData.filter((t) => t.status === "Completed").length,
    maintenance: truckData.filter((t) => t.status === "Maintenance").length,
    totalCollected: truckData.reduce((sum, t) => sum + t.trashCollected, 0),
    avgEfficiency: Math.round(
      truckData.reduce((sum, t) => sum + (t.efficiency || 85), 0) /
        truckData.length,
    ),
    onTimeRate: 88,
    totalDistance: 245,
  };

  const filteredTrucks =
    filterStatus === "all"
      ? truckData
      : truckData.filter((t) => t.status === filterStatus);

  const displayTrucks = selectedTruck
    ? filteredTrucks.filter((t) => t.id === selectedTruck)
    : showAllTrucks
      ? filteredTrucks
      : [];

  // Chart Data
  const efficiencyData = useMemo(() => {
    return truckData.map((t) => ({
      name: t.id,
      efficiency: t.efficiency || Math.floor(Math.random() * 20 + 75),
      collected: t.trashCollected,
      color:
        t.status === "Active"
          ? "#10b981"
          : t.status === "Completed"
            ? "#3b82f6"
            : "#f59e0b",
    }));
  }, []);

  const statusDistribution = useMemo(() => {
    return [
      { name: "Active", value: stats.active, color: "#10b981" },
      { name: "Completed", value: stats.completed, color: "#3b82f6" },
      { name: "Maintenance", value: stats.maintenance, color: "#f59e0b" },
    ].filter((d) => d.value > 0);
  }, [stats]);

  const collectionTrend = useMemo(() => {
    return [
      { time: "6AM", collected: 450, target: 500 },
      { time: "8AM", collected: 1200, target: 1000 },
      { time: "10AM", collected: 2100, target: 1800 },
      { time: "12PM", collected: 3200, target: 2800 },
      { time: "2PM", collected: 4100, target: 3800 },
      { time: "4PM", collected: 4800, target: 4500 },
      { time: "6PM", collected: 5200, target: 5000 },
    ];
  }, []);

  const routeData = useMemo(() => {
    return [
      { name: "Lahug Route", distance: 12.5, stops: 8, efficiency: 92 },
      { name: "Apas Route", distance: 10.8, stops: 6, efficiency: 85 },
      { name: "Kasambagan", distance: 14.2, stops: 7, efficiency: 88 },
      { name: "Budlaan Route", distance: 9.5, stops: 5, efficiency: 90 },
      { name: "Capitol Route", distance: 11.2, stops: 6, efficiency: 87 },
    ];
  }, []);

  const mapTileUrl = {
    standard: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    satellite:
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    dark: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
  }[mapLayer];

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Completed":
        return "bg-blue-100 text-blue-800";
      case "Maintenance":
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-neutral-100 text-neutral-800";
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "Active":
        return "#10b981";
      case "Completed":
        return "#3b82f6";
      case "Maintenance":
        return "#f59e0b";
      default:
        return "#6b7280";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Active":
        return <Activity className="h-4 w-4 text-green-600" />;
      case "Completed":
        return <CheckCircle className="h-4 w-4 text-blue-600" />;
      case "Maintenance":
        return <AlertCircle className="h-4 w-4 text-amber-600" />;
      default:
        return <Truck className="h-4 w-4 text-neutral-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-neutral-900">
              Truck Tracking
            </h1>
            <p className="text-neutral-600 mt-1 text-sm">
              Track garbage trucks deployed and monitor their status
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setSelectedTruck(null);
              }}
              className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm"
            >
              <option value="all">All Status</option>
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
              <option value="Maintenance">Maintenance</option>
            </select>
            <select
              value={selectedTruck || ""}
              onChange={(e) => setSelectedTruck(e.target.value || null)}
              className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm"
            >
              <option value="">All Trucks</option>
              {filteredTrucks.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.id} - {t.driver}
                </option>
              ))}
            </select>
            <button className="p-2 hover:bg-neutral-100 rounded-lg transition-colors">
              <RefreshCw className="h-5 w-5 text-neutral-600" />
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm">
              <Download className="h-4 w-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-gradient-to-br from-neutral-50 to-neutral-100 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Truck className="h-4 w-4 text-neutral-600" />
            <span className="text-xs font-medium text-neutral-700">Total</span>
          </div>
          <p className="text-xl font-bold text-neutral-900">{stats.total}</p>
          <p className="text-xs text-neutral-500 mt-1">trucks</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="h-4 w-4 text-green-600" />
            <span className="text-xs font-medium text-green-700">Active</span>
          </div>
          <p className="text-xl font-bold text-green-900">{stats.active}</p>
          <p className="text-xs text-green-600 mt-1">on route</p>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="h-4 w-4 text-blue-600" />
            <span className="text-xs font-medium text-blue-700">Completed</span>
          </div>
          <p className="text-xl font-bold text-blue-900">{stats.completed}</p>
          <p className="text-xs text-blue-600 mt-1">today</p>
        </div>
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <span className="text-xs font-medium text-amber-700">
              Maintenance
            </span>
          </div>
          <p className="text-xl font-bold text-amber-900">
            {stats.maintenance}
          </p>
          <p className="text-xs text-amber-600 mt-1">in service</p>
        </div>
        <div className="bg-gradient-to-br from-primary-muted to-primary-muted/50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            <span className="text-xs font-medium text-primary">Collected</span>
          </div>
          <p className="text-xl font-bold text-primary">
            {stats.totalCollected.toLocaleString()}
          </p>
          <p className="text-xs text-primary/70 mt-1">kg total</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Gauge className="h-4 w-4 text-purple-600" />
            <span className="text-xs font-medium text-purple-700">
              Efficiency
            </span>
          </div>
          <p className="text-xl font-bold text-purple-900">
            {stats.avgEfficiency}%
          </p>
          <p className="text-xs text-purple-600 mt-1">average</p>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Truck Efficiency Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200">
          <div className="p-5 border-b border-neutral-200">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-neutral-900">
                Truck Efficiency
              </h2>
              <div className="flex gap-1">
                <button
                  onClick={() => setChartView("efficiency")}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    chartView === "efficiency"
                      ? "bg-primary text-white"
                      : "bg-neutral-100 text-neutral-600"
                  }`}
                >
                  Efficiency
                </button>
                <button
                  onClick={() => setChartView("collected")}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    chartView === "collected"
                      ? "bg-primary text-white"
                      : "bg-neutral-100 text-neutral-600"
                  }`}
                >
                  Collected
                </button>
              </div>
            </div>
          </div>
          <div className="p-5">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart
                data={efficiencyData}
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
                  domain={chartView === "efficiency" ? [0, 100] : [0, "auto"]}
                  unit={chartView === "efficiency" ? "%" : "kg"}
                />
                <RechartsTooltip content={<CustomTooltip />} />
                <Bar
                  dataKey={
                    chartView === "efficiency" ? "efficiency" : "collected"
                  }
                  radius={[4, 4, 0, 0]}
                  maxBarSize={50}
                  name={chartView === "efficiency" ? "Efficiency" : "Collected"}
                  unit={chartView === "efficiency" ? "%" : " kg"}
                >
                  {efficiencyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Collection Trend */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200">
          <div className="p-5 border-b border-neutral-200">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-neutral-900">
                Collection Trend
              </h2>
              <BarChart3 className="h-4 w-4 text-neutral-500" />
            </div>
          </div>
          <div className="p-5">
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart
                data={collectionTrend}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="collectedGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
                <XAxis
                  dataKey="time"
                  tick={{ fontSize: 12, fill: "#737373" }}
                  axisLine={{ stroke: "#E5E5E5" }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: "#737373" }}
                  axisLine={{ stroke: "#E5E5E5" }}
                  tickLine={false}
                  unit="kg"
                />
                <RechartsTooltip content={<CustomTooltip />} />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ paddingTop: 16 }}
                />
                <Area
                  type="monotone"
                  dataKey="collected"
                  stroke="#10b981"
                  strokeWidth={2}
                  fill="url(#collectedGradient)"
                  name="Collected"
                  unit=" kg"
                />
                <Line
                  type="monotone"
                  dataKey="target"
                  stroke="#94A3B8"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Target"
                  unit=" kg"
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Real Map */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
        <div className="p-5 border-b border-neutral-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Map className="h-5 w-5 text-primary" />
              <h2 className="text-base font-bold text-neutral-900">
                Live Truck Locations
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={mapLayer}
                onChange={(e) => setMapLayer(e.target.value)}
                className="px-3 py-1.5 border border-neutral-300 rounded-lg text-sm"
              >
                <option value="standard">Standard</option>
                <option value="satellite">Satellite</option>
                <option value="dark">Dark</option>
              </select>
              <button
                onClick={() => setShowAllTrucks(!showAllTrucks)}
                className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                title={showAllTrucks ? "Hide All Trucks" : "Show All Trucks"}
              >
                {showAllTrucks ? (
                  <Eye className="h-5 w-5" />
                ) : (
                  <EyeOff className="h-5 w-5" />
                )}
              </button>
              <button className="p-2 hover:bg-neutral-100 rounded-lg transition-colors">
                <Layers className="h-5 w-5" />
              </button>
              <button className="p-2 hover:bg-neutral-100 rounded-lg transition-colors">
                <Maximize2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
        <div className="w-full h-[400px]">
          {mapReady && (
            <MapContainer
              center={MAP_CENTER}
              zoom={MAP_ZOOM}
              style={{ height: "100%", width: "100%" }}
              scrollWheelZoom={true}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url={mapTileUrl}
              />
              <MapController center={MAP_CENTER} zoom={MAP_ZOOM} />

              {/* Route Polylines */}
              {displayTrucks.map(
                (truck) =>
                  truck.routeCoords && (
                    <Polyline
                      key={`route-${truck.id}`}
                      positions={truck.routeCoords}
                      color={getStatusBadgeColor(truck.status)}
                      weight={3}
                      opacity={0.6}
                    />
                  ),
              )}

              {/* Truck Markers */}
              {displayTrucks.map((truck) => (
                <Marker
                  key={truck.id}
                  position={[truck.lat, truck.lng]}
                  icon={createTruckIcon(truck.status, truck.progress)}
                >
                  <Popup>
                    <div className="text-sm min-w-[220px]">
                      <div className="flex items-center gap-2 mb-3">
                        <Truck className="h-4 w-4 text-primary" />
                        <h3 className="font-bold">{truck.id}</h3>
                        <span
                          className="px-2 py-0.5 text-xs rounded-full text-white"
                          style={{
                            backgroundColor: getStatusBadgeColor(truck.status),
                          }}
                        >
                          {truck.status}
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Users className="h-3.5 w-3.5 text-neutral-500" />
                          <span className="text-neutral-700">
                            {truck.driver}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-3.5 w-3.5 text-neutral-500" />
                          <span className="text-neutral-700">
                            {truck.route}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-3.5 w-3.5 text-neutral-500" />
                          <span className="text-neutral-700">
                            {truck.departureTime} → {truck.eta}
                          </span>
                        </div>
                      </div>
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-neutral-600">Progress</span>
                          <span className="font-medium">{truck.progress}%</span>
                        </div>
                        <div className="w-full bg-neutral-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full"
                            style={{
                              width: `${truck.progress}%`,
                              backgroundColor: getStatusBadgeColor(
                                truck.status,
                              ),
                            }}
                          />
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t border-neutral-200">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-neutral-600">
                            Collected
                          </span>
                          <span className="font-bold text-primary">
                            {truck.trashCollected} kg
                          </span>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs text-neutral-600">
                            Efficiency
                          </span>
                          <span className="font-medium text-green-600">
                            {truck.efficiency || 85}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          )}
        </div>

        {/* Map Legend */}
        <div className="p-4 border-t border-neutral-200 bg-neutral-50">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-xs text-neutral-700">Active</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-xs text-neutral-700">Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              <span className="text-xs text-neutral-700">Maintenance</span>
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-xs text-neutral-500">
                {displayTrucks.length} truck
                {displayTrucks.length !== 1 ? "s" : ""} displayed
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Truck Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredTrucks.map((truck) => {
          const isExpanded = expandedTruck === truck.id;

          return (
            <div
              key={truck.id}
              className="bg-white rounded-xl shadow-sm border border-neutral-200 hover:shadow-md transition-shadow overflow-hidden"
            >
              <div className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{
                        backgroundColor:
                          getStatusBadgeColor(truck.status) + "20",
                      }}
                    >
                      <Truck
                        className="h-6 w-6"
                        style={{ color: getStatusBadgeColor(truck.status) }}
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-neutral-900">{truck.id}</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        {getStatusIcon(truck.status)}
                        <p className="text-sm text-neutral-600">
                          {truck.driver}
                        </p>
                      </div>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(truck.status)}`}
                  >
                    {truck.status}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-neutral-700">
                    <MapPin className="h-4 w-4 text-neutral-500" />
                    <span>{truck.route}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-neutral-700">
                    <Clock className="h-4 w-4 text-neutral-500" />
                    <span>
                      {truck.departureTime} → {truck.eta}
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-neutral-600">
                      Route Progress
                    </span>
                    <span className="text-sm font-bold text-neutral-900">
                      {truck.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-neutral-200 rounded-full h-2.5">
                    <div
                      className="h-2.5 rounded-full transition-all"
                      style={{
                        width: `${truck.progress}%`,
                        backgroundColor: getStatusBadgeColor(truck.status),
                      }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-neutral-700">
                        {truck.trashCollected} kg
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Gauge className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-neutral-700">
                        {truck.efficiency || 85}%
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      setExpandedTruck(isExpanded ? null : truck.id)
                    }
                    className="text-sm text-primary hover:text-primary-dark font-medium flex items-center gap-1"
                  >
                    {isExpanded ? "Hide" : "Details"}
                    <ChevronRight
                      className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-90" : ""}`}
                    />
                  </button>
                </div>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="px-5 pb-5 border-t border-neutral-200 bg-neutral-50">
                  <div className="pt-4 space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-neutral-600 text-xs">
                          Stops Completed
                        </p>
                        <p className="font-medium">
                          {truck.completedStops || 4}/{truck.totalStops || 8}
                        </p>
                      </div>
                      <div>
                        <p className="text-neutral-600 text-xs">
                          Distance Covered
                        </p>
                        <p className="font-medium">
                          {truck.distance || 8.5} km
                        </p>
                      </div>
                      <div>
                        <p className="text-neutral-600 text-xs">Next Stop</p>
                        <p className="font-medium">
                          {truck.nextStop || "Banilad"}
                        </p>
                      </div>
                      <div>
                        <p className="text-neutral-600 text-xs">
                          Est. Completion
                        </p>
                        <p className="font-medium">{truck.eta || "2:30 PM"}</p>
                      </div>
                    </div>

                    {/* Mini progress for stops */}
                    <div>
                      <p className="text-xs text-neutral-600 mb-2">
                        Stop Progress
                      </p>
                      <div className="flex gap-1">
                        {[...Array(truck.totalStops || 8)].map((_, i) => (
                          <div
                            key={i}
                            className={`flex-1 h-1.5 rounded-full ${
                              i < (truck.completedStops || 4)
                                ? "bg-green-500"
                                : "bg-neutral-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button className="flex-1 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark">
                        Track Live
                      </button>
                      <button className="flex-1 px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg text-sm font-medium hover:bg-neutral-100">
                        View Route
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TruckTrackingPage;
