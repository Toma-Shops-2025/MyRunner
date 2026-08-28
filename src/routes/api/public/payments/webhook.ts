import { createFileRoute } from "@tanstack/react-router";
import type Stripe from "stripe";
import { createStripeClient, isDriverConnectReady } from "@/lib/stripe.server";
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
          const session = event.data.object as {
            id: string;
            metadata?: { order_id?: string; kind?: string; tip_cents?: string };
          };
          const orderId = session.metadata?.order_id;
          const kind = session.metadata?.kind;

          if (orderId && kind === "tip") {
            // Post-delivery tip: increment tip_cents and push transfer to driver
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
                const { data: driverProfile } = await supabaseAdmin
                  .from("profiles")
                  .select("stripe_connect_account_id, payouts_enabled")
                  .eq("id", order.driver_id)
                  .single();

                if (driverProfile?.stripe_connect_account_id && driverProfile.payouts_enabled) {
                  const isDemo = driverProfile.stripe_connect_account_id.startsWith("acct_demo");
                  let transferId = "tr_demo";
                  if (!isDemo) {
                    try {
                      const transfer = await stripe.transfers.create(
                        {
                          amount: extra,
                          currency: "usd",
                          destination: driverProfile.stripe_connect_account_id,
                          transfer_group: orderId,
                          description: `MyRunner tip · order ${orderId.slice(0, 8)}`,
                          metadata: { order_id: orderId, driver_id: order.driver_id, kind: "tip" },
                        },
                        { idempotencyKey: `tip-${session.id}` },
                      );
                      transferId = transfer.id;
                    } catch (e) {
                      console.error("[webhook] tip transfer failed", e);
                    }
                  }
                  await supabaseAdmin.from("driver_payouts").insert({
                    driver_id: order.driver_id,
                    order_id: orderId,
                    amount_cents: extra,
                    tip_cents: extra,
                    fee_share_cents: 0,
                    stripe_transfer_id: transferId,
                    status: "paid",
                  });
                }
              }
            }
          } else if (orderId) {
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
