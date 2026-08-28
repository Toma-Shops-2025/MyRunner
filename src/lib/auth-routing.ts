import { supabase } from "@/integrations/supabase/client";
import type { Role } from "@/hooks/use-auth";

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
  const fromRpc = found.filter(Boolean) as Role[];
  if (fromRpc.length > 0) return fromRpc;

  const { data } = await supabase.from("user_roles").select("role").eq("user_id", uid);
  const fromTable = (data ?? []).map((r) => r.role as Role);
  if (fromTable.length > 0) return fromTable;

  const { data: app } = await supabase
    .from("driver_applications")
    .select("status")
    .eq("user_id", uid)
    .maybeSingle();
  if (app?.status === "approved") return ["driver"];

  return [];
}

export function notifyPayoutStatusChanged() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("myrunner:payout-refresh"));
  }
}
