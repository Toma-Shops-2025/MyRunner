import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const listDriversForAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (!isAdmin) throw new Error("Forbidden");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: driverRoles, error: rolesErr } = await supabaseAdmin
      .from("user_roles")
      .select("user_id")
      .eq("role", "driver");
    if (rolesErr) throw rolesErr;

    const ids = (driverRoles ?? []).map((r) => r.user_id);
    if (ids.length === 0) return { drivers: [] };

    const [{ data: profiles }, { data: payouts }] = await Promise.all([
      supabaseAdmin
        .from("profiles")
        .select("id, email, full_name, phone, stripe_connect_account_id, payouts_enabled, onboarding_completed_at, created_at, background_check_status, background_check_updated_at, is_active")
        .in("id", ids),
      supabaseAdmin
        .from("driver_payouts")
        .select("driver_id, amount_cents, status")
        .in("driver_id", ids),
    ]);

    const totals = new Map<string, { paidCents: number; pendingCents: number; count: number }>();
    for (const p of payouts ?? []) {
      const cur = totals.get(p.driver_id) ?? { paidCents: 0, pendingCents: 0, count: 0 };
      if (p.status === "paid") cur.paidCents += p.amount_cents;
      else cur.pendingCents += p.amount_cents;
      cur.count += 1;
      totals.set(p.driver_id, cur);
    }

    const drivers = (profiles ?? []).map((p) => ({
      ...p,
      totals: totals.get(p.id) ?? { paidCents: 0, pendingCents: 0, count: 0 },
    }));
    drivers.sort((a, b) => b.totals.paidCents - a.totals.paidCents);
    return { drivers };
  });

const updateInput = z.object({
  driverId: z.string().uuid(),
  status: z.enum(["pending", "clear", "failed"]),
});

export const updateDriverBackgroundCheck = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => updateInput.parse(d))
  .handler(async ({ data, context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (!isAdmin) throw new Error("Forbidden");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const isActive = data.status !== "failed";
    const { error: updErr } = await supabaseAdmin
      .from("profiles")
      .update({
        background_check_status: data.status,
        background_check_updated_at: new Date().toISOString(),
        is_active: isActive,
      })
      .eq("id", data.driverId);
    if (updErr) throw updErr;

    if (data.status === "failed") {
      // Revoke driver role
      await supabaseAdmin.from("user_roles").delete().eq("user_id", data.driverId).eq("role", "driver");
    } else {
      // Reinstate driver role if missing
      await supabaseAdmin.from("user_roles").upsert(
        { user_id: data.driverId, role: "driver" },
        { onConflict: "user_id,role", ignoreDuplicates: true },
      );
    }
    return { ok: true };
  });
