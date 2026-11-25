import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout } from "@/components/site/page-shell";

export const Route = createFileRoute("/refund-policy")({
  head: () => ({
    meta: [
      { title: "Refund Policy — MyRunner" },
      { name: "description", content: "When and how to request a refund on MyRunner. Damaged goods, late delivery, wrong item, driver issues — here's how it works." },
      { property: "og:title", content: "MyRunner Refund Policy" },
      { property: "og:url", content: "/refund-policy" },
    ],
    links: [{ rel: "canonical", href: "/refund-policy" }],
  }),
  component: () => (
    <LegalLayout title="Refund Policy" updated="January 1, 2026">
      <h2>Eligibility</h2>
      <p>You may request a refund for: damaged or lost item, item not delivered, wrong item picked up, significantly late delivery, or driver misconduct.</p>
      <h2>How to file</h2>
      <ol className="list-decimal pl-6 space-y-1">
        <li>Email <a className="text-gold underline" href="mailto:support@myrunner.shop">support@myrunner.shop</a> or use the contact form.</li>
        <li>Include the order ID, what happened, and a photo if you have one.</li>
        <li>There is no Request Refund button on the order screen yet.</li>
      </ol>
      <h2>Approved refunds</h2>
      <p>Approved refunds return to the original payment method through Stripe. Cargo insurance may also apply when an item is damaged or lost. For help any hour, call <a className="text-gold underline" href="tel:+15028122456">(502) 812-2456</a>.</p>
      <h2>Not eligible</h2>
      <ul>
        <li>Requests filed more than 7 days after delivery.</li>
        <li>Buyer's remorse or change of mind.</li>
        <li>Items prohibited under the Community Guidelines.</li>
      </ul>
    </LegalLayout>
  ),
});
