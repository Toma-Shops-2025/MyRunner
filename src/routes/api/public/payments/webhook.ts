import { createFileRoute } from "@tanstack/react-router";
import type Stripe from "stripe";
import { createStripeClient, isDriverConnectReady } from "@/lib/stripe.server";
import { paymentIntentIdFromSession, resolvePaymentIntentId } from "@/lib/stripe-payout.server";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
export const Route = createFileRoute("/api/public/payments/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const url = new URL(request.url);
        const env = url.searchParams.get("env") === "live" ? "live" : "sandbox";
        const sig = request.headers.get("stripe-signature");
        const body = await request.text();
        const secret =
          env === "live"
            ? process.env.PAYMENTS_LIVE_WEBHOOK_SECRET
            : process.env.PAYMENTS_SANDBOX_WEBHOOK_SECRET;

        if (!sig || !secret) return new Response("Missing signature", { status: 400 });

        const stripe = createStripeClient(env);
        let event;
        try {
          event = await stripe.webhooks.constructEventAsync(body, sig, secret);
        } catch (e) {
          return new Response(`Webhook error: ${(e as Error).message}`, { status: 400 });
        }

        if (event.type === "checkout.session.completed") {
          const session = event.data.object as Stripe.Checkout.Session;
          const orderId = session.metadata?.order_id;
          const kind = session.metadata?.kind;

          if (orderId && kind === "tip") {
            const extra = Number(session.metadata?.tip_cents ?? 0);
            const { data: order } = await supabaseAdmin
              .from("orders")
              .select("id, driver_id, tip_cents")
              .eq("id", orderId)
              .single();
            if (order && extra > 0) {
              await supabaseAdmin
                .from("orders")
                .update({ tip_cents: (order.tip_cents ?? 0) + extra })
                .eq("id", orderId);

              if (order.driver_id) {
                const piId =
                  paymentIntentIdFromSession(session) ??
                  (await resolvePaymentIntentId(stripe, session.id));
                await supabaseAdmin.from("driver_payouts").insert({
                  driver_id: order.driver_id,
                  order_id: orderId,
                  amount_cents: extra,
                  tip_cents: extra,
                  fee_share_cents: 0,
                  stripe_transfer_id: piId ?? session.id,
                  status: "paid",
                });
              }
            }
          } else if (orderId) {
            const piId =
              paymentIntentIdFromSession(session) ??
              (await resolvePaymentIntentId(stripe, session.id));
            await supabaseAdmin
              .from("orders")
              .update({
                payment_status: "paid",
                paid_at: new Date().toISOString(),
                stripe_payment_intent_id: piId,
              })
              .eq("id", orderId);
            try {
              const { dispatchOrder } = await import("@/lib/dispatch.functions");
              await dispatchOrder({ data: { orderId } });
            } catch (e) {
              console.error("[webhook] dispatch failed", e);
            }
          }
        }
        if (event.type === "account.updated") {
          const account = event.data.object as Stripe.Account;
          const payoutsEnabled = isDriverConnectReady(account);
          await supabaseAdmin
            .from("profiles")
            .update({ payouts_enabled: payoutsEnabled })
            .eq("stripe_connect_account_id", account.id);
        }

        return new Response("ok");
      },
    },
  },
});
