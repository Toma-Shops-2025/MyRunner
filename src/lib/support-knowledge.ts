/** Shared FAQ + policy facts for the AI assistant (keep in sync with marketing pages). */

export const SUPPORT_FAQ = [
  {
    q: "What can I send with MyRunner?",
    a: "Eligible items you already own, if they are legal and a Runner can carry them. Examples: belongings sent to another person, forgotten keys or a phone, a store or office pickup, or a gift. The buyer, pickup contact, and recipient can be different people. See Community Guidelines for prohibited items. Launching first in Louisville, Kentucky.",
  },
  {
    q: "How is pricing calculated?",
    a: "$5.99 base + $1.50 per mile + $3 per extra stop. Tips are optional and 100% go to the driver.",
  },
  {
    q: "How fast is pickup?",
    a: "There is no average pickup time yet. Louisville is the first market and there are no completed orders to measure. The order screen shows live GPS after a Runner accepts.",
  },
  {
    q: "Are deliveries insured?",
    a: "No. MyRunner does not provide cargo insurance. Do not send anything you cannot afford to lose.",
  },
  {
    q: "How do I become a Runner?",
    a: "Apply at /driver-signup with your license, your own auto insurance, and vehicle info. A third-party background check is not connected yet.",
  },
  {
    q: "How much do drivers make?",
    a: "70% of the delivery fee plus 100% of tips, paid through Stripe after a completed delivery. There is no hourly earnings figure yet.",
  },
  {
    q: "When do drivers get paid?",
    a: "After each delivery, earnings transfer to your linked bank via Stripe Connect on the standard payout schedule.",
  },
  {
    q: "Can I request a specific driver?",
    a: "Yes. Mark a Runner as preferred in Settings and they'll be prioritized on your future orders when available.",
  },
  {
    q: "Can I block a driver?",
    a: "Yes. From Settings, block a Runner. They will never be matched to your future requests.",
  },
  {
    q: "How do I delete my account?",
    a: "Go to App → Settings → Delete account. Your data is removed within 30 days.",
  },
  {
    q: "How do I report someone?",
    a: "From the app, open Report. Choose a reason and add details — we review every report. In immediate danger, call emergency services first.",
  },
  {
    q: "How do refunds work?",
    a: "Email support@myrunner.shop or use Contact with your order ID. Admin reviews within 1–3 business days. Approved refunds return to your original payment method.",
  },
] as const;

export const SUPPORT_POLICIES = `
Contact email: support@myrunner.shop
Support: email support@myrunner.shop or the contact form. There is no staffed 24/7 phone line. The in-app assistant answers from this FAQ only.
Launch: Louisville, Kentucky first. Lexington later. Not nationwide.
Insurance: MyRunner does not provide cargo, hired-auto, or other insurance.
Background checks: not connected. Do not say every Runner passed Checkr.
Safety: Never share passwords. For threats, theft, or assault — call local emergency services first, then file an in-app Report.
Prohibited: illegal goods, weapons, hazardous materials, people transport (MyRunner is delivery only, not rideshare).
Driver share: 70% of delivery fee + 100% of tips.
`.trim();

export function faqKnowledgeBlock(): string {
  return SUPPORT_FAQ.map((f) => `Q: ${f.q}\nA: ${f.a}`).join("\n\n");
}
