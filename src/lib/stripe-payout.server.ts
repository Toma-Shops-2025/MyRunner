import type Stripe from "stripe";
import { createStripeClient, getStripeEnv, getStripeErrorMessage } from "@/lib/stripe.server";

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

async function transferFromCharge(opts: {
  stripe: Stripe;
  chargeId: string;
  driverConnectAccountId: string;
  driverTotal: number;
  orderId: string;
  driverId: string;
  idempotencyKey: string;
}): Promise<string> {
  const transfer = await opts.stripe.transfers.create(
    {
      amount: opts.driverTotal,
      currency: "usd",
      destination: opts.driverConnectAccountId,
      source_transaction: opts.chargeId,
      transfer_group: opts.orderId,
      description: `MyRunner delivery payout · order ${opts.orderId.slice(0, 8)}`,
      metadata: { order_id: opts.orderId, driver_id: opts.driverId },
    },
    { idempotencyKey: opts.idempotencyKey },
  );
  return transfer.id;
}

function chargeIdFromPi(pi: Stripe.PaymentIntent): string | null {
  const charge = pi.latest_charge;
  if (!charge) return null;
  return typeof charge === "string" ? charge : charge.id;
}

/**
 * Capture (if needed) and route driver share from the customer charge.
 *
 * Preferred path for delayed driver assignment:
 * 1) capture authorized PaymentIntent onto the platform
 * 2) Transfer driver share with source_transaction (uses that charge, not platform balance)
 *
 * Destination-charge-on-capture is attempted first when still authorized; if Stripe
 * rejects it (common with Checkout), we fall back to capture + source_transaction.
 */
export async function captureAndRouteDriverShare(opts: {
  paymentIntentId: string;
  driverConnectAccountId: string;
  priceCents: number;
  tipCents: number;
  orderId: string;
  driverId: string;
  /** Bump when retrying a previously failed payout so Stripe does not replay the old error. */
  retryToken?: string;
}): Promise<{ referenceId: string; driverTotal: number; platformFee: number; demo?: boolean }> {
  const { platformFee, driverTotal } = driverShareCents(opts.priceCents, opts.tipCents);
  const total = opts.priceCents + opts.tipCents;
  const retrySuffix = opts.retryToken ? `-r${opts.retryToken}` : "";

  if (opts.driverConnectAccountId.startsWith("acct_demo")) {
    return { referenceId: "tr_demo", driverTotal, platformFee, demo: true };
  }

  const stripe = createStripeClient(getStripeEnv());
  let pi = await stripe.paymentIntents.retrieve(opts.paymentIntentId, {
    expand: ["latest_charge"],
  });

  if (pi.status === "requires_capture") {
    // Try destination split at capture (best case). Checkout PIs often reject this.
    try {
      const captured = await stripe.paymentIntents.capture(
        opts.paymentIntentId,
        {
          amount_to_capture: total,
          application_fee_amount: platformFee,
          transfer_data: { destination: opts.driverConnectAccountId },
        },
        { idempotencyKey: `capture-dest-${opts.orderId}${retrySuffix}` },
      );
      return { referenceId: captured.id, driverTotal, platformFee };
    } catch (destErr) {
      console.warn(
        "[payout] destination capture unavailable, falling back to capture + source_transaction:",
        getStripeErrorMessage(destErr),
      );
      const captured = await stripe.paymentIntents.capture(
        opts.paymentIntentId,
        { amount_to_capture: total },
        { idempotencyKey: `capture-plain-${opts.orderId}${retrySuffix}` },
      );
      pi = await stripe.paymentIntents.retrieve(captured.id, { expand: ["latest_charge"] });
    }
  }

  if (pi.status === "succeeded") {
    const chargeId = chargeIdFromPi(pi);
    if (!chargeId) throw new Error("No charge found on this payment");

    const transferId = await transferFromCharge({
      stripe,
      chargeId,
      driverConnectAccountId: opts.driverConnectAccountId,
      driverTotal,
      orderId: opts.orderId,
      driverId: opts.driverId,
      idempotencyKey: `payout-src-${opts.orderId}${retrySuffix}`,
    });
    return { referenceId: transferId, driverTotal, platformFee };
  }

  throw new Error(`Payment is not ready to route (${pi.status})`);
}
