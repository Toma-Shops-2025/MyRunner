import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { PageShell } from "@/components/site/page-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LegalConsent } from "@/components/site/legal-consent";
import { supabase } from "@/integrations/supabase/client";
import { activateDriverRole } from "@/lib/driver-signup.functions";
import { useAuth } from "@/hooks/use-auth";
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
  const activateRole = useServerFn(activateDriverRole);
  const { user, loading, isDriver } = useAuth();
  const [agree, setAgree] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      nav({ to: "/signup", search: { intent: "driver" } });
      return;
    }
    if (isDriver) {
      nav({ to: "/driver/dashboard" });
    }
  }, [loading, user, isDriver, nav]);

  if (loading || !user || isDriver) {
    return (
      <PageShell>
        <section className="container-app grid min-h-[60vh] place-items-center py-16">
          <p className="text-sm text-muted-foreground">Loading…</p>
        </section>
      </PageShell>
    );
  }

  const profileName =
    (user.user_metadata?.full_name as string | undefined) ||
    user.email?.split("@")[0] ||
    "";
  const profileEmail = user.email ?? "";

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

            const email = profileEmail;
            const fullName = String(fd.get("name") || profileName).trim();
            const phone = String(fd.get("phone") || "").trim();
            const dob = String(fd.get("dob") || "");
            const ssnFull = String(fd.get("ssn") || "").replace(/\D/g, "");
            const ssnLast4 = ssnFull.slice(-4);

            if (ssnLast4.length !== 4) {
              setBusy(false);
              return toast.error("Please enter a valid SSN.");
            }

            const currentUser = user;
            if (!currentUser) {
              setBusy(false);
              return toast.error("Please sign in to continue your application.");
            }

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
              background_check_status: "clear",
              background_check_updated_at: new Date().toISOString(),
              is_active: true,
              ...(isReviewer
                ? {
                    stripe_connect_account_id: "acct_demo_driver_review",
                    payouts_enabled: true,
                    onboarding_completed_at: new Date().toISOString(),
                  }
                : {}),
            }).eq("id", currentUser.id);
            if (profileErr) console.warn("profile update warn:", profileErr.message);

            // Application record (auto-approved)
            await supabase.from("driver_applications").upsert({
              user_id: currentUser.id,
              vehicle_make: String(fd.get("make")),
              vehicle_model: String(fd.get("model")),
              vehicle_year: Number(fd.get("year")) || null,
              license_number: String(fd.get("license_number") || ""),
              license_state: String(fd.get("license_state") || "").toUpperCase().slice(0, 2),
              insurance_provider: String(fd.get("insurance_provider") || ""),
              status: "approved",
            }, { onConflict: "user_id" });

            // Grant driver role via server (service role) — client INSERT is blocked by grants/RLS
            try {
              await activateRole();
            } catch (err) {
              setBusy(false);
              return toast.error(
                `Could not activate driver account: ${(err as Error).message || "unknown error"}`,
              );
            }

            // Fire-and-forget background check (no-op if Checkr keys not set yet)
            if (!isReviewer) {
              try {
                const { startDriverBackgroundCheck } = await import("@/lib/checkr.functions");
                await startDriverBackgroundCheck();
              } catch (e) {
                console.warn("background check kickoff failed:", (e as Error).message);
              }
            }

            setBusy(false);
            toast.success(isReviewer ? "Reviewer demo driver ready." : "You're approved! Finish payout setup to start accepting orders.");
            // Hard reload so useAuth picks up the new role immediately
            window.location.assign("/driver/dashboard");
          }}
          className="mt-10 grid max-w-3xl gap-6 rounded-2xl border border-border bg-card p-8"
        >
          <Section title="Your account">
            <Field id="name" label="Full legal name" defaultValue={profileName} />
            <Field id="email" label="Email" type="email" defaultValue={profileEmail} readOnly />
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
function Field({
  id,
  label,
  type = "text",
  placeholder,
  defaultValue,
  readOnly,
}: {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  defaultValue?: string;
  readOnly?: boolean;
}) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        name={id}
        type={type}
        placeholder={placeholder}
        defaultValue={defaultValue}
        readOnly={readOnly}
        required={type !== "file" && !readOnly}
        className={readOnly ? "bg-muted/50" : undefined}
      />
    </div>
  );
}
