import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { PageShell } from "@/components/site/page-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LegalConsent } from "@/components/site/legal-consent";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/driver-signup")({
  head: () => ({
    meta: [
      { title: "Become a Runner — Apply to drive for MyRunner" },
      { name: "description", content: "Apply to drive for MyRunner. Submit your license, insurance, vehicle info, and pass a background check." },
    ],
    links: [{ rel: "canonical", href: "/driver-signup" }],
  }),
  component: DriverSignup,
});

function DriverSignup() {
  const nav = useNavigate();
  const [agree, setAgree] = useState(false);
  const [busy, setBusy] = useState(false);

  return (
    <PageShell>
      <section className="container-app py-16">
        <p className="text-xs uppercase tracking-widest text-gold">Driver application</p>
        <h1 className="mt-3 font-serif text-5xl">Apply to drive</h1>
        <p className="mt-3 max-w-xl text-muted-foreground">It takes about 5 minutes. You'll create an account first, then we'll review your documents.</p>

        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (!agree) return toast.error("Please accept the policies and background check consent.");
            setBusy(true);
            const fd = new FormData(e.currentTarget);

            // Ensure user is signed in (sign up if not)
            let { data: { user } } = await supabase.auth.getUser();
            if (!user) {
              const password = String(fd.get("password") || "");
              if (password.length < 8) { setBusy(false); return toast.error("Create a password of 8+ characters."); }
              const { data, error } = await supabase.auth.signUp({
                email: String(fd.get("email")),
                password,
                options: {
                  emailRedirectTo: `${window.location.origin}/driver/dashboard`,
                  data: { full_name: String(fd.get("name")) },
                },
              });
              if (error) { setBusy(false); return toast.error(error.message); }
              user = data.user;
            }
            if (!user) { setBusy(false); return toast.error("Could not create account."); }

            // Driver application
            const { error: appErr } = await supabase.from("driver_applications").upsert({
              user_id: user.id,
              vehicle_make: String(fd.get("make")),
              vehicle_model: String(fd.get("model")),
              vehicle_year: Number(fd.get("year")) || null,
              license_number: String(fd.get("plate") || ""),
            }, { onConflict: "user_id" });
            if (appErr) { setBusy(false); return toast.error(appErr.message); }

            // Driver role
            await supabase.from("user_roles").insert({ user_id: user.id, role: "driver" });

            setBusy(false);
            toast.success("Application submitted. Welcome aboard.");
            nav({ to: "/driver/dashboard" });
          }}
          className="mt-10 grid max-w-3xl gap-6 rounded-2xl border border-border bg-card p-8"
        >
          <Section title="Account">
            <Field id="name" label="Full name" />
            <Field id="email" label="Email" type="email" />
            <Field id="password" label="Create password (8+ chars)" type="password" />
            <Field id="phone" label="Phone" type="tel" />
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
          <LegalConsent id="driver-consent" checked={agree} onCheckedChange={setAgree} variant="driver" />
          <Button type="submit" disabled={busy} className="bg-gold text-primary-foreground hover:bg-gold/90">Submit application</Button>
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
      <Input id={id} name={id} type={type} placeholder={placeholder} required={type !== "file"} />
    </div>
  );
}
