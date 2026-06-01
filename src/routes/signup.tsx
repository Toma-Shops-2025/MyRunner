import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { PageShell } from "@/components/site/page-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LegalConsent } from "@/components/site/legal-consent";
import { store } from "@/lib/local-store";
import { toast } from "sonner";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Create your MyRunner account" },
      { name: "description", content: "Sign up for MyRunner to send deliveries, track Runners live, and earn loyalty points." },
      { property: "og:title", content: "Sign up — MyRunner" },
      { property: "og:url", content: "/signup" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "/signup" }],
  }),
  component: Signup,
});

function Signup() {
  const nav = useNavigate();
  const [agree, setAgree] = useState(false);
  return (
    <PageShell>
      <section className="container-app grid min-h-[80vh] place-items-center py-16">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!agree) return toast.error("Please accept the policies to continue.");
            const fd = new FormData(e.currentTarget);
            store.setUser({
              id: crypto.randomUUID(),
              email: String(fd.get("email")),
              name: String(fd.get("name")),
              role: "customer",
              createdAt: Date.now(),
            });
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
            <Button type="submit" className="w-full bg-gold text-primary-foreground hover:bg-gold/90">Create account</Button>
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
