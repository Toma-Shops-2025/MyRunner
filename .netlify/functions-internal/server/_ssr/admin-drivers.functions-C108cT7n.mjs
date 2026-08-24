import { c as createServerRpc } from "./createServerRpc-ClhbRJjc.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-pF3e_tkz.mjs";
import { c as createServerFn } from "./server-DWRkkZvt.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as objectType, e as enumType, s as stringType } from "../_libs/zod.mjs";
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
const listDriversForAdmin_createServerFn_handler = createServerRpc({
  id: "40bef2cf70ea6e1cff8b718a877f4e1d7b5f04ea2689194d15074b48a2c3926a",
  name: "listDriversForAdmin",
  filename: "src/lib/admin-drivers.functions.ts"
}, (opts) => listDriversForAdmin.__executeServer(opts));
const listDriversForAdmin = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(listDriversForAdmin_createServerFn_handler, async ({
  context
}) => {
  const {
    data: isAdmin
  } = await context.supabase.rpc("has_role", {
    _user_id: context.userId,
    _role: "admin"
  });
  if (!isAdmin) throw new Error("Forbidden");
  const {
    supabaseAdmin
  } = await import("./client.server-D5ro3rAQ.mjs");
  const {
    data: driverRoles,
    error: rolesErr
  } = await supabaseAdmin.from("user_roles").select("user_id").eq("role", "driver");
  if (rolesErr) throw rolesErr;
  const ids = (driverRoles ?? []).map((r) => r.user_id);
  if (ids.length === 0) return {
    drivers: []
  };
  const [{
    data: profiles
  }, {
    data: payouts
  }] = await Promise.all([supabaseAdmin.from("profiles").select("id, email, full_name, phone, stripe_connect_account_id, payouts_enabled, onboarding_completed_at, created_at, background_check_status, background_check_updated_at, is_active").in("id", ids), supabaseAdmin.from("driver_payouts").select("driver_id, amount_cents, status").in("driver_id", ids)]);
  const totals = /* @__PURE__ */ new Map();
  for (const p of payouts ?? []) {
    const cur = totals.get(p.driver_id) ?? {
      paidCents: 0,
      pendingCents: 0,
      count: 0
    };
    if (p.status === "paid") cur.paidCents += p.amount_cents;
    else cur.pendingCents += p.amount_cents;
    cur.count += 1;
    totals.set(p.driver_id, cur);
  }
  const drivers = (profiles ?? []).map((p) => ({
    ...p,
    totals: totals.get(p.id) ?? {
      paidCents: 0,
      pendingCents: 0,
      count: 0
    }
  }));
  drivers.sort((a, b) => b.totals.paidCents - a.totals.paidCents);
  return {
    drivers
  };
});
const updateInput = objectType({
  driverId: stringType().uuid(),
  status: enumType(["pending", "clear", "failed"])
});
const updateDriverBackgroundCheck_createServerFn_handler = createServerRpc({
  id: "2823ff8374858c242ff9368cc18e15e4d7b02f12cf5c4e41b4c9fb80d9255b51",
  name: "updateDriverBackgroundCheck",
  filename: "src/lib/admin-drivers.functions.ts"
}, (opts) => updateDriverBackgroundCheck.__executeServer(opts));
const updateDriverBackgroundCheck = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => updateInput.parse(d)).handler(updateDriverBackgroundCheck_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    data: isAdmin
  } = await context.supabase.rpc("has_role", {
    _user_id: context.userId,
    _role: "admin"
  });
  if (!isAdmin) throw new Error("Forbidden");
  const {
    supabaseAdmin
  } = await import("./client.server-D5ro3rAQ.mjs");
  const isActive = data.status !== "failed";
  const {
    error: updErr
  } = await supabaseAdmin.from("profiles").update({
    background_check_status: data.status,
    background_check_updated_at: (/* @__PURE__ */ new Date()).toISOString(),
    is_active: isActive
  }).eq("id", data.driverId);
  if (updErr) throw updErr;
  if (data.status === "failed") {
    await supabaseAdmin.from("user_roles").delete().eq("user_id", data.driverId).eq("role", "driver");
  } else {
    await supabaseAdmin.from("user_roles").upsert({
      user_id: data.driverId,
      role: "driver"
    }, {
      onConflict: "user_id,role",
      ignoreDuplicates: true
    });
  }
  return {
    ok: true
  };
});
export {
  listDriversForAdmin_createServerFn_handler,
  updateDriverBackgroundCheck_createServerFn_handler
};
