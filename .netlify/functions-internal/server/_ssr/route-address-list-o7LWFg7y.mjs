import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { p as parseRouteStops, o as orderedAddresses } from "./route-stops-DHGcaVTx.mjs";
function RouteAddressList({
  pickup,
  dropoff,
  stops
}) {
  const parsed = Array.isArray(stops) ? parseRouteStops(stops) : [];
  const { pickups, dropoffs } = orderedAddresses(pickup, dropoff, parsed);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 space-y-1 text-sm text-muted-foreground", children: [
    pickups.map((address, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-foreground/80", children: [
        "Pickup",
        pickups.length > 1 ? ` ${index + 1}` : "",
        ":"
      ] }),
      " ",
      address
    ] }, `p-${index}`)),
    dropoffs.map((address, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-foreground/80", children: [
        "Drop-off",
        dropoffs.length > 1 ? ` ${index + 1}` : "",
        ":"
      ] }),
      " ",
      address
    ] }, `d-${index}`))
  ] });
}
export {
  RouteAddressList as R
};
