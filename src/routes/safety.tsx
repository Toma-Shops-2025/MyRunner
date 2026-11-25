import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/site/page-shell";
import { ShieldCheck, Camera, MapPin, FileCheck2, Lock, Headphones } from "lucide-react";
import {
  CARGO_INSURANCE_STATEMENT,
  DRIVER_SCREENING_STATEMENT,
  SUPPORT_EMAIL,
  SUPPORT_PHONE_DISPLAY,
  SUPPORT_STATEMENT,
} from "@/lib/public-facts";

export const Route = createFileRoute("/safety")({
  head: () => ({
    meta: [
      { title: "Safety — How MyRunner handles a delivery" },
      { name: "description", content: "After MyRunner launches in a city or state: 24/7 support, cargo insurance obtained before that launch, and drivers start once the application, license, and auto insurance are provided." },
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
        <p className="mt-4 text-sm font-semibold uppercase tracking-wide text-gold">Coming to your city very soon!!!</p>
      </section>
      <section className="container-app pb-24 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[
          { icon: FileCheck2, t: "Driver screening", b: DRIVER_SCREENING_STATEMENT },
          { icon: ShieldCheck, t: "Cargo insurance", b: CARGO_INSURANCE_STATEMENT },
          { icon: MapPin, t: "Live GPS tracking", b: "While a Runner is online, the app shares location from the device and refreshes about every 20 seconds." },
          { icon: Camera, t: "Photo proof of delivery", b: "A confirmation photo at drop-off is stored on the order." },
          { icon: Lock, t: "Stripe-secured payments", b: "Card payments go through Stripe. MyRunner does not store full card numbers." },
          { icon: Headphones, t: "Support", b: `${SUPPORT_STATEMENT} ${SUPPORT_PHONE_DISPLAY} or ${SUPPORT_EMAIL}.` },
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
          <h2 className="font-serif text-3xl">Coverage and screening</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Row t="Cargo insurance" b={CARGO_INSURANCE_STATEMENT} />
            <Row t="Auto insurance" b="Runners carry their own auto insurance." />
            <Row t="Checkr" b={DRIVER_SCREENING_STATEMENT} />
            <Row t="Support" b={`${SUPPORT_STATEMENT} ${SUPPORT_PHONE_DISPLAY} · ${SUPPORT_EMAIL}.`} />
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
