function parseRouteStops(value) {
  if (!Array.isArray(value)) return [];
  const stops = [];
  for (const item of value) {
    if (!item || typeof item !== "object") continue;
    const row = item;
    const role = row.role === "dropoff" ? "dropoff" : row.role === "pickup" ? "pickup" : null;
    const address = typeof row.address === "string" ? row.address.trim() : "";
    if (!role || address.length < 3) continue;
    stops.push({
      role,
      address,
      lat: typeof row.lat === "number" ? row.lat : null,
      lng: typeof row.lng === "number" ? row.lng : null
    });
  }
  return stops;
}
function orderedAddresses(pickup, dropoff, stops) {
  const extraPickups = stops.filter((s) => s.role === "pickup").map((s) => s.address);
  const extraDropoffs = stops.filter((s) => s.role === "dropoff").map((s) => s.address);
  return {
    pickups: [pickup, ...extraPickups].filter((a) => a.trim()),
    dropoffs: [dropoff, ...extraDropoffs].filter((a) => a.trim())
  };
}
function mapsDirectionsUrl(addresses) {
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
export {
  mapsDirectionsUrl as m,
  orderedAddresses as o,
  parseRouteStops as p
};
