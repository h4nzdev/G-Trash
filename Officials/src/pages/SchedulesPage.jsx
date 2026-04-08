import React from 'react';
import { Calendar, Clock, Truck, MapPin, Plus } from 'lucide-react';

const SchedulesPage = () => {
  const schedules = [
    {
      id: 1,
      date: '2026-03-24',
      day: 'Monday',
      time: '7:00 AM - 11:00 AM',
      route: 'Brgy. Lahug → SM → Ayala',
      truck: 'GT-101',
      driver: 'Juan Dela Cruz',
      status: 'Completed',
    },
    {
      id: 2,
      date: '2026-03-24',
      day: 'Monday',
      time: '8:00 AM - 12:00 PM',
      route: 'Brgy. Apas → Kasambagan',
      truck: 'GT-102',
      driver: 'Pedro Santos',
      status: 'In Progress',
    },
    {
      id: 3,
      date: '2026-03-25',
      day: 'Tuesday',
      time: '6:00 AM - 10:00 AM',
      route: 'Brgy. Budlaan → Guadalupe',
      truck: 'GT-103',
      driver: 'Maria Garcia',
      status: 'Scheduled',
    },
    {
      id: 4,
      date: '2026-03-25',
      day: 'Tuesday',
      time: '9:00 AM - 1:00 PM',
      route: 'Brgy. Capitol → Kamputhaw',
      truck: 'GT-104',
      driver: 'Carlos Reyes',
      status: 'Scheduled',
    },
    {
      id: 5,
      date: '2026-03-26',
      day: 'Wednesday',
      time: '7:00 AM - 11:00 AM',
      route: 'Brgy. Lahug → IT Park',
      truck: 'GT-101',
      driver: 'Juan Dela Cruz',
      status: 'Scheduled',
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Scheduled': return 'bg-amber-100 text-amber-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-neutral-100 text-neutral-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">Collection Schedules</h1>
            <p className="text-neutral-600 mt-1">Manage and view collection schedules</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors">
            <Plus className="h-5 w-5" />
            <span className="hidden md:inline text-sm font-medium">Add Schedule</span>
          </button>
        </div>
      </div>

      {/* Calendar View Placeholder */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold text-neutral-900">Calendar View</h2>
        </div>
        <div className="w-full h-64 bg-neutral-50 rounded-xl flex items-center justify-center border-2 border-dashed border-neutral-300">
          <div className="text-center">
            <Calendar className="h-12 w-12 text-neutral-400 mx-auto mb-2" />
            <p className="text-neutral-600 font-medium">Interactive Calendar</p>
            <p className="text-sm text-neutral-500 mt-1">Integrate with react-calendar or fullcalendar</p>
          </div>
        </div>
      </div>

      {/* Schedule List */}
      <div className="bg-white rounded-2xl shadow-sm border border-neutral-200">
        <div className="p-6 border-b border-neutral-200">
          <h2 className="text-xl font-bold text-neutral-900">Upcoming Schedules</h2>
        </div>
        <div className="divide-y divide-neutral-200">
          {schedules.map((schedule) => (
            <div key={schedule.id} className="p-6 hover:bg-neutral-50 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-primary-muted rounded-lg flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-neutral-900">{schedule.day}</h3>
                      <p className="text-sm text-neutral-600">{schedule.date}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                    <div className="flex items-center gap-2 text-sm text-neutral-700">
                      <Clock className="h-4 w-4 text-primary" />
                      <span>{schedule.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-neutral-700">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span>{schedule.route}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-neutral-700">
                      <Truck className="h-4 w-4 text-primary" />
                      <span>{schedule.truck} - {schedule.driver}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(schedule.status)}`}>
                    {schedule.status}
                  </span>
                  <button className="text-sm text-primary hover:text-primary-dark font-medium">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SchedulesPage;
