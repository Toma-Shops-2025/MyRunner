import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { fmtUSD } from "@/lib/pricing";

export const Route = createFileRoute("/admin/dashboard")({
  head: () => ({ meta: [{ title: "Admin overview — MyRunner" }, { name: "robots", content: "noindex" }] }),
  component: Overview,
});

function Overview() {
  const [stats, setStats] = useState({ pendingApps: 0, openReports: 0, activeOrders: 0, gmvCents: 0 });

  useEffect(() => {
    (async () => {
      const [apps, reports, active, all] = await Promise.all([
        supabase.from("driver_applications").select("id", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("reports").select("id", { count: "exact", head: true }).eq("status", "open"),
        supabase.from("orders").select("id", { count: "exact", head: true }).in("status", ["pending", "accepted", "picked_up", "in_transit"]),
        supabase.from("orders").select("price_cents,tip_cents"),
      ]);
      const gmv = (all.data ?? []).reduce((s, o: any) => s + o.price_cents + o.tip_cents, 0);
      setStats({
        pendingApps: apps.count ?? 0,
        openReports: reports.count ?? 0,
        activeOrders: active.count ?? 0,
        gmvCents: gmv,
      });
    })();
  }, []);

  const cards = [
    { label: "Pending applications", value: stats.pendingApps, to: "/admin/applications" },
    { label: "Open reports", value: stats.openReports, to: "/admin/reports" },
    { label: "Active orders", value: stats.activeOrders, to: "/admin/orders" },
    { label: "Total GMV", value: fmtUSD(stats.gmvCents), to: "/admin/orders" },
  ] as const;

  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs uppercase tracking-widest text-gold">Admin</p>
        <h1 className="mt-2 font-serif text-5xl">Operations overview</h1>
      </header>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Link
            key={c.label}
            to={c.to}
            className="rounded-2xl border border-border bg-card p-6 transition-colors hover:border-gold/40"
          >
            <p className="text-xs uppercase tracking-widest text-muted-foreground">{c.label}</p>
            <p className="mt-3 font-serif text-4xl">{c.value}</p>
          </Link>
        ))}
      </div>
      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="font-serif text-2xl">Quick links</h2>
        <ul className="mt-3 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
          <li>· Review pending driver applications and approve/reject</li>
          <li>· Triage user reports and update status</li>
          <li>· Monitor all live orders across the platform</li>
          <li>· Track total marketplace volume (GMV)</li>
        </ul>
      </div>
    </div>
  );
}
