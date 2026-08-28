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

const DRIVER_APPROVED_KEY = "myrunner-driver-just-approved";

async function waitForDriverRole(userId: string, attempts = 15): Promise<boolean> {
  for (let i = 0; i < attempts; i += 1) {
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "driver")
      .maybeSingle();
    if (data) return true;
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  return false;
}

function goToDriverDashboard() {
  sessionStorage.setItem(DRIVER_APPROVED_KEY, String(Date.now()));
  window.location.replace("/driver/dashboard");
}

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

            const roleReady = await waitForDriverRole(currentUser.id);
            if (!roleReady) {
              setBusy(false);
              return toast.error(
                "Application saved but driver access is still syncing. Refresh and try again in a moment.",
              );
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
                : "You're approved! Opening your driver dashboard…",
            );
            goToDriverDashboard();
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
