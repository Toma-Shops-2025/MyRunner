import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/site/page-shell";
import { Button } from "@/components/ui/button";
import {
  DollarSign,
  Clock,
  Car,
  Gift,
  ShieldCheck,
  Layers,
  Smartphone,
  MapPin,
  Printer,
} from "lucide-react";

export const Route = createFileRoute("/drivers")({
  head: () => ({
    meta: [
      {
        title: "Drive with MyRunner — Keep DoorDash & Uber, earn on the side",
      },
      {
        name: "description",
        content:
          "Already delivering? Add MyRunner. Keep your other apps, go online when you want, keep 70% of every fee + 100% of tips. Early Runners get first dibs.",
      },
      { property: "og:title", content: "Add MyRunner to your gig apps" },
      {
        property: "og:description",
        content: "Same car. Same hours. Extra local deliveries when you're already out.",
      },
      { property: "og:url", content: "/drivers" },
    ],
    links: [{ rel: "canonical", href: "/drivers" }],
  }),
  component: Drivers,
});

function Drivers() {
  return (
    <PageShell>
      {/* HERO — one composition */}
      <section className="relative overflow-hidden border-b border-border">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 70% 20%, hsl(43 90% 45% / 0.18), transparent 55%), linear-gradient(160deg, #0a0a0a 0%, #14110a 45%, #050505 100%)",
          }}
        />
        <div className="container-app relative py-20 sm:py-28">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-gold">For gig drivers</p>
          <h1 className="mt-4 max-w-3xl font-serif text-5xl leading-[1.05] text-foreground sm:text-6xl lg:text-7xl">
            Keep DoorDash &amp; Uber.
            <br />
            <span className="italic text-gold">Add MyRunner.</span>
          </h1>
          <p className="mt-6 max-w-lg text-lg text-muted-foreground">
            Same car, same hours — extra local deliveries when you&apos;re already out. Go online when you want. Stay ready before the city gets busy.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button asChild size="lg" className="bg-gold text-primary-foreground hover:bg-gold/90">
              <Link to="/signup" search={{ intent: "driver" }}>
                Sign up as a Runner →
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-border-strong">
              <a href="/driver-flyer.html" target="_blank" rel="noreferrer">
                <Printer className="mr-2 size-4" /> Print flyer
              </a>
            </Button>
          </div>
          <p className="mt-6 text-sm text-muted-foreground">
            70% of every fee · 100% of tips · Payouts to your debit card or bank via Stripe
          </p>
        </div>
      </section>

      {/* WHY THIS FITS THEIR LIFE */}
      <section className="container-app py-20">
        <h2 className="font-serif text-3xl sm:text-4xl">Built to sit next to your other apps</h2>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          You don&apos;t have to quit anything. MyRunner is another ping when you want it — packages, keys, documents, errands — not only food.
        </p>
        <ul className="mt-10 grid gap-8 sm:grid-cols-3">
          {[
            {
              icon: Layers,
              t: "Stack it",
              b: "Run DoorDash, Uber Eats, or Instacart like usual. Open MyRunner when you want another offer.",
            },
            {
              icon: MapPin,
              t: "Local drops",
              b: "Short, local pickups and drop-offs. Be in position when customers in your city start ordering.",
            },
            {
              icon: Smartphone,
              t: "One tap online",
              b: "No shifts. No minimum hours. Online when you want money, offline when you don't.",
            },
          ].map(({ icon: Icon, t, b }) => (
            <li key={t} className="border-t border-border pt-6">
              <Icon className="size-6 text-gold" />
              <h3 className="mt-4 font-serif text-2xl">{t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{b}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* EARNINGS */}
      <section className="border-y border-border bg-card/40">
        <div className="container-app py-20">
          <h2 className="font-serif text-3xl sm:text-4xl">What you keep</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: DollarSign, t: "70% of the fee", b: "The delivery fee split favors the Runner." },
              { icon: Gift, t: "100% of tips", b: "Every tip goes to you — not the platform." },
              { icon: Clock, t: "Your schedule", b: "Average drivers aim for $20–$35/hr depending on demand." },
              { icon: ShieldCheck, t: "Insured on job", b: "Coverage while you're on an active delivery." },
            ].map(({ icon: Icon, t, b }) => (
              <div key={t}>
                <Icon className="size-5 text-gold" />
                <h3 className="mt-3 font-serif text-xl">{t}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REQUIREMENTS */}
      <section className="container-app py-20">
        <h2 className="font-serif text-3xl">What you need</h2>
        <ul className="mt-8 grid gap-3 text-sm sm:grid-cols-2">
          {[
            "18+ with a valid driver's license",
            "Proof of auto insurance",
            "Smartphone (iOS or Android)",
            "Background check via Checkr",
            "Reliable vehicle — car, SUV, truck, van, or motorcycle",
            "Bank account for Stripe payouts",
          ].map((x) => (
            <li key={x} className="flex items-start gap-3 border-b border-border py-3">
              <Car className="mt-0.5 size-4 shrink-0 text-gold" />
              <span>{x}</span>
            </li>
          ))}
        </ul>
        <div className="mt-10">
          <Button asChild size="lg" className="bg-gold text-primary-foreground hover:bg-gold/90">
            <Link to="/signup" search={{ intent: "driver" }}>
              Apply in a few minutes →
            </Link>
          </Button>
        </div>
      </section>

      {/* EARLY RUNNER CALLOUT */}
      <section className="container-app pb-24">
        <div className="rounded-3xl border border-gold/30 bg-gradient-to-br from-gold/10 to-transparent p-8 sm:p-12">
          <p className="text-xs uppercase tracking-widest text-gold">Early Runners</p>
          <h2 className="mt-3 max-w-xl font-serif text-3xl sm:text-4xl">
            Get approved now. Be ready when your city lights up.
          </h2>
          <p className="mt-4 max-w-lg text-muted-foreground">
            Customers are discovering MyRunner. Approved Runners get first offers in their area — keep doing your other apps and stay one tap away.
          </p>
          <p className="mt-4 max-w-lg text-sm text-gold/90">
            <strong>$25 referral:</strong> invite a driver. When they complete 3 deliveries, you both get $25.
            Payouts go to your debit card or bank account via Stripe.
          </p>
          <Button asChild className="mt-8 bg-gold text-primary-foreground hover:bg-gold/90">
            <Link to="/signup" search={{ intent: "driver" }}>
              Join as an early Runner
            </Link>
          </Button>
        </div>
      </section>
    </PageShell>
  );
}
