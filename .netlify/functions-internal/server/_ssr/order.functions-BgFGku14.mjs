import { c as createServerRpc } from "./createServerRpc-C3IsetnU.mjs";
import { c as createServerFn } from "./server-pkl-8gUD.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CMwi6y2l.mjs";
import { p as priceQuote } from "./pricing-Ci0mfZy0.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as objectType, n as numberType, s as stringType, e as enumType, a as arrayType } from "../_libs/zod.mjs";
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
const stopInput = objectType({
  role: enumType(["pickup", "dropoff"]),
  address: stringType().trim().min(3).max(300),
  lat: numberType().nullable().optional(),
  lng: numberType().nullable().optional()
});
const createOrderInput = objectType({
  pickupAddress: stringType().trim().min(3),
  dropoffAddress: stringType().trim().min(3),
  itemDescription: stringType().min(2),
  type: enumType(["standard", "multi_pickup", "multi_dropoff"]),
  priceCents: numberType().int().min(0),
  tipCents: numberType().int().min(0),
  distanceMiles: numberType().min(1).max(50),
  pickupLat: numberType().nullable().optional(),
  pickupLng: numberType().nullable().optional(),
  extraStops: arrayType(stopInput).max(8).default([])
});
const createOrder_createServerFn_handler = createServerRpc({
  id: "007e4e915d0f2bb0adeff3f4ba514dea8e2a5b5b4f81f74abf55e7a24731f494",
  name: "createOrder",
  filename: "src/lib/order.functions.ts"
}, (opts) => createOrder.__executeServer(opts));
const createOrder = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => createOrderInput.parse(d)).handler(createOrder_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabaseAdmin
  } = await import("./client.server-D5ro3rAQ.mjs");
  const {
    ensureCustomerAccountForOrder
  } = await import("./ensure-customer-account-BJqquFAF.mjs");
  const ensured = await ensureCustomerAccountForOrder(context.userId);
  if (!ensured.ok) return {
    error: ensured.error
  };
  const userId = ensured.userId;
  const extraStops = data.type === "standard" ? [] : data.extraStops.filter((stop) => stop.role === (data.type === "multi_pickup" ? "pickup" : "dropoff"));
  if (data.type !== "standard" && extraStops.length < 1) {
    return {
      error: "Add at least one more address for this delivery type."
    };
  }
  const expectedPrice = priceQuote(data.distanceMiles, extraStops.length);
  if (data.priceCents !== expectedPrice) {
    return {
      error: "The price no longer matches these stops. Review the quote and try again."
    };
  }
  const feeShareCents = Math.round(data.priceCents * 0.7);
  const platformFeeCents = data.priceCents - feeShareCents;
  const {
    data: created,
    error
  } = await supabaseAdmin.from("orders").insert({
    customer_id: userId,
    pickup_address: data.pickupAddress,
    dropoff_address: data.dropoffAddress,
    item_description: data.itemDescription,
    type: data.type,
    price_cents: data.priceCents,
    additional_pickups: extraStops.filter((stop) => stop.role === "pickup").length,
    route_stops: extraStops,
    tip_cents: data.tipCents,
    distance_miles: data.distanceMiles,
    pickup_lat: data.pickupLat ?? null,
    pickup_lng: data.pickupLng ?? null,
    platform_fee_cents: platformFeeCents,
    driver_payout_cents: 0,
    payment_status: "pending",
    dispatch_status: "queued",
    dispatch_attempts: 0
  }).select("id").single();
  if (error || !created) {
    return {
      error: error?.message ?? "Could not create order"
    };
  }
  return {
    orderId: created.id
  };
});
const sendMessageInput = objectType({
  orderId: stringType().uuid(),
  body: stringType().min(1).max(2e3)
});
const sendOrderMessage_createServerFn_handler = createServerRpc({
  id: "065cf83c7b3c8a4d96e433c788b9eecb01d3cfd339cfd8a561bb715930f306ec",
  name: "sendOrderMessage",
  filename: "src/lib/order.functions.ts"
}, (opts) => sendOrderMessage.__executeServer(opts));
const sendOrderMessage = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => sendMessageInput.parse(d)).handler(sendOrderMessage_createServerFn_handler, async ({
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
  } = await supabaseAdmin.from("orders").select("id, customer_id, driver_id").eq("id", data.orderId).maybeSingle();
  if (orderErr || !order) return {
    error: "Order not found"
  };
  const involved = String(order.customer_id) === String(userId) || String(order.driver_id) === String(userId);
  if (!involved) {
    const {
      data: role
    } = await supabaseAdmin.from("user_roles").select("role").eq("user_id", userId).eq("role", "admin").maybeSingle();
    if (!role) return {
      error: "Not authorized"
    };
  }
  const text = data.body.trim();
  const {
    error
  } = await supabaseAdmin.from("order_messages").insert({
    order_id: data.orderId,
    sender_id: userId,
    body: text
  });
  if (error) return {
    error: error.message
  };
  return {
    ok: true
  };
});
export {
  createOrder_createServerFn_handler,
  sendOrderMessage_createServerFn_handler
};
