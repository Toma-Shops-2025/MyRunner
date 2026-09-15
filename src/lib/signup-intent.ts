export type SignupIntent = "customer" | "driver";

const STORAGE_KEY = "myrunner-signup-intent";
const REF_KEY = "myrunner-driver-ref";

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

export function setDriverReferralCode(code: string) {
  if (typeof window === "undefined") return;
  const cleaned = code.trim().toUpperCase();
  if (!cleaned) return;
  sessionStorage.setItem(REF_KEY, cleaned);
  try {
    localStorage.setItem(REF_KEY, cleaned);
  } catch {
    /* ignore */
  }
}

export function readDriverReferralCode(): string | null {
  if (typeof window === "undefined") return null;
  const fromSession = sessionStorage.getItem(REF_KEY);
  if (fromSession) return fromSession;
  try {
    return localStorage.getItem(REF_KEY);
  } catch {
    return null;
  }
}

export function clearDriverReferralCode() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(REF_KEY);
  try {
    localStorage.removeItem(REF_KEY);
  } catch {
    /* ignore */
  }
}

export function intentFromMetadata(meta: Record<string, unknown> | undefined): SignupIntent | null {
  const value = meta?.signup_intent;
  if (value === "driver" || value === "customer") return value;
  return null;
}

export function parseSignupIntent(raw: unknown): SignupIntent {
  return raw === "driver" ? "driver" : "customer";
}
