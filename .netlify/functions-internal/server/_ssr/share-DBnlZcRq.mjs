import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { B as Button } from "./button-BXrfXN_b.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { C as Check, b as Copy, S as Share2, D as Download } from "../_libs/lucide-react.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "stream";
import "crypto";
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
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-2xl space-y-8", children: [
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
  ] });
}
export {
  Share as component
};
