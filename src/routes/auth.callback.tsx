import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageShell } from "@/components/site/page-shell";
import { supabase } from "@/integrations/supabase/client";
import {
  clearSignupIntent,
  intentFromMetadata,
  readSignupIntent,
} from "@/lib/signup-intent";
import { toast } from "sonner";

export const Route = createFileRoute("/auth/callback")({
  head: () => ({
    meta: [
      { title: "Signing in — MyRunner" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthCallback,
});

/**
 * Google (and other OAuth) return here after Supabase finishes the handshake.
 * Waits for the session, then sends drivers vs customers to the right home.
 */
function AuthCallback() {
  const nav = useNavigate();
  const [message, setMessage] = useState("Finishing Google sign-in…");

  useEffect(() => {
    let cancelled = false;
    let tries = 0;

    async function finish() {
      const { data, error } = await supabase.auth.getSession();
      if (cancelled) return;

      if (error) {
        toast.error(error.message);
        nav({ to: "/login" });
        return;
      }

      const session = data.session;
      if (!session?.user) {
        tries += 1;
        if (tries < 20) {
          setTimeout(finish, 150);
          return;
        }
        setMessage("Sign-in timed out. Try again.");
        toast.error("Google sign-in did not complete. Please try again.");
        nav({ to: "/login" });
        return;
      }

      // Ensure profile row exists (trigger usually handles this; upsert is safe)
      const meta = session.user.user_metadata ?? {};
      await supabase.from("profiles").upsert(
        {
          id: session.user.id,
          email: session.user.email ?? null,
          full_name:
            (meta.full_name as string | undefined) ||
            (meta.name as string | undefined) ||
            session.user.email?.split("@")[0] ||
            null,
        },
        { onConflict: "id" },
      );

      const { data: roleRows } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id);
      const isDriver = (roleRows ?? []).some((r) => r.role === "driver");

      const signupIntent =
        readSignupIntent() ?? intentFromMetadata(meta as Record<string, unknown>);
      clearSignupIntent();

      toast.success("Welcome to MyRunner.");
      if (isDriver) {
        nav({ to: "/driver/dashboard" });
      } else if (signupIntent === "driver") {
        nav({ to: "/driver-signup" });
      } else {
        nav({ to: "/app/dashboard" });
      }
    }

    void finish();
    return () => {
      cancelled = true;
    };
  }, [nav]);

  return (
    <PageShell showBack={false}>
      <section className="container-app grid min-h-[60vh] place-items-center py-16">
        <div className="rounded-2xl border border-border bg-card p-8 text-center">
          <p className="text-xs uppercase tracking-widest text-gold">Auth</p>
          <h1 className="mt-2 font-serif text-3xl">{message}</h1>
          <p className="mt-2 text-sm text-muted-foreground">One moment…</p>
        </div>
      </section>
    </PageShell>
  );
}
