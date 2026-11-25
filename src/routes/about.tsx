import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/site/page-shell";

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
        <h1 className="mt-3 max-w-3xl font-serif text-6xl leading-[1.05]">
          A marketplace for moving what you already have.
        </h1>
        <div className="mt-10 max-w-2xl space-y-6 text-lg text-muted-foreground">
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
            Coming to your city very soon!!! Louisville, Kentucky is the first market.
            Lexington is prepared as the second market and will open after Louisville
            shows enough demand and the operation is ready.
          </p>
          <p>
            Orders use live GPS while a Runner is on the job, in-app messages between
            the customer and the Runner, a photo at drop-off, Stripe for payment, and
            cargo insurance. Choose standard, multi-pickup, or multi-dropoff. 24-hour
            support is (502) 812-2456.
          </p>
          <p>
            Every delivery stays subject to applicable law, the prohibited-item rules,
            and what a Runner can carry.
          </p>
          <p className="font-serif text-2xl italic text-foreground">
            Anything. Anywhere. Anytime.
          </p>
        </div>
      </section>
    </PageShell>
  );
}
