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
      })
      .select("id")
      .single();

    if (error || !created) {
      return { error: error?.message ?? "Could not create order" };
    }

    return { orderId: created.id };
  });
