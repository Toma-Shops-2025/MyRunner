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
function severityClass(s) {
  switch ((s || "").toLowerCase()) {
    case "critical":
      return "bg-destructive text-destructive-foreground";
    case "high":
      return "bg-destructive/20 text-destructive";
    case "medium":
      return "bg-gold/20 text-gold";
    default:
      return "bg-muted text-muted-foreground";
  }
}
function Reports() {
  const [reports, setReports] = reactExports.useState([]);
  const [filter, setFilter] = reactExports.useState("open");
  async function load() {
    let q = supabase.from("reports").select("*").order("created_at", {
      ascending: false
    });
    if (filter !== "all") q = q.eq("status", filter);
    const {
      data
    } = await q;
    setReports(data ?? []);
  }
  reactExports.useEffect(() => {
    load();
  }, [filter]);
  async function setStatus(id, status) {
    const {
      error
    } = await supabase.from("reports").update({
      status
    }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success(`Marked ${status}`);
    load();
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "flex flex-wrap items-end justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-serif text-4xl", children: "Reports" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2", children: ["open", "resolved", "all"].map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: filter === f ? "default" : "outline", className: filter === f ? "bg-gold text-primary-foreground hover:bg-gold/90" : "", onClick: () => setFilter(f), children: f }, f)) })
    ] }),
    reports.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Nothing here." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-3", children: reports.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "rounded-2xl border border-border bg-card p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-start justify-between gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium uppercase tracking-widest text-gold", children: r.category }),
            r.ai_severity && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `rounded-full px-2 py-0.5 text-[10px] uppercase tracking-widest ${severityClass(r.ai_severity)}`, children: [
              r.ai_severity,
              r.ai_escalate ? " · escalate" : ""
            ] })
          ] }),
          r.ai_summary && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-foreground", children: r.ai_summary }),
          r.ai_suggested_action && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
            "Suggested: ",
            r.ai_suggested_action
          ] }),
          r.ai_labels && r.ai_labels.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase tracking-widest text-muted-foreground", children: r.ai_labels.join(" · ") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-foreground/90 whitespace-pre-wrap", children: r.details }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-xs text-muted-foreground", children: [
            "reporter: ",
            r.reporter_id,
            r.reported_user_id && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              " · reported: ",
              r.reported_user_id
            ] }),
            r.order_id && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              " · order: ",
              r.order_id
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `rounded-full px-3 py-1 text-xs uppercase tracking-widest ${r.status === "open" ? "bg-destructive/20 text-destructive" : "bg-success/20 text-success"}`, children: r.status })
      ] }),
      r.status === "open" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex gap-2 border-t border-border pt-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", className: "bg-gold text-primary-foreground hover:bg-gold/90", onClick: () => setStatus(r.id, "resolved"), children: "Mark resolved" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "outline", onClick: () => setStatus(r.id, "investigating"), children: "Investigating" })
      ] })
    ] }, r.id)) })
  ] });
}
export {
  Reports as component
};
