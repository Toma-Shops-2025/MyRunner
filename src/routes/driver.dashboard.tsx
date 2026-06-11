import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { MapPin, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { fmtUSD } from "@/lib/pricing";
import { toast } from "sonner";

export const Route = createFileRoute("/driver/dashboard")({
  head: () => ({
    meta: [
      { title: "Driver dashboard — MyRunner" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: DriverDashboard,
});

type Order = {
  id: string;
  pickup_address: string;
  dropoff_address: string;
  item_description: string;
  notes: string | null;
  type: string;
  status: string;
  price_cents: number;
  tip_cents: number;
  distance_miles: number | null;
  created_at: string;
  driver_id: string | null;
};

function DriverDashboard() {
  const { user } = useAuth();
  const [online, setOnline] = useState(true);
  const [pool, setPool] = useState<Order[]>([]);
  const [mine, setMine] = useState<Order[]>([]);
  const [completed, setCompleted] = useState<Order[]>([]);
  const [rating, setRating] = useState<{ avg: number; count: number }>({ avg: 0, count: 0 });
  const [payoutsEnabled, setPayoutsEnabled] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);


  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const [poolRes, mineRes, doneRes, ratingsRes, profileRes] = await Promise.all([
      supabase
        .from("orders")
        .select("*")
        .eq("status", "pending")
        .eq("payment_status", "paid")
        .is("driver_id", null)
        .order("created_at", { ascending: false })
        .limit(50),
      supabase
        .from("orders")
        .select("*")
        .eq("driver_id", user.id)
        .in("status", ["accepted", "picked_up", "in_transit"])
        .order("created_at", { ascending: false }),
      supabase
        .from("orders")
        .select("*")
        .eq("driver_id", user.id)
        .eq("status", "delivered")
        .order("created_at", { ascending: false })
        .limit(100),
      supabase.from("ratings").select("stars").eq("ratee_id", user.id),
      supabase.from("profiles").select("payouts_enabled").eq("id", user.id).maybeSingle(),
    ]);
    setPool((poolRes.data ?? []) as Order[]);

    setMine((mineRes.data ?? []) as Order[]);
    setCompleted((doneRes.data ?? []) as Order[]);
    const stars = (ratingsRes.data ?? []).map((r: { stars: number }) => r.stars);
    setRating({
      avg: stars.length ? stars.reduce((a, b) => a + b, 0) / stars.length : 0,
      count: stars.length,
    });
    setPayoutsEnabled(Boolean((profileRes.data as { payouts_enabled?: boolean } | null)?.payouts_enabled));
    setLoading(false);
  }, [user]);




  useEffect(() => {
    if (!user) return;
    load();
    // realtime subscription so pool updates as customers pay
    const ch = supabase
      .channel("driver-feed")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, () => load())
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [user, load]);

  async function claim(o: Order) {
    if (!user) return;
    const { error } = await supabase
      .from("orders")
      .update({ driver_id: user.id, status: "accepted" })
      .eq("id", o.id)
      .is("driver_id", null);
    if (error) return toast.error(error.message);
    toast.success("Order claimed. Head to pickup.");
    load();
  }

  // Today's earnings = sum of price+tip on orders delivered today
  const todayMs = new Date(); todayMs.setHours(0, 0, 0, 0);
  const todayCents = completed
    .filter((o) => new Date(o.created_at) >= todayMs)
    .reduce((s, o) => s + o.price_cents + o.tip_cents, 0);
  const lifetimeCents = completed.reduce((s, o) => s + o.price_cents + o.tip_cents, 0);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card p-6">
        <div>
          <h1 className="font-serif text-3xl">Today</h1>
          <p className="text-sm text-muted-foreground">Toggle online to receive orders. New paid orders appear in real time.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button size="sm" variant="ghost" onClick={load} aria-label="Refresh">
            <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
          <Label htmlFor="online" className={online ? "text-gold" : "text-muted-foreground"}>
            {online ? "Online" : "Offline"}
          </Label>
          <Switch
            id="online"
            checked={online}
            onCheckedChange={(v) => { setOnline(v); toast.success(v ? "You're online." : "You're offline."); }}
          />
        </div>
      </div>

      {payoutsEnabled === false && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gold/40 bg-gold-soft p-5">
          <div>
            <p className="font-serif text-lg text-gold">Finish payout setup to get paid</p>
            <p className="text-sm text-muted-foreground">
              You can still accept orders, but payouts (70% of fee + 100% of tips) won't transfer until Stripe onboarding is complete.
            </p>
          </div>
          <Button asChild className="bg-gold text-primary-foreground hover:bg-gold/90">
            <Link to="/driver/earnings">Set up payouts</Link>
          </Button>
        </div>
      )}


      <div className="grid gap-4 sm:grid-cols-4">
        <Stat label="Today's earnings" value={fmtUSD(todayCents)} />
        <Stat label="Active" value={String(mine.length)} />
        <Stat label="Completed" value={String(completed.length)} />
        <Stat label="Rating" value={rating.count ? `${rating.avg.toFixed(2)} ★` : "—"} />
      </div>

      {mine.length > 0 && (
        <section>
          <h2 className="font-serif text-2xl">Your active deliveries</h2>
          <ul className="mt-4 space-y-3">
            {mine.map((o) => <OrderCard key={o.id} order={o} mine />)}
          </ul>
        </section>
      )}

      <section>
        <h2 className="font-serif text-2xl">Order feed</h2>
        <p className="text-sm text-muted-foreground">
          {online ? "Showing unclaimed, paid orders near you." : "You're offline — toggle on to see live orders."}
        </p>
        {!online ? null : pool.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-dashed border-border p-12 text-center text-sm text-muted-foreground">
            No open orders right now. New deliveries will appear here automatically.
          </div>
        ) : (
          <ul className="mt-4 space-y-3">
            {pool.map((o) => <OrderCard key={o.id} order={o} onClaim={() => claim(o)} />)}
          </ul>
        )}
      </section>

      {completed.length > 0 && (
        <section>
          <h2 className="font-serif text-2xl">Recent completed</h2>
          <p className="text-sm text-muted-foreground">Lifetime: {fmtUSD(lifetimeCents)} across {completed.length} deliveries.</p>
          <ul className="mt-4 divide-y divide-border rounded-2xl border border-border bg-card">
            {completed.slice(0, 8).map((o) => (
              <li key={o.id} className="flex items-center justify-between gap-4 px-5 py-3 text-sm">
                <div className="min-w-0">
                  <p className="truncate font-medium">{o.item_description}</p>
                  <p className="truncate text-xs text-muted-foreground">{o.pickup_address} → {o.dropoff_address}</p>
                </div>
                <p className="font-serif text-lg text-gold">{fmtUSD(o.price_cents + o.tip_cents)}</p>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <p className="font-serif text-3xl">{value}</p>
      <p className="text-xs uppercase tracking-widest text-muted-foreground">{label}</p>
    </div>
  );
}

function OrderCard({ order, mine, onClaim }: { order: Order; mine?: boolean; onClaim?: () => void }) {
  return (
    <li className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="font-serif text-lg">{order.item_description}</p>
          <p className="mt-1 text-sm"><span className="text-muted-foreground">Pickup:</span> {order.pickup_address}</p>
          <p className="text-sm"><span className="text-muted-foreground">Drop:</span> {order.dropoff_address}</p>
          {order.notes && <p className="mt-1 text-xs italic text-muted-foreground">"{order.notes}"</p>}
          <p className="mt-1 text-xs text-muted-foreground">
            {order.distance_miles ? `${order.distance_miles} mi · ` : ""}{order.type.replace("_", " ")}
          </p>
        </div>
        <div className="text-right">
          <p className="font-serif text-3xl text-gold">{fmtUSD(order.price_cents + order.tip_cents)}</p>
          {mine ? (
            <Button asChild size="sm" className="mt-2 bg-gold text-primary-foreground hover:bg-gold/90">
              <Link to="/app/orders/$id" params={{ id: order.id }}>Open</Link>
            </Button>
          ) : (
            <Button size="sm" className="mt-2 bg-gold text-primary-foreground hover:bg-gold/90" onClick={onClaim}>
              Accept
            </Button>
          )}
        </div>
      </div>
      {mine && (
        <div className="mt-4 flex flex-wrap gap-2 border-t border-border pt-4">
          <Button variant="outline" size="sm" asChild>
            <a target="_blank" rel="noreferrer" href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(order.pickup_address)}`}>
              <MapPin className="mr-1 size-3" /> Navigate to pickup
            </a>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <a target="_blank" rel="noreferrer" href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(order.dropoff_address)}`}>
              <MapPin className="mr-1 size-3" /> Navigate to drop-off
            </a>
          </Button>
        </div>
      )}
    </li>
  );
}
