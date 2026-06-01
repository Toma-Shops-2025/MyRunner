import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { MapPin, Navigation, Camera, MessageCircle } from "lucide-react";
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

const sampleOrders = [
  { id: "ORD‑8421", pickup: "Whole Foods · 9th St", drop: "224 Riverside Dr", earn: 11.42, miles: 2.8, surge: true, preferred: true },
  { id: "ORD‑8422", pickup: "Walgreens · 1st Ave", drop: "98 Park Place", earn: 7.99, miles: 1.6, surge: false, preferred: false },
  { id: "ORD‑8423", pickup: "Office · 540 Broadway", drop: "Multiple drops · 3 stops", earn: 18.30, miles: 4.4, surge: false, preferred: false },
];

function DriverDashboard() {
  const [online, setOnline] = useState(false);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between rounded-2xl border border-border bg-card p-6">
        <div>
          <h1 className="font-serif text-3xl">Today</h1>
          <p className="text-sm text-muted-foreground">Toggle online to start receiving orders.</p>
        </div>
        <div className="flex items-center gap-3">
          <Label htmlFor="online" className={online ? "text-gold" : "text-muted-foreground"}>
            {online ? "Online" : "Offline"}
          </Label>
          <Switch id="online" checked={online} onCheckedChange={(v) => { setOnline(v); toast.success(v ? "You're online." : "You're offline."); }} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        {[
          { l: "Today's earnings", v: "$48.20" },
          { l: "Active", v: "0" },
          { l: "Completed", v: "12" },
          { l: "Rating", v: "4.93 ★" },
        ].map((s) => (
          <div key={s.l} className="rounded-xl border border-border bg-card p-5">
            <p className="font-serif text-3xl">{s.v}</p>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">{s.l}</p>
          </div>
        ))}
      </div>

      <div>
        <h2 className="font-serif text-2xl">Order feed</h2>
        <p className="text-sm text-muted-foreground">Auto‑refreshes every 10 seconds.</p>
        <ul className="mt-4 space-y-3">
          {sampleOrders.map((o) => (
            <li key={o.id} className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-serif text-xl">{o.id}</p>
                    {o.preferred && <span className="rounded-full border border-gold bg-gold/10 px-2 py-0.5 text-[10px] uppercase tracking-widest text-gold">Requested you</span>}
                    {o.surge && <span className="animate-pulse rounded-full border border-destructive bg-destructive/10 px-2 py-0.5 text-[10px] uppercase tracking-widest text-destructive">High demand</span>}
                  </div>
                  <p className="mt-1 text-sm"><span className="text-muted-foreground">Pickup:</span> {o.pickup}</p>
                  <p className="text-sm"><span className="text-muted-foreground">Drop:</span> {o.drop}</p>
                  <p className="text-xs text-muted-foreground">{o.miles} mi</p>
                </div>
                <div className="text-right">
                  <p className="font-serif text-3xl text-gold">${o.earn.toFixed(2)}</p>
                  <Button size="sm" className="mt-2 bg-gold text-primary-foreground hover:bg-gold/90">Accept</Button>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2 border-t border-border pt-4">
                <Button variant="outline" size="sm"><Navigation className="mr-1 size-3" /> Navigate</Button>
                <Button variant="outline" size="sm"><MessageCircle className="mr-1 size-3" /> Chat</Button>
                <Button variant="outline" size="sm"><Camera className="mr-1 size-3" /> Photo proof</Button>
                <Button variant="outline" size="sm"><MapPin className="mr-1 size-3" /> Preview route</Button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
