import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/site/page-shell";
import { LAUNCH_BADGE, MARKET_LAUNCH_LINE } from "@/lib/public-facts";
import { PreLaunchNotice } from "@/components/site/pre-launch-notice";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About MyRunner — Pickup and delivery, not just food" },
      { name: "description", content: "MyRunner is a pickup-and-delivery marketplace launching in Louisville, Kentucky. Arrange transportation of eligible items between people and places." },
      { property: "og:title", content: "About MyRunner" },
      { property: "og:description", content: "Anything. Anywhere. Anytime. Launching first in Louisville." },
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
        <p className="mt-2 text-sm font-semibold uppercase tracking-wide text-gold">{LAUNCH_BADGE}</p>
        <h1 className="mt-3 max-w-3xl font-serif text-6xl leading-[1.05]">
          A marketplace for moving what you already have.
        </h1>
        <div className="mt-10 max-w-2xl space-y-6 text-lg text-muted-foreground">
          <div className="grid gap-4 rounded-2xl border border-border bg-card p-6 text-base text-foreground">
            <p className="font-serif text-xl">What we are building</p>
            <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
              <li>Pickup-and-delivery marketplace for eligible items — not restaurants, not a traditional courier.</li>
              <li>{MARKET_LAUNCH_LINE}</li>
              <li>Live GPS, in-app chat, photo proof at drop-off, and Stripe payments.</li>
              <li>Runners keep 70% of the delivery fee and 100% of tips.</li>
            </ul>
          </div>
          <p>
            MyRunner is a broad pickup-and-delivery marketplace. It is not a restaurant
            app and it is not a traditional courier company. Customers arrange
            transportation of eligible items between locations and people. The item
            does not have to be purchased through MyRunner.
          </p>
          <p>
            That includes sending belongings you already own, recovering forgotten keys,
            a wallet, or a phone, picking up from a store, business, home, or office,
            and sending a gift, package, or supplies to someone else. The person who
            places the order, the pickup contact, and the recipient can be three
            different people.
          </p>
          <p>
            Every delivery stays subject to applicable law, community guidelines on
            prohibited items, and what a Runner can safely carry.
          </p>
          <PreLaunchNotice />
          <p className="font-serif text-2xl italic text-foreground">
            Anything. Anywhere. Anytime.
          </p>
        </div>
      </section>
    </PageShell>
  );
}
