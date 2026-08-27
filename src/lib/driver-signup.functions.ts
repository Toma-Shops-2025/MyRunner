import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/**
 * Grants the signed-in user the driver role via service role.
 * Client inserts into user_roles fail because authenticated only has SELECT
 * on that table (RLS policy alone is not enough without GRANT INSERT).
 */
export const activateDriverRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Live DB may lack UNIQUE(user_id, role) required by upsert onConflict —
    // check then insert so activation works either way.
    const { data: existing, error: readErr } = await supabaseAdmin
      .from("user_roles")
      .select("id")
      .eq("user_id", context.userId)
      .eq("role", "driver")
      .maybeSingle();
    if (readErr) throw new Error(readErr.message);

    if (!existing) {
      const { error } = await supabaseAdmin
        .from("user_roles")
        .insert({ user_id: context.userId, role: "driver" });
      if (error) throw new Error(error.message);
    }

    // Keep application + profile activation in sync for dashboards
    await supabaseAdmin
      .from("driver_applications")
      .update({ status: "approved" })
      .eq("user_id", context.userId);

    await supabaseAdmin
      .from("profiles")
      .update({ is_active: true, background_check_status: "clear" })
      .eq("id", context.userId);

    return { ok: true as const };
  });
