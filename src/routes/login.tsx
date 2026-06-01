import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { PageShell } from "@/components/site/page-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { store } from "@/lib/local-store";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — MyRunner" },
      { name: "description", content: "Sign in to your MyRunner account to send and track deliveries." },
      { property: "og:title", content: "Sign in — MyRunner" },
      { property: "og:url", content: "/login" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "/login" }],
  }),
  component: Login,
});

function Login() {
  const nav = useNavigate();
  return (
    <PageShell>
      <section className="container-app grid min-h-[80vh] place-items-center py-16">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            const existing = store.getUser();
            store.setUser({
              id: existing?.id ?? crypto.randomUUID(),
              email: String(fd.get("email")),
              name: existing?.name ?? String(fd.get("email")).split("@")[0],
              role: existing?.role ?? "customer",
              createdAt: existing?.createdAt ?? Date.now(),
            });
            toast.success("Welcome back.");
            nav({ to: existing?.role === "driver" ? "/driver/dashboard" : "/app/dashboard" });
          }}
          className="w-full max-w-md rounded-2xl border border-border bg-card p-8"
        >
          <h1 className="font-serif text-4xl">Welcome back</h1>
          <p className="mt-2 text-sm text-muted-foreground">Sign in to continue.</p>
          <div className="mt-6 space-y-4">
            <div className="grid gap-2"><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" required /></div>
            <div className="grid gap-2"><Label htmlFor="password">Password</Label><Input id="password" name="password" type="password" required /></div>
            <Button type="submit" className="w-full bg-gold text-primary-foreground hover:bg-gold/90">Sign in</Button>
          </div>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            New here? <Link to="/signup" className="text-gold underline">Create an account</Link>
          </p>
        </form>
      </section>
    </PageShell>
  );
}
