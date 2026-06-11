import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout } from "@/components/site/page-shell";

export const Route = createFileRoute("/accessibility")({
  head: () => ({
    meta: [
      { title: "Accessibility — MyRunner" },
      { name: "description", content: "MyRunner is committed to building a service that works for everyone, including people with disabilities. WCAG 2.1 AA targets." },
      { property: "og:title", content: "MyRunner Accessibility" },
      { property: "og:url", content: "/accessibility" },
    ],
    links: [{ rel: "canonical", href: "/accessibility" }],
  }),
  component: () => (
    <LegalLayout title="Accessibility Statement" updated="January 1, 2026">
      <p>MyRunner aims to conform to WCAG 2.1 Level AA across the website and mobile app.</p>
      <h2>What we do</h2>
      <ul>
        <li>Semantic HTML and keyboard‑navigable interfaces.</li>
        <li>Sufficient color contrast and resizable text.</li>
        <li>Alt text on meaningful images.</li>
        <li>44px minimum tap targets on mobile.</li>
        <li>Voice guidance through the delivery form.</li>
      </ul>
      <h2>Found a barrier?</h2>
      <p>Email <a className="text-gold underline" href="mailto:support@myrunner.shop">support@myrunner.shop</a> with the page and issue. We respond within 5 business days.</p>
    </LegalLayout>
  ),
});
