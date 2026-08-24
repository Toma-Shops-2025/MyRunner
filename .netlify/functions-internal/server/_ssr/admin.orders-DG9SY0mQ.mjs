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
const STATUSES = ["all", "pending", "accepted", "picked_up", "in_transit", "delivered", "cancelled"];
function AdminOrders() {
  const [orders, setOrders] = reactExports.useState([]);
  const [status, setStatus] = reactExports.useState("all");
  reactExports.useEffect(() => {
    (async () => {
      let q = supabase.from("orders").select("*").order("created_at", {
        ascending: false
      }).limit(200);
      if (status !== "all") q = q.eq("status", status);
      const {
        data
      } = await q;
      setOrders(data ?? []);
    })();
  }, [status]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "flex flex-wrap items-end justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-serif text-4xl", children: "All orders" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: status, onChange: (e) => setStatus(e.target.value), className: "rounded-md border border-border bg-card px-3 py-2 text-sm", children: STATUSES.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: s }, s)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto rounded-2xl border border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-surface text-xs uppercase tracking-widest text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left", children: "Item" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left", children: "Route" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left", children: "Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-right", children: "Total" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
        orders.map((o) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: o.item_description }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground capitalize", children: o.type.replace("_", " ") })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3 text-xs text-muted-foreground", children: [
            o.pickup_address,
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
            " → ",
            o.dropoff_address
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 uppercase tracking-widest text-xs", children: o.status }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right font-serif text-gold", children: fmtUSD(o.price_cents + o.tip_cents) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/app/orders/$id", params: {
            id: o.id
          }, className: "text-xs text-gold hover:underline", children: "View →" }) })
        ] }, o.id)),
        orders.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 5, className: "px-4 py-12 text-center text-muted-foreground", children: "No orders match." }) })
      ] })
    ] }) })
  ] });
}
export {
  AdminOrders as component
};
