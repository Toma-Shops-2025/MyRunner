import { c as createSsrRpc } from "./createSsrRpc-xYjLf7RI.mjs";
import { c as createServerFn } from "./server-pkl-8gUD.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CMwi6y2l.mjs";
import { o as objectType, s as stringType, a as arrayType, n as numberType, e as enumType } from "../_libs/zod.mjs";
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
const createOrder = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => createOrderInput.parse(d)).handler(createSsrRpc("007e4e915d0f2bb0adeff3f4ba514dea8e2a5b5b4f81f74abf55e7a24731f494"));
const sendMessageInput = objectType({
  orderId: stringType().uuid(),
  body: stringType().min(1).max(2e3)
});
const sendOrderMessage = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => sendMessageInput.parse(d)).handler(createSsrRpc("065cf83c7b3c8a4d96e433c788b9eecb01d3cfd339cfd8a561bb715930f306ec"));
export {
  createOrder as c,
  sendOrderMessage as s
};
