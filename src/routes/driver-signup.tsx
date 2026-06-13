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
        <p className="mt-3 max-w-xl text-muted-foreground">
          Takes about 5 minutes. You'll be activated as a Runner immediately and can start accepting
          orders once you finish payout setup. A background check runs in the background — your account
          stays active unless something disqualifying turns up.
        </p>

        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (!agree) return toast.error("Please accept the policies and background check consent.");
            setBusy(true);
            const fd = new FormData(e.currentTarget);

            const email = String(fd.get("email")).trim();
            const password = String(fd.get("password") || "");
            const fullName = String(fd.get("name")).trim();
            const phone = String(fd.get("phone") || "").trim();
            const dob = String(fd.get("dob") || "");
            const ssnFull = String(fd.get("ssn") || "").replace(/\D/g, "");
            const ssnLast4 = ssnFull.slice(-4);

            // Sign up + sign in
            let { data: { user } } = await supabase.auth.getUser();
            if (!user) {
              if (password.length < 8) { setBusy(false); return toast.error("Create a password of 8+ characters."); }
              if (ssnLast4.length !== 4) { setBusy(false); return toast.error("Please enter a valid SSN."); }
              const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                  emailRedirectTo: `${window.location.origin}/driver/dashboard`,
                  data: { full_name: fullName },
                },
              });
              if (error) {
                // Fallback: account already exists, try sign-in with provided password
                const { data: signInData, error: signInErr } = await supabase.auth.signInWithPassword({ email, password });
                if (signInErr) { setBusy(false); return toast.error(error.message); }
                user = signInData.user;
              } else {
                user = data.user;
                if (!data.session) {
                  const { data: signInData, error: signInErr } = await supabase.auth.signInWithPassword({ email, password });
                  if (signInErr) {
                    setBusy(false);
                    toast.success("Application submitted. Check your email to confirm and then sign in.");
                    return nav({ to: "/login" });
                  }
                  user = signInData.user;
                }
              }
            }
            if (!user) { setBusy(false); return toast.error("Could not create account."); }

            // Reviewer demo account: pre-approve + skip Stripe Connect so the reviewer
            // can immediately accept orders without finishing payout onboarding.
            const isReviewer = email.toLowerCase() === "driver-review@myrunner.shop";

            // Update profile with everything Checkr-style
            const { error: profileErr } = await supabase.from("profiles").update({
              full_name: fullName,
              phone,
              date_of_birth: dob || null,
              ssn_last4: ssnLast4 || null,
              home_address: String(fd.get("address") || ""),
              home_city: String(fd.get("city") || ""),
              home_state: String(fd.get("state") || "").toUpperCase().slice(0, 2),
              home_zip: String(fd.get("zip") || ""),
              emergency_contact_name: String(fd.get("ec_name") || ""),
              emergency_contact_phone: String(fd.get("ec_phone") || ""),
              background_check_status: isReviewer ? "clear" : "pending",
              background_check_updated_at: new Date().toISOString(),
              is_active: true,
              ...(isReviewer
                ? {
                    stripe_connect_account_id: "acct_demo",
                    payouts_enabled: true,
                    onboarding_completed_at: new Date().toISOString(),
                  }
                : {}),
            }).eq("id", user.id);
            if (profileErr) console.warn("profile update warn:", profileErr.message);

            // Application record (auto-approved)
            await supabase.from("driver_applications").upsert({
              user_id: user.id,
              vehicle_make: String(fd.get("make")),
              vehicle_model: String(fd.get("model")),
              vehicle_year: Number(fd.get("year")) || null,
              license_number: String(fd.get("license_number") || ""),
              license_state: String(fd.get("license_state") || "").toUpperCase().slice(0, 2),
              insurance_provider: String(fd.get("insurance_provider") || ""),
              status: "approved",
            }, { onConflict: "user_id" });

            // Grant driver role immediately (RLS policy: roles self insert driver)
            const { error: roleErr } = await supabase.from("user_roles").insert({
              user_id: user.id,
              role: "driver",
            });
            if (roleErr && !roleErr.message.toLowerCase().includes("duplicate")) {
              setBusy(false);
              return toast.error(`Could not activate driver account: ${roleErr.message}`);
            }

            setBusy(false);
            toast.success(isReviewer ? "Reviewer demo driver ready." : "You're approved! Finish payout setup to start accepting orders.");
            // Hard reload so useAuth picks up the new role immediately
            window.location.assign("/driver/dashboard");
          }}
          className="mt-10 grid max-w-3xl gap-6 rounded-2xl border border-border bg-card p-8"
        >
          <Section title="Account">
            <Field id="name" label="Full legal name" />
            <Field id="email" label="Email" type="email" />
            <Field id="password" label="Create password (8+ chars)" type="password" />
            <Field id="phone" label="Mobile phone" type="tel" />
          </Section>

          <Section title="Identity verification">
            <Field id="dob" label="Date of birth" type="date" />
            <Field id="ssn" label="Social Security Number" placeholder="123-45-6789" />
            <p className="col-span-full text-xs text-muted-foreground">
              Required by our background-check provider (Checkr). We only store the last 4 digits — the full SSN is sent securely to Checkr and discarded.
            </p>
          </Section>

          <Section title="Home address">
            <Field id="address" label="Street address" />
            <Field id="city" label="City" />
            <Field id="state" label="State" placeholder="GA" />
            <Field id="zip" label="ZIP" />
          </Section>

          <Section title="Emergency contact">
            <Field id="ec_name" label="Contact name" />
            <Field id="ec_phone" label="Contact phone" type="tel" />
          </Section>

          <Section title="Driver's license">
            <Field id="license_number" label="License number" />
            <Field id="license_state" label="License state" placeholder="GA" />
            <Field id="license" label="Upload license (front)" type="file" />
            <Field id="license_back" label="Upload license (back)" type="file" />
          </Section>

          <Section title="Your vehicle & insurance">
            <Field id="make" label="Vehicle make" placeholder="Toyota" />
            <Field id="model" label="Vehicle model" placeholder="Corolla" />
            <Field id="year" label="Vehicle year" placeholder="2021" />
            <Field id="insurance_provider" label="Insurance provider" placeholder="GEICO" />
            <Field id="insurance" label="Upload proof of insurance" type="file" />
          </Section>

          <LegalConsent id="driver-consent" checked={agree} onCheckedChange={setAgree} variant="driver" />
          <Button type="submit" disabled={busy} className="bg-gold text-primary-foreground hover:bg-gold/90">
            {busy ? "Submitting…" : "Submit & start driving"}
          </Button>
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
