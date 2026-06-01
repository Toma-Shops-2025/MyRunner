import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { store, fmtUSD, type Order } from "@/lib/local-store";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/app/orders")({
  head: () => ({
    meta: [
      { title: "My orders — MyRunner" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Orders,
});

function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  useEffect(() => setOrders(store.getOrders()), []);

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-4xl">My orders</h1>
      {orders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center">
          <p className="text-muted-foreground">No orders yet.</p>
          <Button asChild className="mt-4 bg-gold text-primary-foreground hover:bg-gold/90">
            <Link to="/app/new-delivery">Send your first delivery</Link>
          </Button>
        </div>
      ) : (
        <ul className="space-y-3">
          {orders.map((o) => (
            <li key={o.id} className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium">{o.item}</p>
                  <p className="text-xs text-muted-foreground">{o.pickup} → {o.dropoff}</p>
                  <p className="mt-1 text-xs text-muted-foreground capitalize">{o.type.replace("-", " ")}</p>
                </div>
                <div className="text-right">
                  <p className="font-serif text-2xl text-gold">{fmtUSD(o.priceCents + o.tipCents)}</p>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">{o.status}</p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2 border-t border-border pt-4">
                <Button variant="outline" size="sm">Track</Button>
                <Button variant="outline" size="sm">Chat</Button>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/app/report">Report driver</Link>
                </Button>
                <Button variant="outline" size="sm">Request refund</Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
