import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout } from "@/components/site/page-shell";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — MyRunner" },
      { name: "description", content: "How MyRunner collects, uses, shares, and protects your personal data, including GPS location, payment details, and account information." },
      { property: "og:title", content: "MyRunner Privacy Policy" },
      { property: "og:url", content: "/privacy" },
    ],
    links: [{ rel: "canonical", href: "/privacy" }],
  }),
  component: () => (
    <LegalLayout title="Privacy Policy" updated="January 1, 2026">
      <p>This Privacy Policy explains how MyRunner Inc. ("MyRunner", "we", "us") collects, uses, shares, and protects information about you when you use our website, mobile app, or services.</p>
      <h2>1. Information we collect</h2>
      <ul>
        <li><strong>Account info</strong>: name, email, phone, password (hashed).</li>
        <li><strong>Delivery info</strong>: pickup/drop‑off addresses, item descriptions, recipient details you provide.</li>
        <li><strong>Driver info</strong>: license, insurance, vehicle data, background check results (via Checkr).</li>
        <li><strong>Payment info</strong>: processed by Stripe. We never see or store full card numbers.</li>
        <li><strong>Location</strong>: real‑time GPS while a delivery is active. Drivers share location every ~30 seconds during active deliveries.</li>
        <li><strong>Device & usage</strong>: device type, IP, app version, interactions for analytics and security.</li>
      </ul>
      <h2>2. How we use it</h2>
      <ul>
        <li>To match customers and Runners, calculate quotes, and complete deliveries.</li>
        <li>To process payments and payouts.</li>
        <li>To verify identity and run background checks for drivers.</li>
        <li>To prevent fraud, investigate disputes, and enforce our Terms.</li>
        <li>To send transactional messages (order updates, receipts) and, with consent, marketing.</li>
      </ul>
      <h2>3. Who we share with</h2>
      <ul>
        <li><strong>Drivers and customers</strong>: limited info needed to complete the delivery (first name, rating, vehicle).</li>
        <li><strong>Service providers</strong>: Stripe (payments), Mapbox (maps), Checkr (background), email/SMS providers, hosting.</li>
        <li><strong>Legal</strong>: law enforcement when required by valid legal process.</li>
      </ul>
      <p>We do not sell your personal information.</p>
      <h2>4. Your rights</h2>
      <p>Depending on where you live (e.g., California CCPA/CPRA, EU GDPR), you may have the right to access, correct, delete, or port your data, and to opt out of certain processing. Email <a className="text-gold underline" href="mailto:support@myrunner.online">support@myrunner.online</a> or use the in‑app Delete Account flow under App → Settings.</p>
      <h2>5. Data retention</h2>
      <p>Account data is kept until you delete your account. After deletion, personal data is removed within 30 days, except records we must retain for tax, fraud, safety, or legal compliance.</p>
      <h2>6. Children</h2>
      <p>MyRunner is not directed to children under 16. We do not knowingly collect data from children.</p>
      <h2>7. International transfers</h2>
      <p>We may process data in the United States. Where required, we use Standard Contractual Clauses.</p>
      <h2>8. Changes</h2>
      <p>We'll notify you of material changes. Continued use of the service constitutes acceptance.</p>
      <h2>9. Contact</h2>
      <p>Email <a className="text-gold underline" href="mailto:support@myrunner.online">support@myrunner.online</a> with privacy questions.</p>
    </LegalLayout>
  ),
});
