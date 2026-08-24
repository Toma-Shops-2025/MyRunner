import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { e as useRouterState, O as Outlet, d as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { B as Button } from "./button-BXrfXN_b.mjs";
import { s as supabase } from "./client-CbrcWund.mjs";
import { f as fmtUSD } from "./pricing-CPKaFipb.mjs";
import { t as toast } from "../_libs/sonner.mjs";
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
function OrdersRoute() {
  const isOrderDetail = useRouterState({
    select: (state) => state.location.pathname !== "/app/orders"
  });
  return isOrderDetail ? /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) : /* @__PURE__ */ jsxRuntimeExports.jsx(Orders, {});
}
function Orders() {
  const [orders, setOrders] = reactExports.useState([]);
  const navigate = useNavigate();
  const prevStatuses = reactExports.useRef({});
  reactExports.useEffect(() => {
    let active = true;
    let channel = null;
    (async () => {
      const {
        data: {
          user
        }
      } = await supabase.auth.getUser();
      if (!user) return;
      const {
        data
      } = await supabase.from("orders").select("*").eq("customer_id", user.id).order("created_at", {
        ascending: false
      });
      if (!active) return;
      const list = data ?? [];
      setOrders(list);
      prevStatuses.current = Object.fromEntries(list.map((o) => [o.id, o.status]));
      channel = supabase.channel(`my-orders-${user.id}`).on("postgres_changes", {
        event: "UPDATE",
        schema: "public",
        table: "orders",
        filter: `customer_id=eq.${user.id}`
      }, (payload) => {
        const next = payload.new;
        const prev = prevStatuses.current[next.id];
        prevStatuses.current[next.id] = next.status;
        setOrders((cur) => cur.map((o) => o.id === next.id ? {
          ...o,
          ...next
        } : o));
        if (prev === "pending" && next.status === "accepted") {
          toast.success("🎉 A Runner accepted your order — opening chat", {
            action: {
              label: "Open",
              onClick: () => navigate({
                to: "/app/orders/$id",
                params: {
                  id: next.id
                }
              })
            }
          });
          navigate({
            to: "/app/orders/$id",
            params: {
              id: next.id
            }
          });
        }
      }).subscribe();
    })();
    return () => {
      active = false;
      if (channel) supabase.removeChannel(channel);
    };
  }, [navigate]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-serif text-4xl", children: "My orders" }),
    orders.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-dashed border-border p-12 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "No orders yet." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, className: "mt-4 bg-gold text-primary-foreground hover:bg-gold/90", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/app/new-delivery", children: "Send your first delivery" }) })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-3", children: orders.map((o) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "rounded-2xl border border-border bg-card p-5 transition-colors hover:border-gold/40", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/app/orders/$id", params: {
        id: o.id
      }, className: "block", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: o.item_description }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
            o.pickup_address,
            " → ",
            o.dropoff_address
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-muted-foreground capitalize", children: o.type.replace("_", " ") })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-serif text-2xl text-gold", children: fmtUSD(o.price_cents + o.tip_cents) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-widest text-muted-foreground", children: o.status })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex flex-wrap gap-2 border-t border-border pt-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/app/orders/$id", params: {
          id: o.id
        }, className: "inline-flex h-8 items-center justify-center rounded-md border border-input bg-background px-3 text-xs font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground", children: "Track & chat" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/app/report", className: "inline-flex h-8 items-center justify-center rounded-md border border-input bg-background px-3 text-xs font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground", children: "Report" })
      ] })
    ] }, o.id)) })
  ] });
}
export {
  OrdersRoute as component
};
