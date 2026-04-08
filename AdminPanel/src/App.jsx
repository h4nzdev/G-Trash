import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import TrashCollectionPage from './pages/TrashCollectionPage';
import HeatmapPage from './pages/HeatmapPage';
import TruckTrackingPage from './pages/TruckTrackingPage';
import AnalyticsPage from './pages/AnalyticsPage';
import BugReportsPage from './pages/BugReportsPage';
import NotificationsPage from './pages/NotificationsPage';
import SettingsPage from './pages/SettingsPage';

const DashboardRoutes = () => (
  <ProtectedRoute>
    <DashboardLayout>
      <Routes>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/dashboard/trash" element={<TrashCollectionPage />} />
        <Route path="/dashboard/heatmap" element={<HeatmapPage />} />
        <Route path="/dashboard/trucks" element={<TruckTrackingPage />} />
        <Route path="/dashboard/analytics" element={<AnalyticsPage />} />
        <Route path="/dashboard/bugs" element={<BugReportsPage />} />
        <Route path="/dashboard/notifications" element={<NotificationsPage />} />
        <Route path="/dashboard/settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </DashboardLayout>
  </ProtectedRoute>
);

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/*" element={<DashboardRoutes />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
