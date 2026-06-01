import { Link } from "@tanstack/react-router";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

/**
 * Standard legal-consent checkbox shown on signup, driver application,
 * new-delivery, and report forms. Always required (controlled component).
 */
export function LegalConsent({
  id,
  checked,
  onCheckedChange,
  variant = "signup",
}: {
  id: string;
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
  variant?: "signup" | "driver" | "order" | "report";
}) {
  const text = (() => {
    switch (variant) {
      case "driver":
        return (
          <>
            I confirm I am at least 18, have a valid license and insurance, and
            consent to a background check (Checkr). I agree to the{" "}
            <Link to="/terms" className="text-gold underline">Terms</Link>,{" "}
            <Link to="/privacy" className="text-gold underline">Privacy Policy</Link>,
            and{" "}
            <Link to="/community-guidelines" className="text-gold underline">
              Community Guidelines
            </Link>
            .
          </>
        );
      case "order":
        return (
          <>
            I confirm the item is legal to transport, not perishable/hazardous in
            violation of policy, and I accept the{" "}
            <Link to="/terms" className="text-gold underline">Terms</Link> and{" "}
            <Link to="/refund-policy" className="text-gold underline">Refund Policy</Link>.
          </>
        );
      case "report":
        return (
          <>
            I confirm this report is true to the best of my knowledge. False
            reports may violate the{" "}
            <Link to="/community-guidelines" className="text-gold underline">
              Community Guidelines
            </Link>
            .
          </>
        );
      default:
        return (
          <>
            I agree to the{" "}
            <Link to="/terms" className="text-gold underline">Terms of Service</Link>,{" "}
            <Link to="/privacy" className="text-gold underline">Privacy Policy</Link>,
            and{" "}
            <Link to="/cookies" className="text-gold underline">Cookie Policy</Link>.
          </>
        );
    }
  })();

  return (
    <div className="flex items-start gap-3 rounded-md border border-border bg-surface p-3">
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={(v) => onCheckedChange(v === true)}
        className="mt-0.5"
      />
      <Label htmlFor={id} className="text-xs leading-relaxed text-muted-foreground font-normal">
        {text}
      </Label>
    </div>
  );
}
