export type RouteStop = {
  role: "pickup" | "dropoff";
  address: string;
  lat?: number | null;
  lng?: number | null;
};

export function parseRouteStops(value: unknown): RouteStop[] {
  if (!Array.isArray(value)) return [];
  const stops: RouteStop[] = [];
  for (const item of value) {
    if (!item || typeof item !== "object") continue;
    const row = item as Record<string, unknown>;
    const role = row.role === "dropoff" ? "dropoff" : row.role === "pickup" ? "pickup" : null;
    const address = typeof row.address === "string" ? row.address.trim() : "";
    if (!role || address.length < 3) continue;
    stops.push({
      role,
      address,
      lat: typeof row.lat === "number" ? row.lat : null,
      lng: typeof row.lng === "number" ? row.lng : null,
    });
  }
  return stops;
}

export function orderedAddresses(pickup: string, dropoff: string, stops: RouteStop[]) {
  const extraPickups = stops.filter((s) => s.role === "pickup").map((s) => s.address);
  const extraDropoffs = stops.filter((s) => s.role === "dropoff").map((s) => s.address);
  return {
    pickups: [pickup, ...extraPickups].filter((a) => a.trim()),
    dropoffs: [dropoff, ...extraDropoffs].filter((a) => a.trim()),
  };
}

export function mapsDirectionsUrl(addresses: string[]) {
  const clean = addresses.map((a) => a.trim()).filter(Boolean);
  if (clean.length === 0) return "https://www.google.com/maps";
  if (clean.length === 1) {
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(clean[0])}`;
  }
  const origin = encodeURIComponent(clean[0]);
  const destination = encodeURIComponent(clean[clean.length - 1]);
  const waypoints = clean.slice(1, -1).map(encodeURIComponent).join("|");
  const waypointQuery = waypoints ? `&waypoints=${waypoints}` : "";
  return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}${waypointQuery}`;
}
