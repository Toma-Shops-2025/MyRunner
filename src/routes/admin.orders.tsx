import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { fmtUSD } from "@/lib/pricing";

export const Route = createFileRoute("/admin/orders")({
  head: () => ({ meta: [{ title: "All orders — MyRunner Admin" }, { name: "robots", content: "noindex" }] }),
  component: AdminOrders,
});

type Order = {
  id: string;
  customer_id: string;
  driver_id: string | null;
  pickup_address: string;
  dropoff_address: string;
  item_description: string;
  type: string;
  status: string;
  price_cents: number;
  tip_cents: number;
  created_at: string;
};

const STATUSES = ["all", "pending", "accepted", "picked_up", "in_transit", "delivered", "cancelled"] as const;

function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [status, setStatus] = useState<(typeof STATUSES)[number]>("all");

  useEffect(() => {
    (async () => {
      let q = supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(200);
      if (status !== "all") q = q.eq("status", status);
      const { data } = await q;
      setOrders((data ?? []) as Order[]);
    })();
  }, [status]);

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-serif text-4xl">All orders</h1>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as typeof status)}
          className="rounded-md border border-border bg-card px-3 py-2 text-sm"
        >
          {STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select>
      </header>

      <div className="overflow-x-auto rounded-2xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-surface text-xs uppercase tracking-widest text-muted-foreground">
            <tr>
              <th className="px-4 py-3 text-left">Item</th>
              <th className="px-4 py-3 text-left">Route</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-right">Total</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-t border-border">
                <td className="px-4 py-3">
                  <p className="font-medium">{o.item_description}</p>
                  <p className="text-xs text-muted-foreground capitalize">{o.type.replace("_", " ")}</p>
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">
                  {o.pickup_address} <br /> → {o.dropoff_address}
                </td>
                <td className="px-4 py-3 uppercase tracking-widest text-xs">{o.status}</td>
                <td className="px-4 py-3 text-right font-serif text-gold">{fmtUSD(o.price_cents + o.tip_cents)}</td>
                <td className="px-4 py-3 text-right">
                  <Link to="/app/orders/$id" params={{ id: o.id }} className="text-xs text-gold hover:underline">
                    View →
                  </Link>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-muted-foreground">
                  No orders match.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
