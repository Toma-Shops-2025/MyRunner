import { supabase } from "@/integrations/supabase/client";
import type { Role } from "@/hooks/use-auth";
import { intentFromMetadata, type SignupIntent } from "@/lib/signup-intent";

export type AuthDestination =
  | "/driver/dashboard"
  | "/driver-signup"
  | "/app/dashboard"
  | "/admin/dashboard";

function applyCustomerGuard(
  roles: Set<Role>,
  signupIntent: SignupIntent | null,
  approvedApp: boolean,
) {
  if (signupIntent === "customer" && !approvedApp) {
    roles.delete("driver");
  }
}

/** Uses has_role RPC with fallbacks for live DBs that block direct user_roles reads. */
export async function fetchUserRoles(
  uid: string,
  metadata?: Record<string, unknown>,
): Promise<Role[]> {
  const signupIntent = intentFromMetadata(metadata);
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

  let approvedApp = false;
  const { data: app } = await supabase
    .from("driver_applications")
    .select("status")
    .eq("user_id", uid)
    .maybeSingle();
  if (app?.status === "approved") {
    approvedApp = true;
    roles.add("driver");
  }

  applyCustomerGuard(roles, signupIntent, approvedApp);

  return [...roles];
}

/** Client fallback when server routing is unavailable. Never opens driver signup on login. */
export async function resolveClientPostAuthDestination(
  userId: string,
  metadata?: Record<string, unknown>,
): Promise<AuthDestination> {
  const roles = await fetchUserRoles(userId, metadata);
  if (roles.includes("admin")) return "/admin/dashboard";
  if (roles.includes("driver")) return "/driver/dashboard";
  return "/app/dashboard";
}

export function notifyPayoutStatusChanged() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("myrunner:payout-refresh"));
  }
}
