import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LegalConsent } from "@/components/site/legal-consent";
import { AddressAutocomplete } from "@/components/site/address-autocomplete";
import { OrderMap } from "@/components/site/order-map";
import { priceQuote, fmtUSD } from "@/lib/pricing";
import { supabase } from "@/integrations/supabase/client";
import { createCheckoutSession } from "@/lib/checkout.functions";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";

export const Route = createFileRoute("/app/new-delivery")({
  head: () => ({ meta: [{ title: "New delivery — MyRunner" }, { name: "robots", content: "noindex" }] }),
  component: NewDelivery,
});

function NewDelivery() {
  const nav = useNavigate();
  const checkoutFn = useServerFn(createCheckoutSession);
  const [miles, setMiles] = useState(3);
  const [type, setType] = useState<"standard" | "multi_pickup" | "multi_dropoff">("standard");
  const [agree, setAgree] = useState(false);
  const [busy, setBusy] = useState(false);
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [pickupCoord, setPickupCoord] = useState<[number, number] | null>(null);
  const [dropoffCoord, setDropoffCoord] = useState<[number, number] | null>(null);
  const extraStops = type === "standard" ? 0 : 1;

  // Auto-compute miles when both points are selected (Haversine)
  const computedMiles = useMemo(() => {
    if (!pickupCoord || !dropoffCoord) return null;
    const R = 3958.8;
    const toRad = (n: number) => (n * Math.PI) / 180;
    const [lng1, lat1] = pickupCoord;
    const [lng2, lat2] = dropoffCoord;
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
    return Math.max(1, Math.round(2 * R * Math.asin(Math.sqrt(a))));
  }, [pickupCoord, dropoffCoord]);

  const effectiveMiles = computedMiles ?? miles;
  const total = useMemo(() => priceQuote(effectiveMiles, extraStops), [effectiveMiles, extraStops]);


  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-4xl">Send a delivery</h1>
        <p className="text-muted-foreground">Tell us what to move and where.</p>
      </div>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (!agree) return toast.error("Please confirm the order checkbox.");
          setBusy(true);
          const fd = new FormData(e.currentTarget);
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) { setBusy(false); return toast.error("Please sign in again."); }
          const { data: created, error } = await supabase.from("orders").insert({
            customer_id: user.id,
            pickup_address: pickup,
            dropoff_address: dropoff,
            item_description: String(fd.get("item")),
            type,
            price_cents: total,
            tip_cents: Math.round(Number(fd.get("tip") || 0) * 100),
            distance_miles: effectiveMiles,
          }).select("id").single();
          if (error || !created) { setBusy(false); return toast.error(error?.message ?? "Could not create order"); }

          // Immediately open Stripe Checkout to take payment
          const session = await checkoutFn({ data: { orderId: created.id } });
          if ("error" in session && session.error) {
            setBusy(false);
            toast.error(session.error);
            // Order exists but not paid — send them to its page where they can retry
            return nav({ to: "/app/orders/$id", params: { id: created.id } });
          }
          if ("url" in session && session.url) {
            window.location.href = session.url;
            return;
          }
          setBusy(false);
          toast.error("Could not start checkout.");
          nav({ to: "/app/orders/$id", params: { id: created.id } });
        }}
        className="grid gap-6 rounded-2xl border border-border bg-card p-8"
      >
        <div className="grid gap-2">
          <Label htmlFor="pickup">Pickup address</Label>
          <AddressAutocomplete
            id="pickup"
            name="pickup"
            placeholder="123 Main St, Apt 4B"
            required
            defaultValue={pickup}
            onSelect={(s) => { setPickup(s.place_name); setPickupCoord(s.center); }}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="item">What to grab</Label>
          <Textarea id="item" name="item" placeholder="A sealed envelope from the front desk" required rows={2} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="dropoff">Drop‑off address</Label>
          <AddressAutocomplete
            id="dropoff"
            name="dropoff"
            placeholder="456 Oak Ave"
            required
            defaultValue={dropoff}
            onSelect={(s) => { setDropoff(s.place_name); setDropoffCoord(s.center); }}
          />
        </div>

        {pickupCoord && dropoffCoord && (
          <OrderMap pickup={pickup} dropoff={dropoff} />
        )}
        <div className="grid gap-2">
          <Label>Delivery type</Label>
          <div className="grid gap-2 sm:grid-cols-3">
            {(["standard", "multi_pickup", "multi_dropoff"] as const).map((t) => (
              <button
                type="button"
                key={t}
                onClick={() => setType(t)}
                className={`rounded-lg border px-3 py-2 text-sm capitalize transition-colors ${
                  type === t ? "border-gold bg-gold/10 text-gold" : "border-border bg-card hover:border-gold/40"
                }`}
              >
                {t.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="miles">{computedMiles ? "Distance (auto)" : "Estimated miles"}</Label>
            <Input
              id="miles"
              type="number"
              min={1}
              max={50}
              value={effectiveMiles}
              disabled={!!computedMiles}
              onChange={(e) => setMiles(Number(e.target.value))}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="tip">Tip (optional, $)</Label>
            <Input id="tip" name="tip" type="number" min={0} step="0.5" defaultValue={0} />
          </div>
        </div>

        <div className="rounded-xl border border-border bg-surface p-5">
          <div className="flex items-baseline justify-between">
            <p className="text-sm text-muted-foreground">Estimated total</p>
            <p className="font-serif text-4xl text-gold">{fmtUSD(total)}</p>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">$5.99 base + ${(effectiveMiles * 1.5).toFixed(2)} miles{extraStops ? ` + $${(extraStops * 3).toFixed(2)} extra stop` : ""}</p>
        </div>

        <LegalConsent id="order-consent" checked={agree} onCheckedChange={setAgree} variant="order" />
        <Button type="submit" disabled={busy} className="bg-gold text-primary-foreground hover:bg-gold/90">{busy ? "Starting checkout…" : `Continue to payment — ${fmtUSD(total)}`}</Button>
      </form>
    </div>
  );
}
