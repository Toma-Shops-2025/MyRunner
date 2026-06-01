import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout } from "@/components/site/page-shell";

export const Route = createFileRoute("/cookies")({
  head: () => ({
    meta: [
      { title: "Cookie Policy — MyRunner" },
      { name: "description", content: "How MyRunner uses cookies and similar technologies, and how to control them." },
      { property: "og:title", content: "MyRunner Cookie Policy" },
      { property: "og:url", content: "/cookies" },
    ],
    links: [{ rel: "canonical", href: "/cookies" }],
  }),
  component: () => (
    <LegalLayout title="Cookie Policy" updated="January 1, 2026">
      <p>We use cookies and similar technologies (local storage, SDK identifiers) to operate, secure, and improve MyRunner.</p>
      <h2>Types of cookies</h2>
      <ul>
        <li><strong>Essential</strong> — sign‑in, security, fraud prevention. Cannot be disabled.</li>
        <li><strong>Functional</strong> — remember preferences (theme, recent addresses).</li>
        <li><strong>Analytics</strong> — anonymous usage to improve the product.</li>
        <li><strong>Marketing</strong> — measure campaign performance. Off by default outside the US.</li>
      </ul>
      <h2>Managing cookies</h2>
      <p>You can clear cookies in your browser or device settings. Disabling essential cookies will break sign‑in and order tracking.</p>
      <h2>Do Not Track</h2>
      <p>We respect the Global Privacy Control signal for analytics and marketing categories.</p>
    </LegalLayout>
  ),
});
