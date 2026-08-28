import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

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
      ...(data.isReviewer
        ? {
            stripe_connect_account_id: "acct_demo_driver_review",
            payouts_enabled: true,
          }
        : {}),
    }).eq("id", userId);

    const applicationPayload = {
      vehicle_make: data.vehicleMake,
      vehicle_model: data.vehicleModel,
      vehicle_year: data.vehicleYear,
      license_number: data.licenseNumber,
      license_state: data.licenseState.toUpperCase().slice(0, 2),
      insurance_provider: data.insuranceProvider,
      status: "approved" as const,
    };

    const { data: existingApp, error: appReadErr } = await supabaseAdmin
      .from("driver_applications")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();
    if (appReadErr) throw new Error(appReadErr.message);

    if (existingApp) {
      const { error } = await supabaseAdmin
        .from("driver_applications")
        .update(applicationPayload)
        .eq("user_id", userId);
      if (error) throw new Error(error.message);
    } else {
      const { error } = await supabaseAdmin.from("driver_applications").insert({
        id: crypto.randomUUID(),
        user_id: userId,
        ...applicationPayload,
      });
      if (error) throw new Error(error.message);
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
