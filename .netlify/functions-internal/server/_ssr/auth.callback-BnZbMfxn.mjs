import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { e as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { u as useServerFn } from "./useServerFn-DL2oePlL.mjs";
import { P as PageShell } from "./page-shell-Daj9NfIl.mjs";
import { s as supabase } from "./client-DfLBq1uk.mjs";
import { d as readSignupIntent, c as clearSignupIntent } from "./signup-intent-DuoHB-mj.mjs";
import { a as resolveOAuthCallbackDestination } from "./auth.functions-ZiALDO7n.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import "../_libs/seroval.mjs";
import "../_libs/stripe.mjs";
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
import "./router-CaL1rPwL.mjs";
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
import "./support-knowledge-BldCmBQ4.mjs";
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
import "../_libs/lucide-react.mjs";
import "../_libs/zod.mjs";
import "events";
import "http";
import "https";
import "os";
import "./use-auth-B85-Dc53.mjs";
function AuthCallback() {
  const nav = useNavigate();
  const resolveOAuthDest = useServerFn(resolveOAuthCallbackDestination);
  const [message, setMessage] = reactExports.useState("Finishing Google sign-in…");
  const routedRef = reactExports.useRef(false);
  reactExports.useEffect(() => {
    let cancelled = false;
    async function routeUser(session) {
      if (routedRef.current || cancelled) return;
      routedRef.current = true;
      setMessage("Setting up your account…");
      const meta = session.user.user_metadata ?? {};
      void supabase.from("profiles").upsert({
        id: session.user.id,
        email: session.user.email ?? null,
        full_name: meta.full_name || meta.name || session.user.email?.split("@")[0] || null
      }, {
        onConflict: "id"
      });
      const sessionIntent = readSignupIntent();
      clearSignupIntent();
      const dest = await resolveOAuthDest({
        data: {
          sessionSignupIntent: sessionIntent
        }
      });
      if (cancelled) return;
      toast.success("Welcome to MyRunner.");
      nav({
        to: dest.to
      });
    }
    const {
      data: {
        subscription
      }
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (cancelled || routedRef.current) return;
      if ((event === "SIGNED_IN" || event === "INITIAL_SESSION") && session?.user) {
        void routeUser(session);
      }
    });
    void supabase.auth.getSession().then(({
      data,
      error
    }) => {
      if (cancelled || routedRef.current) return;
      if (error) {
        toast.error(error.message);
        nav({
          to: "/login"
        });
        return;
      }
      if (data.session?.user) {
        void routeUser(data.session);
        return;
      }
      if (new URLSearchParams(window.location.search).has("code")) {
        setMessage("Confirming with Google…");
      } else {
        setMessage("Waiting for Google…");
      }
    });
    const timeout = window.setTimeout(() => {
      if (routedRef.current || cancelled) return;
      setMessage("Sign-in timed out. Try again.");
      toast.error("Google sign-in did not complete. Please try again.");
      nav({
        to: "/login"
      });
    }, 15e3);
    return () => {
      cancelled = true;
      subscription.unsubscribe();
      window.clearTimeout(timeout);
    };
  }, [nav, resolveOAuthDest]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(PageShell, { showBack: false, children: /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "container-app grid min-h-[60vh] place-items-center py-16", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-card p-8 text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-widest text-gold", children: "Auth" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-2 font-serif text-3xl", children: message }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "One moment…" })
  ] }) }) });
}
export {
  AuthCallback as component
};
