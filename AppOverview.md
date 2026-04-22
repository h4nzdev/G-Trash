# Gtrash — App Overview

Gtrash is a multi-app platform for city waste management and tracking. It includes separate apps and web panels for residents, garbage truck drivers, municipal officials, and administrators. The system combines mobile apps (Resident, GarbageTruck) with backend services and web dashboards (Officials, AdminPanel) to manage reporting, routing, tracking, analytics, and notifications.

**Key system pieces**
- **Resident app**: Mobile app for citizens to view schedules, report issues, and follow local waste information.
- **GarbageTruck app**: Driver/vehicle app for route guidance, location tracking, and schedule updates.
- **Officials app**: Web/React app for municipal staff to monitor routes, view reports, manage schedules, and run analytics.
- **AdminPanel**: Admin dashboard for high-level analytics, heatmaps, truck tracking, and managing collection workflows.
- **Backend services**: Express/Node backends (present in multiple projects) provide APIs for auth, reports, trucks, schedules, notifications, and analytics.

---

**Role: Resident**
- **Report incidents**: Submit waste, pollution, or issue reports (photos/uploads supported by backend upload endpoints).
- **View schedule**: See local collection schedules and calendar reminders.
- **Track route / heatmap**: View heatmaps or route overlays showing collection coverage and hotspots.
- **Notifications**: Receive push or in-app notifications about schedule changes, collection status, or community alerts.
- **Profile & auth**: Login/register flow, user profile management, and basic account settings.
- **Learn & resources**: Pages for guidance, tips, and educational material about proper waste disposal.

Files & hints: `Resident/app` (auth, tabs, reports, calendar), backend controllers `reports.controller.js`, `schedules.controller.js`, `waste.controller.js`.

**Role: GarbageTruck (Driver)**
- **Assigned routes**: View and follow assigned route segments and turn-by-turn guidance (route breakdown in `routes.service` / `routes.controller`).
- **Schedule management**: See today's schedule, mark stops done/undone, and report exceptions.
- **Location tracking**: Continuous location updates sent to backend for live-tracking on dashboards.
- **Vehicle profile & status**: Manage truck metadata and status updates (available, on-route, paused).
- **Upload & diagnostics**: Upload images, logs, or incident notes for problematic stops.

Files & hints: `GarbageTruck/app` (tabs: routes, schedule, heatmap), services under `services/api` and backend `trucks.controller.js`, `schedules.controller.js`.

**Role: Officials**
- **Dashboard & analytics**: Overview dashboards with usage analytics, KPIs, and trend charts (`AnalyticsPage.jsx`, backend `analytics.controller.js`).
- **Reports management**: View incoming resident reports, mark for follow-up, and route to crews (`reports.routes.js`, `reports.controller.js`).
- **Schedules & routes**: Create/adjust collection schedules and routes; push updates to truck crews.
- **Notifications**: Broadcast notices and coordinate alerts to residents and drivers.
- **Truck tracking & heatmaps**: Live truck positions and heatmap visualizations to identify under-served areas.

Files & hints: `Officials/src/pages` (AnalyticsPage, ReportsPage, RoutesPage, SchedulesPage), backend routes `analytics.routes.js`, `trucks.routes.js`, `schedules.routes.js`.

**Role: AdminPanel (Administrator)**
- **High-level monitoring**: Global dashboard for system status, active trucks, recent incidents, and summary metrics.
- **Heatmap & map tools**: Visual tools for inspecting coverage, planning, and optimizing routes (`HeatmapPage.jsx`, mapping components).
- **Bug & report tracker**: Access and triage bug reports and system feedback (`BugReportsPage.jsx`).
- **Truck & collection operations**: Manage collection zones, assign crews, and monitor real-time progress (`TruckTrackingPage.jsx`, `TrashCollectionPage.jsx`).
- **User & settings management**: Configure application settings, notifications, and authentication/roles.

Files & hints: `AdminPanel/src/pages` (DashboardPage, TrashCollectionPage, TruckTrackingPage, BugReportsPage, NotificationsPage), `AdminPanel/src/components` (DashboardLayout, ProtectedRoute).

---

Notes & next steps
- The README files in each subproject are generic templates; feature details were inferred from the apps' source structure (pages, controllers, services). For a full, authoritative spec, open these entry points:
  - Resident: [Resident/app](Resident/app)
  - GarbageTruck: [GarbageTruck/app](GarbageTruck/app)
  - Officials frontend: [Officials/src/pages](Officials/src/pages)
  - AdminPanel frontend: [AdminPanel/src/pages](AdminPanel/src/pages)
- I can generate a more detailed feature matrix (endpoints, UI screens, API contracts) if you want — tell me which area to expand first.
