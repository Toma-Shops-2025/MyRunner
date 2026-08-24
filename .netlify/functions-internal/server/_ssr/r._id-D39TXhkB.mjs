import { c as createServerRpc } from "./createServerRpc-ClhbRJjc.mjs";
import { c as createClient } from "../_libs/supabase__supabase-js.mjs";
import { c as createServerFn } from "./server-DWRkkZvt.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as objectType, s as stringType } from "../_libs/zod.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
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
const fetchRunner_createServerFn_handler = createServerRpc({
  id: "a6b1e7cf7e3f22a01fbd54fdaf632547a26b8860897e09ffc00e4ada0cc08f2f",
  name: "fetchRunner",
  filename: "src/routes/r.$id.tsx"
}, (opts) => fetchRunner.__executeServer(opts));
const fetchRunner = createServerFn({
  method: "GET"
}).inputValidator((d) => objectType({
  id: stringType().uuid()
}).parse(d)).handler(fetchRunner_createServerFn_handler, async ({
  data
}) => {
  const sb = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_PUBLISHABLE_KEY, {
    auth: {
      storage: void 0,
      persistSession: false,
      autoRefreshToken: false
    }
  });
  const {
    data: row
  } = await sb.from("profiles").select("id, full_name, payouts_enabled, onboarding_completed_at").eq("id", data.id).maybeSingle();
  if (!row) return null;
  return {
    id: row.id,
    name: row.full_name ?? "MyRunner Runner",
    verified: Boolean(row.payouts_enabled),
    since: row.onboarding_completed_at
  };
});
export {
  fetchRunner_createServerFn_handler
};
