import { b as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { Q as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { c as createRouter, a as createRootRouteWithContext, u as useRouter, L as Link, O as Outlet, H as HeadContent, S as Scripts, b as createFileRoute, l as lazyRouteComponent, d as useRouterState } from "../_libs/tanstack__react-router.mjs";
import { S as notFound } from "../_libs/tanstack__router-core.mjs";
import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { T as Toaster$1 } from "../_libs/sonner.mjs";
import { c as createSsrRpc } from "./createSsrRpc-xYjLf7RI.mjs";
import { c as createServerFn } from "./server-pkl-8gUD.mjs";
import { S as Slot } from "../_libs/radix-ui__react-slot.mjs";
import { c as cva } from "../_libs/class-variance-authority.mjs";
import { c as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { p as parseSignupIntent } from "./signup-intent-DuoHB-mj.mjs";
import { R as REFUND_POLICY_STATEMENT, a as SUPPORT_FAQ } from "./support-knowledge-BldCmBQ4.mjs";
import { createHmac, timingSafeEqual } from "crypto";
import { c as createStripeClient, p as paymentIntentIdFromSession, r as resolvePaymentIntentId, i as isDriverConnectReady } from "./stripe-payout.server-BMP7bU7B.mjs";
import { supabaseAdmin } from "./client.server-D5ro3rAQ.mjs";
import { reassignExpired } from "./dispatch.functions-CDAFMReD.mjs";
import { X, L as LoaderCircle, S as Send, M as MessageCircle, V as VolumeX, a as Volume2 } from "../_libs/lucide-react.mjs";
import { o as objectType, s as stringType } from "../_libs/zod.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "stream";
import "node:stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/stripe.mjs";
import "events";
import "http";
import "https";
import "os";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "./auth-middleware-CMwi6y2l.mjs";
const Toaster = ({ ...props }) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Toaster$1,
    {
      className: "toaster group",
      toastOptions: {
        classNames: {
          toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
        }
      },
      ...props
    }
  );
};
const track01 = "/assets/01-CuXTjyk8.mp3";
const track02 = "/assets/02-CdMDc8_I.mp3";
const track03 = "/assets/03-JsxYgFxs.mp3";
const BGM_TRACKS = [track01, track02, track03];
const BGM_VOLUME = 6e-3;
const BGM_ALLOWED_PATHS = /* @__PURE__ */ new Set(["/", "/app/dashboard", "/driver/dashboard"]);
function shuffleTracks(tracks) {
  const next = [...tracks];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}
function normalizePath(pathname) {
  if (!pathname) return "/";
  if (pathname.length > 1 && pathname.endsWith("/")) return pathname.slice(0, -1);
  return pathname;
}
function isBgmRoute(pathname) {
  return BGM_ALLOWED_PATHS.has(normalizePath(pathname));
}
const BgmContext = reactExports.createContext(null);
function useBgmVolume() {
  const ctx = reactExports.useContext(BgmContext);
  if (!ctx) throw new Error("useBgmVolume must be used within BgmProvider");
  return ctx;
}
function BgmMuteButton() {
  const { muted, setMuted } = useBgmVolume();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "button",
    {
      type: "button",
      onClick: () => setMuted(!muted),
      className: "fixed bottom-4 right-4 z-[60] flex size-11 items-center justify-center rounded-full border border-gold/40 bg-background/95 text-gold shadow-lg backdrop-blur-md transition-colors hover:bg-gold/10",
      "aria-label": muted ? "Unmute background music" : "Mute background music",
      title: muted ? "Unmute music" : "Mute music",
      children: muted ? /* @__PURE__ */ jsxRuntimeExports.jsx(VolumeX, { className: "h-5 w-5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Volume2, { className: "h-5 w-5" })
    }
  );
}
function BgmProvider({ children }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const routeAllowsBgm = isBgmRoute(pathname);
  const bgmRef = reactExports.useRef(null);
  const queueRef = reactExports.useRef([]);
  const indexRef = reactExports.useRef(0);
  const playNextRef = reactExports.useRef(() => void 0);
  const mutedRef = reactExports.useRef(false);
  const shouldPlayRef = reactExports.useRef(false);
  const [muted, setMutedState] = reactExports.useState(false);
  const [ready, setReady] = reactExports.useState(false);
  const applyVolume = reactExports.useCallback(() => {
    if (bgmRef.current) {
      bgmRef.current.volume = mutedRef.current ? 0 : BGM_VOLUME;
    }
  }, []);
  const setMuted = reactExports.useCallback(
    (value) => {
      mutedRef.current = value;
      setMutedState(value);
      applyVolume();
    },
    [applyVolume]
  );
  const pauseBgm = reactExports.useCallback(() => {
    bgmRef.current?.pause();
  }, []);
  const loadCurrent = reactExports.useCallback(() => {
    const audio = bgmRef.current;
    if (!audio) return;
    if (queueRef.current.length === 0) {
      queueRef.current = shuffleTracks(BGM_TRACKS);
      indexRef.current = 0;
    }
    const src = queueRef.current[indexRef.current];
    if (!src) return;
    if (!audio.src.endsWith(src) && audio.getAttribute("src") !== src) {
      audio.src = src;
    }
    applyVolume();
  }, [applyVolume]);
  playNextRef.current = () => {
    if (!shouldPlayRef.current) return;
    indexRef.current += 1;
    if (indexRef.current >= queueRef.current.length) {
      queueRef.current = shuffleTracks(BGM_TRACKS);
      indexRef.current = 0;
    }
    loadCurrent();
    bgmRef.current?.play().catch(() => void 0);
  };
  const ensureAudio = reactExports.useCallback(() => {
    if (bgmRef.current) return bgmRef.current;
    const audio = new Audio();
    audio.preload = "auto";
    audio.addEventListener("ended", () => playNextRef.current());
    bgmRef.current = audio;
    loadCurrent();
    return audio;
  }, [loadCurrent]);
  const startBgm = reactExports.useCallback(() => {
    if (!shouldPlayRef.current) return;
    if (typeof document !== "undefined" && document.visibilityState !== "visible") return;
    const audio = ensureAudio();
    applyVolume();
    audio.play().catch(() => void 0);
  }, [applyVolume, ensureAudio]);
  reactExports.useEffect(() => {
    mutedRef.current = false;
    setReady(true);
  }, []);
  reactExports.useEffect(() => {
    if (!ready) return;
    const syncPlayback = () => {
      const foreground = document.visibilityState === "visible";
      shouldPlayRef.current = routeAllowsBgm && foreground;
      if (shouldPlayRef.current) startBgm();
      else pauseBgm();
    };
    syncPlayback();
    const onVisible = () => syncPlayback();
    const onFirstGesture = () => {
      if (shouldPlayRef.current) startBgm();
    };
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("pagehide", pauseBgm);
    window.addEventListener("pointerdown", onFirstGesture, { once: true });
    window.addEventListener("touchstart", onFirstGesture, { once: true, passive: true });
    window.addEventListener("keydown", onFirstGesture, { once: true });
    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("pagehide", pauseBgm);
      window.removeEventListener("pointerdown", onFirstGesture);
      window.removeEventListener("touchstart", onFirstGesture);
      window.removeEventListener("keydown", onFirstGesture);
      shouldPlayRef.current = false;
      pauseBgm();
    };
  }, [ready, routeAllowsBgm, startBgm, pauseBgm]);
  reactExports.useEffect(() => {
    return () => {
      if (bgmRef.current) {
        bgmRef.current.pause();
        bgmRef.current = null;
      }
    };
  }, []);
  const showMute = ready && routeAllowsBgm;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(BgmContext.Provider, { value: { muted, setMuted }, children: [
    children,
    showMute ? /* @__PURE__ */ jsxRuntimeExports.jsx(BgmMuteButton, {}) : null
  ] });
}
const askSupportAssistant = createServerFn({
  method: "POST"
}).inputValidator((d) => d).handler(createSsrRpc("5c7f3b6c6dd08d9a4d93fde213d7f10e6468f59723bef008fa924bd1c223fcb8"));
const submitContactMessage = createServerFn({
  method: "POST"
}).inputValidator((d) => d).handler(createSsrRpc("991eae88ac8999d518f199c713618e0e44c024e5157371cb2ece8d4bbd0eb014"));
const triageSafetyReport = createServerFn({
  method: "POST"
}).inputValidator((d) => d).handler(createSsrRpc("6ac62bd8ed50dbb9dff3486842de5b38002caaaa78b6a31f62c3eb6f900f4879"));
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
const Button = reactExports.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Comp, { className: cn(buttonVariants({ variant, size, className })), ref, ...props });
  }
);
Button.displayName = "Button";
const STARTER = {
  role: "assistant",
  content: "Hi — I'm the MyRunner assistant. Ask about pricing, deliveries, becoming a Runner, refunds, or your recent orders if you're signed in."
};
function SupportChat() {
  const [open, setOpen] = reactExports.useState(false);
  const [input, setInput] = reactExports.useState("");
  const [busy, setBusy] = reactExports.useState(false);
  const [messages, setMessages] = reactExports.useState([STARTER]);
  const bottomRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);
  async function send() {
    const text = input.trim();
    if (!text || busy) return;
    const next = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setBusy(true);
    try {
      const res = await askSupportAssistant({
        data: { messages: next.slice(-12) }
      });
      const reply = res?.reply || "Sorry — I couldn't answer that. Email support@myrunner.shop.";
      setMessages((m) => [...m, { role: "assistant", content: reply }]);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Something went wrong.";
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: msg.includes("GEMINI") || msg.includes("not configured") ? "AI support isn't configured on the server yet. Email support@myrunner.shop and we'll help." : `I hit a snag: ${msg}. You can also email support@myrunner.shop.`
        }
      ]);
    } finally {
      setBusy(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pointer-events-none fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3 sm:bottom-6 sm:right-6", children: [
    open && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pointer-events-auto flex h-[min(70vh,520px)] w-[min(100vw-2rem,380px)] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "flex items-center justify-between border-b border-border bg-background/80 px-4 py-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-widest text-gold", children: "Support" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-serif text-lg leading-tight", children: "Ask MyRunner" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            "aria-label": "Close chat",
            className: "rounded-full p-2 text-muted-foreground hover:bg-accent",
            onClick: () => setOpen(false),
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-4" })
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-3 overflow-y-auto px-4 py-3 text-sm", children: [
        messages.map((m, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: `max-w-[90%] rounded-2xl px-3 py-2 ${m.role === "user" ? "ml-auto bg-gold text-primary-foreground" : "bg-muted/60 text-foreground"}`,
            children: m.content
          },
          `${i}-${m.role}`
        )),
        busy && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-3 animate-spin" }),
          " Thinking…"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: bottomRef })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "form",
        {
          className: "flex gap-2 border-t border-border p-3",
          onSubmit: (e) => {
            e.preventDefault();
            void send();
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                value: input,
                onChange: (e) => setInput(e.target.value),
                placeholder: "Ask a question…",
                className: "min-w-0 flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-gold",
                disabled: busy
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "submit",
                size: "icon",
                disabled: busy || !input.trim(),
                className: "shrink-0 bg-gold text-primary-foreground hover:bg-gold/90",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "size-4" })
              }
            )
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Button,
      {
        type: "button",
        size: "lg",
        className: "pointer-events-auto h-14 rounded-full bg-gold px-5 text-primary-foreground shadow-lg hover:bg-gold/90",
        onClick: () => setOpen((v) => !v),
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "mr-2 size-5" }),
          open ? "Close" : "Help"
        ]
      }
    )
  ] });
}
const appCss = "/assets/styles-DWDOzyAI.css";
function NotFoundComponent() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-7xl font-bold text-foreground", children: "404" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-4 text-xl font-semibold text-foreground", children: "Page not found" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "The page you're looking for doesn't exist or has been moved." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Link,
      {
        to: "/",
        className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
        children: "Go home"
      }
    ) })
  ] }) });
}
function ErrorComponent({ error, reset }) {
  console.error(error);
  const router2 = useRouter();
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-semibold tracking-tight text-foreground", children: "This page didn't load" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Something went wrong on our end. You can try refreshing or head back home." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex flex-wrap justify-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => {
            router2.invalidate();
            reset();
          },
          className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
          children: "Try again"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: "/",
          className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
          children: "Go home"
        }
      )
    ] })
  ] }) });
}
const Route$G = createRootRouteWithContext()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      {
        name: "google-site-verification",
        content: "BEsSfOv38xf_zNFOewNlF-GO18ppW-ANH4XbaOctBkc"
      },
      {
        name: "google-site-verification",
        content: "saWreFAe0LYPxmtXc_y8xBDuerHfQ0PXEBCDt87ohgk"
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1, viewport-fit=cover, interactive-widget=resizes-content"
      },
      { name: "theme-color", content: "#0a0a0a" },
      { name: "author", content: "MyRunner" },
      { property: "og:site_name", content: "MyRunner" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@myrunner" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
      { name: "apple-mobile-web-app-title", content: "MyRunner" },
      { title: "MyRunner — Anything. Anywhere. Anytime." },
      { property: "og:title", content: "MyRunner — Anything. Anywhere. Anytime." },
      { name: "twitter:title", content: "MyRunner — Anything. Anywhere. Anytime." },
      { name: "description", content: "MyRunner is a pickup-and-delivery marketplace. Louisville is first. After launch in a city or state, support is 24/7 and cargo insurance applies once it is obtained before that launch." },
      { property: "og:description", content: "MyRunner is a pickup-and-delivery marketplace. Louisville is first. After launch in a city or state, support is 24/7 and cargo insurance applies once it is obtained before that launch." },
      { name: "twitter:description", content: "MyRunner is a pickup-and-delivery marketplace. Louisville is first. After launch in a city or state, support is 24/7 and cargo insurance applies once it is obtained before that launch." },
      { property: "og:image", content: "https://myrunner.shop/og-image.png" },
      { name: "twitter:image", content: "https://myrunner.shop/og-image.png" }
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/png", href: "/favicon.png" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
      { rel: "manifest", href: "/manifest.webmanifest" }
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "MyRunner",
          url: "/",
          logo: "/icon-512.png",
          email: "support@myrunner.shop",
          slogan: "Anything · Anytime · Anywhere"
        })
      }
    ]
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent
});
function RootShell({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("head", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(Scripts, {})
    ] })
  ] });
}
function RootComponent() {
  const { queryClient } = Route$G.useRouteContext();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(BgmProvider, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SupportChat, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Toaster, { richColors: true, position: "top-center" })
  ] }) });
}
const $$splitComponentImporter$A = () => import("./terms-BZoN3sC_.mjs");
const Route$F = createFileRoute("/terms")({
  head: () => ({
    meta: [{
      title: "Terms of Service — MyRunner"
    }, {
      name: "description",
      content: "The legal terms that govern your use of the MyRunner platform — for customers and drivers."
    }, {
      property: "og:title",
      content: "MyRunner Terms of Service"
    }, {
      property: "og:url",
      content: "/terms"
    }],
    links: [{
      rel: "canonical",
      href: "/terms"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$A, "component")
});
const BASE_URL = "";
const entries = [
  { path: "/", priority: "1.0", changefreq: "weekly" },
  { path: "/how-it-works", priority: "0.8", changefreq: "monthly" },
  { path: "/pricing", priority: "0.9", changefreq: "monthly" },
  { path: "/drivers", priority: "0.9", changefreq: "monthly" },
  { path: "/driver-signup", priority: "0.7", changefreq: "monthly" },
  { path: "/safety", priority: "0.7", changefreq: "monthly" },
  { path: "/about", priority: "0.6", changefreq: "yearly" },
  { path: "/contact", priority: "0.6", changefreq: "yearly" },
  { path: "/faq", priority: "0.8", changefreq: "monthly" },
  { path: "/terms", priority: "0.4", changefreq: "yearly" },
  { path: "/privacy", priority: "0.4", changefreq: "yearly" },
  { path: "/cookies", priority: "0.3", changefreq: "yearly" },
  { path: "/community-guidelines", priority: "0.5", changefreq: "yearly" },
  { path: "/refund-policy", priority: "0.4", changefreq: "yearly" },
  { path: "/accessibility", priority: "0.3", changefreq: "yearly" }
];
const Route$E = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...entries.map((e) => [
            `  <url>`,
            `    <loc>${BASE_URL}${e.path}</loc>`,
            `    <changefreq>${e.changefreq}</changefreq>`,
            `    <priority>${e.priority}</priority>`,
            `  </url>`
          ].join("\n")),
          `</urlset>`
        ].join("\n");
        return new Response(xml, {
          headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" }
        });
      }
    }
  }
});
const $$splitComponentImporter$z = () => import("./signup-DnYblAdx.mjs");
const Route$D = createFileRoute("/signup")({
  validateSearch: (search) => ({
    intent: parseSignupIntent(search.intent),
    ref: typeof search.ref === "string" ? search.ref.trim() : void 0
  }),
  head: () => ({
    meta: [{
      title: "Create your MyRunner account"
    }, {
      name: "description",
      content: "Sign up for MyRunner to send deliveries or apply to drive as a Runner."
    }, {
      name: "robots",
      content: "noindex"
    }],
    links: [{
      rel: "canonical",
      href: "/signup"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$z, "component")
});
const $$splitComponentImporter$y = () => import("./share-p8ssL2mg.mjs");
const Route$C = createFileRoute("/share")({
  head: () => ({
    meta: [{
      title: "Share MyRunner — Refer friends & earn"
    }, {
      name: "description",
      content: "Share MyRunner with friends, neighbors, and local shops. Scan or share the link."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$y, "component")
});
const $$splitComponentImporter$x = () => import("./safety-DIrSJFtY.mjs");
const Route$B = createFileRoute("/safety")({
  head: () => ({
    meta: [{
      title: "Safety — How MyRunner handles a delivery"
    }, {
      name: "description",
      content: "After MyRunner launches in a city or state: 24/7 support, cargo insurance obtained before that launch, and drivers start once the application, license, and auto insurance are provided."
    }, {
      property: "og:title",
      content: "Safety — MyRunner"
    }, {
      property: "og:description",
      content: "Every layer of safety we've built into the platform."
    }, {
      property: "og:url",
      content: "/safety"
    }],
    links: [{
      rel: "canonical",
      href: "/safety"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$x, "component")
});
const $$splitComponentImporter$w = () => import("./refund-policy-iDu2Q1aN.mjs");
const Route$A = createFileRoute("/refund-policy")({
  head: () => ({
    meta: [{
      title: "Refund Policy — MyRunner"
    }, {
      name: "description",
      content: REFUND_POLICY_STATEMENT
    }, {
      property: "og:title",
      content: "MyRunner Refund Policy"
    }, {
      property: "og:url",
      content: "/refund-policy"
    }],
    links: [{
      rel: "canonical",
      href: "/refund-policy"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$w, "component")
});
const $$splitComponentImporter$v = () => import("./privacy-C6OLTo-a.mjs");
const Route$z = createFileRoute("/privacy")({
  head: () => ({
    meta: [{
      title: "Privacy Policy — MyRunner"
    }, {
      name: "description",
      content: "How MyRunner collects, uses, shares, and protects your personal data, including GPS location, payment details, and account information."
    }, {
      property: "og:title",
      content: "MyRunner Privacy Policy"
    }, {
      property: "og:url",
      content: "/privacy"
    }],
    links: [{
      rel: "canonical",
      href: "/privacy"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$v, "component")
});
const $$splitComponentImporter$u = () => import("./pricing-0MyRQULg.mjs");
const Route$y = createFileRoute("/pricing")({
  head: () => ({
    meta: [{
      title: "Pricing — MyRunner delivery fees, simple & transparent"
    }, {
      name: "description",
      content: "MyRunner starts at $5.99 base + $1.50/mile + $3 per extra stop. No hidden fees. Tips go 100% to drivers."
    }, {
      property: "og:title",
      content: "MyRunner pricing"
    }, {
      property: "og:description",
      content: "Transparent per‑delivery pricing. No subscriptions, no surge to customers."
    }, {
      property: "og:url",
      content: "/pricing"
    }],
    links: [{
      rel: "canonical",
      href: "/pricing"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$u, "component")
});
const $$splitComponentImporter$t = () => import("./login-D8shism6.mjs");
const Route$x = createFileRoute("/login")({
  head: () => ({
    meta: [{
      title: "Sign in — MyRunner"
    }, {
      name: "description",
      content: "Sign in to your MyRunner account to send and track deliveries."
    }, {
      name: "robots",
      content: "noindex"
    }],
    links: [{
      rel: "canonical",
      href: "/login"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$t, "component")
});
const $$splitComponentImporter$s = () => import("./how-it-works-BP0J2vy0.mjs");
const Route$w = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [{
      title: "How MyRunner works — Send a delivery in minutes"
    }, {
      name: "description",
      content: "Request a Runner, watch them on a live map, get photo proof at drop‑off. Here's exactly how MyRunner deliveries work."
    }, {
      property: "og:title",
      content: "How MyRunner works"
    }, {
      property: "og:description",
      content: "A step‑by‑step walkthrough of sending a delivery on MyRunner."
    }, {
      property: "og:url",
      content: "/how-it-works"
    }],
    links: [{
      rel: "canonical",
      href: "/how-it-works"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$s, "component")
});
const $$splitComponentImporter$r = () => import("./faq-BHPB5J2P.mjs");
const Route$v = createFileRoute("/faq")({
  head: () => ({
    meta: [{
      title: "MyRunner FAQ — Answers for customers & drivers"
    }, {
      name: "description",
      content: "How does pricing work? What can I send? How do I become a driver? Everything you need to know about MyRunner."
    }, {
      property: "og:title",
      content: "MyRunner FAQ"
    }, {
      property: "og:description",
      content: "Customer and driver answers, in one place."
    }, {
      property: "og:url",
      content: "/faq"
    }],
    links: [{
      rel: "canonical",
      href: "/faq"
    }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: SUPPORT_FAQ.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: {
            "@type": "Answer",
            text: f.a
          }
        }))
      })
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$r, "component")
});
const $$splitComponentImporter$q = () => import("./drivers-_IXeyUoz.mjs");
const Route$u = createFileRoute("/drivers")({
  head: () => ({
    meta: [{
      title: "Drive with MyRunner — Keep DoorDash & Uber, earn on the side"
    }, {
      name: "description",
      content: "Already delivering? Add MyRunner. Keep your other apps, go online when you want, keep 70% of every fee + 100% of tips. Early Runners get first dibs."
    }, {
      property: "og:title",
      content: "Add MyRunner to your gig apps"
    }, {
      property: "og:description",
      content: "Same car. Same hours. Extra local deliveries when you're already out."
    }, {
      property: "og:url",
      content: "/drivers"
    }],
    links: [{
      rel: "canonical",
      href: "/drivers"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$q, "component")
});
const $$splitComponentImporter$p = () => import("./driver-signup-IP7Mhhco.mjs");
const Route$t = createFileRoute("/driver-signup")({
  head: () => ({
    meta: [{
      title: "Become a Runner — Apply to drive for MyRunner"
    }, {
      name: "description",
      content: "Apply to drive for MyRunner. After launch in a city or state, drivers there can start once the application, a driver's license, and auto insurance are provided. Disqualifying charges found once Checkr is used deactivate the driver."
    }],
    links: [{
      rel: "canonical",
      href: "/driver-signup"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$p, "component")
});
const $$splitComponentImporter$o = () => import("./driver-DskUrOLI.mjs");
const Route$s = createFileRoute("/driver")({
  component: lazyRouteComponent($$splitComponentImporter$o, "component")
});
const $$splitComponentImporter$n = () => import("./cookies-DC1B-Cij.mjs");
const Route$r = createFileRoute("/cookies")({
  head: () => ({
    meta: [{
      title: "Cookie Policy — MyRunner"
    }, {
      name: "description",
      content: "How MyRunner uses cookies and similar technologies, and how to control them."
    }, {
      property: "og:title",
      content: "MyRunner Cookie Policy"
    }, {
      property: "og:url",
      content: "/cookies"
    }],
    links: [{
      rel: "canonical",
      href: "/cookies"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$n, "component")
});
const $$splitComponentImporter$m = () => import("./contact-CTczH6qp.mjs");
const Route$q = createFileRoute("/contact")({
  head: () => ({
    meta: [{
      title: "Contact MyRunner — support@myrunner.shop"
    }, {
      name: "description",
      content: "Reach the MyRunner team. Email support@myrunner.shop or use our contact form for help with deliveries, drivers, refunds, or partnerships."
    }, {
      property: "og:title",
      content: "Contact MyRunner"
    }, {
      property: "og:description",
      content: "After MyRunner launches in a city or state, support is available 24/7 by phone or email. Support is handled directly by the founder during posted support hours."
    }, {
      property: "og:url",
      content: "/contact"
    }],
    links: [{
      rel: "canonical",
      href: "/contact"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$m, "component")
});
const $$splitComponentImporter$l = () => import("./community-guidelines-CZuQLPkP.mjs");
const Route$p = createFileRoute("/community-guidelines")({
  head: () => ({
    meta: [{
      title: "Community Guidelines — MyRunner"
    }, {
      name: "description",
      content: "The rules every customer and Runner agrees to follow on the MyRunner platform."
    }, {
      property: "og:title",
      content: "MyRunner Community Guidelines"
    }, {
      property: "og:url",
      content: "/community-guidelines"
    }],
    links: [{
      rel: "canonical",
      href: "/community-guidelines"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$l, "component")
});
const $$splitComponentImporter$k = () => import("./app-CZR3Ek3F.mjs");
const Route$o = createFileRoute("/app")({
  component: lazyRouteComponent($$splitComponentImporter$k, "component")
});
const $$splitComponentImporter$j = () => import("./admin-DxpFKIPg.mjs");
const Route$n = createFileRoute("/admin")({
  head: () => ({
    meta: [{
      title: "Admin — MyRunner"
    }, {
      name: "robots",
      content: "noindex"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$j, "component")
});
const $$splitComponentImporter$i = () => import("./accessibility-DSPoFZiI.mjs");
const Route$m = createFileRoute("/accessibility")({
  head: () => ({
    meta: [{
      title: "Accessibility — MyRunner"
    }, {
      name: "description",
      content: "MyRunner is committed to building a service that works for everyone, including people with disabilities. WCAG 2.1 AA targets."
    }, {
      property: "og:title",
      content: "MyRunner Accessibility"
    }, {
      property: "og:url",
      content: "/accessibility"
    }],
    links: [{
      rel: "canonical",
      href: "/accessibility"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$i, "component")
});
const $$splitComponentImporter$h = () => import("./about-C4jmLemc.mjs");
const Route$l = createFileRoute("/about")({
  head: () => ({
    meta: [{
      title: "About MyRunner — Pickup and delivery, not just food"
    }, {
      name: "description",
      content: "MyRunner is a pickup-and-delivery marketplace launching in Louisville, Kentucky. Arrange transportation of eligible items between people and places."
    }, {
      property: "og:title",
      content: "About MyRunner"
    }, {
      property: "og:description",
      content: "Anything. Anywhere. Anytime. Launching first in Louisville."
    }, {
      property: "og:url",
      content: "/about"
    }],
    links: [{
      rel: "canonical",
      href: "/about"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$h, "component")
});
const $$splitComponentImporter$g = () => import("./index-Tp_LXXg4.mjs");
const Route$k = createFileRoute("/")({
  head: () => ({
    meta: [{
      title: "MyRunner — On‑demand local delivery for anything, anywhere"
    }, {
      name: "description",
      content: "MyRunner is a pickup-and-delivery marketplace launching in Louisville, Kentucky. Arrange transportation of items you already own. Anything. Anywhere. Anytime."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$g, "component")
});
const $$splitErrorComponentImporter = () => import("./r._id-Ttbu7H09.mjs");
const $$splitNotFoundComponentImporter = () => import("./r._id-B8livW8E.mjs");
const $$splitComponentImporter$f = () => import("./r._id-DEYaYK2e.mjs");
const fetchRunner = createServerFn({
  method: "GET"
}).inputValidator((d) => objectType({
  id: stringType().uuid()
}).parse(d)).handler(createSsrRpc("a6b1e7cf7e3f22a01fbd54fdaf632547a26b8860897e09ffc00e4ada0cc08f2f"));
const Route$j = createFileRoute("/r/$id")({
  loader: async ({
    params
  }) => {
    const runner = await fetchRunner({
      data: {
        id: params.id
      }
    });
    if (!runner) throw notFound();
    return {
      runner
    };
  },
  head: ({
    loaderData
  }) => {
    const name = loaderData?.runner?.name ?? "Runner";
    return {
      meta: [{
        title: `${name} — MyRunner Independent Runner`
      }, {
        name: "description",
        content: `${name} is an independent contractor delivery Runner on MyRunner — on-demand pickup & delivery of groceries, food, pharmacy and last-minute errands.`
      }, {
        property: "og:title",
        content: `${name} — MyRunner`
      }, {
        property: "og:description",
        content: `Independent delivery Runner on MyRunner.`
      }]
    };
  },
  component: lazyRouteComponent($$splitComponentImporter$f, "component"),
  notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter, "notFoundComponent"),
  errorComponent: lazyRouteComponent($$splitErrorComponentImporter, "errorComponent")
});
const $$splitComponentImporter$e = () => import("./driver.earnings-lRDYtfDZ.mjs");
const Route$i = createFileRoute("/driver/earnings")({
  head: () => ({
    meta: [{
      title: "Earnings & payouts — MyRunner"
    }, {
      name: "robots",
      content: "noindex"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$e, "component")
});
const $$splitComponentImporter$d = () => import("./driver.dashboard-CGcBnDwM.mjs");
const Route$h = createFileRoute("/driver/dashboard")({
  head: () => ({
    meta: [{
      title: "Driver dashboard — MyRunner"
    }, {
      name: "robots",
      content: "noindex"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$d, "component")
});
const $$splitComponentImporter$c = () => import("./auth.callback-BnZbMfxn.mjs");
const Route$g = createFileRoute("/auth/callback")({
  head: () => ({
    meta: [{
      title: "Signing in — MyRunner"
    }, {
      name: "robots",
      content: "noindex"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$c, "component")
});
const $$splitComponentImporter$b = () => import("./app.settings-dXPiPYIV.mjs");
const Route$f = createFileRoute("/app/settings")({
  head: () => ({
    meta: [{
      title: "Account settings — MyRunner"
    }, {
      name: "robots",
      content: "noindex"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$b, "component")
});
const $$splitComponentImporter$a = () => import("./app.report-3P71Wky6.mjs");
const Route$e = createFileRoute("/app/report")({
  head: () => ({
    meta: [{
      title: "Report an issue — MyRunner"
    }, {
      name: "robots",
      content: "noindex"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$a, "component")
});
const $$splitComponentImporter$9 = () => import("./app.orders-CDxrmZW2.mjs");
const Route$d = createFileRoute("/app/orders")({
  head: () => ({
    meta: [{
      title: "My orders — MyRunner"
    }, {
      name: "robots",
      content: "noindex"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
const $$splitComponentImporter$8 = () => import("./app.new-delivery-BoNeXVuX.mjs");
const Route$c = createFileRoute("/app/new-delivery")({
  head: () => ({
    meta: [{
      title: "New delivery — MyRunner"
    }, {
      name: "robots",
      content: "noindex"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
const $$splitComponentImporter$7 = () => import("./app.dashboard-Zmhb1vnh.mjs");
const Route$b = createFileRoute("/app/dashboard")({
  head: () => ({
    meta: [{
      title: "Dashboard — MyRunner"
    }, {
      name: "robots",
      content: "noindex"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
const $$splitComponentImporter$6 = () => import("./admin.reports-Dnnn93Qr.mjs");
const Route$a = createFileRoute("/admin/reports")({
  head: () => ({
    meta: [{
      title: "Reports — MyRunner Admin"
    }, {
      name: "robots",
      content: "noindex"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
const $$splitComponentImporter$5 = () => import("./admin.orders-C03Zaz0K.mjs");
const Route$9 = createFileRoute("/admin/orders")({
  head: () => ({
    meta: [{
      title: "All orders — MyRunner Admin"
    }, {
      name: "robots",
      content: "noindex"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import("./admin.drivers-BrBorIXm.mjs");
const Route$8 = createFileRoute("/admin/drivers")({
  head: () => ({
    meta: [{
      title: "Drivers — MyRunner Admin"
    }, {
      name: "robots",
      content: "noindex"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("./admin.dashboard-D5DWqjRb.mjs");
const Route$7 = createFileRoute("/admin/dashboard")({
  head: () => ({
    meta: [{
      title: "Admin overview — MyRunner"
    }, {
      name: "robots",
      content: "noindex"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("./admin.applications-CIaxVl7T.mjs");
const Route$6 = createFileRoute("/admin/applications")({
  head: () => ({
    meta: [{
      title: "Driver applications — MyRunner Admin"
    }, {
      name: "robots",
      content: "noindex"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("./driver.orders._id-BVKcHgOn.mjs");
const Route$5 = createFileRoute("/driver/orders/$id")({
  head: () => ({
    meta: [{
      title: "Delivery — MyRunner Driver"
    }, {
      name: "robots",
      content: "noindex"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./app.orders._id-CJ_1hbQc.mjs");
const Route$4 = createFileRoute("/app/orders/$id")({
  head: () => ({
    meta: [{
      title: "Order details — MyRunner"
    }, {
      name: "robots",
      content: "noindex"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const DEMO_EMAIL = "demo-driver@myrunner.shop";
const DEMO_PASSWORD = "Demo1234!";
const Route$3 = createFileRoute("/api/public/demo-driver-ensure")({
  server: {
    handlers: {
      GET: async () => handler(),
      POST: async () => handler()
    }
  }
});
async function handler() {
  try {
    const { supabaseAdmin: supabaseAdmin2 } = await import("./client.server-D5ro3rAQ.mjs");
    let userId = null;
    const { data: list } = await supabaseAdmin2.auth.admin.listUsers({ page: 1, perPage: 200 });
    const existing = list?.users?.find((u) => u.email?.toLowerCase() === DEMO_EMAIL);
    if (existing) {
      userId = existing.id;
      await supabaseAdmin2.auth.admin.updateUserById(userId, {
        password: DEMO_PASSWORD,
        email_confirm: true
      });
    } else {
      const { data: created, error: createErr } = await supabaseAdmin2.auth.admin.createUser({
        email: DEMO_EMAIL,
        password: DEMO_PASSWORD,
        email_confirm: true,
        user_metadata: { full_name: "Demo Driver" }
      });
      if (createErr || !created.user) {
        return Response.json({ ok: false, error: createErr?.message ?? "Could not create demo user" }, { status: 500 });
      }
      userId = created.user.id;
    }
    if (!userId) {
      return Response.json({ ok: false, error: "No userId" }, { status: 500 });
    }
    await supabaseAdmin2.from("profiles").update({
      full_name: "Demo Driver",
      phone: "555-0100",
      home_address: "1 Demo Way",
      home_city: "Atlanta",
      home_state: "GA",
      home_zip: "30303",
      emergency_contact_name: "MyRunner Support",
      emergency_contact_phone: "555-0199",
      stripe_connect_account_id: "acct_demo",
      payouts_enabled: true,
      background_check_status: "clear",
      background_check_updated_at: (/* @__PURE__ */ new Date()).toISOString(),
      is_active: true
    }).eq("id", userId);
    const { data: hasRole } = await supabaseAdmin2.from("user_roles").select("user_id").eq("user_id", userId).eq("role", "driver").maybeSingle();
    if (!hasRole) {
      await supabaseAdmin2.from("user_roles").insert({
        id: crypto.randomUUID(),
        user_id: userId,
        role: "driver"
      });
    }
    return Response.json({ ok: true, email: DEMO_EMAIL });
  } catch (e) {
    return Response.json({ ok: false, error: e.message }, { status: 500 });
  }
}
function verifySignature(body, signature) {
  const secret = process.env.CHECKR_WEBHOOK_SECRET;
  if (!secret || !signature) return false;
  const expected = createHmac("sha256", secret).update(body).digest("hex");
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
const Route$2 = createFileRoute("/api/public/checkr-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = await request.text();
        const sig = request.headers.get("x-checkr-signature");
        if (process.env.CHECKR_WEBHOOK_SECRET) {
          if (!verifySignature(body, sig)) {
            return new Response("Invalid signature", { status: 401 });
          }
        } else {
          console.warn("[checkr-webhook] CHECKR_WEBHOOK_SECRET not set; accepting without verification");
        }
        let event;
        try {
          event = JSON.parse(body);
        } catch {
          return new Response("Invalid JSON", { status: 400 });
        }
        if (event.type !== "report.completed" && event.type !== "report.updated") {
          return new Response("ok");
        }
        const obj = event.data?.object ?? {};
        const candidateId = obj.candidate_id;
        const reportId = obj.id;
        const status = obj.status ?? "unknown";
        const adjudication = obj.adjudication ?? null;
        if (!candidateId) return new Response("ok");
        const { supabaseAdmin: supabaseAdmin2 } = await import("./client.server-D5ro3rAQ.mjs");
        const passing = status === "clear" || adjudication === "engaged";
        await supabaseAdmin2.from("profiles").update({
          checkr_report_id: reportId ?? null,
          checkr_report_status: status,
          background_check_status: passing ? "clear" : "failed",
          background_check_updated_at: (/* @__PURE__ */ new Date()).toISOString(),
          is_active: passing
        }).eq("checkr_candidate_id", candidateId);
        return new Response("ok");
      }
    }
  }
});
const Route$1 = createFileRoute("/api/public/payments/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const url = new URL(request.url);
        const env = url.searchParams.get("env") === "live" ? "live" : "sandbox";
        const sig = request.headers.get("stripe-signature");
        const body = await request.text();
        const secret = env === "live" ? process.env.PAYMENTS_LIVE_WEBHOOK_SECRET : process.env.PAYMENTS_SANDBOX_WEBHOOK_SECRET;
        if (!sig || !secret) return new Response("Missing signature", { status: 400 });
        const stripe = createStripeClient(env);
        let event;
        try {
          event = await stripe.webhooks.constructEventAsync(body, sig, secret);
        } catch (e) {
          return new Response(`Webhook error: ${e.message}`, { status: 400 });
        }
        if (event.type === "checkout.session.completed") {
          const session = event.data.object;
          const orderId = session.metadata?.order_id;
          const kind = session.metadata?.kind;
          if (orderId && kind === "tip") {
            const extra = Number(session.metadata?.tip_cents ?? 0);
            const { data: order } = await supabaseAdmin.from("orders").select("id, driver_id, tip_cents").eq("id", orderId).single();
            if (order && extra > 0) {
              await supabaseAdmin.from("orders").update({ tip_cents: (order.tip_cents ?? 0) + extra }).eq("id", orderId);
              if (order.driver_id) {
                const piId = paymentIntentIdFromSession(session) ?? await resolvePaymentIntentId(stripe, session.id);
                await supabaseAdmin.from("driver_payouts").insert({
                  driver_id: order.driver_id,
                  order_id: orderId,
                  amount_cents: extra,
                  tip_cents: extra,
                  fee_share_cents: 0,
                  stripe_transfer_id: piId ?? session.id,
                  status: "paid"
                });
              }
            }
          } else if (orderId) {
            const piId = paymentIntentIdFromSession(session) ?? await resolvePaymentIntentId(stripe, session.id);
            await supabaseAdmin.from("orders").update({
              payment_status: "paid",
              paid_at: (/* @__PURE__ */ new Date()).toISOString(),
              stripe_payment_intent_id: piId
            }).eq("id", orderId);
            try {
              const { dispatchOrder } = await import("./dispatch.functions-CDAFMReD.mjs");
              await dispatchOrder({ data: { orderId } });
            } catch (e) {
              console.error("[webhook] dispatch failed", e);
            }
          }
        }
        if (event.type === "account.updated") {
          const account = event.data.object;
          const payoutsEnabled = isDriverConnectReady(account);
          await supabaseAdmin.from("profiles").update({ payouts_enabled: payoutsEnabled }).eq("stripe_connect_account_id", account.id);
        }
        return new Response("ok");
      }
    }
  }
});
function authorizeCron(request) {
  const secret = process.env.DISPATCH_CRON_SECRET;
  if (!secret) return null;
  const auth = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (auth !== secret) {
    return new Response("Unauthorized", { status: 401 });
  }
  return null;
}
const Route = createFileRoute("/api/public/hooks/dispatch-tick")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const denied = authorizeCron(request);
        if (denied) return denied;
        const result = await reassignExpired();
        return Response.json(result);
      }
    }
  }
});
const TermsRoute = Route$F.update({
  id: "/terms",
  path: "/terms",
  getParentRoute: () => Route$G
});
const SitemapDotxmlRoute = Route$E.update({
  id: "/sitemap.xml",
  path: "/sitemap.xml",
  getParentRoute: () => Route$G
});
const SignupRoute = Route$D.update({
  id: "/signup",
  path: "/signup",
  getParentRoute: () => Route$G
});
const ShareRoute = Route$C.update({
  id: "/share",
  path: "/share",
  getParentRoute: () => Route$G
});
const SafetyRoute = Route$B.update({
  id: "/safety",
  path: "/safety",
  getParentRoute: () => Route$G
});
const RefundPolicyRoute = Route$A.update({
  id: "/refund-policy",
  path: "/refund-policy",
  getParentRoute: () => Route$G
});
const PrivacyRoute = Route$z.update({
  id: "/privacy",
  path: "/privacy",
  getParentRoute: () => Route$G
});
const PricingRoute = Route$y.update({
  id: "/pricing",
  path: "/pricing",
  getParentRoute: () => Route$G
});
const LoginRoute = Route$x.update({
  id: "/login",
  path: "/login",
  getParentRoute: () => Route$G
});
const HowItWorksRoute = Route$w.update({
  id: "/how-it-works",
  path: "/how-it-works",
  getParentRoute: () => Route$G
});
const FaqRoute = Route$v.update({
  id: "/faq",
  path: "/faq",
  getParentRoute: () => Route$G
});
const DriversRoute = Route$u.update({
  id: "/drivers",
  path: "/drivers",
  getParentRoute: () => Route$G
});
const DriverSignupRoute = Route$t.update({
  id: "/driver-signup",
  path: "/driver-signup",
  getParentRoute: () => Route$G
});
const DriverRoute = Route$s.update({
  id: "/driver",
  path: "/driver",
  getParentRoute: () => Route$G
});
const CookiesRoute = Route$r.update({
  id: "/cookies",
  path: "/cookies",
  getParentRoute: () => Route$G
});
const ContactRoute = Route$q.update({
  id: "/contact",
  path: "/contact",
  getParentRoute: () => Route$G
});
const CommunityGuidelinesRoute = Route$p.update({
  id: "/community-guidelines",
  path: "/community-guidelines",
  getParentRoute: () => Route$G
});
const AppRoute = Route$o.update({
  id: "/app",
  path: "/app",
  getParentRoute: () => Route$G
});
const AdminRoute = Route$n.update({
  id: "/admin",
  path: "/admin",
  getParentRoute: () => Route$G
});
const AccessibilityRoute = Route$m.update({
  id: "/accessibility",
  path: "/accessibility",
  getParentRoute: () => Route$G
});
const AboutRoute = Route$l.update({
  id: "/about",
  path: "/about",
  getParentRoute: () => Route$G
});
const IndexRoute = Route$k.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$G
});
const RIdRoute = Route$j.update({
  id: "/r/$id",
  path: "/r/$id",
  getParentRoute: () => Route$G
});
const DriverEarningsRoute = Route$i.update({
  id: "/earnings",
  path: "/earnings",
  getParentRoute: () => DriverRoute
});
const DriverDashboardRoute = Route$h.update({
  id: "/dashboard",
  path: "/dashboard",
  getParentRoute: () => DriverRoute
});
const AuthCallbackRoute = Route$g.update({
  id: "/auth/callback",
  path: "/auth/callback",
  getParentRoute: () => Route$G
});
const AppSettingsRoute = Route$f.update({
  id: "/settings",
  path: "/settings",
  getParentRoute: () => AppRoute
});
const AppReportRoute = Route$e.update({
  id: "/report",
  path: "/report",
  getParentRoute: () => AppRoute
});
const AppOrdersRoute = Route$d.update({
  id: "/orders",
  path: "/orders",
  getParentRoute: () => AppRoute
});
const AppNewDeliveryRoute = Route$c.update({
  id: "/new-delivery",
  path: "/new-delivery",
  getParentRoute: () => AppRoute
});
const AppDashboardRoute = Route$b.update({
  id: "/dashboard",
  path: "/dashboard",
  getParentRoute: () => AppRoute
});
const AdminReportsRoute = Route$a.update({
  id: "/reports",
  path: "/reports",
  getParentRoute: () => AdminRoute
});
const AdminOrdersRoute = Route$9.update({
  id: "/orders",
  path: "/orders",
  getParentRoute: () => AdminRoute
});
const AdminDriversRoute = Route$8.update({
  id: "/drivers",
  path: "/drivers",
  getParentRoute: () => AdminRoute
});
const AdminDashboardRoute = Route$7.update({
  id: "/dashboard",
  path: "/dashboard",
  getParentRoute: () => AdminRoute
});
const AdminApplicationsRoute = Route$6.update({
  id: "/applications",
  path: "/applications",
  getParentRoute: () => AdminRoute
});
const DriverOrdersIdRoute = Route$5.update({
  id: "/orders/$id",
  path: "/orders/$id",
  getParentRoute: () => DriverRoute
});
const AppOrdersIdRoute = Route$4.update({
  id: "/$id",
  path: "/$id",
  getParentRoute: () => AppOrdersRoute
});
const ApiPublicDemoDriverEnsureRoute = Route$3.update({
  id: "/api/public/demo-driver-ensure",
  path: "/api/public/demo-driver-ensure",
  getParentRoute: () => Route$G
});
const ApiPublicCheckrWebhookRoute = Route$2.update({
  id: "/api/public/checkr-webhook",
  path: "/api/public/checkr-webhook",
  getParentRoute: () => Route$G
});
const ApiPublicPaymentsWebhookRoute = Route$1.update({
  id: "/api/public/payments/webhook",
  path: "/api/public/payments/webhook",
  getParentRoute: () => Route$G
});
const ApiPublicHooksDispatchTickRoute = Route.update({
  id: "/api/public/hooks/dispatch-tick",
  path: "/api/public/hooks/dispatch-tick",
  getParentRoute: () => Route$G
});
const AdminRouteChildren = {
  AdminApplicationsRoute,
  AdminDashboardRoute,
  AdminDriversRoute,
  AdminOrdersRoute,
  AdminReportsRoute
};
const AdminRouteWithChildren = AdminRoute._addFileChildren(AdminRouteChildren);
const AppOrdersRouteChildren = {
  AppOrdersIdRoute
};
const AppOrdersRouteWithChildren = AppOrdersRoute._addFileChildren(
  AppOrdersRouteChildren
);
const AppRouteChildren = {
  AppDashboardRoute,
  AppNewDeliveryRoute,
  AppOrdersRoute: AppOrdersRouteWithChildren,
  AppReportRoute,
  AppSettingsRoute
};
const AppRouteWithChildren = AppRoute._addFileChildren(AppRouteChildren);
const DriverRouteChildren = {
  DriverDashboardRoute,
  DriverEarningsRoute,
  DriverOrdersIdRoute
};
const DriverRouteWithChildren = DriverRoute._addFileChildren(DriverRouteChildren);
const rootRouteChildren = {
  IndexRoute,
  AboutRoute,
  AccessibilityRoute,
  AdminRoute: AdminRouteWithChildren,
  AppRoute: AppRouteWithChildren,
  CommunityGuidelinesRoute,
  ContactRoute,
  CookiesRoute,
  DriverRoute: DriverRouteWithChildren,
  DriverSignupRoute,
  DriversRoute,
  FaqRoute,
  HowItWorksRoute,
  LoginRoute,
  PricingRoute,
  PrivacyRoute,
  RefundPolicyRoute,
  SafetyRoute,
  ShareRoute,
  SignupRoute,
  SitemapDotxmlRoute,
  TermsRoute,
  AuthCallbackRoute,
  RIdRoute,
  ApiPublicCheckrWebhookRoute,
  ApiPublicDemoDriverEnsureRoute,
  ApiPublicHooksDispatchTickRoute,
  ApiPublicPaymentsWebhookRoute
};
const routeTree = Route$G._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  const queryClient = new QueryClient();
  const router2 = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  Button as B,
  Route$D as R,
  Route$j as a,
  buttonVariants as b,
  cn as c,
  Route$5 as d,
  Route$4 as e,
  router as r,
  submitContactMessage as s,
  triageSafetyReport as t,
  useBgmVolume as u
};
