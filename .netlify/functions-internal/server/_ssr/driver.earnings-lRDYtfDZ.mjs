import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useServerFn } from "./useServerFn-DL2oePlL.mjs";
import { B as Button } from "./router-CaL1rPwL.mjs";
import { s as supabase } from "./client-DfLBq1uk.mjs";
import { u as useAuth, n as notifyPayoutStatusChanged } from "./use-auth-B85-Dc53.mjs";
import { f as fmtUSD } from "./pricing-Ci0mfZy0.mjs";
import { c as createConnectAccount, a as createOnboardingLink, r as refreshAccountStatus, b as createDashboardLink, p as payoutDriverForOrder } from "./connect.functions-5BWjSdTS.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import "../_libs/seroval.mjs";
import "../_libs/stripe.mjs";
import { T as TriangleAlert, L as LoaderCircle, i as CircleCheck, B as ExternalLink } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "stream";
import "crypto";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "./createSsrRpc-xYjLf7RI.mjs";
import "./server-pkl-8gUD.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "./signup-intent-DuoHB-mj.mjs";
import "./support-knowledge-BldCmBQ4.mjs";
import "./stripe-payout.server-BMP7bU7B.mjs";
import "./client.server-D5ro3rAQ.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "./dispatch.functions-CDAFMReD.mjs";
import "./auth-middleware-CMwi6y2l.mjs";
import "../_libs/zod.mjs";
import "events";
import "http";
import "https";
import "os";
function driverShareCents(priceCents, tipCents) {
  return Math.round(priceCents * 0.7) + tipCents;
}
function payoutRowsForOrder(orderId, payouts) {
  return payouts.filter((p) => p.order_id === orderId).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}
function resolvePayoutDisplay(order, payouts) {
  const rows = payoutRowsForOrder(order.id, payouts);
  const paidRow = rows.find((p) => p.status === "paid");
  const latest = rows[0];
  const amount = paidRow?.amount_cents ?? latest?.amount_cents ?? driverShareCents(order.price_cents, order.tip_cents);
  const tip = paidRow?.tip_cents ?? latest?.tip_cents ?? order.tip_cents;
  const feeShare = paidRow?.fee_share_cents ?? latest?.fee_share_cents ?? Math.round(order.price_cents * 0.7);
  let status = order.payout_status ?? latest?.status ?? "pending";
  if (order.payout_status === "paid" || paidRow) status = "paid";
  const error = status === "paid" ? null : latest?.error_message ?? null;
  return {
    amount,
    tip,
    feeShare,
    status,
    error
  };
}
function DriverEarnings() {
  const {
    user
  } = useAuth();
  const [profile, setProfile] = reactExports.useState(null);
  const [payouts, setPayouts] = reactExports.useState([]);
  const [delivered, setDelivered] = reactExports.useState([]);
  const [busy, setBusy] = reactExports.useState(false);
  const [refreshing, setRefreshing] = reactExports.useState(false);
  const fnCreate = useServerFn(createConnectAccount);
  const fnLink = useServerFn(createOnboardingLink);
  const fnRefresh = useServerFn(refreshAccountStatus);
  const fnDashboard = useServerFn(createDashboardLink);
  const fnRetryPayout = useServerFn(payoutDriverForOrder);
  const [retryingId, setRetryingId] = reactExports.useState(null);
  const load = reactExports.useCallback(async () => {
    if (!user) return;
    const [p, pays, orders] = await Promise.all([supabase.from("profiles").select("stripe_connect_account_id, payouts_enabled").eq("id", user.id).maybeSingle(), supabase.from("driver_payouts").select("id, order_id, amount_cents, tip_cents, fee_share_cents, status, created_at, error_message").eq("driver_id", user.id).order("created_at", {
      ascending: false
    }).limit(100), supabase.from("orders").select("id, item_description, price_cents, tip_cents, payout_status, delivered_at, created_at").eq("driver_id", user.id).eq("status", "delivered").order("created_at", {
      ascending: false
    }).limit(100)]);
    setProfile(p.data ?? null);
    setPayouts(pays.data ?? []);
    setDelivered(orders.data ?? []);
    if (p.data?.stripe_connect_account_id && !p.data.payouts_enabled) {
      const res = await fnRefresh();
      if ("payoutsEnabled" in res && res.payoutsEnabled) {
        notifyPayoutStatusChanged();
        setProfile((prev) => prev ? {
          ...prev,
          payouts_enabled: true
        } : prev);
      }
    }
  }, [user, fnRefresh]);
  reactExports.useEffect(() => {
    load();
  }, [load]);
  reactExports.useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    if (sp.get("onboarded") === "1" || sp.get("refresh") === "1") {
      window.history.replaceState({}, "", window.location.pathname);
      refresh();
    }
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
  async function retryPayout(orderId) {
    setRetryingId(orderId);
    try {
      const res = await fnRetryPayout({
        data: {
          orderId
        }
      });
      if ("error" in res && res.error) toast.error(res.error);
      else if ("amount" in res && res.amount) toast.success(`Payout sent: ${fmtUSD(res.amount)}`);
      else if ("alreadyPaid" in res && res.alreadyPaid) toast.success("Already paid out.");
      await load();
    } finally {
      setRetryingId(null);
    }
  }
  const lifetimeEarned = delivered.reduce((s, o) => s + driverShareCents(o.price_cents, o.tip_cents), 0);
  const lifetimeTips = delivered.reduce((s, o) => s + o.tip_cents, 0);
  const pendingCount = delivered.filter((o) => resolvePayoutDisplay(o, payouts).status !== "paid").length;
  const history = delivered.map((o) => {
    const row = resolvePayoutDisplay(o, payouts);
    return {
      key: o.id,
      label: o.item_description,
      when: o.delivered_at ?? o.created_at,
      amount: row.amount,
      tip: row.tip,
      feeShare: row.feeShare,
      status: row.status,
      error: row.error
    };
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-serif text-3xl", children: "Earnings & payouts" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Set up direct deposit once, then we send 70% of every delivery fee plus 100% of your tips straight to your bank." })
    ] }),
    !profile?.payouts_enabled ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl border-2 border-gold/40 bg-gold/5 p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "mt-0.5 size-5 shrink-0 text-gold" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-serif text-xl", children: "Finish setting up payouts" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "You can still accept orders, but you won't be paid until you complete a quick one-time form with Stripe (our payouts partner). They'll ask for your name, address, last 4 of your SSN, and your bank account." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex flex-wrap gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: startOnboarding, disabled: busy, className: "bg-gold text-primary-foreground hover:bg-gold/90", children: [
            busy ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 size-4 animate-spin" }) : null,
            profile?.stripe_connect_account_id ? "Continue onboarding" : "Set up payouts"
          ] }),
          profile?.stripe_connect_account_id && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", onClick: refresh, disabled: refreshing, children: [
            refreshing ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 size-4 animate-spin" }) : null,
            "I finished — check status"
          ] })
        ] })
      ] })
    ] }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl border border-emerald-500/40 bg-emerald-500/5 p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "size-6 text-emerald-500" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-serif text-xl", children: "Payouts active" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Transfers land in your bank typically within 2 business days of delivery." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", onClick: openDashboard, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "mr-2 size-3" }),
        " Stripe dashboard"
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 sm:grid-cols-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Lifetime earnings", value: fmtUSD(lifetimeEarned) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Tips earned", value: fmtUSD(lifetimeTips) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Pending transfers", value: String(pendingCount) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-serif text-2xl", children: "Delivery earnings" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Your 70% fee share + tips per completed delivery." }),
      history.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground", children: "No deliveries yet. Complete your first delivery to see it here." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-4 divide-y divide-border rounded-2xl border border-border bg-card", children: history.map((row) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center justify-between gap-4 px-5 py-3 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate font-medium", children: row.label }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
            new Date(row.when).toLocaleString(),
            " · fee ",
            fmtUSD(row.feeShare),
            " + tip ",
            fmtUSD(row.tip)
          ] }),
          row.error && row.status !== "paid" && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-0.5 text-xs text-amber-500", children: row.error })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-serif text-lg text-gold", children: fmtUSD(row.amount) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `text-[10px] uppercase tracking-widest ${row.status === "paid" ? "text-emerald-500" : "text-amber-500"}`, children: row.status === "paid" ? "paid" : row.status === "failed" ? "transfer failed" : "pending" }),
          (row.status === "failed" || row.status === "pending") && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", size: "sm", className: "mt-2 h-7 px-2 text-[10px]", disabled: retryingId === row.key, onClick: () => void retryPayout(row.key), children: retryingId === row.key ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-3 animate-spin" }) : "Retry payout" })
        ] })
      ] }, row.key)) })
    ] })
  ] });
}
function Stat({
  label,
  value
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-serif text-3xl", children: value }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-widest text-muted-foreground", children: label })
  ] });
}
export {
  DriverEarnings as component
};
