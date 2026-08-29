import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { intentFromMetadata, type SignupIntent } from "@/lib/signup-intent";

type AuthDestination =
  | "/driver/dashboard"
  | "/driver-signup"
  | "/app/dashboard"
  | "/admin/dashboard";

export type EffectiveAccountAccess = {
  isAdmin: boolean;
  isDriver: boolean;
  signupIntent: SignupIntent | null;
  approvedApp: boolean;
};

/** True when this account should use driver surfaces (not merely a stray role row). */
export async function resolveEffectiveDriverAccess(
  userId: string,
  options?: { cleanupStaleDriverRole?: boolean },
): Promise<EffectiveAccountAccess> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  const [{ data: authData }, { data: roleRows }, { data: app }] = await Promise.all([
    supabaseAdmin.auth.admin.getUserById(userId),
    supabaseAdmin.from("user_roles").select("role").eq("user_id", userId),
    supabaseAdmin.from("driver_applications").select("status").eq("user_id", userId).maybeSingle(),
  ]);

  const roles = (roleRows ?? []).map((r) => r.role);
  const signupIntent = intentFromMetadata(
    authData.user?.user_metadata as Record<string, unknown> | undefined,
  );
  const approvedApp = app?.status === "approved";
  const hasDriverRole = roles.includes("driver");

  if (
    options?.cleanupStaleDriverRole &&
    !approvedApp &&
    hasDriverRole &&
    signupIntent !== "driver"
  ) {
    await supabaseAdmin.from("user_roles").delete().eq("user_id", userId).eq("role", "driver");
  }

  const isAdmin = roles.includes("admin");
  const isDriver =
    approvedApp || (hasDriverRole && signupIntent === "driver");

  return { isAdmin, isDriver, signupIntent, approvedApp };
}

/**
 * Resolve where to send the user after sign-in using service role.
 */
export const resolvePostAuthDestination = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const access = await resolveEffectiveDriverAccess(context.userId, {
      cleanupStaleDriverRole: true,
    });

    if (access.isAdmin) {
      return { to: "/admin/dashboard" as AuthDestination };
    }
    if (access.isDriver) {
      return { to: "/driver/dashboard" as AuthDestination };
    }

    return { to: "/app/dashboard" as AuthDestination };
  });

/** OAuth/signup callback only — never send returning logins to driver signup. */
export function destinationAfterFreshOAuth(
  access: Pick<EffectiveAccountAccess, "isAdmin" | "isDriver">,
  sessionSignupIntent: SignupIntent | null,
): AuthDestination {
  if (access.isAdmin) return "/admin/dashboard";
  if (access.isDriver) return "/driver/dashboard";
  if (sessionSignupIntent === "driver") return "/driver-signup";
  return "/app/dashboard";
}

/** Used by /auth/callback after Google or email-confirm sign-in. */
export const resolveOAuthCallbackDestination = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => {
    const d = data as { sessionSignupIntent?: string | null };
    return {
      sessionSignupIntent:
        d?.sessionSignupIntent === "driver" || d?.sessionSignupIntent === "customer"
          ? d.sessionSignupIntent
          : null,
    };
  })
  .handler(async ({ context, data }) => {
    const access = await resolveEffectiveDriverAccess(context.userId, {
      cleanupStaleDriverRole: true,
    });
    return {
      to: destinationAfterFreshOAuth(access, data.sessionSignupIntent),
    };
  });
