import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { S as SiteHeader, a as SiteFooter } from "./footer-C9rrXBeC.mjs";
import { R as Route$i } from "./router-CcOqsHDG.mjs";
import "../_libs/sonner.mjs";
import "../_libs/seroval.mjs";
import "../_libs/stripe.mjs";
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
import "./button-BXrfXN_b.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "./use-auth-Bp-NYKWf.mjs";
import "./client-CbrcWund.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/lucide-react.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "./server-DWRkkZvt.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "./stripe.server-h1CGUd7G.mjs";
import "./client.server-D5ro3rAQ.mjs";
import "./auth-middleware-pF3e_tkz.mjs";
import "./createMiddleware-BvN2ghIY.mjs";
import "../_libs/zod.mjs";
import "events";
import "http";
import "https";
import "os";
function RunnerProfile() {
  const {
    runner
  } = Route$i.useLoaderData();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex min-h-screen flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(SiteHeader, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "container-app flex-1 py-16", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-2xl rounded-2xl border border-border bg-card p-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-widest text-gold", children: "Independent Runner" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-2 font-serif text-4xl", children: runner.name }),
      runner.verified && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-2 text-sm text-emerald-500", children: [
        "✓ Verified Runner · payouts active",
        runner.since ? ` since ${new Date(runner.since).toLocaleDateString()}` : ""
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 space-y-3 text-sm leading-relaxed text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
          runner.name,
          " is an independent contractor providing on-demand pickup and delivery services through MyRunner — anything, anytime, anywhere."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Services include: grocery runs, restaurant pickup, pharmacy delivery, package drop-offs, and last-minute personal errands within the local service area." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "MyRunner uses Stripe Connect to process payments and send earnings directly to verified Runners." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 rounded-xl border border-border bg-background p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-serif text-xl", children: "Need a Runner?" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "Book a delivery on MyRunner — the next available Runner in your area will be dispatched." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "/app/new-delivery", className: "mt-4 inline-block rounded-full bg-gold px-5 py-2 text-sm font-medium text-primary-foreground", children: "Request a delivery" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SiteFooter, {})
  ] });
}
export {
  RunnerProfile as component
};
