import { c as createServerRpc } from "./createServerRpc-C3IsetnU.mjs";
import { c as createServerFn } from "./server-pkl-8gUD.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CMwi6y2l.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as objectType, b as booleanType, s as stringType, n as numberType } from "../_libs/zod.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "node:stream";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "stream";
import "crypto";
import "../_libs/isbot.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
const driverApplicationInput = objectType({
  fullName: stringType().min(1),
  phone: stringType(),
  dob: stringType().optional(),
  ssnLast4: stringType().length(4),
  homeAddress: stringType(),
  homeCity: stringType(),
  homeState: stringType().max(2),
  homeZip: stringType(),
  emergencyContactName: stringType(),
  emergencyContactPhone: stringType(),
  vehicleMake: stringType(),
  vehicleModel: stringType(),
  vehicleYear: numberType().nullable(),
  licenseNumber: stringType(),
  licenseState: stringType().max(2),
  insuranceProvider: stringType(),
  isReviewer: booleanType().optional()
});
const activateDriverRole_createServerFn_handler = createServerRpc({
  id: "72e92813e75d32d12ceaceb4b85493b7e5721200d713ae26c970f60b7f582f93",
  name: "activateDriverRole",
  filename: "src/lib/driver-signup.functions.ts"
}, (opts) => activateDriverRole.__executeServer(opts));
const activateDriverRole = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => driverApplicationInput.parse(d)).handler(activateDriverRole_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabaseAdmin
  } = await import("./client.server-D5ro3rAQ.mjs");
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
    background_check_updated_at: (/* @__PURE__ */ new Date()).toISOString(),
    is_active: true,
    ...data.isReviewer ? {
      stripe_connect_account_id: "acct_demo_driver_review",
      payouts_enabled: true
    } : {}
  }).eq("id", userId);
  const applicationPayload = {
    vehicle_make: data.vehicleMake,
    vehicle_model: data.vehicleModel,
    vehicle_year: data.vehicleYear,
    license_number: data.licenseNumber,
    license_state: data.licenseState.toUpperCase().slice(0, 2),
    insurance_provider: data.insuranceProvider,
    status: "approved"
  };
  const {
    data: existingApp,
    error: appReadErr
  } = await supabaseAdmin.from("driver_applications").select("id").eq("user_id", userId).maybeSingle();
  if (appReadErr) throw new Error(appReadErr.message);
  if (existingApp) {
    const {
      error
    } = await supabaseAdmin.from("driver_applications").update(applicationPayload).eq("user_id", userId);
    if (error) throw new Error(error.message);
  } else {
    const {
      error
    } = await supabaseAdmin.from("driver_applications").insert({
      id: crypto.randomUUID(),
      user_id: userId,
      ...applicationPayload
    });
    if (error) throw new Error(error.message);
  }
  const {
    data: existingRole,
    error: roleReadErr
  } = await supabaseAdmin.from("user_roles").select("id").eq("user_id", userId).eq("role", "driver").maybeSingle();
  if (roleReadErr) throw new Error(roleReadErr.message);
  if (!existingRole) {
    const {
      error
    } = await supabaseAdmin.from("user_roles").insert({
      id: crypto.randomUUID(),
      user_id: userId,
      role: "driver"
    });
    if (error) throw new Error(error.message);
  }
  const {
    data: verifiedRole,
    error: verifyErr
  } = await supabaseAdmin.from("user_roles").select("id").eq("user_id", userId).eq("role", "driver").maybeSingle();
  if (verifyErr || !verifiedRole) {
    throw new Error("Driver role could not be assigned. Please contact support.");
  }
  return {
    ok: true
  };
});
export {
  activateDriverRole_createServerFn_handler
};
