import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { PageShell } from "@/components/site/page-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { signInWithGoogle } from "@/lib/auth-google";
import { resolvePostAuthDestination } from "@/lib/auth.functions";
import { intentFromMetadata } from "@/lib/signup-intent";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — MyRunner" },
      {
        name: "description",
        content: "Sign in to your MyRunner account to send and track deliveries.",
      },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "/login" }],
  }),
  component: Login,
});

function Login() {
  const nav = useNavigate();
  const resolveDest = useServerFn(resolvePostAuthDestination);
  const [busy, setBusy] = useState(false);
  const [googleBusy, setGoogleBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function google() {
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
            setBusy(true);
            const fd = new FormData(e.currentTarget);
            const { data, error } = await supabase.auth.signInWithPassword({
              email: String(fd.get("email")),
              password: String(fd.get("password")),
            });
            setBusy(false);
            if (error) return toast.error(error.message);
            try {
              const dest = await Promise.race([
                resolveDest(),
                new Promise<never>((_, reject) =>
                  setTimeout(() => reject(new Error("timeout")), 8000),
                ),
              ]);
              const signupIntent = intentFromMetadata(data.user?.user_metadata);
              toast.success("Welcome back.");
              if (dest.to === "/app/dashboard" && signupIntent === "driver") {
                nav({ to: "/driver-signup" });
              } else {
                nav({ to: dest.to });
              }
            } catch {
              const roles = data.user ? await fetchUserRoles(data.user.id) : [];
              const signupIntent = intentFromMetadata(data.user?.user_metadata);
              toast.success("Welcome back.");
              if (roles.includes("driver")) {
                nav({ to: "/driver/dashboard" });
              } else if (signupIntent === "driver") {
                nav({ to: "/driver-signup" });
              } else {
                nav({ to: "/app/dashboard" });
              }
            }
          }}
          className="w-full max-w-md rounded-2xl border border-border bg-card p-8"
        >
          <h1 className="font-serif text-4xl">Welcome back</h1>
          <p className="mt-2 text-sm text-muted-foreground">Sign in to continue.</p>
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
            <Button
              type="submit"
              disabled={busy}
              className="w-full bg-gold text-primary-foreground hover:bg-gold/90"
            >
              Sign in
            </Button>
          </div>
          <div className="mt-6 rounded-xl border border-dashed border-gold/40 bg-gold-soft/30 p-4">
            <p className="text-xs uppercase tracking-widest text-gold">For reviewers</p>
            <p className="mt-1 text-sm">
              Sign in with <span className="font-mono">driver-review@myrunner.shop</span> to see the
              full pre-approved driver flow.
            </p>
          </div>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            New here?{" "}
            <Link to="/signup" className="text-gold underline">
              Create an account
            </Link>
          </p>
        </form>
      </section>
    </PageShell>
  );
}
