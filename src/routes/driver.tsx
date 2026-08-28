import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { SiteHeader } from "@/components/site/header";
import { SiteFooter } from "@/components/site/footer";
import { BackButton } from "@/components/site/back-button";
import { PayoutSetupBanner } from "@/components/site/payout-setup-banner";
import { Button } from "@/components/ui/button";
import { useAuth, signOut } from "@/hooks/use-auth";

const DRIVER_APPROVED_KEY = "myrunner-driver-just-approved";

function recentlyApprovedDriver(): boolean {
  const raw = sessionStorage.getItem(DRIVER_APPROVED_KEY);
  if (!raw) return false;
  const ts = Number(raw);
  if (!Number.isFinite(ts) || Date.now() - ts > 300_000) {
    sessionStorage.removeItem(DRIVER_APPROVED_KEY);
    return false;
  }
  return true;
}

export const Route = createFileRoute("/driver")({
  component: DriverLayout,
});

function DriverLayout() {
  const nav = useNavigate();
  const { user, loading, isDriver } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      nav({ to: "/driver-signup" });
      return;
    }
    if (isDriver) {
      sessionStorage.removeItem(DRIVER_APPROVED_KEY);
      return;
    }
    if (!recentlyApprovedDriver()) {
      nav({ to: "/driver-signup" });
    }
  }, [loading, user, isDriver, nav]);

  if (!user) return null;
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <div className="container-app flex-1 py-10">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card p-5">
          <div>
            <p className="text-xs uppercase tracking-widest text-gold">Driver</p>
            <p className="font-serif text-2xl">{user.user_metadata?.full_name ?? user.email?.split("@")[0]}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" asChild><Link to="/driver/dashboard">Dashboard</Link></Button>
            <Button variant="ghost" asChild><Link to="/driver/earnings">Earnings</Link></Button>
            <Button variant="ghost" onClick={async () => { await signOut(); nav({ to: "/" }); }}>Sign out</Button>
          </div>
        </div>
        <PayoutSetupBanner />
        <div className="mb-4">
          <BackButton fallbackTo="/driver/dashboard" />
        </div>
        <Outlet />
        <p className="mt-6 text-xs text-muted-foreground">
          Need help? <Link to="/contact" className="text-gold underline">Contact support</Link> · <Link to="/app/report" className="text-gold underline">Report an issue</Link>
        </p>
      </div>
      <SiteFooter />
    </div>
  );
}
