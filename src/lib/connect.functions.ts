import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { createStripeClient, getStripeEnv, getStripeErrorMessage } from "@/lib/stripe.server";

const APP_URL = process.env.PUBLIC_APP_URL ?? "https://myrunner.shop";

/**
 * Create (or fetch existing) Stripe Connect Express account for the current driver.
 */
export const createConnectAccount = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
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

      await supabase
        .from("profiles")
        .update({ stripe_connect_account_id: account.id })
        .eq("id", userId);

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
        refresh_url: `${APP_URL}/driver/earnings?refresh=1`,
        return_url: `${APP_URL}/driver/earnings?onboarded=1`,
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
      const payoutsEnabled = Boolean(account.payouts_enabled && account.charges_enabled);

      // Self-healing backfill: ensure business_profile.url is set (Stripe requires it for marketplaces).
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

      await supabase
        .from("profiles")
        .update({
          payouts_enabled: payoutsEnabled,
          onboarding_completed_at: payoutsEnabled && !profile.payouts_enabled
            ? new Date().toISOString()
            : undefined,
        })
        .eq("id", userId);

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
    const { supabase, userId } = context;

    const { data: order, error: orderErr } = await supabase
      .from("orders")
      .select("id, driver_id, price_cents, tip_cents, payment_status, status, payout_status, stripe_transfer_id")
      .eq("id", data.orderId)
      .single();

    if (orderErr || !order) return { error: "Order not found" };

    // Authorization: only the assigned driver, or admins via has_role
    if (order.driver_id !== userId) {
      const { data: isAdmin } = await supabase.rpc("has_role", {
        _user_id: userId,
        _role: "admin",
      });
      if (!isAdmin) return { error: "Not authorized" };
    }

    if (order.payment_status !== "paid") return { error: "Order is not paid yet" };
    if (order.status !== "delivered") return { error: "Order is not delivered yet" };
    if (order.payout_status === "paid" || order.stripe_transfer_id) {
      return { ok: true, alreadyPaid: true };
    }
    if (!order.driver_id) return { error: "No driver assigned" };

    const { data: driverProfile } = await supabase
      .from("profiles")
      .select("stripe_connect_account_id, payouts_enabled")
      .eq("id", order.driver_id)
      .single();

    if (!driverProfile?.stripe_connect_account_id || !driverProfile.payouts_enabled) {
      await supabase
        .from("orders")
        .update({ payout_status: "blocked_no_account" })
        .eq("id", order.id);
      return { error: "Driver has not completed payout onboarding" };
    }

    // Driver gets 70% of fee + 100% of tip
    const feeShare = Math.round(order.price_cents * 0.7);
    const platformFee = order.price_cents - feeShare;
    const driverTotal = feeShare + order.tip_cents;

    // Demo driver: skip the actual Stripe transfer, write a simulated payout
    if (driverProfile.stripe_connect_account_id.startsWith("acct_demo")) {
      await Promise.all([
        supabase.from("orders").update({
          driver_payout_cents: driverTotal,
          platform_fee_cents: platformFee,
          stripe_transfer_id: "tr_demo",
          payout_status: "paid",
          paid_out_at: new Date().toISOString(),
        }).eq("id", order.id),
        supabase.from("driver_payouts").insert({
          driver_id: order.driver_id,
          order_id: order.id,
          amount_cents: driverTotal,
          tip_cents: order.tip_cents,
          fee_share_cents: feeShare,
          stripe_transfer_id: "tr_demo",
          status: "paid",
        }),
      ]);
      return { ok: true, amount: driverTotal, transferId: "tr_demo", demo: true };
    }

    try {
      const stripe = createStripeClient(getStripeEnv());
      const transfer = await stripe.transfers.create(
        {
          amount: driverTotal,
          currency: "usd",
          destination: driverProfile.stripe_connect_account_id,
          transfer_group: order.id,
          description: `MyRunner delivery payout · order ${order.id.slice(0, 8)}`,
          metadata: { order_id: order.id, driver_id: order.driver_id },
        },
        { idempotencyKey: `payout-${order.id}` },
      );

      await Promise.all([
        supabase
          .from("orders")
          .update({
            driver_payout_cents: driverTotal,
            platform_fee_cents: platformFee,
            stripe_transfer_id: transfer.id,
            payout_status: "paid",
            paid_out_at: new Date().toISOString(),
          })
          .eq("id", order.id),
        supabase.from("driver_payouts").insert({
          driver_id: order.driver_id,
          order_id: order.id,
          amount_cents: driverTotal,
          tip_cents: order.tip_cents,
          fee_share_cents: feeShare,
          stripe_transfer_id: transfer.id,
          status: "paid",
        }),
      ]);

      return { ok: true, amount: driverTotal, transferId: transfer.id };
    } catch (e) {
      const msg = getStripeErrorMessage(e);
      await supabase
        .from("orders")
        .update({ payout_status: "failed" })
        .eq("id", order.id);
      await supabase.from("driver_payouts").insert({
        driver_id: order.driver_id,
        order_id: order.id,
        amount_cents: driverTotal,
        tip_cents: order.tip_cents,
        fee_share_cents: feeShare,
        status: "failed",
        error_message: msg,
      });
      return { error: msg };
    }
  });
