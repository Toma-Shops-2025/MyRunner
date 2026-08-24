import { c as createServerRpc } from "./createServerRpc-ClhbRJjc.mjs";
import { c as createServerFn } from "./server-DWRkkZvt.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "node:stream";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "stream";
import "crypto";
import "../_libs/isbot.mjs";
const getPublicConfig_createServerFn_handler = createServerRpc({
  id: "e7c272786cb41489cadc823410a79f317413773b7b677ef412f6c3867c1d0bdc",
  name: "getPublicConfig",
  filename: "src/lib/config.functions.ts"
}, (opts) => getPublicConfig.__executeServer(opts));
const getPublicConfig = createServerFn({
  method: "GET"
}).handler(getPublicConfig_createServerFn_handler, async () => {
  return {
    mapboxToken: process.env.MAPBOX_PUBLIC_TOKEN ?? "",
    stripePublishableKey: process.env.VITE_PAYMENTS_CLIENT_TOKEN ?? ""
  };
});
export {
  getPublicConfig_createServerFn_handler
};
