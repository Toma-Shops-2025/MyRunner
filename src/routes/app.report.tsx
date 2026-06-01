import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { LegalConsent } from "@/components/site/legal-consent";
import { toast } from "sonner";

export const Route = createFileRoute("/app/report")({
  head: () => ({
    meta: [
      { title: "Report an issue — MyRunner" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ReportPage,
});

const reasons = [
  "Harassment or threats",
  "Discrimination",
  "Theft or missing item",
  "Damaged item",
  "Driver intoxication / dangerous driving",
  "Suspicious or illegal activity",
  "Sexual misconduct",
  "Inappropriate behavior",
  "Spam / fraud",
  "Other",
];

function ReportPage() {
  const nav = useNavigate();
  const [reason, setReason] = useState<string | undefined>();
  const [agree, setAgree] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-4xl">Report an issue</h1>
        <p className="text-muted-foreground">
          Report a customer, Runner, or order for illegal or rule‑breaking behavior. We review every report and respond within 1–3 business days.
        </p>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!reason) return toast.error("Please choose a reason.");
          if (!agree) return toast.error("Please confirm the report is truthful.");
          toast.success("Report submitted. Thank you for keeping MyRunner safe.");
          nav({ to: "/app/dashboard" });
        }}
        className="grid gap-6 rounded-2xl border border-border bg-card p-8"
      >
        <div className="grid gap-2">
          <Label htmlFor="target">Who are you reporting?</Label>
          <Input id="target" placeholder="Order # or driver/customer code" required />
        </div>
        <div className="grid gap-2">
          <Label>Reason</Label>
          <Select value={reason} onValueChange={setReason}>
            <SelectTrigger><SelectValue placeholder="Select a reason" /></SelectTrigger>
            <SelectContent>
              {reasons.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="details">What happened?</Label>
          <Textarea id="details" rows={6} required placeholder="Tell us as much as you can. Include dates, times, and any specifics." />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="evidence">Evidence (optional)</Label>
          <Input id="evidence" type="file" multiple accept="image/*" />
        </div>
        <LegalConsent id="report-consent" checked={agree} onCheckedChange={setAgree} variant="report" />
        <p className="text-xs text-muted-foreground">
          In immediate danger? Call your local emergency services first, then file a report here.
        </p>
        <Button type="submit" className="bg-gold text-primary-foreground hover:bg-gold/90">Submit report</Button>
      </form>
    </div>
  );
}
