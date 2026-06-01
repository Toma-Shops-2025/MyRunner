import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/site/page-shell";
import { ShieldCheck, Camera, MapPin, FileCheck2, Lock, Headphones } from "lucide-react";

export const Route = createFileRoute("/safety")({
  head: () => ({
    meta: [
      { title: "Safety & insurance — How MyRunner protects you" },
      { name: "description", content: "Background checks, $100 cargo insurance, HNOA driver coverage, live GPS, photo proof, and 24/7 support. Here's how we keep MyRunner safe." },
      { property: "og:title", content: "Safety & insurance — MyRunner" },
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
          { icon: FileCheck2, t: "Background checks", b: "Every Runner passes a Checkr screening — criminal history, DUIs, sexual offenses." },
          { icon: ShieldCheck, t: "$100 cargo insurance", b: "Every delivery is covered against loss or damage." },
          { icon: MapPin, t: "Live GPS tracking", b: "Drivers share location every 30 seconds during active jobs." },
          { icon: Camera, t: "Photo proof of delivery", b: "Confirmation photo at the drop‑off goes to your order screen." },
          { icon: Lock, t: "Stripe‑secured payments", b: "We never store your card. PCI‑compliant by design." },
          { icon: Headphones, t: "24/7 support", b: "AI agents + human escalation for any issue, any hour." },
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
          <h2 className="font-serif text-3xl">Insurance coverage</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Row t="Cargo / Goods in transit" b="Up to $100 per delivery at no extra cost." />
            <Row t="General liability" b="Platform coverage for third‑party claims." />
            <Row t="HNOA (Hired & Non‑Owned Auto)" b="Covers drivers during active delivery windows." />
            <Row t="Cyber liability" b="Customer data and payment security." />
            <Row t="Professional liability" b="Covers negligence / service failure claims." />
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
