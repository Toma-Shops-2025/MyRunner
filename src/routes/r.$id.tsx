import { createFileRoute, notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { SiteHeader } from "@/components/site/header";
import { SiteFooter } from "@/components/site/footer";
import { BackButton } from "@/components/site/back-button";

/**
 * Public Runner profile page.
 * - No auth wall (Stripe Connect verification crawls this URL).
 * - Renders the Runner's display name + what they offer.
 * - URL shape: https://myrunner.shop/r/<user_id>
 */
const fetchRunner = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data }) => {
    const sb = createClient<Database>(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_PUBLISHABLE_KEY!,
      { auth: { storage: undefined, persistSession: false, autoRefreshToken: false } },
    );
    const { data: row } = await sb
      .from("profiles")
      .select("id, full_name, payouts_enabled, onboarding_completed_at")
      .eq("id", data.id)
      .maybeSingle();
    if (!row) return null;
    return {
      id: row.id,
      name: row.full_name ?? "MyRunner Runner",
      verified: Boolean(row.payouts_enabled),
      since: row.onboarding_completed_at,
    };
  });

export const Route = createFileRoute("/r/$id")({
  loader: async ({ params }) => {
    const runner = await fetchRunner({ data: { id: params.id } });
    if (!runner) throw notFound();
    return { runner };
  },
  head: ({ loaderData }) => {
    const name = loaderData?.runner?.name ?? "Runner";
    return {
      meta: [
        { title: `${name} — MyRunner Independent Runner` },
        {
          name: "description",
          content: `${name} is an independent contractor delivery Runner on MyRunner — on-demand pickup & delivery of groceries, food, pharmacy and last-minute errands.`,
        },
        { property: "og:title", content: `${name} — MyRunner` },
        { property: "og:description", content: `Independent delivery Runner on MyRunner.` },
      ],
    };
  },
  component: RunnerProfile,
  notFoundComponent: () => (
    <div className="container-app py-20 text-center">
      <h1 className="font-serif text-3xl">Runner not found</h1>
    </div>
  ),
  errorComponent: () => (
    <div className="container-app py-20 text-center">
      <h1 className="font-serif text-3xl">Something went wrong</h1>
    </div>
  ),
});

function RunnerProfile() {
  const { runner } = Route.useLoaderData();
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="container-app flex-1 py-10">
        <div className="mb-6">
          <BackButton fallbackTo="/" />
        </div>
        <div className="mx-auto max-w-2xl rounded-2xl border border-border bg-card p-8">
          <p className="text-xs uppercase tracking-widest text-gold">Independent Runner</p>
          <h1 className="mt-2 font-serif text-4xl">{runner.name}</h1>
          {runner.verified && (
            <p className="mt-2 text-sm text-emerald-500">
              ✓ Verified Runner · payouts active
              {runner.since ? ` since ${new Date(runner.since).toLocaleDateString()}` : ""}
            </p>
          )}
          <div className="mt-6 space-y-3 text-sm leading-relaxed text-muted-foreground">
            <p>
              {runner.name} is an independent contractor providing on-demand pickup
              and delivery services through MyRunner — anything, anytime, anywhere.
            </p>
            <p>
              Services include: grocery runs, restaurant pickup, pharmacy delivery,
              package drop-offs, and last-minute personal errands within the local
              service area.
            </p>
            <p>
              MyRunner uses Stripe Connect to process payments and send earnings
              directly to verified Runners.
            </p>
          </div>
          <div className="mt-8 rounded-xl border border-border bg-background p-5">
            <p className="font-serif text-xl">Need a Runner?</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Book a delivery on MyRunner — the next available Runner in your area
              will be dispatched.
            </p>
            <a
              href="/app/new-delivery"
              className="mt-4 inline-block rounded-full bg-gold px-5 py-2 text-sm font-medium text-primary-foreground"
            >
              Request a delivery
            </a>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
