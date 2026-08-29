import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const OFFER_TIMEOUT_SECONDS = 45;
const MAX_ATTEMPTS = 5;
const FALLBACK_AFTER_MINUTES = 4;
const RADIUS_TIERS_MI = [5, 10, 15];

function pickRadius(attempt: number): number {
  if (attempt <= 1) return RADIUS_TIERS_MI[0];
  if (attempt <= 3) return RADIUS_TIERS_MI[1];
  return RADIUS_TIERS_MI[2];
}

// Find the nearest eligible online driver and create an exclusive offer.
export async function dispatchOrderInternal(orderId: string): Promise<{ ok: boolean; reason?: string }> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  const { data: order } = await supabaseAdmin
    .from("orders")
    .select("id, dispatch_attempts, dispatch_status, pickup_lat, pickup_lng, driver_id, payment_status, status, created_at")
    .eq("id", orderId)
    .maybeSingle();
  if (!order) return { ok: false, reason: "order_not_found" };
  if (order.driver_id) return { ok: false, reason: "already_assigned" };
  if (order.payment_status !== "paid") return { ok: false, reason: "not_paid" };
  if (order.dispatch_status === "fallback_pool") return { ok: false, reason: "in_fallback" };

  const attempt = (order.dispatch_attempts ?? 0) + 1;

  // Fallback check
  const ageMs = Date.now() - new Date(order.created_at).getTime();
  if (attempt > MAX_ATTEMPTS || ageMs > FALLBACK_AFTER_MINUTES * 60_000) {
    await supabaseAdmin
      .from("orders")
      .update({ dispatch_status: "fallback_pool" })
      .eq("id", orderId);
    return { ok: false, reason: "fallback_pool" };
  }

  // Drivers who already saw this order
  const { data: priorOffers } = await supabaseAdmin
    .from("offers")
    .select("driver_id")
    .eq("order_id", orderId);
  const seen = new Set((priorOffers ?? []).map((o) => o.driver_id));

  const radius = pickRadius(attempt);

  // Eligible candidate drivers
  const { data: candidates } = await supabaseAdmin
    .from("profiles")
    .select("id, current_lat, current_lng")
    .eq("driver_status", "online")
    .eq("is_active", true)
    .eq("payouts_enabled", true)
    .neq("background_check_status", "failed");

  if (!candidates || candidates.length === 0) {
    // No one online — leave queued, cron will re-try
    await supabaseAdmin
      .from("orders")
      .update({ dispatch_status: "queued", last_dispatched_at: new Date().toISOString() })
      .eq("id", orderId);
    return { ok: false, reason: "no_drivers_online" };
  }

  // Pickup coords required for distance; if missing, just pick anyone online
  const pLat = order.pickup_lat;
  const pLng = order.pickup_lng;

  type Cand = { id: string; current_lat: number | null; current_lng: number | null };
  const eligible: Array<Cand & { distance: number }> = (candidates as Cand[])
    .filter((c) => !seen.has(c.id))
    .map((c) => {
      let distance = Number.POSITIVE_INFINITY;
      if (pLat != null && pLng != null && c.current_lat != null && c.current_lng != null) {
        const toRad = (d: number) => (d * Math.PI) / 180;
        const dLat = toRad(Number(c.current_lat) - Number(pLat));
        const dLng = toRad(Number(c.current_lng) - Number(pLng));
        const a =
          Math.sin(dLat / 2) ** 2 +
          Math.cos(toRad(Number(pLat))) *
            Math.cos(toRad(Number(c.current_lat))) *
            Math.sin(dLng / 2) ** 2;
        distance = 3959 * 2 * Math.asin(Math.sqrt(a));
      }
      return { ...c, distance };
    })
    .filter((c) => c.distance === Number.POSITIVE_INFINITY || c.distance <= radius)
    // Exclude drivers currently mid-delivery
    .sort((a, b) => a.distance - b.distance);

  if (eligible.length === 0) {
    await supabaseAdmin
      .from("orders")
      .update({ dispatch_status: "queued", last_dispatched_at: new Date().toISOString() })
      .eq("id", orderId);
    return { ok: false, reason: "no_drivers_in_radius" };
  }

  // Filter out drivers currently on another active order
  const candIds = eligible.map((c) => c.id);
  const { data: busy } = await supabaseAdmin
    .from("orders")
    .select("driver_id")
    .in("driver_id", candIds)
    .in("status", ["accepted", "picked_up", "in_transit"]);
  const busySet = new Set((busy ?? []).map((b) => b.driver_id));
  const next = eligible.find((c) => !busySet.has(c.id));
  if (!next) {
    await supabaseAdmin
      .from("orders")
      .update({ dispatch_status: "queued", last_dispatched_at: new Date().toISOString() })
      .eq("id", orderId);
    return { ok: false, reason: "all_busy" };
  }

  const expiresAt = new Date(Date.now() + OFFER_TIMEOUT_SECONDS * 1000).toISOString();
  const { error: offerErr } = await supabaseAdmin.from("offers").insert({
    order_id: orderId,
    driver_id: next.id,
    expires_at: expiresAt,
    attempt_number: attempt,
    status: "pending",
  });
  if (offerErr) return { ok: false, reason: offerErr.message };

  await supabaseAdmin
    .from("orders")
    .update({
      dispatch_status: "offered",
      dispatch_attempts: attempt,
      last_dispatched_at: new Date().toISOString(),
    })
    .eq("id", orderId);

  return { ok: true };
}

export const dispatchOrder = createServerFn({ method: "POST" })
  .inputValidator((d: { orderId: string }) => d)
  .handler(async ({ data }) => dispatchOrderInternal(data.orderId));

export const acceptOffer = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { offerId: string }) => d)
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: offer } = await supabaseAdmin
      .from("offers")
      .select("id, order_id, driver_id, status, expires_at")
      .eq("id", data.offerId)
      .maybeSingle();
    if (!offer) throw new Error("Offer not found");
    if (offer.driver_id !== context.userId) throw new Error("Not your offer");
    if (offer.status !== "pending") throw new Error("Offer is no longer available");
    if (new Date(offer.expires_at).getTime() < Date.now()) throw new Error("Offer expired");

    // Lock the order to this driver (only if still unassigned)
    const { data: claimed, error: claimErr } = await supabaseAdmin
      .from("orders")
      .update({
        driver_id: context.userId,
        status: "accepted",
        dispatch_status: "assigned",
      })
      .eq("id", offer.order_id)
      .is("driver_id", null)
      .select("id")
      .maybeSingle();
    if (claimErr || !claimed) {
      await supabaseAdmin.from("offers").update({ status: "expired" }).eq("id", offer.id);
      throw new Error("Order was already claimed");
    }

    await supabaseAdmin.from("offers").update({ status: "accepted" }).eq("id", offer.id);
    await supabaseAdmin
      .from("offers")
      .update({ status: "expired" })
      .eq("order_id", offer.order_id)
      .eq("status", "pending");
    await supabaseAdmin
      .from("profiles")
      .update({ driver_status: "on_delivery" })
      .eq("id", context.userId);

    return { ok: true, orderId: offer.order_id };
  });

export const declineOffer = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { offerId: string }) => d)
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: offer } = await supabaseAdmin
      .from("offers")
      .select("id, order_id, driver_id, status")
      .eq("id", data.offerId)
      .maybeSingle();
    if (!offer || offer.driver_id !== context.userId) throw new Error("Not your offer");
    if (offer.status !== "pending") return { ok: true };
    await supabaseAdmin.from("offers").update({ status: "declined" }).eq("id", offer.id);
    await dispatchOrderInternal(offer.order_id);
    return { ok: true };
  });

export const reassignExpired = createServerFn({ method: "POST" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const nowIso = new Date().toISOString();

  // Expire stale pending offers
  const { data: expired } = await supabaseAdmin
    .from("offers")
    .update({ status: "expired" })
    .eq("status", "pending")
    .lt("expires_at", nowIso)
    .select("order_id");

  const expiredOrderIds = Array.from(new Set((expired ?? []).map((e) => e.order_id)));

  // Also pick up queued orders that never got an offer (e.g. no drivers online at payment time)
  const { data: queued } = await supabaseAdmin
    .from("orders")
    .select("id")
    .eq("dispatch_status", "queued")
    .eq("payment_status", "paid")
    .is("driver_id", null)
    .limit(50);
  const queuedIds = (queued ?? []).map((q) => q.id);

  const toDispatch = Array.from(new Set([...expiredOrderIds, ...queuedIds]));
  let dispatched = 0;
  for (const id of toDispatch) {
    const res = await dispatchOrderInternal(id);
    if (res.ok) dispatched++;
  }
  return { processed: toDispatch.length, dispatched };
});

// Driver online/offline + location ping
export const setDriverPresence = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { status: "online" | "offline"; lat?: number; lng?: number }) => d)
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const update: {
      driver_status: "online" | "offline";
      current_lat?: number;
      current_lng?: number;
      location_updated_at?: string;
    } = { driver_status: data.status };
    if (data.lat != null && data.lng != null) {
      update.current_lat = data.lat;
      update.current_lng = data.lng;
      update.location_updated_at = new Date().toISOString();
    }
    const { error } = await supabaseAdmin.from("profiles").update(update).eq("id", context.userId);
    if (error) throw new Error(error.message);

    if (data.status === "online") {
      const { data: queued } = await supabaseAdmin
        .from("orders")
        .select("id")
        .eq("payment_status", "paid")
        .is("driver_id", null)
        .in("dispatch_status", ["queued", "offered"])
        .limit(25);
      for (const row of queued ?? []) {
        await dispatchOrderInternal(row.id);
      }
    }

    return { ok: true };
  });
