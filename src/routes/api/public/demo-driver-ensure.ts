import { createFileRoute } from "@tanstack/react-router";

const DEMO_EMAIL = "demo-driver@myrunner.shop";
const DEMO_PASSWORD = "Demo1234!";

/**
 * Idempotently provision the reviewer demo driver account. Safe to call
 * from anywhere — the credentials are fixed and public on purpose, so the
 * reviewer can click "Continue as demo driver" on /login and see the full
 * driver flow without onboarding.
 *
 * Demo account:
 *  - email/password authenticated, auto-confirmed
 *  - granted 'driver' role
 *  - profile flagged active, background check = clear
 *  - stripe_connect_account_id = 'acct_demo' + payouts_enabled = true
 *    (payoutDriverForOrder short-circuits this id and simulates the transfer)
 */
export const Route = createFileRoute("/api/public/demo-driver-ensure")({
  server: {
    handlers: {
      GET: async () => handler(),
      POST: async () => handler(),
    },
  },
});

async function handler(): Promise<Response> {
  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Find or create the user
    let userId: string | null = null;
    const { data: list } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 200 });
    const existing = list?.users?.find((u) => u.email?.toLowerCase() === DEMO_EMAIL);
    if (existing) {
      userId = existing.id;
      // Make sure the password matches and the account is confirmed
      await supabaseAdmin.auth.admin.updateUserById(userId, {
        password: DEMO_PASSWORD,
        email_confirm: true,
      });
    } else {
      const { data: created, error: createErr } = await supabaseAdmin.auth.admin.createUser({
        email: DEMO_EMAIL,
        password: DEMO_PASSWORD,
        email_confirm: true,
        user_metadata: { full_name: "Demo Driver" },
      });
      if (createErr || !created.user) {
        return Response.json({ ok: false, error: createErr?.message ?? "Could not create demo user" }, { status: 500 });
      }
      userId = created.user.id;
    }

    if (!userId) {
      return Response.json({ ok: false, error: "No userId" }, { status: 500 });
    }

    // Upsert profile with the demo Connect short-circuit values
    await supabaseAdmin.from("profiles").update({
      full_name: "Demo Driver",
      phone: "555-0100",
      home_address: "1 Demo Way",
      home_city: "Atlanta",
      home_state: "GA",
      home_zip: "30303",
      emergency_contact_name: "MyRunner Support",
      emergency_contact_phone: "555-0199",
      stripe_connect_account_id: "acct_demo",
      payouts_enabled: true,
      onboarding_completed_at: new Date().toISOString(),
      background_check_status: "clear",
      background_check_updated_at: new Date().toISOString(),
      is_active: true,
    }).eq("id", userId);

    // Make sure the driver role exists
    const { data: hasRole } = await supabaseAdmin
      .from("user_roles")
      .select("user_id")
      .eq("user_id", userId)
      .eq("role", "driver")
      .maybeSingle();
    if (!hasRole) {
      await supabaseAdmin.from("user_roles").insert({ user_id: userId, role: "driver" });
    }

    return Response.json({ ok: true, email: DEMO_EMAIL });
  } catch (e) {
    return Response.json({ ok: false, error: (e as Error).message }, { status: 500 });
  }
}
