import { c as createSsrRpc } from "./createSsrRpc-xYjLf7RI.mjs";
import { c as createServerFn } from "./server-pkl-8gUD.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CMwi6y2l.mjs";
const resolvePostAuthDestination = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("42318616db7b7b8f534af1b98a3fc9d36c025dc5e58ecd63d87f941f6cbfa544"));
const resolveOAuthCallbackDestination = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((data) => {
  const d = data;
  return {
    sessionSignupIntent: d?.sessionSignupIntent === "driver" || d?.sessionSignupIntent === "customer" ? d.sessionSignupIntent : null
  };
}).handler(createSsrRpc("3db245f92860a09c168e55cb153e6d9bacef87683da180ecaff81fa5790de80e"));
export {
  resolveOAuthCallbackDestination as a,
  resolvePostAuthDestination as r
};
