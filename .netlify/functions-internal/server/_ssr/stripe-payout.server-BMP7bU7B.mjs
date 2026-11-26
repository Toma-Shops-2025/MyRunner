import { S as Stripe } from "../_libs/stripe.mjs";
const getEnv = (key) => {
  const value = process.env[key];
  if (!value) throw new Error(`${key} is not configured`);
  return value;
};
function getStripeEnv() {
  return process.env.STRIPE_ENV === "live" ? "live" : "sandbox";
}
function getStripeSecretKey(env) {
  return env === "sandbox" ? getEnv("STRIPE_SANDBOX_API_KEY") : getEnv("STRIPE_LIVE_API_KEY");
}
function createStripeClient(env) {
  return new Stripe(getStripeSecretKey(env), {
    apiVersion: "2026-03-25.dahlia"
  });
}
function getStripeErrorMessage(error) {
  if (error && typeof error === "object") {
    const e = error;
    return e.raw?.message ?? e.message ?? "Stripe request failed";
  }
  return "Stripe request failed";
}
function isDriverConnectReady(account) {
  if (account.id.startsWith("acct_demo")) return true;
  if (!account.details_submitted || !account.payouts_enabled) return false;
  const transfers = account.capabilities?.transfers;
  if (transfers === "inactive" || transfers === "paused") return false;
  return true;
}
function driverShareCents(priceCents, tipCents) {
  const feeShare = Math.round(priceCents * 0.7);
  const platformFee = priceCents - feeShare;
  return { feeShare, platformFee, driverTotal: feeShare + tipCents };
}
function paymentIntentIdFromSession(session) {
  const pi = session.payment_intent;
  if (!pi) return null;
  return typeof pi === "string" ? pi : pi.id;
}
async function resolvePaymentIntentId(stripe, sessionId) {
  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["payment_intent"]
  });
  return paymentIntentIdFromSession(session);
}
async function transferFromCharge(opts) {
  const transfer = await opts.stripe.transfers.create(
    {
      amount: opts.driverTotal,
      currency: "usd",
      destination: opts.driverConnectAccountId,
      source_transaction: opts.chargeId,
      transfer_group: opts.orderId,
      description: `MyRunner delivery payout · order ${opts.orderId.slice(0, 8)}`,
      metadata: { order_id: opts.orderId, driver_id: opts.driverId }
    },
    { idempotencyKey: opts.idempotencyKey }
  );
  return transfer.id;
}
function chargeIdFromPi(pi) {
  const charge = pi.latest_charge;
  if (!charge) return null;
  return typeof charge === "string" ? charge : charge.id;
}
async function captureAndRouteDriverShare(opts) {
  const { platformFee, driverTotal } = driverShareCents(opts.priceCents, opts.tipCents);
  const total = opts.priceCents + opts.tipCents;
  const retrySuffix = opts.retryToken ? `-r${opts.retryToken}` : "";
  if (opts.driverConnectAccountId.startsWith("acct_demo")) {
    return { referenceId: "tr_demo", driverTotal, platformFee, demo: true };
  }
  const stripe = createStripeClient(getStripeEnv());
  let pi = await stripe.paymentIntents.retrieve(opts.paymentIntentId, {
    expand: ["latest_charge"]
  });
  if (pi.status === "requires_capture") {
    try {
      const captured = await stripe.paymentIntents.capture(
        opts.paymentIntentId,
        {
          amount_to_capture: total,
          application_fee_amount: platformFee,
          transfer_data: { destination: opts.driverConnectAccountId }
        },
        { idempotencyKey: `capture-dest-${opts.orderId}${retrySuffix}` }
      );
      return { referenceId: captured.id, driverTotal, platformFee };
    } catch (destErr) {
      console.warn(
        "[payout] destination capture unavailable, falling back to capture + source_transaction:",
        getStripeErrorMessage(destErr)
      );
      const captured = await stripe.paymentIntents.capture(
        opts.paymentIntentId,
        { amount_to_capture: total },
        { idempotencyKey: `capture-plain-${opts.orderId}${retrySuffix}` }
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
      idempotencyKey: `payout-src-${opts.orderId}${retrySuffix}`
    });
    return { referenceId: transferId, driverTotal, platformFee };
  }
  throw new Error(`Payment is not ready to route (${pi.status})`);
}
export {
  getStripeErrorMessage as a,
  captureAndRouteDriverShare as b,
  createStripeClient as c,
  driverShareCents as d,
  getStripeEnv as g,
  isDriverConnectReady as i,
  paymentIntentIdFromSession as p,
  resolvePaymentIntentId as r
};
