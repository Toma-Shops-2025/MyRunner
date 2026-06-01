import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { PageShell } from "@/components/site/page-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LegalConsent } from "@/components/site/legal-consent";
import { store } from "@/lib/local-store";
import { toast } from "sonner";

export const Route = createFileRoute("/driver-signup")({
  head: () => ({
    meta: [
      { title: "Become a Runner — Apply to drive for MyRunner" },
      { name: "description", content: "Apply to drive for MyRunner. Submit your license, insurance, vehicle info, and pass a Checkr background check." },
      { property: "og:title", content: "Apply to drive — MyRunner" },
      { property: "og:url", content: "/driver-signup" },
    ],
    links: [{ rel: "canonical", href: "/driver-signup" }],
  }),
  component: DriverSignup,
});

function DriverSignup() {
  const nav = useNavigate();
  const [agree, setAgree] = useState(false);
  return (
    <PageShell>
      <section className="container-app py-16">
        <p className="text-xs uppercase tracking-widest text-gold">Driver application</p>
        <h1 className="mt-3 font-serif text-5xl">Apply to drive</h1>
        <p className="mt-3 max-w-xl text-muted-foreground">It takes about 5 minutes. You can start accepting deliveries while your background check processes.</p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!agree) return toast.error("Please accept the policies and background check consent.");
            const fd = new FormData(e.currentTarget);
            store.setUser({
              id: crypto.randomUUID(),
              email: String(fd.get("email")),
              name: String(fd.get("name")),
              role: "driver",
              createdAt: Date.now(),
            });
            toast.success("Application submitted. Welcome aboard.");
            nav({ to: "/driver/dashboard" });
          }}
          className="mt-10 grid max-w-3xl gap-6 rounded-2xl border border-border bg-card p-8"
        >
          <Section title="About you">
            <Field id="name" label="Full name" />
            <Field id="email" label="Email" type="email" />
            <Field id="phone" label="Phone" type="tel" />
            <Field id="dob" label="Date of birth" type="date" />
          </Section>
          <Section title="Your vehicle">
            <Field id="make" label="Make" placeholder="Toyota" />
            <Field id="model" label="Model" placeholder="Corolla" />
            <Field id="year" label="Year" placeholder="2021" />
            <Field id="plate" label="License plate" />
          </Section>
          <Section title="Documents">
            <Field id="license" label="Driver's license" type="file" />
            <Field id="insurance" label="Proof of insurance" type="file" />
          </Section>
          <Section title="Optional">
            <Field id="referral" label="Referral code" placeholder="Friend's code" />
          </Section>
          <LegalConsent id="driver-consent" checked={agree} onCheckedChange={setAgree} variant="driver" />
          <Button type="submit" className="bg-gold text-primary-foreground hover:bg-gold/90">Submit application</Button>
        </form>
      </section>
    </PageShell>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-serif text-2xl">{title}</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">{children}</div>
    </div>
  );
}
function Field({ id, label, type = "text", placeholder }: { id: string; label: string; type?: string; placeholder?: string }) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} name={id} type={type} placeholder={placeholder} required={type !== "file" && id !== "referral"} />
    </div>
  );
}
