import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { P as PageShell } from "./page-shell-C9kH61wK.mjs";
import { B as Button } from "./button-BXrfXN_b.mjs";
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
import "../_libs/lucide-react.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
const steps = [["Enter pickup address", "Where the Runner should go to grab your item. Add a unit number or gate code if needed."], ["Describe the item", "A quick sentence so the Runner knows what they're picking up."], ["Enter drop‑off address", "Add a recipient name and phone if it's going to someone else."], ["Choose your delivery type", "Standard (1→1), multi‑pickup (many→1), or multi‑drop (1→many)."], ["Review pricing", "Base fee + per‑mile + extra stops. No hidden charges."], ["Optional add‑ons", "Schedule later, tip your driver, apply a promo, request a preferred Runner."], ["Pay securely", "Stripe handles the transaction — your card details never touch our servers."], ["Track live", "Watch the Runner move in real time on a GPS map."], ["Chat in‑app", "Need to update the address or add a note? Message your Runner directly."], ["Photo proof", "A photo at drop‑off confirms delivery and goes straight to your order screen."], ["Rate & review", "30 seconds to leave feedback. Drivers see your rating, you build their reputation."], ["Earn loyalty points", "Points auto‑awarded after every delivery — redeem for discounts."]];
function HowItWorks() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(PageShell, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "container-app py-20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-widest text-gold", children: "How it works" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-3 max-w-3xl font-serif text-6xl leading-[1.05]", children: "From your phone to their hands — in twelve simple beats." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-6 max-w-xl text-lg text-muted-foreground", children: "We designed MyRunner so anyone can send a delivery in under a minute. Here's the full flow." })
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
