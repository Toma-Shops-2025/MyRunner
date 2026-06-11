import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { listDriversForAdmin } from "@/lib/admin-drivers.functions";
import { fmtUSD } from "@/lib/pricing";

export const Route = createFileRoute("/admin/drivers")({
  head: () => ({ meta: [{ title: "Drivers — MyRunner Admin" }, { name: "robots", content: "noindex" }] }),
  component: AdminDrivers,
});

function AdminDrivers() {
  const fetchDrivers = useServerFn(listDriversForAdmin);
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "drivers"],
    queryFn: () => fetchDrivers(),
  });

  if (isLoading) return <p className="text-muted-foreground">Loading drivers…</p>;
  if (error) return <p className="text-destructive">Failed to load: {(error as Error).message}</p>;

  const drivers = data?.drivers ?? [];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-serif text-4xl">Drivers</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Stripe Connect onboarding status and lifetime payouts.
        </p>
      </header>

      {drivers.length === 0 ? (
        <p className="text-muted-foreground">No approved drivers yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/30 text-left text-xs uppercase tracking-widest text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Driver</th>
                <th className="px-4 py-3">Onboarding</th>
                <th className="px-4 py-3">Paid out</th>
                <th className="px-4 py-3">Pending</th>
                <th className="px-4 py-3">Payouts</th>
              </tr>
            </thead>
            <tbody>
              {drivers.map((d) => (
                <tr key={d.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3">
                    <p className="font-medium">{d.full_name ?? "—"}</p>
                    <p className="text-xs text-muted-foreground">{d.email}</p>
                    {d.phone && <p className="text-xs text-muted-foreground">{d.phone}</p>}
                  </td>
                  <td className="px-4 py-3">
                    {d.payouts_enabled ? (
                      <span className="rounded-full bg-success/20 px-3 py-1 text-xs uppercase tracking-widest text-success">
                        Ready
                      </span>
                    ) : d.stripe_connect_account_id ? (
                      <span className="rounded-full bg-gold-soft px-3 py-1 text-xs uppercase tracking-widest text-gold">
                        In progress
                      </span>
                    ) : (
                      <span className="rounded-full bg-muted px-3 py-1 text-xs uppercase tracking-widest text-muted-foreground">
                        Not started
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-mono">{fmtUSD(d.totals.paidCents)}</td>
                  <td className="px-4 py-3 font-mono text-muted-foreground">{fmtUSD(d.totals.pendingCents)}</td>
                  <td className="px-4 py-3 text-muted-foreground">{d.totals.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
