import Stripe from "stripe";

const getEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) throw new Error(`${key} is not configured`);
  return value;
};

export type StripeEnv = "sandbox" | "live";

/** Server-side Stripe mode. Set STRIPE_ENV=live in production deploy env. */
export function getStripeEnv(): StripeEnv {
  return process.env.STRIPE_ENV === "live" ? "live" : "sandbox";
}

export function getStripeSecretKey(env: StripeEnv): string {
  return env === "sandbox"
    ? getEnv("STRIPE_SANDBOX_API_KEY")
    : getEnv("STRIPE_LIVE_API_KEY");
}

export function createStripeClient(env: StripeEnv): Stripe {
  return new Stripe(getStripeSecretKey(env), {
    apiVersion: "2026-03-25.dahlia",
  });
}

export function getStripeErrorMessage(error: unknown): string {
  if (error && typeof error === "object") {
    const e = error as { message?: string; raw?: { message?: string } };
    return e.raw?.message ?? e.message ?? "Stripe request failed";
  }
  return "Stripe request failed";
}

/** Express drivers receive platform transfers — charges_enabled on their account is not required. */
export function isDriverConnectReady(account: Stripe.Account): boolean {
  if (account.id.startsWith("acct_demo")) return true;
  if (!account.details_submitted || !account.payouts_enabled) return false;

  const transfers = account.capabilities?.transfers;
  if (transfers === "inactive" || transfers === "paused") return false;

  return true;
}
