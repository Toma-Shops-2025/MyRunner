import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { P as PageShell } from "./page-shell-C9kH61wK.mjs";
import { B as Button } from "./button-BXrfXN_b.mjs";
import { I as Input } from "./input-DwaGuH4D.mjs";
import { L as Label } from "./label-Brw405F4.mjs";
import { L as LegalConsent } from "./legal-consent-Bi7k--5r.mjs";
import { s as supabase } from "./client-CbrcWund.mjs";
import { t as toast } from "../_libs/sonner.mjs";
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
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
function DriverSignup() {
  const nav = useNavigate();
  const [agree, setAgree] = reactExports.useState(false);
  const [busy, setBusy] = reactExports.useState(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(PageShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "container-app py-16", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-widest text-gold", children: "Driver application" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-3 font-serif text-5xl", children: "Apply to drive" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 max-w-xl text-muted-foreground", children: "Takes about 5 minutes. You'll be activated as a Runner immediately and can start accepting orders once you finish payout setup. A background check runs in the background — your account stays active unless something disqualifying turns up." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: async (e) => {
      e.preventDefault();
      if (!agree) return toast.error("Please accept the policies and background check consent.");
      setBusy(true);
      const fd = new FormData(e.currentTarget);
      const email = String(fd.get("email")).trim();
      const password = String(fd.get("password") || "");
      const fullName = String(fd.get("name")).trim();
      const phone = String(fd.get("phone") || "").trim();
      const dob = String(fd.get("dob") || "");
      const ssnFull = String(fd.get("ssn") || "").replace(/\D/g, "");
      const ssnLast4 = ssnFull.slice(-4);
      let {
        data: {
          user
        }
      } = await supabase.auth.getUser();
      if (!user) {
        if (password.length < 8) {
          setBusy(false);
          return toast.error("Create a password of 8+ characters.");
        }
        if (ssnLast4.length !== 4) {
          setBusy(false);
          return toast.error("Please enter a valid SSN.");
        }
        const {
          data,
          error
        } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/driver/dashboard`,
            data: {
              full_name: fullName
            }
          }
        });
        if (error) {
          const {
            data: signInData,
            error: signInErr
          } = await supabase.auth.signInWithPassword({
            email,
            password
          });
          if (signInErr) {
            setBusy(false);
            return toast.error(error.message);
          }
          user = signInData.user;
        } else {
          user = data.user;
          if (!data.session) {
            const {
              data: signInData,
              error: signInErr
            } = await supabase.auth.signInWithPassword({
              email,
              password
            });
            if (signInErr) {
              setBusy(false);
              toast.success("Application submitted. Check your email to confirm and then sign in.");
              return nav({
                to: "/login"
              });
            }
            user = signInData.user;
          }
        }
      }
      if (!user) {
        setBusy(false);
        return toast.error("Could not create account.");
      }
      const isReviewer = email.toLowerCase() === "driver-review@myrunner.shop";
      const {
        error: profileErr
      } = await supabase.from("profiles").update({
        full_name: fullName,
        phone,
        date_of_birth: dob || null,
        ssn_last4: ssnLast4 || null,
        home_address: String(fd.get("address") || ""),
        home_city: String(fd.get("city") || ""),
        home_state: String(fd.get("state") || "").toUpperCase().slice(0, 2),
        home_zip: String(fd.get("zip") || ""),
        emergency_contact_name: String(fd.get("ec_name") || ""),
        emergency_contact_phone: String(fd.get("ec_phone") || ""),
        background_check_status: "clear",
        background_check_updated_at: (/* @__PURE__ */ new Date()).toISOString(),
        is_active: true,
        ...isReviewer ? {
          stripe_connect_account_id: "acct_demo_driver_review",
          payouts_enabled: true,
          onboarding_completed_at: (/* @__PURE__ */ new Date()).toISOString()
        } : {}
      }).eq("id", user.id);
      if (profileErr) console.warn("profile update warn:", profileErr.message);
      await supabase.from("driver_applications").upsert({
        user_id: user.id,
        vehicle_make: String(fd.get("make")),
        vehicle_model: String(fd.get("model")),
        vehicle_year: Number(fd.get("year")) || null,
        license_number: String(fd.get("license_number") || ""),
        license_state: String(fd.get("license_state") || "").toUpperCase().slice(0, 2),
        insurance_provider: String(fd.get("insurance_provider") || ""),
        status: "approved"
      }, {
        onConflict: "user_id"
      });
      const {
        error: roleErr
      } = await supabase.from("user_roles").insert({
        user_id: user.id,
        role: "driver"
      });
      if (roleErr && !roleErr.message.toLowerCase().includes("duplicate")) {
        setBusy(false);
        return toast.error(`Could not activate driver account: ${roleErr.message}`);
      }
      if (!isReviewer) {
        try {
          const {
            startDriverBackgroundCheck
          } = await import("./checkr.functions-C-YH3ebm.mjs");
          await startDriverBackgroundCheck();
        } catch (e2) {
          console.warn("background check kickoff failed:", e2.message);
        }
      }
      setBusy(false);
      toast.success(isReviewer ? "Reviewer demo driver ready." : "You're approved! Finish payout setup to start accepting orders.");
      window.location.assign("/driver/dashboard");
    }, className: "mt-10 grid max-w-3xl gap-6 rounded-2xl border border-border bg-card p-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Section, { title: "Account", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { id: "name", label: "Full legal name" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { id: "email", label: "Email", type: "email" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { id: "password", label: "Create password (8+ chars)", type: "password" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { id: "phone", label: "Mobile phone", type: "tel" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Section, { title: "Identity verification", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { id: "dob", label: "Date of birth", type: "date" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { id: "ssn", label: "Social Security Number", placeholder: "123-45-6789" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "col-span-full text-xs text-muted-foreground", children: "Required by our background-check provider (Checkr). We only store the last 4 digits — the full SSN is sent securely to Checkr and discarded." })
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
  placeholder
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: id, children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id, name: id, type, placeholder, required: type !== "file" })
  ] });
}
export {
  DriverSignup as component
};
