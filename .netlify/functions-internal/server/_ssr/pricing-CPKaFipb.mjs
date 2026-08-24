function priceQuote(miles, extraStops = 0) {
  const base = 599;
  const perMile = 150;
  const stop = 300;
  return base + Math.round(miles * perMile) + extraStops * stop;
}
function fmtUSD(cents) {
  return `$${(cents / 100).toFixed(2)}`;
}
export {
  fmtUSD as f,
  priceQuote as p
};
