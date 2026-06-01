import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/applications")({
  head: () => ({ meta: [{ title: "Driver applications — MyRunner Admin" }, { name: "robots", content: "noindex" }] }),
  component: Applications,
});

type App = {
  id: string;
  user_id: string;
  vehicle_type: string | null;
  vehicle_make: string | null;
  vehicle_model: string | null;
  vehicle_year: number | null;
  license_number: string | null;
  license_state: string | null;
  insurance_provider: string | null;
  background_check_status: string | null;
  status: string;
  created_at: string;
};

function Applications() {
  const [apps, setApps] = useState<App[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from("driver_applications")
      .select("*")
      .order("created_at", { ascending: false });
    setApps((data ?? []) as App[]);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function decide(app: App, status: "approved" | "rejected") {
    const { error } = await supabase
      .from("driver_applications")
      .update({ status })
      .eq("id", app.id);
    if (error) return toast.error(error.message);

    if (status === "approved") {
      // Grant the driver role
      const { error: roleErr } = await supabase
        .from("user_roles")
        .insert({ user_id: app.user_id, role: "driver" });
      if (roleErr && !roleErr.message.includes("duplicate")) {
        toast.error(`Role grant failed: ${roleErr.message}`);
      }
    }
    toast.success(`Application ${status}`);
    load();
  }

  if (loading) return <p className="text-muted-foreground">Loading applications…</p>;

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-4xl">Driver applications</h1>
      {apps.length === 0 ? (
        <p className="text-muted-foreground">No applications yet.</p>
      ) : (
        <ul className="space-y-3">
          {apps.map((a) => (
            <li key={a.id} className="rounded-2xl border border-border bg-card p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="text-sm">
                  <p className="font-mono text-xs text-muted-foreground">user: {a.user_id}</p>
                  <p className="mt-2 font-medium">
                    {a.vehicle_year} {a.vehicle_make} {a.vehicle_model}
                    <span className="ml-2 text-muted-foreground">({a.vehicle_type})</span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    License {a.license_number} · {a.license_state} · {a.insurance_provider}
                  </p>
                  <p className="mt-1 text-xs">
                    Background:{" "}
                    <span className="text-gold uppercase tracking-widest">{a.background_check_status}</span>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full px-3 py-1 text-xs uppercase tracking-widest ${
                      a.status === "approved"
                        ? "bg-success/20 text-success"
                        : a.status === "rejected"
                        ? "bg-destructive/20 text-destructive"
                        : "bg-gold-soft text-gold"
                    }`}
                  >
                    {a.status}
                  </span>
                </div>
              </div>
              {a.status === "pending" && (
                <div className="mt-4 flex gap-2 border-t border-border pt-4">
                  <Button size="sm" className="bg-gold text-primary-foreground hover:bg-gold/90" onClick={() => decide(a, "approved")}>
                    Approve
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => decide(a, "rejected")}>
                    Reject
                  </Button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
