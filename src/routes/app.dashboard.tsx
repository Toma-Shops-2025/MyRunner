import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Package, Star, Wallet, Clock } from "lucide-react";
import { store, fmtUSD, type Order } from "@/lib/local-store";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/app/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — MyRunner" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  useEffect(() => setOrders(store.getOrders()), []);
  const active = orders.filter((o) => !["delivered", "cancelled"].includes(o.status));
  const completed = orders.filter((o) => o.status === "delivered");
  const spent = orders.reduce((s, o) => s + o.priceCents + o.tipCents, 0);

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl">Hi there.</h1>
          <p className="text-muted-foreground">Here's a quick look at your account.</p>
        </div>
        <Button asChild className="bg-gold text-primary-foreground hover:bg-gold/90">
          <Link to="/app/new-delivery">New delivery</Link>
        </Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat icon={Package} label="Active" value={String(active.length)} />
        <Stat icon={Clock} label="Completed" value={String(completed.length)} />
        <Stat icon={Wallet} label="Lifetime spend" value={fmtUSD(spent)} />
        <Stat icon={Star} label="Loyalty tier" value="🥉 Bronze" />
      </div>
      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="font-serif text-2xl">Recent orders</h2>
        {orders.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">No orders yet. <Link to="/app/new-delivery" className="text-gold underline">Send your first delivery</Link>.</p>
        ) : (
          <ul className="mt-4 divide-y divide-border">
            {orders.slice(0, 5).map((o) => (
              <li key={o.id} className="flex items-center justify-between py-3 text-sm">
                <div>
                  <p className="font-medium">{o.item}</p>
                  <p className="text-xs text-muted-foreground">{o.pickup} → {o.dropoff}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{fmtUSD(o.priceCents)}</p>
                  <p className="text-xs uppercase tracking-widest text-gold">{o.status}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value }: { icon: typeof Package; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <Icon className="size-5 text-gold" />
      <p className="mt-3 font-serif text-3xl">{value}</p>
      <p className="text-xs uppercase tracking-widest text-muted-foreground">{label}</p>
    </div>
  );
}
