import { Link } from "@tanstack/react-router";
import { Logo } from "./logo";
import {
  CARGO_INSURANCE_STATEMENT,
  DRIVER_SCREENING_STATEMENT,
  SUPPORT_EMAIL,
  SUPPORT_PHONE_DISPLAY,
  SUPPORT_PHONE_TEL,
  SUPPORT_STATEMENT,
} from "@/lib/public-facts";

const cols = [
  {
    title: "Platform",
    links: [
      { to: "/how-it-works", label: "How it works" },
      { to: "/pricing", label: "Pricing" },
      { to: "/safety", label: "Safety" },
      { to: "/about", label: "About" },
    ],
  },
  {
    title: "For drivers",
    links: [
      { to: "/drivers", label: "Become a Runner" },
      { to: "/signup", search: { intent: "driver" }, label: "Driver application" },
      { to: "/faq", label: "Driver FAQ" },
    ],
  },
  {
    title: "Support",
    links: [
      { to: "/contact", label: "Contact us" },
      { to: "/faq", label: "Help center" },
      { to: "/app/report", label: "Report an issue" },
      { to: "/refund-policy", label: "Refunds" },
      { to: "/share", label: "Share / QR code" },
    ],
  },
  {
    title: "Legal",
    links: [
      { to: "/terms", label: "Terms of service" },
      { to: "/privacy", label: "Privacy policy" },
      { to: "/cookies", label: "Cookie policy" },
      { to: "/community-guidelines", label: "Community guidelines" },
      { to: "/accessibility", label: "Accessibility" },
    ],
  },
] as const;

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-surface">
      <div className="container-app py-16">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_3fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm font-semibold uppercase tracking-wide text-gold">
              Coming to your city very soon!!!
            </p>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              Anything. Anywhere. Anytime. Pickup and delivery for eligible items
              between people and places. Louisville is first. Lexington is next.
            </p>
            <p className="mt-6 max-w-xs text-xs text-muted-foreground">
              {SUPPORT_STATEMENT}
              <br />
              <a className="text-foreground hover:text-gold" href={`tel:${SUPPORT_PHONE_TEL}`}>
                {SUPPORT_PHONE_DISPLAY}
              </a>
              <br />
              {SUPPORT_EMAIL}
            </p>
            <p className="mt-4 max-w-xs text-xs text-muted-foreground">{CARGO_INSURANCE_STATEMENT}</p>
            <p className="mt-4 max-w-xs text-xs text-muted-foreground">{DRIVER_SCREENING_STATEMENT}</p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {cols.map((c) => (
              <div key={c.title}>
                <h4 className="font-sans text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  {c.title}
                </h4>
                <ul className="mt-4 space-y-2">
                  {c.links.map((l) => (
                    <li key={l.label}>
                      <Link
                        to={l.to}
                        {...("search" in l && l.search ? { search: l.search } : {})}
                        className="text-sm text-foreground/80 transition-colors hover:text-gold"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-12 border-t border-border pt-8 text-sm text-muted-foreground">
          <p className="font-serif text-3xl text-foreground">MyRunner</p>
          <p className="mt-3">Anything. Anywhere. Anytime.</p>
          <p className="mt-6">© {new Date().getFullYear()} MyRunner. All rights reserved.</p>
          <p className="mt-2 flex flex-wrap items-center gap-2">
            A venture developed under the Toma Ventures Group{" "}
            <img
              src="/toma-ventures-mark.jpg"
              alt="Toma Ventures Group"
              className="inline-block size-6 rounded-full object-cover"
            />
            brand.
          </p>
          <p className="mt-2">Building Ideas. Creating Opportunity.</p>
        </div>
      </div>
    </footer>
  );
}
