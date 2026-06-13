import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, useCallback, useRef } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { MapPin, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { fmtUSD } from "@/lib/pricing";
import { toast } from "sonner";
import { setDriverPresence, acceptOffer, declineOffer } from "@/lib/dispatch.functions";

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

type Offer = {
  id: string;
  order_id: string;
  driver_id: string;
  expires_at: string;
  status: string;
};

function DriverDashboard() {
  const { user } = useAuth();
  const [online, setOnline] = useState(false);
  const [pool, setPool] = useState<Order[]>([]);
  const [mine, setMine] = useState<Order[]>([]);
  const [completed, setCompleted] = useState<Order[]>([]);
  const [rating, setRating] = useState<{ avg: number; count: number }>({ avg: 0, count: 0 });
  const [payoutsEnabled, setPayoutsEnabled] = useState<boolean | null>(null);
  const [bgStatus, setBgStatus] = useState<"pending" | "clear" | "failed">("pending");
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(true);
  const [currentOffer, setCurrentOffer] = useState<(Offer & { order?: Order }) | null>(null);
  const [offerSecondsLeft, setOfferSecondsLeft] = useState(0);

  const presenceFn = useServerFn(setDriverPresence);
  const acceptFn = useServerFn(acceptOffer);
  const declineFn = useServerFn(declineOffer);

  const lastLocRef = useRef<{ lat: number; lng: number } | null>(null);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const [poolRes, mineRes, doneRes, ratingsRes, profileRes] = await Promise.all([
      // Fallback-pool orders: dispatcher couldn't place these, any driver can grab
      supabase
        .from("orders")
        .select("*")
        .eq("dispatch_status", "fallback_pool")
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
      supabase
        .from("profiles")
        .select("payouts_enabled, background_check_status, is_active, driver_status")
        .eq("id", user.id)
        .maybeSingle(),
    ]);
    setPool((poolRes.data ?? []) as Order[]);
    setMine((mineRes.data ?? []) as Order[]);
    setCompleted((doneRes.data ?? []) as Order[]);
    const stars = (ratingsRes.data ?? []).map((r: { stars: number }) => r.stars);
    setRating({
      avg: stars.length ? stars.reduce((a, b) => a + b, 0) / stars.length : 0,
      count: stars.length,
    });
    const prof = profileRes.data as {
      payouts_enabled?: boolean;
      background_check_status?: "pending" | "clear" | "failed";
      is_active?: boolean;
      driver_status?: string;
    } | null;
    setPayoutsEnabled(Boolean(prof?.payouts_enabled));
    setBgStatus(prof?.background_check_status ?? "pending");
    setIsActive(prof?.is_active ?? true);
    setOnline(prof?.driver_status === "online");
    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (!user) return;
    load();
    const ch = supabase
      .channel("driver-feed")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, () => load())
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [user, load]);

  // Realtime: listen for incoming offers for me
  useEffect(() => {
    if (!user) return;
    const fetchPending = async () => {
      const { data } = await supabase
        .from("offers")
        .select("*")
        .eq("driver_id", user.id)
        .eq("status", "pending")
        .order("offered_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (data && new Date(data.expires_at).getTime() > Date.now()) {
        const { data: order } = await supabase.from("orders").select("*").eq("id", data.order_id).maybeSingle();
        setCurrentOffer({ ...(data as Offer), order: (order ?? undefined) as Order | undefined });
        // Beep + vibrate
        try {
          const AC = (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext);
          const ctx = new AC();
          const osc = ctx.createOscillator();
          osc.frequency.value = 880;
          osc.connect(ctx.destination);
          osc.start();
          setTimeout(() => { osc.stop(); ctx.close(); }, 250);
        } catch { /* ignore */ }
        if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
      }
    };
    fetchPending();
    const ch = supabase
      .channel(`offers-${user.id}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "offers", filter: `driver_id=eq.${user.id}` },
        () => fetchPending(),
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "offers", filter: `driver_id=eq.${user.id}` },
        () => fetchPending(),
      )
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [user]);

  // Offer countdown
  useEffect(() => {
    if (!currentOffer) { setOfferSecondsLeft(0); return; }
    const update = () => {
      const left = Math.max(0, Math.ceil((new Date(currentOffer.expires_at).getTime() - Date.now()) / 1000));
      setOfferSecondsLeft(left);
      if (left <= 0) setCurrentOffer(null);
    };
    update();
    const t = setInterval(update, 250);
    return () => clearInterval(t);
  }, [currentOffer]);

  // Geolocation pings while online
  useEffect(() => {
    if (!online || !user) return;
    if (!("geolocation" in navigator)) return;
    const send = (lat: number, lng: number) => {
      lastLocRef.current = { lat, lng };
      presenceFn({ data: { status: "online", lat, lng } }).catch(() => {});
    };
    navigator.geolocation.getCurrentPosition(
      (p) => send(p.coords.latitude, p.coords.longitude),
      () => {},
      { enableHighAccuracy: true, timeout: 8000 },
    );
    const watchId = navigator.geolocation.watchPosition(
      (p) => send(p.coords.latitude, p.coords.longitude),
      () => {},
      { enableHighAccuracy: true, maximumAge: 15000 },
    );
    const interval = setInterval(() => {
      const loc = lastLocRef.current;
      if (loc) presenceFn({ data: { status: "online", lat: loc.lat, lng: loc.lng } }).catch(() => {});
    }, 20_000);
    return () => {
      navigator.geolocation.clearWatch(watchId);
      clearInterval(interval);
    };
  }, [online, user, presenceFn]);

  const canAccept = payoutsEnabled === true && isActive && bgStatus !== "failed";

  async function toggleOnline(next: boolean) {
    if (next && !canAccept) {
      if (!payoutsEnabled) return toast.error("Finish Stripe payout setup before going online.");
      if (bgStatus === "failed" || !isActive) return toast.error("Your account is deactivated. Contact support.");
    }
    setOnline(next);
    try {
      await presenceFn({ data: { status: next ? "online" : "offline" } });
      toast.success(next ? "You're online." : "You're offline.");
    } catch {
      setOnline(!next);
      toast.error("Couldn't update status.");
    }
  }

  async function handleAccept() {
    if (!currentOffer) return;
    try {
      await acceptFn({ data: { offerId: currentOffer.id } });
      toast.success("Order accepted — head to pickup.");
      setCurrentOffer(null);
      load();
    } catch (e) {
      toast.error((e as Error).message);
      setCurrentOffer(null);
    }
  }
  async function handleDecline() {
    if (!currentOffer) return;
    try {
      await declineFn({ data: { offerId: currentOffer.id } });
    } catch { /* ignore */ }
    setCurrentOffer(null);
  }

  async function claim(o: Order) {
    if (!user) return;
    if (!canAccept) {
      if (!payoutsEnabled) return toast.error("Finish Stripe payout setup before accepting orders.");
      if (bgStatus === "failed" || !isActive) return toast.error("Your account is deactivated. Contact support.");
    }
    const { error } = await supabase
      .from("orders")
      .update({ driver_id: user.id, status: "accepted", dispatch_status: "assigned" })
      .eq("id", o.id)
      .is("driver_id", null);
    if (error) return toast.error(error.message);
    toast.success("Order claimed. Head to pickup.");
    load();
  }

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
          <p className="text-sm text-muted-foreground">Toggle online to receive offers. You'll get one offer at a time with 45 seconds to accept.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button size="sm" variant="ghost" onClick={load} aria-label="Refresh">
            <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
          <Label htmlFor="online" className={online ? "text-gold" : "text-muted-foreground"}>
            {online ? "Online" : "Offline"}
          </Label>
          <Switch id="online" checked={online} onCheckedChange={toggleOnline} />
        </div>
      </div>

      {(bgStatus === "failed" || !isActive) && (
        <div className="rounded-2xl border border-destructive/40 bg-destructive/10 p-5">
          <p className="font-serif text-lg text-destructive">Account deactivated</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Your background check returned a result that doesn't meet our standards. You can't accept orders right now.
            Contact <a href="/contact" className="underline text-destructive">support</a> if you believe this is a mistake.
          </p>
        </div>
      )}

      {payoutsEnabled === false && bgStatus !== "failed" && isActive && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gold/40 bg-gold-soft p-5">
          <div>
            <p className="font-serif text-lg text-gold">Finish payout setup before accepting orders</p>
            <p className="text-sm text-muted-foreground">
              You're activated as a Runner — but you can't accept orders or get paid until Stripe Connect is complete (70% of fee + 100% of tips).
            </p>
          </div>
          <Button asChild className="bg-gold text-primary-foreground hover:bg-gold/90">
            <Link to="/driver/earnings">Set up payouts</Link>
          </Button>
        </div>
      )}

      {bgStatus === "pending" && payoutsEnabled === true && isActive && (
        <div className="rounded-2xl border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
          Background check in progress. You can accept and complete orders while it's running. If a disqualifying result comes back, your account will be deactivated automatically.
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
        <h2 className="font-serif text-2xl">Open orders</h2>
        <p className="text-sm text-muted-foreground">
          {online
            ? "Orders that couldn't be auto-assigned show up here for any driver to grab."
            : "You're offline — toggle on to receive offers."}
        </p>
        {!online ? null : pool.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-dashed border-border p-12 text-center text-sm text-muted-foreground">
            No open orders. New deliveries will be offered to you directly.
          </div>
        ) : (
          <ul className="mt-4 space-y-3">
            {pool.map((o) => <OrderCard key={o.id} order={o} onClaim={() => claim(o)} canAccept={canAccept} />)}
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

      <Dialog open={!!currentOffer} onOpenChange={(open) => { if (!open) handleDecline(); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl">New delivery offer</DialogTitle>
            <DialogDescription>
              {offerSecondsLeft}s to accept · attempt {currentOffer?.order ? `for ${currentOffer.order.distance_miles ?? "?"} mi` : ""}
            </DialogDescription>
          </DialogHeader>
          {currentOffer?.order && (
            <div className="space-y-3">
              <div className="rounded-xl border border-gold/40 bg-gold-soft p-4 text-center">
                <p className="font-serif text-4xl text-gold">
                  {fmtUSD(currentOffer.order.price_cents + currentOffer.order.tip_cents)}
                </p>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Total payout (incl. tip)</p>
              </div>
              <div className="space-y-1 text-sm">
                <p><span className="text-muted-foreground">Item:</span> {currentOffer.order.item_description}</p>
                <p><span className="text-muted-foreground">Pickup:</span> {currentOffer.order.pickup_address}</p>
                <p><span className="text-muted-foreground">Drop:</span> {currentOffer.order.dropoff_address}</p>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full bg-gold transition-all"
                  style={{ width: `${Math.max(0, (offerSecondsLeft / 45) * 100)}%` }}
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={handleDecline}>Decline</Button>
                <Button className="flex-1 bg-gold text-primary-foreground hover:bg-gold/90" onClick={handleAccept}>
                  Accept · {offerSecondsLeft}s
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
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

function OrderCard({ order, mine, onClaim, canAccept = true }: { order: Order; mine?: boolean; onClaim?: () => void; canAccept?: boolean }) {
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
            <Button
              size="sm"
              className="mt-2 bg-gold text-primary-foreground hover:bg-gold/90"
              onClick={onClaim}
              disabled={!canAccept}
              title={canAccept ? "" : "Complete payout setup to accept orders"}
            >
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
