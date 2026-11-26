const BASE_FEE_CENTS = 599;
const PER_MILE_CENTS = 150;
const EXTRA_STOP_CENTS = 300;
function priceQuote(miles, extraStops = 0) {
  return BASE_FEE_CENTS + Math.round(miles * PER_MILE_CENTS) + extraStops * EXTRA_STOP_CENTS;
}
function routeMiles(points) {
  if (points.length < 2 || points.some((p) => !p)) return null;
  let total = 0;
  for (let i = 1; i < points.length; i++) {
    total += haversineMiles(points[i - 1], points[i]);
  }
  return Math.max(1, Math.round(total));
}
function haversineMiles(a, b) {
  const R = 3958.8;
  const toRad = (n) => n * Math.PI / 180;
  const [lng1, lat1] = a;
  const [lng2, lat2] = b;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}
function fmtUSD(cents) {
  return `$${(cents / 100).toFixed(2)}`;
}
export {
  BASE_FEE_CENTS as B,
  EXTRA_STOP_CENTS as E,
  PER_MILE_CENTS as P,
  fmtUSD as f,
  priceQuote as p,
  routeMiles as r
};
