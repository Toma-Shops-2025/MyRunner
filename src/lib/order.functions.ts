import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const createOrderInput = z.object({
  pickupAddress: z.string().min(3),
  dropoffAddress: z.string().min(3),
  itemDescription: z.string().min(2),
  type: z.enum(["standard", "multi_pickup", "multi_dropoff"]),
  priceCents: z.number().int().min(0),
  tipCents: z.number().int().min(0),
  distanceMiles: z.number().min(1).max(50),
  pickupLat: z.number().nullable().optional(),
  pickupLng: z.number().nullable().optional(),
});

/** Create a delivery order — service role insert bypasses live DB RLS gaps. */
export const createOrder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => createOrderInput.parse(d))
  .handler(async ({ data, context }) => {
    const { userId } = context;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const feeShareCents = Math.round(data.priceCents * 0.7);
    const platformFeeCents = data.priceCents - feeShareCents;

    const { data: created, error } = await supabaseAdmin
      .from("orders")
      .insert({
        customer_id: userId,
        pickup_address: data.pickupAddress,
        dropoff_address: data.dropoffAddress,
        item_description: data.itemDescription,
        type: data.type,
        price_cents: data.priceCents,
        tip_cents: data.tipCents,
        distance_miles: data.distanceMiles,
        pickup_lat: data.pickupLat ?? null,
        pickup_lng: data.pickupLng ?? null,
        platform_fee_cents: platformFeeCents,
        driver_payout_cents: 0,
        payment_status: "pending",
        dispatch_status: "queued",
        dispatch_attempts: 0,
      })
      .select("id")
      .single();

    if (error || !created) {
      return { error: error?.message ?? "Could not create order" };
    }

    return { orderId: created.id };
  });

const sendMessageInput = z.object({
  orderId: z.string().uuid(),
  body: z.string().min(1).max(2000),
});

/** Send in-order chat — service role so live RLS text/uuid mismatches cannot block messages. */
export const sendOrderMessage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => sendMessageInput.parse(d))
  .handler(async ({ data, context }) => {
    const { userId } = context;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: order, error: orderErr } = await supabaseAdmin
      .from("orders")
      .select("id, customer_id, driver_id")
      .eq("id", data.orderId)
      .maybeSingle();

    if (orderErr || !order) return { error: "Order not found" };

    const involved =
      String(order.customer_id) === String(userId) || String(order.driver_id) === String(userId);
    if (!involved) {
      const { data: role } = await supabaseAdmin
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .eq("role", "admin")
        .maybeSingle();
      if (!role) return { error: "Not authorized" };
    }

    const text = data.body.trim();
    const { error } = await supabaseAdmin.from("order_messages").insert({
      order_id: data.orderId,
      sender_id: userId,
      body: text,
    });
    if (error) return { error: error.message };
    return { ok: true as const };
  });
