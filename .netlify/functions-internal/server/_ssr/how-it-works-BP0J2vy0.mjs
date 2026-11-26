import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { P as PageShell } from "./page-shell-Daj9NfIl.mjs";
import { B as Button } from "./router-CaL1rPwL.mjs";
import { C as CARGO_INSURANCE_STATEMENT, b as SUPPORT_STATEMENT, D as DRIVER_SCREENING_STATEMENT } from "./support-knowledge-BldCmBQ4.mjs";
import "../_libs/sonner.mjs";
import "../_libs/seroval.mjs";
import "../_libs/stripe.mjs";
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
import "../_libs/lucide-react.mjs";
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
const steps = [["Choose your delivery type", "Standard is one pickup and one drop-off. Multi-pickup adds more pickup addresses. Multi-dropoff adds more drop-off addresses."], ["Enter every address", "The form opens a field for each pickup or drop-off. Add a unit number or gate code if needed."], ["Describe the item", "A quick sentence so the Runner knows what they're picking up. Name a pickup contact or recipient when they are different from you."], ["Review pricing", "Base fee + per mile + $3.00 for each extra address."], ["Optional tip", "Add a tip before you pay. You can prefer or block a Runner later in Settings."], ["Pay securely", "Stripe handles the transaction — your card details never touch our servers."], ["Track live", "Watch the Runner move in real time on a GPS map."], ["Chat in‑app", "Need to update the address or add a note? Message your Runner directly."], ["Photo proof", "A photo at drop‑off confirms delivery and goes straight to your order screen."], ["Rate the delivery", "After a completed order you can leave a star rating. There is no published rating yet because there are no completed orders."]];
function HowItWorks() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(PageShell, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "container-app py-20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-widest text-gold", children: "How it works" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-3 max-w-3xl font-serif text-6xl leading-[1.05]", children: "From your phone to their hands." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-6 max-w-xl text-lg text-muted-foreground", children: [
        "Coming to your city very soon!!! Louisville is first. Multi-pickup and multi-dropoff are available. ",
        CARGO_INSURANCE_STATEMENT,
        " ",
        SUPPORT_STATEMENT,
        " ",
        DRIVER_SCREENING_STATEMENT,
        " Here's the order flow."
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "container-app pb-20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("ol", { className: "grid gap-4 md:grid-cols-2", children: steps.map(([t, b], i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "rounded-2xl border border-border bg-card p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-serif text-5xl text-gold/30", children: String(i + 1).padStart(2, "0") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-2 font-serif text-2xl", children: t }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: b })
      ] }, t)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-14 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, size: "lg", className: "bg-gold text-primary-foreground hover:bg-gold/90", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/signup", children: "Create your account" }) }) })
    ] })
  ] });
}
export {
  HowItWorks as component
};
