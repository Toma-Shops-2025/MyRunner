import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { PageShell } from "@/components/site/page-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { toast } from "sonner";
import { useState } from "react";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — MyRunner" },
      { name: "description", content: "Sign in to your MyRunner account to send and track deliveries." },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "/login" }],
  }),
  component: Login,
});

function Login() {
  const nav = useNavigate();
  const [busy, setBusy] = useState(false);

  async function google() {
    const res = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/app/dashboard" });
    if (res.error) toast.error("Google sign-in failed.");
  }

  return (
    <PageShell>
      <section className="container-app grid min-h-[80vh] place-items-center py-16">
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setBusy(true);
            const fd = new FormData(e.currentTarget);
            const { error } = await supabase.auth.signInWithPassword({
              email: String(fd.get("email")),
              password: String(fd.get("password")),
            });
            setBusy(false);
            if (error) return toast.error(error.message);
            toast.success("Welcome back.");
            nav({ to: "/app/dashboard" });
          }}
          className="w-full max-w-md rounded-2xl border border-border bg-card p-8"
        >
          <h1 className="font-serif text-4xl">Welcome back</h1>
          <p className="mt-2 text-sm text-muted-foreground">Sign in to continue.</p>
          <div className="mt-6 space-y-4">
            <div className="grid gap-2"><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" required /></div>
            <div className="grid gap-2"><Label htmlFor="password">Password</Label><Input id="password" name="password" type="password" required /></div>
            <Button type="submit" disabled={busy} className="w-full bg-gold text-primary-foreground hover:bg-gold/90">Sign in</Button>
            <Button type="button" variant="outline" className="w-full" onClick={google}>Continue with Google</Button>
          </div>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            New here? <Link to="/signup" className="text-gold underline">Create an account</Link>
          </p>
        </form>
      </section>
    </PageShell>
  );
}
