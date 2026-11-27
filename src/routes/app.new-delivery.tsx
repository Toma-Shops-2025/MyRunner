import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LegalConsent } from "@/components/site/legal-consent";
import { AddressAutocomplete } from "@/components/site/address-autocomplete";
import { OrderMap } from "@/components/site/order-map";
import { priceQuote, fmtUSD, BASE_FEE_CENTS, PER_MILE_CENTS, EXTRA_STOP_CENTS, routeMiles } from "@/lib/pricing";
import { supabase } from "@/integrations/supabase/client";
import { createCheckoutSession } from "@/lib/checkout.functions";
import { createOrder } from "@/lib/order.functions";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { useBgmVolume } from "@/components/bgm-provider";

export const Route = createFileRoute("/app/new-delivery")({
  head: () => ({ meta: [{ title: "New delivery — MyRunner" }, { name: "robots", content: "noindex" }] }),
  component: NewDelivery,
});

function NewDelivery() {
  const nav = useNavigate();
  const { setMuted } = useBgmVolume();
  const checkoutFn = useServerFn(createCheckoutSession);
  const createOrderFn = useServerFn(createOrder);

  // Quiet the BGM while placing an order — user can unmute via the floating button anytime
  useEffect(() => {
    setMuted(true);
  }, [setMuted]);

  const [miles, setMiles] = useState(3);
  const [type, setType] = useState<"standard" | "multi_pickup" | "multi_dropoff">("standard");
  const [agree, setAgree] = useState(false);
  const [busy, setBusy] = useState(false);
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [pickupCoord, setPickupCoord] = useState<[number, number] | null>(null);
  const [dropoffCoord, setDropoffCoord] = useState<[number, number] | null>(null);
  const [extras, setExtras] = useState<StopDraft[]>([]);

  function chooseType(next: "standard" | "multi_pickup" | "multi_dropoff") {
    setType(next);
    if (next === "standard") {
      setExtras([]);
      return;
    }
    setExtras((current) => (current.length > 0 ? current : [blankStop()]));
  }

  const filledExtras = extras.filter((stop) => stop.address.trim().length >= 3);
  const extraStops = type === "standard" ? 0 : filledExtras.length;

  const computedMiles = useMemo(() => {
    const points: Array<[number, number] | null> = [pickupCoord];
    if (type === "multi_pickup") points.push(...extras.map((stop) => stop.coord));
    points.push(dropoffCoord);
    if (type === "multi_dropoff") points.push(...extras.map((stop) => stop.coord));
    return routeMiles(points);
  }, [pickupCoord, dropoffCoord, extras, type]);

  const effectiveMiles = computedMiles ?? miles;
  const total = useMemo(() => priceQuote(effectiveMiles, extraStops), [effectiveMiles, extraStops]);


  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-4xl">Send a delivery</h1>
        <p className="text-muted-foreground">
          Tell us what to move and where. Standard, multi-pickup, and multi-dropoff are available.
        </p>
      </div>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (!agree) return toast.error("Please confirm the order checkbox.");
          setBusy(true);
          const fd = new FormData(e.currentTarget);
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) { setBusy(false); return toast.error("Please sign in again."); }

          if (type !== "standard" && extras.some((stop) => stop.address.trim().length < 3)) {
            setBusy(false);
            return toast.error(type === "multi_pickup" ? "Enter every pickup address." : "Enter every drop-off address.");
          }
          const role = type === "multi_pickup" ? "pickup" : "dropoff";
          const created = await createOrderFn({
            data: {
              pickupAddress: pickup,
              dropoffAddress: dropoff,
              itemDescription: String(fd.get("item")),
              type,
              priceCents: total,
              tipCents: Math.round(Number(fd.get("tip") || 0) * 100),
              distanceMiles: effectiveMiles,
              pickupLat: pickupCoord ? pickupCoord[1] : null,
              pickupLng: pickupCoord ? pickupCoord[0] : null,
              extraStops: type === "standard" ? [] : extras.map((stop) => ({
                role,
                address: stop.address.trim(),
                lat: stop.coord ? stop.coord[1] : null,
                lng: stop.coord ? stop.coord[0] : null,
              })),
            },
          });
          if ("error" in created && created.error) {
            setBusy(false);
            return toast.error(created.error);
          }
          if (!("orderId" in created) || !created.orderId) {
            setBusy(false);
            return toast.error("Could not create order");
          }

          // Immediately open Stripe Checkout to take payment
          const session = await checkoutFn({ data: { orderId: created.orderId } });
          if ("error" in session && session.error) {
            setBusy(false);
            toast.error(session.error);
            // Order exists but not paid — send them to its page where they can retry
            return nav({ to: "/app/orders/$id", params: { id: created.orderId } });
          }
          if ("url" in session && session.url) {
            window.location.href = session.url;
            return;
          }
          setBusy(false);
          toast.error("Could not start checkout.");
          nav({ to: "/app/orders/$id", params: { id: created.orderId } });
        }}
        className="grid gap-6 rounded-2xl border border-border bg-card p-4 sm:p-8"
      >
        <div className="grid gap-2">
          <Label>Delivery type</Label>
          <div className="grid gap-2 sm:grid-cols-3">
            {(["standard", "multi_pickup", "multi_dropoff"] as const).map((t) => (
              <button
                type="button"
                key={t}
                onClick={() => chooseType(t)}
                className={`rounded-lg border px-3 py-2 text-sm capitalize transition-colors ${
                  type === t ? "border-gold bg-gold/10 text-gold" : "border-border bg-card hover:border-gold/40"
                }`}
              >
                {t.replace("_", " ")}
              </button>
            ))}
          </div>
          {type === "multi_pickup" && (
            <p className="text-xs text-muted-foreground">Add every pickup. All of them go to the drop-off below. Each extra pickup is $3.00.</p>
          )}
          {type === "multi_dropoff" && (
            <p className="text-xs text-muted-foreground">Add every drop-off. The pickup below is delivered to each one. Each extra drop-off is $3.00.</p>
          )}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="pickup">Pickup address</Label>
          <AddressAutocomplete
            id="pickup"
            name="pickup"
            placeholder="123 Main St, Apt 4B"
            required
            defaultValue={pickup}
            onValueChange={(value) => { setPickup(value); setPickupCoord(null); }}
            onSelect={(s) => { setPickup(s.place_name); setPickupCoord(s.center); }}
          />
        </div>
        {type === "multi_pickup" && (
          <ExtraAddresses
            label="Additional pickup"
            extras={extras}
            onChange={setExtras}
          />
        )}
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
            onValueChange={(value) => { setDropoff(value); setDropoffCoord(null); }}
            onSelect={(s) => { setDropoff(s.place_name); setDropoffCoord(s.center); }}
          />
        </div>
        {type === "multi_dropoff" && (
          <ExtraAddresses
            label="Additional drop-off"
            extras={extras}
            onChange={setExtras}
          />
        )}

        {pickupCoord && dropoffCoord && (
          <OrderMap pickup={pickup} dropoff={dropoff} />
        )}
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
          <p className="mt-1 text-xs text-muted-foreground">
            {fmtUSD(BASE_FEE_CENTS)} base + {fmtUSD(Math.round(effectiveMiles * PER_MILE_CENTS))} miles
            {extraStops ? ` + ${fmtUSD(extraStops * EXTRA_STOP_CENTS)} for ${extraStops} extra stop${extraStops === 1 ? "" : "s"}` : ""}
          </p>
        </div>

        <LegalConsent id="order-consent" checked={agree} onCheckedChange={setAgree} variant="order" />
        <Button type="submit" disabled={busy} className="bg-gold text-primary-foreground hover:bg-gold/90">{busy ? "Starting checkout…" : `Continue to payment — ${fmtUSD(total)}`}</Button>
      </form>
    </div>
  );
}

type StopDraft = { id: string; address: string; coord: [number, number] | null };

function blankStop(): StopDraft {
  return { id: crypto.randomUUID(), address: "", coord: null };
}

function ExtraAddresses({
  label,
  extras,
  onChange,
}: {
  label: string;
  extras: StopDraft[];
  onChange: (next: StopDraft[] | ((current: StopDraft[]) => StopDraft[])) => void;
}) {
  return (
    <div className="grid gap-3">
      {extras.map((stop, index) => (
        <div key={stop.id} className="grid gap-2">
          <div className="flex items-center justify-between gap-3">
            <Label htmlFor={`extra-${stop.id}`}>{label} {index + 2}</Label>
            {extras.length > 1 && (
              <button
                type="button"
                className="text-xs text-muted-foreground underline"
                onClick={() => onChange((current) => current.filter((row) => row.id !== stop.id))}
              >
                Remove
              </button>
            )}
          </div>
          <AddressAutocomplete
            id={`extra-${stop.id}`}
            name={`extra-${stop.id}`}
            placeholder="Street address"
            required
            defaultValue={stop.address}
            onValueChange={(value) => {
              onChange((current) => current.map((row) => row.id === stop.id ? { ...row, address: value, coord: null } : row));
            }}
            onSelect={(selected) => {
              onChange((current) => current.map((row) => row.id === stop.id ? { ...row, address: selected.place_name, coord: selected.center } : row));
            }}
          />
        </div>
      ))}
      {extras.length < 8 && (
        <Button type="button" variant="outline" onClick={() => onChange((current) => [...current, blankStop()])}>
          Add another address
        </Button>
      )}
    </div>
  );
}
