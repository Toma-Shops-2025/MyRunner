import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LegalConsent } from "@/components/site/legal-consent";
import { store, priceQuote, fmtUSD } from "@/lib/local-store";
import { toast } from "sonner";

export const Route = createFileRoute("/app/new-delivery")({
  head: () => ({
    meta: [
      { title: "New delivery — MyRunner" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: NewDelivery,
});

function NewDelivery() {
  const nav = useNavigate();
  const [miles, setMiles] = useState(3);
  const [type, setType] = useState<"standard" | "multi-pickup" | "multi-dropoff">("standard");
  const [agree, setAgree] = useState(false);
  const extraStops = type === "standard" ? 0 : 1;
  const total = useMemo(() => priceQuote(miles, extraStops), [miles, extraStops]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-4xl">Send a delivery</h1>
        <p className="text-muted-foreground">Tell us what to move and where.</p>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!agree) return toast.error("Please confirm the order checkbox.");
          const fd = new FormData(e.currentTarget);
          const user = store.getUser()!;
          store.addOrder({
            id: crypto.randomUUID(),
            customerId: user.id,
            pickup: String(fd.get("pickup")),
            dropoff: String(fd.get("dropoff")),
            item: String(fd.get("item")),
            type,
            status: "pending",
            priceCents: total,
            tipCents: Math.round(Number(fd.get("tip") || 0) * 100),
            createdAt: Date.now(),
          });
          toast.success("Order placed. Finding you a Runner…");
          nav({ to: "/app/orders" });
        }}
        className="grid gap-6 rounded-2xl border border-border bg-card p-8"
      >
        <div className="grid gap-2">
          <Label htmlFor="pickup">Pickup address</Label>
          <Input id="pickup" name="pickup" placeholder="123 Main St, Apt 4B" required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="item">What to grab</Label>
          <Textarea id="item" name="item" placeholder="A sealed envelope from the front desk" required rows={2} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="dropoff">Drop‑off address</Label>
          <Input id="dropoff" name="dropoff" placeholder="456 Oak Ave" required />
        </div>
        <div className="grid gap-2">
          <Label>Delivery type</Label>
          <div className="grid gap-2 sm:grid-cols-3">
            {(["standard", "multi-pickup", "multi-dropoff"] as const).map((t) => (
              <button
                type="button"
                key={t}
                onClick={() => setType(t)}
                className={`rounded-lg border px-3 py-2 text-sm capitalize transition-colors ${
                  type === t ? "border-gold bg-gold/10 text-gold" : "border-border bg-card hover:border-gold/40"
                }`}
              >
                {t.replace("-", " ")}
              </button>
            ))}
          </div>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="miles">Estimated miles</Label>
            <Input id="miles" type="number" min={1} max={50} value={miles} onChange={(e) => setMiles(Number(e.target.value))} />
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
          <p className="mt-1 text-xs text-muted-foreground">$5.99 base + ${(miles * 1.5).toFixed(2)} miles{extraStops ? ` + $${(extraStops * 3).toFixed(2)} extra stop` : ""}</p>
        </div>

        <LegalConsent id="order-consent" checked={agree} onCheckedChange={setAgree} variant="order" />
        <Button type="submit" className="bg-gold text-primary-foreground hover:bg-gold/90">Place order — {fmtUSD(total)}</Button>
      </form>
    </div>
  );
}
