// Checkr API client — dormant until CHECKR_API_KEY is set in secrets.
// When unset, all functions are no-ops so the app keeps working.

const CHECKR_BASE = "https://api.checkr.com/v1";

function getAuthHeader(): string | null {
  const key = process.env.CHECKR_API_KEY;
  if (!key) return null;
  // Checkr uses HTTP Basic with the API key as the username and empty password
  return "Basic " + Buffer.from(`${key}:`).toString("base64");
}

export function checkrEnabled(): boolean {
  return Boolean(process.env.CHECKR_API_KEY && process.env.CHECKR_PACKAGE_SLUG);
}

type CreateCandidateInput = {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  dob?: string; // YYYY-MM-DD
  ssn?: string;
  zipcode?: string;
};

export async function checkrCreateCandidate(input: CreateCandidateInput): Promise<{ id: string } | null> {
  const auth = getAuthHeader();
  if (!auth) {
    console.warn("[checkr] CHECKR_API_KEY not set; skipping createCandidate");
    return null;
  }
  const res = await fetch(`${CHECKR_BASE}/candidates`, {
    method: "POST",
    headers: { Authorization: auth, "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    console.error("[checkr] createCandidate failed", res.status, await res.text());
    return null;
  }
  return (await res.json()) as { id: string };
}

export async function checkrCreateInvitation(candidateId: string): Promise<{ id: string } | null> {
  const auth = getAuthHeader();
  const pkg = process.env.CHECKR_PACKAGE_SLUG;
  if (!auth || !pkg) {
    console.warn("[checkr] not configured; skipping createInvitation");
    return null;
  }
  const res = await fetch(`${CHECKR_BASE}/invitations`, {
    method: "POST",
    headers: { Authorization: auth, "Content-Type": "application/json" },
    body: JSON.stringify({ candidate_id: candidateId, package: pkg }),
  });
  if (!res.ok) {
    console.error("[checkr] createInvitation failed", res.status, await res.text());
    return null;
  }
  return (await res.json()) as { id: string };
}

// Entry point used at driver signup
export async function startBackgroundCheck(p: CreateCandidateInput): Promise<{
  candidateId: string | null;
  invitationId: string | null;
}> {
  if (!checkrEnabled()) return { candidateId: null, invitationId: null };
  const cand = await checkrCreateCandidate(p);
  if (!cand) return { candidateId: null, invitationId: null };
  const inv = await checkrCreateInvitation(cand.id);
  return { candidateId: cand.id, invitationId: inv?.id ?? null };
}
