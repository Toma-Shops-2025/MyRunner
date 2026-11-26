import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { B as Button } from "./router-CaL1rPwL.mjs";
import { s as supabase } from "./client-DfLBq1uk.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import "../_libs/seroval.mjs";
import "../_libs/stripe.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
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
import "./createSsrRpc-xYjLf7RI.mjs";
import "./server-pkl-8gUD.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "./signup-intent-DuoHB-mj.mjs";
import "./support-knowledge-BldCmBQ4.mjs";
import "./stripe-payout.server-BMP7bU7B.mjs";
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
import "./dispatch.functions-CDAFMReD.mjs";
import "./auth-middleware-CMwi6y2l.mjs";
import "../_libs/lucide-react.mjs";
import "../_libs/zod.mjs";
import "events";
import "http";
import "https";
import "os";
function Applications() {
  const [apps, setApps] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  async function load() {
    setLoading(true);
    const {
      data
    } = await supabase.from("driver_applications").select("*").order("created_at", {
      ascending: false
    });
    setApps(data ?? []);
    setLoading(false);
  }
  reactExports.useEffect(() => {
    load();
  }, []);
  async function decide(app, status) {
    const {
      error
    } = await supabase.from("driver_applications").update({
      status
    }).eq("id", app.id);
    if (error) return toast.error(error.message);
    if (status === "approved") {
      const {
        error: roleErr
      } = await supabase.from("user_roles").insert({
        user_id: app.user_id,
        role: "driver"
      });
      if (roleErr && !roleErr.message.includes("duplicate")) {
        toast.error(`Role grant failed: ${roleErr.message}`);
      }
    }
    toast.success(`Application ${status}`);
    load();
  }
  if (loading) return /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Loading applications…" });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-serif text-4xl", children: "Driver applications" }),
    apps.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "No applications yet." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-3", children: apps.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "rounded-2xl border border-border bg-card p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-start justify-between gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-xs text-muted-foreground", children: [
            "user: ",
            a.user_id
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-2 font-medium", children: [
            a.vehicle_year,
            " ",
            a.vehicle_make,
            " ",
            a.vehicle_model,
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-2 text-muted-foreground", children: [
              "(",
              a.vehicle_type,
              ")"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
            "License ",
            a.license_number,
            " · ",
            a.license_state,
            " · ",
            a.insurance_provider
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-xs", children: [
            "Background:",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gold uppercase tracking-widest", children: a.background_check_status })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `rounded-full px-3 py-1 text-xs uppercase tracking-widest ${a.status === "approved" ? "bg-success/20 text-success" : a.status === "rejected" ? "bg-destructive/20 text-destructive" : "bg-gold-soft text-gold"}`, children: a.status }) })
      ] }),
      a.status === "pending" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex gap-2 border-t border-border pt-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", className: "bg-gold text-primary-foreground hover:bg-gold/90", onClick: () => decide(a, "approved"), children: "Approve" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "outline", onClick: () => decide(a, "rejected"), children: "Reject" })
      ] })
    ] }, a.id)) })
  ] });
}
export {
  Applications as component
};
