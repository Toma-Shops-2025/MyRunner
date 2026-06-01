import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/site/header";
import { SiteFooter } from "@/components/site/footer";
import { store, type User } from "@/lib/local-store";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/driver")({
  component: DriverLayout,
});

function DriverLayout() {
  const nav = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    const u = store.getUser();
    if (!u || u.role !== "driver") nav({ to: "/driver-signup" });
    else setUser(u);
  }, [nav]);
  if (!user) return null;
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <div className="container-app flex-1 py-10">
        <div className="mb-6 flex items-center justify-between rounded-2xl border border-border bg-card p-5">
          <div>
            <p className="text-xs uppercase tracking-widest text-gold">Driver</p>
            <p className="font-serif text-2xl">{user.name}</p>
          </div>
          <Button variant="ghost" onClick={() => { store.setUser(null); nav({ to: "/" }); }}>Sign out</Button>
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
