import { b as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { Q as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { c as createRouter, a as createRootRouteWithContext, u as useRouter, L as Link, O as Outlet, H as HeadContent, S as Scripts, b as createFileRoute, l as lazyRouteComponent } from "../_libs/tanstack__react-router.mjs";
import { I as notFound } from "../_libs/tanstack__router-core.mjs";
import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { T as Toaster$1 } from "../_libs/sonner.mjs";
import { c as createServerFn, T as TSS_SERVER_FUNCTION, g as getServerFnById } from "./server-DWRkkZvt.mjs";
import { createHmac, timingSafeEqual } from "crypto";
import { c as createStripeClient } from "./stripe.server-h1CGUd7G.mjs";
import { supabaseAdmin } from "./client.server-D5ro3rAQ.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-pF3e_tkz.mjs";
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
import "./createMiddleware-BvN2ghIY.mjs";
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
const appCss = "/assets/styles-DGugup_j.css";
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
const Route$F = createRootRouteWithContext()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { name: "theme-color", content: "#0a0a0a" },
      { name: "author", content: "MyRunner Inc." },
      { property: "og:site_name", content: "MyRunner" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@myrunner" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
      { name: "apple-mobile-web-app-title", content: "MyRunner" },
      { title: "Lovable App" },
      { property: "og:title", content: "Lovable App" },
      { name: "twitter:title", content: "Lovable App" },
      { name: "description", content: "SwiftRun Delivery connects users with local drivers for on-demand delivery of any item." },
      { property: "og:description", content: "SwiftRun Delivery connects users with local drivers for on-demand delivery of any item." },
      { name: "twitter:description", content: "SwiftRun Delivery connects users with local drivers for on-demand delivery of any item." },
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
  const { queryClient } = Route$F.useRouteContext();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(QueryClientProvider, { client: queryClient, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Toaster, { richColors: true, position: "top-center" })
  ] });
}
const $$splitComponentImporter$z = () => import("./terms-BrniUTfd.mjs");
const Route$E = createFileRoute("/terms")({
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
  component: lazyRouteComponent($$splitComponentImporter$z, "component")
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
const Route$D = createFileRoute("/sitemap.xml")({
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
const $$splitComponentImporter$y = () => import("./signup-BYRKWJHl.mjs");
const Route$C = createFileRoute("/signup")({
  head: () => ({
    meta: [{
      title: "Create your MyRunner account"
    }, {
      name: "description",
      content: "Sign up for MyRunner to send deliveries, track Runners live, and earn loyalty points."
    }, {
      name: "robots",
      content: "noindex"
    }],
    links: [{
      rel: "canonical",
      href: "/signup"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$y, "component")
});
const $$splitComponentImporter$x = () => import("./share-DBnlZcRq.mjs");
const Route$B = createFileRoute("/share")({
  head: () => ({
    meta: [{
      title: "Share MyRunner — Refer friends & earn"
    }, {
      name: "description",
      content: "Share MyRunner with friends, neighbors, and local shops. Scan or share the link."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$x, "component")
});
const $$splitComponentImporter$w = () => import("./safety-B2SFdCnO.mjs");
const Route$A = createFileRoute("/safety")({
  head: () => ({
    meta: [{
      title: "Safety & insurance — How MyRunner protects you"
    }, {
      name: "description",
      content: "Background checks, $100 cargo insurance, HNOA driver coverage, live GPS, photo proof, and 24/7 support. Here's how we keep MyRunner safe."
    }, {
      property: "og:title",
      content: "Safety & insurance — MyRunner"
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
  component: lazyRouteComponent($$splitComponentImporter$w, "component")
});
const $$splitComponentImporter$v = () => import("./refund-policy-BApEe3H5.mjs");
const Route$z = createFileRoute("/refund-policy")({
  head: () => ({
    meta: [{
      title: "Refund Policy — MyRunner"
    }, {
      name: "description",
      content: "When and how to request a refund on MyRunner. Damaged goods, late delivery, wrong item, driver issues — here's how it works."
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
  component: lazyRouteComponent($$splitComponentImporter$v, "component")
});
const $$splitComponentImporter$u = () => import("./privacy-D-cMt-4L.mjs");
const Route$y = createFileRoute("/privacy")({
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
  component: lazyRouteComponent($$splitComponentImporter$u, "component")
});
const $$splitComponentImporter$t = () => import("./pricing-CFx9Dpz2.mjs");
const Route$x = createFileRoute("/pricing")({
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
  component: lazyRouteComponent($$splitComponentImporter$t, "component")
});
const $$splitComponentImporter$s = () => import("./login-BgROcsr-.mjs");
const Route$w = createFileRoute("/login")({
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
  component: lazyRouteComponent($$splitComponentImporter$s, "component")
});
const $$splitComponentImporter$r = () => import("./how-it-works-D9GwAse6.mjs");
const Route$v = createFileRoute("/how-it-works")({
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
  component: lazyRouteComponent($$splitComponentImporter$r, "component")
});
const faqData = [{
  q: "What can I send with MyRunner?",
  a: "Almost anything legal that fits in a vehicle — documents, packages, prescriptions, gifts, car parts, keys, groceries. See our Community Guidelines for prohibited items."
}, {
  q: "How is pricing calculated?",
  a: "$5.99 base + $1.50 per mile + $3 per extra stop. Tips are optional and 100% go to the driver."
}, {
  q: "How fast is pickup?",
  a: "Average pickup is under 12 minutes in covered metros. You'll see live ETA on your tracking screen."
}, {
  q: "Are deliveries insured?",
  a: "Yes — every delivery includes up to $100 of cargo insurance at no extra cost."
}, {
  q: "How do I become a Runner?",
  a: "Apply at /driver-signup. Submit your license, insurance, vehicle info, and pass a Checkr background check."
}, {
  q: "How much do drivers make?",
  a: "70% of every fee plus 100% of tips. Average earnings are $20–$35/hour depending on demand."
}, {
  q: "When do drivers get paid?",
  a: "After each delivery, earnings transfer to your linked bank via Stripe Connect on the standard payout schedule."
}, {
  q: "Can I request a specific driver?",
  a: "Yes. On the order screen, mark a Runner as preferred and they'll see a 'Requested You' badge on your future orders."
}, {
  q: "Can I block a driver?",
  a: "Yes. From any past order, tap Block driver. They will never be matched to your future requests."
}, {
  q: "How do I delete my account?",
  a: "Go to App → Settings → Delete account. Your data is removed within 30 days."
}, {
  q: "How do I report someone?",
  a: "From any order or your dashboard, tap Report. Choose a reason and add details — we review every report."
}, {
  q: "How do refunds work?",
  a: "Go to My Orders → Request Refund. Admin reviews within 1–3 business days. Approved refunds return to your original payment method."
}];
const $$splitComponentImporter$q = () => import("./faq-DyGssbR9.mjs");
const Route$u = createFileRoute("/faq")({
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
        mainEntity: faqData.map((f) => ({
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
  component: lazyRouteComponent($$splitComponentImporter$q, "component")
});
const $$splitComponentImporter$p = () => import("./drivers-DVG3vyOP.mjs");
const Route$t = createFileRoute("/drivers")({
  head: () => ({
    meta: [{
      title: "Drive with MyRunner — Earn $20–$35/hour on your schedule"
    }, {
      name: "description",
      content: "Become a Runner. Keep 70% per delivery + 100% of tips. Any vehicle, any hours. Automatic Stripe payouts."
    }, {
      property: "og:title",
      content: "Earn with MyRunner"
    }, {
      property: "og:description",
      content: "Flexible delivery driving with a real community behind you."
    }, {
      property: "og:url",
      content: "/drivers"
    }],
    links: [{
      rel: "canonical",
      href: "/drivers"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$p, "component")
});
const $$splitComponentImporter$o = () => import("./driver-signup-D8MntdNQ.mjs");
const Route$s = createFileRoute("/driver-signup")({
  head: () => ({
    meta: [{
      title: "Become a Runner — Apply to drive for MyRunner"
    }, {
      name: "description",
      content: "Apply to drive for MyRunner. Submit your license, insurance, vehicle info, and pass a background check."
    }],
    links: [{
      rel: "canonical",
      href: "/driver-signup"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$o, "component")
});
const $$splitComponentImporter$n = () => import("./driver-R7HyyYoY.mjs");
const Route$r = createFileRoute("/driver")({
  component: lazyRouteComponent($$splitComponentImporter$n, "component")
});
const $$splitComponentImporter$m = () => import("./cookies-C9JkSiXT.mjs");
const Route$q = createFileRoute("/cookies")({
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
  component: lazyRouteComponent($$splitComponentImporter$m, "component")
});
const $$splitComponentImporter$l = () => import("./contact-MsGUG9QO.mjs");
const Route$p = createFileRoute("/contact")({
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
      content: "We answer fast. Real humans + AI support 24/7."
    }, {
      property: "og:url",
      content: "/contact"
    }],
    links: [{
      rel: "canonical",
      href: "/contact"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$l, "component")
});
const $$splitComponentImporter$k = () => import("./community-guidelines-CnjXtfiM.mjs");
const Route$o = createFileRoute("/community-guidelines")({
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
  component: lazyRouteComponent($$splitComponentImporter$k, "component")
});
const $$splitComponentImporter$j = () => import("./app-iKOIvaMr.mjs");
const Route$n = createFileRoute("/app")({
  component: lazyRouteComponent($$splitComponentImporter$j, "component")
});
const $$splitComponentImporter$i = () => import("./admin-QRuntBmA.mjs");
const Route$m = createFileRoute("/admin")({
  head: () => ({
    meta: [{
      title: "Admin — MyRunner"
    }, {
      name: "robots",
      content: "noindex"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$i, "component")
});
const $$splitComponentImporter$h = () => import("./accessibility-L1VQpaX7.mjs");
const Route$l = createFileRoute("/accessibility")({
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
  component: lazyRouteComponent($$splitComponentImporter$h, "component")
});
const $$splitComponentImporter$g = () => import("./about-CFM9UFMi.mjs");
const Route$k = createFileRoute("/about")({
  head: () => ({
    meta: [{
      title: "About MyRunner — Built for the things food delivery forgot"
    }, {
      name: "description",
      content: "MyRunner is a general‑purpose, on‑demand local delivery platform for anything that fits in a vehicle. Built for the gaps the big apps don't fill."
    }, {
      property: "og:title",
      content: "About MyRunner"
    }, {
      property: "og:description",
      content: "Why we built MyRunner, and who it's for."
    }, {
      property: "og:url",
      content: "/about"
    }],
    links: [{
      rel: "canonical",
      href: "/about"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$g, "component")
});
const $$splitComponentImporter$f = () => import("./index-DaUy3jxP.mjs");
const Route$j = createFileRoute("/")({
  head: () => ({
    meta: [{
      title: "MyRunner — On‑demand local delivery for anything, anywhere"
    }, {
      name: "description",
      content: "MyRunner connects you with vetted local Runners to pick up and deliver anything, anytime."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$f, "component")
});
var createSsrRpc = (functionId) => {
  const url = "/_serverFn/" + functionId;
  const serverFnMeta = { id: functionId };
  const fn = async (...args) => {
    return (await getServerFnById(functionId))(...args);
  };
  return Object.assign(fn, {
    url,
    serverFnMeta,
    [TSS_SERVER_FUNCTION]: true
  });
};
const $$splitErrorComponentImporter = () => import("./r._id-Ttbu7H09.mjs");
const $$splitNotFoundComponentImporter = () => import("./r._id-B8livW8E.mjs");
const $$splitComponentImporter$e = () => import("./r._id-BxQxaUxG.mjs");
const fetchRunner = createServerFn({
  method: "GET"
}).inputValidator((d) => objectType({
  id: stringType().uuid()
}).parse(d)).handler(createSsrRpc("a6b1e7cf7e3f22a01fbd54fdaf632547a26b8860897e09ffc00e4ada0cc08f2f"));
const Route$i = createFileRoute("/r/$id")({
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
  component: lazyRouteComponent($$splitComponentImporter$e, "component"),
  notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter, "notFoundComponent"),
  errorComponent: lazyRouteComponent($$splitErrorComponentImporter, "errorComponent")
});
const $$splitComponentImporter$d = () => import("./driver.earnings-ti9-Xa0J.mjs");
const Route$h = createFileRoute("/driver/earnings")({
  head: () => ({
    meta: [{
      title: "Earnings & payouts — MyRunner"
    }, {
      name: "robots",
      content: "noindex"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$d, "component")
});
const $$splitComponentImporter$c = () => import("./driver.dashboard-Cqwg-EmA.mjs");
const Route$g = createFileRoute("/driver/dashboard")({
  head: () => ({
    meta: [{
      title: "Driver dashboard — MyRunner"
    }, {
      name: "robots",
      content: "noindex"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$c, "component")
});
const $$splitComponentImporter$b = () => import("./app.settings-C1RZPhw-.mjs");
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
const $$splitComponentImporter$a = () => import("./app.report-DmSBUe5X.mjs");
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
const $$splitComponentImporter$9 = () => import("./app.orders-CjwaTzPB.mjs");
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
const $$splitComponentImporter$8 = () => import("./app.new-delivery-DaWMKxPY.mjs");
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
const $$splitComponentImporter$7 = () => import("./app.dashboard-Bl3W52A3.mjs");
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
const $$splitComponentImporter$6 = () => import("./admin.reports-DUpdIPmX.mjs");
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
const $$splitComponentImporter$5 = () => import("./admin.orders-DG9SY0mQ.mjs");
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
const $$splitComponentImporter$4 = () => import("./admin.drivers-Bk3xUEnL.mjs");
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
const $$splitComponentImporter$3 = () => import("./admin.dashboard-DELpiHdR.mjs");
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
const $$splitComponentImporter$2 = () => import("./admin.applications-DpJrnGHF.mjs");
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
const $$splitComponentImporter$1 = () => import("./driver.orders._id-CaNZaW2J.mjs");
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
const $$splitComponentImporter = () => import("./app.orders._id-DcZIqUs1.mjs");
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
      onboarding_completed_at: (/* @__PURE__ */ new Date()).toISOString(),
      background_check_status: "clear",
      background_check_updated_at: (/* @__PURE__ */ new Date()).toISOString(),
      is_active: true
    }).eq("id", userId);
    const { data: hasRole } = await supabaseAdmin2.from("user_roles").select("user_id").eq("user_id", userId).eq("role", "driver").maybeSingle();
    if (!hasRole) {
      await supabaseAdmin2.from("user_roles").insert({ user_id: userId, role: "driver" });
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
                const { data: driverProfile } = await supabaseAdmin.from("profiles").select("stripe_connect_account_id, payouts_enabled").eq("id", order.driver_id).single();
                if (driverProfile?.stripe_connect_account_id && driverProfile.payouts_enabled) {
                  const isDemo = driverProfile.stripe_connect_account_id.startsWith("acct_demo");
                  let transferId = "tr_demo";
                  if (!isDemo) {
                    try {
                      const transfer = await stripe.transfers.create(
                        {
                          amount: extra,
                          currency: "usd",
                          destination: driverProfile.stripe_connect_account_id,
                          transfer_group: orderId,
                          description: `MyRunner tip · order ${orderId.slice(0, 8)}`,
                          metadata: { order_id: orderId, driver_id: order.driver_id, kind: "tip" }
                        },
                        { idempotencyKey: `tip-${session.id}` }
                      );
                      transferId = transfer.id;
                    } catch (e) {
                      console.error("[webhook] tip transfer failed", e);
                    }
                  }
                  await supabaseAdmin.from("driver_payouts").insert({
                    driver_id: order.driver_id,
                    order_id: orderId,
                    amount_cents: extra,
                    tip_cents: extra,
                    fee_share_cents: 0,
                    stripe_transfer_id: transferId,
                    status: "paid"
                  });
                }
              }
            }
          } else if (orderId) {
            await supabaseAdmin.from("orders").update({ payment_status: "paid", paid_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("id", orderId);
            try {
              const { dispatchOrder: dispatchOrder2 } = await Promise.resolve().then(() => dispatch_functions);
              await dispatchOrder2({ data: { orderId } });
            } catch (e) {
              console.error("[webhook] dispatch failed", e);
            }
          }
        }
        if (event.type === "account.updated") {
          const account = event.data.object;
          const payoutsEnabled = Boolean(account.payouts_enabled && account.charges_enabled);
          await supabaseAdmin.from("profiles").update({
            payouts_enabled: payoutsEnabled,
            ...payoutsEnabled ? { onboarding_completed_at: (/* @__PURE__ */ new Date()).toISOString() } : {}
          }).eq("stripe_connect_account_id", account.id);
        }
        return new Response("ok");
      }
    }
  }
});
const dispatchOrder = createServerFn({
  method: "POST"
}).inputValidator((d) => d).handler(createSsrRpc("e35f650e73dce0dd2cfd64dcc2349fcbd818102306d1fcb44ea7c9682af56bbf"));
const acceptOffer = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => d).handler(createSsrRpc("cd00e8864ffdfbda6361a4251d5654b28297f8da483bda28cda04f2a0e647c2e"));
const declineOffer = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => d).handler(createSsrRpc("667bcc7bf65430d37adb6df782a5368d1bcde1f9ec41e7d5d05c09f4fe756d80"));
const reassignExpired = createServerFn({
  method: "POST"
}).handler(createSsrRpc("566e1e1a14460ca7d48922f53684228e5f66ccbc7f8af58bd4378b46592fe75a"));
const setDriverPresence = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => d).handler(createSsrRpc("8764abbbf0d0b0490badae9e5c4926fd4710c2a8b5f2c0aaac29ccb5bc3e17e0"));
const dispatch_functions = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  acceptOffer,
  declineOffer,
  dispatchOrder,
  reassignExpired,
  setDriverPresence
}, Symbol.toStringTag, { value: "Module" }));
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
const TermsRoute = Route$E.update({
  id: "/terms",
  path: "/terms",
  getParentRoute: () => Route$F
});
const SitemapDotxmlRoute = Route$D.update({
  id: "/sitemap.xml",
  path: "/sitemap.xml",
  getParentRoute: () => Route$F
});
const SignupRoute = Route$C.update({
  id: "/signup",
  path: "/signup",
  getParentRoute: () => Route$F
});
const ShareRoute = Route$B.update({
  id: "/share",
  path: "/share",
  getParentRoute: () => Route$F
});
const SafetyRoute = Route$A.update({
  id: "/safety",
  path: "/safety",
  getParentRoute: () => Route$F
});
const RefundPolicyRoute = Route$z.update({
  id: "/refund-policy",
  path: "/refund-policy",
  getParentRoute: () => Route$F
});
const PrivacyRoute = Route$y.update({
  id: "/privacy",
  path: "/privacy",
  getParentRoute: () => Route$F
});
const PricingRoute = Route$x.update({
  id: "/pricing",
  path: "/pricing",
  getParentRoute: () => Route$F
});
const LoginRoute = Route$w.update({
  id: "/login",
  path: "/login",
  getParentRoute: () => Route$F
});
const HowItWorksRoute = Route$v.update({
  id: "/how-it-works",
  path: "/how-it-works",
  getParentRoute: () => Route$F
});
const FaqRoute = Route$u.update({
  id: "/faq",
  path: "/faq",
  getParentRoute: () => Route$F
});
const DriversRoute = Route$t.update({
  id: "/drivers",
  path: "/drivers",
  getParentRoute: () => Route$F
});
const DriverSignupRoute = Route$s.update({
  id: "/driver-signup",
  path: "/driver-signup",
  getParentRoute: () => Route$F
});
const DriverRoute = Route$r.update({
  id: "/driver",
  path: "/driver",
  getParentRoute: () => Route$F
});
const CookiesRoute = Route$q.update({
  id: "/cookies",
  path: "/cookies",
  getParentRoute: () => Route$F
});
const ContactRoute = Route$p.update({
  id: "/contact",
  path: "/contact",
  getParentRoute: () => Route$F
});
const CommunityGuidelinesRoute = Route$o.update({
  id: "/community-guidelines",
  path: "/community-guidelines",
  getParentRoute: () => Route$F
});
const AppRoute = Route$n.update({
  id: "/app",
  path: "/app",
  getParentRoute: () => Route$F
});
const AdminRoute = Route$m.update({
  id: "/admin",
  path: "/admin",
  getParentRoute: () => Route$F
});
const AccessibilityRoute = Route$l.update({
  id: "/accessibility",
  path: "/accessibility",
  getParentRoute: () => Route$F
});
const AboutRoute = Route$k.update({
  id: "/about",
  path: "/about",
  getParentRoute: () => Route$F
});
const IndexRoute = Route$j.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$F
});
const RIdRoute = Route$i.update({
  id: "/r/$id",
  path: "/r/$id",
  getParentRoute: () => Route$F
});
const DriverEarningsRoute = Route$h.update({
  id: "/earnings",
  path: "/earnings",
  getParentRoute: () => DriverRoute
});
const DriverDashboardRoute = Route$g.update({
  id: "/dashboard",
  path: "/dashboard",
  getParentRoute: () => DriverRoute
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
  getParentRoute: () => Route$F
});
const ApiPublicCheckrWebhookRoute = Route$2.update({
  id: "/api/public/checkr-webhook",
  path: "/api/public/checkr-webhook",
  getParentRoute: () => Route$F
});
const ApiPublicPaymentsWebhookRoute = Route$1.update({
  id: "/api/public/payments/webhook",
  path: "/api/public/payments/webhook",
  getParentRoute: () => Route$F
});
const ApiPublicHooksDispatchTickRoute = Route.update({
  id: "/api/public/hooks/dispatch-tick",
  path: "/api/public/hooks/dispatch-tick",
  getParentRoute: () => Route$F
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
  RIdRoute,
  ApiPublicCheckrWebhookRoute,
  ApiPublicDemoDriverEnsureRoute,
  ApiPublicHooksDispatchTickRoute,
  ApiPublicPaymentsWebhookRoute
};
const routeTree = Route$F._addFileChildren(rootRouteChildren)._addFileTypes();
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
  Route$i as R,
  acceptOffer as a,
  Route$5 as b,
  createSsrRpc as c,
  declineOffer as d,
  Route$4 as e,
  faqData as f,
  router as r,
  setDriverPresence as s
};
