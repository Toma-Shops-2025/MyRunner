import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { fmtUSD } from "@/lib/pricing";
import { toast } from "sonner";

type Order = {
  id: string;
  pickup_address: string;
  dropoff_address: string;
  item_description: string;
  type: string;
  status: string;
  price_cents: number;
  tip_cents: number;
};

export const Route = createFileRoute("/app/orders")({
  head: () => ({ meta: [{ title: "My orders — MyRunner" }, { name: "robots", content: "noindex" }] }),
  component: OrdersRoute,
});

function OrdersRoute() {
  const isOrderDetail = useRouterState({ select: (state) => state.location.pathname !== "/app/orders" });
  return isOrderDetail ? <Outlet /> : <Orders />;
}

function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const navigate = useNavigate();
  const prevStatuses = useRef<Record<string, string>>({});

  useEffect(() => {
    let active = true;
    let channel: ReturnType<typeof supabase.channel> | null = null;
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from("orders").select("*").eq("customer_id", user.id).order("created_at", { ascending: false });
      if (!active) return;
      const list = (data ?? []) as Order[];
      setOrders(list);
      prevStatuses.current = Object.fromEntries(list.map((o) => [o.id, o.status]));

      channel = supabase
        .channel(`my-orders-${user.id}`)
        .on(
          "postgres_changes",
          { event: "UPDATE", schema: "public", table: "orders", filter: `customer_id=eq.${user.id}` },
          (payload) => {
            const next = payload.new as Order;
            const prev = prevStatuses.current[next.id];
            prevStatuses.current[next.id] = next.status;
            setOrders((cur) => cur.map((o) => (o.id === next.id ? { ...o, ...next } : o)));
            if (prev === "pending" && next.status === "accepted") {
              toast.success("🎉 A Runner accepted your order — opening chat", {
                action: { label: "Open", onClick: () => navigate({ to: "/app/orders/$id", params: { id: next.id } }) },
              });
              navigate({ to: "/app/orders/$id", params: { id: next.id } });
            }
          },
        )
        .subscribe();
    })();
    return () => {
      active = false;
      if (channel) supabase.removeChannel(channel);
    };
  }, [navigate]);

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
            <li key={o.id} className="rounded-2xl border border-border bg-card p-5 transition-colors hover:border-gold/40">
              <Link to="/app/orders/$id" params={{ id: o.id }} className="block">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-medium">{o.item_description}</p>
                    <p className="text-xs text-muted-foreground">{o.pickup_address} → {o.dropoff_address}</p>
                    <p className="mt-1 text-xs text-muted-foreground capitalize">{o.type.replace("_", " ")}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-serif text-2xl text-gold">{fmtUSD(o.price_cents + o.tip_cents)}</p>
                    <p className="text-xs uppercase tracking-widest text-muted-foreground">{o.status}</p>
                  </div>
                </div>
              </Link>
              <div className="mt-4 flex flex-wrap gap-2 border-t border-border pt-4">
                <Link
                  to="/app/orders/$id"
                  params={{ id: o.id }}
                  className="inline-flex h-8 items-center justify-center rounded-md border border-input bg-background px-3 text-xs font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  Track & chat
                </Link>
                <Link
                  to="/app/report"
                  className="inline-flex h-8 items-center justify-center rounded-md border border-input bg-background px-3 text-xs font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  Report
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
