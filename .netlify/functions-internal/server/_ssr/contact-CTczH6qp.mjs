import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { P as PageShell } from "./page-shell-Daj9NfIl.mjs";
import { B as Button, s as submitContactMessage } from "./router-CaL1rPwL.mjs";
import { I as Input } from "./input-DuM_isbv.mjs";
import { L as Label } from "./label-cfIxUmTz.mjs";
import { T as Textarea } from "./textarea-DRJ9HbPS.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { L as LegalConsent } from "./legal-consent-D_Z6L1VR.mjs";
import { b as SUPPORT_STATEMENT, d as SUPPORT_EMAIL, C as CARGO_INSURANCE_STATEMENT, D as DRIVER_SCREENING_STATEMENT, c as SUPPORT_PHONE_DISPLAY, e as SUPPORT_PHONE_TEL } from "./support-knowledge-BldCmBQ4.mjs";
import "../_libs/seroval.mjs";
import "../_libs/stripe.mjs";
import "../_libs/tanstack__react-router.mjs";
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
import "./client-DfLBq1uk.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "./signup-intent-DuoHB-mj.mjs";
import "../_libs/lucide-react.mjs";
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
function Contact() {
  const [agree, setAgree] = reactExports.useState(false);
  const [busy, setBusy] = reactExports.useState(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(PageShell, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "container-app py-20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-widest text-gold", children: "Contact" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-3 font-serif text-6xl", children: "Contact support." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-4 max-w-xl text-muted-foreground", children: [
        "Coming to your city very soon!!! ",
        SUPPORT_STATEMENT,
        " Call",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { className: "text-gold underline", href: `tel:${SUPPORT_PHONE_TEL}`, children: SUPPORT_PHONE_DISPLAY }),
        " ",
        "or email ",
        SUPPORT_EMAIL,
        ", or send the form below. ",
        CARGO_INSURANCE_STATEMENT,
        " ",
        DRIVER_SCREENING_STATEMENT,
        " The Help button can answer common questions from the FAQ."
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "container-app pb-24", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: async (e) => {
      e.preventDefault();
      if (!agree) return toast.error("Please accept the policies.");
      const form = e.currentTarget;
      const fd = new FormData(form);
      setBusy(true);
      try {
        await submitContactMessage({
          data: {
            name: String(fd.get("name") || ""),
            email: String(fd.get("email") || ""),
            message: String(fd.get("msg") || "")
          }
        });
        toast.success("Message sent. We'll reply by email when we can.");
        form.reset();
        setAgree(false);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Could not send message.");
      } finally {
        setBusy(false);
      }
    }, className: "grid max-w-xl gap-4 rounded-2xl border border-border bg-card p-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "name", children: "Name" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "name", name: "name", required: true })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "email", children: "Email" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "email", name: "email", type: "email", required: true })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "msg", children: "Message" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { id: "msg", name: "msg", rows: 5, required: true })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(LegalConsent, { id: "contact-consent", checked: agree, onCheckedChange: setAgree }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: busy, className: "bg-gold text-primary-foreground hover:bg-gold/90", children: busy ? "Sending…" : "Send message" })
    ] }) })
  ] });
}
export {
  Contact as component
};
