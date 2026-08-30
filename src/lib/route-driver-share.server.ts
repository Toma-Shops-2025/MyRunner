import { captureAndRouteDriverShare, driverShareCents, resolvePaymentIntentId } from "@/lib/stripe-payout.server";
import { createStripeClient, getStripeEnv } from "@/lib/stripe.server";

type SupabaseAdmin = Awaited<
  typeof import("@/integrations/supabase/client.server")
>["supabaseAdmin"];

/** Capture/split customer payment to the assigned driver (idempotent). */
export async function routeDriverShareForOrder(
  supabaseAdmin: SupabaseAdmin,
  orderId: string,
): Promise<{ ok: true; alreadyPaid?: boolean; amount?: number } | { error: string }> {
  const { data: order, error } = await supabaseAdmin
    .from("orders")
    .select(
      "id, driver_id, price_cents, tip_cents, payment_status, payout_status, stripe_transfer_id, stripe_payment_intent_id, stripe_session_id",
    )
    .eq("id", orderId)
    .single();

  if (error || !order) return { error: "Order not found" };
  if (order.payment_status !== "paid") return { error: "Order is not paid yet" };
  if (!order.driver_id) return { error: "No driver assigned" };
  if (order.payout_status === "paid" || order.stripe_transfer_id) {
    return { ok: true, alreadyPaid: true };
  }
  if (!order.stripe_payment_intent_id) {
    if (!order.stripe_session_id) {
      return { error: "No payment on this order — cannot route driver share" };
    }
    try {
      const stripe = createStripeClient(getStripeEnv());
      const piId = await resolvePaymentIntentId(stripe, order.stripe_session_id);
      if (!piId) return { error: "No payment on this order — cannot route driver share" };
      await supabaseAdmin
        .from("orders")
        .update({ stripe_payment_intent_id: piId })
        .eq("id", order.id);
      order.stripe_payment_intent_id = piId;
    } catch {
      return { error: "No payment on this order — cannot route driver share" };
    }
  }

  const { data: driverProfile } = await supabaseAdmin
    .from("profiles")
    .select("stripe_connect_account_id, payouts_enabled")
    .eq("id", order.driver_id)
    .single();

  if (!driverProfile?.stripe_connect_account_id || !driverProfile.payouts_enabled) {
    await supabaseAdmin
      .from("orders")
      .update({ payout_status: "blocked_no_account" })
      .eq("id", order.id);
    return { error: "Driver has not completed payout onboarding" };
  }

  const { feeShare, platformFee, driverTotal } = driverShareCents(order.price_cents, order.tip_cents);

  try {
    const routed = await captureAndRouteDriverShare({
      paymentIntentId: order.stripe_payment_intent_id,
      driverConnectAccountId: driverProfile.stripe_connect_account_id,
      priceCents: order.price_cents,
      tipCents: order.tip_cents,
      orderId: order.id,
      driverId: order.driver_id,
    });

    await supabaseAdmin
      .from("orders")
      .update({
        driver_payout_cents: driverTotal,
        platform_fee_cents: platformFee,
        stripe_transfer_id: routed.referenceId,
        payout_status: "paid",
        paid_out_at: new Date().toISOString(),
      })
      .eq("id", order.id);

    await supabaseAdmin.from("driver_payouts").insert({
      driver_id: order.driver_id,
      order_id: order.id,
      amount_cents: driverTotal,
      tip_cents: order.tip_cents,
      fee_share_cents: feeShare,
      stripe_transfer_id: routed.referenceId,
      status: "paid",
    });

    return { ok: true, amount: driverTotal };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    await supabaseAdmin.from("orders").update({ payout_status: "failed" }).eq("id", order.id);
    await supabaseAdmin.from("driver_payouts").insert({
      driver_id: order.driver_id,
      order_id: order.id,
      amount_cents: driverTotal,
      tip_cents: order.tip_cents,
      fee_share_cents: feeShare,
      status: "failed",
      error_message: msg,
    });
    return { error: msg };
  }
}
