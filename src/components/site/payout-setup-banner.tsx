import { useCallback, useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { refreshAccountStatus } from "@/lib/connect.functions";
import { notifyPayoutStatusChanged } from "@/lib/auth-routing";
import { useAuth } from "@/hooks/use-auth";

/**
 * Prominent payout-setup banner shown on every driver page until the runner
 * completes Stripe Connect onboarding.
 */
export function PayoutSetupBanner() {
  const { user } = useAuth();
  const refreshPayoutFn = useServerFn(refreshAccountStatus);
  const [show, setShow] = useState(false);

  const load = useCallback(async () => {
    if (!user) {
      setShow(false);
      return;
    }
    const { data } = await supabase
      .from("profiles")
      .select("payouts_enabled, stripe_connect_account_id")
      .eq("id", user.id)
      .maybeSingle();

    if (data?.stripe_connect_account_id && !data.payouts_enabled) {
      const res = await refreshPayoutFn();
      if ("payoutsEnabled" in res && res.payoutsEnabled) {
        notifyPayoutStatusChanged();
        setShow(false);
        return;
      }
    }

    setShow(!data?.payouts_enabled);
  }, [user, refreshPayoutFn]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    const onRefresh = () => void load();
    window.addEventListener("myrunner:payout-refresh", onRefresh);
    return () => window.removeEventListener("myrunner:payout-refresh", onRefresh);
  }, [load]);

  if (!show) return null;

  return (
    <div className="mb-6 rounded-2xl border-2 border-gold/50 bg-gradient-to-r from-gold/10 via-gold/5 to-transparent p-5 shadow-sm">
      <div className="flex flex-wrap items-start gap-4">
        <AlertTriangle className="mt-0.5 size-6 shrink-0 text-gold" />
        <div className="min-w-0 flex-1">
          <p className="font-serif text-lg">Finish setting up your payouts</p>
          <p className="mt-1 text-sm text-muted-foreground">
            You won't receive earnings until you complete a one-time payout
            setup (takes ~2 minutes). Verify your identity and connect your
            bank account so we can deposit your delivery fees and tips.
          </p>
        </div>
        <Link
          to="/driver/earnings"
          className="rounded-full bg-gold px-5 py-2 text-sm font-medium text-primary-foreground hover:bg-gold/90"
        >
          Set up payouts →
        </Link>
      </div>
    </div>
  );
}
