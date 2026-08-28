import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

type AuthDestination =
  | "/driver/dashboard"
  | "/driver-signup"
  | "/app/dashboard"
  | "/admin/dashboard";

/**
 * Resolve where to send the user after sign-in using service role —
 * live DB blocks client reads on user_roles / driver_applications.
 */
export const resolvePostAuthDestination = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const userId = context.userId;

    const { data: roleRows } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", userId);
    const roles = (roleRows ?? []).map((r) => r.role);

    if (roles.includes("admin")) {
      return { to: "/admin/dashboard" as AuthDestination };
    }
    if (roles.includes("driver")) {
      return { to: "/driver/dashboard" as AuthDestination };
    }

    const { data: app } = await supabaseAdmin
      .from("driver_applications")
      .select("status")
      .eq("user_id", userId)
      .maybeSingle();
    if (app?.status === "approved") {
      return { to: "/driver/dashboard" as AuthDestination };
    }
    if (app && app.status !== "approved") {
      return { to: "/driver-signup" as AuthDestination };
    }

    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("stripe_connect_account_id, driver_status")
      .eq("id", userId)
      .maybeSingle();
    if (profile?.stripe_connect_account_id || profile?.driver_status) {
      return { to: "/driver/dashboard" as AuthDestination };
    }

    return { to: "/app/dashboard" as AuthDestination };
  });
