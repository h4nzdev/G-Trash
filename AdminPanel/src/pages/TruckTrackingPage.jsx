import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { Truck, Map, TrendingUp, Calendar, Filter } from 'lucide-react';
import { truckData, MAP_CENTER, MAP_ZOOM } from '../data/mapData';

// Custom truck icons
const createTruckIcon = (status) => {
  const color = status === 'Active' ? '#10b981' : status === 'Completed' ? '#3b82f6' : '#f59e0b';
  return L.divIcon({
    className: 'custom-truck-marker',
    html: `<div style="
      background-color: ${color};
      width: 36px;
      height: 36px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 3px solid white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    ">
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 17h4V5H2v12h3"/><path d="M20 17h2v-3.34a4 4 0 0 0-1.17-2.83L19 9h-5"/><path d="M14 17h1"/><circle cx="7.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>
    </div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18],
  });
};

const TruckTrackingPage = () => {
  const [filterStatus, setFilterStatus] = useState('all');
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    setMapReady(true);
  }, []);

  const stats = {
    total: truckData.length,
    active: truckData.filter(t => t.status === 'Active').length,
    completed: truckData.filter(t => t.status === 'Completed').length,
    maintenance: truckData.filter(t => t.status === 'Maintenance').length,
    totalCollected: truckData.reduce((sum, t) => sum + t.trashCollected, 0),
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Completed': return 'bg-blue-100 text-blue-800';
      case 'Maintenance': return 'bg-amber-100 text-amber-800';
      default: return 'bg-neutral-100 text-neutral-800';
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'Active': return '#10b981';
      case 'Completed': return '#3b82f6';
      case 'Maintenance': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const filteredTrucks = filterStatus === 'all'
    ? truckData
    : truckData.filter(t => t.status === filterStatus);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-neutral-900">Truck Tracking</h1>
            <p className="text-neutral-600 mt-1 text-sm">Track number of garbage trucks deployed and their status</p>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm"
            >
              <option value="all">All Status</option>
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
              <option value="Maintenance">Maintenance</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-neutral-50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Truck className="h-5 w-5 text-neutral-600" />
            <span className="text-sm font-medium text-neutral-700">Total</span>
          </div>
          <p className="text-2xl font-bold text-neutral-900">{stats.total}</p>
        </div>
        <div className="bg-green-50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            <span className="text-sm font-medium text-green-700">Active</span>
          </div>
          <p className="text-2xl font-bold text-green-900">{stats.active}</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">Completed</span>
          </div>
          <p className="text-2xl font-bold text-blue-900">{stats.completed}</p>
        </div>
        <div className="bg-amber-50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Filter className="h-5 w-5 text-amber-600" />
            <span className="text-sm font-medium text-amber-700">Maintenance</span>
          </div>
          <p className="text-2xl font-bold text-amber-900">{stats.maintenance}</p>
        </div>
        <div className="bg-primary-muted rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-primary">Collected</span>
          </div>
          <p className="text-2xl font-bold text-primary">{stats.totalCollected} kg</p>
        </div>
      </div>

      {/* Real Map */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
        <div className="flex items-center gap-2 mb-4">
          <Map className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-bold text-neutral-900">Live Truck Locations</h2>
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
              {filteredTrucks.map((truck) => (
                <Marker
                  key={truck.id}
                  position={[truck.lat, truck.lng]}
                  icon={createTruckIcon(truck.status)}
                >
                  <Popup>
                    <div className="text-sm min-w-[180px]">
                      <div className="flex items-center gap-2 mb-2">
                        <Truck className="h-4 w-4 text-primary" />
                        <h3 className="font-bold">{truck.id}</h3>
                        <span
                          className="px-2 py-0.5 text-xs rounded-full text-white"
                          style={{ backgroundColor: getStatusBadgeColor(truck.status) }}
                        >
                          {truck.status}
                        </span>
                      </div>
                      <p className="text-neutral-600 mb-2">{truck.driver}</p>
                      <div className="space-y-1 text-xs">
                        <p><strong>Route:</strong> {truck.route}</p>
                        <p><strong>Progress:</strong> {truck.progress}%</p>
                        <p><strong>Collected:</strong> {truck.trashCollected} kg</p>
                        <p><strong>Time:</strong> {truck.departureTime} → {truck.eta}</p>
                      </div>
                      <div className="mt-2 w-full bg-neutral-200 rounded-full h-1.5">
                        <div
                          className="bg-primary h-1.5 rounded-full"
                          style={{ width: `${truck.progress}%` }}
                        />
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          )}
        </div>
      </div>

      {/* Truck Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredTrucks.map((truck) => (
          <div key={truck.id} className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary-muted rounded-xl flex items-center justify-center">
                  <Truck className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-neutral-900">{truck.id}</h3>
                  <p className="text-sm text-neutral-600">{truck.driver}</p>
                </div>
              </div>
              <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(truck.status)}`}>
                {truck.status}
              </span>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-2 text-sm text-neutral-700">
                <Map className="h-4 w-4 text-primary" />
                <span>{truck.route}</span>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-neutral-600">Route Progress</span>
                <span className="text-sm font-bold text-neutral-900">{truck.progress}%</span>
              </div>
              <div className="w-full bg-neutral-200 rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${truck.progress}%` }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-sm text-neutral-700">{truck.trashCollected} kg collected</span>
              </div>
              <div className="text-sm text-neutral-500">
                {truck.departureTime} → {truck.eta}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TruckTrackingPage;
