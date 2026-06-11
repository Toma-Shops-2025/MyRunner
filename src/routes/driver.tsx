import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { SiteHeader } from "@/components/site/header";
import { SiteFooter } from "@/components/site/footer";
import { Button } from "@/components/ui/button";
import { useAuth, signOut } from "@/hooks/use-auth";

export const Route = createFileRoute("/driver")({
  component: DriverLayout,
});

function DriverLayout() {
  const nav = useNavigate();
  const { user, loading, isDriver } = useAuth();

  useEffect(() => {
    if (!loading && (!user || !isDriver)) nav({ to: "/driver-signup" });
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
        <Outlet />
        <p className="mt-6 text-xs text-muted-foreground">
          Need help? <Link to="/contact" className="text-gold underline">Contact support</Link> · <Link to="/app/report" className="text-gold underline">Report an issue</Link>
        </p>
      </div>
      <SiteFooter />
    </div>
  );
}
