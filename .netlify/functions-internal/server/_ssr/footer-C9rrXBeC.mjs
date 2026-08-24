import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { B as Button } from "./button-BXrfXN_b.mjs";
import { u as useAuth } from "./use-auth-Bp-NYKWf.mjs";
import { c as ShieldCheck, X, k as Menu } from "../_libs/lucide-react.mjs";
const logoIcon = "/assets/myrunner-icon-CROcgfN9.png";
function Logo({ withText = true, size = 32 }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "group inline-flex items-center gap-2.5", "aria-label": "MyRunner home", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "img",
      {
        src: logoIcon,
        alt: "",
        width: size,
        height: size,
        className: "rounded-md ring-1 ring-border-strong transition-transform group-hover:scale-105",
        style: { width: size, height: size }
      }
    ),
    withText && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-serif text-xl tracking-tight", children: [
      "My",
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gold", children: "Runner" })
    ] })
  ] });
}
const nav = [
  { to: "/how-it-works", label: "How it works" },
  { to: "/pricing", label: "Pricing" },
  { to: "/drivers", label: "Drive" },
  { to: "/safety", label: "Safety" },
  { to: "/faq", label: "FAQ" },
  { to: "/share", label: "Share" }
];
function SiteHeader() {
  const [open, setOpen] = reactExports.useState(false);
  const { isAdmin } = useAuth();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container-app flex h-16 items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Logo, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "hidden items-center gap-8 md:flex", "aria-label": "Primary", children: nav.map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        Link,
        {
          to: n.to,
          className: "text-sm text-muted-foreground transition-colors hover:text-foreground",
          activeProps: { className: "text-foreground" },
          children: n.label
        },
        n.to
      )) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden items-center gap-2 md:flex", children: [
        isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, variant: "ghost", size: "sm", className: "text-gold", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/admin/dashboard", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "mr-1 size-4" }),
          " Admin"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, variant: "ghost", size: "sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/login", children: "Sign in" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, size: "sm", className: "bg-gold text-primary-foreground hover:bg-gold/90", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/signup", children: "Get started" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          className: "md:hidden text-foreground",
          "aria-label": "Toggle menu",
          onClick: () => setOpen((v) => !v),
          children: open ? /* @__PURE__ */ jsxRuntimeExports.jsx(X, {}) : /* @__PURE__ */ jsxRuntimeExports.jsx(Menu, {})
        }
      )
    ] }),
    open && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "md:hidden border-t border-border bg-surface", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container-app flex flex-col gap-1 py-3", children: [
      nav.map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        Link,
        {
          to: n.to,
          className: "rounded-md px-3 py-2 text-sm hover:bg-accent",
          onClick: () => setOpen(false),
          children: n.label
        },
        n.to
      )),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex gap-2 border-t border-border pt-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, variant: "outline", size: "sm", className: "flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/login", onClick: () => setOpen(false), children: "Sign in" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, size: "sm", className: "flex-1 bg-gold text-primary-foreground hover:bg-gold/90", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/signup", onClick: () => setOpen(false), children: "Get started" }) })
      ] })
    ] }) })
  ] });
}
const cols = [
  {
    title: "Platform",
    links: [
      { to: "/how-it-works", label: "How it works" },
      { to: "/pricing", label: "Pricing" },
      { to: "/safety", label: "Safety & insurance" },
      { to: "/about", label: "About" }
    ]
  },
  {
    title: "For drivers",
    links: [
      { to: "/drivers", label: "Become a Runner" },
      { to: "/driver-signup", label: "Driver application" },
      { to: "/faq", label: "Driver FAQ" }
    ]
  },
  {
    title: "Support",
    links: [
      { to: "/contact", label: "Contact us" },
      { to: "/faq", label: "Help center" },
      { to: "/app/report", label: "Report an issue" },
      { to: "/refund-policy", label: "Refunds" },
      { to: "/share", label: "Share / QR code" }
    ]
  },
  {
    title: "Legal",
    links: [
      { to: "/terms", label: "Terms of service" },
      { to: "/privacy", label: "Privacy policy" },
      { to: "/cookies", label: "Cookie policy" },
      { to: "/community-guidelines", label: "Community guidelines" },
      { to: "/accessibility", label: "Accessibility" }
    ]
  }
];
function SiteFooter() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("footer", { className: "mt-24 border-t border-border bg-surface", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container-app py-16", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-12 lg:grid-cols-[1.2fr_3fr]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Logo, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 max-w-xs text-sm text-muted-foreground", children: "Anything. Anytime. Anywhere. On‑demand local delivery for the things you can't go get yourself." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-6 text-xs text-muted-foreground", children: "support@myrunner.shop" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-8 sm:grid-cols-2 lg:grid-cols-4", children: cols.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-sans text-xs font-semibold uppercase tracking-widest text-muted-foreground", children: c.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-4 space-y-2", children: c.links.map((l) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link,
          {
            to: l.to,
            className: "text-sm text-foreground/80 transition-colors hover:text-gold",
            children: l.label
          }
        ) }, l.to)) })
      ] }, c.title)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-12 flex flex-col items-start justify-between gap-4 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
        "© ",
        (/* @__PURE__ */ new Date()).getFullYear(),
        " MyRunner Inc. All rights reserved."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-serif italic", children: "Anything · Anytime · Anywhere" })
    ] })
  ] }) });
}
export {
  SiteHeader as S,
  SiteFooter as a
};
