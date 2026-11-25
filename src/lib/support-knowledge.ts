/** Shared FAQ + policy facts for the AI assistant (keep in sync with marketing pages). */

export const SUPPORT_FAQ = [
  {
    q: "What can I send with MyRunner?",
    a: "Eligible items you already own, if they are legal and a Runner can carry them. Examples: belongings sent to another person, forgotten keys or a phone, a store or office pickup, or a gift. The buyer, pickup contact, and recipient can be different people. Standard, multi-pickup, and multi-dropoff are available. See Community Guidelines for prohibited items. Coming to your city very soon!!! Louisville is first.",
  },
  {
    q: "How is pricing calculated?",
    a: "$5.99 base + $1.50 per mile + $3 for each extra pickup or drop-off address. Multi-pickup asks for every pickup. Multi-dropoff asks for every drop-off. Tips are optional and 100% go to the driver.",
  },
  {
    q: "How fast is pickup?",
    a: "There is no average pickup time yet. Louisville is the first market and there are no completed orders to measure. The order screen shows live GPS after a Runner accepts.",
  },
  {
    q: "Are deliveries insured?",
    a: "Yes. MyRunner provides cargo insurance on deliveries.",
  },
  {
    q: "How do I become a Runner?",
    a: "Apply at /driver-signup with your license, your own auto insurance, and vehicle info. You can start driving immediately. MyRunner may, at its discretion, run a Checkr background check and deactivate your account if disqualifying charges appear. That Checkr screening is pending.",
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
    a: "Call 24-hour support at (502) 812-2456, email support@myrunner.shop, or use Contact with your order ID. Approved refunds return to your original payment method. Cargo insurance may also apply if an item is damaged or lost.",
  },
] as const;

export const SUPPORT_POLICIES = `
Contact email: support@myrunner.shop
24-hour support phone: (502) 812-2456
Launch: Coming to your city very soon!!! Louisville, Kentucky is first. Lexington is next.
Insurance: MyRunner provides cargo insurance on deliveries. Runners carry their own auto insurance.
Background checks: Runners can start immediately. MyRunner may run Checkr at its discretion and deactivate a driver if disqualifying charges appear. Checkr screening is pending. Do not say every Runner has already passed Checkr.
Delivery types: standard (one pickup and one drop-off), multi-pickup (two or more pickups and one drop-off), and multi-dropoff (one pickup and two or more drop-offs). Each extra address is $3. Do not say the service is limited to one pickup and one drop-off.
Safety: Never share passwords. For threats, theft, or assault — call local emergency services first, then file an in-app Report.
Prohibited: illegal goods, weapons, hazardous materials, people transport (MyRunner is delivery only, not rideshare).
Driver share: 70% of delivery fee + 100% of tips.
`.trim();

export function faqKnowledgeBlock(): string {
  return SUPPORT_FAQ.map((f) => `Q: ${f.q}\nA: ${f.a}`).join("\n\n");
}
