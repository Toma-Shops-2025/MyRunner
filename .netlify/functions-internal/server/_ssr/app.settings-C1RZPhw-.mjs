import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { B as Button, c as cn, b as buttonVariants } from "./button-BXrfXN_b.mjs";
import { I as Input } from "./input-DwaGuH4D.mjs";
import { L as Label } from "./label-Brw405F4.mjs";
import { s as supabase } from "./client-CbrcWund.mjs";
import { u as useAuth, s as signOut } from "./use-auth-Bp-NYKWf.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { R as Root2, T as Trigger2, P as Portal2, C as Content2, a as Title2, D as Description2, b as Cancel, A as Action, O as Overlay2 } from "../_libs/radix-ui__react-alert-dialog.mjs";
import { S as Share2, v as Star, w as ShieldOff, x as Trash2 } from "../_libs/lucide-react.mjs";
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
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-dialog.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/react-remove-scroll.mjs";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/aria-hidden.mjs";
const AlertDialog = Root2;
const AlertDialogTrigger = Trigger2;
const AlertDialogPortal = Portal2;
const AlertDialogOverlay = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Overlay2,
  {
    className: cn(
      "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    ),
    ...props,
    ref
  }
));
AlertDialogOverlay.displayName = Overlay2.displayName;
const AlertDialogContent = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogPortal, { children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogOverlay, {}),
  /* @__PURE__ */ jsxRuntimeExports.jsx(
    Content2,
    {
      ref,
      className: cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg",
        className
      ),
      ...props
    }
  )
] }));
AlertDialogContent.displayName = Content2.displayName;
const AlertDialogHeader = ({ className, ...props }) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("flex flex-col space-y-2 text-center sm:text-left", className), ...props });
AlertDialogHeader.displayName = "AlertDialogHeader";
const AlertDialogFooter = ({ className, ...props }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  "div",
  {
    className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
    ...props
  }
);
AlertDialogFooter.displayName = "AlertDialogFooter";
const AlertDialogTitle = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Title2,
  {
    ref,
    className: cn("text-lg font-semibold", className),
    ...props
  }
));
AlertDialogTitle.displayName = Title2.displayName;
const AlertDialogDescription = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Description2,
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
AlertDialogDescription.displayName = Description2.displayName;
const AlertDialogAction = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(Action, { ref, className: cn(buttonVariants(), className), ...props }));
AlertDialogAction.displayName = Action.displayName;
const AlertDialogCancel = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Cancel,
  {
    ref,
    className: cn(buttonVariants({ variant: "outline" }), "mt-2 sm:mt-0", className),
    ...props
  }
));
AlertDialogCancel.displayName = Cancel.displayName;
function Settings() {
  const nav = useNavigate();
  const {
    user
  } = useAuth();
  const [name, setName] = reactExports.useState("");
  const [phone, setPhone] = reactExports.useState("");
  const [prefs, setPrefs] = reactExports.useState([]);
  const [newBlock, setNewBlock] = reactExports.useState("");
  const [newPref, setNewPref] = reactExports.useState("");
  reactExports.useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("full_name,phone").eq("id", user.id).single().then(({
      data
    }) => {
      setName(data?.full_name ?? "");
      setPhone(data?.phone ?? "");
    });
    supabase.from("driver_preferences").select("id,driver_id,preference").then(({
      data
    }) => setPrefs(data ?? []));
  }, [user]);
  if (!user) return null;
  const blocked = prefs.filter((p) => p.preference === "blocked");
  const preferred = prefs.filter((p) => p.preference === "preferred");
  async function saveProfile() {
    const {
      error
    } = await supabase.from("profiles").update({
      full_name: name,
      phone
    }).eq("id", user.id);
    if (error) return toast.error(error.message);
    toast.success("Profile saved.");
  }
  async function addPref(driver_id, preference) {
    if (!driver_id) return;
    const {
      data,
      error
    } = await supabase.from("driver_preferences").insert({
      customer_id: user.id,
      driver_id,
      preference
    }).select().single();
    if (error) return toast.error(error.message);
    setPrefs((p) => [...p, data]);
    if (preference === "blocked") setNewBlock("");
    else setNewPref("");
    toast.success(preference === "blocked" ? "Runner blocked." : "Preferred Runner added.");
  }
  async function removePref(id) {
    const {
      error
    } = await supabase.from("driver_preferences").delete().eq("id", id);
    if (error) return toast.error(error.message);
    setPrefs((p) => p.filter((x) => x.id !== id));
  }
  async function deleteAccount() {
    await supabase.from("driver_preferences").delete().eq("customer_id", user.id);
    await supabase.from("reports").delete().eq("reporter_id", user.id);
    await supabase.from("orders").delete().eq("customer_id", user.id);
    await supabase.from("profiles").delete().eq("id", user.id);
    await signOut();
    toast.success("Account deletion submitted. Final removal completes within 30 days.");
    nav({
      to: "/"
    });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-serif text-4xl", children: "Settings" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-2xl border border-border bg-card p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-serif text-2xl", children: "Profile" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 grid gap-4 sm:grid-cols-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Full name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: name, onChange: (e) => setName(e.target.value) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Email" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: user.email ?? "", disabled: true })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Phone" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: phone, onChange: (e) => setPhone(e.target.value) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "mt-4 bg-gold text-primary-foreground hover:bg-gold/90", onClick: saveProfile, children: "Save changes" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-2xl border border-gold/40 bg-gold-soft p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Share2, { className: "size-5 text-gold" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-serif text-2xl", children: "Share MyRunner" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "Help friends discover on‑demand delivery. Grab your QR code and shareable link." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, className: "mt-4 bg-gold text-primary-foreground hover:bg-gold/90", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/share", children: "Open share page" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-2xl border border-border bg-card p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "size-5 text-gold" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-serif text-2xl", children: "Preferred Runners" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "Drivers you'd like to request first." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: newPref, onChange: (e) => setNewPref(e.target.value), placeholder: "Driver user ID" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => addPref(newPref.trim(), "preferred"), children: "Add" })
      ] }),
      preferred.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-3 flex flex-wrap gap-2", children: preferred.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-xs", children: [
        p.driver_id.slice(0, 8),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => removePref(p.id), "aria-label": "Remove", children: "×" })
      ] }, p.id)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-2xl border border-border bg-card p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldOff, { className: "size-5 text-destructive" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-serif text-2xl", children: "Blocked Runners" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "These drivers will never be matched to your orders." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: newBlock, onChange: (e) => setNewBlock(e.target.value), placeholder: "Driver user ID" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "destructive", onClick: () => addPref(newBlock.trim(), "blocked"), children: "Block" })
      ] }),
      blocked.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-3 flex flex-wrap gap-2", children: blocked.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-2 rounded-full border border-destructive/40 bg-destructive/10 px-3 py-1 text-xs", children: [
        p.driver_id.slice(0, 8),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => removePref(p.id), "aria-label": "Unblock", children: "×" })
      ] }, p.id)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-2xl border border-destructive/40 bg-destructive/5 p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-5 text-destructive" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-serif text-2xl", children: "Delete account" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "Permanently delete your MyRunner account and all associated data within 30 days. Some records may be retained to comply with tax, fraud, safety, or legal obligations." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialog, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "destructive", className: "mt-4", children: "Delete my account" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: "Delete your account?" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogDescription, { children: "This is permanent. Your profile, order history, saved addresses, and preferences will be removed within 30 days. You can't undo this." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { children: "Cancel" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogAction, { className: "bg-destructive text-destructive-foreground hover:bg-destructive/90", onClick: deleteAccount, children: "Yes, delete" })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-2xl border border-border bg-card p-6 pb-20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-serif text-2xl mb-4", children: "Legal & Support" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/privacy", className: "p-4 rounded-xl border border-border bg-background text-sm font-medium hover:border-gold transition-colors", children: "Privacy Policy" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/terms", className: "p-4 rounded-xl border border-border bg-background text-sm font-medium hover:border-gold transition-colors", children: "Terms of Service" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/faq", className: "p-4 rounded-xl border border-border bg-background text-sm font-medium hover:border-gold transition-colors", children: "F.A.Q." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/contact", className: "p-4 rounded-xl border border-border bg-background text-sm font-medium hover:border-gold transition-colors text-gold", children: "Contact Support" })
      ] })
    ] })
  ] });
}
export {
  Settings as component
};
