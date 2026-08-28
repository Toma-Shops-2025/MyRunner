import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { PageShell } from "@/components/site/page-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LegalConsent } from "@/components/site/legal-consent";
import { supabase } from "@/integrations/supabase/client";
import { signInWithGoogle } from "@/lib/auth-google";
import {
  parseSignupIntent,
  setSignupIntent,
  type SignupIntent,
} from "@/lib/signup-intent";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

export const Route = createFileRoute("/signup")({
  validateSearch: (search: Record<string, unknown>) => ({
    intent: parseSignupIntent(search.intent),
  }),
  head: () => ({
    meta: [
      { title: "Create your MyRunner account" },
      {
        name: "description",
        content:
          "Sign up for MyRunner to send deliveries or apply to drive as a Runner.",
      },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "/signup" }],
  }),
  component: Signup,
});

function Signup() {
  const { intent: initialIntent } = Route.useSearch();
  const nav = useNavigate();
  const [intent, setIntent] = useState<SignupIntent>(initialIntent);
  const [agree, setAgree] = useState(false);
  const [busy, setBusy] = useState(false);
  const [googleBusy, setGoogleBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isDriver = intent === "driver";

  async function google() {
    if (!agree) return toast.error("Please accept the policies to continue.");
    setGoogleBusy(true);
    setSignupIntent(intent);
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
                data: { full_name: fullName, signup_intent: intent },
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

            if (!authData.session) {
              toast.success(
                isDriver
                  ? "Check your email to confirm, then sign in to finish your driver application."
                  : "Check your email to confirm your account, then sign in.",
              );
              return nav({ to: "/login" });
            }

            toast.success(isDriver ? "Account created — finish your driver application." : "Welcome to MyRunner.");
            nav({ to: isDriver ? "/driver-signup" : "/app/dashboard" });
          }}
          className="w-full max-w-md rounded-2xl border border-border bg-card p-8"
        >
          <h1 className="font-serif text-4xl">Create account</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {isDriver
              ? "Sign up as a Runner, then complete your driver application."
              : "Sign up to send deliveries and track your Runners live."}
          </p>

          <div className="mt-6 grid grid-cols-2 gap-2 rounded-xl border border-border bg-muted/30 p-1">
            <button
              type="button"
              onClick={() => setIntent("customer")}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                !isDriver
                  ? "bg-gold text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Send deliveries
            </button>
            <button
              type="button"
              onClick={() => setIntent("driver")}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isDriver
                  ? "bg-gold text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Drive & earn
            </button>
          </div>

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
              {isDriver ? "Create account & apply to drive" : "Create customer account"}
            </Button>
          </div>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already a member?{" "}
            <Link to="/login" className="text-gold underline">
              Sign in
            </Link>
          </p>
        </form>
      </section>
    </PageShell>
  );
}
