import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { B as Button } from "./router-CaL1rPwL.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { P as PageShell } from "./page-shell-Daj9NfIl.mjs";
import "../_libs/seroval.mjs";
import "../_libs/stripe.mjs";
import { C as Check, c as Copy, d as Share2, D as Download } from "../_libs/lucide-react.mjs";
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
import "./support-knowledge-BldCmBQ4.mjs";
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
import "./back-button-PLK58KB_.mjs";
import "./use-auth-B85-Dc53.mjs";
import "./client-DfLBq1uk.mjs";
const SHARE_URL = "https://myrunner.shop";
const SHARE_TEXT = "Need anything delivered? MyRunner — Anything. Anytime. Anywhere.";
const QR_SRC = `https://api.qrserver.com/v1/create-qr-code/?size=512x512&data=${encodeURIComponent(SHARE_URL)}`;
function Share() {
  const [copied, setCopied] = reactExports.useState(false);
  async function copyLink() {
    await navigator.clipboard.writeText(SHARE_URL);
    setCopied(true);
    toast.success("Link copied");
    setTimeout(() => setCopied(false), 2e3);
  }
  async function nativeShare() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "MyRunner",
          text: SHARE_TEXT,
          url: SHARE_URL
        });
      } catch {
      }
    } else {
      copyLink();
    }
  }
  function downloadQR() {
    const a = document.createElement("a");
    a.href = QR_SRC;
    a.download = "myrunner-qr.png";
    a.target = "_blank";
    a.rel = "noopener";
    a.click();
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(PageShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container-app space-y-8 pb-16 pt-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-serif text-4xl", children: "Share MyRunner" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-muted-foreground", children: "Help friends, neighbors, and local shops discover on‑demand delivery. Show the QR, share the link, or post it anywhere." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "overflow-hidden rounded-3xl border border-border bg-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center bg-gradient-to-br from-gold-soft to-card p-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl bg-white p-5 shadow-xl", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: QR_SRC, alt: "QR code to myrunner.shop", className: "size-64 rounded-lg" }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-widest text-muted-foreground", children: "Your link" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 break-all font-serif text-xl text-gold", children: SHARE_URL })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2 sm:grid-cols-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: copyLink, variant: "outline", children: [
            copied ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "mr-2 size-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "mr-2 size-4" }),
            copied ? "Copied" : "Copy link"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: nativeShare, variant: "outline", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Share2, { className: "mr-2 size-4" }),
            " Share"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: downloadQR, className: "bg-gold text-primary-foreground hover:bg-gold/90", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "mr-2 size-4" }),
            " Download QR"
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-2xl border border-border bg-card p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-serif text-2xl", children: "Where to share" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "mt-3 space-y-2 text-sm text-foreground/80", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "· Print the QR on flyers, business cards, or vehicle decals" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "· Post it on Instagram, TikTok, or Facebook with a short caption" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "· Hand cards to neighbors, gyms, coffee shops, and apartment lobbies" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "· Add it as the end card of any video you publish (5+ seconds, on white)" })
      ] })
    ] })
  ] }) });
}
export {
  Share as component
};
