import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import { ShieldCheck, Users, FileWarning, Package, LogOut } from "lucide-react";
import { SiteHeader } from "@/components/site/header";
import { SiteFooter } from "@/components/site/footer";
import { Button } from "@/components/ui/button";
import { useAuth, signOut } from "@/hooks/use-auth";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — MyRunner" }, { name: "robots", content: "noindex" }] }),
  component: AdminLayout,
});

const tabs = [
  { to: "/admin/dashboard", label: "Overview", icon: ShieldCheck },
  { to: "/admin/applications", label: "Driver applications", icon: Users },
  { to: "/admin/reports", label: "Reports", icon: FileWarning },
  { to: "/admin/orders", label: "All orders", icon: Package },
] as const;

function AdminLayout() {
  const nav = useNavigate();
  const router = useRouterState();
  const { user, isAdmin, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (!user) nav({ to: "/login" });
    else if (!isAdmin) nav({ to: "/app/dashboard" });
  }, [loading, user, isAdmin, nav]);

  if (!user || !isAdmin) return null;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <div className="container-app grid flex-1 gap-8 py-10 lg:grid-cols-[240px_1fr]">
        <aside className="space-y-1 lg:sticky lg:top-24 lg:self-start">
          <div className="mb-4 rounded-xl border border-gold/30 bg-gold-soft p-4">
            <p className="text-xs uppercase tracking-widest text-gold">Admin console</p>
            <p className="mt-1 font-serif text-lg">{user.email}</p>
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
        <div className="min-w-0">
          <Outlet />
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
