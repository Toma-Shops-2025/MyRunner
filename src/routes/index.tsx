import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Package, Clock, MapPin, Shield, Star, Zap, Smartphone, Users, CheckCircle2 } from "lucide-react";
import { PageShell } from "@/components/site/page-shell";
import { Button } from "@/components/ui/button";
import heroVideo from "@/assets/hero-courier.mp4.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MyRunner — On‑demand local delivery for anything, anywhere" },
      { name: "description", content: "MyRunner connects you with vetted local Runners to pick up and deliver anything, anytime. From $5.99, live GPS tracking, photo proof, 24/7 in 50+ cities." },
      { property: "og:title", content: "MyRunner — Anything · Anytime · Anywhere" },
      { property: "og:description", content: "On‑demand local courier service. From $5.99 with live tracking, in‑app chat, and $100 cargo insurance." },
      { property: "og:url", content: "/" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "MyRunner",
          url: "/",
          email: "support@myrunner.shop",
          slogan: "Anything · Anytime · Anywhere",
        }),
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  const videoUrl = import.meta.env.VITE_HERO_VIDEO_URL || heroVideo.url;

  return (
    <PageShell>
      {/* Fixed video background — sits above PageShell bg, hero scrolls over it */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <video
          src={videoUrl}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/30 to-background/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/70 via-background/20 to-transparent" />
      </div>

      {/* HERO */}
      <section className="relative z-10 min-h-[92vh] flex items-center">
        <div className="container-app py-24 lg:py-32">
          <div className="max-w-2xl">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-gold/30 bg-gold-soft px-3 py-1 text-xs uppercase tracking-widest text-gold backdrop-blur-sm">
              <span className="size-1.5 animate-pulse rounded-full bg-gold" />
              Now live in 50+ cities · 24/7
            </span>
            <h1 className="mt-6 font-serif text-6xl leading-[1.02] sm:text-7xl lg:text-8xl drop-shadow-[0_4px_20px_rgba(0,0,0,0.6)]">
              Need it moved?
              <br />
              <span className="italic text-gold">We're already on it.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-foreground/90 drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
              MyRunner connects you with vetted local Runners who'll pick up and
              deliver almost anything — from documents to prescriptions to that
              thing you forgot at home. Starting at <span className="text-foreground font-medium">$5.99</span>.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-gold text-primary-foreground hover:bg-gold/90">
                <Link to="/signup">
                  Send a delivery <ArrowRight className="ml-1" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-border-strong bg-background/40 backdrop-blur-sm">
                <Link to="/drivers">Earn as a Runner</Link>
              </Button>
            </div>
            <div className="mt-10 flex items-center gap-6 text-xs text-muted-foreground">
              <Stat label="Avg pickup" value="< 12 min" />
              <Stat label="Cargo insured" value="$100" />
              <Stat label="Rating" value="4.9 ★" />
            </div>
          </div>
        </div>
      </section>

      {/* Everything below scrolls over the video with a solid bg */}
      <div className="relative z-10 bg-background">

      {/* MARQUEE / TRUST */}
      <section className="border-y border-border bg-surface/60 py-6">
        <div className="container-app grid grid-cols-2 gap-6 text-center text-xs uppercase tracking-widest text-muted-foreground sm:grid-cols-4">
          <div>Background‑checked drivers</div>
          <div>Live GPS tracking</div>
          <div>Photo proof of delivery</div>
          <div>Stripe‑secured payments</div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="container-app py-24">
        <SectionHead eyebrow="How it works" title="From request to doorstep, in four steps." />
        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <div key={s.title} className="group relative rounded-2xl border border-border bg-card p-6 transition-colors hover:border-gold/40">
              <span className="font-serif text-7xl text-gold/20">0{i + 1}</span>
              <h3 className="mt-2 font-serif text-2xl">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES BENTO */}
      <section className="container-app py-24">
        <SectionHead eyebrow="Built for real life" title="Every feature, thought through." />
        <div className="mt-14 grid gap-4 lg:grid-cols-6 lg:grid-rows-2">
          <Feature className="lg:col-span-3 lg:row-span-2" icon={MapPin} title="Real‑time GPS"
            body="Watch your Runner move on a live map. Get notified at every milestone." />
          <Feature className="lg:col-span-3" icon={Package} title="Standard, multi‑pickup, or multi‑drop"
            body="One pickup, many drops — or many pickups, one drop. We handle it." />
          <Feature className="lg:col-span-2" icon={Shield} title="$100 cargo insurance"
            body="Every delivery is covered. No fine print." />
          <Feature className="lg:col-span-1" icon={Smartphone} title="Installable PWA"
            body="Works on iOS & Android. No app store required." />
        </div>
      </section>

      {/* PRICING TEASE */}
      <section className="container-app py-24">
        <div className="rounded-3xl border border-border bg-gradient-to-br from-surface to-background p-10 lg:p-16">
          <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr]">
            <div>
              <p className="text-xs uppercase tracking-widest text-gold">Transparent pricing</p>
              <h2 className="mt-3 font-serif text-5xl leading-[1.05]">
                $5.99 to start.
                <br />
                <span className="italic text-muted-foreground">No surprises.</span>
              </h2>
              <p className="mt-4 max-w-md text-muted-foreground">
                You see the full price before you pay. $1.50 per mile, $3 per
                extra stop, optional tip — 100% goes to your Runner.
              </p>
              <Button asChild size="lg" className="mt-6 bg-gold text-primary-foreground hover:bg-gold/90">
                <Link to="/pricing">See full pricing →</Link>
              </Button>
            </div>
            <ul className="space-y-3 text-sm">
              {[
                "Base fee — $5.99",
                "Per mile — $1.50",
                "Extra stop — $3.00",
                "Tips — 100% to driver",
                "Promo codes & loyalty points",
                "Live demand bonuses on long waits",
              ].map((line) => (
                <li key={line} className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3">
                  <CheckCircle2 className="size-4 text-gold" />
                  {line}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* DRIVERS CTA */}
      <section className="container-app py-24">
        <div className="grid gap-10 rounded-3xl border border-border bg-surface p-10 lg:grid-cols-2 lg:p-16">
          <div>
            <p className="text-xs uppercase tracking-widest text-gold">Drive with us</p>
            <h2 className="mt-3 font-serif text-5xl">Keep 70% + 100% of tips.</h2>
            <p className="mt-4 text-muted-foreground">
              Any vehicle. Any hours. Average earnings $20–$35/hour. Automatic
              payouts via Stripe Connect.
            </p>
            <Button asChild size="lg" className="mt-6 bg-gold text-primary-foreground hover:bg-gold/90">
              <Link to="/driver-signup">Start earning →</Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {driverPerks.map((p) => (
              <div key={p.title} className="rounded-xl border border-border bg-card p-5">
                <p.icon className="size-5 text-gold" />
                <p className="mt-3 font-serif text-xl">{p.title}</p>
                <p className="text-xs text-muted-foreground">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="container-app py-32 text-center">
        <h2 className="mx-auto max-w-3xl font-serif text-6xl leading-[1.05] sm:text-7xl">
          Anything. <span className="italic">Anytime.</span>{" "}
          <span className="text-gold">Anywhere.</span>
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-muted-foreground">
          Join thousands of people already moving the world a little faster.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Button asChild size="lg" className="bg-gold text-primary-foreground hover:bg-gold/90">
            <Link to="/signup">Create your account</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-border-strong">
            <Link to="/how-it-works">Learn more</Link>
          </Button>
        </div>
      </section>
      </div>
    </PageShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-serif text-2xl text-foreground">{value}</p>
      <p className="text-[10px] uppercase tracking-widest">{label}</p>
    </div>
  );
}

function SectionHead({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="max-w-2xl">
      <p className="text-xs uppercase tracking-widest text-gold">{eyebrow}</p>
      <h2 className="mt-3 font-serif text-5xl leading-[1.05]">{title}</h2>
    </div>
  );
}

function Feature({
  icon: Icon,
  title,
  body,
  className = "",
}: {
  icon: typeof MapPin;
  title: string;
  body: string;
  className?: string;
}) {
  return (
    <div className={`rounded-2xl border border-border bg-card p-6 transition-colors hover:border-gold/40 ${className}`}>
      <Icon className="size-6 text-gold" />
      <h3 className="mt-4 font-serif text-2xl">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{body}</p>
    </div>
  );
}

const steps = [
  { title: "Enter pickup & drop", body: "Two addresses, what to grab, any special instructions." },
  { title: "Pick your delivery type", body: "Standard, multi‑pickup, or multi‑dropoff." },
  { title: "Pay & track live", body: "See the quote, pay securely, watch on a real‑time map." },
  { title: "Photo proof + rate", body: "Confirmation photo at drop‑off. Rate your Runner." },
];

const driverPerks = [
  { icon: Zap, title: "Fast onboarding", body: "Apply, upload license & insurance — start today." },
  { icon: Clock, title: "Total flexibility", body: "Work whenever. Toggle online with one tap." },
  { icon: Star, title: "Tips + bonuses", body: "Keep every cent of tips and surge bonuses." },
  { icon: Users, title: "Driver community", body: "Referrals, leaderboard, gear shop." },
];
