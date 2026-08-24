import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { P as PageShell } from "./page-shell-C9kH61wK.mjs";
import { B as Button } from "./button-BXrfXN_b.mjs";
import { g as DollarSign, G as Gift, h as Clock, i as Car, T as TrendingUp, c as ShieldCheck } from "../_libs/lucide-react.mjs";
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
function Drivers() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(PageShell, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "container-app py-20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-widest text-gold", children: "For Runners" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "mt-3 max-w-4xl font-serif text-6xl leading-[1.05]", children: [
        "Your car. Your hours. ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "italic text-gold", children: "Your money." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-6 max-w-xl text-lg text-muted-foreground", children: "MyRunner is built around the people who do the actual work. You keep 70% of every fee, 100% of every tip, and you set your own schedule." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 flex gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, size: "lg", className: "bg-gold text-primary-foreground hover:bg-gold/90", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/driver-signup", children: "Apply now →" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, size: "lg", variant: "outline", className: "border-border-strong", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/faq", children: "Driver FAQ" }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "container-app pb-24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4 md:grid-cols-2 lg:grid-cols-3", children: [{
      icon: DollarSign,
      t: "70% per delivery",
      b: "Plus surge bonuses on high‑demand orders."
    }, {
      icon: Gift,
      t: "100% of tips",
      b: "Every cent the customer tips goes to you."
    }, {
      icon: Clock,
      t: "Total flexibility",
      b: "Online/offline with one tap. No minimums."
    }, {
      icon: Car,
      t: "Any vehicle",
      b: "Car, SUV, truck, van, or motorcycle."
    }, {
      icon: TrendingUp,
      t: "Auto Stripe payouts",
      b: "Earnings deposited directly to your bank."
    }, {
      icon: ShieldCheck,
      t: "Insured while driving",
      b: "HNOA coverage during active deliveries."
    }].map(({
      icon: Icon,
      t,
      b
    }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-card p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "size-6 text-gold" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-4 font-serif text-2xl", children: t }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: b })
    ] }, t)) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "container-app pb-24", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl border border-border bg-surface p-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-serif text-3xl", children: "What you'll need" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-6 grid gap-3 text-sm sm:grid-cols-2", children: ["18+ with a valid driver's license", "Proof of auto insurance", "A smartphone (iOS or Android)", "Clean background check (Checkr)", "Reliable vehicle (any type)", "A bank account for Stripe payouts"].map((x) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { className: "rounded-lg border border-border bg-card px-4 py-3", children: x }, x)) })
    ] }) })
  ] });
}
export {
  Drivers as component
};
