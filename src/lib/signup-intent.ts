export type SignupIntent = "customer" | "driver";

const STORAGE_KEY = "myrunner-signup-intent";

export function setSignupIntent(intent: SignupIntent) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(STORAGE_KEY, intent);
}

export function readSignupIntent(): SignupIntent | null {
  if (typeof window === "undefined") return null;
  const value = sessionStorage.getItem(STORAGE_KEY);
  if (value === "driver" || value === "customer") return value;
  return null;
}

export function clearSignupIntent() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(STORAGE_KEY);
}

export function intentFromMetadata(meta: Record<string, unknown> | undefined): SignupIntent | null {
  const value = meta?.signup_intent;
  if (value === "driver" || value === "customer") return value;
  return null;
}

export function parseSignupIntent(raw: unknown): SignupIntent {
  return raw === "driver" ? "driver" : "customer";
}
