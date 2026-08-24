import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate, L as Link, O as Outlet } from "../_libs/tanstack__react-router.mjs";
import { S as SiteHeader, a as SiteFooter } from "./footer-C9rrXBeC.mjs";
import { s as supabase } from "./client-CbrcWund.mjs";
import { u as useAuth, s as signOut } from "./use-auth-Bp-NYKWf.mjs";
import { B as Button } from "./button-BXrfXN_b.mjs";
import { j as TriangleAlert } from "../_libs/lucide-react.mjs";
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
function PayoutSetupBanner() {
  const { user } = useAuth();
  const [show, setShow] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (!user) return;
    let cancelled = false;
    supabase.from("profiles").select("payouts_enabled").eq("id", user.id).maybeSingle().then(({ data }) => {
      if (!cancelled) setShow(!data?.payouts_enabled);
    });
    return () => {
      cancelled = true;
    };
  }, [user]);
  if (!show) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-6 rounded-2xl border-2 border-gold/50 bg-gradient-to-r from-gold/10 via-gold/5 to-transparent p-5 shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-start gap-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "mt-0.5 size-6 shrink-0 text-gold" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-serif text-lg", children: "Finish setting up your payouts" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "You won't receive earnings until you complete a one-time payout setup (takes ~2 minutes). Verify your identity and connect your bank account so we can deposit your delivery fees and tips." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Link,
      {
        to: "/driver/earnings",
        className: "rounded-full bg-gold px-5 py-2 text-sm font-medium text-primary-foreground hover:bg-gold/90",
        children: "Set up payouts →"
      }
    )
  ] }) });
}
function DriverLayout() {
  const nav = useNavigate();
  const {
    user,
    loading,
    isDriver
  } = useAuth();
  reactExports.useEffect(() => {
    if (!loading && (!user || !isDriver)) nav({
      to: "/driver-signup"
    });
  }, [loading, user, isDriver, nav]);
  if (!user) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex min-h-screen flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(SiteHeader, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container-app flex-1 py-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-widest text-gold", children: "Driver" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-serif text-2xl", children: user.user_metadata?.full_name ?? user.email?.split("@")[0] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/driver/dashboard", children: "Dashboard" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/driver/earnings", children: "Earnings" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", onClick: async () => {
            await signOut();
            nav({
              to: "/"
            });
          }, children: "Sign out" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(PayoutSetupBanner, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-6 text-xs text-muted-foreground", children: [
        "Need help? ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/contact", className: "text-gold underline", children: "Contact support" }),
        " · ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/app/report", className: "text-gold underline", children: "Report an issue" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SiteFooter, {})
  ] });
}
export {
  DriverLayout as component
};
