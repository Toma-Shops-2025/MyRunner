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
        <li>Open My Orders, find the delivery.</li>
        <li>Tap <strong>Request Refund</strong>.</li>
        <li>Select a reason and upload photo evidence if applicable.</li>
        <li>Submit. We review within 1–3 business days.</li>
      </ol>
      <h2>Approved refunds</h2>
      <p>Refunds return to your original payment method. For damaged or lost items, our $100 cargo insurance may apply on top of a base refund.</p>
      <h2>Not eligible</h2>
      <ul>
        <li>Requests filed more than 7 days after delivery.</li>
        <li>Buyer's remorse or change of mind.</li>
        <li>Items prohibited under the Community Guidelines.</li>
      </ul>
    </LegalLayout>
  ),
});
