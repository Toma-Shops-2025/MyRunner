import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { P as PageShell } from "./page-shell-C9kH61wK.mjs";
import { B as Button } from "./button-BXrfXN_b.mjs";
import { I as Input } from "./input-DwaGuH4D.mjs";
import { L as Label } from "./label-Brw405F4.mjs";
import { L as LegalConsent } from "./legal-consent-Bi7k--5r.mjs";
import { s as supabase } from "./client-CbrcWund.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { E as EyeOff, a as Eye } from "../_libs/lucide-react.mjs";
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
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
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
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
function Signup() {
  const nav = useNavigate();
  const [agree, setAgree] = reactExports.useState(false);
  const [busy, setBusy] = reactExports.useState(false);
  const [showPassword, setShowPassword] = reactExports.useState(false);
  async function google() {
    const {
      error
    } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin + "/app/dashboard"
      }
    });
    if (error) toast.error("Google sign-in failed.");
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(PageShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "container-app grid min-h-[80vh] place-items-center py-16", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: async (e) => {
    e.preventDefault();
    if (!agree) return toast.error("Please accept the policies to continue.");
    setBusy(true);
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
        emailRedirectTo: `${window.location.origin}/app/dashboard`,
        data: {
          full_name: fullName
        }
      }
    });
    if (!error && authData.user) {
      await supabase.from("profiles").insert({
        id: authData.user.id,
        full_name: fullName,
        email
      }).catch((err) => console.warn("Profile sync error", err));
    }
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Welcome to MyRunner.");
    nav({
      to: "/app/dashboard"
    });
  }, className: "w-full max-w-md rounded-2xl border border-border bg-card p-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-serif text-4xl", children: "Create account" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Send deliveries in 60 seconds." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 space-y-4", children: [
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
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: busy, className: "w-full bg-gold text-primary-foreground hover:bg-gold/90", children: "Create account" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", className: "w-full", onClick: google, children: "Continue with Google" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-6 text-center text-sm text-muted-foreground", children: [
      "Already a member? ",
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/login", className: "text-gold underline", children: "Sign in" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-2 text-center text-xs text-muted-foreground", children: [
      "Want to drive instead? ",
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/driver-signup", className: "text-gold underline", children: "Apply as a Runner" })
    ] })
  ] }) }) });
}
export {
  Signup as component
};
