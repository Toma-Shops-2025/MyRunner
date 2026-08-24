import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { P as PageShell } from "./page-shell-C9kH61wK.mjs";
import { F as FileCheckCorner, c as ShieldCheck, M as MapPin, d as Camera, L as Lock, H as Headphones } from "../_libs/lucide-react.mjs";
import "./footer-C9rrXBeC.mjs";
import "../_libs/tanstack__react-router.mjs";
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
function Safety() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(PageShell, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "container-app py-20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-widest text-gold", children: "Safety" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-3 max-w-3xl font-serif text-6xl leading-[1.05]", children: "Trust isn't a feature. It's the foundation." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "container-app pb-24 grid gap-4 md:grid-cols-2 lg:grid-cols-3", children: [{
      icon: FileCheckCorner,
      t: "Background checks",
      b: "Every Runner passes a Checkr screening — criminal history, DUIs, sexual offenses."
    }, {
      icon: ShieldCheck,
      t: "$100 cargo insurance",
      b: "Every delivery is covered against loss or damage."
    }, {
      icon: MapPin,
      t: "Live GPS tracking",
      b: "Drivers share location every 30 seconds during active jobs."
    }, {
      icon: Camera,
      t: "Photo proof of delivery",
      b: "Confirmation photo at the drop‑off goes to your order screen."
    }, {
      icon: Lock,
      t: "Stripe‑secured payments",
      b: "We never store your card. PCI‑compliant by design."
    }, {
      icon: Headphones,
      t: "24/7 support",
      b: "AI agents + human escalation for any issue, any hour."
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
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-serif text-3xl", children: "Insurance coverage" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 grid gap-4 sm:grid-cols-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { t: "Cargo / Goods in transit", b: "Up to $100 per delivery at no extra cost." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { t: "General liability", b: "Platform coverage for third‑party claims." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { t: "HNOA (Hired & Non‑Owned Auto)", b: "Covers drivers during active delivery windows." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { t: "Cyber liability", b: "Customer data and payment security." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { t: "Professional liability", b: "Covers negligence / service failure claims." })
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
