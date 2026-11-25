/** Shared FAQ + policy facts for the AI assistant (keep in sync with marketing pages). */
import {
  APPROVED_REFUND_STATEMENT,
  CARGO_INSURANCE_STATEMENT,
  DRIVER_SCREENING_STATEMENT,
  REFUND_POLICY_STATEMENT,
  SUPPORT_EMAIL,
  SUPPORT_PHONE_DISPLAY,
  SUPPORT_STATEMENT,
} from "@/lib/public-facts";

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
    a: CARGO_INSURANCE_STATEMENT,
  },
  {
    q: "How do I become a Runner?",
    a: `Apply at /driver-signup with your license, your own auto insurance, and vehicle info. ${DRIVER_SCREENING_STATEMENT}`,
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
    a: `${REFUND_POLICY_STATEMENT} ${SUPPORT_STATEMENT} Phone ${SUPPORT_PHONE_DISPLAY}. Email ${SUPPORT_EMAIL}. Include the order ID. ${APPROVED_REFUND_STATEMENT}`,
  },
] as const;

export const SUPPORT_POLICIES = `
Contact email: support@myrunner.shop
Support phone: (502) 812-2456
Support: ${SUPPORT_STATEMENT} Phone ${SUPPORT_PHONE_DISPLAY}. Email ${SUPPORT_EMAIL}. Say support is 24/7 after launch in a city or state. Do not say there is no support line.
Launch: Coming to your city very soon!!! Louisville, Kentucky is first. Lexington is next. Pricing, 24/7 support, cargo insurance, refunds, and driver rules apply after MyRunner launches in that city or state.
Insurance: ${CARGO_INSURANCE_STATEMENT} Do not say cargo insurance is already included today. Runners carry their own auto insurance.
Background checks: ${DRIVER_SCREENING_STATEMENT} Do not say a clean background check is required before a driver can start. Do not say every Runner has already passed Checkr. Do not limit the start rule to Louisville only.
Refunds: ${REFUND_POLICY_STATEMENT} ${APPROVED_REFUND_STATEMENT} Do not say there is no refund button.
Delivery types: standard (one pickup and one drop-off), multi-pickup (two or more pickups and one drop-off), and multi-dropoff (one pickup and two or more drop-offs). Each extra address is $3. Do not say the service is limited to one pickup and one drop-off.
Safety: Never share passwords. For threats, theft, or assault — call local emergency services first, then file an in-app Report.
Prohibited: illegal goods, weapons, hazardous materials, people transport (MyRunner is delivery only, not rideshare).
Driver share: 70% of delivery fee + 100% of tips.
`.trim();

export function faqKnowledgeBlock(): string {
  return SUPPORT_FAQ.map((f) => `Q: ${f.q}\nA: ${f.a}`).join("\n\n");
}
