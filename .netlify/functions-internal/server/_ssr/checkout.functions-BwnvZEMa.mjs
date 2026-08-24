import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { m as mapboxgl } from "../_libs/mapbox-gl.mjs";
import { c as createSsrRpc } from "./router-CcOqsHDG.mjs";
import { c as createServerFn } from "./server-DWRkkZvt.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-pF3e_tkz.mjs";
import { o as objectType, s as stringType, n as numberType } from "../_libs/zod.mjs";
const getPublicConfig = createServerFn({
  method: "GET"
}).handler(createSsrRpc("e7c272786cb41489cadc823410a79f317413773b7b677ef412f6c3867c1d0bdc"));
function OrderMap({
  pickup,
  dropoff,
  className = ""
}) {
  const ref = reactExports.useRef(null);
  const [token, setToken] = reactExports.useState("");
  reactExports.useEffect(() => {
    getPublicConfig().then((c) => setToken(c.mapboxToken));
  }, []);
  reactExports.useEffect(() => {
    if (!token || !ref.current) return;
    mapboxgl.accessToken = token;
    let map = null;
    (async () => {
      const geocode = async (q) => {
        const r = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(q)}.json?access_token=${token}&limit=1`
        );
        const j = await r.json();
        return j.features?.[0]?.center ?? null;
      };
      const [p, d] = await Promise.all([geocode(pickup), geocode(dropoff)]);
      if (!ref.current) return;
      const center = p ?? d ?? [-98.5, 39.5];
      map = new mapboxgl.Map({
        container: ref.current,
        style: "mapbox://styles/mapbox/dark-v11",
        center,
        zoom: p && d ? 11 : 9
      });
      if (p) new mapboxgl.Marker({ color: "#d4af37" }).setPopup(new mapboxgl.Popup().setText("Pickup")).setLngLat(p).addTo(map);
      if (d) new mapboxgl.Marker({ color: "#ef4444" }).setPopup(new mapboxgl.Popup().setText("Drop‑off")).setLngLat(d).addTo(map);
      if (p && d) {
        const bounds = new mapboxgl.LngLatBounds().extend(p).extend(d);
        map.fitBounds(bounds, { padding: 60, maxZoom: 13 });
      }
    })();
    return () => {
      map?.remove();
    };
  }, [token, pickup, dropoff]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref, className: `h-80 w-full overflow-hidden rounded-2xl border border-border ${className}` });
}
const input = objectType({
  orderId: stringType().uuid()
});
const createCheckoutSession = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => input.parse(d)).handler(createSsrRpc("d4c55b7671b63819bd87bbdf9e310bb3ae4dd819ffb7a4c2f6959543bfe84a45"));
const tipInput = objectType({
  orderId: stringType().uuid(),
  tipCents: numberType().int().min(100).max(5e4)
});
const createTipCheckoutSession = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => tipInput.parse(d)).handler(createSsrRpc("670a0e5a54b79c4516b09ebcb01cdaf4248647876535eab9ee0ad8e49b1cad42"));
export {
  OrderMap as O,
  createTipCheckoutSession as a,
  createCheckoutSession as c,
  getPublicConfig as g
};
