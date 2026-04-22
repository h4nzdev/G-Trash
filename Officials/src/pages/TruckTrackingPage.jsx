import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { RefreshCw, Truck } from "lucide-react";
import { useEffect, useState } from "react";
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import api from "../services/apiClient";
import routesService from "../services/routesService";

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// Custom truck icon
function createTruckIcon(color = "#22C55E") {
  // Smaller marker to avoid clipping; uses centered anchor
  const size = 28; // px
  const border = 2; // px
  const svgSize = 16;
  return L.divIcon({
    className: "custom-truck-marker",
    html: `
      <div style="
        background: white;
        border: ${border}px solid ${color};
        border-radius: 50%;
        width: ${size}px;
        height: ${size}px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 6px rgba(0,0,0,0.18);
      ">
        <svg xmlns="http://www.w3.org/2000/svg" width="${svgSize}" height="${svgSize}" viewBox="0 0 24 24" fill="${color}" stroke="${color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M5 18H3c-.6 0-1-.4-1-1V7c0-.6.4-1 1-1h10c.6 0 1 .4 1 1v11"/>
          <path d="M14 9h4l4 4v4c0 .6-.4 1-1 1h-2"/>
          <circle cx="7" cy="18" r="2"/>
          <path d="M15 18H9"/>
          <circle cx="17" cy="18" r="2"/>
        </svg>
      </div>
    ",
    iconSize: [size, size],
    iconAnchor: [Math.round(size / 2), Math.round(size / 2)],
    popupAnchor: [0, -Math.round(size / 2) - 2],
  });
}

// Cebu City center
const CEBU_CENTER = [10.3157, 123.8854];
const DEFAULT_ZOOM = 13;

// Map fit component to auto-center on truck locations
function MapFit({ trucks, routes }) {
  const map = useMap();
  useEffect(() => {
    if (trucks.length > 0) {
      const bounds = L.latLngBounds(
        trucks.map((t) => [t.latitude, t.longitude]),
      );
      map.fitBounds(bounds, { padding: [50, 50] });
    } else if (routes.length > 0) {
      const allCoords = routes.flatMap((r) => {
        if (r.boundaryCoords) {
          try {
            const coords =
              typeof r.boundaryCoords === "string"
                ? JSON.parse(r.boundaryCoords)
                : r.boundaryCoords;
            return coords.map((c) => [c.latitude, c.longitude]);
          } catch {
            return [];
          }
        }
        return [];
      });
      if (allCoords.length > 0) {
        map.fitBounds(L.latLngBounds(allCoords), { padding: [50, 50] });
      }
    }
  }, [trucks, routes, map]);
  return null;
}

// Component to show truck details in a sidebar panel
function TruckDetailsPanel({ trucks, routes, selectedTruck, onSelectTruck }) {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "online":
      case "active":
        return "bg-green-100 text-green-800";
      case "idle":
        return "bg-amber-100 text-amber-800";
      case "offline":
        return "bg-neutral-100 text-neutral-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-neutral-100 text-neutral-800";
    }
  };

  const getStatusFromLastUpdated = (lastUpdatedAt) => {
    if (!lastUpdatedAt) return "Offline";
    const minutesAgo = (Date.now() - new Date(lastUpdatedAt).getTime()) / 60000;
    if (minutesAgo < 5) return "Active";
    if (minutesAgo < 30) return "Idle";
    return "Offline";
  };

  if (selectedTruck) {
    const truck = trucks.find((t) => t.id === selectedTruck);
    if (!truck) return null;

    const status =
      truck.user_status || getStatusFromLastUpdated(truck.last_updated_at);
    const route = routes.find((r) => r.id === truck.route_id);

    return (
      <div className="bg-white rounded-xl p-4 shadow-sm border border-neutral-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-neutral-900">
            {truck.truck_number || truck.id}
          </h3>
          <button
            onClick={() => onSelectTruck(null)}
            className="text-neutral-400 hover:text-neutral-600"
          >
            ×
          </button>
        </div>
        <div className="space-y-2 text-sm">
          <p>
            <span className="font-medium">Collector:</span>{" "}
            {truck.user_name || "Unassigned"}
          </p>
          <p>
            <span className="font-medium">Route:</span>{" "}
            {truck.route_name || "N/A"}
          </p>
          <p>
            <span className="font-medium">Status:</span>{" "}
            <span
              className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(status)}`}
            >
              {status}
            </span>
          </p>
          <p>
            <span className="font-medium">Phone:</span>{" "}
            {truck.user_phone || "N/A"}
          </p>
          {truck.speed && (
            <p>
              <span className="font-medium">Speed:</span> {truck.speed} km/h
            </p>
          )}
          {truck.progress_percentage && (
            <p>
              <span className="font-medium">Progress:</span>{" "}
              {Math.round(truck.progress_percentage)}%
            </p>
          )}
          <p className="text-xs text-neutral-500">
            Updated:{" "}
            {truck.last_updated_at
              ? new Date(truck.last_updated_at).toLocaleTimeString()
              : "Never"}
          </p>
        </div>
        {route?.stops && (
          <div className="mt-3 pt-3 border-t border-neutral-200">
            <p className="font-medium text-sm mb-2">
              Route Stops ({route.stops.length})
            </p>
            <div className="max-h-40 overflow-y-auto space-y-1">
              {route.stops.map((stop, idx) => (
                <div key={idx} className="text-xs text-neutral-600 py-1">
                  {idx + 1}. {stop.name} {stop.time && `(${stop.time})`}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-neutral-200">
      <h3 className="font-bold text-neutral-900 mb-3">Active Trucks</h3>
      {trucks.length === 0 ? (
        <p className="text-sm text-neutral-500">No trucks currently active</p>
      ) : (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {trucks.map((truck) => {
            const status =
              truck.user_status ||
              getStatusFromLastUpdated(truck.last_updated_at);
            return (
              <button
                key={truck.id}
                onClick={() => onSelectTruck(truck.id)}
                className="w-full text-left p-3 rounded-lg hover:bg-neutral-50 transition-colors border border-neutral-100"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-neutral-900">
                    {truck.truck_number || truck.id}
                  </span>
                  <span
                    className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(status)}`}
                  >
                    {status}
                  </span>
                </div>
                <p className="text-xs text-neutral-600 mt-1">
                  {truck.route_name || "No route"}
                </p>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

const TruckTrackingPage = () => {
  const [trucks, setTrucks] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState("all");
  const [selectedTruck, setSelectedTruck] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch truck locations from api client and routes via routesService
      const locationsPromise = api.get("/trucks/locations");
      const routesPromise = routesService.getRoutes();

      const [locationsRes, routesData] = await Promise.all([
        locationsPromise,
        routesPromise,
      ]);

      if (locationsRes?.data?.success) {
        setTrucks(locationsRes.data.data || []);
      }
      setRoutes(routesData || []);

      // If user hasn't chosen a route yet, prefer the Lahug route (match by name)
      if (
        (selectedRoute === "all" || !selectedRoute) &&
        Array.isArray(routesData) &&
        routesData.length > 0
      ) {
        const lahugRoute = routesData.find(
          (r) => r.name && r.name.toLowerCase().includes("lahug"),
        );
        if (lahugRoute) setSelectedRoute(lahugRoute.id);
      }

      // For routes without boundary coords, attempt to compute geometry via OpenRouteService
      try {
        const enriched = await Promise.all(
          (routesData || []).map(async (r) => {
            if (!r) return r;
            if (r.boundaryCoords && r.boundaryCoords.length > 0) return r;
            if (!r.stops || r.stops.length < 2) return r;
            try {
              const geom = await routesService.getOpenRouteGeometry(r);
              if (geom && geom.length > 0) {
                // attach as boundaryCoords in same shape used elsewhere
                // keep original if present
                r.boundaryCoords = geom;
              }
            } catch (err) {
              console.warn("ORS geometry fetch failed for route", r.id, err);
            }
            return r;
          }),
        );
        setRoutes(enriched || routesData || []);
      } catch (err) {
        console.warn("Failed to enrich routes with ORS geometry", err);
      }

      setLastUpdated(new Date());
    } catch (err) {
      console.error("Failed to fetch truck data:", err);
      setError("Failed to load truck data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Auto-refresh every 15 seconds to get latest truck locations
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, []);

  const getStatusFromLastUpdated = (lastUpdatedAt) => {
    if (!lastUpdatedAt) return "Offline";
    const minutesAgo = (Date.now() - new Date(lastUpdatedAt).getTime()) / 60000;
    if (minutesAgo < 5) return "Active";
    if (minutesAgo < 30) return "Idle";
    return "Offline";
  };

  const filteredTrucks =
    selectedRoute === "all"
      ? trucks
      : trucks.filter(
          (t) => t.route_id === selectedRoute || t.route_name === selectedRoute,
        );

  const filteredRoutes =
    selectedRoute === "all"
      ? routes
      : routes.filter(
          (r) => r.id === selectedRoute || r.name === selectedRoute,
        );

  const stats = {
    total: trucks.length,
    active: trucks.filter((t) => {
      const status =
        t.user_status || getStatusFromLastUpdated(t.last_updated_at);
      return (
        status?.toLowerCase() === "active" || status?.toLowerCase() === "online"
      );
    }).length,
    idle: trucks.filter((t) => {
      const status =
        t.user_status || getStatusFromLastUpdated(t.last_updated_at);
      return status?.toLowerCase() === "idle";
    }).length,
    offline: trucks.filter((t) => {
      const status =
        t.user_status || getStatusFromLastUpdated(t.last_updated_at);
      return status?.toLowerCase() === "offline";
    }).length,
  };

  return (
    <div className="h-screen flex flex-col bg-neutral-50">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200 px-6 py-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">
              Garbage Truck Tracking
            </h1>
            <p className="text-neutral-600 text-sm">
              Real-time truck locations and route monitoring
            </p>
          </div>
          <div className="flex items-center gap-4">
            <select
              value={selectedRoute}
              onChange={(e) => {
                setSelectedRoute(e.target.value);
                setSelectedTruck(null);
              }}
              className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm"
            >
              <option value="all">All Routes</option>
              {routes.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
            <button
              onClick={fetchData}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
            >
              <RefreshCw
                className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
              />
              <span className="text-sm font-medium">Refresh</span>
            </button>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="flex gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-neutral-400"></div>
            <span className="text-sm text-neutral-700">
              Total: {stats.total}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-sm text-neutral-700">
              Active: {stats.active}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
            <span className="text-sm text-neutral-700">Idle: {stats.idle}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-sm text-neutral-700">
              Offline: {stats.offline}
            </span>
          </div>
          {lastUpdated && (
            <span className="text-xs text-neutral-500 ml-auto">
              Updated: {lastUpdated.toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border-b border-red-200 px-6 py-3 text-red-700 text-sm flex-shrink-0">
          {error}
        </div>
      )}

      {/* Main Content - Map and Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        {/* Map Area */}
        <div className="flex-1 relative">
          {isLoading && trucks.length === 0 ? (
            <div className="w-full h-full bg-white flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4 mx-auto"></div>
                <p className="text-neutral-600">Loading truck data...</p>
              </div>
            </div>
          ) : filteredTrucks.length === 0 && filteredRoutes.length === 0 ? (
            <div className="w-full h-full bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
              <div className="text-center">
                <Truck className="h-16 w-16 text-neutral-400 mx-auto mb-4" />
                <p className="text-neutral-600 font-medium">
                  No trucks currently active
                </p>
                <p className="text-sm text-neutral-500 mt-1">
                  Trucks will appear on the map when active
                </p>
              </div>
            </div>
          ) : (
            <MapContainer
              center={CEBU_CENTER}
              zoom={DEFAULT_ZOOM}
              style={{ height: "100%", width: "100%" }}
              scrollWheelZoom={true}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MapFit trucks={filteredTrucks} routes={filteredRoutes} />

              {/* Route Polylines */}
              {filteredRoutes.map((route) => {
                let coords = [];
                if (route.boundaryCoords) {
                  try {
                    const parsed =
                      typeof route.boundaryCoords === "string"
                        ? JSON.parse(route.boundaryCoords)
                        : route.boundaryCoords;
                    coords = parsed.map((c) => [
                      c.latitude || c.lat,
                      c.longitude || c.lng,
                    ]);
                  } catch {
                    coords = [];
                  }
                }
                if (
                  coords.length === 0 &&
                  route.stops &&
                  route.stops.length > 0
                ) {
                  coords = route.stops.map((s) => [s.latitude, s.longitude]);
                }
                if (coords.length < 2) return null;

                return (
                  <Polyline
                    key={route.id}
                    positions={coords}
                    color={route.color_hex || "#22C55E"}
                    weight={4}
                    opacity={0.7}
                  />
                );
              })}

              {/* Truck Markers */}
              {filteredTrucks.map((truck) => {
                if (!truck.latitude || !truck.longitude) return null;

                const userStatus = truck.user_status;
                const computedStatus = getStatusFromLastUpdated(
                  truck.last_updated_at,
                );
                let markerColor = "#9CA3AF";
                if (userStatus === "online") {
                  markerColor = "#22C55E";
                } else if (computedStatus === "Active") {
                  markerColor = "#22C55E";
                } else if (computedStatus === "Idle") {
                  markerColor = "#F59E0B";
                }

                const isSelected = selectedTruck === truck.id;

                return (
                  <Marker
                    key={truck.id}
                    position={[truck.latitude, truck.longitude]}
                    icon={createTruckIcon(markerColor)}
                    eventHandlers={{
                      click: () => setSelectedTruck(truck.id),
                    }}
                  >
                    <Popup>
                      <div className="text-sm min-w-[200px]">
                        <h3 className="font-bold text-neutral-900 mb-2 text-base">
                          {truck.truck_number || truck.id}
                        </h3>
                        <p className="text-sm text-neutral-600">
                          <span className="font-medium">Collector:</span>{" "}
                          {truck.user_name || "Unassigned"}
                        </p>
                        <div className="space-y-1">
                          <p className="text-neutral-700">
                            <span className="font-medium">Route:</span>{" "}
                            {truck.route_name || "N/A"}
                          </p>
                          <p className="text-neutral-700">
                            <span className="font-medium">Status:</span>{" "}
                            <span
                              className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                                userStatus === "online"
                                  ? "bg-green-100 text-green-800"
                                  : computedStatus === "Active"
                                    ? "bg-green-100 text-green-800"
                                    : computedStatus === "Idle"
                                      ? "bg-amber-100 text-amber-800"
                                      : "bg-neutral-100 text-neutral-800"
                              }`}
                            >
                              {userStatus || computedStatus}
                            </span>
                          </p>
                          <p className="text-neutral-700">
                            <span className="font-medium">Phone:</span>{" "}
                            {truck.user_phone || "N/A"}
                          </p>
                          {truck.speed !== undefined &&
                            truck.speed !== null && (
                              <p className="text-neutral-700">
                                <span className="font-medium">Speed:</span>{" "}
                                {truck.speed} km/h
                              </p>
                            )}
                          {truck.progress_percentage !== undefined &&
                            truck.progress_percentage !== null && (
                              <p className="text-neutral-700">
                                <span className="font-medium">Progress:</span>{" "}
                                {Math.round(truck.progress_percentage)}%
                              </p>
                            )}
                          {truck.last_updated_at && (
                            <p className="text-xs text-neutral-500 mt-2">
                              Updated:{" "}
                              {new Date(
                                truck.last_updated_at,
                              ).toLocaleTimeString()}
                            </p>
                          )}
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
          )}
        </div>

        {/* Sidebar */}
        <div className="w-80 bg-white border-l border-neutral-200 p-4 overflow-y-auto flex-shrink-0">
          <TruckDetailsPanel
            trucks={filteredTrucks}
            routes={filteredRoutes}
            selectedTruck={selectedTruck}
            onSelectTruck={setSelectedTruck}
          />
        </div>
      </div>
    </div>
  );
};

export default TruckTrackingPage;
