import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { AuthPageSection } from "@/components/site/auth-page-section";
import { PageShell } from "@/components/site/page-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LegalConsent } from "@/components/site/legal-consent";
import { supabase } from "@/integrations/supabase/client";
import { activateDriverRole } from "@/lib/driver-signup.functions";
import { attachDriverReferrer } from "@/lib/referral.functions";
import { clearDriverReferralCode, readDriverReferralCode } from "@/lib/signup-intent";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { SSN_LAST4_CHECKR_STATEMENT } from "@/lib/public-facts";

const DRIVER_APPROVED_KEY = "myrunner-driver-just-approved";

function goToDriverDashboard() {
  sessionStorage.setItem(DRIVER_APPROVED_KEY, String(Date.now()));
  window.location.replace("/driver/dashboard");
}

export const Route = createFileRoute("/driver-signup")({
  head: () => ({
    meta: [
      { title: "Become a Runner — Apply to drive for MyRunner" },
      { name: "description", content: "Apply to drive for MyRunner. After launch in a city or state, drivers there can start once the application, a driver's license, and auto insurance are provided. Disqualifying charges found once Checkr is used deactivate the driver." },
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
      return;
    }
    void supabase
      .from("driver_applications")
      .select("status")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data?.status === "approved") goToDriverDashboard();
      });
  }, [loading, user, isDriver, nav]);

  if (loading || !user || isDriver) {
    return (
      <PageShell>
        <AuthPageSection>
          <p className="text-sm text-muted-foreground">Loading…</p>
        </AuthPageSection>
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
      <AuthPageSection className="max-w-3xl">
        <p className="text-xs uppercase tracking-widest text-gold">Driver application</p>
        <h1 className="mt-3 font-serif text-5xl">Apply to drive</h1>
        <p className="mt-3 max-w-xl text-muted-foreground">
          Coming to your city very soon!!! Takes about 5 minutes. After MyRunner launches in a city or state, drivers there can start driving after the application, a driver's license, and their own auto insurance are provided. Once MyRunner uses Checkr, a driver is deactivated if any disqualifying charges are found. Support is available 24/7 after that launch.
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
            const ssnLast4 = String(fd.get("ssn_last4") || "").replace(/\D/g, "").slice(0, 4);

            if (ssnLast4.length !== 4) {
              setBusy(false);
              return toast.error("Please enter the last four digits of your Social Security number.");
            }

            const currentUser = user;
            if (!currentUser) {
              setBusy(false);
              return toast.error("Please sign in to continue your application.");
            }

            const isReviewer = email.toLowerCase() === "driver-review@myrunner.shop";

            try {
              await activateRole({
                data: {
                  fullName,
                  phone,
                  dob: dob || undefined,
                  ssnLast4,
                  homeAddress: String(fd.get("address") || ""),
                  homeCity: String(fd.get("city") || ""),
                  homeState: String(fd.get("state") || "").toUpperCase().slice(0, 2),
                  homeZip: String(fd.get("zip") || ""),
                  emergencyContactName: String(fd.get("ec_name") || ""),
                  emergencyContactPhone: String(fd.get("ec_phone") || ""),
                  vehicleMake: String(fd.get("make")),
                  vehicleModel: String(fd.get("model")),
                  vehicleYear: Number(fd.get("year")) || null,
                  licenseNumber: String(fd.get("license_number") || ""),
                  licenseState: String(fd.get("license_state") || "").toUpperCase().slice(0, 2),
                  insuranceProvider: String(fd.get("insurance_provider") || ""),
                  isReviewer,
                },
              });
            } catch (err) {
              setBusy(false);
              return toast.error(
                `Could not save application: ${(err as Error).message || "unknown error"}`,
              );
            }

            const refCode = readDriverReferralCode();
            if (refCode) {
              try {
                await attachDriverReferrer({ data: { code: refCode } });
                clearDriverReferralCode();
              } catch (e) {
                console.warn("referral attach failed:", (e as Error).message);
              }
            }

            // Fire-and-forget background check (no-op if Checkr keys not set yet)
            if (!isReviewer) {
              try {
                const { startDriverBackgroundCheck } = await import("@/lib/checkr.functions");
                void startDriverBackgroundCheck();
              } catch (e) {
                console.warn("background check kickoff failed:", (e as Error).message);
              }
            }

            toast.success(
              isReviewer
                ? "Reviewer demo driver ready — opening dashboard…"
                : "Application saved. After MyRunner launches in a city or state, drivers there can start once the application, a driver's license, and auto insurance are provided.",
            );
            goToDriverDashboard();
          }}
          className="mt-10 grid gap-6 rounded-2xl border border-border bg-card p-4 sm:p-8"
        >
          <Section title="Your account">
            <Field id="name" label="Full legal name" defaultValue={profileName} />
            <Field id="email" label="Email" type="email" defaultValue={profileEmail} readOnly />
            <Field id="phone" label="Mobile phone" type="tel" />
          </Section>

          <Section title="Identity verification">
            <Field id="dob" label="Date of birth" type="date" />
            <div className="grid gap-2 sm:col-span-2">
              <Label htmlFor="ssn_last4">Social Security number — last 4 digits only</Label>
              <Input
                id="ssn_last4"
                name="ssn_last4"
                inputMode="numeric"
                autoComplete="off"
                placeholder="6789"
                maxLength={4}
                pattern="[0-9]{4}"
                required
                className="max-w-[8rem] tracking-widest"
              />
              <p className="text-xs leading-relaxed text-muted-foreground">{SSN_LAST4_CHECKR_STATEMENT}</p>
            </div>
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
      </AuthPageSection>
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
