import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout } from "@/components/site/page-shell";
import {
  APPROVED_REFUND_STATEMENT,
  REFUND_POLICY_STATEMENT,
  SUPPORT_EMAIL,
  SUPPORT_PHONE_DISPLAY,
  SUPPORT_PHONE_TEL,
  SUPPORT_STATEMENT,
} from "@/lib/public-facts";

export const Route = createFileRoute("/refund-policy")({
  head: () => ({
    meta: [
      { title: "Refund Policy — MyRunner" },
      { name: "description", content: REFUND_POLICY_STATEMENT },
      { property: "og:title", content: "MyRunner Refund Policy" },
      { property: "og:url", content: "/refund-policy" },
    ],
    links: [{ rel: "canonical", href: "/refund-policy" }],
  }),
  component: () => (
    <LegalLayout title="Refund Policy" updated="November 25, 2026">
      <p>{REFUND_POLICY_STATEMENT}</p>
      <p>
        {SUPPORT_STATEMENT} Phone:{" "}
        <a className="text-gold underline" href={`tel:${SUPPORT_PHONE_TEL}`}>{SUPPORT_PHONE_DISPLAY}</a>.
        Email: <a className="text-gold underline" href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.
      </p>
      <h2>Eligibility</h2>
      <p>You may request a refund for: damaged or lost item, item not delivered, wrong item picked up, significantly late delivery, or driver misconduct.</p>
      <h2>How to request a refund</h2>
      <ol className="list-decimal pl-6 space-y-1">
        <li>Contact support by phone or email, or use the contact form.</li>
        <li>Include the order ID, what happened, and a photo if you have one.</li>
      </ol>
      <h2>Approved refunds</h2>
      <p>{APPROVED_REFUND_STATEMENT}</p>
      <h2>Not eligible</h2>
      <ul>
        <li>Requests filed more than 7 days after delivery.</li>
        <li>Buyer&apos;s remorse or change of mind.</li>
        <li>Items prohibited under the Community Guidelines.</li>
      </ul>
    </LegalLayout>
  ),
});
