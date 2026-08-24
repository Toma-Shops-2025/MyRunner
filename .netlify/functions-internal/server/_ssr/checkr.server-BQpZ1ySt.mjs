const CHECKR_BASE = "https://api.checkr.com/v1";
function getAuthHeader() {
  const key = process.env.CHECKR_API_KEY;
  if (!key) return null;
  return "Basic " + Buffer.from(`${key}:`).toString("base64");
}
function checkrEnabled() {
  return Boolean(process.env.CHECKR_API_KEY && process.env.CHECKR_PACKAGE_SLUG);
}
async function checkrCreateCandidate(input) {
  const auth = getAuthHeader();
  if (!auth) {
    console.warn("[checkr] CHECKR_API_KEY not set; skipping createCandidate");
    return null;
  }
  const res = await fetch(`${CHECKR_BASE}/candidates`, {
    method: "POST",
    headers: { Authorization: auth, "Content-Type": "application/json" },
    body: JSON.stringify(input)
  });
  if (!res.ok) {
    console.error("[checkr] createCandidate failed", res.status, await res.text());
    return null;
  }
  return await res.json();
}
async function checkrCreateInvitation(candidateId) {
  const auth = getAuthHeader();
  const pkg = process.env.CHECKR_PACKAGE_SLUG;
  if (!auth || !pkg) {
    console.warn("[checkr] not configured; skipping createInvitation");
    return null;
  }
  const res = await fetch(`${CHECKR_BASE}/invitations`, {
    method: "POST",
    headers: { Authorization: auth, "Content-Type": "application/json" },
    body: JSON.stringify({ candidate_id: candidateId, package: pkg })
  });
  if (!res.ok) {
    console.error("[checkr] createInvitation failed", res.status, await res.text());
    return null;
  }
  return await res.json();
}
async function startBackgroundCheck(p) {
  if (!checkrEnabled()) return { candidateId: null, invitationId: null };
  const cand = await checkrCreateCandidate(p);
  if (!cand) return { candidateId: null, invitationId: null };
  const inv = await checkrCreateInvitation(cand.id);
  return { candidateId: cand.id, invitationId: inv?.id ?? null };
}
export {
  checkrCreateCandidate,
  checkrCreateInvitation,
  checkrEnabled,
  startBackgroundCheck
};
