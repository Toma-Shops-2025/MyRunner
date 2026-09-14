import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { PageShell } from "@/components/site/page-shell";
import { SUPPORT_FAQ } from "@/lib/support-knowledge";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "MyRunner FAQ — Answers for customers & drivers" },
      { name: "description", content: "How does pricing work? What can I send? How do I become a driver? Everything you need to know about MyRunner." },
      { property: "og:title", content: "MyRunner FAQ" },
      { property: "og:description", content: "Customer and driver answers, in one place." },
      { property: "og:url", content: "/faq" },
    ],
    links: [{ rel: "canonical", href: "/faq" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: SUPPORT_FAQ.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
    ],
  }),
  component: FAQ,
});

function FAQ() {
  return (
    <PageShell>
      <section className="container-app py-20">
        <p className="text-xs uppercase tracking-widest text-gold">FAQ</p>
        <h1 className="mt-3 font-serif text-6xl">Questions, answered.</h1>
      </section>
      <section className="container-app pb-24">
        <div className="mx-auto max-w-3xl divide-y divide-border rounded-2xl border border-border bg-card">
          {SUPPORT_FAQ.map((f) => (
            <FaqRow key={f.q} {...f} />
          ))}
        </div>
      </section>
    </PageShell>
  );
}

function FaqRow({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span className="font-serif text-lg">{q}</span>
        <ChevronDown className={`size-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="px-6 pb-5 text-sm text-muted-foreground">{a}</div>}
    </div>
  );
}
