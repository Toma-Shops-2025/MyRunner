import { c as createServerRpc } from "./createServerRpc-C3IsetnU.mjs";
import { c as createServerFn } from "./server-pkl-8gUD.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CMwi6y2l.mjs";
import { i as intentFromMetadata } from "./signup-intent-DuoHB-mj.mjs";
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
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
async function resolveEffectiveDriverAccess(userId, options) {
  const {
    supabaseAdmin
  } = await import("./client.server-D5ro3rAQ.mjs");
  const [{
    data: authData
  }, {
    data: roleRows
  }, {
    data: app
  }, {
    data: profile
  }] = await Promise.all([supabaseAdmin.auth.admin.getUserById(userId), supabaseAdmin.from("user_roles").select("role").eq("user_id", userId), supabaseAdmin.from("driver_applications").select("status").eq("user_id", userId).maybeSingle(), supabaseAdmin.from("profiles").select("stripe_connect_account_id, payouts_enabled").eq("id", userId).maybeSingle()]);
  const roles = (roleRows ?? []).map((r) => r.role);
  const signupIntent = intentFromMetadata(authData.user?.user_metadata);
  const approvedApp = app?.status === "approved";
  let hasDriverRole = roles.includes("driver");
  const completedDriverSetup = Boolean(profile?.stripe_connect_account_id && profile?.payouts_enabled);
  if (options?.cleanupStaleDriverRole && signupIntent === "customer" && !approvedApp && !completedDriverSetup && hasDriverRole) {
    await supabaseAdmin.from("user_roles").delete().eq("user_id", userId).eq("role", "driver");
    hasDriverRole = false;
  }
  const isAdmin = roles.includes("admin");
  const isDriver = approvedApp || completedDriverSetup || hasDriverRole && signupIntent !== "customer";
  return {
    isAdmin,
    isDriver,
    signupIntent,
    approvedApp
  };
}
const resolvePostAuthDestination_createServerFn_handler = createServerRpc({
  id: "42318616db7b7b8f534af1b98a3fc9d36c025dc5e58ecd63d87f941f6cbfa544",
  name: "resolvePostAuthDestination",
  filename: "src/lib/auth.functions.ts"
}, (opts) => resolvePostAuthDestination.__executeServer(opts));
const resolvePostAuthDestination = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).handler(resolvePostAuthDestination_createServerFn_handler, async ({
  context
}) => {
  const access = await resolveEffectiveDriverAccess(context.userId, {
    cleanupStaleDriverRole: true
  });
  if (access.isAdmin) {
    return {
      to: "/admin/dashboard"
    };
  }
  if (access.isDriver) {
    return {
      to: "/driver/dashboard"
    };
  }
  return {
    to: "/app/dashboard"
  };
});
function destinationAfterFreshOAuth(access, sessionSignupIntent) {
  if (access.isAdmin) return "/admin/dashboard";
  if (access.isDriver) return "/driver/dashboard";
  if (sessionSignupIntent === "driver") return "/driver-signup";
  return "/app/dashboard";
}
const resolveOAuthCallbackDestination_createServerFn_handler = createServerRpc({
  id: "3db245f92860a09c168e55cb153e6d9bacef87683da180ecaff81fa5790de80e",
  name: "resolveOAuthCallbackDestination",
  filename: "src/lib/auth.functions.ts"
}, (opts) => resolveOAuthCallbackDestination.__executeServer(opts));
const resolveOAuthCallbackDestination = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((data) => {
  const d = data;
  return {
    sessionSignupIntent: d?.sessionSignupIntent === "driver" || d?.sessionSignupIntent === "customer" ? d.sessionSignupIntent : null
  };
}).handler(resolveOAuthCallbackDestination_createServerFn_handler, async ({
  context,
  data
}) => {
  const access = await resolveEffectiveDriverAccess(context.userId, {
    cleanupStaleDriverRole: true
  });
  return {
    to: destinationAfterFreshOAuth(access, data.sessionSignupIntent)
  };
});
export {
  resolveOAuthCallbackDestination_createServerFn_handler,
  resolvePostAuthDestination_createServerFn_handler
};
