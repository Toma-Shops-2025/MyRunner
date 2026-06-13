import { createFileRoute } from "@tanstack/react-router";
import { createStripeClient } from "@/lib/stripe.server";
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
          const session = event.data.object as { id: string; metadata?: { order_id?: string } };
          const orderId = session.metadata?.order_id;
          if (orderId) {
            await supabaseAdmin
              .from("orders")
              .update({ payment_status: "paid", paid_at: new Date().toISOString() })
              .eq("id", orderId);
            // Kick off Spark-style dispatch
            try {
              const { dispatchOrder } = await import("@/lib/dispatch.functions");
              await dispatchOrder({ data: { orderId } });
            } catch (e) {
              console.error("[webhook] dispatch failed", e);
            }
          }
        }

        if (event.type === "account.updated") {
          const account = event.data.object as {
            id: string;
            payouts_enabled?: boolean;
            charges_enabled?: boolean;
            details_submitted?: boolean;
          };
          const payoutsEnabled = Boolean(account.payouts_enabled && account.charges_enabled);
          await supabaseAdmin
            .from("profiles")
            .update({
              payouts_enabled: payoutsEnabled,
              ...(payoutsEnabled ? { onboarding_completed_at: new Date().toISOString() } : {}),
            })
            .eq("stripe_connect_account_id", account.id);
        }

        return new Response("ok");
      },
    },
  },
});
