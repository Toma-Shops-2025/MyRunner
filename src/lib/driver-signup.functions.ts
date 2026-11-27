import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { isPlayReviewerEmail } from "@/lib/reviewer-accounts";

const driverApplicationInput = z.object({
  fullName: z.string().min(1),
  phone: z.string(),
  dob: z.string().optional(),
  ssnLast4: z.string().length(4),
  homeAddress: z.string(),
  homeCity: z.string(),
  homeState: z.string().max(2),
  homeZip: z.string(),
  emergencyContactName: z.string(),
  emergencyContactPhone: z.string(),
  vehicleMake: z.string(),
  vehicleModel: z.string(),
  vehicleYear: z.number().nullable(),
  licenseNumber: z.string(),
  licenseState: z.string().max(2),
  insuranceProvider: z.string(),
  isReviewer: z.boolean().optional(),
});

/**
 * Saves driver application + profile and grants the driver role via service role.
 * Client writes to driver_applications / user_roles fail on live DB (RLS/grants).
 */
export const activateDriverRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => driverApplicationInput.parse(d))
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const userId = context.userId;

    const { data: authRow } = await supabaseAdmin.auth.admin.getUserById(userId);
    const reviewerAccount = isPlayReviewerEmail(authRow.user?.email);

    await supabaseAdmin.from("profiles").update({
      full_name: data.fullName,
      phone: data.phone,
      date_of_birth: data.dob || null,
      ssn_last4: data.ssnLast4,
      home_address: data.homeAddress,
      home_city: data.homeCity,
      home_state: data.homeState.toUpperCase().slice(0, 2),
      home_zip: data.homeZip,
      emergency_contact_name: data.emergencyContactName,
      emergency_contact_phone: data.emergencyContactPhone,
      background_check_status: "clear",
      background_check_updated_at: new Date().toISOString(),
      is_active: true,
      ...(reviewerAccount
        ? {
            stripe_connect_account_id: "acct_demo_driver_review",
            payouts_enabled: true,
          }
        : {}),
    }).eq("id", userId);

    // Send non-null vehicle_type: PostgREST omits null keys and DB default "n/a" breaks driver_status enum.
    const vehicleTypeLabel =
      [data.vehicleMake, data.vehicleModel].filter(Boolean).join(" ").trim() || "car";
    const { data: existingApp, error: appReadErr } = await supabaseAdmin
      .from("driver_applications")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();
    if (appReadErr) throw new Error(appReadErr.message);

    const appId = existingApp?.id ?? crypto.randomUUID();
    const appStatus = (reviewerAccount ? "approved" : "pending") as "approved" | "pending";

    const { error: appUpsertErr } = await supabaseAdmin.rpc("upsert_driver_application_for_signup", {
      p_id: appId,
      p_user_id: userId,
      p_vehicle_make: data.vehicleMake || null,
      p_vehicle_model: data.vehicleModel || null,
      p_vehicle_year: data.vehicleYear,
      p_vehicle_type: vehicleTypeLabel,
      p_license_number: data.licenseNumber || null,
      p_license_state: data.licenseState.toUpperCase().slice(0, 2) || null,
      p_insurance_provider: data.insuranceProvider || null,
      p_background_check_status: "pending",
      p_status: appStatus,
      p_notes: null,
    });
    if (appUpsertErr) {
      const hint =
        appUpsertErr.message.includes("upsert_driver_application_for_signup")
          ? "Run supabase/migrations/20261127170000_driver_application_signup_rpc.sql in the Supabase SQL Editor, then NOTIFY pgrst, 'reload schema';"
          : "If this mentions driver_status \"n/a\", run docs/SUPABASE_FIX_DRIVER_NA_ENUM.sql in Supabase.";
      throw new Error(`driver_applications: ${appUpsertErr.message}. ${hint}`);
    }

    const { data: existingRole, error: roleReadErr } = await supabaseAdmin
      .from("user_roles")
      .select("id")
      .eq("user_id", userId)
      .eq("role", "driver")
      .maybeSingle();
    if (roleReadErr) throw new Error(roleReadErr.message);

    if (!existingRole) {
      const { error } = await supabaseAdmin.from("user_roles").insert({
        id: crypto.randomUUID(),
        user_id: userId,
        role: "driver",
      });
      if (error) throw new Error(error.message);
    }

    const { data: verifiedRole, error: verifyErr } = await supabaseAdmin
      .from("user_roles")
      .select("id")
      .eq("user_id", userId)
      .eq("role", "driver")
      .maybeSingle();
    if (verifyErr || !verifiedRole) {
      throw new Error("Driver role could not be assigned. Please contact support.");
    }

    return { ok: true as const };
  });
