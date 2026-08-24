import { c as createServerRpc } from "./createServerRpc-ClhbRJjc.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-pF3e_tkz.mjs";
import { c as createServerFn } from "./server-DWRkkZvt.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "./createMiddleware-BvN2ghIY.mjs";
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
const startDriverBackgroundCheck_createServerFn_handler = createServerRpc({
  id: "f12acf9adf0dc8da5c08e85517a0bed951a2daee908ef527af74e63b2ec6887a",
  name: "startDriverBackgroundCheck",
  filename: "src/lib/checkr.functions.ts"
}, (opts) => startDriverBackgroundCheck.__executeServer(opts));
const startDriverBackgroundCheck = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).handler(startDriverBackgroundCheck_createServerFn_handler, async ({
  context
}) => {
  const {
    startBackgroundCheck,
    checkrEnabled
  } = await import("./checkr.server-BQpZ1ySt.mjs");
  if (!checkrEnabled()) {
    return {
      ok: true,
      enabled: false
    };
  }
  const {
    supabaseAdmin
  } = await import("./client.server-D5ro3rAQ.mjs");
  const {
    data: profile
  } = await supabaseAdmin.from("profiles").select("email, full_name, phone, date_of_birth, ssn_last4, home_zip, checkr_candidate_id").eq("id", context.userId).maybeSingle();
  if (!profile || profile.checkr_candidate_id) return {
    ok: true,
    alreadyStarted: true
  };
  const [first, ...rest] = (profile.full_name ?? "").split(" ");
  const last = rest.join(" ") || "Driver";
  const result = await startBackgroundCheck({
    first_name: first || "Driver",
    last_name: last,
    email: profile.email ?? "",
    phone: profile.phone ?? void 0,
    dob: profile.date_of_birth ?? void 0,
    zipcode: profile.home_zip ?? void 0
    // Full SSN not stored; Checkr collects it via invitation flow
  });
  if (result.candidateId) {
    await supabaseAdmin.from("profiles").update({
      checkr_candidate_id: result.candidateId
    }).eq("id", context.userId);
  }
  return {
    ok: true,
    enabled: true,
    candidateId: result.candidateId
  };
});
export {
  startDriverBackgroundCheck_createServerFn_handler
};
