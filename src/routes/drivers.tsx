import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/site/page-shell";
import { Button } from "@/components/ui/button";
import { DollarSign, Clock, Car, Gift, ShieldCheck, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/drivers")({
  head: () => ({
    meta: [
      { title: "Drive with MyRunner — Earn $20–$35/hour on your schedule" },
      { name: "description", content: "Become a Runner. Keep 70% per delivery + 100% of tips. Any vehicle, any hours. Automatic Stripe payouts." },
      { property: "og:title", content: "Earn with MyRunner" },
      { property: "og:description", content: "Flexible delivery driving with a real community behind you." },
      { property: "og:url", content: "/drivers" },
    ],
    links: [{ rel: "canonical", href: "/drivers" }],
  }),
  component: Drivers,
});

function Drivers() {
  return (
    <PageShell>
      <section className="container-app py-20">
        <p className="text-xs uppercase tracking-widest text-gold">For Runners</p>
        <h1 className="mt-3 max-w-4xl font-serif text-6xl leading-[1.05]">
          Your car. Your hours. <span className="italic text-gold">Your money.</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg text-muted-foreground">
          MyRunner is built around the people who do the actual work. You keep
          70% of every fee, 100% of every tip, and you set your own schedule.
        </p>
        <div className="mt-8 flex gap-3">
          <Button asChild size="lg" className="bg-gold text-primary-foreground hover:bg-gold/90">
            <Link to="/signup" search={{ intent: "driver" }}>Apply now →</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-border-strong">
            <Link to="/faq">Driver FAQ</Link>
          </Button>
        </div>
      </section>

      <section className="container-app pb-24">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: DollarSign, t: "70% per delivery", b: "Plus surge bonuses on high‑demand orders." },
            { icon: Gift, t: "100% of tips", b: "Every cent the customer tips goes to you." },
            { icon: Clock, t: "Total flexibility", b: "Online/offline with one tap. No minimums." },
            { icon: Car, t: "Any vehicle", b: "Car, SUV, truck, van, or motorcycle." },
            { icon: TrendingUp, t: "Auto Stripe payouts", b: "Earnings deposited directly to your bank." },
            { icon: ShieldCheck, t: "Insured while driving", b: "HNOA coverage during active deliveries." },
          ].map(({ icon: Icon, t, b }) => (
            <div key={t} className="rounded-2xl border border-border bg-card p-6">
              <Icon className="size-6 text-gold" />
              <h3 className="mt-4 font-serif text-2xl">{t}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{b}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-app pb-24">
        <div className="rounded-3xl border border-border bg-surface p-10">
          <h2 className="font-serif text-3xl">What you'll need</h2>
          <ul className="mt-6 grid gap-3 text-sm sm:grid-cols-2">
            {[
              "18+ with a valid driver's license",
              "Proof of auto insurance",
              "A smartphone (iOS or Android)",
              "Clean background check (Checkr)",
              "Reliable vehicle (any type)",
              "A bank account for Stripe payouts",
            ].map((x) => <li key={x} className="rounded-lg border border-border bg-card px-4 py-3">{x}</li>)}
          </ul>
        </div>
      </section>
    </PageShell>
  );
}
