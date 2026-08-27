import { ArrowLeft } from "lucide-react";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

type BackButtonProps = {
  /** Used when there is no browser history to go back to */
  fallbackTo?: string;
  label?: string;
  className?: string;
};

/** Prefer previous history entry; otherwise navigate to fallbackTo. */
export function BackButton({
  fallbackTo = "/",
  label = "Back",
  className,
}: BackButtonProps) {
  const navigate = useNavigate();
  const router = useRouter();

  function goBack() {
    // TanStack Router keeps history entries; fall back when user landed directly
    if (router.history.canGoBack()) {
      router.history.back();
      return;
    }
    void navigate({ to: fallbackTo });
  }

  return (
    <button
      type="button"
      onClick={goBack}
      className={cn(
        "inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground",
        className,
      )}
    >
      <ArrowLeft className="size-4" />
      {label}
    </button>
  );
}
