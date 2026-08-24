import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { P as PageShell } from "./page-shell-C9kH61wK.mjs";
import { B as Button } from "./button-BXrfXN_b.mjs";
import { A as ArrowRight, s as Shield, M as MapPin, e as CircleCheck, Z as Zap } from "../_libs/lucide-react.mjs";
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
const HERO_VIDEO = "https://cdn.pixabay.com/video/2021/04/12/70860-536965158_large.mp4";
function HeroBackgroundVideo() {
  const ref = reactExports.useRef(null);
  reactExports.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.muted = true;
    el.defaultMuted = true;
    el.playsInline = true;
    el.setAttribute("muted", "");
    el.setAttribute("playsinline", "");
    el.setAttribute("webkit-playsinline", "true");
    el.disablePictureInPicture = true;
    const tryPlay = () => {
      el.muted = true;
      void el.play().catch(() => void 0);
    };
    tryPlay();
    el.addEventListener("loadeddata", tryPlay);
    el.addEventListener("canplay", tryPlay);
    el.addEventListener("canplaythrough", tryPlay);
    const onGesture = () => tryPlay();
    window.addEventListener("pointerdown", onGesture, { passive: true });
    window.addEventListener("touchstart", onGesture, { passive: true });
    const onVis = () => {
      if (document.visibilityState === "visible") tryPlay();
    };
    document.addEventListener("visibilitychange", onVis);
    const kick = window.setInterval(() => {
      if (el.paused) tryPlay();
      else window.clearInterval(kick);
    }, 800);
    const stopKick = window.setTimeout(() => window.clearInterval(kick), 12e3);
    return () => {
      el.removeEventListener("loadeddata", tryPlay);
      el.removeEventListener("canplay", tryPlay);
      el.removeEventListener("canplaythrough", tryPlay);
      window.removeEventListener("pointerdown", onGesture);
      window.removeEventListener("touchstart", onGesture);
      document.removeEventListener("visibilitychange", onVis);
      window.clearInterval(kick);
      window.clearTimeout(stopKick);
    };
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-black", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "video",
      {
        ref,
        src: HERO_VIDEO,
        autoPlay: true,
        muted: true,
        loop: true,
        playsInline: true,
        preload: "auto",
        controls: false,
        disablePictureInPicture: true,
        className: "hero-bg-video size-full object-cover opacity-[0.72]"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-black/75" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(0,0,0,0.55)_100%)]" })
  ] });
}
function Landing() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(PageShell, { className: "bg-transparent", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(HeroBackgroundVideo, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "min-h-screen flex items-center pt-20", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container-app py-24 lg:py-32", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-2xl text-white", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex w-fit items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs uppercase tracking-widest text-gold backdrop-blur-sm font-bold shadow-glow", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "size-1.5 animate-pulse rounded-full bg-gold" }),
          "Now live in 50+ cities · 24/7"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "mt-6 font-serif text-6xl leading-[1.02] sm:text-7xl lg:text-8xl drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)] font-black", children: [
          "Need it moved?",
          /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "italic text-gold italic", children: "We're already on it." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-8 max-w-xl text-lg text-white/90 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] font-bold", children: [
          "MyRunner connects you with vetted local Runners who'll pick up and deliver almost anything. Starting at ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gold font-black underline decoration-gold/50", children: "$5.99" }),
          "."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-10 flex flex-wrap gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, size: "lg", className: "bg-gold text-black hover:bg-gold/90 font-black rounded-full px-12 h-16 text-lg shadow-glow", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/signup", children: [
            "Send a delivery ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "ml-2" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, size: "lg", variant: "outline", className: "border-white/20 bg-white/5 backdrop-blur-sm text-white font-bold rounded-full px-12 h-16", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/drivers", children: "Earn as a Runner" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-16 flex items-center gap-8 text-xs text-white/60 font-black uppercase tracking-widest", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Avg pickup", value: "< 12 min" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Cargo insured", value: "$100" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Rating", value: "4.9 ★" })
        ] })
      ] }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-[#050505] border-t border-white/5 pt-32 pb-32", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container-app", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-8 text-center text-[10px] font-black uppercase tracking-[0.3em] text-white/30 sm:grid-cols-4 mb-32 bg-white/2 p-10 rounded-[40px] border border-white/5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "size-6 text-gold" }),
            " Vetted Drivers"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "size-6 text-gold" }),
            " Live GPS"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "size-6 text-gold" }),
            " Photo Proof"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "size-6 text-gold" }),
            " Secure Pay"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-48 text-center lg:text-left", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-black uppercase tracking-[0.4em] text-gold mb-4", children: "The Process" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-5xl lg:text-7xl font-serif text-white mb-20 leading-tight", children: [
            "Doorstep to doorstep,",
            /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
            "in four simple steps."
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-12 md:grid-cols-4", children: steps.map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-[#111] p-10 rounded-[40px] border border-white/5 relative overflow-hidden group hover:border-gold/30 transition-all text-left", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-7xl font-serif text-gold/10 absolute -top-2 -left-2", children: [
              "0",
              i + 1
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-2xl font-bold mt-12 text-white relative z-10", children: s.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/40 mt-4 leading-relaxed font-bold uppercase text-xs relative z-10", children: s.body })
          ] }, i)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-[50px] bg-gradient-to-br from-[#1a1a1a] to-black p-12 lg:p-24 border border-gold/20 shadow-2xl mb-48", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-2 gap-20 items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-black uppercase tracking-[0.4em] text-gold mb-6", children: "Transparency" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-6xl font-serif text-white leading-tight mb-8", children: [
              "$5.99 to start.",
              /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white/30 italic", children: "No surprises." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/50 text-lg mb-10 leading-relaxed font-medium", children: "You see the full price before you pay. $1.50 per mile, $3 per extra stop. 100% of tips go to your Runner." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, size: "lg", className: "bg-gold text-black font-black px-12 py-8 rounded-full text-lg shadow-glow", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/pricing", children: "See Pricing Guide" }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: ["Base fee: $5.99", "Mileage: $1.50/mi", "Extra Stops: $3.00", "Cargo Insurance: Free", "100% Tips to Runner"].map((line) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white/2 border border-white/5 p-6 rounded-2xl flex items-center gap-4 text-white/80 font-black uppercase text-[10px] tracking-widest", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "size-5 text-green-500" }),
            " ",
            line
          ] }, line)) })
        ] }) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("footer", { className: "bg-[#111] border-t border-white/10 pt-32 pb-20 text-center relative z-20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container-app", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-gold font-serif text-4xl mb-6 italic tracking-tighter", children: "MyRunner" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap justify-center gap-x-10 gap-y-4 text-[10px] font-black uppercase tracking-[0.3em] text-white/60 mb-12", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/pricing", className: "hover:text-gold transition-colors", children: "Pricing" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/safety", className: "hover:text-gold transition-colors", children: "Safety" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/privacy", className: "hover:text-gold transition-colors", children: "Privacy" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/20 text-[8px] font-black uppercase tracking-[0.8em]", children: "Toma Shops Ecosystem · 2025" })
      ] }) })
    ] })
  ] });
}
function Stat({
  label,
  value
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-left", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-serif text-3xl text-white mb-1", children: value }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[9px] font-black uppercase tracking-[0.2em] text-gold/60", children: label })
  ] });
}
const steps = [{
  title: "Pickup & Drop",
  body: "Enter addresses and what we are moving."
}, {
  title: "Pick Service",
  body: "Standard or multi-stop delivery routes."
}, {
  title: "Secure Pay",
  body: "Stripe-secured payments with full insurance."
}, {
  title: "Track Live",
  body: "Watch your runner deliver on a live map."
}];
export {
  Landing as component
};
