import { c as createServerRpc } from "./createServerRpc-C3IsetnU.mjs";
import { c as createServerFn } from "./server-pkl-8gUD.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CMwi6y2l.mjs";
import { g as getStripeEnv, c as createStripeClient, a as getStripeErrorMessage, p as paymentIntentIdFromSession, r as resolvePaymentIntentId } from "./stripe-payout.server-BMP7bU7B.mjs";
import { dispatchOrderInternal } from "./dispatch.functions-CDAFMReD.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import "../_libs/stripe.mjs";
import { o as objectType, s as stringType, n as numberType } from "../_libs/zod.mjs";
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
import "./createSsrRpc-xYjLf7RI.mjs";
import "events";
import "http";
import "https";
import "os";
const input = objectType({
  orderId: stringType().uuid()
});
const createCheckoutSession_createServerFn_handler = createServerRpc({
  id: "d4c55b7671b63819bd87bbdf9e310bb3ae4dd819ffb7a4c2f6959543bfe84a45",
  name: "createCheckoutSession",
  filename: "src/lib/checkout.functions.ts"
}, (opts) => createCheckoutSession.__executeServer(opts));
const createCheckoutSession = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => input.parse(d)).handler(createCheckoutSession_createServerFn_handler, async ({
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
    error
  } = await supabaseAdmin.from("orders").select("id, customer_id, item_description, price_cents, tip_cents, payment_status").eq("id", data.orderId).single();
  if (error || !order) return {
    error: "Order not found"
  };
  if (order.customer_id !== userId) return {
    error: "Not authorized"
  };
  if (order.payment_status === "paid") return {
    error: "Order is already paid"
  };
  try {
    const stripeEnv = getStripeEnv();
    const stripe = createStripeClient(stripeEnv);
    const origin = process.env.PUBLIC_APP_URL ?? "https://myrunner.shop";
    const total = order.price_cents + order.tip_cents;
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{
        price_data: {
          currency: "usd",
          unit_amount: total,
          product_data: {
            name: `MyRunner delivery — ${order.item_description.slice(0, 80)}`
          }
        },
        quantity: 1
      }],
      success_url: `${origin}/app/orders/${order.id}?paid=1`,
      cancel_url: `${origin}/app/orders/${order.id}?cancelled=1`,
      payment_intent_data: {
        description: "MyRunner Delivery",
        capture_method: "manual",
        metadata: {
          order_id: order.id
        }
      },
      metadata: {
        order_id: order.id,
        env: stripeEnv
      }
    });
    await supabaseAdmin.from("orders").update({
      stripe_session_id: session.id
    }).eq("id", order.id);
    return {
      url: session.url
    };
  } catch (e) {
    console.error("createCheckoutSession failed:", e);
    return {
      error: getStripeErrorMessage(e)
    };
  }
});
const confirmOrderPayment_createServerFn_handler = createServerRpc({
  id: "903c941aa88b1ff23baddcc7866940a343f7a4a6869af785b8c1d25fa889e434",
  name: "confirmOrderPayment",
  filename: "src/lib/checkout.functions.ts"
}, (opts) => confirmOrderPayment.__executeServer(opts));
const confirmOrderPayment = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
  orderId: stringType().uuid()
}).parse(d)).handler(confirmOrderPayment_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabaseAdmin
  } = await import("./client.server-D5ro3rAQ.mjs");
  const {
    data: order,
    error
  } = await supabaseAdmin.from("orders").select("id, customer_id, payment_status, stripe_session_id, driver_id").eq("id", data.orderId).single();
  if (error || !order) return {
    error: "Order not found"
  };
  if (order.customer_id !== context.userId) return {
    error: "Not authorized"
  };
  if (order.payment_status === "paid") {
    if (!order.driver_id) await dispatchOrderInternal(order.id);
    return {
      ok: true,
      alreadyPaid: true
    };
  }
  if (!order.stripe_session_id) return {
    error: "No checkout session on this order"
  };
  try {
    const stripe = createStripeClient(getStripeEnv());
    const session = await stripe.checkout.sessions.retrieve(order.stripe_session_id, {
      expand: ["payment_intent"]
    });
    const piId = paymentIntentIdFromSession(session) ?? await resolvePaymentIntentId(stripe, order.stripe_session_id);
    const piStatus = typeof session.payment_intent === "object" && session.payment_intent ? session.payment_intent.status : piId ? (await stripe.paymentIntents.retrieve(piId)).status : null;
    const authorized = session.payment_status === "paid" || piStatus === "requires_capture" || piStatus === "succeeded";
    if (!authorized) {
      return {
        error: "Payment has not completed yet"
      };
    }
    await supabaseAdmin.from("orders").update({
      payment_status: "paid",
      paid_at: (/* @__PURE__ */ new Date()).toISOString(),
      stripe_payment_intent_id: piId
    }).eq("id", order.id);
    await dispatchOrderInternal(order.id);
    return {
      ok: true
    };
  } catch (e) {
    console.error("confirmOrderPayment failed:", e);
    return {
      error: getStripeErrorMessage(e)
    };
  }
});
const tipInput = objectType({
  orderId: stringType().uuid(),
  tipCents: numberType().int().min(100).max(5e4)
});
const createTipCheckoutSession_createServerFn_handler = createServerRpc({
  id: "670a0e5a54b79c4516b09ebcb01cdaf4248647876535eab9ee0ad8e49b1cad42",
  name: "createTipCheckoutSession",
  filename: "src/lib/checkout.functions.ts"
}, (opts) => createTipCheckoutSession.__executeServer(opts));
const createTipCheckoutSession = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => tipInput.parse(d)).handler(createTipCheckoutSession_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  const {
    data: order,
    error
  } = await supabase.from("orders").select("id, customer_id, driver_id, status, item_description").eq("id", data.orderId).single();
  if (error || !order) return {
    error: "Order not found"
  };
  if (order.customer_id !== userId) return {
    error: "Not authorized"
  };
  if (order.status !== "delivered") return {
    error: "Order is not delivered yet"
  };
  if (!order.driver_id) return {
    error: "No Runner assigned"
  };
  const {
    data: driverProfile
  } = await supabase.from("profiles").select("stripe_connect_account_id, payouts_enabled").eq("id", order.driver_id).single();
  if (!driverProfile?.stripe_connect_account_id || !driverProfile.payouts_enabled) {
    return {
      error: "Runner has not completed payout setup"
    };
  }
  try {
    const stripeEnv = getStripeEnv();
    const stripe = createStripeClient(stripeEnv);
    const origin = process.env.PUBLIC_APP_URL ?? "https://myrunner.shop";
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{
        price_data: {
          currency: "usd",
          unit_amount: data.tipCents,
          product_data: {
            name: `Tip for your Runner — ${order.item_description.slice(0, 80)}`
          }
        },
        quantity: 1
      }],
      success_url: `${origin}/app/orders/${order.id}?tipped=1`,
      cancel_url: `${origin}/app/orders/${order.id}?tip_cancelled=1`,
      payment_intent_data: {
        description: "MyRunner post-delivery tip",
        transfer_data: {
          destination: driverProfile.stripe_connect_account_id
        }
      },
      metadata: {
        order_id: order.id,
        env: stripeEnv,
        kind: "tip",
        tip_cents: String(data.tipCents)
      }
    });
    return {
      url: session.url
    };
  } catch (e) {
    console.error("createTipCheckoutSession failed:", e);
    return {
      error: getStripeErrorMessage(e)
    };
  }
});
export {
  confirmOrderPayment_createServerFn_handler,
  createCheckoutSession_createServerFn_handler,
  createTipCheckoutSession_createServerFn_handler
};
