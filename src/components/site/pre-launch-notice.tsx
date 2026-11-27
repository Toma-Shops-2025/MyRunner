import { Link } from "@tanstack/react-router";
import { PRE_LAUNCH_DISCLOSURE_SHORT } from "@/lib/public-facts";

/** Single pre-launch disclaimer block — use once per page instead of repeating legal paragraphs. */
export function PreLaunchNotice({ className = "" }: { className?: string }) {
  return (
    <aside
      className={`rounded-2xl border border-border bg-muted/30 px-5 py-4 text-sm leading-relaxed text-muted-foreground ${className}`}
    >
      <p>{PRE_LAUNCH_DISCLOSURE_SHORT}</p>
      <p className="mt-2">
        <Link to="/safety" className="font-medium text-foreground underline-offset-2 hover:text-gold hover:underline">
          Safety &amp; compliance details
        </Link>
        {" · "}
        <Link to="/terms" className="font-medium text-foreground underline-offset-2 hover:text-gold hover:underline">
          Terms
        </Link>
      </p>
    </aside>
  );
}