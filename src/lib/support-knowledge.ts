/** Shared FAQ + policy facts for the AI assistant (keep in sync with marketing pages). */

export const SUPPORT_FAQ = [
  {
    q: "What can I send with MyRunner?",
    a: "Almost anything legal that fits in a vehicle — documents, packages, prescriptions, gifts, car parts, keys, groceries. See Community Guidelines for prohibited items.",
  },
  {
    q: "How is pricing calculated?",
    a: "$5.99 base + $1.50 per mile + $3 per extra stop. Tips are optional and 100% go to the driver.",
  },
  {
    q: "How fast is pickup?",
    a: "Average pickup is under 12 minutes in covered metros. You'll see live ETA on your tracking screen.",
  },
  {
    q: "Are deliveries insured?",
    a: "Yes — every delivery includes up to $100 of cargo insurance at no extra cost.",
  },
  {
    q: "How do I become a Runner?",
    a: "Apply at /driver-signup. Submit your license, insurance, vehicle info, and pass a Checkr background check.",
  },
  {
    q: "How much do drivers make?",
    a: "70% of every fee plus 100% of tips. Average earnings are $20–$35/hour depending on demand.",
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
Support hours promise: AI chat 24/7; human follow-up usually within 24 hours for contact form messages.
Safety: Never share passwords. For threats, theft, or assault — call local emergency services first, then file an in-app Report.
Prohibited: illegal goods, weapons, hazardous materials, people transport (MyRunner is delivery only, not rideshare).
Driver share: 70% of delivery fee + 100% of tips.
`.trim();

export function faqKnowledgeBlock(): string {
  return SUPPORT_FAQ.map((f) => `Q: ${f.q}\nA: ${f.a}`).join("\n\n");
}
