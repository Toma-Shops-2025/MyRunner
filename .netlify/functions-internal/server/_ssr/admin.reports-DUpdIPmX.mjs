import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { B as Button } from "./button-BXrfXN_b.mjs";
import { s as supabase } from "./client-CbrcWund.mjs";
import { t as toast } from "../_libs/sonner.mjs";
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
import "../_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "stream";
import "crypto";
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
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium uppercase tracking-widest text-gold", children: r.category }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-foreground/90", children: r.details }),
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
