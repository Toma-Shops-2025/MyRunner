import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Package, Star, Wallet, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { fmtUSD } from "@/lib/pricing";
import { useAuth } from "@/hooks/use-auth";

type Order = {
  id: string;
  pickup_address: string;
  dropoff_address: string;
  item_description: string;
  status: string;
  price_cents: number;
  tip_cents: number;
};

export const Route = createFileRoute("/app/dashboard")({
  head: () => ({
    meta: [{ title: "Dashboard — MyRunner" }, { name: "robots", content: "noindex" }],
  }),
  component: Dashboard,
});

function Dashboard() {
  const nav = useNavigate();
  const { loading, isDriver } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  useEffect(() => {
    if (!loading && isDriver) nav({ to: "/driver/dashboard" });
  }, [loading, isDriver, nav]);
  useEffect(() => {
    supabase
      .from("orders")
      .select("id,pickup_address,dropoff_address,item_description,status,price_cents,tip_cents")
      .order("created_at", { ascending: false })
      .then(({ data }) => setOrders((data ?? []) as Order[]));
  }, []);
  const active = orders.filter((o) => !["delivered", "cancelled"].includes(o.status));
  const completed = orders.filter((o) => o.status === "delivered");
  const spent = orders.reduce((s, o) => s + o.price_cents + o.tip_cents, 0);

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
          <p className="mt-4 text-sm text-muted-foreground">
            No orders yet.{" "}
            <Link to="/app/new-delivery" className="text-gold underline">
              Send your first delivery
            </Link>
            .
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-border">
            {orders.slice(0, 5).map((o) => (
              <li key={o.id} className="flex items-center justify-between py-3 text-sm">
                <div>
                  <p className="font-medium">{o.item_description}</p>
                  <p className="text-xs text-muted-foreground">
                    {o.pickup_address} → {o.dropoff_address}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{fmtUSD(o.price_cents)}</p>
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

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Package;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <Icon className="size-5 text-gold" />
      <p className="mt-3 font-serif text-3xl">{value}</p>
      <p className="text-xs uppercase tracking-widest text-muted-foreground">{label}</p>
    </div>
  );
}
