import { supabase } from "@/integrations/supabase/client";
import type { Role } from "@/hooks/use-auth";
import { intentFromMetadata, type SignupIntent } from "@/lib/signup-intent";

export type AuthDestination =
  | "/driver/dashboard"
  | "/driver-signup"
  | "/app/dashboard";

/** Uses has_role RPC with fallbacks for live DBs that block direct user_roles reads. */
export async function fetchUserRoles(uid: string): Promise<Role[]> {
  const allRoles: Role[] = ["customer", "driver", "admin"];
  const found = await Promise.all(
    allRoles.map(async (role) => {
      const { data, error } = await supabase.rpc("has_role", {
        _user_id: uid,
        _role: role,
      });
      if (error) return null;
      return data ? role : null;
    }),
  );
  const roles = new Set<Role>(found.filter(Boolean) as Role[]);

  if (roles.size === 0) {
    const { data } = await supabase.from("user_roles").select("role").eq("user_id", uid);
    for (const row of data ?? []) roles.add(row.role as Role);
  }

  if (!roles.has("driver")) {
    const { data: app } = await supabase
      .from("driver_applications")
      .select("status")
      .eq("user_id", uid)
      .maybeSingle();
    if (app?.status === "approved") roles.add("driver");
  }

  return [...roles];
}

/**
 * Where to send someone after sign-in on the client.
 * Login should never auto-open driver signup for returning customers — only
 * brand-new driver signups (session intent or metadata with no application yet).
 */
export async function resolveClientPostAuthDestination(
  userId: string,
  options?: { sessionSignupIntent?: SignupIntent | null; metadata?: Record<string, unknown> },
): Promise<AuthDestination> {
  const roles = await fetchUserRoles(userId);
  if (roles.includes("driver")) return "/driver/dashboard";

  const sessionIntent = options?.sessionSignupIntent;
  if (sessionIntent === "driver") return "/driver-signup";

  const metaIntent = intentFromMetadata(options?.metadata);
  if (metaIntent === "driver") {
    const { data: app } = await supabase
      .from("driver_applications")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();
    if (!app) return "/driver-signup";
  }

  return "/app/dashboard";
}

export function notifyPayoutStatusChanged() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("myrunner:payout-refresh"));
  }
}
