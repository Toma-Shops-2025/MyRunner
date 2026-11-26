import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout } from "@/components/site/page-shell";
import { CARGO_INSURANCE_STATEMENT, DRIVER_SCREENING_STATEMENT, REFUND_POLICY_STATEMENT } from "@/lib/public-facts";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — MyRunner" },
      { name: "description", content: "The legal terms that govern your use of the MyRunner platform — for customers and drivers." },
      { property: "og:title", content: "MyRunner Terms of Service" },
      { property: "og:url", content: "/terms" },
    ],
    links: [{ rel: "canonical", href: "/terms" }],
  }),
  component: () => (
    <LegalLayout title="Terms of Service" updated="November 25, 2026">
      <p>By creating an account or using MyRunner, you agree to these Terms. If you don't agree, don't use the service.</p>
      <h2>1. The service</h2>
      <p>MyRunner is a technology platform that connects independent drivers ("Runners") with people requesting deliveries ("Customers"). MyRunner is not a delivery company itself and is not the employer of any Runner.</p>
      <h2>2. Account & eligibility</h2>
      <p>You must be 18+ to create an account. You're responsible for the activity on your account and for keeping your credentials secure.</p>
      <h2>3. Prohibited items</h2>
      <p>You may not request delivery of: illegal drugs, firearms or ammunition, hazardous materials, live animals, human remains, stolen goods, counterfeit items, or any item prohibited by law. See <a className="text-gold underline" href="/community-guidelines">Community Guidelines</a>.</p>
      <h2>4. Pricing & payment</h2>
      <p>Pricing is shown before checkout. You authorize MyRunner and Stripe to charge your payment method for the total amount, including tips. Refunds are governed by our <a className="text-gold underline" href="/refund-policy">Refund Policy</a>. {REFUND_POLICY_STATEMENT}</p>
      <h2>5. Driver terms</h2>
      <p>Runners are independent contractors. You set your own hours and routes. MyRunner keeps a 30% platform fee per delivery; you keep the rest plus 100% of tips. You agree to maintain a valid license and your own auto insurance. {DRIVER_SCREENING_STATEMENT}</p>
      <h2>6. Conduct</h2>
      <p>No harassment, discrimination, threats, or illegal activity. We may suspend or terminate accounts that violate this Section or our Community Guidelines.</p>
      <h2>7. Reporting & blocking</h2>
      <p>Customers and Runners can report each other and block specific drivers at any time via the in‑app Report and Block flows.</p>
      <h2>8. Disclaimers</h2>
      <p>The service is provided "as is". MyRunner doesn't guarantee uninterrupted availability, error‑free operation, or specific delivery times beyond posted estimates.</p>
      <h2>9. Limitation of liability</h2>
      <p>To the maximum extent permitted by law, MyRunner's total liability for any claim is limited to the amounts you paid us in the 12 months before the claim. {CARGO_INSURANCE_STATEMENT} {DRIVER_SCREENING_STATEMENT}</p>
      <h2>10. Arbitration & class waiver</h2>
      <p>You and MyRunner agree to resolve disputes through binding individual arbitration, not class actions, except where prohibited by law. You may opt out within 30 days of accepting these Terms by emailing <a className="text-gold underline" href="mailto:support@myrunner.shop">support@myrunner.shop</a>.</p>
      <h2>11. Termination</h2>
      <p>You can delete your account anytime under App → Settings. We may suspend or terminate accounts that violate these Terms.</p>
      <h2>12. Changes</h2>
      <p>We may update these Terms. Material changes will be notified in‑app or by email.</p>
      <h2>13. Governing law</h2>
      <p>
        MyRunner is built and operated from Kentucky, with Louisville as the first launch market. These Terms
        are governed by the laws of the Commonwealth of Kentucky, USA, without regard to conflict‑of‑law rules.
        If you are a consumer, you may have additional non‑waivable rights under the laws of the U.S. state or
        territory where you live; nothing in these Terms limits those rights where applicable law requires them.
      </p>
    </LegalLayout>
  ),
});
