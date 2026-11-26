import type { ReactNode } from "react";

/** Top-aligned auth layout — avoids huge gray gaps when the mobile keyboard opens. */
export function AuthPageSection({
  children,
  className = "max-w-md",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className="container-app py-6 pb-28 sm:py-16 sm:pb-20">
      <div className={`mx-auto w-full ${className}`}>{children}</div>
    </section>
  );
}