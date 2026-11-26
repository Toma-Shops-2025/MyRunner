import { c as createServerRpc } from "./createServerRpc-C3IsetnU.mjs";
import { c as createServerFn } from "./server-pkl-8gUD.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CMwi6y2l.mjs";
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
const REFERRAL_REWARD_CENTS = 2500;
const REFERRAL_DELIVERY_GOAL = 3;
function makeCode(seed) {
  const clean = seed.replace(/[^a-zA-Z0-9]/g, "").slice(0, 4).toUpperCase() || "RUN";
  const tail = crypto.randomUUID().replace(/-/g, "").slice(0, 5).toUpperCase();
  return `MR${clean}${tail}`.slice(0, 12);
}
async function ensureCodeForUser(supabaseAdmin, userId) {
  const {
    data: profile
  } = await supabaseAdmin.from("profiles").select("referral_code, full_name, email").eq("id", userId).maybeSingle();
  if (profile?.referral_code) return profile.referral_code;
  const seed = String(profile?.full_name || profile?.email || userId);
  for (let i = 0; i < 6; i++) {
    const code = makeCode(seed + String(i));
    const {
      error
    } = await supabaseAdmin.from("profiles").update({
      referral_code: code
    }).eq("id", userId).is("referral_code", null);
    if (!error) {
      const {
        data: again
      } = await supabaseAdmin.from("profiles").select("referral_code").eq("id", userId).maybeSingle();
      if (again?.referral_code) return again.referral_code;
    }
  }
  const fallback = makeCode(userId);
  await supabaseAdmin.from("profiles").update({
    referral_code: fallback
  }).eq("id", userId);
  return fallback;
}
const getDriverReferralStats_createServerFn_handler = createServerRpc({
  id: "54d19a3f8b8f048ed1edbd043b01fdb8f0bbd5c985a7c674db2121d49eed973f",
  name: "getDriverReferralStats",
  filename: "src/lib/referral.functions.ts"
}, (opts) => getDriverReferralStats.__executeServer(opts));
const getDriverReferralStats = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(getDriverReferralStats_createServerFn_handler, async ({
  context
}) => {
  const {
    supabaseAdmin
  } = await import("./client.server-D5ro3rAQ.mjs");
  const code = await ensureCodeForUser(supabaseAdmin, context.userId);
  const {
    data: rows
  } = await supabaseAdmin.from("driver_referrals").select("id, referred_id, status, deliveries_completed, reward_cents, created_at, paid_at").eq("referrer_id", context.userId).order("created_at", {
    ascending: false
  });
  const list = rows ?? [];
  const paidCount = list.filter((r) => r.status === "paid").length;
  const pendingCount = list.filter((r) => r.status === "pending" || r.status === "qualified").length;
  return {
    code,
    link: `https://myrunner.shop/signup?intent=driver&ref=${encodeURIComponent(code)}`,
    rewardCents: REFERRAL_REWARD_CENTS,
    deliveryGoal: REFERRAL_DELIVERY_GOAL,
    invited: list.length,
    paidCount,
    pendingCount,
    referrals: list
  };
});
const attachDriverReferrer_createServerFn_handler = createServerRpc({
  id: "a40e96326d3224ef3ddb979d00f13df938373467278c97ee8dfa9496bf7947fe",
  name: "attachDriverReferrer",
  filename: "src/lib/referral.functions.ts"
}, (opts) => attachDriverReferrer.__executeServer(opts));
const attachDriverReferrer = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => d).handler(attachDriverReferrer_createServerFn_handler, async ({
  data,
  context
}) => {
  const code = data.code?.trim().toUpperCase();
  if (!code) throw new Error("Missing referral code");
  const {
    supabaseAdmin
  } = await import("./client.server-D5ro3rAQ.mjs");
  const {
    data: existing
  } = await supabaseAdmin.from("driver_referrals").select("id").eq("referred_id", context.userId).maybeSingle();
  if (existing) return {
    ok: true,
    already: true
  };
  const {
    data: referrer
  } = await supabaseAdmin.from("profiles").select("id, referral_code").eq("referral_code", code).maybeSingle();
  if (!referrer?.id) throw new Error("Invalid referral code");
  if (referrer.id === context.userId) throw new Error("You can't refer yourself");
  await supabaseAdmin.from("profiles").update({
    referred_by: referrer.id
  }).eq("id", context.userId).is("referred_by", null);
  const {
    error
  } = await supabaseAdmin.from("driver_referrals").insert({
    referrer_id: referrer.id,
    referred_id: context.userId,
    referral_code: code,
    status: "pending",
    deliveries_completed: 0,
    reward_cents: REFERRAL_REWARD_CENTS
  });
  if (error) {
    if (String(error.message).includes("duplicate") || String(error.code) === "23505") {
      return {
        ok: true,
        already: true
      };
    }
    throw new Error(error.message);
  }
  return {
    ok: true,
    already: false
  };
});
export {
  attachDriverReferrer_createServerFn_handler,
  getDriverReferralStats_createServerFn_handler
};
