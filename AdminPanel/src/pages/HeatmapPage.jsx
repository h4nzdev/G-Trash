import React, { useState, useEffect, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Tooltip,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import {
  Map,
  AlertTriangle,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Download,
  RefreshCw,
  Filter,
  ChevronRight,
  Activity,
  Wind,
  Droplets,
  Thermometer,
  Eye,
  EyeOff,
  Layers,
  Maximize2,
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
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";
import { barangayData, MAP_CENTER, MAP_ZOOM } from "../data/mapData";

// Fix Leaflet default icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

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

const getPollutionColor = (pollution) => {
  if (pollution > 80) return "#ef4444";
  if (pollution > 50) return "#f59e0b";
  return "#10b981";
};

const getPollutionStatus = (pollution) => {
  if (pollution > 80) return "Critical";
  if (pollution > 60) return "High";
  if (pollution > 40) return "Moderate";
  return "Safe";
};

const getRadius = (pollution) => {
  return 200 + (pollution / 100) * 400;
};

const HeatmapPage = () => {
  const [selectedBarangay, setSelectedBarangay] = useState("all");
  const [mapReady, setMapReady] = useState(false);
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [mapLayer, setMapLayer] = useState("standard");
  const [chartView, setChartView] = useState("comparison");
  const [selectedMetric, setSelectedMetric] = useState("pollution");
  const [expandedBarangay, setExpandedBarangay] = useState(null);

  useEffect(() => {
    setMapReady(true);
  }, []);

  const barangays =
    selectedBarangay === "all"
      ? barangayData
      : barangayData.filter((b) => b.name === selectedBarangay);

  const stats = {
    total: barangayData.length,
    safe: barangayData.filter((b) => b.status === "Safe").length,
    moderate: barangayData.filter((b) => b.status === "Moderate").length,
    high: barangayData.filter((b) => b.status === "High").length,
    critical: barangayData.filter((b) => b.status === "Critical").length,
    avgPollution: Math.round(
      barangayData.reduce((sum, b) => sum + b.pollution, 0) /
        barangayData.length,
    ),
    avgAmmonia: (
      barangayData.reduce((sum, b) => sum + b.ammonia, 0) / barangayData.length
    ).toFixed(1),
    avgMethane: (
      barangayData.reduce((sum, b) => sum + b.methane, 0) / barangayData.length
    ).toFixed(1),
    avgCO2: Math.round(
      barangayData.reduce((sum, b) => sum + b.co2, 0) / barangayData.length,
    ),
  };

  // Chart Data
  const pollutionComparison = useMemo(() => {
    return barangayData.map((b) => ({
      name: b.name.replace("Brgy. ", ""),
      pollution: b.pollution,
      ammonia: b.ammonia,
      methane: b.methane,
      co2: b.co2 / 10,
      color: getPollutionColor(b.pollution),
    }));
  }, []);

  const statusDistribution = useMemo(() => {
    return [
      { name: "Safe", value: stats.safe, color: "#10b981" },
      { name: "Moderate", value: stats.moderate, color: "#f59e0b" },
      { name: "High", value: stats.high, color: "#ef4444" },
      { name: "Critical", value: stats.critical, color: "#991b1b" },
    ].filter((d) => d.value > 0);
  }, [stats]);

  const trendData = useMemo(() => {
    const trends = { increasing: 0, decreasing: 0, stable: 0 };
    barangayData.forEach((b) => trends[b.trend]++);
    return [
      { name: "Increasing", value: trends.increasing, color: "#ef4444" },
      { name: "Decreasing", value: trends.decreasing, color: "#10b981" },
      { name: "Stable", value: trends.stable, color: "#6b7280" },
    ];
  }, []);

  const radarData = useMemo(() => {
    if (selectedBarangay === "all") return [];
    const barangay = barangayData.find((b) => b.name === selectedBarangay);
    if (!barangay) return [];

    return [
      { subject: "Pollution", A: barangay.pollution, fullMark: 100 },
      { subject: "Ammonia", A: barangay.ammonia * 2, fullMark: 100 },
      { subject: "Methane", A: barangay.methane * 2, fullMark: 100 },
      { subject: "CO₂", A: barangay.co2 / 5, fullMark: 100 },
    ];
  }, [selectedBarangay]);

  const mapTileUrl = {
    standard: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    satellite:
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    dark: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
  }[mapLayer];

  const getStatusIcon = (status) => {
    switch (status) {
      case "Safe":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "Moderate":
        return <AlertCircle className="h-5 w-5 text-amber-600" />;
      case "High":
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case "Critical":
        return <AlertTriangle className="h-5 w-5 text-red-800" />;
      default:
        return <AlertCircle className="h-5 w-5 text-neutral-600" />;
    }
  };

  const getTrendIndicator = (trend) => {
    switch (trend) {
      case "increasing":
        return {
          icon: <TrendingUp className="h-4 w-4 text-red-600" />,
          text: "Increasing",
          color: "text-red-600",
        };
      case "decreasing":
        return {
          icon: <TrendingDown className="h-4 w-4 text-green-600" />,
          text: "Decreasing",
          color: "text-green-600",
        };
      default:
        return {
          icon: <span className="text-neutral-500">→</span>,
          text: "Stable",
          color: "text-neutral-500",
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-neutral-900">
              Heatmap & Urgency
            </h1>
            <p className="text-neutral-600 mt-1 text-sm">
              View heatmap status and urgency levels across barangays
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm"
            >
              <option value="pollution">Pollution Index</option>
              <option value="ammonia">Ammonia (NH₃)</option>
              <option value="methane">Methane (CH₄)</option>
              <option value="co2">Carbon Dioxide (CO₂)</option>
            </select>
            <select
              value={selectedBarangay}
              onChange={(e) => setSelectedBarangay(e.target.value)}
              className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm"
            >
              <option value="all">All Barangays</option>
              {barangayData.map((b) => (
                <option key={b.name} value={b.name}>
                  {b.name}
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
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span className="text-xs font-medium text-green-700">Safe</span>
          </div>
          <p className="text-xl font-bold text-green-900">{stats.safe}</p>
          <p className="text-xs text-green-600 mt-1">0-40% AQI</p>
        </div>
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <span className="text-xs font-medium text-amber-700">Moderate</span>
          </div>
          <p className="text-xl font-bold text-amber-900">{stats.moderate}</p>
          <p className="text-xs text-amber-600 mt-1">41-60% AQI</p>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <span className="text-xs font-medium text-red-700">High</span>
          </div>
          <p className="text-xl font-bold text-red-900">{stats.high}</p>
          <p className="text-xs text-red-600 mt-1">61-80% AQI</p>
        </div>
        <div className="bg-gradient-to-br from-red-100 to-red-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-4 w-4 text-red-800" />
            <span className="text-xs font-medium text-red-800">Critical</span>
          </div>
          <p className="text-xl font-bold text-red-900">{stats.critical}</p>
          <p className="text-xs text-red-700 mt-1">81%+ AQI</p>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="h-4 w-4 text-blue-600" />
            <span className="text-xs font-medium text-blue-700">Avg AQI</span>
          </div>
          <p className="text-xl font-bold text-blue-900">
            {stats.avgPollution}%
          </p>
          <p className="text-xs text-blue-600 mt-1">City average</p>
        </div>
        <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Wind className="h-4 w-4 text-cyan-600" />
            <span className="text-xs font-medium text-cyan-700">NH₃</span>
          </div>
          <p className="text-xl font-bold text-cyan-900">{stats.avgAmmonia}</p>
          <p className="text-xs text-cyan-600 mt-1">ppm avg</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Droplets className="h-4 w-4 text-purple-600" />
            <span className="text-xs font-medium text-purple-700">CH₄</span>
          </div>
          <p className="text-xl font-bold text-purple-900">
            {stats.avgMethane}
          </p>
          <p className="text-xs text-purple-600 mt-1">ppm avg</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Thermometer className="h-4 w-4 text-emerald-600" />
            <span className="text-xs font-medium text-emerald-700">CO₂</span>
          </div>
          <p className="text-xl font-bold text-emerald-900">{stats.avgCO2}</p>
          <p className="text-xs text-emerald-600 mt-1">ppm avg</p>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pollution Comparison Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200">
          <div className="p-5 border-b border-neutral-200">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-neutral-900">
                Pollution Comparison
              </h2>
              <div className="flex gap-1">
                <button
                  onClick={() => setChartView("comparison")}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    chartView === "comparison"
                      ? "bg-primary text-white"
                      : "bg-neutral-100 text-neutral-600"
                  }`}
                >
                  Bar
                </button>
                <button
                  onClick={() => setChartView("trend")}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    chartView === "trend"
                      ? "bg-primary text-white"
                      : "bg-neutral-100 text-neutral-600"
                  }`}
                >
                  Radar
                </button>
              </div>
            </div>
          </div>
          <div className="p-5">
            <ResponsiveContainer width="100%" height={280}>
              {chartView === "comparison" ? (
                <BarChart
                  data={pollutionComparison}
                  margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fill: "#737373" }}
                    axisLine={{ stroke: "#E5E5E5" }}
                    tickLine={false}
                    angle={-30}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: "#737373" }}
                    axisLine={{ stroke: "#E5E5E5" }}
                    tickLine={false}
                  />
                  <RechartsTooltip content={<CustomTooltip />} />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ paddingTop: 16 }}
                  />
                  <Bar
                    dataKey="pollution"
                    fill="#ef4444"
                    radius={[4, 4, 0, 0]}
                    name="Pollution"
                    unit="%"
                    maxBarSize={40}
                  />
                  <Bar
                    dataKey="ammonia"
                    fill="#f59e0b"
                    radius={[4, 4, 0, 0]}
                    name="Ammonia"
                    unit=" ppm"
                    maxBarSize={40}
                  />
                  <Bar
                    dataKey="methane"
                    fill="#3b82f6"
                    radius={[4, 4, 0, 0]}
                    name="Methane"
                    unit=" ppm"
                    maxBarSize={40}
                  />
                </BarChart>
              ) : selectedBarangay !== "all" && radarData.length > 0 ? (
                <RadarChart
                  data={radarData}
                  margin={{ top: 20, right: 30, left: 30, bottom: 20 }}
                >
                  <PolarGrid />
                  <PolarAngleAxis
                    dataKey="subject"
                    tick={{ fontSize: 11, fill: "#737373" }}
                  />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar
                    name={selectedBarangay}
                    dataKey="A"
                    stroke="#ef4444"
                    fill="#ef4444"
                    fillOpacity={0.3}
                  />
                  <RechartsTooltip content={<CustomTooltip />} />
                  <Legend />
                </RadarChart>
              ) : (
                <div className="h-full flex items-center justify-center text-neutral-500">
                  Select a specific barangay to view radar chart
                </div>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200">
          <div className="p-5 border-b border-neutral-200">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-neutral-900">
                Status Distribution
              </h2>
              <BarChart3 className="h-4 w-4 text-neutral-500" />
            </div>
          </div>
          <div className="p-5">
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
                <RechartsTooltip content={<CustomTooltip />} />
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
      </div>

      {/* Real Map */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
        <div className="p-5 border-b border-neutral-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Map className="h-5 w-5 text-primary" />
              <h2 className="text-base font-bold text-neutral-900">
                Pollution Heatmap
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
                onClick={() => setShowHeatmap(!showHeatmap)}
                className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                title={showHeatmap ? "Hide Heatmap" : "Show Heatmap"}
              >
                {showHeatmap ? (
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
        <div className="w-full h-[450px]">
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
              {showHeatmap &&
                barangays.map((barangay) => {
                  const metricValue =
                    selectedMetric === "pollution"
                      ? barangay.pollution
                      : selectedMetric === "ammonia"
                        ? barangay.ammonia * 2
                        : selectedMetric === "methane"
                          ? barangay.methane * 2
                          : barangay.co2 / 5;

                  return (
                    <CircleMarker
                      key={barangay.name}
                      center={[barangay.lat, barangay.lng]}
                      radius={15 + metricValue / 10}
                      fillColor={getPollutionColor(metricValue)}
                      color={getPollutionColor(metricValue)}
                      weight={2}
                      opacity={0.8}
                      fillOpacity={0.4}
                    >
                      <Tooltip
                        direction="top"
                        offset={[0, -10]}
                        permanent={false}
                      >
                        <div className="text-sm">
                          <strong>{barangay.name}</strong>
                          <br />
                          <span
                            style={{ color: getPollutionColor(metricValue) }}
                          >
                            {selectedMetric === "pollution" &&
                              `Pollution: ${barangay.pollution}%`}
                            {selectedMetric === "ammonia" &&
                              `Ammonia: ${barangay.ammonia} ppm`}
                            {selectedMetric === "methane" &&
                              `Methane: ${barangay.methane} ppm`}
                            {selectedMetric === "co2" &&
                              `CO₂: ${barangay.co2} ppm`}
                          </span>
                          <br />
                          Status: {getPollutionStatus(metricValue)}
                        </div>
                      </Tooltip>
                      <Popup>
                        <div className="text-sm min-w-[220px]">
                          <h3 className="font-bold text-base mb-3">
                            {barangay.name}
                          </h3>
                          <div className="grid grid-cols-2 gap-3 mb-3">
                            <div className="bg-neutral-50 p-2 rounded-lg">
                              <p className="text-xs text-neutral-600">
                                Pollution
                              </p>
                              <p
                                className="text-lg font-bold"
                                style={{
                                  color: getPollutionColor(barangay.pollution),
                                }}
                              >
                                {barangay.pollution}%
                              </p>
                            </div>
                            <div className="bg-neutral-50 p-2 rounded-lg">
                              <p className="text-xs text-neutral-600">Status</p>
                              <p
                                className="text-lg font-medium"
                                style={{
                                  color: getPollutionColor(barangay.pollution),
                                }}
                              >
                                {barangay.status}
                              </p>
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-2 text-center">
                            <div>
                              <p className="text-xs text-neutral-600">
                                Ammonia
                              </p>
                              <p className="font-bold">
                                {barangay.ammonia} ppm
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-neutral-600">
                                Methane
                              </p>
                              <p className="font-bold">
                                {barangay.methane} ppm
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-neutral-600">CO₂</p>
                              <p className="font-bold">{barangay.co2} ppm</p>
                            </div>
                          </div>
                          <div className="mt-3 pt-3 border-t border-neutral-200">
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-neutral-600">
                                Trend
                              </span>
                              <span
                                className={`text-xs font-medium flex items-center gap-1 ${getTrendIndicator(barangay.trend).color}`}
                              >
                                {getTrendIndicator(barangay.trend).icon}
                                {getTrendIndicator(barangay.trend).text}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Popup>
                    </CircleMarker>
                  );
                })}
            </MapContainer>
          )}
        </div>

        {/* Map Legend */}
        <div className="p-4 border-t border-neutral-200 bg-neutral-50">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-xs text-neutral-700">Safe (0-40%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              <span className="text-xs text-neutral-700">
                Moderate (41-60%)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-xs text-neutral-700">High (61-80%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-800"></div>
              <span className="text-xs text-neutral-700">Critical (81%+)</span>
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-xs text-neutral-500">
                Circle size represents{" "}
                {selectedMetric === "pollution"
                  ? "Pollution"
                  : selectedMetric === "ammonia"
                    ? "Ammonia"
                    : selectedMetric === "methane"
                      ? "Methane"
                      : "CO₂"}{" "}
                level
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Barangay Details */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200">
        <div className="p-5 border-b border-neutral-200">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-neutral-900">
              Barangay Monitoring Details
            </h2>
            <button className="text-sm text-primary hover:text-primary-dark font-medium">
              View All Reports
            </button>
          </div>
        </div>
        <div className="divide-y divide-neutral-200">
          {barangays.map((barangay, index) => {
            const trend = getTrendIndicator(barangay.trend);
            const isExpanded = expandedBarangay === barangay.name;

            return (
              <div
                key={index}
                className="hover:bg-neutral-50 transition-colors"
              >
                <div
                  className="p-5 cursor-pointer"
                  onClick={() =>
                    setExpandedBarangay(isExpanded ? null : barangay.name)
                  }
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        {getStatusIcon(barangay.status)}
                        <div>
                          <h3 className="font-semibold text-neutral-900">
                            {barangay.name}
                          </h3>
                          <div
                            className={`flex items-center gap-1 text-sm ${trend.color}`}
                          >
                            {trend.icon}
                            <span>{trend.text}</span>
                          </div>
                        </div>
                      </div>
                      <div className="mb-2">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-neutral-600">
                            Pollution Level
                          </span>
                          <span className="text-sm font-bold text-neutral-900">
                            {barangay.pollution}%
                          </span>
                        </div>
                        <div className="w-full bg-neutral-200 rounded-full h-2.5">
                          <div
                            className={`h-2.5 rounded-full transition-all ${
                              barangay.pollution > 80
                                ? "bg-red-500"
                                : barangay.pollution > 50
                                  ? "bg-amber-500"
                                  : "bg-green-500"
                            }`}
                            style={{ width: `${barangay.pollution}%` }}
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-neutral-500">
                        <ChevronRight
                          className={`h-3 w-3 transition-transform ${isExpanded ? "rotate-90" : ""}`}
                        />
                        <span>
                          {isExpanded ? "Hide details" : "Show details"}
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <p className="text-xs text-neutral-600">Ammonia</p>
                        <p className="text-base font-bold text-neutral-900">
                          {barangay.ammonia}
                        </p>
                        <p className="text-xs text-neutral-500">ppm</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-neutral-600">Methane</p>
                        <p className="text-base font-bold text-neutral-900">
                          {barangay.methane}
                        </p>
                        <p className="text-xs text-neutral-500">ppm</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-neutral-600">CO₂</p>
                        <p className="text-base font-bold text-neutral-900">
                          {barangay.co2}
                        </p>
                        <p className="text-xs text-neutral-500">ppm</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="px-5 pb-5">
                    <div className="pt-4 border-t border-neutral-200">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-semibold text-neutral-900 mb-3">
                            Gas Level Trends
                          </h4>
                          <div className="space-y-3">
                            <div>
                              <div className="flex justify-between text-xs mb-1">
                                <span className="text-neutral-600">
                                  Ammonia (NH₃)
                                </span>
                                <span className="font-medium">
                                  {barangay.ammonia} ppm
                                </span>
                              </div>
                              <div className="w-full bg-neutral-200 rounded-full h-2">
                                <div
                                  className="bg-blue-500 h-2 rounded-full"
                                  style={{
                                    width: `${(barangay.ammonia / 100) * 100}%`,
                                  }}
                                />
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between text-xs mb-1">
                                <span className="text-neutral-600">
                                  Methane (CH₄)
                                </span>
                                <span className="font-medium">
                                  {barangay.methane} ppm
                                </span>
                              </div>
                              <div className="w-full bg-neutral-200 rounded-full h-2">
                                <div
                                  className="bg-purple-500 h-2 rounded-full"
                                  style={{
                                    width: `${(barangay.methane / 100) * 100}%`,
                                  }}
                                />
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between text-xs mb-1">
                                <span className="text-neutral-600">
                                  Carbon Dioxide (CO₂)
                                </span>
                                <span className="font-medium">
                                  {barangay.co2} ppm
                                </span>
                              </div>
                              <div className="w-full bg-neutral-200 rounded-full h-2">
                                <div
                                  className="bg-emerald-500 h-2 rounded-full"
                                  style={{
                                    width: `${(barangay.co2 / 1000) * 100}%`,
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-neutral-900 mb-3">
                            Recommendations
                          </h4>
                          <ul className="space-y-2 text-sm text-neutral-600">
                            {barangay.pollution > 80 && (
                              <li className="flex items-start gap-2">
                                <AlertTriangle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                                <span>
                                  Immediate action required - High pollution
                                  levels detected
                                </span>
                              </li>
                            )}
                            {barangay.ammonia > 50 && (
                              <li className="flex items-start gap-2">
                                <AlertCircle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
                                <span>
                                  Elevated ammonia levels - Check waste
                                  decomposition
                                </span>
                              </li>
                            )}
                            {barangay.methane > 40 && (
                              <li className="flex items-start gap-2">
                                <AlertCircle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
                                <span>
                                  High methane concentration - Ensure proper
                                  ventilation
                                </span>
                              </li>
                            )}
                            <li className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                              <span>
                                Schedule regular monitoring every 4 hours
                              </span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HeatmapPage;
