import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { f as faqData } from "./router-CcOqsHDG.mjs";
import { P as PageShell } from "./page-shell-C9kH61wK.mjs";
import "../_libs/sonner.mjs";
import "../_libs/seroval.mjs";
import "../_libs/stripe.mjs";
import { f as ChevronDown } from "../_libs/lucide-react.mjs";
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
import "./server-DWRkkZvt.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
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
import "./auth-middleware-pF3e_tkz.mjs";
import "./createMiddleware-BvN2ghIY.mjs";
import "../_libs/zod.mjs";
import "events";
import "http";
import "https";
import "os";
import "./footer-C9rrXBeC.mjs";
import "./button-BXrfXN_b.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "./use-auth-Bp-NYKWf.mjs";
import "./client-CbrcWund.mjs";
function FAQ() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(PageShell, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "container-app py-20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-widest text-gold", children: "FAQ" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-3 font-serif text-6xl", children: "Questions, answered." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "container-app pb-24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-3xl divide-y divide-border rounded-2xl border border-border bg-card", children: faqData.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx(FaqRow, { ...f }, f.q)) }) })
  ] });
}
function FaqRow({
  q,
  a
}) {
  const [open, setOpen] = reactExports.useState(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "flex w-full items-center justify-between gap-4 px-6 py-5 text-left", onClick: () => setOpen((v) => !v), "aria-expanded": open, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-serif text-lg", children: q }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: `size-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}` })
    ] }),
    open && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-6 pb-5 text-sm text-muted-foreground", children: a })
  ] });
}
export {
  FAQ as component
};
