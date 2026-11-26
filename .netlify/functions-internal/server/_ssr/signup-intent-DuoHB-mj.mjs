const STORAGE_KEY = "myrunner-signup-intent";
const REF_KEY = "myrunner-driver-ref";
function setSignupIntent(intent) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(STORAGE_KEY, intent);
}
function readSignupIntent() {
  if (typeof window === "undefined") return null;
  const value = sessionStorage.getItem(STORAGE_KEY);
  if (value === "driver" || value === "customer") return value;
  return null;
}
function clearSignupIntent() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(STORAGE_KEY);
}
function setDriverReferralCode(code) {
  if (typeof window === "undefined") return;
  const cleaned = code.trim().toUpperCase();
  if (!cleaned) return;
  sessionStorage.setItem(REF_KEY, cleaned);
  try {
    localStorage.setItem(REF_KEY, cleaned);
  } catch {
  }
}
function readDriverReferralCode() {
  if (typeof window === "undefined") return null;
  const fromSession = sessionStorage.getItem(REF_KEY);
  if (fromSession) return fromSession;
  try {
    return localStorage.getItem(REF_KEY);
  } catch {
    return null;
  }
}
function clearDriverReferralCode() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(REF_KEY);
  try {
    localStorage.removeItem(REF_KEY);
  } catch {
  }
}
function intentFromMetadata(meta) {
  const value = meta?.signup_intent;
  if (value === "driver" || value === "customer") return value;
  return null;
}
function parseSignupIntent(raw) {
  return raw === "driver" ? "driver" : "customer";
}
export {
  setSignupIntent as a,
  clearDriverReferralCode as b,
  clearSignupIntent as c,
  readSignupIntent as d,
  intentFromMetadata as i,
  parseSignupIntent as p,
  readDriverReferralCode as r,
  setDriverReferralCode as s
};
