import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { P as PageShell } from "./page-shell-Daj9NfIl.mjs";
import { D as DRIVER_SCREENING_STATEMENT, C as CARGO_INSURANCE_STATEMENT, b as SUPPORT_STATEMENT, c as SUPPORT_PHONE_DISPLAY, d as SUPPORT_EMAIL } from "./support-knowledge-BldCmBQ4.mjs";
import "../_libs/sonner.mjs";
import "../_libs/seroval.mjs";
import "../_libs/stripe.mjs";
import { F as FileCheckCorner, e as ShieldCheck, f as MapPin, g as Camera, h as Lock, H as Headphones } from "../_libs/lucide-react.mjs";
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
import "./back-button-PLK58KB_.mjs";
import "./router-CaL1rPwL.mjs";
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
import "./signup-intent-DuoHB-mj.mjs";
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
import "../_libs/zod.mjs";
import "events";
import "http";
import "https";
import "os";
import "./use-auth-B85-Dc53.mjs";
import "./client-DfLBq1uk.mjs";
function Safety() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(PageShell, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "container-app py-20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-widest text-gold", children: "Safety" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-3 max-w-3xl font-serif text-6xl leading-[1.05]", children: "Trust isn't a feature. It's the foundation." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-sm font-semibold uppercase tracking-wide text-gold", children: "Coming to your city very soon!!!" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "container-app pb-24 grid gap-4 md:grid-cols-2 lg:grid-cols-3", children: [{
      icon: FileCheckCorner,
      t: "Driver screening",
      b: DRIVER_SCREENING_STATEMENT
    }, {
      icon: ShieldCheck,
      t: "Cargo insurance",
      b: CARGO_INSURANCE_STATEMENT
    }, {
      icon: MapPin,
      t: "Live GPS tracking",
      b: "While a Runner is online, the app shares location from the device and refreshes about every 20 seconds."
    }, {
      icon: Camera,
      t: "Photo proof of delivery",
      b: "A confirmation photo at drop-off is stored on the order."
    }, {
      icon: Lock,
      t: "Stripe-secured payments",
      b: "Card payments go through Stripe. MyRunner does not store full card numbers."
    }, {
      icon: Headphones,
      t: "Support",
      b: `${SUPPORT_STATEMENT} ${SUPPORT_PHONE_DISPLAY} or ${SUPPORT_EMAIL}.`
    }].map(({
      icon: Icon,
      t,
      b
    }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-card p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "size-6 text-gold" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-4 font-serif text-2xl", children: t }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: b })
    ] }, t)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "container-app pb-24", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl border border-border bg-surface p-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-serif text-3xl", children: "Coverage and screening" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 grid gap-4 sm:grid-cols-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { t: "Cargo insurance", b: CARGO_INSURANCE_STATEMENT }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { t: "Auto insurance", b: "Runners carry their own auto insurance." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { t: "Checkr", b: DRIVER_SCREENING_STATEMENT }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { t: "Support", b: `${SUPPORT_STATEMENT} ${SUPPORT_PHONE_DISPLAY} · ${SUPPORT_EMAIL}.` })
      ] })
    ] }) })
  ] });
}
function Row({
  t,
  b
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border bg-card p-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-serif text-lg", children: t }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: b })
  ] });
}
export {
  Safety as component
};
