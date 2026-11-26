import { c as createServerRpc } from "./createServerRpc-C3IsetnU.mjs";
import { c as createServerFn } from "./server-pkl-8gUD.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CMwi6y2l.mjs";
import { r as routeDriverShareForOrder } from "./route-driver-share.server-Ib9vmS0S.mjs";
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
import "./stripe-payout.server-BMP7bU7B.mjs";
import "events";
import "http";
import "https";
import "os";
const OFFER_TIMEOUT_SECONDS = 45;
const MAX_ATTEMPTS = 5;
const FALLBACK_AFTER_MINUTES = 4;
const RADIUS_TIERS_MI = [5, 10, 15];
function pickRadius(attempt) {
  if (attempt <= 1) return RADIUS_TIERS_MI[0];
  if (attempt <= 3) return RADIUS_TIERS_MI[1];
  return RADIUS_TIERS_MI[2];
}
async function dispatchOrderInternal(orderId) {
  const {
    supabaseAdmin
  } = await import("./client.server-D5ro3rAQ.mjs");
  const {
    data: order
  } = await supabaseAdmin.from("orders").select("id, customer_id, dispatch_attempts, dispatch_status, pickup_lat, pickup_lng, driver_id, payment_status, status, created_at").eq("id", orderId).maybeSingle();
  if (!order) return {
    ok: false,
    reason: "order_not_found"
  };
  if (order.driver_id) return {
    ok: false,
    reason: "already_assigned"
  };
  if (order.payment_status !== "paid") return {
    ok: false,
    reason: "not_paid"
  };
  if (order.dispatch_status === "fallback_pool") return {
    ok: false,
    reason: "in_fallback"
  };
  const attempt = (order.dispatch_attempts ?? 0) + 1;
  const ageMs = Date.now() - new Date(order.created_at).getTime();
  if (attempt > MAX_ATTEMPTS || ageMs > FALLBACK_AFTER_MINUTES * 6e4) {
    await supabaseAdmin.from("orders").update({
      dispatch_status: "fallback_pool"
    }).eq("id", orderId);
    return {
      ok: false,
      reason: "fallback_pool"
    };
  }
  const {
    data: priorOffers
  } = await supabaseAdmin.from("offers").select("driver_id").eq("order_id", orderId);
  const seen = new Set((priorOffers ?? []).map((o) => o.driver_id));
  const blocked = /* @__PURE__ */ new Set();
  const preferred = /* @__PURE__ */ new Set();
  if (order.customer_id) {
    const {
      data: prefs
    } = await supabaseAdmin.from("driver_preferences").select("driver_id, preference").eq("customer_id", order.customer_id);
    for (const p of prefs ?? []) {
      if (p.preference === "blocked") blocked.add(p.driver_id);
      if (p.preference === "preferred") preferred.add(p.driver_id);
    }
  }
  const radius = pickRadius(attempt);
  const {
    data: candidates
  } = await supabaseAdmin.from("profiles").select("id, current_lat, current_lng").eq("driver_status", "online").eq("is_active", true).eq("payouts_enabled", true).neq("background_check_status", "failed");
  if (!candidates || candidates.length === 0) {
    await supabaseAdmin.from("orders").update({
      dispatch_status: "queued",
      last_dispatched_at: (/* @__PURE__ */ new Date()).toISOString()
    }).eq("id", orderId);
    return {
      ok: false,
      reason: "no_drivers_online"
    };
  }
  const pLat = order.pickup_lat;
  const pLng = order.pickup_lng;
  const eligible = candidates.filter((c) => !seen.has(c.id) && !blocked.has(c.id)).map((c) => {
    let distance = Number.POSITIVE_INFINITY;
    if (pLat != null && pLng != null && c.current_lat != null && c.current_lng != null) {
      const toRad = (d) => d * Math.PI / 180;
      const dLat = toRad(Number(c.current_lat) - Number(pLat));
      const dLng = toRad(Number(c.current_lng) - Number(pLng));
      const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(Number(pLat))) * Math.cos(toRad(Number(c.current_lat))) * Math.sin(dLng / 2) ** 2;
      distance = 3959 * 2 * Math.asin(Math.sqrt(a));
    }
    return {
      ...c,
      distance
    };
  }).filter((c) => c.distance === Number.POSITIVE_INFINITY || c.distance <= radius).sort((a, b) => {
    const ap = preferred.has(a.id) ? 0 : 1;
    const bp = preferred.has(b.id) ? 0 : 1;
    if (ap !== bp) return ap - bp;
    return a.distance - b.distance;
  });
  if (eligible.length === 0) {
    await supabaseAdmin.from("orders").update({
      dispatch_status: "queued",
      last_dispatched_at: (/* @__PURE__ */ new Date()).toISOString()
    }).eq("id", orderId);
    return {
      ok: false,
      reason: "no_drivers_in_radius"
    };
  }
  const candIds = eligible.map((c) => c.id);
  const {
    data: busy
  } = await supabaseAdmin.from("orders").select("driver_id").in("driver_id", candIds).in("status", ["accepted", "picked_up", "in_transit"]);
  const busySet = new Set((busy ?? []).map((b) => b.driver_id));
  const next = eligible.find((c) => !busySet.has(c.id));
  if (!next) {
    await supabaseAdmin.from("orders").update({
      dispatch_status: "queued",
      last_dispatched_at: (/* @__PURE__ */ new Date()).toISOString()
    }).eq("id", orderId);
    return {
      ok: false,
      reason: "all_busy"
    };
  }
  const expiresAt = new Date(Date.now() + OFFER_TIMEOUT_SECONDS * 1e3).toISOString();
  const {
    error: offerErr
  } = await supabaseAdmin.from("offers").insert({
    order_id: orderId,
    driver_id: next.id,
    expires_at: expiresAt,
    attempt_number: attempt,
    status: "pending"
  });
  if (offerErr) return {
    ok: false,
    reason: offerErr.message
  };
  await supabaseAdmin.from("orders").update({
    dispatch_status: "offered",
    dispatch_attempts: attempt,
    last_dispatched_at: (/* @__PURE__ */ new Date()).toISOString()
  }).eq("id", orderId);
  return {
    ok: true
  };
}
const dispatchOrder_createServerFn_handler = createServerRpc({
  id: "e35f650e73dce0dd2cfd64dcc2349fcbd818102306d1fcb44ea7c9682af56bbf",
  name: "dispatchOrder",
  filename: "src/lib/dispatch.functions.ts"
}, (opts) => dispatchOrder.__executeServer(opts));
const dispatchOrder = createServerFn({
  method: "POST"
}).inputValidator((d) => d).handler(dispatchOrder_createServerFn_handler, async ({
  data
}) => dispatchOrderInternal(data.orderId));
const acceptOffer_createServerFn_handler = createServerRpc({
  id: "cd00e8864ffdfbda6361a4251d5654b28297f8da483bda28cda04f2a0e647c2e",
  name: "acceptOffer",
  filename: "src/lib/dispatch.functions.ts"
}, (opts) => acceptOffer.__executeServer(opts));
const acceptOffer = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => d).handler(acceptOffer_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabaseAdmin
  } = await import("./client.server-D5ro3rAQ.mjs");
  const {
    data: offer
  } = await supabaseAdmin.from("offers").select("id, order_id, driver_id, status, expires_at").eq("id", data.offerId).maybeSingle();
  if (!offer) throw new Error("Offer not found");
  if (offer.driver_id !== context.userId) throw new Error("Not your offer");
  if (offer.status !== "pending") throw new Error("Offer is no longer available");
  if (new Date(offer.expires_at).getTime() < Date.now()) throw new Error("Offer expired");
  const {
    data: claimed,
    error: claimErr
  } = await supabaseAdmin.from("orders").update({
    driver_id: context.userId,
    status: "accepted",
    dispatch_status: "assigned"
  }).eq("id", offer.order_id).is("driver_id", null).select("id").maybeSingle();
  if (claimErr || !claimed) {
    await supabaseAdmin.from("offers").update({
      status: "expired"
    }).eq("id", offer.id);
    throw new Error("Order was already claimed");
  }
  await supabaseAdmin.from("offers").update({
    status: "accepted"
  }).eq("id", offer.id);
  await supabaseAdmin.from("offers").update({
    status: "expired"
  }).eq("order_id", offer.order_id).eq("status", "pending");
  await supabaseAdmin.from("profiles").update({
    driver_status: "on_delivery"
  }).eq("id", context.userId);
  const routed = await routeDriverShareForOrder(supabaseAdmin, offer.order_id);
  if ("error" in routed) {
    console.warn("[acceptOffer] route driver share:", routed.error);
  }
  return {
    ok: true,
    orderId: offer.order_id
  };
});
const declineOffer_createServerFn_handler = createServerRpc({
  id: "667bcc7bf65430d37adb6df782a5368d1bcde1f9ec41e7d5d05c09f4fe756d80",
  name: "declineOffer",
  filename: "src/lib/dispatch.functions.ts"
}, (opts) => declineOffer.__executeServer(opts));
const declineOffer = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => d).handler(declineOffer_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabaseAdmin
  } = await import("./client.server-D5ro3rAQ.mjs");
  const {
    data: offer
  } = await supabaseAdmin.from("offers").select("id, order_id, driver_id, status").eq("id", data.offerId).maybeSingle();
  if (!offer || offer.driver_id !== context.userId) throw new Error("Not your offer");
  if (offer.status !== "pending") return {
    ok: true
  };
  await supabaseAdmin.from("offers").update({
    status: "declined"
  }).eq("id", offer.id);
  await dispatchOrderInternal(offer.order_id);
  return {
    ok: true
  };
});
const reassignExpired_createServerFn_handler = createServerRpc({
  id: "566e1e1a14460ca7d48922f53684228e5f66ccbc7f8af58bd4378b46592fe75a",
  name: "reassignExpired",
  filename: "src/lib/dispatch.functions.ts"
}, (opts) => reassignExpired.__executeServer(opts));
const reassignExpired = createServerFn({
  method: "POST"
}).handler(reassignExpired_createServerFn_handler, async () => {
  const {
    supabaseAdmin
  } = await import("./client.server-D5ro3rAQ.mjs");
  const nowIso = (/* @__PURE__ */ new Date()).toISOString();
  const {
    data: expired
  } = await supabaseAdmin.from("offers").update({
    status: "expired"
  }).eq("status", "pending").lt("expires_at", nowIso).select("order_id");
  const expiredOrderIds = Array.from(new Set((expired ?? []).map((e) => e.order_id)));
  const {
    data: queued
  } = await supabaseAdmin.from("orders").select("id").eq("dispatch_status", "queued").eq("payment_status", "paid").is("driver_id", null).limit(50);
  const queuedIds = (queued ?? []).map((q) => q.id);
  const toDispatch = Array.from(/* @__PURE__ */ new Set([...expiredOrderIds, ...queuedIds]));
  let dispatched = 0;
  for (const id of toDispatch) {
    const res = await dispatchOrderInternal(id);
    if (res.ok) dispatched++;
  }
  return {
    processed: toDispatch.length,
    dispatched
  };
});
const setDriverPresence_createServerFn_handler = createServerRpc({
  id: "8764abbbf0d0b0490badae9e5c4926fd4710c2a8b5f2c0aaac29ccb5bc3e17e0",
  name: "setDriverPresence",
  filename: "src/lib/dispatch.functions.ts"
}, (opts) => setDriverPresence.__executeServer(opts));
const setDriverPresence = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => d).handler(setDriverPresence_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabaseAdmin
  } = await import("./client.server-D5ro3rAQ.mjs");
  const {
    error: statusErr
  } = await supabaseAdmin.from("profiles").update({
    driver_status: data.status
  }).eq("id", context.userId);
  if (statusErr) throw new Error(statusErr.message);
  if (data.lat != null && data.lng != null) {
    const {
      error: locErr
    } = await supabaseAdmin.from("profiles").update({
      current_lat: data.lat,
      current_lng: data.lng,
      location_updated_at: (/* @__PURE__ */ new Date()).toISOString()
    }).eq("id", context.userId);
    if (locErr) {
      console.warn("[setDriverPresence] location update skipped:", locErr.message);
    }
  }
  if (data.status === "online") {
    try {
      const {
        data: queued
      } = await supabaseAdmin.from("orders").select("id").eq("payment_status", "paid").is("driver_id", null).in("dispatch_status", ["queued", "offered"]).limit(25);
      for (const row of queued ?? []) {
        await dispatchOrderInternal(row.id);
      }
    } catch (e) {
      console.warn("[setDriverPresence] dispatch on online failed:", e);
    }
  }
  return {
    ok: true
  };
});
const claimOpenOrder_createServerFn_handler = createServerRpc({
  id: "44d6ac838f81435a9546fc4eaeee1ae5d27a756e329561af2bbd2314787faab3",
  name: "claimOpenOrder",
  filename: "src/lib/dispatch.functions.ts"
}, (opts) => claimOpenOrder.__executeServer(opts));
const claimOpenOrder = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => d).handler(claimOpenOrder_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabaseAdmin
  } = await import("./client.server-D5ro3rAQ.mjs");
  const {
    data: profile
  } = await supabaseAdmin.from("profiles").select("payouts_enabled, is_active, background_check_status").eq("id", context.userId).maybeSingle();
  if (!profile?.payouts_enabled) throw new Error("Finish Stripe payout setup before accepting orders.");
  if (profile.background_check_status === "failed" || profile.is_active === false) {
    throw new Error("Your account is deactivated. Contact support.");
  }
  const {
    data: claimed,
    error
  } = await supabaseAdmin.from("orders").update({
    driver_id: context.userId,
    status: "accepted",
    dispatch_status: "assigned"
  }).eq("id", data.orderId).is("driver_id", null).eq("payment_status", "paid").select("id, status, driver_id").maybeSingle();
  if (error) throw new Error(error.message);
  if (!claimed) throw new Error("Order was already claimed");
  await supabaseAdmin.from("profiles").update({
    driver_status: "on_delivery"
  }).eq("id", context.userId);
  await supabaseAdmin.from("offers").update({
    status: "expired"
  }).eq("order_id", data.orderId).eq("status", "pending");
  const routed = await routeDriverShareForOrder(supabaseAdmin, claimed.id);
  if ("error" in routed) {
    console.warn("[claimOpenOrder] route driver share:", routed.error);
  }
  return {
    ok: true,
    orderId: claimed.id
  };
});
const advanceDriverOrder_createServerFn_handler = createServerRpc({
  id: "7607384eeaf055e1429e3e63267dec15b0128aacad19ae40f3ee95e281480885",
  name: "advanceDriverOrder",
  filename: "src/lib/dispatch.functions.ts"
}, (opts) => advanceDriverOrder.__executeServer(opts));
const advanceDriverOrder = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => d).handler(advanceDriverOrder_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabaseAdmin
  } = await import("./client.server-D5ro3rAQ.mjs");
  const {
    data: order
  } = await supabaseAdmin.from("orders").select("id, driver_id, status").eq("id", data.orderId).maybeSingle();
  if (!order) throw new Error("Order not found");
  if (String(order.driver_id) !== String(context.userId)) throw new Error("Not your order");
  const patch = {
    status: data.status
  };
  if (data.proofPhotoUrl != null) patch.proof_photo_url = data.proofPhotoUrl;
  if (data.deliveredAt != null) patch.delivered_at = data.deliveredAt;
  if (data.status === "delivered") {
    patch.delivered_at = data.deliveredAt ?? (/* @__PURE__ */ new Date()).toISOString();
  }
  const {
    error
  } = await supabaseAdmin.from("orders").update(patch).eq("id", data.orderId);
  if (error) throw new Error(error.message);
  if (data.status === "delivered") {
    await supabaseAdmin.from("profiles").update({
      driver_status: "online"
    }).eq("id", context.userId);
    try {
      const {
        maybeCompleteDriverReferral
      } = await import("./referral.functions-BOR-6JNb.mjs");
      await maybeCompleteDriverReferral(context.userId);
    } catch (e) {
      console.warn("[advanceDriverOrder] referral check:", e);
    }
  }
  return {
    ok: true
  };
});
export {
  acceptOffer_createServerFn_handler,
  advanceDriverOrder_createServerFn_handler,
  claimOpenOrder_createServerFn_handler,
  declineOffer_createServerFn_handler,
  dispatchOrder_createServerFn_handler,
  reassignExpired_createServerFn_handler,
  setDriverPresence_createServerFn_handler
};
