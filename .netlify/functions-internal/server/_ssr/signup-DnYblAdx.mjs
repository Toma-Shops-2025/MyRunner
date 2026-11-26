import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { e as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { P as PageShell } from "./page-shell-Daj9NfIl.mjs";
import { R as Route$D, B as Button } from "./router-CaL1rPwL.mjs";
import { I as Input } from "./input-DuM_isbv.mjs";
import { L as Label } from "./label-cfIxUmTz.mjs";
import { L as LegalConsent } from "./legal-consent-D_Z6L1VR.mjs";
import { s as supabase } from "./client-DfLBq1uk.mjs";
import { s as signInWithGoogle } from "./auth-google-CmNrGRv_.mjs";
import { s as setDriverReferralCode, a as setSignupIntent } from "./signup-intent-DuoHB-mj.mjs";
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
import "./use-auth-B85-Dc53.mjs";
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
import "../_libs/radix-ui__react-checkbox.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/radix-ui__react-use-previous.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "../_libs/radix-ui__react-presence.mjs";
function Signup() {
  const {
    intent: initialIntent,
    ref: refCode
  } = Route$D.useSearch();
  const nav = useNavigate();
  const [intent, setIntent] = reactExports.useState(refCode ? "driver" : initialIntent);
  const [agree, setAgree] = reactExports.useState(false);
  const [busy, setBusy] = reactExports.useState(false);
  const [googleBusy, setGoogleBusy] = reactExports.useState(false);
  const [showPassword, setShowPassword] = reactExports.useState(false);
  const isDriver = intent === "driver";
  reactExports.useEffect(() => {
    if (refCode) {
      setDriverReferralCode(refCode);
      setIntent("driver");
    }
  }, [refCode]);
  async function google() {
    if (!agree) return toast.error("Please accept the policies to continue.");
    setGoogleBusy(true);
    setSignupIntent(intent);
    if (refCode) setDriverReferralCode(refCode);
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
    if (!agree) return toast.error("Please accept the policies to continue.");
    setBusy(true);
    if (refCode) setDriverReferralCode(refCode);
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email"));
    const fullName = String(fd.get("name"));
    const {
      data: authData,
      error
    } = await supabase.auth.signUp({
      email,
      password: String(fd.get("password")),
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: {
          full_name: fullName,
          signup_intent: intent
        }
      }
    });
    if (!error && authData.user) {
      await supabase.from("profiles").upsert({
        id: authData.user.id,
        full_name: fullName,
        email
      }).catch((err) => console.warn("Profile sync error", err));
    }
    setBusy(false);
    if (error) return toast.error(error.message);
    if (!authData.session) {
      toast.success(isDriver ? "Check your email to confirm, then sign in to finish your driver application." : "Check your email to confirm your account, then sign in.");
      return nav({
        to: "/login"
      });
    }
    toast.success(isDriver ? "Account created — finish your driver application." : "Welcome to MyRunner.");
    nav({
      to: isDriver ? "/driver-signup" : "/app/dashboard"
    });
  }, className: "w-full max-w-md rounded-2xl border border-border bg-card p-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-serif text-4xl", children: "Create account" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: isDriver ? "Sign up as a Runner, then complete your driver application." : "Sign up to send deliveries and track your Runners live." }),
    refCode && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-3 rounded-lg border border-gold/30 bg-gold/10 px-3 py-2 text-xs text-gold", children: [
      "Referral code applied: ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono font-semibold", children: refCode.toUpperCase() }),
      " — earn $25 after 3 deliveries."
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 grid grid-cols-2 gap-2 rounded-xl border border-border bg-muted/30 p-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setIntent("customer"), className: `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${!isDriver ? "bg-gold text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`, children: "Send deliveries" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setIntent("driver"), className: `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${isDriver ? "bg-gold text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`, children: "Drive & earn" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", className: "w-full", disabled: googleBusy, onClick: google, children: googleBusy ? "Redirecting to Google…" : "Continue with Google" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative py-1 text-center text-xs uppercase tracking-widest text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "relative z-10 bg-card px-2", children: "or email" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute inset-x-0 top-1/2 border-t border-border" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "name", children: "Full name" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "name", name: "name", required: true })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "email", children: "Email" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "email", name: "email", type: "email", required: true })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "password", children: "Password" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "password", name: "password", type: showPassword ? "text" : "password", required: true, minLength: 8, className: "pr-10" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setShowPassword(!showPassword), className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground", children: showPassword ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-4 w-4" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(LegalConsent, { id: "signup-consent", checked: agree, onCheckedChange: setAgree }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: busy, className: "w-full bg-gold text-primary-foreground hover:bg-gold/90", children: isDriver ? "Create account & apply to drive" : "Create customer account" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-6 text-center text-sm text-muted-foreground", children: [
      "Already a member?",
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/login", className: "text-gold underline", children: "Sign in" })
    ] })
  ] }) }) });
}
export {
  Signup as component
};
