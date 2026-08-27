/** TEMP for testing — restore to 599 ($5.99) when done. */
export const BASE_FEE_CENTS = 0;
export const PER_MILE_CENTS = 150;
export const EXTRA_STOP_CENTS = 300;

export function priceQuote(miles: number, extraStops = 0) {
  return BASE_FEE_CENTS + Math.round(miles * PER_MILE_CENTS) + extraStops * EXTRA_STOP_CENTS;
}

export function fmtUSD(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}
