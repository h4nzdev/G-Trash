import React, { useState } from 'react';
import { Map as MapIcon, Filter, AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

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

const HeatmapPage = () => {
  const [selectedBarangay, setSelectedBarangay] = useState('all');

  // Barangay data with coordinates (Cebu City area)
  const barangays = [
    { name: 'Brgy. Lahug', lat: 10.3328, lng: 123.9010, pollution: 72, status: 'Moderate', trend: 'stable', ammonia: 2.3, methane: 4.1, co2: 380 },
    { name: 'Brgy. Apas', lat: 10.3050, lng: 123.8920, pollution: 85, status: 'High', trend: 'increasing', ammonia: 3.8, methane: 5.9, co2: 420 },
    { name: 'Brgy. Kasambagan', lat: 10.3180, lng: 123.8950, pollution: 45, status: 'Safe', trend: 'decreasing', ammonia: 1.2, methane: 2.3, co2: 340 },
    { name: 'Brgy. Budlaan', lat: 10.3420, lng: 123.8850, pollution: 68, status: 'Moderate', trend: 'increasing', ammonia: 2.8, methane: 4.5, co2: 390 },
    { name: 'Brgy. Capitol', lat: 10.3150, lng: 123.8900, pollution: 38, status: 'Safe', trend: 'stable', ammonia: 0.9, methane: 1.8, co2: 320 },
    { name: 'Brgy. Guadalupe', lat: 10.2980, lng: 123.8820, pollution: 55, status: 'Moderate', trend: 'stable', ammonia: 1.9, methane: 3.2, co2: 360 },
  ];

  const getCircleColor = (status) => {
    switch (status) {
      case 'Safe': return '#4CAF50';
      case 'Moderate': return '#FFC107';
      case 'High': return '#F44336';
      case 'Critical': return '#B71C1C';
      default: return '#9CA3AF';
    }
  };

  const getCircleFillColor = (status) => {
    switch (status) {
      case 'Safe': return '#4CAF50';
      case 'Moderate': return '#FFC107';
      case 'High': return '#F44336';
      case 'Critical': return '#B71C1C';
      default: return '#9CA3AF';
    }
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
      case 'increasing': return '↑ Increasing';
      case 'decreasing': return '↓ Decreasing';
      case 'stable': return '→ Stable';
      default: return '→ Stable';
    }
  };

  const filteredBarangays = selectedBarangay === 'all'
    ? barangays
    : barangays.filter(b => b.name === selectedBarangay);

  const filteredForMap = selectedBarangay === 'all' ? barangays : filteredBarangays;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-neutral-900">Pollution Heatmap</h1>
            <p className="text-neutral-600 mt-1 text-sm">Real-time air quality monitoring across barangays</p>
          </div>
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
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-3 lg:gap-4 mt-4">
          <div className="bg-green-50 rounded-lg p-3 lg:p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-4 w-4 lg:h-5 lg:w-5 text-green-600" />
              <span className="text-xs lg:text-sm font-medium text-green-700">Safe</span>
            </div>
            <p className="text-xl lg:text-2xl font-bold text-green-900">
              {barangays.filter(b => b.status === 'Safe').length}
            </p>
          </div>
          <div className="bg-amber-50 rounded-lg p-3 lg:p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="h-4 w-4 lg:h-5 lg:w-5 text-amber-600" />
              <span className="text-xs lg:text-sm font-medium text-amber-700">Moderate</span>
            </div>
            <p className="text-xl lg:text-2xl font-bold text-amber-900">
              {barangays.filter(b => b.status === 'Moderate').length}
            </p>
          </div>
          <div className="bg-red-50 rounded-lg p-3 lg:p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 lg:h-5 lg:w-5 text-red-600" />
              <span className="text-xs lg:text-sm font-medium text-red-700">High</span>
            </div>
            <p className="text-xl lg:text-2xl font-bold text-red-900">
              {barangays.filter(b => b.status === 'High').length}
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Map */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
        <div className="p-4 lg:p-6 border-b border-neutral-200">
          <div className="flex items-center gap-2">
            <MapIcon className="h-5 w-5 text-primary" />
            <h2 className="text-lg lg:text-xl font-bold text-neutral-900">Map View - Cebu City</h2>
          </div>
        </div>
        <div className="relative" style={{ height: '450px' }}>
          <MapContainer
            center={CEBU_CENTER}
            zoom={DEFAULT_ZOOM}
            style={{ height: '100%', width: '100%' }}
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapFit barangays={filteredForMap} />
            {filteredForMap.map((barangay, index) => (
              <CircleMarker
                key={index}
                center={[barangay.lat, barangay.lng]}
                radius={15 + (barangay.pollution / 10)}
                fillColor={getCircleFillColor(barangay.status)}
                color={getCircleColor(barangay.status)}
                weight={2}
                opacity={0.8}
                fillOpacity={0.6}
              >
                <Popup>
                  <div className="text-sm">
                    <h3 className="font-bold text-neutral-900 mb-1">{barangay.name}</h3>
                    <div className="space-y-1">
                      <p className="flex items-center gap-1">
                        <span className="text-neutral-600">Pollution:</span>
                        <span className="font-semibold" style={{ color: getCircleColor(barangay.status) }}>
                          {barangay.pollution}%
                        </span>
                      </p>
                      <p className="flex items-center gap-1">
                        <span className="text-neutral-600">Status:</span>
                        <span className="font-semibold">{barangay.status}</span>
                      </p>
                      <p className="flex items-center gap-1">
                        <span className="text-neutral-600">Trend:</span>
                        <span className="font-semibold">{getTrendIndicator(barangay.trend)}</span>
                      </p>
                      <div className="pt-1 border-t border-neutral-200">
                        <p className="text-xs text-neutral-500">Ammonia: {barangay.ammonia} ppm</p>
                        <p className="text-xs text-neutral-500">Methane: {barangay.methane} ppm</p>
                        <p className="text-xs text-neutral-500">CO₂: {barangay.co2} ppm</p>
                      </div>
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>
      </div>

      {/* Legend */}
      <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm border border-neutral-200">
        <h3 className="text-base lg:text-lg font-bold text-neutral-900 mb-3">Legend</h3>
        <div className="flex flex-wrap gap-4 lg:gap-6">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-500"></div>
            <span className="text-sm text-neutral-700">Safe (0-50 AQI)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-amber-500"></div>
            <span className="text-sm text-neutral-700">Moderate (51-100 AQI)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-500"></div>
            <span className="text-sm text-neutral-700">High (101+ AQI)</span>
          </div>
        </div>
      </div>

      {/* Barangay Details */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200">
        <div className="p-4 lg:p-6 border-b border-neutral-200">
          <h2 className="text-lg lg:text-xl font-bold text-neutral-900">Barangay Monitoring Details</h2>
        </div>
        <div className="divide-y divide-neutral-200">
          {filteredBarangays.map((barangay, index) => (
            <div key={index} className="p-4 lg:p-6 hover:bg-neutral-50 transition-colors">
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    {getStatusIcon(barangay.status)}
                    <div>
                      <h3 className="font-semibold text-neutral-900">{barangay.name}</h3>
                      <p className="text-sm text-neutral-600">{getTrendIndicator(barangay.trend)}</p>
                    </div>
                  </div>
                  <div className="mb-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-neutral-600">Pollution Level</span>
                      <span className="text-sm font-bold text-neutral-900">{barangay.pollution}%</span>
                    </div>
                    <div className="w-full bg-neutral-200 rounded-full h-2 lg:h-3">
                      <div
                        className={`h-2 lg:h-3 rounded-full transition-all`}
                        style={{ width: `${barangay.pollution}%`, backgroundColor: getCircleColor(barangay.status) }}
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-xs text-neutral-600">Ammonia</p>
                    <p className="text-base lg:text-lg font-bold text-neutral-900">{barangay.ammonia}</p>
                    <p className="text-xs text-neutral-500">ppm</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-neutral-600">Methane</p>
                    <p className="text-base lg:text-lg font-bold text-neutral-900">{barangay.methane}</p>
                    <p className="text-xs text-neutral-500">ppm</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-neutral-600">CO₂</p>
                    <p className="text-base lg:text-lg font-bold text-neutral-900">{barangay.co2}</p>
                    <p className="text-xs text-neutral-500">ppm</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeatmapPage;
