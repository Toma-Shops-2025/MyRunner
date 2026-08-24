import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { C as Checkbox$1, a as CheckboxIndicator } from "../_libs/radix-ui__react-checkbox.mjs";
import { c as cn } from "./button-BXrfXN_b.mjs";
import { L as Label } from "./label-Brw405F4.mjs";
import { C as Check } from "../_libs/lucide-react.mjs";
const Checkbox = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Checkbox$1,
  {
    ref,
    className: cn(
      "grid place-content-center peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
      className
    ),
    ...props,
    children: /* @__PURE__ */ jsxRuntimeExports.jsx(CheckboxIndicator, { className: cn("grid place-content-center text-current"), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4" }) })
  }
));
Checkbox.displayName = Checkbox$1.displayName;
function LegalConsent({
  id,
  checked,
  onCheckedChange,
  variant = "signup"
}) {
  const text = (() => {
    switch (variant) {
      case "driver":
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          "I confirm I am at least 18, have a valid license and insurance, and consent to a background check (Checkr). I agree to the",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/terms", className: "text-gold underline", children: "Terms" }),
          ",",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/privacy", className: "text-gold underline", children: "Privacy Policy" }),
          ", and",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/community-guidelines", className: "text-gold underline", children: "Community Guidelines" }),
          "."
        ] });
      case "order":
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          "I confirm the item is legal to transport, not perishable/hazardous in violation of policy, and I accept the",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/terms", className: "text-gold underline", children: "Terms" }),
          " and",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/refund-policy", className: "text-gold underline", children: "Refund Policy" }),
          "."
        ] });
      case "report":
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          "I confirm this report is true to the best of my knowledge. False reports may violate the",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/community-guidelines", className: "text-gold underline", children: "Community Guidelines" }),
          "."
        ] });
      default:
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          "I agree to the",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/terms", className: "text-gold underline", children: "Terms of Service" }),
          ",",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/privacy", className: "text-gold underline", children: "Privacy Policy" }),
          ", and",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/cookies", className: "text-gold underline", children: "Cookie Policy" }),
          "."
        ] });
    }
  })();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 rounded-md border border-border bg-surface p-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Checkbox,
      {
        id,
        checked,
        onCheckedChange: (v) => onCheckedChange(v === true),
        className: "mt-0.5"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: id, className: "text-xs leading-relaxed text-muted-foreground font-normal", children: text })
  ] });
}
export {
  LegalConsent as L
};
