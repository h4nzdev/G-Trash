import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  LayoutDashboard,
  BarChart3,
  Map,
  Truck,
  Route,
  Calendar,
  Bell,
  Trophy,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  BarChart,
} from "lucide-react";

const DashboardLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Data Reports", href: "/dashboard/reports", icon: BarChart3 },
    { name: "Analytics", href: "/dashboard/analytics", icon: BarChart },
    { name: "Heatmap", href: "/dashboard/heatmap", icon: Map },
    { name: "Truck Tracking", href: "/dashboard/trucks", icon: Truck },
    { name: "Routes", href: "/dashboard/routes", icon: Route },
    { name: "Schedules", href: "/dashboard/schedules", icon: Calendar },
    { name: "Notifications", href: "/dashboard/notifications", icon: Bell },
    { name: "Leaderboard", href: "/dashboard/leaderboard", icon: Trophy },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => {
    if (path === "/dashboard") {
      return location.pathname === "/dashboard";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-neutral-200/80 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl hover:bg-neutral-100 transition-all duration-200"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-neutral-700" />
            ) : (
              <Menu className="h-6 w-6 text-neutral-700" />
            )}
          </button>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-sm">G</span>
            </div>
            <span className="font-bold text-lg text-neutral-900 tracking-tight">
              G-TRASH
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-gold rounded-full flex items-center justify-center shadow-sm">
            <span className="text-white font-bold text-xs">
              {user?.fullName?.charAt(0)}
            </span>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen transition-all duration-300 ease-in-out bg-white border-r border-neutral-200/80 shadow-lg ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 ${sidebarOpen ? "w-64" : "w-20"}`}
      >
        <div className="flex flex-col h-full">
          {/* Logo Area */}
          <div className="flex items-center justify-between px-4 py-5 border-b border-neutral-200/80">
            {sidebarOpen && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-sm">
                  <span className="text-white font-bold text-xl">G</span>
                </div>
                <div>
                  <h1 className="font-bold text-lg text-neutral-900 tracking-tight">
                    G-TRASH
                  </h1>
                  <p className="text-xs text-neutral-500">Officials Portal</p>
                </div>
              </div>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden lg:flex p-2 rounded-xl hover:bg-neutral-100 transition-all duration-200"
            >
              {sidebarOpen ? (
                <ChevronLeft className="h-5 w-5 text-neutral-500" />
              ) : (
                <ChevronRight className="h-5 w-5 text-neutral-500" />
              )}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                    active
                      ? "bg-primary text-white shadow-md"
                      : "text-neutral-700 hover:bg-neutral-100"
                  }`}
                >
                  <Icon
                    className={`h-5 w-5 flex-shrink-0 transition-transform duration-200 group-hover:scale-105 ${
                      active ? "text-white" : "text-neutral-500"
                    }`}
                  />
                  {sidebarOpen && (
                    <span
                      className={`font-medium text-sm transition-all duration-200 ${
                        active ? "text-white" : "text-neutral-700"
                      }`}
                    >
                      {item.name}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User Info Area */}
          <div className="p-4 border-t border-neutral-200/80">
            {sidebarOpen ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 px-2 py-2">
                  <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                    <span className="text-white font-bold">
                      {user?.fullName?.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-neutral-900 truncate">
                      {user?.fullName}
                    </p>
                    <p className="text-xs text-neutral-500 truncate">
                      {user?.barangay}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-all duration-200"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="font-medium text-sm">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center shadow-sm">
                  <span className="text-white font-bold">
                    {user?.fullName?.charAt(0)}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-all duration-200"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div
        className={`transition-all duration-300 ease-in-out ${
          sidebarOpen ? "lg:ml-64" : "lg:ml-20"
        }`}
      >
        {/* Top Navigation Spacer (Mobile) */}
        <div className="lg:hidden h-16" />

        {/* Main Content */}
        <main className="min-h-screen">
          <div className="w-full max-w-full px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
