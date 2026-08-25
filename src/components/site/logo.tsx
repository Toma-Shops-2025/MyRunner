import { Link } from "@tanstack/react-router";
import logoIcon from "@/assets/myrunner-icon.png";

export function Logo({ withText = true, size = 32 }: { withText?: boolean; size?: number }) {
  return (
    <Link to="/" className="group inline-flex items-center gap-2.5" aria-label="MyRunner home">
      <img
        src={logoIcon}
        alt=""
        width={size}
        height={size}
        className="rounded-lg object-cover ring-1 ring-gold/30 transition-transform group-hover:scale-105"
        style={{ width: size, height: size }}
      />
      {withText && (
        <span className="font-serif text-xl tracking-tight">
          My<span className="text-gold">Runner</span>
        </span>
      )}
    </Link>
  );
}
