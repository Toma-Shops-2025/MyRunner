import { c as createServerRpc } from "./createServerRpc-ClhbRJjc.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-pF3e_tkz.mjs";
import { c as createStripeClient, g as getStripeEnv, a as getStripeErrorMessage } from "./stripe.server-h1CGUd7G.mjs";
import { c as createServerFn } from "./server-DWRkkZvt.mjs";
import "../_libs/stripe.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as objectType, s as stringType } from "../_libs/zod.mjs";
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
import "events";
import "http";
import "https";
import "os";
const APP_URL = process.env.PUBLIC_APP_URL ?? "https://myrunner.shop";
const createConnectAccount_createServerFn_handler = createServerRpc({
  id: "85b7a3174a7c86ada231dfad8b07c7d29473fdd542762a1ff77cf462ff998f4e",
  name: "createConnectAccount",
  filename: "src/lib/connect.functions.ts"
}, (opts) => createConnectAccount.__executeServer(opts));
const createConnectAccount = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).handler(createConnectAccount_createServerFn_handler, async ({
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  const {
    data: profile
  } = await supabase.from("profiles").select("stripe_connect_account_id, email, full_name").eq("id", userId).single();
  if (profile?.stripe_connect_account_id) {
    return {
      accountId: profile.stripe_connect_account_id
    };
  }
  try {
    const stripe = createStripeClient(getStripeEnv());
    const publicUrl = `${APP_URL}/r/${userId}`;
    const account = await stripe.accounts.create({
      type: "express",
      country: "US",
      email: profile?.email ?? void 0,
      capabilities: {
        transfers: {
          requested: true
        },
        card_payments: {
          requested: true
        }
      },
      business_type: "individual",
      business_profile: {
        name: profile?.full_name ?? "MyRunner Independent Runner",
        url: publicUrl,
        product_description: "Independent contractor delivery driver for MyRunner — on-demand pickup and delivery of groceries, food, pharmacy and last-minute errands.",
        support_email: profile?.email ?? void 0,
        mcc: "4214"
      },
      metadata: {
        user_id: userId,
        public_url: publicUrl
      }
    });
    await supabase.from("profiles").update({
      stripe_connect_account_id: account.id
    }).eq("id", userId);
    return {
      accountId: account.id
    };
  } catch (e) {
    return {
      error: getStripeErrorMessage(e)
    };
  }
});
const createOnboardingLink_createServerFn_handler = createServerRpc({
  id: "f7b87ff48da9e21892a6b685a794e2c6e6f21cf6f7e32912ee9ce0f4769af37b",
  name: "createOnboardingLink",
  filename: "src/lib/connect.functions.ts"
}, (opts) => createOnboardingLink.__executeServer(opts));
const createOnboardingLink = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).handler(createOnboardingLink_createServerFn_handler, async ({
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  const {
    data: profile
  } = await supabase.from("profiles").select("stripe_connect_account_id").eq("id", userId).single();
  if (!profile?.stripe_connect_account_id) {
    return {
      error: "No Connect account yet. Click Set up payouts first."
    };
  }
  try {
    const stripe = createStripeClient(getStripeEnv());
    const link = await stripe.accountLinks.create({
      account: profile.stripe_connect_account_id,
      refresh_url: `${APP_URL}/driver/earnings?refresh=1`,
      return_url: `${APP_URL}/driver/earnings?onboarded=1`,
      type: "account_onboarding"
    });
    return {
      url: link.url
    };
  } catch (e) {
    return {
      error: getStripeErrorMessage(e)
    };
  }
});
const refreshAccountStatus_createServerFn_handler = createServerRpc({
  id: "82bd273ab0a0d3c84f260e47dbb167e8f59003492349ddb51f392b9f1da82248",
  name: "refreshAccountStatus",
  filename: "src/lib/connect.functions.ts"
}, (opts) => refreshAccountStatus.__executeServer(opts));
const refreshAccountStatus = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).handler(refreshAccountStatus_createServerFn_handler, async ({
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  const {
    data: profile
  } = await supabase.from("profiles").select("stripe_connect_account_id, payouts_enabled").eq("id", userId).single();
  if (!profile?.stripe_connect_account_id) {
    return {
      payoutsEnabled: false
    };
  }
  try {
    const stripe = createStripeClient(getStripeEnv());
    const account = await stripe.accounts.retrieve(profile.stripe_connect_account_id);
    const payoutsEnabled = Boolean(account.payouts_enabled && account.charges_enabled);
    const expectedUrl = `${APP_URL}/r/${userId}`;
    const isDemo = profile.stripe_connect_account_id.startsWith("acct_demo");
    if (!isDemo && account.business_profile?.url !== expectedUrl) {
      try {
        await stripe.accounts.update(profile.stripe_connect_account_id, {
          business_profile: {
            url: expectedUrl
          }
        });
      } catch (e) {
        console.error("[connect] failed to backfill business_profile.url", e);
      }
    }
    await supabase.from("profiles").update({
      payouts_enabled: payoutsEnabled,
      onboarding_completed_at: payoutsEnabled && !profile.payouts_enabled ? (/* @__PURE__ */ new Date()).toISOString() : void 0
    }).eq("id", userId);
    return {
      payoutsEnabled,
      detailsSubmitted: account.details_submitted,
      requirementsDue: account.requirements?.currently_due ?? []
    };
  } catch (e) {
    return {
      error: getStripeErrorMessage(e)
    };
  }
});
const createDashboardLink_createServerFn_handler = createServerRpc({
  id: "b58094d7b8ec6f8db051111ee0bf59fbf0e777e711c59501395a6a0d268ccef3",
  name: "createDashboardLink",
  filename: "src/lib/connect.functions.ts"
}, (opts) => createDashboardLink.__executeServer(opts));
const createDashboardLink = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).handler(createDashboardLink_createServerFn_handler, async ({
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  const {
    data: profile
  } = await supabase.from("profiles").select("stripe_connect_account_id").eq("id", userId).single();
  if (!profile?.stripe_connect_account_id) {
    return {
      error: "Complete onboarding first."
    };
  }
  try {
    const stripe = createStripeClient(getStripeEnv());
    const link = await stripe.accounts.createLoginLink(profile.stripe_connect_account_id);
    return {
      url: link.url
    };
  } catch (e) {
    return {
      error: getStripeErrorMessage(e)
    };
  }
});
const payoutInput = objectType({
  orderId: stringType().uuid()
});
const payoutDriverForOrder_createServerFn_handler = createServerRpc({
  id: "570058cf6b0042e8fa6a4e0d848e7d53166e4183449f5f325065fa98e3ee485c",
  name: "payoutDriverForOrder",
  filename: "src/lib/connect.functions.ts"
}, (opts) => payoutDriverForOrder.__executeServer(opts));
const payoutDriverForOrder = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => payoutInput.parse(d)).handler(payoutDriverForOrder_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  const {
    data: order,
    error: orderErr
  } = await supabase.from("orders").select("id, driver_id, price_cents, tip_cents, payment_status, status, payout_status, stripe_transfer_id").eq("id", data.orderId).single();
  if (orderErr || !order) return {
    error: "Order not found"
  };
  if (order.driver_id !== userId) {
    const {
      data: isAdmin
    } = await supabase.rpc("has_role", {
      _user_id: userId,
      _role: "admin"
    });
    if (!isAdmin) return {
      error: "Not authorized"
    };
  }
  if (order.payment_status !== "paid") return {
    error: "Order is not paid yet"
  };
  if (order.status !== "delivered") return {
    error: "Order is not delivered yet"
  };
  if (order.payout_status === "paid" || order.stripe_transfer_id) {
    return {
      ok: true,
      alreadyPaid: true
    };
  }
  if (!order.driver_id) return {
    error: "No driver assigned"
  };
  const {
    data: driverProfile
  } = await supabase.from("profiles").select("stripe_connect_account_id, payouts_enabled").eq("id", order.driver_id).single();
  if (!driverProfile?.stripe_connect_account_id || !driverProfile.payouts_enabled) {
    await supabase.from("orders").update({
      payout_status: "blocked_no_account"
    }).eq("id", order.id);
    return {
      error: "Driver has not completed payout onboarding"
    };
  }
  const feeShare = Math.round(order.price_cents * 0.7);
  const platformFee = order.price_cents - feeShare;
  const driverTotal = feeShare + order.tip_cents;
  if (driverProfile.stripe_connect_account_id.startsWith("acct_demo")) {
    await Promise.all([supabase.from("orders").update({
      driver_payout_cents: driverTotal,
      platform_fee_cents: platformFee,
      stripe_transfer_id: "tr_demo",
      payout_status: "paid",
      paid_out_at: (/* @__PURE__ */ new Date()).toISOString()
    }).eq("id", order.id), supabase.from("driver_payouts").insert({
      driver_id: order.driver_id,
      order_id: order.id,
      amount_cents: driverTotal,
      tip_cents: order.tip_cents,
      fee_share_cents: feeShare,
      stripe_transfer_id: "tr_demo",
      status: "paid"
    })]);
    return {
      ok: true,
      amount: driverTotal,
      transferId: "tr_demo",
      demo: true
    };
  }
  try {
    const stripe = createStripeClient(getStripeEnv());
    const transfer = await stripe.transfers.create({
      amount: driverTotal,
      currency: "usd",
      destination: driverProfile.stripe_connect_account_id,
      transfer_group: order.id,
      description: `MyRunner delivery payout · order ${order.id.slice(0, 8)}`,
      metadata: {
        order_id: order.id,
        driver_id: order.driver_id
      }
    }, {
      idempotencyKey: `payout-${order.id}`
    });
    await Promise.all([supabase.from("orders").update({
      driver_payout_cents: driverTotal,
      platform_fee_cents: platformFee,
      stripe_transfer_id: transfer.id,
      payout_status: "paid",
      paid_out_at: (/* @__PURE__ */ new Date()).toISOString()
    }).eq("id", order.id), supabase.from("driver_payouts").insert({
      driver_id: order.driver_id,
      order_id: order.id,
      amount_cents: driverTotal,
      tip_cents: order.tip_cents,
      fee_share_cents: feeShare,
      stripe_transfer_id: transfer.id,
      status: "paid"
    })]);
    return {
      ok: true,
      amount: driverTotal,
      transferId: transfer.id
    };
  } catch (e) {
    const msg = getStripeErrorMessage(e);
    await supabase.from("orders").update({
      payout_status: "failed"
    }).eq("id", order.id);
    await supabase.from("driver_payouts").insert({
      driver_id: order.driver_id,
      order_id: order.id,
      amount_cents: driverTotal,
      tip_cents: order.tip_cents,
      fee_share_cents: feeShare,
      status: "failed",
      error_message: msg
    });
    return {
      error: msg
    };
  }
});
export {
  createConnectAccount_createServerFn_handler,
  createDashboardLink_createServerFn_handler,
  createOnboardingLink_createServerFn_handler,
  payoutDriverForOrder_createServerFn_handler,
  refreshAccountStatus_createServerFn_handler
};
