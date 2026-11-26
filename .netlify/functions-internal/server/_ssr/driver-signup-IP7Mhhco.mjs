import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { e as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { u as useServerFn } from "./useServerFn-DL2oePlL.mjs";
import { P as PageShell } from "./page-shell-Daj9NfIl.mjs";
import { B as Button } from "./router-CaL1rPwL.mjs";
import { I as Input } from "./input-DuM_isbv.mjs";
import { L as Label } from "./label-cfIxUmTz.mjs";
import { L as LegalConsent } from "./legal-consent-D_Z6L1VR.mjs";
import { s as supabase } from "./client-DfLBq1uk.mjs";
import { c as createSsrRpc } from "./createSsrRpc-xYjLf7RI.mjs";
import { c as createServerFn } from "./server-pkl-8gUD.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CMwi6y2l.mjs";
import { attachDriverReferrer } from "./referral.functions-BOR-6JNb.mjs";
import { r as readDriverReferralCode, b as clearDriverReferralCode } from "./signup-intent-DuoHB-mj.mjs";
import { u as useAuth } from "./use-auth-B85-Dc53.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { g as SSN_LAST4_CHECKR_STATEMENT } from "./support-knowledge-BldCmBQ4.mjs";
import "../_libs/stripe.mjs";
import "../_libs/seroval.mjs";
import { o as objectType, b as booleanType, s as stringType, n as numberType } from "../_libs/zod.mjs";
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
import "../_libs/lucide-react.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
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
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
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
const driverApplicationInput = objectType({
  fullName: stringType().min(1),
  phone: stringType(),
  dob: stringType().optional(),
  ssnLast4: stringType().length(4),
  homeAddress: stringType(),
  homeCity: stringType(),
  homeState: stringType().max(2),
  homeZip: stringType(),
  emergencyContactName: stringType(),
  emergencyContactPhone: stringType(),
  vehicleMake: stringType(),
  vehicleModel: stringType(),
  vehicleYear: numberType().nullable(),
  licenseNumber: stringType(),
  licenseState: stringType().max(2),
  insuranceProvider: stringType(),
  isReviewer: booleanType().optional()
});
const activateDriverRole = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => driverApplicationInput.parse(d)).handler(createSsrRpc("72e92813e75d32d12ceaceb4b85493b7e5721200d713ae26c970f60b7f582f93"));
const DRIVER_APPROVED_KEY = "myrunner-driver-just-approved";
function goToDriverDashboard() {
  sessionStorage.setItem(DRIVER_APPROVED_KEY, String(Date.now()));
  window.location.replace("/driver/dashboard");
}
function DriverSignup() {
  const nav = useNavigate();
  const activateRole = useServerFn(activateDriverRole);
  const {
    user,
    loading,
    isDriver
  } = useAuth();
  const [agree, setAgree] = reactExports.useState(false);
  const [busy, setBusy] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (loading) return;
    if (!user) {
      nav({
        to: "/signup",
        search: {
          intent: "driver"
        }
      });
      return;
    }
    if (isDriver) {
      nav({
        to: "/driver/dashboard"
      });
      return;
    }
    void supabase.from("driver_applications").select("status").eq("user_id", user.id).maybeSingle().then(({
      data
    }) => {
      if (data?.status === "approved") goToDriverDashboard();
    });
  }, [loading, user, isDriver, nav]);
  if (loading || !user || isDriver) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(PageShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "container-app grid min-h-[60vh] place-items-center py-16", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Loading…" }) }) });
  }
  const profileName = user.user_metadata?.full_name || user.email?.split("@")[0] || "";
  const profileEmail = user.email ?? "";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(PageShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "container-app py-16", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-widest text-gold", children: "Driver application" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-3 font-serif text-5xl", children: "Apply to drive" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 max-w-xl text-muted-foreground", children: "Coming to your city very soon!!! Takes about 5 minutes. After MyRunner launches in a city or state, drivers there can start driving after the application, a driver's license, and their own auto insurance are provided. Once MyRunner uses Checkr, a driver is deactivated if any disqualifying charges are found. Support is available 24/7 after that launch." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: async (e) => {
      e.preventDefault();
      if (!agree) return toast.error("Please accept the policies and background check consent.");
      setBusy(true);
      const fd = new FormData(e.currentTarget);
      const email = profileEmail;
      const fullName = String(fd.get("name") || profileName).trim();
      const phone = String(fd.get("phone") || "").trim();
      const dob = String(fd.get("dob") || "");
      const ssnLast4 = String(fd.get("ssn_last4") || "").replace(/\D/g, "").slice(0, 4);
      if (ssnLast4.length !== 4) {
        setBusy(false);
        return toast.error("Please enter the last four digits of your Social Security number.");
      }
      const currentUser = user;
      if (!currentUser) {
        setBusy(false);
        return toast.error("Please sign in to continue your application.");
      }
      const isReviewer = email.toLowerCase() === "driver-review@myrunner.shop";
      try {
        await activateRole({
          data: {
            fullName,
            phone,
            dob: dob || void 0,
            ssnLast4,
            homeAddress: String(fd.get("address") || ""),
            homeCity: String(fd.get("city") || ""),
            homeState: String(fd.get("state") || "").toUpperCase().slice(0, 2),
            homeZip: String(fd.get("zip") || ""),
            emergencyContactName: String(fd.get("ec_name") || ""),
            emergencyContactPhone: String(fd.get("ec_phone") || ""),
            vehicleMake: String(fd.get("make")),
            vehicleModel: String(fd.get("model")),
            vehicleYear: Number(fd.get("year")) || null,
            licenseNumber: String(fd.get("license_number") || ""),
            licenseState: String(fd.get("license_state") || "").toUpperCase().slice(0, 2),
            insuranceProvider: String(fd.get("insurance_provider") || ""),
            isReviewer
          }
        });
      } catch (err) {
        setBusy(false);
        return toast.error(`Could not save application: ${err.message || "unknown error"}`);
      }
      const refCode = readDriverReferralCode();
      if (refCode) {
        try {
          await attachDriverReferrer({
            data: {
              code: refCode
            }
          });
          clearDriverReferralCode();
        } catch (e2) {
          console.warn("referral attach failed:", e2.message);
        }
      }
      if (!isReviewer) {
        try {
          const {
            startDriverBackgroundCheck
          } = await import("./checkr.functions-DelYLCi2.mjs");
          void startDriverBackgroundCheck();
        } catch (e2) {
          console.warn("background check kickoff failed:", e2.message);
        }
      }
      toast.success(isReviewer ? "Reviewer demo driver ready — opening dashboard…" : "Application saved. After MyRunner launches in a city or state, drivers there can start once the application, a driver's license, and auto insurance are provided.");
      goToDriverDashboard();
    }, className: "mt-10 grid max-w-3xl gap-6 rounded-2xl border border-border bg-card p-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Section, { title: "Your account", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { id: "name", label: "Full legal name", defaultValue: profileName }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { id: "email", label: "Email", type: "email", defaultValue: profileEmail, readOnly: true }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { id: "phone", label: "Mobile phone", type: "tel" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Section, { title: "Identity verification", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { id: "dob", label: "Date of birth", type: "date" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2 sm:col-span-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "ssn_last4", children: "Social Security number — last 4 digits only" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "ssn_last4", name: "ssn_last4", inputMode: "numeric", autoComplete: "off", placeholder: "6789", maxLength: 4, pattern: "[0-9]{4}", required: true, className: "max-w-[8rem] tracking-widest" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs leading-relaxed text-muted-foreground", children: SSN_LAST4_CHECKR_STATEMENT })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Section, { title: "Home address", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { id: "address", label: "Street address" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { id: "city", label: "City" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { id: "state", label: "State", placeholder: "GA" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { id: "zip", label: "ZIP" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Section, { title: "Emergency contact", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { id: "ec_name", label: "Contact name" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { id: "ec_phone", label: "Contact phone", type: "tel" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Section, { title: "Driver's license", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { id: "license_number", label: "License number" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { id: "license_state", label: "License state", placeholder: "GA" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { id: "license", label: "Upload license (front)", type: "file" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { id: "license_back", label: "Upload license (back)", type: "file" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Section, { title: "Your vehicle & insurance", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { id: "make", label: "Vehicle make", placeholder: "Toyota" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { id: "model", label: "Vehicle model", placeholder: "Corolla" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { id: "year", label: "Vehicle year", placeholder: "2021" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { id: "insurance_provider", label: "Insurance provider", placeholder: "GEICO" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { id: "insurance", label: "Upload proof of insurance", type: "file" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(LegalConsent, { id: "driver-consent", checked: agree, onCheckedChange: setAgree, variant: "driver" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: busy, className: "bg-gold text-primary-foreground hover:bg-gold/90", children: busy ? "Submitting…" : "Submit & start driving" })
    ] })
  ] }) });
}
function Section({
  title,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-serif text-2xl", children: title }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 grid gap-4 sm:grid-cols-2", children })
  ] });
}
function Field({
  id,
  label,
  type = "text",
  placeholder,
  defaultValue,
  readOnly
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: id, children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id, name: id, type, placeholder, defaultValue, readOnly, required: type !== "file" && !readOnly, className: readOnly ? "bg-muted/50" : void 0 })
  ] });
}
export {
  DriverSignup as component
};
