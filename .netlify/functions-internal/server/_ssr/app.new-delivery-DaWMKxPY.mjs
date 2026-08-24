import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { B as Button } from "./button-BXrfXN_b.mjs";
import { I as Input } from "./input-DwaGuH4D.mjs";
import { L as Label } from "./label-Brw405F4.mjs";
import { T as Textarea } from "./textarea-BBisE2jS.mjs";
import { L as LegalConsent } from "./legal-consent-Bi7k--5r.mjs";
import { c as createCheckoutSession, O as OrderMap, g as getPublicConfig } from "./checkout.functions-BwnvZEMa.mjs";
import { p as priceQuote, f as fmtUSD } from "./pricing-CPKaFipb.mjs";
import { s as supabase } from "./client-CbrcWund.mjs";
import { u as useServerFn } from "./useServerFn-DL2oePlL.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import "../_libs/mapbox-gl.mjs";
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
import "../_libs/lucide-react.mjs";
import "./router-CcOqsHDG.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "./server-DWRkkZvt.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "./stripe.server-h1CGUd7G.mjs";
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
import "./auth-middleware-pF3e_tkz.mjs";
import "./createMiddleware-BvN2ghIY.mjs";
import "../_libs/zod.mjs";
import "events";
import "http";
import "https";
import "os";
function AddressAutocomplete({
  name,
  id,
  placeholder,
  defaultValue,
  required,
  onSelect
}) {
  const [value, setValue] = reactExports.useState(defaultValue ?? "");
  const [token, setToken] = reactExports.useState("");
  const [suggestions, setSuggestions] = reactExports.useState([]);
  const [open, setOpen] = reactExports.useState(false);
  const debounce = reactExports.useRef(null);
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
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Input,
      {
        id,
        name,
        value,
        onChange: (e) => {
          setValue(e.target.value);
          setOpen(true);
        },
        onFocus: () => setOpen(true),
        onBlur: () => setTimeout(() => setOpen(false), 200),
        placeholder,
        required,
        autoComplete: "off"
      }
    ),
    open && suggestions.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "absolute z-50 mt-1 max-h-64 w-full overflow-auto rounded-lg border border-border bg-popover p-1 shadow-lg", children: suggestions.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        onClick: () => {
          setValue(s.place_name);
          setSuggestions([]);
          setOpen(false);
          onSelect?.(s);
        },
        className: "w-full rounded px-3 py-2 text-left text-sm hover:bg-accent",
        children: s.place_name
      }
    ) }, s.id)) })
  ] });
}
function NewDelivery() {
  const nav = useNavigate();
  const checkoutFn = useServerFn(createCheckoutSession);
  const [miles, setMiles] = reactExports.useState(3);
  const [type, setType] = reactExports.useState("standard");
  const [agree, setAgree] = reactExports.useState(false);
  const [busy, setBusy] = reactExports.useState(false);
  const [pickup, setPickup] = reactExports.useState("");
  const [dropoff, setDropoff] = reactExports.useState("");
  const [pickupCoord, setPickupCoord] = reactExports.useState(null);
  const [dropoffCoord, setDropoffCoord] = reactExports.useState(null);
  const extraStops = type === "standard" ? 0 : 1;
  const computedMiles = reactExports.useMemo(() => {
    if (!pickupCoord || !dropoffCoord) return null;
    const R = 3958.8;
    const toRad = (n) => n * Math.PI / 180;
    const [lng1, lat1] = pickupCoord;
    const [lng2, lat2] = dropoffCoord;
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
    return Math.max(1, Math.round(2 * R * Math.asin(Math.sqrt(a))));
  }, [pickupCoord, dropoffCoord]);
  const effectiveMiles = computedMiles ?? miles;
  const total = reactExports.useMemo(() => priceQuote(effectiveMiles, extraStops), [effectiveMiles, extraStops]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-serif text-4xl", children: "Send a delivery" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Tell us what to move and where." })
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
      const {
        data: created,
        error
      } = await supabase.from("orders").insert({
        customer_id: user.id,
        pickup_address: pickup,
        dropoff_address: dropoff,
        item_description: String(fd.get("item")),
        type,
        price_cents: total,
        tip_cents: Math.round(Number(fd.get("tip") || 0) * 100),
        distance_miles: effectiveMiles,
        pickup_lat: pickupCoord ? pickupCoord[1] : null,
        pickup_lng: pickupCoord ? pickupCoord[0] : null
      }).select("id").single();
      if (error || !created) {
        setBusy(false);
        return toast.error(error?.message ?? "Could not create order");
      }
      const session = await checkoutFn({
        data: {
          orderId: created.id
        }
      });
      if ("error" in session && session.error) {
        setBusy(false);
        toast.error(session.error);
        return nav({
          to: "/app/orders/$id",
          params: {
            id: created.id
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
          id: created.id
        }
      });
    }, className: "grid gap-6 rounded-2xl border border-border bg-card p-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "pickup", children: "Pickup address" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AddressAutocomplete, { id: "pickup", name: "pickup", placeholder: "123 Main St, Apt 4B", required: true, defaultValue: pickup, onSelect: (s) => {
          setPickup(s.place_name);
          setPickupCoord(s.center);
        } })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "item", children: "What to grab" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { id: "item", name: "item", placeholder: "A sealed envelope from the front desk", required: true, rows: 2 })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "dropoff", children: "Drop‑off address" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AddressAutocomplete, { id: "dropoff", name: "dropoff", placeholder: "456 Oak Ave", required: true, defaultValue: dropoff, onSelect: (s) => {
          setDropoff(s.place_name);
          setDropoffCoord(s.center);
        } })
      ] }),
      pickupCoord && dropoffCoord && /* @__PURE__ */ jsxRuntimeExports.jsx(OrderMap, { pickup, dropoff }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Delivery type" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-2 sm:grid-cols-3", children: ["standard", "multi_pickup", "multi_dropoff"].map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setType(t), className: `rounded-lg border px-3 py-2 text-sm capitalize transition-colors ${type === t ? "border-gold bg-gold/10 text-gold" : "border-border bg-card hover:border-gold/40"}`, children: t.replace("_", " ") }, t)) })
      ] }),
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
          "$5.99 base + $",
          (effectiveMiles * 1.5).toFixed(2),
          " miles",
          extraStops ? ` + $${(extraStops * 3).toFixed(2)} extra stop` : ""
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(LegalConsent, { id: "order-consent", checked: agree, onCheckedChange: setAgree, variant: "order" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: busy, className: "bg-gold text-primary-foreground hover:bg-gold/90", children: busy ? "Starting checkout…" : `Continue to payment — ${fmtUSD(total)}` })
    ] })
  ] });
}
export {
  NewDelivery as component
};
