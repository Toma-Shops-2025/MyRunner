import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout } from "@/components/site/page-shell";

export const Route = createFileRoute("/community-guidelines")({
  head: () => ({
    meta: [
      { title: "Community Guidelines — MyRunner" },
      { name: "description", content: "The rules every customer and Runner agrees to follow on the MyRunner platform." },
      { property: "og:title", content: "MyRunner Community Guidelines" },
      { property: "og:url", content: "/community-guidelines" },
    ],
    links: [{ rel: "canonical", href: "/community-guidelines" }],
  }),
  component: () => (
    <LegalLayout title="Community Guidelines" updated="January 1, 2026">
      <p>MyRunner only works if everyone shows up with respect and good faith. Violations may lead to warnings, suspensions, or permanent bans.</p>
      <h2>For everyone</h2>
      <ul>
        <li>No harassment, hate speech, threats, or discrimination on any protected basis.</li>
        <li>No sexual content or unwanted advances.</li>
        <li>No weapons, fraud, or illegal activity.</li>
        <li>No misuse of personal contact information shared during a delivery.</li>
      </ul>
      <h2>Prohibited items</h2>
      <ul>
        <li>Illegal drugs, controlled substances without prescription</li>
        <li>Firearms, ammunition, explosives, hazardous materials</li>
        <li>Live animals, human remains, biological samples</li>
        <li>Stolen, counterfeit, or recalled goods</li>
        <li>Alcohol or tobacco to unverified recipients</li>
        <li>Cash exceeding $500</li>
      </ul>
      <h2>For customers</h2>
      <ul>
        <li>Accurate pickup/drop‑off info and clear instructions.</li>
        <li>Honest item descriptions.</li>
        <li>Be reachable during active deliveries.</li>
      </ul>
      <h2>For Runners</h2>
      <ul>
        <li>Follow all traffic laws — never tamper with safety equipment.</li>
        <li>Handle items with care; don't open packages.</li>
        <li>Take photo proof at every drop‑off.</li>
        <li>Be punctual, respectful, and professional.</li>
      </ul>
      <h2>Reporting</h2>
      <p>Found something? Tap <strong>Report</strong> on any order or visit <a className="text-gold underline" href="/app/report">App → Report</a>. We review every report.</p>
    </LegalLayout>
  ),
});
