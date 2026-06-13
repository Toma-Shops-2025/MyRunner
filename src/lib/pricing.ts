export function priceQuote(miles: number, extraStops = 0) {
  const base = 599;
  const perMile = 150;
  const stop = 300;
  return base + Math.round(miles * perMile) + extraStops * stop;
}

export function fmtUSD(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}
