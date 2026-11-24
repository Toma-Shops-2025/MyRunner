import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/site/page-shell";
import { ShieldCheck, Camera, MapPin, FileCheck2, Lock, Headphones } from "lucide-react";

export const Route = createFileRoute("/safety")({
  head: () => ({
    meta: [
      { title: "Safety — How MyRunner handles a delivery" },
      { name: "description", content: "Live GPS, in-app messages, photo proof, and Stripe payments. Cargo insurance and background screening are not in place at the Louisville launch." },
      { property: "og:title", content: "Safety — MyRunner" },
      { property: "og:description", content: "Every layer of safety we've built into the platform." },
      { property: "og:url", content: "/safety" },
    ],
    links: [{ rel: "canonical", href: "/safety" }],
  }),
  component: Safety,
});

function Safety() {
  return (
    <PageShell>
      <section className="container-app py-20">
        <p className="text-xs uppercase tracking-widest text-gold">Safety</p>
        <h1 className="mt-3 max-w-3xl font-serif text-6xl leading-[1.05]">Trust isn't a feature. It's the foundation.</h1>
      </section>
      <section className="container-app pb-24 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[
          { icon: FileCheck2, t: "Runner applications", b: "Applicants submit a license and their own auto insurance. A third-party background check is not running at launch." },
          { icon: ShieldCheck, t: "No cargo insurance yet", b: "MyRunner does not insure the item. Do not send anything you cannot afford to lose." },
          { icon: MapPin, t: "Live GPS tracking", b: "While a Runner is online, the app shares location from the device and refreshes about every 20 seconds." },
          { icon: Camera, t: "Photo proof of delivery", b: "A confirmation photo at drop-off is stored on the order." },
          { icon: Lock, t: "Stripe-secured payments", b: "Card payments go through Stripe. MyRunner does not store full card numbers." },
          { icon: Headphones, t: "Support by email", b: "Email support@myrunner.shop or use the contact form. There is no staffed 24/7 support line." },
        ].map(({ icon: Icon, t, b }) => (
          <div key={t} className="rounded-2xl border border-border bg-card p-6">
            <Icon className="size-6 text-gold" />
            <h3 className="mt-4 font-serif text-2xl">{t}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{b}</p>
          </div>
        ))}
      </section>
      <section className="container-app pb-24">
        <div className="rounded-3xl border border-border bg-surface p-10">
          <h2 className="font-serif text-3xl">What is not covered yet</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Row t="Cargo insurance" b="Not purchased. There is no $100 goods-in-transit policy." />
            <Row t="Platform auto coverage" b="Runners must carry their own auto insurance. MyRunner does not provide hired-auto coverage." />
            <Row t="Background screening" b="Checkr is not connected. Do not assume a Runner has passed a screening." />
            <Row t="Support hours" b="Use support@myrunner.shop. Replies are not promised around the clock." />
          </div>
        </div>
      </section>
    </PageShell>
  );
}

function Row({ t, b }: { t: string; b: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <p className="font-serif text-lg">{t}</p>
      <p className="text-sm text-muted-foreground">{b}</p>
    </div>
  );
}
