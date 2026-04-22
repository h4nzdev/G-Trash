import React, { useState, useMemo } from 'react';
import { 
  Map as MapIcon, 
  Filter, 
  AlertTriangle, 
  CheckCircle, 
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Minus,
  Activity,
  Wind,
  Droplets,
  Thermometer,
  BarChart3,
  Calendar,
  Download,
  RefreshCw,
  Maximize2,
  Layers
} from 'lucide-react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap, Polygon } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  RadialBarChart,
  RadialBar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

// Fix for default marker icon
import L from 'leaflet';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Cebu City coordinates
const CEBU_CENTER = [10.3157, 123.8854];
const DEFAULT_ZOOM = 13;

// Map fit component
function MapFit({ barangays }) {
  const map = useMap();
  React.useEffect(() => {
    if (barangays.length > 0) {
      const bounds = L.latLngBounds(barangays.map(b => [b.lat, b.lng]));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [barangays, map]);
  return null;
}

// Custom Tooltip for charts
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-lg border border-neutral-200">
        <p className="font-medium text-neutral-900 mb-2">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }} className="text-sm">
            {entry.name}: {entry.value} {entry.unit || ''}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const HeatmapPage = () => {
  const [selectedBarangay, setSelectedBarangay] = useState('all');
  const [selectedMetric, setSelectedMetric] = useState('pollution');
  const [timeRange, setTimeRange] = useState('24h');
  const [showAnalytics, setShowAnalytics] = useState(true);
  const [mapStyle, setMapStyle] = useState('standard');

  // Enhanced barangay data with historical trends
  const barangays = [
    { 
      name: 'Brgy. Lahug', 
      lat: 10.3328, 
      lng: 123.9010, 
      pollution: 72, 
      status: 'Moderate', 
      trend: 'stable', 
      ammonia: 2.3, 
      methane: 4.1, 
      co2: 380,
      temperature: 28.5,
      humidity: 75,
      windSpeed: 2.1,
      aqi: 95,
      historicalData: [
        { time: '00:00', pollution: 65, ammonia: 2.1, methane: 3.8, co2: 370 },
        { time: '04:00', pollution: 68, ammonia: 2.2, methane: 3.9, co2: 375 },
        { time: '08:00', pollution: 75, ammonia: 2.5, methane: 4.3, co2: 385 },
        { time: '12:00', pollution: 72, ammonia: 2.3, methane: 4.1, co2: 380 },
        { time: '16:00', pollution: 70, ammonia: 2.2, methane: 4.0, co2: 378 },
        { time: '20:00', pollution: 68, ammonia: 2.1, methane: 3.9, co2: 375 },
      ],
      alerts: 2
    },
    { 
      name: 'Brgy. Apas', 
      lat: 10.3050, 
      lng: 123.8920, 
      pollution: 85, 
      status: 'High', 
      trend: 'increasing', 
      ammonia: 3.8, 
      methane: 5.9, 
      co2: 420,
      temperature: 29.2,
      humidity: 72,
      windSpeed: 1.8,
      aqi: 125,
      historicalData: [
        { time: '00:00', pollution: 78, ammonia: 3.5, methane: 5.5, co2: 410 },
        { time: '04:00', pollution: 82, ammonia: 3.7, methane: 5.7, co2: 415 },
        { time: '08:00', pollution: 88, ammonia: 4.0, methane: 6.1, co2: 425 },
        { time: '12:00', pollution: 85, ammonia: 3.8, methane: 5.9, co2: 420 },
        { time: '16:00', pollution: 83, ammonia: 3.6, methane: 5.8, co2: 418 },
        { time: '20:00', pollution: 80, ammonia: 3.5, methane: 5.6, co2: 412 },
      ],
      alerts: 4
    },
    { 
      name: 'Brgy. Kasambagan', 
      lat: 10.3180, 
      lng: 123.8950, 
      pollution: 45, 
      status: 'Safe', 
      trend: 'decreasing', 
      ammonia: 1.2, 
      methane: 2.3, 
      co2: 340,
      temperature: 27.8,
      humidity: 78,
      windSpeed: 2.5,
      aqi: 55,
      historicalData: [
        { time: '00:00', pollution: 50, ammonia: 1.5, methane: 2.6, co2: 345 },
        { time: '04:00', pollution: 48, ammonia: 1.4, methane: 2.5, co2: 342 },
        { time: '08:00', pollution: 43, ammonia: 1.1, methane: 2.1, co2: 338 },
        { time: '12:00', pollution: 45, ammonia: 1.2, methane: 2.3, co2: 340 },
        { time: '16:00', pollution: 47, ammonia: 1.3, methane: 2.4, co2: 341 },
        { time: '20:00', pollution: 46, ammonia: 1.2, methane: 2.3, co2: 339 },
      ],
      alerts: 0
    },
    { 
      name: 'Brgy. Budlaan', 
      lat: 10.3420, 
      lng: 123.8850, 
      pollution: 68, 
      status: 'Moderate', 
      trend: 'increasing', 
      ammonia: 2.8, 
      methane: 4.5, 
      co2: 390,
      temperature: 28.1,
      humidity: 74,
      windSpeed: 2.0,
      aqi: 88,
      historicalData: [
        { time: '00:00', pollution: 62, ammonia: 2.5, methane: 4.2, co2: 385 },
        { time: '04:00', pollution: 65, ammonia: 2.7, methane: 4.4, co2: 388 },
        { time: '08:00', pollution: 70, ammonia: 3.0, methane: 4.7, co2: 392 },
        { time: '12:00', pollution: 68, ammonia: 2.8, methane: 4.5, co2: 390 },
        { time: '16:00', pollution: 66, ammonia: 2.6, methane: 4.3, co2: 387 },
        { time: '20:00', pollution: 64, ammonia: 2.5, methane: 4.2, co2: 386 },
      ],
      alerts: 1
    },
    { 
      name: 'Brgy. Capitol', 
      lat: 10.3150, 
      lng: 123.8900, 
      pollution: 38, 
      status: 'Safe', 
      trend: 'stable', 
      ammonia: 0.9, 
      methane: 1.8, 
      co2: 320,
      temperature: 27.5,
      humidity: 80,
      windSpeed: 2.8,
      aqi: 42,
      historicalData: [
        { time: '00:00', pollution: 40, ammonia: 1.0, methane: 1.9, co2: 322 },
        { time: '04:00', pollution: 38, ammonia: 0.9, methane: 1.8, co2: 320 },
        { time: '08:00', pollution: 36, ammonia: 0.8, methane: 1.7, co2: 318 },
        { time: '12:00', pollution: 38, ammonia: 0.9, methane: 1.8, co2: 320 },
        { time: '16:00', pollution: 39, ammonia: 1.0, methane: 1.9, co2: 321 },
        { time: '20:00', pollution: 37, ammonia: 0.8, methane: 1.7, co2: 319 },
      ],
      alerts: 0
    },
    { 
      name: 'Brgy. Guadalupe', 
      lat: 10.2980, 
      lng: 123.8820, 
      pollution: 55, 
      status: 'Moderate', 
      trend: 'stable', 
      ammonia: 1.9, 
      methane: 3.2, 
      co2: 360,
      temperature: 28.3,
      humidity: 73,
      windSpeed: 2.2,
      aqi: 68,
      historicalData: [
        { time: '00:00', pollution: 52, ammonia: 1.7, methane: 3.0, co2: 355 },
        { time: '04:00', pollution: 54, ammonia: 1.8, methane: 3.1, co2: 358 },
        { time: '08:00', pollution: 57, ammonia: 2.0, methane: 3.3, co2: 362 },
        { time: '12:00', pollution: 55, ammonia: 1.9, methane: 3.2, co2: 360 },
        { time: '16:00', pollution: 53, ammonia: 1.8, methane: 3.1, co2: 357 },
        { time: '20:00', pollution: 52, ammonia: 1.7, methane: 3.0, co2: 356 },
      ],
      alerts: 1
    },
  ];

  const getCircleColor = (value, metric = 'pollution') => {
    if (metric === 'pollution' || metric === 'aqi') {
      if (value < 50) return '#22C55E';
      if (value < 100) return '#F59E0B';
      if (value < 150) return '#EF4444';
      return '#991B1B';
    }
    return '#22C55E';
  };

  const getStatusFromValue = (value) => {
    if (value < 50) return 'Safe';
    if (value < 100) return 'Moderate';
    if (value < 150) return 'High';
    return 'Critical';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Safe': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'Moderate': return <AlertCircle className="h-5 w-5 text-amber-600" />;
      case 'High': return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case 'Critical': return <AlertTriangle className="h-5 w-5 text-red-800" />;
      default: return <AlertCircle className="h-5 w-5 text-neutral-600" />;
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'increasing': return <TrendingUp className="h-4 w-4 text-red-600" />;
      case 'decreasing': return <TrendingDown className="h-4 w-4 text-green-600" />;
      case 'stable': return <Minus className="h-4 w-4 text-neutral-600" />;
      default: return <Minus className="h-4 w-4 text-neutral-600" />;
    }
  };

  const filteredBarangays = selectedBarangay === 'all'
    ? barangays
    : barangays.filter(b => b.name === selectedBarangay);

  const filteredForMap = selectedBarangay === 'all' ? barangays : filteredBarangays;

  // Calculate statistics
  const stats = useMemo(() => {
    const avgPollution = barangays.reduce((sum, b) => sum + b.pollution, 0) / barangays.length;
    const maxPollution = Math.max(...barangays.map(b => b.pollution));
    const minPollution = Math.min(...barangays.map(b => b.pollution));
    const criticalAreas = barangays.filter(b => b.pollution >= 100).length;
    const totalAlerts = barangays.reduce((sum, b) => sum + (b.alerts || 0), 0);
    
    return {
      avgPollution: Math.round(avgPollution),
      maxPollution,
      minPollution,
      criticalAreas,
      totalAlerts,
      safeAreas: barangays.filter(b => b.pollution < 50).length,
      moderateAreas: barangays.filter(b => b.pollution >= 50 && b.pollution < 100).length,
      highAreas: barangays.filter(b => b.pollution >= 100).length,
    };
  }, [barangays]);

  // Prepare chart data
  const pollutionByBarangay = barangays.map(b => ({
    name: b.name.replace('Brgy. ', ''),
    pollution: b.pollution,
    aqi: b.aqi,
    ammonia: b.ammonia,
    methane: b.methane,
    co2: b.co2
  }));

  const selectedBarangayData = selectedBarangay !== 'all' 
    ? barangays.find(b => b.name === selectedBarangay)
    : null;

  const timeSeriesData = selectedBarangayData 
    ? selectedBarangayData.historicalData
    : barangays[0].historicalData;

  const mapTileUrl = {
    standard: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
  }[mapStyle];

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">Pollution Heatmap</h1>
            <p className="text-neutral-600 mt-1">Real-time environmental monitoring & analytics</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm"
            >
              <option value="pollution">Pollution Index</option>
              <option value="aqi">Air Quality Index</option>
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
              {barangays.map((b) => (
                <option key={b.name} value={b.name}>{b.name}</option>
              ))}
            </select>
            <button className="p-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors">
              <RefreshCw className="h-5 w-5 text-neutral-700" />
            </button>
            <button className="p-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors">
              <Download className="h-5 w-5 text-neutral-700" />
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 mt-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="h-4 w-4 text-blue-600" />
              <span className="text-xs font-medium text-blue-700">Avg AQI</span>
            </div>
            <p className="text-2xl font-bold text-blue-900">{stats.avgPollution}</p>
            <p className="text-xs text-blue-600 mt-1">City Average</p>
          </div>
          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <span className="text-xs font-medium text-red-700">Critical</span>
            </div>
            <p className="text-2xl font-bold text-red-900">{stats.criticalAreas}</p>
            <p className="text-xs text-red-600 mt-1">Areas 100 AQI</p>
          </div>
          <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <span className="text-xs font-medium text-amber-700">Moderate</span>
            </div>
            <p className="text-2xl font-bold text-amber-900">{stats.moderateAreas}</p>
            <p className="text-xs text-amber-600 mt-1">Areas 50-100 AQI</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-xs font-medium text-green-700">Safe</span>
            </div>
            <p className="text-2xl font-bold text-green-900">{stats.safeAreas}</p>
            <p className="text-xs text-green-600 mt-1">Areas &lt;50 AQI</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Wind className="h-4 w-4 text-purple-600" />
              <span className="text-xs font-medium text-purple-700">Max AQI</span>
            </div>
            <p className="text-2xl font-bold text-purple-900">{stats.maxPollution}</p>
            <p className="text-xs text-purple-600 mt-1">Highest Reading</p>
          </div>
          <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Droplets className="h-4 w-4 text-cyan-600" />
              <span className="text-xs font-medium text-cyan-700">Humidity</span>
            </div>
            <p className="text-2xl font-bold text-cyan-900">75%</p>
            <p className="text-xs text-cyan-600 mt-1">City Average</p>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Thermometer className="h-4 w-4 text-orange-600" />
              <span className="text-xs font-medium text-orange-700">Temp</span>
            </div>
            <p className="text-2xl font-bold text-orange-900">28.2°C</p>
            <p className="text-xs text-orange-600 mt-1">City Average</p>
          </div>
          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-indigo-600" />
              <span className="text-xs font-medium text-indigo-700">Alerts</span>
            </div>
            <p className="text-2xl font-bold text-indigo-900">{stats.totalAlerts}</p>
            <p className="text-xs text-indigo-600 mt-1">Active Alerts</p>
          </div>
        </div>
      </div>

      {/* Main Map Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
          <div className="p-4 border-b border-neutral-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapIcon className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-bold text-neutral-900">Live Heatmap - Cebu City</h2>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={mapStyle}
                onChange={(e) => setMapStyle(e.target.value)}
                className="px-3 py-1.5 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none"
              >
                <option value="standard">Standard</option>
                <option value="satellite">Satellite</option>
                <option value="dark">Dark</option>
              </select>
              <button className="p-2 hover:bg-neutral-100 rounded-lg transition-colors">
                <Layers className="h-5 w-5 text-neutral-700" />
              </button>
              <button className="p-2 hover:bg-neutral-100 rounded-lg transition-colors">
                <Maximize2 className="h-5 w-5 text-neutral-700" />
              </button>
            </div>
          </div>
          <div className="relative" style={{ height: '500px' }}>
            <MapContainer
              center={CEBU_CENTER}
              zoom={DEFAULT_ZOOM}
              style={{ height: '100%', width: '100%' }}
              scrollWheelZoom={true}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url={mapTileUrl}
              />
              <MapFit barangays={filteredForMap} />
              {filteredForMap.map((barangay, index) => {
                const metricValue = selectedMetric === 'pollution' ? barangay.pollution :
                                   selectedMetric === 'aqi' ? barangay.aqi :
                                   selectedMetric === 'ammonia' ? barangay.ammonia * 20 :
                                   selectedMetric === 'methane' ? barangay.methane * 15 :
                                   barangay.co2 / 15;
                
                return (
                  <CircleMarker
                    key={index}
                    center={[barangay.lat, barangay.lng]}
                    radius={15 + (metricValue / 10)}
                    fillColor={getCircleColor(metricValue, selectedMetric)}
                    color={getCircleColor(metricValue, selectedMetric)}
                    weight={2}
                    opacity={0.8}
                    fillOpacity={0.6}
                  >
                    <Popup>
                      <div className="text-sm min-w-[250px]">
                        <h3 className="font-bold text-neutral-900 mb-2 text-base">{barangay.name}</h3>
                        <div className="space-y-2">
                          <div className="bg-neutral-50 p-2 rounded-lg">
                            <p className="text-xs text-neutral-600 mb-1">Air Quality Index</p>
                            <div className="flex items-center justify-between">
                              <span className="text-2xl font-bold" style={{ color: getCircleColor(barangay.pollution) }}>
                                {barangay.pollution}
                              </span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                barangay.status === 'Safe' ? 'bg-green-100 text-green-800' :
                                barangay.status === 'Moderate' ? 'bg-amber-100 text-amber-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {barangay.status}
                              </span>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2">
                            <div className="bg-neutral-50 p-2 rounded-lg">
                              <p className="text-xs text-neutral-600">Ammonia</p>
                              <p className="text-lg font-semibold">{barangay.ammonia} ppm</p>
                            </div>
                            <div className="bg-neutral-50 p-2 rounded-lg">
                              <p className="text-xs text-neutral-600">Methane</p>
                              <p className="text-lg font-semibold">{barangay.methane} ppm</p>
                            </div>
                            <div className="bg-neutral-50 p-2 rounded-lg">
                              <p className="text-xs text-neutral-600">CO₂</p>
                              <p className="text-lg font-semibold">{barangay.co2} ppm</p>
                            </div>
                            <div className="bg-neutral-50 p-2 rounded-lg">
                              <p className="text-xs text-neutral-600">Trend</p>
                              <p className="text-lg font-semibold flex items-center gap-1">
                                {getTrendIcon(barangay.trend)}
                                {barangay.trend}
                              </p>
                            </div>
                          </div>

                          {barangay.alerts > 0 && (
                            <div className="bg-red-50 border border-red-200 p-2 rounded-lg">
                              <p className="text-xs text-red-800 font-medium">
                                ⚠️ {barangay.alerts} active alert{barangay.alerts > 1 ? 's' : ''}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </Popup>
                  </CircleMarker>
                );
              })}
            </MapContainer>
          </div>
          
          {/* Map Legend */}
          <div className="p-4 border-t border-neutral-200 bg-neutral-50">
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-green-500"></div>
                <span className="text-sm text-neutral-700">Safe (0-50)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-amber-500"></div>
                <span className="text-sm text-neutral-700">Moderate (51-100)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-red-500"></div>
                <span className="text-sm text-neutral-700">High (101-150)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-red-800"></div>
                <span className="text-sm text-neutral-700">Critical (150+)</span>
              </div>
              <div className="flex items-center gap-2 ml-auto">
                <span className="text-xs text-neutral-500">
                  Circle size represents {selectedMetric === 'pollution' ? 'Pollution' : 
                    selectedMetric === 'aqi' ? 'AQI' : 
                    selectedMetric === 'ammonia' ? 'Ammonia' : 
                    selectedMetric === 'methane' ? 'Methane' : 'CO₂'} level
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Analytics */}
        <div className="space-y-6">
          {/* Real-time Chart */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-neutral-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-neutral-900">
                {selectedBarangay === 'all' ? 'City Average Trend' : `${selectedBarangay} Trend`}
              </h3>
              <div className="flex gap-1">
                {['24h', '7d', '30d'].map(range => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-2 py-1 text-xs rounded transition-colors ${
                      timeRange === range 
                        ? 'bg-primary text-white' 
                        : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={timeSeriesData}>
                <defs>
                  <linearGradient id="pollutionGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
                <XAxis dataKey="time" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="pollution"
                  stroke="#EF4444"
                  strokeWidth={2}
                  fill="url(#pollutionGradient)"
                  name="Pollution"
                  unit="%"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Barangay Comparison */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-neutral-200">
            <h3 className="font-bold text-neutral-900 mb-4">Barangay Comparison</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={pollutionByBarangay} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
                <XAxis type="number" tick={{ fontSize: 10 }} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={70} />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="pollution" 
                  fill="#EF4444" 
                  name="Pollution"
                  radius={[0, 4, 4, 0]}
                  unit="%"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Alert Summary */}
          <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-4 shadow-sm border border-red-200">
            <h3 className="font-bold text-neutral-900 mb-3 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              Active Alerts
            </h3>
            <div className="space-y-2">
              {barangays.filter(b => b.alerts > 0).map((b, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 bg-white/60 rounded-lg">
                  <span className="text-sm font-medium">{b.name}</span>
                  <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                    {b.alerts} alert{b.alerts > 1 ? 's' : ''}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Monitoring Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
        <div className="p-4 lg:p-6 border-b border-neutral-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-neutral-900">Detailed Monitoring Data</h2>
            <button className="text-sm text-primary hover:text-primary-dark font-medium">
              Export Data
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">Barangay</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">AQI</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">Ammonia</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">Methane</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">CO₂</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">Temp</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">Humidity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">Wind</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">Trend</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">Alerts</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {filteredBarangays.map((barangay, index) => (
                <tr key={index} className="hover:bg-neutral-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-medium text-neutral-900">{barangay.name}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      barangay.status === 'Safe' ? 'bg-green-100 text-green-800' :
                      barangay.status === 'Moderate' ? 'bg-amber-100 text-amber-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {barangay.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-semibold" style={{ color: getCircleColor(barangay.pollution) }}>
                      {barangay.pollution}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-700">{barangay.ammonia} ppm</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-700">{barangay.methane} ppm</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-700">{barangay.co2} ppm</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-700">{barangay.temperature}°C</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-700">{barangay.humidity}%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-700">{barangay.windSpeed} m/s</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      {getTrendIcon(barangay.trend)}
                      <span className="text-sm text-neutral-700 capitalize">{barangay.trend}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {barangay.alerts > 0 ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        {barangay.alerts}
                      </span>
                    ) : (
                      <span className="text-sm text-neutral-400">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HeatmapPage;