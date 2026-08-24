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
export {
  getStripeErrorMessage as a,
  createStripeClient as c,
  getStripeEnv as g
};
