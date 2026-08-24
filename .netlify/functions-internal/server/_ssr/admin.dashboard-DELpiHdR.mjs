import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { s as supabase } from "./client-CbrcWund.mjs";
import { f as fmtUSD } from "./pricing-CPKaFipb.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "stream";
import "crypto";
import "../_libs/isbot.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
function Overview() {
  const [stats, setStats] = reactExports.useState({
    pendingApps: 0,
    openReports: 0,
    activeOrders: 0,
    gmvCents: 0
  });
  reactExports.useEffect(() => {
    (async () => {
      const [apps, reports, active, all] = await Promise.all([supabase.from("driver_applications").select("id", {
        count: "exact",
        head: true
      }).eq("status", "pending"), supabase.from("reports").select("id", {
        count: "exact",
        head: true
      }).eq("status", "open"), supabase.from("orders").select("id", {
        count: "exact",
        head: true
      }).in("status", ["pending", "accepted", "picked_up", "in_transit"]), supabase.from("orders").select("price_cents,tip_cents")]);
      const gmv = (all.data ?? []).reduce((s, o) => s + o.price_cents + o.tip_cents, 0);
      setStats({
        pendingApps: apps.count ?? 0,
        openReports: reports.count ?? 0,
        activeOrders: active.count ?? 0,
        gmvCents: gmv
      });
    })();
  }, []);
  const cards = [{
    label: "Pending applications",
    value: stats.pendingApps,
    to: "/admin/applications"
  }, {
    label: "Open reports",
    value: stats.openReports,
    to: "/admin/reports"
  }, {
    label: "Active orders",
    value: stats.activeOrders,
    to: "/admin/orders"
  }, {
    label: "Total GMV",
    value: fmtUSD(stats.gmvCents),
    to: "/admin/orders"
  }];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-widest text-gold", children: "Admin" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-2 font-serif text-5xl", children: "Operations overview" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4", children: cards.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: c.to, className: "rounded-2xl border border-border bg-card p-6 transition-colors hover:border-gold/40", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-widest text-muted-foreground", children: c.label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 font-serif text-4xl", children: c.value })
    ] }, c.label)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-card p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-serif text-2xl", children: "Quick links" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "mt-3 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "· Review pending driver applications and approve/reject" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "· Triage user reports and update status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "· Monitor all live orders across the platform" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "· Track total marketplace volume (GMV)" })
      ] })
    ] })
  ] });
}
export {
  Overview as component
};
