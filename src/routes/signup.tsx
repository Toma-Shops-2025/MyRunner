import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { PageShell } from "@/components/site/page-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LegalConsent } from "@/components/site/legal-consent";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { toast } from "sonner";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Create your MyRunner account" },
      { name: "description", content: "Sign up for MyRunner to send deliveries, track Runners live, and earn loyalty points." },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "/signup" }],
  }),
  component: Signup,
});

function Signup() {
  const nav = useNavigate();
  const [agree, setAgree] = useState(false);
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
            if (!agree) return toast.error("Please accept the policies to continue.");
            setBusy(true);
            const fd = new FormData(e.currentTarget);
            const { error } = await supabase.auth.signUp({
              email: String(fd.get("email")),
              password: String(fd.get("password")),
              options: {
                emailRedirectTo: `${window.location.origin}/app/dashboard`,
                data: { full_name: String(fd.get("name")) },
              },
            });
            setBusy(false);
            if (error) return toast.error(error.message);
            toast.success("Welcome to MyRunner.");
            nav({ to: "/app/dashboard" });
          }}
          className="w-full max-w-md rounded-2xl border border-border bg-card p-8"
        >
          <h1 className="font-serif text-4xl">Create account</h1>
          <p className="mt-2 text-sm text-muted-foreground">Send deliveries in 60 seconds.</p>
          <div className="mt-6 space-y-4">
            <div className="grid gap-2"><Label htmlFor="name">Full name</Label><Input id="name" name="name" required /></div>
            <div className="grid gap-2"><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" required /></div>
            <div className="grid gap-2"><Label htmlFor="password">Password</Label><Input id="password" name="password" type="password" required minLength={8} /></div>
            <LegalConsent id="signup-consent" checked={agree} onCheckedChange={setAgree} />
            <Button type="submit" disabled={busy} className="w-full bg-gold text-primary-foreground hover:bg-gold/90">Create account</Button>
            <Button type="button" variant="outline" className="w-full" onClick={google}>Continue with Google</Button>
          </div>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already a member? <Link to="/login" className="text-gold underline">Sign in</Link>
          </p>
          <p className="mt-2 text-center text-xs text-muted-foreground">
            Want to drive instead? <Link to="/driver-signup" className="text-gold underline">Apply as a Runner</Link>
          </p>
        </form>
      </section>
    </PageShell>
  );
}
