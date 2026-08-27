import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { PageShell } from "@/components/site/page-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LegalConsent } from "@/components/site/legal-consent";
import { supabase } from "@/integrations/supabase/client";
import { signInWithGoogle } from "@/lib/auth-google";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Create your MyRunner account" },
      {
        name: "description",
        content:
          "Sign up for MyRunner to send deliveries, track Runners live, and earn loyalty points.",
      },
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
  const [googleBusy, setGoogleBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function google() {
    if (!agree) return toast.error("Please accept the policies to continue.");
    setGoogleBusy(true);
    const { error } = await signInWithGoogle();
    if (error) {
      setGoogleBusy(false);
      toast.error(
        error.message || "Google sign-in failed. Check that Google is enabled in Supabase.",
      );
    }
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
            const email = String(fd.get("email"));
            const fullName = String(fd.get("name"));
            const { data: authData, error } = await supabase.auth.signUp({
              email: email,
              password: String(fd.get("password")),
              options: {
                emailRedirectTo: `${window.location.origin}/auth/callback`,
                data: { full_name: fullName },
              },
            });

            if (!error && authData.user) {
              await supabase
                .from("profiles")
                .upsert({
                  id: authData.user.id,
                  full_name: fullName,
                  email: email,
                })
                .catch((err) => console.warn("Profile sync error", err));
            }
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
            <Button
              type="button"
              variant="outline"
              className="w-full"
              disabled={googleBusy}
              onClick={google}
            >
              {googleBusy ? "Redirecting to Google…" : "Continue with Google"}
            </Button>
            <div className="relative py-1 text-center text-xs uppercase tracking-widest text-muted-foreground">
              <span className="relative z-10 bg-card px-2">or email</span>
              <span className="absolute inset-x-0 top-1/2 border-t border-border" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="name">Full name</Label>
              <Input id="name" name="name" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={8}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <LegalConsent id="signup-consent" checked={agree} onCheckedChange={setAgree} />
            <Button
              type="submit"
              disabled={busy}
              className="w-full bg-gold text-primary-foreground hover:bg-gold/90"
            >
              Create account
            </Button>
          </div>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already a member?{" "}
            <Link to="/login" className="text-gold underline">
              Sign in
            </Link>
          </p>
          <p className="mt-2 text-center text-xs text-muted-foreground">
            Want to drive instead?{" "}
            <Link to="/driver-signup" className="text-gold underline">
              Apply as a Runner
            </Link>
          </p>
        </form>
      </section>
    </PageShell>
  );
}
