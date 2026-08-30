import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { createStripeClient, getStripeEnv, getStripeErrorMessage, isDriverConnectReady } from "@/lib/stripe.server";
import { routeDriverShareForOrder } from "@/lib/route-driver-share.server";

const APP_URL = process.env.PUBLIC_APP_URL ?? "https://myrunner.shop";

/**
 * Create (or fetch existing) Stripe Connect Express account for the current driver.
 */
export const createConnectAccount = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: profile } = await supabase
      .from("profiles")
      .select("stripe_connect_account_id, email, full_name")
      .eq("id", userId)
      .single();

    if (profile?.stripe_connect_account_id) {
      return { accountId: profile.stripe_connect_account_id };
    }

    try {
      const stripe = createStripeClient(getStripeEnv());
      const publicUrl = `${APP_URL}/r/${userId}`;
      const account = await stripe.accounts.create({
        type: "express",
        country: "US",
        email: profile?.email ?? undefined,
        capabilities: {
          transfers: { requested: true },
          card_payments: { requested: true },
        },
        business_type: "individual",
        business_profile: {
          name: profile?.full_name ?? "MyRunner Independent Runner",
          url: publicUrl,
          product_description: "Independent contractor delivery driver for MyRunner — on-demand pickup and delivery of groceries, food, pharmacy and last-minute errands.",
          support_email: profile?.email ?? undefined,
          mcc: "4214",
        },
        metadata: { user_id: userId, public_url: publicUrl },
      });

      const { error: updErr } = await supabaseAdmin
        .from("profiles")
        .update({ stripe_connect_account_id: account.id })
        .eq("id", userId);
      if (updErr) return { error: updErr.message };

      return { accountId: account.id };
    } catch (e) {
      return { error: getStripeErrorMessage(e) };
    }
  });

/**
 * Create a one-time onboarding link the driver follows to complete KYC + bank info.
 */
export const createOnboardingLink = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data: profile } = await supabase
      .from("profiles")
      .select("stripe_connect_account_id")
      .eq("id", userId)
      .single();

    if (!profile?.stripe_connect_account_id) {
      return { error: "No Connect account yet. Click Set up payouts first." };
    }

    try {
      const stripe = createStripeClient(getStripeEnv());
      const link = await stripe.accountLinks.create({
        account: profile.stripe_connect_account_id,
        refresh_url: `${APP_URL}/driver/dashboard?refresh=1`,
        return_url: `${APP_URL}/driver/dashboard?onboarded=1`,
        type: "account_onboarding",
      });
      return { url: link.url };
    } catch (e) {
      return { error: getStripeErrorMessage(e) };
    }
  });

/**
 * Re-check Connect account status with Stripe and update payouts_enabled.
 */
export const refreshAccountStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: profile } = await supabase
      .from("profiles")
      .select("stripe_connect_account_id, payouts_enabled")
      .eq("id", userId)
      .single();

    if (!profile?.stripe_connect_account_id) {
      return { payoutsEnabled: false };
    }

    try {
      const stripe = createStripeClient(getStripeEnv());
      const account = await stripe.accounts.retrieve(profile.stripe_connect_account_id);
      const payoutsEnabled = isDriverConnectReady(account);

      const expectedUrl = `${APP_URL}/r/${userId}`;
      const isDemo = profile.stripe_connect_account_id.startsWith("acct_demo");
      if (!isDemo && account.business_profile?.url !== expectedUrl) {
        try {
          await stripe.accounts.update(profile.stripe_connect_account_id, {
            business_profile: { url: expectedUrl },
          });
        } catch (e) {
          console.error("[connect] failed to backfill business_profile.url", e);
        }
      }

      const { error: updErr } = await supabaseAdmin
        .from("profiles")
        .update({ payouts_enabled: payoutsEnabled })
        .eq("id", userId);
      if (updErr) return { error: updErr.message };

      return {
        payoutsEnabled,
        detailsSubmitted: account.details_submitted,
        requirementsDue: account.requirements?.currently_due ?? [],
      };
    } catch (e) {
      return { error: getStripeErrorMessage(e) };
    }
  });

/**
 * Create a Stripe Express dashboard login link so the driver can manage payouts.
 */
export const createDashboardLink = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data: profile } = await supabase
      .from("profiles")
      .select("stripe_connect_account_id")
      .eq("id", userId)
      .single();

    if (!profile?.stripe_connect_account_id) {
      return { error: "Complete onboarding first." };
    }

    try {
      const stripe = createStripeClient(getStripeEnv());
      const link = await stripe.accounts.createLoginLink(profile.stripe_connect_account_id);
      return { url: link.url };
    } catch (e) {
      return { error: getStripeErrorMessage(e) };
    }
  });

/**
 * Pay out a delivered order: 70% of price_cents + 100% of tip_cents → driver.
 * Idempotent — won't re-transfer if order is already paid out.
 */
const payoutInput = z.object({ orderId: z.string().uuid() });

export const payoutDriverForOrder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => payoutInput.parse(d))
  .handler(async ({ data, context }) => {
    const { userId } = context;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: order, error: orderErr } = await supabaseAdmin
      .from("orders")
      .select("id, driver_id, status, payout_status, stripe_transfer_id")
      .eq("id", data.orderId)
      .single();

    if (orderErr || !order) return { error: "Order not found" };

    if (String(order.driver_id) !== String(userId)) {
      const { data: role } = await supabaseAdmin
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .eq("role", "admin")
        .maybeSingle();
      if (!role) return { error: "Not authorized" };
    }

    if (order.status !== "delivered") return { error: "Order is not delivered yet" };
    if (order.payout_status === "paid" || order.stripe_transfer_id) {
      return { ok: true, alreadyPaid: true };
    }

    const result = await routeDriverShareForOrder(supabaseAdmin, data.orderId);
    if ("error" in result) return { error: result.error };
    return { ok: true, alreadyPaid: result.alreadyPaid, amount: result.amount };
  });
