import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { e as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { u as useBgmVolume, B as Button } from "./router-CaL1rPwL.mjs";
import { I as Input } from "./input-DuM_isbv.mjs";
import { L as Label } from "./label-cfIxUmTz.mjs";
import { T as Textarea } from "./textarea-DRJ9HbPS.mjs";
import { L as LegalConsent } from "./legal-consent-D_Z6L1VR.mjs";
import { c as createCheckoutSession, O as OrderMap, g as getPublicConfig } from "./checkout.functions-419KKsOw.mjs";
import { r as routeMiles, p as priceQuote, f as fmtUSD, B as BASE_FEE_CENTS, P as PER_MILE_CENTS, E as EXTRA_STOP_CENTS } from "./pricing-Ci0mfZy0.mjs";
import { s as supabase } from "./client-DfLBq1uk.mjs";
import { c as createOrder } from "./order.functions-BdPJdSi5.mjs";
import { u as useServerFn } from "./useServerFn-DL2oePlL.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { C as CARGO_INSURANCE_STATEMENT, b as SUPPORT_STATEMENT } from "./support-knowledge-BldCmBQ4.mjs";
import "../_libs/seroval.mjs";
import "../_libs/stripe.mjs";
import "../_libs/mapbox-gl.mjs";
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
import "./signup-intent-DuoHB-mj.mjs";
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
function AddressAutocomplete({
  name,
  id,
  placeholder,
  defaultValue,
  required,
  onSelect,
  onValueChange
}) {
  const [value, setValue] = reactExports.useState(defaultValue ?? "");
  const [token, setToken] = reactExports.useState("");
  const [suggestions, setSuggestions] = reactExports.useState([]);
  const [open, setOpen] = reactExports.useState(false);
  const [dropdownStyle, setDropdownStyle] = reactExports.useState({});
  const debounce = reactExports.useRef(null);
  const rootRef = reactExports.useRef(null);
  const inputRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    getPublicConfig().then((c) => setToken(c.mapboxToken));
  }, []);
  reactExports.useEffect(() => {
    if (!token || value.length < 3) {
      setSuggestions([]);
      return;
    }
    if (debounce.current) clearTimeout(debounce.current);
    debounce.current = setTimeout(async () => {
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        value
      )}.json?access_token=${token}&autocomplete=true&limit=5&country=us`;
      try {
        const r = await fetch(url);
        const j = await r.json();
        setSuggestions(j.features ?? []);
      } catch {
        setSuggestions([]);
      }
    }, 250);
  }, [value, token]);
  const positionDropdown = () => {
    const input = inputRef.current;
    if (!input) return;
    const rect = input.getBoundingClientRect();
    const maxHeight = Math.min(220, Math.max(120, window.innerHeight - rect.bottom - 16));
    setDropdownStyle({
      position: "fixed",
      top: rect.bottom + 4,
      left: rect.left,
      width: rect.width,
      maxHeight,
      zIndex: 60
    });
  };
  const scrollFieldIntoView = () => {
    inputRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
  };
  reactExports.useEffect(() => {
    if (!open) return;
    positionDropdown();
    const onResize = () => positionDropdown();
    window.visualViewport?.addEventListener("resize", onResize);
    window.visualViewport?.addEventListener("scroll", onResize);
    window.addEventListener("resize", onResize);
    return () => {
      window.visualViewport?.removeEventListener("resize", onResize);
      window.visualViewport?.removeEventListener("scroll", onResize);
      window.removeEventListener("resize", onResize);
    };
  }, [open, suggestions.length]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { ref: rootRef, className: "relative isolate", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Input,
      {
        ref: inputRef,
        id,
        name,
        value,
        onChange: (e) => {
          setValue(e.target.value);
          onValueChange?.(e.target.value);
          setOpen(true);
          positionDropdown();
        },
        onFocus: () => {
          scrollFieldIntoView();
          setOpen(true);
          positionDropdown();
        },
        onBlur: () => setTimeout(() => setOpen(false), 200),
        placeholder,
        required,
        autoComplete: "off",
        enterKeyHint: "next",
        className: "text-base md:text-base"
      }
    ),
    open && suggestions.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "ul",
      {
        style: dropdownStyle,
        className: "overflow-auto rounded-lg border border-border bg-card p-1 shadow-lg",
        role: "listbox",
        children: suggestions.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onMouseDown: (e) => e.preventDefault(),
            onClick: () => {
              setValue(s.place_name);
              setSuggestions([]);
              setOpen(false);
              onValueChange?.(s.place_name);
              onSelect?.(s);
            },
            className: "w-full rounded px-3 py-2 text-left text-sm hover:bg-accent",
            children: s.place_name
          }
        ) }, s.id))
      }
    )
  ] });
}
function NewDelivery() {
  const nav = useNavigate();
  const {
    setMuted
  } = useBgmVolume();
  const checkoutFn = useServerFn(createCheckoutSession);
  const createOrderFn = useServerFn(createOrder);
  reactExports.useEffect(() => {
    setMuted(true);
  }, [setMuted]);
  const [miles, setMiles] = reactExports.useState(3);
  const [type, setType] = reactExports.useState("standard");
  const [agree, setAgree] = reactExports.useState(false);
  const [busy, setBusy] = reactExports.useState(false);
  const [pickup, setPickup] = reactExports.useState("");
  const [dropoff, setDropoff] = reactExports.useState("");
  const [pickupCoord, setPickupCoord] = reactExports.useState(null);
  const [dropoffCoord, setDropoffCoord] = reactExports.useState(null);
  const [extras, setExtras] = reactExports.useState([]);
  function chooseType(next) {
    setType(next);
    if (next === "standard") {
      setExtras([]);
      return;
    }
    setExtras((current) => current.length > 0 ? current : [blankStop()]);
  }
  const filledExtras = extras.filter((stop) => stop.address.trim().length >= 3);
  const extraStops = type === "standard" ? 0 : filledExtras.length;
  const computedMiles = reactExports.useMemo(() => {
    const points = [pickupCoord];
    if (type === "multi_pickup") points.push(...extras.map((stop) => stop.coord));
    points.push(dropoffCoord);
    if (type === "multi_dropoff") points.push(...extras.map((stop) => stop.coord));
    return routeMiles(points);
  }, [pickupCoord, dropoffCoord, extras, type]);
  const effectiveMiles = computedMiles ?? miles;
  const total = reactExports.useMemo(() => priceQuote(effectiveMiles, extraStops), [effectiveMiles, extraStops]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-serif text-4xl", children: "Send a delivery" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground", children: [
        "Tell us what to move and where. Standard, multi-pickup, and multi-dropoff are available. Coming to your city very soon!!! ",
        CARGO_INSURANCE_STATEMENT,
        " ",
        SUPPORT_STATEMENT
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: async (e) => {
      e.preventDefault();
      if (!agree) return toast.error("Please confirm the order checkbox.");
      setBusy(true);
      const fd = new FormData(e.currentTarget);
      const {
        data: {
          user
        }
      } = await supabase.auth.getUser();
      if (!user) {
        setBusy(false);
        return toast.error("Please sign in again.");
      }
      if (type !== "standard" && extras.some((stop) => stop.address.trim().length < 3)) {
        setBusy(false);
        return toast.error(type === "multi_pickup" ? "Enter every pickup address." : "Enter every drop-off address.");
      }
      const role = type === "multi_pickup" ? "pickup" : "dropoff";
      const created = await createOrderFn({
        data: {
          pickupAddress: pickup,
          dropoffAddress: dropoff,
          itemDescription: String(fd.get("item")),
          type,
          priceCents: total,
          tipCents: Math.round(Number(fd.get("tip") || 0) * 100),
          distanceMiles: effectiveMiles,
          pickupLat: pickupCoord ? pickupCoord[1] : null,
          pickupLng: pickupCoord ? pickupCoord[0] : null,
          extraStops: type === "standard" ? [] : extras.map((stop) => ({
            role,
            address: stop.address.trim(),
            lat: stop.coord ? stop.coord[1] : null,
            lng: stop.coord ? stop.coord[0] : null
          }))
        }
      });
      if ("error" in created && created.error) {
        setBusy(false);
        return toast.error(created.error);
      }
      if (!("orderId" in created) || !created.orderId) {
        setBusy(false);
        return toast.error("Could not create order");
      }
      const session = await checkoutFn({
        data: {
          orderId: created.orderId
        }
      });
      if ("error" in session && session.error) {
        setBusy(false);
        toast.error(session.error);
        return nav({
          to: "/app/orders/$id",
          params: {
            id: created.orderId
          }
        });
      }
      if ("url" in session && session.url) {
        window.location.href = session.url;
        return;
      }
      setBusy(false);
      toast.error("Could not start checkout.");
      nav({
        to: "/app/orders/$id",
        params: {
          id: created.orderId
        }
      });
    }, className: "grid gap-6 rounded-2xl border border-border bg-card p-4 sm:p-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Delivery type" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-2 sm:grid-cols-3", children: ["standard", "multi_pickup", "multi_dropoff"].map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => chooseType(t), className: `rounded-lg border px-3 py-2 text-sm capitalize transition-colors ${type === t ? "border-gold bg-gold/10 text-gold" : "border-border bg-card hover:border-gold/40"}`, children: t.replace("_", " ") }, t)) }),
        type === "multi_pickup" && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Add every pickup. All of them go to the drop-off below. Each extra pickup is $3.00." }),
        type === "multi_dropoff" && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Add every drop-off. The pickup below is delivered to each one. Each extra drop-off is $3.00." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "pickup", children: "Pickup address" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AddressAutocomplete, { id: "pickup", name: "pickup", placeholder: "123 Main St, Apt 4B", required: true, defaultValue: pickup, onValueChange: (value) => {
          setPickup(value);
          setPickupCoord(null);
        }, onSelect: (s) => {
          setPickup(s.place_name);
          setPickupCoord(s.center);
        } })
      ] }),
      type === "multi_pickup" && /* @__PURE__ */ jsxRuntimeExports.jsx(ExtraAddresses, { label: "Additional pickup", extras, onChange: setExtras }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "item", children: "What to grab" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { id: "item", name: "item", placeholder: "A sealed envelope from the front desk", required: true, rows: 2 })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "dropoff", children: "Drop‑off address" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AddressAutocomplete, { id: "dropoff", name: "dropoff", placeholder: "456 Oak Ave", required: true, defaultValue: dropoff, onValueChange: (value) => {
          setDropoff(value);
          setDropoffCoord(null);
        }, onSelect: (s) => {
          setDropoff(s.place_name);
          setDropoffCoord(s.center);
        } })
      ] }),
      type === "multi_dropoff" && /* @__PURE__ */ jsxRuntimeExports.jsx(ExtraAddresses, { label: "Additional drop-off", extras, onChange: setExtras }),
      pickupCoord && dropoffCoord && /* @__PURE__ */ jsxRuntimeExports.jsx(OrderMap, { pickup, dropoff }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2 sm:grid-cols-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "miles", children: computedMiles ? "Distance (auto)" : "Estimated miles" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "miles", type: "number", min: 1, max: 50, value: effectiveMiles, disabled: !!computedMiles, onChange: (e) => setMiles(Number(e.target.value)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "tip", children: "Tip (optional, $)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "tip", name: "tip", type: "number", min: 0, step: "0.5", defaultValue: 0 })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-surface p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Estimated total" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-serif text-4xl text-gold", children: fmtUSD(total) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-xs text-muted-foreground", children: [
          fmtUSD(BASE_FEE_CENTS),
          " base + ",
          fmtUSD(Math.round(effectiveMiles * PER_MILE_CENTS)),
          " miles",
          extraStops ? ` + ${fmtUSD(extraStops * EXTRA_STOP_CENTS)} for ${extraStops} extra stop${extraStops === 1 ? "" : "s"}` : ""
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(LegalConsent, { id: "order-consent", checked: agree, onCheckedChange: setAgree, variant: "order" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: busy, className: "bg-gold text-primary-foreground hover:bg-gold/90", children: busy ? "Starting checkout…" : `Continue to payment — ${fmtUSD(total)}` })
    ] })
  ] });
}
function blankStop() {
  return {
    id: crypto.randomUUID(),
    address: "",
    coord: null
  };
}
function ExtraAddresses({
  label,
  extras,
  onChange
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-3", children: [
    extras.map((stop, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: `extra-${stop.id}`, children: [
          label,
          " ",
          index + 2
        ] }),
        extras.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "text-xs text-muted-foreground underline", onClick: () => onChange((current) => current.filter((row) => row.id !== stop.id)), children: "Remove" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(AddressAutocomplete, { id: `extra-${stop.id}`, name: `extra-${stop.id}`, placeholder: "Street address", required: true, defaultValue: stop.address, onValueChange: (value) => {
        onChange((current) => current.map((row) => row.id === stop.id ? {
          ...row,
          address: value,
          coord: null
        } : row));
      }, onSelect: (selected) => {
        onChange((current) => current.map((row) => row.id === stop.id ? {
          ...row,
          address: selected.place_name,
          coord: selected.center
        } : row));
      } })
    ] }, stop.id)),
    extras.length < 8 && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", onClick: () => onChange((current) => [...current, blankStop()]), children: "Add another address" })
  ] });
}
export {
  NewDelivery as component
};
