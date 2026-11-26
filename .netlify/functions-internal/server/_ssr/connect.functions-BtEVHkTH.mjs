import { c as createServerRpc } from "./createServerRpc-C3IsetnU.mjs";
import { c as createServerFn } from "./server-pkl-8gUD.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CMwi6y2l.mjs";
import { c as createStripeClient, g as getStripeEnv, a as getStripeErrorMessage, i as isDriverConnectReady } from "./stripe-payout.server-BMP7bU7B.mjs";
import { r as routeDriverShareForOrder } from "./route-driver-share.server-Ib9vmS0S.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import "../_libs/stripe.mjs";
import { o as objectType, s as stringType } from "../_libs/zod.mjs";
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
    supabaseAdmin
  } = await import("./client.server-D5ro3rAQ.mjs");
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
    const {
      error: updErr
    } = await supabaseAdmin.from("profiles").update({
      stripe_connect_account_id: account.id
    }).eq("id", userId);
    if (updErr) return {
      error: updErr.message
    };
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
      refresh_url: `${APP_URL}/driver/dashboard?refresh=1`,
      return_url: `${APP_URL}/driver/dashboard?onboarded=1`,
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
    supabaseAdmin
  } = await import("./client.server-D5ro3rAQ.mjs");
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
    const payoutsEnabled = isDriverConnectReady(account);
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
    const {
      error: updErr
    } = await supabaseAdmin.from("profiles").update({
      payouts_enabled: payoutsEnabled
    }).eq("id", userId);
    if (updErr) return {
      error: updErr.message
    };
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
    userId
  } = context;
  const {
    supabaseAdmin
  } = await import("./client.server-D5ro3rAQ.mjs");
  const {
    data: order,
    error: orderErr
  } = await supabaseAdmin.from("orders").select("id, driver_id, status, payout_status, stripe_transfer_id").eq("id", data.orderId).single();
  if (orderErr || !order) return {
    error: "Order not found"
  };
  if (String(order.driver_id) !== String(userId)) {
    const {
      data: role
    } = await supabaseAdmin.from("user_roles").select("role").eq("user_id", userId).eq("role", "admin").maybeSingle();
    if (!role) return {
      error: "Not authorized"
    };
  }
  if (order.status !== "delivered") return {
    error: "Order is not delivered yet"
  };
  if (order.payout_status === "paid" || order.stripe_transfer_id) {
    return {
      ok: true,
      alreadyPaid: true
    };
  }
  const result = await routeDriverShareForOrder(supabaseAdmin, data.orderId);
  if ("error" in result) return {
    error: result.error
  };
  return {
    ok: true,
    alreadyPaid: result.alreadyPaid,
    amount: result.amount
  };
});
export {
  createConnectAccount_createServerFn_handler,
  createDashboardLink_createServerFn_handler,
  createOnboardingLink_createServerFn_handler,
  payoutDriverForOrder_createServerFn_handler,
  refreshAccountStatus_createServerFn_handler
};
