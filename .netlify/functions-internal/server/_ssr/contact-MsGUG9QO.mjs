import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { P as PageShell } from "./page-shell-C9kH61wK.mjs";
import { B as Button } from "./button-BXrfXN_b.mjs";
import { I as Input } from "./input-DwaGuH4D.mjs";
import { L as Label } from "./label-Brw405F4.mjs";
import { T as Textarea } from "./textarea-BBisE2jS.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { L as LegalConsent } from "./legal-consent-Bi7k--5r.mjs";
import "./footer-C9rrXBeC.mjs";
import "../_libs/tanstack__react-router.mjs";
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
import "./use-auth-Bp-NYKWf.mjs";
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
import "../_libs/lucide-react.mjs";
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
function Contact() {
  const [agree, setAgree] = reactExports.useState(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(PageShell, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "container-app py-20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-widest text-gold", children: "Contact" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-3 font-serif text-6xl", children: "Real humans. Fast replies." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-muted-foreground", children: "support@myrunner.shop · 24/7 in‑app AI chat" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "container-app pb-24", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: (e) => {
      e.preventDefault();
      if (!agree) return toast.error("Please accept the policies.");
      toast.success("Message sent — we'll reply within 24h.");
      e.target.reset();
      setAgree(false);
    }, className: "grid max-w-xl gap-4 rounded-2xl border border-border bg-card p-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "name", children: "Name" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "name", required: true })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "email", children: "Email" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "email", type: "email", required: true })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "msg", children: "Message" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { id: "msg", rows: 5, required: true })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(LegalConsent, { id: "contact-consent", checked: agree, onCheckedChange: setAgree }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", className: "bg-gold text-primary-foreground hover:bg-gold/90", children: "Send message" })
    ] }) })
  ] });
}
export {
  Contact as component
};
