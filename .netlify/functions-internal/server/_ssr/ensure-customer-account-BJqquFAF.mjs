async function ensureCustomerAccountForOrder(userId) {
  const { supabaseAdmin } = await import("./client.server-D5ro3rAQ.mjs");
  const { data: authData, error: authErr } = await supabaseAdmin.auth.admin.getUserById(userId);
  const authUser = authData?.user;
  if (authErr || !authUser) {
    return {
      ok: false,
      error: "Your session is out of date. Please sign out, sign in again, and retry checkout."
    };
  }
  const resolvedId = authUser.id;
  const email = authUser.email ?? null;
  const fullName = authUser.user_metadata?.full_name ?? authUser.email?.split("@")[0] ?? "Customer";
  const { error: profileErr } = await supabaseAdmin.from("profiles").upsert(
    {
      id: resolvedId,
      email,
      full_name: fullName
    },
    { onConflict: "id" }
  );
  if (profileErr) {
    console.error("[ensureCustomerAccountForOrder] profile upsert:", profileErr.message);
  }
  const { data: roleRow } = await supabaseAdmin.from("user_roles").select("id").eq("user_id", resolvedId).eq("role", "customer").maybeSingle();
  if (!roleRow) {
    await supabaseAdmin.from("user_roles").insert({
      id: crypto.randomUUID(),
      user_id: resolvedId,
      role: "customer"
    });
  }
  return { ok: true, userId: resolvedId };
}
export {
  ensureCustomerAccountForOrder
};
