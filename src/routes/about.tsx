import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/site/page-shell";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About MyRunner — Built for the things food delivery forgot" },
      { name: "description", content: "MyRunner is a general‑purpose, on‑demand local delivery platform for anything that fits in a vehicle. Built for the gaps the big apps don't fill." },
      { property: "og:title", content: "About MyRunner" },
      { property: "og:description", content: "Why we built MyRunner, and who it's for." },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: About,
});

function About() {
  return (
    <PageShell>
      <section className="container-app py-20">
        <p className="text-xs uppercase tracking-widest text-gold">About</p>
        <h1 className="mt-3 max-w-3xl font-serif text-6xl leading-[1.05]">
          We built MyRunner for everything <span className="italic text-gold">other</span> apps ignore.
        </h1>
        <div className="mt-10 max-w-2xl space-y-6 text-lg text-muted-foreground">
          <p>
            A prescription when you're sick. The folder you left at the office.
            Car parts when your vehicle is down. A forgotten gift. House keys to
            someone locked out.
          </p>
          <p>
            Food delivery apps optimize for restaurants. MyRunner optimizes for
            the rest of life — any item, any time, with the full infrastructure
            of a professional platform: GPS tracking, in‑app chat, photo proof,
            loyalty rewards, insurance.
          </p>
          <p className="font-serif text-2xl italic text-foreground">
            Anything. Anytime. Anywhere.
          </p>
        </div>
      </section>
    </PageShell>
  );
}
