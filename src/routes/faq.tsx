import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { PageShell } from "@/components/site/page-shell";

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
          mainEntity: faqData.map((f) => ({
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

const faqData = [
  { q: "What can I send with MyRunner?", a: "Almost anything legal that fits in a vehicle — documents, packages, prescriptions, gifts, car parts, keys, groceries. See our Community Guidelines for prohibited items." },
  { q: "How is pricing calculated?", a: "$5.99 base + $1.50 per mile + $3 per extra stop. Tips are optional and 100% go to the driver." },
  { q: "How fast is pickup?", a: "Average pickup is under 12 minutes in covered metros. You'll see live ETA on your tracking screen." },
  { q: "Are deliveries insured?", a: "Yes — every delivery includes up to $100 of cargo insurance at no extra cost." },
  { q: "How do I become a Runner?", a: "Apply at /driver-signup. Submit your license, insurance, vehicle info, and pass a Checkr background check." },
  { q: "How much do drivers make?", a: "70% of every fee plus 100% of tips. Average earnings are $20–$35/hour depending on demand." },
  { q: "When do drivers get paid?", a: "After each delivery, earnings transfer to your linked bank via Stripe Connect on the standard payout schedule." },
  { q: "Can I request a specific driver?", a: "Yes. On the order screen, mark a Runner as preferred and they'll see a 'Requested You' badge on your future orders." },
  { q: "Can I block a driver?", a: "Yes. From any past order, tap Block driver. They will never be matched to your future requests." },
  { q: "How do I delete my account?", a: "Go to App → Settings → Delete account. Your data is removed within 30 days." },
  { q: "How do I report someone?", a: "From any order or your dashboard, tap Report. Choose a reason and add details — we review every report." },
  { q: "How do refunds work?", a: "Go to My Orders → Request Refund. Admin reviews within 1–3 business days. Approved refunds return to your original payment method." },
];

function FAQ() {
  return (
    <PageShell>
      <section className="container-app py-20">
        <p className="text-xs uppercase tracking-widest text-gold">FAQ</p>
        <h1 className="mt-3 font-serif text-6xl">Questions, answered.</h1>
      </section>
      <section className="container-app pb-24">
        <div className="mx-auto max-w-3xl divide-y divide-border rounded-2xl border border-border bg-card">
          {faqData.map((f) => <FaqRow key={f.q} {...f} />)}
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
