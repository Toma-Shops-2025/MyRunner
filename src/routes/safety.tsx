import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/site/page-shell";
import { ShieldCheck, Camera, MapPin, FileCheck2, Lock, Headphones } from "lucide-react";
import {
  LAUNCH_BADGE,
  PRE_LAUNCH_DISCLOSURE_SHORT,
  SUPPORT_EMAIL,
  SUPPORT_PHONE_DISPLAY,
} from "@/lib/public-facts";
import { PreLaunchNotice } from "@/components/site/pre-launch-notice";

export const Route = createFileRoute("/safety")({
  head: () => ({
    meta: [
      { title: "Safety — How MyRunner handles a delivery" },
      {
        name: "description",
        content:
          "How MyRunner approaches screening, insurance, payments, GPS, and support during the Kentucky launch.",
      },
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
        <p className="mt-2 text-sm font-semibold uppercase tracking-wide text-gold">{LAUNCH_BADGE}</p>
        <h1 className="mt-3 max-w-3xl font-serif text-6xl leading-[1.05]">
          Safety by design, with a clear launch roadmap.
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">{PRE_LAUNCH_DISCLOSURE_SHORT}</p>
      </section>
      <section className="container-app pb-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[
          {
            icon: FileCheck2,
            t: "Driver onboarding",
            b: "Application, valid license, and the Runner’s own auto insurance. Checkr background checks roll out when MyRunner activates that program.",
          },
          {
            icon: ShieldCheck,
            t: "Cargo insurance",
            b: "Obtained before commercial delivery in each launch market.",
          },
          {
            icon: MapPin,
            t: "Live GPS tracking",
            b: "While a Runner is on a job, location refreshes about every 20 seconds.",
          },
          {
            icon: Camera,
            t: "Photo proof",
            b: "A confirmation photo at drop-off is stored on the order.",
          },
          {
            icon: Lock,
            t: "Stripe payments",
            b: "Card payments go through Stripe. MyRunner does not store full card numbers.",
          },
          {
            icon: Headphones,
            t: "Support",
            b: `Founder-led support during launch: ${SUPPORT_PHONE_DISPLAY} · ${SUPPORT_EMAIL}.`,
          },
        ].map(({ icon: Icon, t, b }) => (
          <div key={t} className="rounded-2xl border border-border bg-card p-6">
            <Icon className="size-6 text-gold" />
            <h3 className="mt-4 font-serif text-2xl">{t}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{b}</p>
          </div>
        ))}
      </section>
      <section className="container-app pb-24">
        <PreLaunchNotice />
      </section>
    </PageShell>
  );
}