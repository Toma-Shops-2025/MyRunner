export const BASE_FEE_CENTS = 599;
export const PER_MILE_CENTS = 150;
export const EXTRA_STOP_CENTS = 300;

export function priceQuote(miles: number, extraStops = 0) {
  return BASE_FEE_CENTS + Math.round(miles * PER_MILE_CENTS) + extraStops * EXTRA_STOP_CENTS;
}

/** Mapbox centers are [lng, lat]. Returns null when any point is missing. */
export function routeMiles(points: Array<[number, number] | null>): number | null {
  if (points.length < 2 || points.some((p) => !p)) return null;
  let total = 0;
  for (let i = 1; i < points.length; i++) {
    total += haversineMiles(points[i - 1]!, points[i]!);
  }
  return Math.max(1, Math.round(total));
}

function haversineMiles(a: [number, number], b: [number, number]) {
  const R = 3958.8;
  const toRad = (n: number) => (n * Math.PI) / 180;
  const [lng1, lat1] = a;
  const [lng2, lat2] = b;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function fmtUSD(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}
