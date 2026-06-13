import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { PageShell } from "@/components/site/page-shell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — MyRunner delivery fees, simple & transparent" },
      { name: "description", content: "MyRunner starts at $5.99 base + $1.50/mile + $3 per extra stop. No hidden fees. Tips go 100% to drivers." },
      { property: "og:title", content: "MyRunner pricing" },
      { property: "og:description", content: "Transparent per‑delivery pricing. No subscriptions, no surge to customers." },
      { property: "og:url", content: "/pricing" },
    ],
    links: [{ rel: "canonical", href: "/pricing" }],
  }),
  component: Pricing,
});

function Pricing() {
  return (
    <PageShell>
      <section className="container-app py-20">
        <p className="text-xs uppercase tracking-widest text-gold">Pricing</p>
        <h1 className="mt-3 font-serif text-6xl">$5.99 base. <span className="italic text-muted-foreground">That's it.</span></h1>
        <p className="mt-6 max-w-xl text-lg text-muted-foreground">
          We show you the final price before you pay. No subscriptions, no
          peak‑hour penalties for customers, no hidden fees.
        </p>
      </section>
      <section className="container-app pb-20">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-border bg-card p-8">
            <h2 className="font-serif text-3xl">Per delivery</h2>
            <ul className="mt-6 space-y-4">
              <Row a="Base fee" b="$5.99" />
              <Row a="Per mile" b="$0.75" />
              <Row a="Extra stop (multi‑drop)" b="$3.00 each" />
              <Row a="Tip" b="Optional · 100% to driver" />
              <Row a="Promo & loyalty" b="Apply at checkout" />
            </ul>
          </div>
          <div className="rounded-3xl border border-border bg-surface p-8">
            <h2 className="font-serif text-3xl">What you get</h2>
            <ul className="mt-6 space-y-3 text-sm">
              {[
                "Background‑checked Runner",
                "Live GPS tracking + in‑app chat",
                "Photo proof of delivery",
                "$100 cargo insurance per delivery",
                "Stripe‑secured payments",
                "24/7 availability",
                "Refunds for issues (1–3 business days)",
              ].map((t) => (
                <li key={t} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-gold" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-10 rounded-3xl border border-border bg-gradient-to-br from-gold/5 to-transparent p-8">
          <h3 className="font-serif text-2xl">High‑demand bonus</h3>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            If an order sits unaccepted for 5+ minutes, MyRunner adds a driver
            bonus every 5 minutes to incentivize faster pickup. <strong className="text-foreground">You pay
            the original quoted price.</strong> The platform absorbs the bonus.
          </p>
        </div>
        <div className="mt-12 text-center">
          <Button asChild size="lg" className="bg-gold text-primary-foreground hover:bg-gold/90">
            <Link to="/signup">Send a delivery</Link>
          </Button>
        </div>
      </section>
    </PageShell>
  );
}

function Row({ a, b }: { a: string; b: string }) {
  return (
    <li className="flex items-baseline justify-between gap-4 border-b border-border pb-3 last:border-0">
      <span className="text-muted-foreground">{a}</span>
      <span className="font-serif text-xl text-foreground">{b}</span>
    </li>
  );
}
