/**
 * Minimal localStorage-backed store for the demo build. Replace with a
 * real backend (Lovable Cloud / Supabase) when wiring production data.
 */
export type Role = "customer" | "driver";

export type User = {
  id: string;
  email: string;
  name: string;
  role: Role;
  createdAt: number;
};

export type Order = {
  id: string;
  customerId: string;
  pickup: string;
  dropoff: string;
  item: string;
  type: "standard" | "multi-pickup" | "multi-dropoff";
  status: "pending" | "accepted" | "picked_up" | "in_transit" | "delivered" | "cancelled";
  priceCents: number;
  tipCents: number;
  createdAt: number;
};

const KEY_USER = "mr.user";
const KEY_ORDERS = "mr.orders";
const KEY_BLOCKED = "mr.blocked_drivers";
const KEY_PREFERRED = "mr.preferred_drivers";

function safe<T>(read: () => T, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try { return read(); } catch { return fallback; }
}

export const store = {
  getUser(): User | null {
    return safe(() => {
      const raw = localStorage.getItem(KEY_USER);
      return raw ? (JSON.parse(raw) as User) : null;
    }, null);
  },
  setUser(u: User | null) {
    if (typeof window === "undefined") return;
    if (u) localStorage.setItem(KEY_USER, JSON.stringify(u));
    else localStorage.removeItem(KEY_USER);
  },
  getOrders(): Order[] {
    return safe(() => {
      const raw = localStorage.getItem(KEY_ORDERS);
      return raw ? (JSON.parse(raw) as Order[]) : [];
    }, []);
  },
  addOrder(o: Order) {
    if (typeof window === "undefined") return;
    const all = store.getOrders();
    all.unshift(o);
    localStorage.setItem(KEY_ORDERS, JSON.stringify(all));
  },
  blockedDrivers(): string[] {
    return safe(() => JSON.parse(localStorage.getItem(KEY_BLOCKED) ?? "[]") as string[], []);
  },
  blockDriver(code: string) {
    if (typeof window === "undefined") return;
    const list = Array.from(new Set([...store.blockedDrivers(), code]));
    localStorage.setItem(KEY_BLOCKED, JSON.stringify(list));
  },
  unblockDriver(code: string) {
    if (typeof window === "undefined") return;
    const list = store.blockedDrivers().filter((c) => c !== code);
    localStorage.setItem(KEY_BLOCKED, JSON.stringify(list));
  },
  preferredDrivers(): string[] {
    return safe(() => JSON.parse(localStorage.getItem(KEY_PREFERRED) ?? "[]") as string[], []);
  },
  setPreferredDrivers(list: string[]) {
    if (typeof window === "undefined") return;
    localStorage.setItem(KEY_PREFERRED, JSON.stringify(list));
  },
  wipeAll() {
    if (typeof window === "undefined") return;
    [KEY_USER, KEY_ORDERS, KEY_BLOCKED, KEY_PREFERRED].forEach((k) =>
      localStorage.removeItem(k),
    );
  },
};

export function priceQuote(miles: number, extraStops = 0) {
  const base = 599;
  const perMile = 150;
  const stop = 300;
  return base + Math.round(miles * perMile) + extraStops * stop;
}

export function fmtUSD(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}
