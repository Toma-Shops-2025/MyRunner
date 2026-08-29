import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import { Home, ListOrdered, PlusCircle, Settings, Flag, LogOut } from "lucide-react";
import { SiteHeader } from "@/components/site/header";
import { SiteFooter } from "@/components/site/footer";
import { BackButton } from "@/components/site/back-button";
import { Button } from "@/components/ui/button";
import { useAuth, signOut } from "@/hooks/use-auth";
export const Route = createFileRoute("/app")({
  component: AppLayout,
});

const tabs = [
  { to: "/app/dashboard", label: "Dashboard", icon: Home },
  { to: "/app/new-delivery", label: "New delivery", icon: PlusCircle },
  { to: "/app/orders", label: "My orders", icon: ListOrdered },
  { to: "/app/report", label: "Report", icon: Flag },
  { to: "/app/settings", label: "Settings", icon: Settings },
] as const;

function AppLayout() {
  const nav = useNavigate();
  const router = useRouterState();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) nav({ to: "/login" });
  }, [loading, user, nav]);

  if (!user) return null;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <div className="container-app grid flex-1 gap-8 py-10 lg:grid-cols-[240px_1fr]">
        <aside className="space-y-1 lg:sticky lg:top-24 lg:self-start">
          <div className="mb-4 rounded-xl border border-border bg-card p-4">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Signed in</p>
            <p className="mt-1 font-serif text-lg">{user.user_metadata?.full_name ?? user.email?.split("@")[0]}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
          {tabs.map((t) => {
            const active = router.location.pathname === t.to;
            return (
              <Link
                key={t.to}
                to={t.to}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                  active ? "bg-gold/10 text-gold" : "text-foreground/80 hover:bg-accent"
                }`}
              >
                <t.icon className="size-4" />
                {t.label}
              </Link>
            );
          })}
          <Button
            variant="ghost"
            size="sm"
            className="mt-2 w-full justify-start text-muted-foreground"
            onClick={async () => { await signOut(); nav({ to: "/" }); }}
          >
            <LogOut className="mr-2 size-4" /> Sign out
          </Button>
        </aside>
        <div className="min-w-0 space-y-4">
          <BackButton fallbackTo="/app/dashboard" label="Back" />
          <Outlet />
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
