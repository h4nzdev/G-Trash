import React from 'react';
import { Truck, MapPin, Clock, Navigation, Phone, CheckCircle } from 'lucide-react';

const TruckTrackingPage = () => {
  const trucks = [
    {
      id: 'GT-101',
      driver: 'Juan Dela Cruz',
      phone: '0917-123-4567',
      route: 'Brgy. Lahug → SM City → Ayala',
      status: 'Active',
      progress: 65,
      location: 'Near SM City Cebu',
      nextStop: 'Ayala Center',
      estimatedArrival: '10:30 AM',
      trashCollected: 450,
    },
    {
      id: 'GT-102',
      driver: 'Pedro Santos',
      phone: '0918-234-5678',
      route: 'Brgy. Apas → Kasambagan → Pardo',
      status: 'Active',
      progress: 40,
      location: 'Kasambagan Proper',
      nextStop: 'Pardo Market',
      estimatedArrival: '11:00 AM',
      trashCollected: 320,
    },
    {
      id: 'GT-103',
      driver: 'Maria Garcia',
      phone: '0919-345-6789',
      route: 'Brgy. Budlaan → Guadalupe → Mabolo',
      status: 'Completed',
      progress: 100,
      location: 'Depot',
      nextStop: 'N/A',
      estimatedArrival: 'N/A',
      trashCollected: 580,
    },
    {
      id: 'GT-104',
      driver: 'Carlos Reyes',
      phone: '0920-456-7890',
      route: 'Brgy. Capitol → Kamputhaw → San Nicolas',
      status: 'Active',
      progress: 20,
      location: 'Capitol Site',
      nextStop: 'Kamputhaw',
      estimatedArrival: '09:45 AM',
      trashCollected: 180,
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Completed': return 'bg-blue-100 text-blue-800';
      case 'Maintenance': return 'bg-amber-100 text-amber-800';
      default: return 'bg-neutral-100 text-neutral-800';
    }
  };

  const stats = {
    total: trucks.length,
    active: trucks.filter(t => t.status === 'Active').length,
    completed: trucks.filter(t => t.status === 'Completed').length,
    totalCollected: trucks.reduce((sum, t) => sum + t.trashCollected, 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">Garbage Truck Tracking</h1>
            <p className="text-neutral-600 mt-1">Real-time truck locations and status</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-neutral-50 rounded-lg p-4">
            <p className="text-sm text-neutral-600">Total Trucks</p>
            <p className="text-2xl font-bold text-neutral-900">{stats.total}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <p className="text-sm text-green-700">Active</p>
            <p className="text-2xl font-bold text-green-900">{stats.active}</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-blue-700">Completed</p>
            <p className="text-2xl font-bold text-blue-900">{stats.completed}</p>
          </div>
          <div className="bg-amber-50 rounded-lg p-4">
            <p className="text-sm text-amber-700">Total Collected</p>
            <p className="text-2xl font-bold text-amber-900">{stats.totalCollected} kg</p>
          </div>
        </div>
      </div>

      {/* Map Placeholder */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold text-neutral-900">Live Map</h2>
        </div>
        <div className="w-full h-80 bg-gradient-to-br from-blue-50 to-green-50 rounded-xl flex items-center justify-center">
          <div className="text-center">
            <Truck className="h-16 w-16 text-neutral-400 mx-auto mb-4" />
            <p className="text-neutral-600 font-medium">Real-Time Truck Tracking Map</p>
            <p className="text-sm text-neutral-500 mt-1">Integrate with Google Maps for live GPS tracking</p>
          </div>
        </div>
      </div>

      {/* Truck Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {trucks.map((truck) => (
          <div key={truck.id} className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200 hover:shadow-md transition-shadow">
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
                <Navigation className="h-4 w-4 text-primary" />
                <span>{truck.route}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-neutral-700">
                <MapPin className="h-4 w-4 text-primary" />
                <span>{truck.location}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-neutral-700">
                <Clock className="h-4 w-4 text-primary" />
                <span>Next: {truck.nextStop} at {truck.estimatedArrival}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-neutral-700">
                <Phone className="h-4 w-4 text-primary" />
                <span>{truck.phone}</span>
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
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm text-neutral-700">{truck.trashCollected} kg collected</span>
              </div>
              <button className="text-sm text-primary hover:text-primary-dark font-medium">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TruckTrackingPage;
