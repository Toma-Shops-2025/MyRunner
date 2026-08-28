import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { PageShell } from "@/components/site/page-shell";
import { supabase } from "@/integrations/supabase/client";
import { clearSignupIntent, readSignupIntent } from "@/lib/signup-intent";
import { resolveOAuthCallbackDestination } from "@/lib/auth.functions";
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
 * Google OAuth return — Supabase exchanges the PKCE code on init (detectSessionInUrl).
 * Do not call exchangeCodeForSession here; a second exchange clears the verifier and fails.
 */
function AuthCallback() {
  const nav = useNavigate();
  const resolveOAuthDest = useServerFn(resolveOAuthCallbackDestination);
  const [message, setMessage] = useState("Finishing Google sign-in…");
  const routedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;

    async function routeUser(session: NonNullable<Awaited<ReturnType<typeof supabase.auth.getSession>>["data"]["session"]>) {
      if (routedRef.current || cancelled) return;
      routedRef.current = true;

      setMessage("Setting up your account…");
      const meta = session.user.user_metadata ?? {};
      void supabase.from("profiles").upsert(
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

      const sessionIntent = readSignupIntent();
      clearSignupIntent();

      const dest = await resolveOAuthDest({
        data: { sessionSignupIntent: sessionIntent },
      });

      if (cancelled) return;

      toast.success("Welcome to MyRunner.");
      nav({ to: dest.to });
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (cancelled || routedRef.current) return;
      if ((event === "SIGNED_IN" || event === "INITIAL_SESSION") && session?.user) {
        void routeUser(session);
      }
    });

    void supabase.auth.getSession().then(({ data, error }) => {
      if (cancelled || routedRef.current) return;
      if (error) {
        toast.error(error.message);
        nav({ to: "/login" });
        return;
      }
      if (data.session?.user) {
        void routeUser(data.session);
        return;
      }
      if (new URLSearchParams(window.location.search).has("code")) {
        setMessage("Confirming with Google…");
      } else {
        setMessage("Waiting for Google…");
      }
    });

    const timeout = window.setTimeout(() => {
      if (routedRef.current || cancelled) return;
      setMessage("Sign-in timed out. Try again.");
      toast.error("Google sign-in did not complete. Please try again.");
      nav({ to: "/login" });
    }, 15000);

    return () => {
      cancelled = true;
      subscription.unsubscribe();
      window.clearTimeout(timeout);
    };
  }, [nav, resolveOAuthDest]);

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
