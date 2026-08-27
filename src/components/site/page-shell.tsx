import type { ReactNode } from "react";
import { useRouterState } from "@tanstack/react-router";
import { SiteHeader } from "./header";
import { SiteFooter } from "./footer";
import { BackButton } from "./back-button";
import { cn } from "@/lib/utils";

export function PageShell({
  children,
  className,
  showBack,
  backFallback = "/",
}: {
  children: ReactNode;
  className?: string;
  /** Override auto back (hidden on home). */
  showBack?: boolean;
  backFallback?: string;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const shouldShowBack = showBack ?? pathname !== "/";

  return (
    <div className={cn("flex min-h-screen flex-col bg-background", className)}>
      <SiteHeader />
      <main className="flex-1">
        {shouldShowBack ? (
          <div className="container-app pt-6">
            <BackButton fallbackTo={backFallback} />
          </div>
        ) : null}
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}

export function LegalLayout({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <PageShell>
      <section className="container-app pb-20 pt-6">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">Legal</p>
        <h1 className="mt-3 font-serif text-5xl">{title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: {updated}</p>
        <div className="prose-legal mt-12 max-w-3xl space-y-6 text-foreground/85 [&_h2]:mt-10 [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:text-foreground [&_h3]:mt-6 [&_h3]:font-serif [&_h3]:text-xl [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-6 [&_li]:my-1">
          {children}
        </div>
      </section>
    </PageShell>
  );
}
