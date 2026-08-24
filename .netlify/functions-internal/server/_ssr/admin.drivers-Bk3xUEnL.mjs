import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useServerFn } from "./useServerFn-DL2oePlL.mjs";
import { u as useQueryClient, a as useQuery, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { c as createSsrRpc } from "./router-CcOqsHDG.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-pF3e_tkz.mjs";
import { c as createServerFn } from "./server-DWRkkZvt.mjs";
import { f as fmtUSD } from "./pricing-CPKaFipb.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import "../_libs/stripe.mjs";
import "../_libs/seroval.mjs";
import { o as objectType, e as enumType, s as stringType } from "../_libs/zod.mjs";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "stream";
import "crypto";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__query-core.mjs";
import "./stripe.server-h1CGUd7G.mjs";
import "./client.server-D5ro3rAQ.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "events";
import "http";
import "https";
import "os";
import "./createMiddleware-BvN2ghIY.mjs";
const listDriversForAdmin = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("40bef2cf70ea6e1cff8b718a877f4e1d7b5f04ea2689194d15074b48a2c3926a"));
const updateInput = objectType({
  driverId: stringType().uuid(),
  status: enumType(["pending", "clear", "failed"])
});
const updateDriverBackgroundCheck = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => updateInput.parse(d)).handler(createSsrRpc("2823ff8374858c242ff9368cc18e15e4d7b02f12cf5c4e41b4c9fb80d9255b51"));
function AdminDrivers() {
  const fetchDrivers = useServerFn(listDriversForAdmin);
  const updateBg = useServerFn(updateDriverBackgroundCheck);
  const qc = useQueryClient();
  const {
    data,
    isLoading,
    error
  } = useQuery({
    queryKey: ["admin", "drivers"],
    queryFn: () => fetchDrivers()
  });
  const mut = useMutation({
    mutationFn: (vars) => updateBg({
      data: vars
    }),
    onSuccess: () => {
      toast.success("Background check updated.");
      qc.invalidateQueries({
        queryKey: ["admin", "drivers"]
      });
    },
    onError: (e) => toast.error(e.message)
  });
  if (isLoading) return /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Loading drivers…" });
  if (error) return /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-destructive", children: [
    "Failed to load: ",
    error.message
  ] });
  const drivers = data?.drivers ?? [];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-serif text-4xl", children: "Drivers" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: `Stripe Connect onboarding, background check status, and lifetime payouts. Set status to "Failed" to deactivate a driver — they'll lose the ability to accept orders immediately.` })
    ] }),
    drivers.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "No approved drivers yet." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto rounded-2xl border border-border bg-card", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "border-b border-border bg-muted/30 text-left text-xs uppercase tracking-widest text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Driver" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Onboarding" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Background check" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Paid out" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Pending" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: drivers.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border last:border-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: d.full_name ?? "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: d.email }),
          d.phone && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: d.phone }),
          !d.is_active && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs uppercase tracking-widest text-destructive", children: "Deactivated" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: d.payouts_enabled ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full bg-success/20 px-3 py-1 text-xs uppercase tracking-widest text-success", children: "Ready" }) : d.stripe_connect_account_id ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full bg-gold-soft px-3 py-1 text-xs uppercase tracking-widest text-gold", children: "In progress" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full bg-muted px-3 py-1 text-xs uppercase tracking-widest text-muted-foreground", children: "Not started" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: d.background_check_status ?? "pending", disabled: mut.isPending, onChange: (e) => mut.mutate({
          driverId: d.id,
          status: e.target.value
        }), className: "rounded-md border border-border bg-card px-2 py-1 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "pending", children: "Pending" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "clear", children: "Clear" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "failed", children: "Failed — deactivate" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-mono", children: fmtUSD(d.totals.paidCents) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-mono text-muted-foreground", children: fmtUSD(d.totals.pendingCents) })
      ] }, d.id)) })
    ] }) })
  ] });
}
export {
  AdminDrivers as component
};
