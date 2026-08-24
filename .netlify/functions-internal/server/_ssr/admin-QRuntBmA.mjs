import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate, e as useRouterState, L as Link, O as Outlet } from "../_libs/tanstack__react-router.mjs";
import { S as SiteHeader, a as SiteFooter } from "./footer-C9rrXBeC.mjs";
import { B as Button } from "./button-BXrfXN_b.mjs";
import { u as useAuth, s as signOut } from "./use-auth-Bp-NYKWf.mjs";
import { c as ShieldCheck, U as Users, i as Car, r as FileExclamationPoint, P as Package, q as LogOut } from "../_libs/lucide-react.mjs";
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
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
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
const tabs = [{
  to: "/admin/dashboard",
  label: "Overview",
  icon: ShieldCheck
}, {
  to: "/admin/applications",
  label: "Driver applications",
  icon: Users
}, {
  to: "/admin/drivers",
  label: "Drivers & payouts",
  icon: Car
}, {
  to: "/admin/reports",
  label: "Reports",
  icon: FileExclamationPoint
}, {
  to: "/admin/orders",
  label: "All orders",
  icon: Package
}];
function AdminLayout() {
  const nav = useNavigate();
  const router = useRouterState();
  const {
    user,
    isAdmin,
    loading
  } = useAuth();
  reactExports.useEffect(() => {
    if (loading) return;
    if (!user) nav({
      to: "/login"
    });
    else if (!isAdmin) nav({
      to: "/app/dashboard"
    });
  }, [loading, user, isAdmin, nav]);
  if (!user || !isAdmin) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex min-h-screen flex-col bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(SiteHeader, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container-app grid flex-1 gap-8 py-10 lg:grid-cols-[240px_1fr]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "space-y-1 lg:sticky lg:top-24 lg:self-start", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 rounded-xl border border-gold/30 bg-gold-soft p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-widest text-gold", children: "Admin console" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 font-serif text-lg", children: user.email })
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
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-w-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SiteFooter, {})
  ] });
}
export {
  AdminLayout as component
};
