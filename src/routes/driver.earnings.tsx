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
  error_message?: string | null;
};

type DeliveredOrder = {
  id: string;
  item_description: string;
  price_cents: number;
  tip_cents: number;
  payout_status: string | null;
  delivered_at: string | null;
  created_at: string;
};

function driverShareCents(priceCents: number, tipCents: number) {
  return Math.round(priceCents * 0.7) + tipCents;
}

function DriverEarnings() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<{
    stripe_connect_account_id: string | null;
    payouts_enabled: boolean;
  } | null>(null);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [delivered, setDelivered] = useState<DeliveredOrder[]>([]);
  const [busy, setBusy] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fnCreate = useServerFn(createConnectAccount);
  const fnLink = useServerFn(createOnboardingLink);
  const fnRefresh = useServerFn(refreshAccountStatus);
  const fnDashboard = useServerFn(createDashboardLink);

  const load = useCallback(async () => {
    if (!user) return;
    const [p, pays, orders] = await Promise.all([
      supabase
        .from("profiles")
        .select("stripe_connect_account_id, payouts_enabled")
        .eq("id", user.id)
        .maybeSingle(),
      supabase
        .from("driver_payouts")
        .select("id, order_id, amount_cents, tip_cents, fee_share_cents, status, created_at, error_message")
        .eq("driver_id", user.id)
        .order("created_at", { ascending: false })
        .limit(100),
      supabase
        .from("orders")
        .select("id, item_description, price_cents, tip_cents, payout_status, delivered_at, created_at")
        .eq("driver_id", user.id)
        .eq("status", "delivered")
        .order("created_at", { ascending: false })
        .limit(100),
    ]);
    setProfile(p.data ?? null);
    setPayouts((pays.data ?? []) as Payout[]);
    setDelivered((orders.data ?? []) as DeliveredOrder[]);

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

  const payoutByOrder = new Map(payouts.map((p) => [p.order_id, p]));

  const lifetimeEarned = delivered.reduce(
    (s, o) => s + driverShareCents(o.price_cents, o.tip_cents),
    0,
  );
  const lifetimeTips = delivered.reduce((s, o) => s + o.tip_cents, 0);
  const pendingCount = delivered.filter((o) => {
    const p = payoutByOrder.get(o.id);
    const status = p?.status ?? o.payout_status ?? "pending";
    return status !== "paid";
  }).length;

  const history = delivered.map((o) => {
    const p = payoutByOrder.get(o.id);
    const amount = p?.amount_cents ?? driverShareCents(o.price_cents, o.tip_cents);
    const tip = p?.tip_cents ?? o.tip_cents;
    const feeShare = p?.fee_share_cents ?? Math.round(o.price_cents * 0.7);
    const status = p?.status ?? o.payout_status ?? "pending";
    return {
      key: o.id,
      label: o.item_description,
      when: o.delivered_at ?? o.created_at,
      amount,
      tip,
      feeShare,
      status,
      error: p?.error_message ?? null,
    };
  });

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

      {/* Stats — based on completed deliveries, not only successful Stripe transfers */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Lifetime earnings" value={fmtUSD(lifetimeEarned)} />
        <Stat label="Tips earned" value={fmtUSD(lifetimeTips)} />
        <Stat label="Pending transfers" value={String(pendingCount)} />
      </div>

      {/* History */}
      <section>
        <h2 className="font-serif text-2xl">Delivery earnings</h2>
        <p className="text-sm text-muted-foreground">Your 70% fee share + tips per completed delivery.</p>
        {history.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
            No deliveries yet. Complete your first delivery to see it here.
          </div>
        ) : (
          <ul className="mt-4 divide-y divide-border rounded-2xl border border-border bg-card">
            {history.map((row) => (
              <li key={row.key} className="flex items-center justify-between gap-4 px-5 py-3 text-sm">
                <div className="min-w-0">
                  <p className="truncate font-medium">{row.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(row.when).toLocaleString()} · fee {fmtUSD(row.feeShare)} + tip {fmtUSD(row.tip)}
                  </p>
                  {row.error && (
                    <p className="mt-0.5 text-xs text-amber-500">Transfer pending: platform Stripe balance needed</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-serif text-lg text-gold">{fmtUSD(row.amount)}</p>
                  <p className={`text-[10px] uppercase tracking-widest ${row.status === "paid" ? "text-emerald-500" : "text-amber-500"}`}>
                    {row.status === "paid" ? "paid" : row.status === "failed" ? "transfer failed" : "pending"}
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
