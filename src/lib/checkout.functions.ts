import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { createStripeClient, getStripeEnv, getStripeErrorMessage } from "@/lib/stripe.server";
import { dispatchOrderInternal } from "@/lib/dispatch.functions";
import { resolvePaymentIntentId, paymentIntentIdFromSession } from "@/lib/stripe-payout.server";

const input = z.object({ orderId: z.string().uuid() });

export const createCheckoutSession = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => input.parse(d))
  .handler(async ({ data, context }) => {
    const { userId } = context;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: order, error } = await supabaseAdmin
      .from("orders")
      .select("id, customer_id, item_description, price_cents, tip_cents, payment_status")
      .eq("id", data.orderId)
      .single();

    if (error || !order) return { error: "Order not found" };
    if (order.customer_id !== userId) return { error: "Not authorized" };
    if (order.payment_status === "paid") return { error: "Order is already paid" };

    try {
      const stripeEnv = getStripeEnv();
      const stripe = createStripeClient(stripeEnv);
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
        payment_intent_data: {
          description: "MyRunner Delivery",
          capture_method: "manual",
          metadata: { order_id: order.id },
        },
        metadata: { order_id: order.id, env: stripeEnv },
      });

      await supabaseAdmin.from("orders").update({ stripe_session_id: session.id }).eq("id", order.id);
      return { url: session.url };
    } catch (e) {
      console.error("createCheckoutSession failed:", e);
      return { error: getStripeErrorMessage(e) };
    }
  });

/** Confirm Stripe payment after redirect — webhook backup for live deploys. */
export const confirmOrderPayment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ orderId: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: order, error } = await supabaseAdmin
      .from("orders")
      .select("id, customer_id, payment_status, stripe_session_id, driver_id")
      .eq("id", data.orderId)
      .single();

    if (error || !order) return { error: "Order not found" };
    if (order.customer_id !== context.userId) return { error: "Not authorized" };

    if (order.payment_status === "paid") {
      if (!order.driver_id) await dispatchOrderInternal(order.id);
      return { ok: true as const, alreadyPaid: true };
    }

    if (!order.stripe_session_id) return { error: "No checkout session on this order" };

    try {
      const stripe = createStripeClient(getStripeEnv());
      const session = await stripe.checkout.sessions.retrieve(order.stripe_session_id, {
        expand: ["payment_intent"],
      });
      const piId = paymentIntentIdFromSession(session) ?? (await resolvePaymentIntentId(stripe, order.stripe_session_id));
      const piStatus =
        typeof session.payment_intent === "object" && session.payment_intent
          ? session.payment_intent.status
          : piId
            ? (await stripe.paymentIntents.retrieve(piId)).status
            : null;

      const authorized =
        session.payment_status === "paid" ||
        piStatus === "requires_capture" ||
        piStatus === "succeeded";

      if (!authorized) {
        return { error: "Payment has not completed yet" };
      }

      await supabaseAdmin
        .from("orders")
        .update({
          payment_status: "paid",
          paid_at: new Date().toISOString(),
          stripe_payment_intent_id: piId,
        })
        .eq("id", order.id);

      await dispatchOrderInternal(order.id);
      return { ok: true as const };
    } catch (e) {
      console.error("confirmOrderPayment failed:", e);
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

    const { data: driverProfile } = await supabase
      .from("profiles")
      .select("stripe_connect_account_id, payouts_enabled")
      .eq("id", order.driver_id)
      .single();

    if (!driverProfile?.stripe_connect_account_id || !driverProfile.payouts_enabled) {
      return { error: "Runner has not completed payout setup" };
    }

    try {
      const stripeEnv = getStripeEnv();
      const stripe = createStripeClient(stripeEnv);
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
        payment_intent_data: {
          description: "MyRunner post-delivery tip",
          transfer_data: { destination: driverProfile.stripe_connect_account_id },
        },
        metadata: {
          order_id: order.id,
          env: stripeEnv,
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
