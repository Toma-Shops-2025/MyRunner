import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { e as useNavigate, d as useRouterState, L as Link, O as Outlet } from "../_libs/tanstack__react-router.mjs";
import { S as SiteHeader, B as BackButton, a as SiteFooter } from "./back-button-PLK58KB_.mjs";
import { B as Button } from "./router-CaL1rPwL.mjs";
import { u as useAuth, s as signOut } from "./use-auth-B85-Dc53.mjs";
import "../_libs/sonner.mjs";
import "../_libs/seroval.mjs";
import "../_libs/stripe.mjs";
import { q as House, r as CirclePlus, s as ListOrdered, t as Flag, u as Settings, v as LogOut } from "../_libs/lucide-react.mjs";
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
import "./support-knowledge-BldCmBQ4.mjs";
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
import "./client-DfLBq1uk.mjs";
const tabs = [{
  to: "/app/dashboard",
  label: "Dashboard",
  icon: House
}, {
  to: "/app/new-delivery",
  label: "New delivery",
  icon: CirclePlus
}, {
  to: "/app/orders",
  label: "My orders",
  icon: ListOrdered
}, {
  to: "/app/report",
  label: "Report",
  icon: Flag
}, {
  to: "/app/settings",
  label: "Settings",
  icon: Settings
}];
function AppLayout() {
  const nav = useNavigate();
  const router = useRouterState();
  const {
    user,
    loading
  } = useAuth();
  reactExports.useEffect(() => {
    if (!loading && !user) nav({
      to: "/login"
    });
  }, [loading, user, nav]);
  if (!user) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex min-h-[100dvh] flex-col bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(SiteHeader, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container-app grid flex-1 gap-8 py-10 lg:grid-cols-[240px_1fr]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "space-y-1 lg:sticky lg:top-24 lg:self-start", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 rounded-xl border border-border bg-card p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-widest text-muted-foreground", children: "Signed in" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 font-serif text-lg", children: user.user_metadata?.full_name ?? user.email?.split("@")[0] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: user.email })
        ] }),
        tabs.map((t) => {
          const active = router.location.pathname === t.to;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: t.to, className: `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${active ? "bg-gold/10 text-gold" : "text-foreground/80 hover:bg-accent"}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(t.icon, { className: "size-4" }),
            t.label
          ] }, t.to);
        }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "ghost", size: "sm", className: "mt-2 w-full justify-start text-muted-foreground", onClick: async () => {
          await signOut();
          nav({
            to: "/"
          });
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "mr-2 size-4" }),
          " Sign out"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(BackButton, { fallbackTo: "/app/dashboard", label: "Back" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {})
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SiteFooter, {})
  ] });
}
export {
  AppLayout as component
};
