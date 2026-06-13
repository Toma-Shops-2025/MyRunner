import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { createStripeClient, getStripeErrorMessage } from "@/lib/stripe.server";

const input = z.object({ orderId: z.string().uuid() });

export const createCheckoutSession = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => input.parse(d))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: order, error } = await supabase
      .from("orders")
      .select("id, customer_id, item_description, price_cents, tip_cents, payment_status")
      .eq("id", data.orderId)
      .single();

    if (error || !order) return { error: "Order not found" };
    if (order.customer_id !== userId) return { error: "Not authorized" };
    if (order.payment_status === "paid") return { error: "Order is already paid" };

    try {
      const stripe = createStripeClient("sandbox");
      const origin = process.env.PUBLIC_APP_URL ?? "https://myrunner.shop";
      const total = order.price_cents + order.tip_cents;

      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        line_items: [
          {
            price_data: {
              currency: "usd",
              unit_amount: total,
              product_data: {
                name: `MyRunner delivery — ${order.item_description.slice(0, 80)}`,
              },
            },
            quantity: 1,
          },
        ],
        success_url: `${origin}/app/orders/${order.id}?paid=1`,
        cancel_url: `${origin}/app/orders/${order.id}?cancelled=1`,
        payment_intent_data: { description: "MyRunner Delivery" },
        metadata: { order_id: order.id, env: "sandbox" },
      });

      await supabase.from("orders").update({ stripe_session_id: session.id }).eq("id", order.id);
      return { url: session.url };
    } catch (e) {
      console.error("createCheckoutSession failed:", e);
      return { error: getStripeErrorMessage(e) };
    }
  });

const tipInput = z.object({
  orderId: z.string().uuid(),
  tipCents: z.number().int().min(100).max(50000),
});

export const createTipCheckoutSession = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => tipInput.parse(d))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: order, error } = await supabase
      .from("orders")
      .select("id, customer_id, driver_id, status, item_description")
      .eq("id", data.orderId)
      .single();

    if (error || !order) return { error: "Order not found" };
    if (order.customer_id !== userId) return { error: "Not authorized" };
    if (order.status !== "delivered") return { error: "Order is not delivered yet" };
    if (!order.driver_id) return { error: "No Runner assigned" };

    try {
      const stripe = createStripeClient("sandbox");
      const origin = process.env.PUBLIC_APP_URL ?? "https://myrunner.shop";

      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        line_items: [
          {
            price_data: {
              currency: "usd",
              unit_amount: data.tipCents,
              product_data: {
                name: `Tip for your Runner — ${order.item_description.slice(0, 80)}`,
              },
            },
            quantity: 1,
          },
        ],
        success_url: `${origin}/app/orders/${order.id}?tipped=1`,
        cancel_url: `${origin}/app/orders/${order.id}?tip_cancelled=1`,
        payment_intent_data: { description: "MyRunner post-delivery tip" },
        metadata: {
          order_id: order.id,
          env: "sandbox",
          kind: "tip",
          tip_cents: String(data.tipCents),
        },
      });

      return { url: session.url };
    } catch (e) {
      console.error("createTipCheckoutSession failed:", e);
      return { error: getStripeErrorMessage(e) };
    }
  });
