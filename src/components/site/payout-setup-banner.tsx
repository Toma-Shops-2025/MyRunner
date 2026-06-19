import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

/**
 * Prominent payout-setup banner shown on every driver page until the runner
 * completes Stripe Connect onboarding. Mirrors AlgoRhythm's banner pattern.
 */
export function PayoutSetupBanner() {
  const { user } = useAuth();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    supabase
      .from("profiles")
      .select("payouts_enabled")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (!cancelled) setShow(!data?.payouts_enabled);
      });
    return () => { cancelled = true; };
  }, [user]);

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
