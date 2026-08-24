import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { B as Button } from "./button-BXrfXN_b.mjs";
import { s as supabase } from "./client-CbrcWund.mjs";
import { f as fmtUSD } from "./pricing-CPKaFipb.mjs";
import { u as useAuth } from "./use-auth-Bp-NYKWf.mjs";
import { P as Package, h as Clock, W as Wallet, v as Star } from "../_libs/lucide-react.mjs";
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
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
function Dashboard() {
  const nav = useNavigate();
  const {
    loading,
    isDriver
  } = useAuth();
  const [orders, setOrders] = reactExports.useState([]);
  reactExports.useEffect(() => {
    if (!loading && isDriver) nav({
      to: "/driver/dashboard"
    });
  }, [loading, isDriver, nav]);
  reactExports.useEffect(() => {
    supabase.from("orders").select("id,pickup_address,dropoff_address,item_description,status,price_cents,tip_cents").order("created_at", {
      ascending: false
    }).then(({
      data
    }) => setOrders(data ?? []));
  }, []);
  const active = orders.filter((o) => !["delivered", "cancelled"].includes(o.status));
  const completed = orders.filter((o) => o.status === "delivered");
  const spent = orders.reduce((s, o) => s + o.price_cents + o.tip_cents, 0);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-serif text-4xl", children: "Hi there." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Here's a quick look at your account." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, className: "bg-gold text-primary-foreground hover:bg-gold/90", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/app/new-delivery", children: "New delivery" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { icon: Package, label: "Active", value: String(active.length) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { icon: Clock, label: "Completed", value: String(completed.length) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { icon: Wallet, label: "Lifetime spend", value: fmtUSD(spent) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { icon: Star, label: "Loyalty tier", value: "🥉 Bronze" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-card p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-serif text-2xl", children: "Recent orders" }),
      orders.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-4 text-sm text-muted-foreground", children: [
        "No orders yet.",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/app/new-delivery", className: "text-gold underline", children: "Send your first delivery" }),
        "."
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-4 divide-y divide-border", children: orders.slice(0, 5).map((o) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center justify-between py-3 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: o.item_description }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
            o.pickup_address,
            " → ",
            o.dropoff_address
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: fmtUSD(o.price_cents) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-widest text-gold", children: o.status })
        ] })
      ] }, o.id)) })
    ] })
  ] });
}
function Stat({
  icon: Icon,
  label,
  value
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "size-5 text-gold" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 font-serif text-3xl", children: value }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-widest text-muted-foreground", children: label })
  ] });
}
export {
  Dashboard as component
};
