import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { P as PageShell } from "./page-shell-C9kH61wK.mjs";
import { B as Button } from "./button-BXrfXN_b.mjs";
import { I as Input } from "./input-DwaGuH4D.mjs";
import { L as Label } from "./label-Brw405F4.mjs";
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
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
function Login() {
  const nav = useNavigate();
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
    const {
      data: roleRows
    } = data.user ? await supabase.from("user_roles").select("role").eq("user_id", data.user.id) : {
      data: []
    };
    const isDriver = (roleRows ?? []).some((row) => row.role === "driver");
    toast.success("Welcome back.");
    nav({
      to: isDriver ? "/driver/dashboard" : "/app/dashboard"
    });
  }, className: "w-full max-w-md rounded-2xl border border-border bg-card p-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-serif text-4xl", children: "Welcome back" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Sign in to continue." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 space-y-4", children: [
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
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: busy, className: "w-full bg-gold text-primary-foreground hover:bg-gold/90", children: "Sign in" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", className: "w-full", onClick: google, children: "Continue with Google" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 rounded-xl border border-dashed border-gold/40 bg-gold-soft/30 p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-widest text-gold", children: "For reviewers" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-sm", children: [
        "Sign in with ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono", children: "driver-review@myrunner.shop" }),
        " to see the full pre-approved driver flow."
      ] })
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
