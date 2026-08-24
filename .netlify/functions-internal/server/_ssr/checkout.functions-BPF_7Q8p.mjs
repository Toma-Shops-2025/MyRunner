import { c as createServerRpc } from "./createServerRpc-ClhbRJjc.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-pF3e_tkz.mjs";
import { g as getStripeEnv, c as createStripeClient, a as getStripeErrorMessage } from "./stripe.server-h1CGUd7G.mjs";
import { c as createServerFn } from "./server-DWRkkZvt.mjs";
import "../_libs/stripe.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as objectType, s as stringType, n as numberType } from "../_libs/zod.mjs";
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
    supabase,
    userId
  } = context;
  const {
    data: order,
    error
  } = await supabase.from("orders").select("id, customer_id, item_description, price_cents, tip_cents, payment_status").eq("id", data.orderId).single();
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
        description: "MyRunner Delivery"
      },
      metadata: {
        order_id: order.id,
        env: stripeEnv
      }
    });
    await supabase.from("orders").update({
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
        description: "MyRunner post-delivery tip"
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
  createCheckoutSession_createServerFn_handler,
  createTipCheckoutSession_createServerFn_handler
};
