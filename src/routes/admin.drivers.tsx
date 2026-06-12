import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listDriversForAdmin, updateDriverBackgroundCheck } from "@/lib/admin-drivers.functions";
import { fmtUSD } from "@/lib/pricing";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/drivers")({
  head: () => ({ meta: [{ title: "Drivers — MyRunner Admin" }, { name: "robots", content: "noindex" }] }),
  component: AdminDrivers,
});

function AdminDrivers() {
  const fetchDrivers = useServerFn(listDriversForAdmin);
  const updateBg = useServerFn(updateDriverBackgroundCheck);
  const qc = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "drivers"],
    queryFn: () => fetchDrivers(),
  });
  const mut = useMutation({
    mutationFn: (vars: { driverId: string; status: "pending" | "clear" | "failed" }) =>
      updateBg({ data: vars }),
    onSuccess: () => {
      toast.success("Background check updated.");
      qc.invalidateQueries({ queryKey: ["admin", "drivers"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (isLoading) return <p className="text-muted-foreground">Loading drivers…</p>;
  if (error) return <p className="text-destructive">Failed to load: {(error as Error).message}</p>;

  const drivers = data?.drivers ?? [];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-serif text-4xl">Drivers</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Stripe Connect onboarding, background check status, and lifetime payouts. Set status to "Failed"
          to deactivate a driver — they'll lose the ability to accept orders immediately.
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
                <th className="px-4 py-3">Background check</th>
                <th className="px-4 py-3">Paid out</th>
                <th className="px-4 py-3">Pending</th>
              </tr>
            </thead>
            <tbody>
              {drivers.map((d) => (
                <tr key={d.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3">
                    <p className="font-medium">{d.full_name ?? "—"}</p>
                    <p className="text-xs text-muted-foreground">{d.email}</p>
                    {d.phone && <p className="text-xs text-muted-foreground">{d.phone}</p>}
                    {!d.is_active && (
                      <p className="mt-1 text-xs uppercase tracking-widest text-destructive">Deactivated</p>
                    )}
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
                  <td className="px-4 py-3">
                    <select
                      value={d.background_check_status ?? "pending"}
                      disabled={mut.isPending}
                      onChange={(e) =>
                        mut.mutate({
                          driverId: d.id,
                          status: e.target.value as "pending" | "clear" | "failed",
                        })
                      }
                      className="rounded-md border border-border bg-card px-2 py-1 text-sm"
                    >
                      <option value="pending">Pending</option>
                      <option value="clear">Clear</option>
                      <option value="failed">Failed — deactivate</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 font-mono">{fmtUSD(d.totals.paidCents)}</td>
                  <td className="px-4 py-3 font-mono text-muted-foreground">{fmtUSD(d.totals.pendingCents)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
