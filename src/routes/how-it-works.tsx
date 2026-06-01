import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/site/page-shell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "How MyRunner works — Send a delivery in minutes" },
      { name: "description", content: "Request a Runner, watch them on a live map, get photo proof at drop‑off. Here's exactly how MyRunner deliveries work." },
      { property: "og:title", content: "How MyRunner works" },
      { property: "og:description", content: "A step‑by‑step walkthrough of sending a delivery on MyRunner." },
      { property: "og:url", content: "/how-it-works" },
    ],
    links: [{ rel: "canonical", href: "/how-it-works" }],
  }),
  component: HowItWorks,
});

const steps = [
  ["Enter pickup address", "Where the Runner should go to grab your item. Add a unit number or gate code if needed."],
  ["Describe the item", "A quick sentence so the Runner knows what they're picking up."],
  ["Enter drop‑off address", "Add a recipient name and phone if it's going to someone else."],
  ["Choose your delivery type", "Standard (1→1), multi‑pickup (many→1), or multi‑drop (1→many)."],
  ["Review pricing", "Base fee + per‑mile + extra stops. No hidden charges."],
  ["Optional add‑ons", "Schedule later, tip your driver, apply a promo, request a preferred Runner."],
  ["Pay securely", "Stripe handles the transaction — your card details never touch our servers."],
  ["Track live", "Watch the Runner move in real time on a GPS map."],
  ["Chat in‑app", "Need to update the address or add a note? Message your Runner directly."],
  ["Photo proof", "A photo at drop‑off confirms delivery and goes straight to your order screen."],
  ["Rate & review", "30 seconds to leave feedback. Drivers see your rating, you build their reputation."],
  ["Earn loyalty points", "Points auto‑awarded after every delivery — redeem for discounts."],
];

function HowItWorks() {
  return (
    <PageShell>
      <section className="container-app py-20">
        <p className="text-xs uppercase tracking-widest text-gold">How it works</p>
        <h1 className="mt-3 max-w-3xl font-serif text-6xl leading-[1.05]">
          From your phone to their hands — in twelve simple beats.
        </h1>
        <p className="mt-6 max-w-xl text-lg text-muted-foreground">
          We designed MyRunner so anyone can send a delivery in under a minute.
          Here's the full flow.
        </p>
      </section>
      <section className="container-app pb-20">
        <ol className="grid gap-4 md:grid-cols-2">
          {steps.map(([t, b], i) => (
            <li key={t} className="rounded-2xl border border-border bg-card p-6">
              <span className="font-serif text-5xl text-gold/30">{String(i + 1).padStart(2, "0")}</span>
              <h2 className="mt-2 font-serif text-2xl">{t}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{b}</p>
            </li>
          ))}
        </ol>
        <div className="mt-14 text-center">
          <Button asChild size="lg" className="bg-gold text-primary-foreground hover:bg-gold/90">
            <Link to="/signup">Create your account</Link>
          </Button>
        </div>
      </section>
    </PageShell>
  );
}
