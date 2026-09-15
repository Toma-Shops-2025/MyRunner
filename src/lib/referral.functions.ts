import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { createStripeClient, getStripeEnv } from "@/lib/stripe.server";

/** $25 to referrer + $25 to referred after 3 completed deliveries */
export const REFERRAL_REWARD_CENTS = 2500;
export const REFERRAL_DELIVERY_GOAL = 3;

function makeCode(seed: string): string {
  const clean = seed.replace(/[^a-zA-Z0-9]/g, "").slice(0, 4).toUpperCase() || "RUN";
  const tail = crypto.randomUUID().replace(/-/g, "").slice(0, 5).toUpperCase();
  return `MR${clean}${tail}`.slice(0, 12);
}

async function ensureCodeForUser(
  supabaseAdmin: Awaited<typeof import("@/integrations/supabase/client.server")>["supabaseAdmin"],
  userId: string,
): Promise<string> {
  const { data: profile } = await (supabaseAdmin as any)
    .from("profiles")
    .select("referral_code, full_name, email")
    .eq("id", userId)
    .maybeSingle();

  if (profile?.referral_code) return profile.referral_code as string;

  const seed = String(profile?.full_name || profile?.email || userId);
  for (let i = 0; i < 6; i++) {
    const code = makeCode(seed + String(i));
    const { error } = await (supabaseAdmin as any)
      .from("profiles")
      .update({ referral_code: code })
      .eq("id", userId)
      .is("referral_code", null);
    if (!error) {
      const { data: again } = await (supabaseAdmin as any)
        .from("profiles")
        .select("referral_code")
        .eq("id", userId)
        .maybeSingle();
      if (again?.referral_code) return again.referral_code as string;
    }
  }
  // Last resort: force set unique-ish code
  const fallback = makeCode(userId);
  await (supabaseAdmin as any).from("profiles").update({ referral_code: fallback }).eq("id", userId);
  return fallback;
}

async function payConnectBonus(opts: {
  connectAccountId: string;
  amountCents: number;
  userId: string;
  referralId: string;
  role: "referrer" | "referred";
}): Promise<string> {
  if (opts.connectAccountId.startsWith("acct_demo")) {
    return `tr_demo_${opts.role}_${opts.referralId.slice(0, 8)}`;
  }
  const stripe = createStripeClient(getStripeEnv());
  const transfer = await stripe.transfers.create(
    {
      amount: opts.amountCents,
      currency: "usd",
      destination: opts.connectAccountId,
      description: `MyRunner driver referral bonus (${opts.role})`,
      metadata: {
        type: "driver_referral",
        role: opts.role,
        referral_id: opts.referralId,
        user_id: opts.userId,
      },
    },
    { idempotencyKey: `ref-${opts.role}-${opts.referralId}` },
  );
  return transfer.id;
}

/** Driver dashboard: code, link, invited list */
export const getDriverReferralStats = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const code = await ensureCodeForUser(supabaseAdmin, context.userId);
    const { data: rows } = await (supabaseAdmin as any)
      .from("driver_referrals")
      .select("id, referred_id, status, deliveries_completed, reward_cents, created_at, paid_at")
      .eq("referrer_id", context.userId)
      .order("created_at", { ascending: false });

    const list = rows ?? [];
    const paidCount = list.filter((r: { status: string }) => r.status === "paid").length;
    const pendingCount = list.filter((r: { status: string }) => r.status === "pending" || r.status === "qualified").length;

    return {
      code,
      link: `https://myrunner.shop/signup?intent=driver&ref=${encodeURIComponent(code)}`,
      rewardCents: REFERRAL_REWARD_CENTS,
      deliveryGoal: REFERRAL_DELIVERY_GOAL,
      invited: list.length,
      paidCount,
      pendingCount,
      referrals: list,
    };
  });

/** Attach referrer when a new driver finishes application (or early after signup). */
export const attachDriverReferrer = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { code: string }) => d)
  .handler(async ({ data, context }) => {
    const code = data.code?.trim().toUpperCase();
    if (!code) throw new Error("Missing referral code");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: existing } = await (supabaseAdmin as any)
      .from("driver_referrals")
      .select("id")
      .eq("referred_id", context.userId)
      .maybeSingle();
    if (existing) return { ok: true as const, already: true };

    const { data: referrer } = await (supabaseAdmin as any)
      .from("profiles")
      .select("id, referral_code")
      .eq("referral_code", code)
      .maybeSingle();
    if (!referrer?.id) throw new Error("Invalid referral code");
    if (referrer.id === context.userId) throw new Error("You can't refer yourself");

    await (supabaseAdmin as any)
      .from("profiles")
      .update({ referred_by: referrer.id })
      .eq("id", context.userId)
      .is("referred_by", null);

    const { error } = await (supabaseAdmin as any).from("driver_referrals").insert({
      referrer_id: referrer.id,
      referred_id: context.userId,
      referral_code: code,
      status: "pending",
      deliveries_completed: 0,
      reward_cents: REFERRAL_REWARD_CENTS,
    });
    if (error) {
      if (String(error.message).includes("duplicate") || String(error.code) === "23505") {
        return { ok: true as const, already: true };
      }
      throw new Error(error.message);
    }
    return { ok: true as const, already: false };
  });

/** Call after a delivery is marked delivered. */
export async function maybeCompleteDriverReferral(driverId: string): Promise<void> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  const { data: referral } = await (supabaseAdmin as any)
    .from("driver_referrals")
    .select("*")
    .eq("referred_id", driverId)
    .maybeSingle();
  if (!referral) return;
  if (referral.status === "paid") return;

  const { count } = await supabaseAdmin
    .from("orders")
    .select("id", { count: "exact", head: true })
    .eq("driver_id", driverId)
    .eq("status", "delivered");

  const deliveries = count ?? 0;
  await (supabaseAdmin as any)
    .from("driver_referrals")
    .update({ deliveries_completed: deliveries })
    .eq("id", referral.id);

  if (deliveries < REFERRAL_DELIVERY_GOAL) return;

  if (referral.status === "pending") {
    await (supabaseAdmin as any)
      .from("driver_referrals")
      .update({ status: "qualified", qualified_at: new Date().toISOString() })
      .eq("id", referral.id);
  }

  const { data: referrerProfile } = await supabaseAdmin
    .from("profiles")
    .select("stripe_connect_account_id, payouts_enabled")
    .eq("id", referral.referrer_id)
    .maybeSingle();
  const { data: referredProfile } = await supabaseAdmin
    .from("profiles")
    .select("stripe_connect_account_id, payouts_enabled")
    .eq("id", referral.referred_id)
    .maybeSingle();

  const referrerAcct = referrerProfile?.stripe_connect_account_id;
  const referredAcct = referredProfile?.stripe_connect_account_id;
  if (!referrerAcct || !referredAcct) {
    await (supabaseAdmin as any)
      .from("driver_referrals")
      .update({
        status: "qualified",
        last_error: "Waiting for both drivers to finish Stripe payout setup",
      })
      .eq("id", referral.id);
    return;
  }

  try {
    const referrerTransfer =
      referral.referrer_transfer_id ||
      (await payConnectBonus({
        connectAccountId: referrerAcct,
        amountCents: REFERRAL_REWARD_CENTS,
        userId: referral.referrer_id,
        referralId: referral.id,
        role: "referrer",
      }));
    const referredTransfer =
      referral.referred_transfer_id ||
      (await payConnectBonus({
        connectAccountId: referredAcct,
        amountCents: REFERRAL_REWARD_CENTS,
        userId: referral.referred_id,
        referralId: referral.id,
        role: "referred",
      }));

    await (supabaseAdmin as any)
      .from("driver_referrals")
      .update({
        status: "paid",
        referrer_transfer_id: referrerTransfer,
        referred_transfer_id: referredTransfer,
        paid_at: new Date().toISOString(),
        last_error: null,
        deliveries_completed: deliveries,
      })
      .eq("id", referral.id);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[referral] payout failed", msg);
    await (supabaseAdmin as any)
      .from("driver_referrals")
      .update({ status: "failed", last_error: msg.slice(0, 400) })
      .eq("id", referral.id);
  }
}
