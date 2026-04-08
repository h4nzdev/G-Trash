import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Tooltip, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Map, AlertTriangle, CheckCircle, AlertCircle, TrendingUp, TrendingDown } from 'lucide-react';
import { barangayData, MAP_CENTER, MAP_ZOOM } from '../data/mapData';

// Fix Leaflet default icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const getPollutionColor = (pollution) => {
  if (pollution > 80) return '#ef4444';
  if (pollution > 50) return '#f59e0b';
  return '#10b981';
};

const getRadius = (pollution) => {
  return 200 + (pollution / 100) * 400;
};

const HeatmapPage = () => {
  const [selectedBarangay, setSelectedBarangay] = useState('all');
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    setMapReady(true);
  }, []);

  const barangays = selectedBarangay === 'all'
    ? barangayData
    : barangayData.filter(b => b.name === selectedBarangay);

  const stats = {
    total: barangayData.length,
    safe: barangayData.filter(b => b.status === 'Safe').length,
    moderate: barangayData.filter(b => b.status === 'Moderate').length,
    high: barangayData.filter(b => b.status === 'High').length,
    critical: barangayData.filter(b => b.status === 'Critical').length,
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

  const getTrendIndicator = (trend) => {
    switch (trend) {
      case 'increasing': return { icon: <TrendingUp className="h-4 w-4 text-red-600" />, text: 'Increasing', color: 'text-red-600' };
      case 'decreasing': return { icon: <TrendingDown className="h-4 w-4 text-green-600" />, text: 'Decreasing', color: 'text-green-600' };
      default: return { icon: <span className="text-neutral-500">→</span>, text: 'Stable', color: 'text-neutral-500' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-neutral-900">Heatmap & Urgency</h1>
            <p className="text-neutral-600 mt-1 text-sm">View heatmap status and urgency levels across barangays</p>
          </div>
          <select
            value={selectedBarangay}
            onChange={(e) => setSelectedBarangay(e.target.value)}
            className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm"
          >
            <option value="all">All Barangays</option>
            {barangayData.map((b) => (
              <option key={b.name} value={b.name}>{b.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-green-50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="text-sm font-medium text-green-700">Safe</span>
          </div>
          <p className="text-2xl font-bold text-green-900">{stats.safe}</p>
        </div>
        <div className="bg-amber-50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="h-5 w-5 text-amber-600" />
            <span className="text-sm font-medium text-amber-700">Moderate</span>
          </div>
          <p className="text-2xl font-bold text-amber-900">{stats.moderate}</p>
        </div>
        <div className="bg-red-50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <span className="text-sm font-medium text-red-700">High</span>
          </div>
          <p className="text-2xl font-bold text-red-900">{stats.high}</p>
        </div>
        <div className="bg-red-100 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-5 w-5 text-red-800" />
            <span className="text-sm font-medium text-red-800">Critical</span>
          </div>
          <p className="text-2xl font-bold text-red-900">{stats.critical}</p>
        </div>
        <div className="bg-neutral-50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Map className="h-5 w-5 text-neutral-600" />
            <span className="text-sm font-medium text-neutral-700">Total</span>
          </div>
          <p className="text-2xl font-bold text-neutral-900">{stats.total}</p>
        </div>
      </div>

      {/* Real Map */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
        <div className="flex items-center gap-2 mb-4">
          <Map className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-bold text-neutral-900">Pollution Heatmap</h2>
        </div>
        <div className="w-full h-96 rounded-xl overflow-hidden border border-neutral-200">
          {mapReady && (
            <MapContainer
              center={MAP_CENTER}
              zoom={MAP_ZOOM}
              style={{ height: '100%', width: '100%' }}
              scrollWheelZoom={true}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {barangays.map((barangay) => (
                <CircleMarker
                  key={barangay.name}
                  center={[barangay.lat, barangay.lng]}
                  radius={getRadius(barangay.pollution)}
                  fillColor={getPollutionColor(barangay.pollution)}
                  color={getPollutionColor(barangay.pollution)}
                  weight={2}
                  opacity={0.8}
                  fillOpacity={0.4}
                >
                  <Tooltip direction="top" offset={[0, -10]} permanent={false}>
                    <div>
                      <strong>{barangay.name}</strong><br />
                      Pollution: {barangay.pollution}%<br />
                      Status: {barangay.status}
                    </div>
                  </Tooltip>
                  <Popup>
                    <div className="text-sm">
                      <h3 className="font-bold mb-2">{barangay.name}</h3>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div>
                          <p className="text-xs text-neutral-600">Pollution</p>
                          <p className="font-bold" style={{ color: getPollutionColor(barangay.pollution) }}>
                            {barangay.pollution}%
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-neutral-600">Ammonia</p>
                          <p className="font-bold">{barangay.ammonia} ppm</p>
                        </div>
                        <div>
                          <p className="text-xs text-neutral-600">Methane</p>
                          <p className="font-bold">{barangay.methane} ppm</p>
                        </div>
                      </div>
                    </div>
                  </Popup>
                </CircleMarker>
              ))}
            </MapContainer>
          )}
        </div>
      </div>

      {/* Barangay Details */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200">
        <div className="p-6 border-b border-neutral-200">
          <h2 className="text-lg font-bold text-neutral-900">Barangay Monitoring Details</h2>
        </div>
        <div className="divide-y divide-neutral-200">
          {barangays.map((barangay, index) => {
            const trend = getTrendIndicator(barangay.trend);
            return (
              <div key={index} className="p-6 hover:bg-neutral-50 transition-colors">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      {getStatusIcon(barangay.status)}
                      <div>
                        <h3 className="font-semibold text-neutral-900">{barangay.name}</h3>
                        <div className={`flex items-center gap-1 text-sm ${trend.color}`}>
                          {trend.icon}
                          <span>{trend.text}</span>
                        </div>
                      </div>
                    </div>
                    <div className="mb-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-neutral-600">Pollution Level</span>
                        <span className="text-sm font-bold text-neutral-900">{barangay.pollution}%</span>
                      </div>
                      <div className="w-full bg-neutral-200 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full transition-all ${
                            barangay.pollution > 80 ? 'bg-red-500' :
                            barangay.pollution > 50 ? 'bg-amber-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${barangay.pollution}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-xs text-neutral-600">Ammonia</p>
                      <p className="text-lg font-bold text-neutral-900">{barangay.ammonia}</p>
                      <p className="text-xs text-neutral-500">ppm</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-neutral-600">Methane</p>
                      <p className="text-lg font-bold text-neutral-900">{barangay.methane}</p>
                      <p className="text-xs text-neutral-500">ppm</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-neutral-600">CO₂</p>
                      <p className="text-lg font-bold text-neutral-900">{barangay.co2}</p>
                      <p className="text-xs text-neutral-500">ppm</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HeatmapPage;
