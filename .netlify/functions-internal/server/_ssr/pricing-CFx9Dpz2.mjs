import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { P as PageShell } from "./page-shell-C9kH61wK.mjs";
import { B as Button } from "./button-BXrfXN_b.mjs";
import { e as CircleCheck } from "../_libs/lucide-react.mjs";
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
import "./footer-C9rrXBeC.mjs";
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
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
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
            /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { a: "Tip", b: "Optional · 100% to driver" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { a: "Promo & loyalty", b: "Apply at checkout" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl border border-border bg-surface p-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-serif text-3xl", children: "What you get" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-6 space-y-3 text-sm", children: ["Background‑checked Runner", "Live GPS tracking + in‑app chat", "Photo proof of delivery", "$100 cargo insurance per delivery", "Stripe‑secured payments", "24/7 availability", "Refunds for issues (1–3 business days)"].map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "mt-0.5 size-4 shrink-0 text-gold" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t })
          ] }, t)) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-10 rounded-3xl border border-border bg-gradient-to-br from-gold/5 to-transparent p-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-serif text-2xl", children: "High‑demand bonus" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-2 max-w-2xl text-sm text-muted-foreground", children: [
          "If an order sits unaccepted for 5+ minutes, MyRunner adds a driver bonus every 5 minutes to incentivize faster pickup. ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-foreground", children: "You pay the original quoted price." }),
          " The platform absorbs the bonus."
        ] })
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
