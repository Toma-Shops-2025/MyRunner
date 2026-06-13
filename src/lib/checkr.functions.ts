import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

// Kicks off a Checkr background check for the signed-in driver.
// Silently no-ops if CHECKR_API_KEY/CHECKR_PACKAGE_SLUG aren't configured yet,
// so dev/launch works fine without Checkr credentials.
export const startDriverBackgroundCheck = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { startBackgroundCheck, checkrEnabled } = await import("@/lib/checkr.server");
    if (!checkrEnabled()) {
      return { ok: true, enabled: false };
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("email, full_name, phone, date_of_birth, ssn_last4, home_zip, checkr_candidate_id")
      .eq("id", context.userId)
      .maybeSingle();
    if (!profile || profile.checkr_candidate_id) return { ok: true, alreadyStarted: true };

    const [first, ...rest] = (profile.full_name ?? "").split(" ");
    const last = rest.join(" ") || "Driver";

    const result = await startBackgroundCheck({
      first_name: first || "Driver",
      last_name: last,
      email: profile.email,
      phone: profile.phone ?? undefined,
      dob: profile.date_of_birth ?? undefined,
      zipcode: profile.home_zip ?? undefined,
      // Full SSN not stored; Checkr collects it via invitation flow
    });

    if (result.candidateId) {
      await supabaseAdmin
        .from("profiles")
        .update({ checkr_candidate_id: result.candidateId })
        .eq("id", context.userId);
    }
    return { ok: true, enabled: true, candidateId: result.candidateId };
  });
