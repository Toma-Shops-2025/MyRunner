import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/reports")({
  head: () => ({ meta: [{ title: "Reports — MyRunner Admin" }, { name: "robots", content: "noindex" }] }),
  component: Reports,
});

type Report = {
  id: string;
  reporter_id: string;
  reported_user_id: string | null;
  order_id: string | null;
  category: string;
  details: string;
  status: string;
  created_at: string;
  ai_severity?: string | null;
  ai_summary?: string | null;
  ai_labels?: string[] | null;
  ai_escalate?: boolean | null;
  ai_suggested_action?: string | null;
};

function severityClass(s?: string | null) {
  switch ((s || "").toLowerCase()) {
    case "critical":
      return "bg-destructive text-destructive-foreground";
    case "high":
      return "bg-destructive/20 text-destructive";
    case "medium":
      return "bg-gold/20 text-gold";
    default:
      return "bg-muted text-muted-foreground";
  }
}

function Reports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [filter, setFilter] = useState<"open" | "resolved" | "all">("open");

  async function load() {
    let q = supabase.from("reports").select("*").order("created_at", { ascending: false });
    if (filter !== "all") q = q.eq("status", filter);
    const { data } = await q;
    setReports((data ?? []) as Report[]);
  }
  useEffect(() => {
    load();
  }, [filter]);

  async function setStatus(id: string, status: string) {
    const { error } = await supabase.from("reports").update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success(`Marked ${status}`);
    load();
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-serif text-4xl">Reports</h1>
        <div className="flex gap-2">
          {(["open", "resolved", "all"] as const).map((f) => (
            <Button
              key={f}
              size="sm"
              variant={filter === f ? "default" : "outline"}
              className={filter === f ? "bg-gold text-primary-foreground hover:bg-gold/90" : ""}
              onClick={() => setFilter(f)}
            >
              {f}
            </Button>
          ))}
        </div>
      </header>

      {reports.length === 0 ? (
        <p className="text-muted-foreground">Nothing here.</p>
      ) : (
        <ul className="space-y-3">
          {reports.map((r) => (
            <li key={r.id} className="rounded-2xl border border-border bg-card p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-2 text-sm">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium uppercase tracking-widest text-gold">{r.category}</p>
                    {r.ai_severity && (
                      <span className={`rounded-full px-2 py-0.5 text-[10px] uppercase tracking-widest ${severityClass(r.ai_severity)}`}>
                        {r.ai_severity}
                        {r.ai_escalate ? " · escalate" : ""}
                      </span>
                    )}
                  </div>
                  {r.ai_summary && <p className="font-medium text-foreground">{r.ai_summary}</p>}
                  {r.ai_suggested_action && (
                    <p className="text-xs text-muted-foreground">Suggested: {r.ai_suggested_action}</p>
                  )}
                  {r.ai_labels && r.ai_labels.length > 0 && (
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{r.ai_labels.join(" · ")}</p>
                  )}
                  <p className="text-foreground/90 whitespace-pre-wrap">{r.details}</p>
                  <p className="font-mono text-xs text-muted-foreground">
                    reporter: {r.reporter_id}
                    {r.reported_user_id && <> · reported: {r.reported_user_id}</>}
                    {r.order_id && <> · order: {r.order_id}</>}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs uppercase tracking-widest ${
                    r.status === "open" ? "bg-destructive/20 text-destructive" : "bg-success/20 text-success"
                  }`}
                >
                  {r.status}
                </span>
              </div>
              {r.status === "open" && (
                <div className="mt-4 flex gap-2 border-t border-border pt-4">
                  <Button size="sm" className="bg-gold text-primary-foreground hover:bg-gold/90" onClick={() => setStatus(r.id, "resolved")}>
                    Mark resolved
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setStatus(r.id, "investigating")}>
                    Investigating
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
