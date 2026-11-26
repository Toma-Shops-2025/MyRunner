import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { P as PageShell } from "./page-shell-Daj9NfIl.mjs";
import { B as Button } from "./router-CaL1rPwL.mjs";
import { C as CARGO_INSURANCE_STATEMENT, b as SUPPORT_STATEMENT, D as DRIVER_SCREENING_STATEMENT } from "./support-knowledge-BldCmBQ4.mjs";
import "../_libs/sonner.mjs";
import "../_libs/seroval.mjs";
import "../_libs/stripe.mjs";
import { i as CircleCheck } from "../_libs/lucide-react.mjs";
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
import "./back-button-PLK58KB_.mjs";
import "./use-auth-B85-Dc53.mjs";
import "./client-DfLBq1uk.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "./signup-intent-DuoHB-mj.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
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
import "./stripe-payout.server-BMP7bU7B.mjs";
import "./client.server-D5ro3rAQ.mjs";
import "./dispatch.functions-CDAFMReD.mjs";
import "./auth-middleware-CMwi6y2l.mjs";
import "../_libs/zod.mjs";
import "events";
import "http";
import "https";
import "os";
function Pricing() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(PageShell, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "container-app py-20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-widest text-gold", children: "Pricing" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "mt-3 font-serif text-6xl", children: [
        "$5.99 base. ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "italic text-muted-foreground", children: "That's it." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-6 max-w-xl text-lg text-muted-foreground", children: "We show you the final price before you pay. No subscriptions, no peak‑hour penalties for customers, no hidden fees." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "container-app pb-20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-6 lg:grid-cols-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl border border-border bg-card p-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-serif text-3xl", children: "Per delivery" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "mt-6 space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { a: "Base fee", b: "$5.99" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { a: "Per mile", b: "$1.50" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { a: "Extra stop (multi‑drop)", b: "$3.00 each" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { a: "Tip", b: "Optional · 100% to the Runner" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { a: "Runner share", b: "70% of the delivery fee" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { a: "Platform fee", b: "30% of the delivery fee" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl border border-border bg-surface p-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-serif text-3xl", children: "What you get" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-6 space-y-3 text-sm", children: ["Live GPS while a Runner is on the job", "In-app messages with your Runner", "Photo proof of delivery", "Stripe-secured payments", "Price shown before you pay", CARGO_INSURANCE_STATEMENT, "Multi-pickup and multi-dropoff", "Coming to your city very soon!!!"].map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "mt-0.5 size-4 shrink-0 text-gold" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t })
          ] }, t)) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-8 max-w-2xl text-sm text-muted-foreground", children: [
        "Standard, multi-pickup, and multi-dropoff are available. Multi-pickup asks for every pickup address. Multi-dropoff asks for every drop-off address. Each extra address adds $3.00. ",
        CARGO_INSURANCE_STATEMENT,
        " There is no promo code and no loyalty discount yet. Runners keep 70% of the delivery fee and 100% of tips. MyRunner keeps the other 30% of the delivery fee. ",
        SUPPORT_STATEMENT,
        " ",
        DRIVER_SCREENING_STATEMENT
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-12 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, size: "lg", className: "bg-gold text-primary-foreground hover:bg-gold/90", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/signup", children: "Send a delivery" }) }) })
    ] })
  ] });
}
function Row({
  a,
  b
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-baseline justify-between gap-4 border-b border-border pb-3 last:border-0", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: a }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-serif text-xl text-foreground", children: b })
  ] });
}
export {
  Pricing as component
};
