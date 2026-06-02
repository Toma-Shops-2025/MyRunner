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
      const origin = process.env.PUBLIC_APP_URL ?? "https://any-anywhere-delivery.lovable.app";
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
                tax_code: "txcd_92010001",
              },
            },
            quantity: 1,
          },
        ],
        success_url: `${origin}/app/orders/${order.id}?paid=1`,
        cancel_url: `${origin}/app/orders/${order.id}?cancelled=1`,
        managed_payments: { enabled: true },
        payment_intent_data: { description: "MyRunner Delivery" },
        metadata: { order_id: order.id, env: "sandbox" },
      });

      await supabase.from("orders").update({ stripe_session_id: session.id }).eq("id", order.id);
      return { url: session.url };
    } catch (e) {
      return { error: getStripeErrorMessage(e) };
    }
  });
