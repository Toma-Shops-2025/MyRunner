import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { e as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useServerFn } from "./useServerFn-DL2oePlL.mjs";
import { P as PageShell } from "./page-shell-Daj9NfIl.mjs";
import { B as Button } from "./router-CaL1rPwL.mjs";
import { I as Input } from "./input-DuM_isbv.mjs";
import { L as Label } from "./label-cfIxUmTz.mjs";
import { s as supabase } from "./client-DfLBq1uk.mjs";
import { s as signInWithGoogle } from "./auth-google-CmNrGRv_.mjs";
import { r as resolvePostAuthDestination } from "./auth.functions-ZiALDO7n.mjs";
import { u as useAuth, r as resolveClientPostAuthDestination } from "./use-auth-B85-Dc53.mjs";
import { c as clearSignupIntent } from "./signup-intent-DuoHB-mj.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import "../_libs/seroval.mjs";
import "../_libs/stripe.mjs";
import { E as EyeOff, b as Eye } from "../_libs/lucide-react.mjs";
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
import "./back-button-PLK58KB_.mjs";
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
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-primitive.mjs";
function Login() {
  const nav = useNavigate();
  const resolveDest = useServerFn(resolvePostAuthDestination);
  const {
    user,
    loading: authLoading,
    isAdmin,
    isDriver
  } = useAuth();
  const [busy, setBusy] = reactExports.useState(false);
  const [googleBusy, setGoogleBusy] = reactExports.useState(false);
  const [showPassword, setShowPassword] = reactExports.useState(false);
  reactExports.useEffect(() => {
    clearSignupIntent();
  }, []);
  reactExports.useEffect(() => {
    if (authLoading || !user) return;
    if (isAdmin) nav({
      to: "/admin/dashboard"
    });
    else if (isDriver) nav({
      to: "/driver/dashboard"
    });
    else nav({
      to: "/app/dashboard"
    });
  }, [authLoading, user, isAdmin, isDriver, nav]);
  async function google() {
    setGoogleBusy(true);
    const {
      error
    } = await signInWithGoogle();
    if (error) {
      setGoogleBusy(false);
      toast.error(error.message || "Google sign-in failed. Check that Google is enabled in Supabase.");
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(PageShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "container-app grid min-h-[80vh] place-items-center py-16", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: async (e) => {
    e.preventDefault();
    setBusy(true);
    const fd = new FormData(e.currentTarget);
    const {
      data,
      error
    } = await supabase.auth.signInWithPassword({
      email: String(fd.get("email")),
      password: String(fd.get("password"))
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    try {
      const dest = await Promise.race([resolveDest(), new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), 8e3))]);
      toast.success("Welcome back.");
      nav({
        to: dest.to
      });
    } catch {
      const to = data.user ? await resolveClientPostAuthDestination(data.user.id, {
        metadata: data.user.user_metadata
      }) : "/app/dashboard";
      toast.success("Welcome back.");
      nav({
        to
      });
    }
  }, className: "w-full max-w-md rounded-2xl border border-border bg-card p-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-serif text-4xl", children: "Welcome back" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Sign in to continue." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", className: "w-full", disabled: googleBusy, onClick: google, children: googleBusy ? "Redirecting to Google…" : "Continue with Google" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative py-1 text-center text-xs uppercase tracking-widest text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "relative z-10 bg-card px-2", children: "or email" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute inset-x-0 top-1/2 border-t border-border" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "email", children: "Email" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "email", name: "email", type: "email", required: true })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "password", children: "Password" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "password", name: "password", type: showPassword ? "text" : "password", required: true, className: "pr-10" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setShowPassword(!showPassword), className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground", children: showPassword ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-4 w-4" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: busy, className: "w-full bg-gold text-primary-foreground hover:bg-gold/90", children: "Sign in" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-6 text-center text-sm text-muted-foreground", children: [
      "New here?",
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/signup", className: "text-gold underline", children: "Create an account" })
    ] })
  ] }) }) });
}
export {
  Login as component
};
