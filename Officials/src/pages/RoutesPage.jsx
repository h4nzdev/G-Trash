import React from 'react';
import { Route, MapPin, Clock, Truck, ChevronRight } from 'lucide-react';

const RoutesPage = () => {
  const routes = [
    {
      id: 'route-1',
      name: 'Lahug Route',
      barangay: 'Brgy. Lahug',
      stops: ['Ayala Center', 'SM City Cebu', 'IT Park', 'Banilad', 'Lahug Proper'],
      distance: '12.5 km',
      duration: '4 hours',
      schedule: '7:00 AM - 11:00 AM',
      truck: 'GT-101',
      status: 'Active',
      coverage: 85,
    },
    {
      id: 'route-2',
      name: 'Apas Route',
      barangay: 'Brgy. Apas',
      stops: ['Apas Market', 'Kasambagan', 'Pasil', 'Mambaling', 'Tisa'],
      distance: '10.8 km',
      duration: '4 hours',
      schedule: '6:00 AM - 10:00 AM',
      truck: 'GT-102',
      status: 'Active',
      coverage: 72,
    },
    {
      id: 'route-3',
      name: 'Guadalupe Route',
      barangay: 'Brgy. Guadalupe',
      stops: ['Guadalupe Church', 'Mabolo', 'Paknaan', 'Mandaue Border', 'Cabancalan'],
      distance: '14.2 km',
      duration: '4.5 hours',
      schedule: '8:00 AM - 12:30 PM',
      truck: 'GT-103',
      status: 'Completed',
      coverage: 100,
    },
    {
      id: 'route-4',
      name: 'Capitol Route',
      barangay: 'Brgy. Capitol',
      stops: ['Capitol Site', 'Kamputhaw', 'San Nicolas', 'Ermita', 'Sambag'],
      distance: '9.5 km',
      duration: '3.5 hours',
      schedule: '9:00 AM - 12:30 PM',
      truck: 'GT-104',
      status: 'Pending',
      coverage: 0,
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Completed': return 'bg-blue-100 text-blue-800';
      case 'Pending': return 'bg-amber-100 text-amber-800';
      default: return 'bg-neutral-100 text-neutral-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
        <h1 className="text-3xl font-bold text-neutral-900">Barangay Routes</h1>
        <p className="text-neutral-600 mt-1">Collection routes and coverage areas</p>
      </div>

      {/* Routes List */}
      <div className="grid grid-cols-1 gap-6">
        {routes.map((route) => (
          <div key={route.id} className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary-muted rounded-xl flex items-center justify-center">
                  <Route className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-neutral-900">{route.name}</h3>
                  <p className="text-sm text-neutral-600">{route.barangay}</p>
                </div>
              </div>
              <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(route.status)}`}>
                {route.status}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="flex items-center gap-2 text-sm text-neutral-700">
                <MapPin className="h-4 w-4 text-primary" />
                <span>{route.distance}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-neutral-700">
                <Clock className="h-4 w-4 text-primary" />
                <span>{route.duration}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-neutral-700">
                <Truck className="h-4 w-4 text-primary" />
                <span>{route.truck}</span>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-neutral-700">Route Coverage</span>
                <span className="text-sm font-bold text-neutral-900">{route.coverage}%</span>
              </div>
              <div className="w-full bg-neutral-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all ${
                    route.coverage === 100 ? 'bg-blue-500' : 
                    route.coverage > 0 ? 'bg-primary' : 'bg-neutral-300'
                  }`}
                  style={{ width: `${route.coverage}%` }}
                />
              </div>
            </div>

            <div className="border-t border-neutral-200 pt-4">
              <h4 className="text-sm font-semibold text-neutral-900 mb-3">Collection Stops:</h4>
              <div className="space-y-2">
                {route.stops.map((stop, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs font-bold">{index + 1}</span>
                    </div>
                    <span className="text-sm text-neutral-700">{stop}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-neutral-200 flex items-center justify-between">
              <div className="text-sm text-neutral-600">
                Schedule: <span className="font-medium text-neutral-900">{route.schedule}</span>
              </div>
              <button className="flex items-center gap-1 text-sm text-primary hover:text-primary-dark font-medium">
                View on Map
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoutesPage;
