import { c as createSsrRpc } from "./createSsrRpc-xYjLf7RI.mjs";
import { c as createServerFn } from "./server-pkl-8gUD.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CMwi6y2l.mjs";
import { c as createStripeClient, g as getStripeEnv } from "./stripe-payout.server-BMP7bU7B.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import "../_libs/stripe.mjs";
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
import "events";
import "http";
import "https";
import "os";
const REFERRAL_REWARD_CENTS = 2500;
const REFERRAL_DELIVERY_GOAL = 3;
async function payConnectBonus(opts) {
  if (opts.connectAccountId.startsWith("acct_demo")) {
    return `tr_demo_${opts.role}_${opts.referralId.slice(0, 8)}`;
  }
  const stripe = createStripeClient(getStripeEnv());
  const transfer = await stripe.transfers.create({
    amount: opts.amountCents,
    currency: "usd",
    destination: opts.connectAccountId,
    description: `MyRunner driver referral bonus (${opts.role})`,
    metadata: {
      type: "driver_referral",
      role: opts.role,
      referral_id: opts.referralId,
      user_id: opts.userId
    }
  }, {
    idempotencyKey: `ref-${opts.role}-${opts.referralId}`
  });
  return transfer.id;
}
const getDriverReferralStats = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("54d19a3f8b8f048ed1edbd043b01fdb8f0bbd5c985a7c674db2121d49eed973f"));
const attachDriverReferrer = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => d).handler(createSsrRpc("a40e96326d3224ef3ddb979d00f13df938373467278c97ee8dfa9496bf7947fe"));
async function maybeCompleteDriverReferral(driverId) {
  const {
    supabaseAdmin
  } = await import("./client.server-D5ro3rAQ.mjs");
  const {
    data: referral
  } = await supabaseAdmin.from("driver_referrals").select("*").eq("referred_id", driverId).maybeSingle();
  if (!referral) return;
  if (referral.status === "paid") return;
  const {
    count
  } = await supabaseAdmin.from("orders").select("id", {
    count: "exact",
    head: true
  }).eq("driver_id", driverId).eq("status", "delivered");
  const deliveries = count ?? 0;
  await supabaseAdmin.from("driver_referrals").update({
    deliveries_completed: deliveries
  }).eq("id", referral.id);
  if (deliveries < REFERRAL_DELIVERY_GOAL) return;
  if (referral.status === "pending") {
    await supabaseAdmin.from("driver_referrals").update({
      status: "qualified",
      qualified_at: (/* @__PURE__ */ new Date()).toISOString()
    }).eq("id", referral.id);
  }
  const {
    data: referrerProfile
  } = await supabaseAdmin.from("profiles").select("stripe_connect_account_id, payouts_enabled").eq("id", referral.referrer_id).maybeSingle();
  const {
    data: referredProfile
  } = await supabaseAdmin.from("profiles").select("stripe_connect_account_id, payouts_enabled").eq("id", referral.referred_id).maybeSingle();
  const referrerAcct = referrerProfile?.stripe_connect_account_id;
  const referredAcct = referredProfile?.stripe_connect_account_id;
  if (!referrerAcct || !referredAcct) {
    await supabaseAdmin.from("driver_referrals").update({
      status: "qualified",
      last_error: "Waiting for both drivers to finish Stripe payout setup"
    }).eq("id", referral.id);
    return;
  }
  try {
    const referrerTransfer = referral.referrer_transfer_id || await payConnectBonus({
      connectAccountId: referrerAcct,
      amountCents: REFERRAL_REWARD_CENTS,
      userId: referral.referrer_id,
      referralId: referral.id,
      role: "referrer"
    });
    const referredTransfer = referral.referred_transfer_id || await payConnectBonus({
      connectAccountId: referredAcct,
      amountCents: REFERRAL_REWARD_CENTS,
      userId: referral.referred_id,
      referralId: referral.id,
      role: "referred"
    });
    await supabaseAdmin.from("driver_referrals").update({
      status: "paid",
      referrer_transfer_id: referrerTransfer,
      referred_transfer_id: referredTransfer,
      paid_at: (/* @__PURE__ */ new Date()).toISOString(),
      last_error: null,
      deliveries_completed: deliveries
    }).eq("id", referral.id);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[referral] payout failed", msg);
    await supabaseAdmin.from("driver_referrals").update({
      status: "failed",
      last_error: msg.slice(0, 400)
    }).eq("id", referral.id);
  }
}
export {
  REFERRAL_DELIVERY_GOAL,
  REFERRAL_REWARD_CENTS,
  attachDriverReferrer,
  getDriverReferralStats,
  maybeCompleteDriverReferral
};
