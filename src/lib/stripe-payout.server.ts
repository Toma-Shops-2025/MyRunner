import type Stripe from "stripe";
import { createStripeClient, getStripeEnv } from "@/lib/stripe.server";

export function driverShareCents(priceCents: number, tipCents: number) {
  const feeShare = Math.round(priceCents * 0.7);
  const platformFee = priceCents - feeShare;
  return { feeShare, platformFee, driverTotal: feeShare + tipCents };
}

export function paymentIntentIdFromSession(session: Stripe.Checkout.Session): string | null {
  const pi = session.payment_intent;
  if (!pi) return null;
  return typeof pi === "string" ? pi : pi.id;
}

/** Persist PI id from a completed checkout session (authorized or captured). */
export async function resolvePaymentIntentId(
  stripe: Stripe,
  sessionId: string,
): Promise<string | null> {
  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["payment_intent"],
  });
  return paymentIntentIdFromSession(session);
}

/**
 * Capture (if needed) and route driver share via Connect destination charge.
 * Falls back to source_transaction transfer for legacy already-captured payments.
 */
export async function captureAndRouteDriverShare(opts: {
  paymentIntentId: string;
  driverConnectAccountId: string;
  priceCents: number;
  tipCents: number;
  orderId: string;
  driverId: string;
}): Promise<{ referenceId: string; driverTotal: number; platformFee: number; demo?: boolean }> {
  const { feeShare, platformFee, driverTotal } = driverShareCents(opts.priceCents, opts.tipCents);
  const total = opts.priceCents + opts.tipCents;

  if (opts.driverConnectAccountId.startsWith("acct_demo")) {
    return { referenceId: "tr_demo", driverTotal, platformFee, demo: true };
  }

  const stripe = createStripeClient(getStripeEnv());
  const pi = await stripe.paymentIntents.retrieve(opts.paymentIntentId);

  if (pi.status === "requires_capture") {
    const captured = await stripe.paymentIntents.capture(
      opts.paymentIntentId,
      {
        amount_to_capture: total,
        application_fee_amount: platformFee,
        transfer_data: { destination: opts.driverConnectAccountId },
      },
      { idempotencyKey: `capture-route-${opts.orderId}` },
    );
    return { referenceId: captured.id, driverTotal, platformFee };
  }

  if (pi.status === "succeeded") {
    const chargeId =
      typeof pi.latest_charge === "string" ? pi.latest_charge : pi.latest_charge?.id;
    if (!chargeId) throw new Error("No charge found on this payment");

    const transfer = await stripe.transfers.create(
      {
        amount: driverTotal,
        currency: "usd",
        destination: opts.driverConnectAccountId,
        source_transaction: chargeId,
        transfer_group: opts.orderId,
        description: `MyRunner delivery payout · order ${opts.orderId.slice(0, 8)}`,
        metadata: { order_id: opts.orderId, driver_id: opts.driverId },
      },
      { idempotencyKey: `payout-${opts.orderId}` },
    );
    return { referenceId: transfer.id, driverTotal, platformFee };
  }

  throw new Error(`Payment is not ready to route (${pi.status})`);
}
