import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ExternalLink, Loader2, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { fmtUSD } from "@/lib/pricing";
import {
  createConnectAccount,
  createOnboardingLink,
  refreshAccountStatus,
  createDashboardLink,
} from "@/lib/connect.functions";
import { toast } from "sonner";
import { notifyPayoutStatusChanged } from "@/lib/auth-routing";

export const Route = createFileRoute("/driver/earnings")({
  head: () => ({
    meta: [
      { title: "Earnings & payouts — MyRunner" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: DriverEarnings,
});

type Payout = {
  id: string;
  order_id: string;
  amount_cents: number;
  tip_cents: number;
  fee_share_cents: number;
  status: string;
  created_at: string;
};

function DriverEarnings() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<{
    stripe_connect_account_id: string | null;
    payouts_enabled: boolean;
  } | null>(null);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [busy, setBusy] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fnCreate = useServerFn(createConnectAccount);
  const fnLink = useServerFn(createOnboardingLink);
  const fnRefresh = useServerFn(refreshAccountStatus);
  const fnDashboard = useServerFn(createDashboardLink);

  const load = useCallback(async () => {
    if (!user) return;
    const [p, pays] = await Promise.all([
      supabase
        .from("profiles")
        .select("stripe_connect_account_id, payouts_enabled")
        .eq("id", user.id)
        .maybeSingle(),
      supabase
        .from("driver_payouts")
        .select("id, order_id, amount_cents, tip_cents, fee_share_cents, status, created_at")
        .eq("driver_id", user.id)
        .order("created_at", { ascending: false })
        .limit(100),
    ]);
    setProfile(p.data ?? null);
    setPayouts((pays.data ?? []) as Payout[]);

    if (p.data?.stripe_connect_account_id && !p.data.payouts_enabled) {
      const res = await fnRefresh();
      if ("payoutsEnabled" in res && res.payoutsEnabled) {
        notifyPayoutStatusChanged();
        setProfile((prev) => (prev ? { ...prev, payouts_enabled: true } : prev));
      }
    }
  }, [user, fnRefresh]);

  useEffect(() => { load(); }, [load]);

  // After Stripe redirect, refresh status automatically
  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    if (sp.get("onboarded") === "1" || sp.get("refresh") === "1") {
      window.history.replaceState({}, "", window.location.pathname);
      refresh();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function startOnboarding() {
    setBusy(true);
    try {
      if (!profile?.stripe_connect_account_id) {
        const created = await fnCreate();
        if ("error" in created && created.error) {
          toast.error(created.error);
          return;
        }
      }
      const linkRes = await fnLink();
      if ("error" in linkRes && linkRes.error) {
        toast.error(linkRes.error);
        return;
      }
      if ("url" in linkRes && linkRes.url) {
        window.location.href = linkRes.url;
      }
    } finally {
      setBusy(false);
    }
  }

  async function refresh() {
    setRefreshing(true);
    const res = await fnRefresh();
    setRefreshing(false);
    if ("error" in res && res.error) return toast.error(res.error);
    if ("payoutsEnabled" in res) {
      toast.success(res.payoutsEnabled ? "Payouts enabled — you're all set." : "Onboarding not complete yet.");
    }
    notifyPayoutStatusChanged();
    load();
  }

  async function openDashboard() {
    const res = await fnDashboard();
    if ("error" in res && res.error) return toast.error(res.error);
    if ("url" in res && res.url) window.open(res.url, "_blank");
  }

  const lifetime = payouts
    .filter((p) => p.status === "paid")
    .reduce((s, p) => s + p.amount_cents, 0);
  const lifetimeTips = payouts
    .filter((p) => p.status === "paid")
    .reduce((s, p) => s + p.tip_cents, 0);
  const pending = payouts.filter((p) => p.status !== "paid").length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl">Earnings & payouts</h1>
        <p className="text-sm text-muted-foreground">
          Set up direct deposit once, then we send 70% of every delivery fee plus 100% of your tips straight to your bank.
        </p>
      </div>

      {/* Onboarding card */}
      {!profile?.payouts_enabled ? (
        <div className="rounded-2xl border-2 border-gold/40 bg-gold/5 p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 size-5 shrink-0 text-gold" />
            <div className="flex-1">
              <h2 className="font-serif text-xl">Finish setting up payouts</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                You can still accept orders, but you won't be paid until you complete a quick one-time form with Stripe (our payouts partner). They'll ask for your name, address, last 4 of your SSN, and your bank account.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button onClick={startOnboarding} disabled={busy} className="bg-gold text-primary-foreground hover:bg-gold/90">
                  {busy ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
                  {profile?.stripe_connect_account_id ? "Continue onboarding" : "Set up payouts"}
                </Button>
                {profile?.stripe_connect_account_id && (
                  <Button variant="outline" onClick={refresh} disabled={refreshing}>
                    {refreshing ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
                    I finished — check status
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/5 p-6">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="size-6 text-emerald-500" />
            <div className="flex-1">
              <p className="font-serif text-xl">Payouts active</p>
              <p className="text-sm text-muted-foreground">Transfers land in your bank typically within 2 business days of delivery.</p>
            </div>
            <Button variant="outline" size="sm" onClick={openDashboard}>
              <ExternalLink className="mr-2 size-3" /> Stripe dashboard
            </Button>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Lifetime earnings" value={fmtUSD(lifetime)} />
        <Stat label="Tips earned" value={fmtUSD(lifetimeTips)} />
        <Stat label="Pending transfers" value={String(pending)} />
      </div>

      {/* History */}
      <section>
        <h2 className="font-serif text-2xl">Payout history</h2>
        {payouts.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
            No payouts yet. Complete your first delivery to see it here.
          </div>
        ) : (
          <ul className="mt-4 divide-y divide-border rounded-2xl border border-border bg-card">
            {payouts.map((p) => (
              <li key={p.id} className="flex items-center justify-between gap-4 px-5 py-3 text-sm">
                <div className="min-w-0">
                  <p className="font-medium">Order {p.order_id.slice(0, 8)}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(p.created_at).toLocaleString()} · fee {fmtUSD(p.fee_share_cents)} + tip {fmtUSD(p.tip_cents)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-serif text-lg text-gold">{fmtUSD(p.amount_cents)}</p>
                  <p className={`text-[10px] uppercase tracking-widest ${p.status === "paid" ? "text-emerald-500" : "text-amber-500"}`}>
                    {p.status}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <p className="font-serif text-3xl">{value}</p>
      <p className="text-xs uppercase tracking-widest text-muted-foreground">{label}</p>
    </div>
  );
}
