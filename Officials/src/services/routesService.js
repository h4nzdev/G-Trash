import api from "./apiClient";

const ORS_API_KEY = import.meta.env.VITE_OPENROUTESERVICE_KEY || null;
const ORS_BASE = "https://api.openrouteservice.org";

const routesService = {
  async getRoutes(params) {
    const res = await api.get("/trucks/routes", { params });
    if (res?.data?.success) return res.data.data || [];
    throw new Error(res?.data?.message || "Failed to fetch routes");
  },

  async getRoute(id) {
    const res = await api.get(`/trucks/routes/${id}`);
    if (res?.data?.success) return res.data.data;
    throw new Error(res?.data?.message || "Failed to fetch route");
  },

  /**
   * Use OpenRouteService to compute a polyline (geojson coordinates)
   * for a route given its stops (expects route.stops = [{latitude, longitude}, ...] or {lat,lng}).
   * Returns an array of { latitude, longitude } or null if unable.
   */
  async getOpenRouteGeometry(route, profile = "driving-car") {
    if (!ORS_API_KEY) {
      throw new Error(
        "OpenRouteService API key not configured (VITE_OPENROUTESERVICE_KEY)",
      );
    }

    if (!route) return null;
    // Build coordinates array in [lng, lat] order for ORS
    const stops = route.stops || [];
    if (!Array.isArray(stops) || stops.length < 2) return null;

    const coordinates = stops
      .map((s) => {
        const lat = s.latitude ?? s.lat ?? s.latlng?.lat ?? null;
        const lng = s.longitude ?? s.lng ?? s.latlng?.lng ?? null;
        if (lat == null || lng == null) return null;
        return [lng, lat];
      })
      .filter(Boolean);

    if (coordinates.length < 2) return null;

    const url = `${ORS_BASE}/v2/directions/${profile}/geojson`;

    const body = { coordinates };

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: ORS_API_KEY,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`OpenRouteService error: ${res.status} ${text}`);
    }

    const data = await res.json();
    // data.features[0].geometry.coordinates is array of [lng, lat]
    const coords =
      data?.features?.[0]?.geometry?.coordinates?.map((c) => ({
        latitude: c[1],
        longitude: c[0],
      })) || null;

    return coords;
  },
};

export default routesService;
