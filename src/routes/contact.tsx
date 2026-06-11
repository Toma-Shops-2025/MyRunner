import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageShell } from "@/components/site/page-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { LegalConsent } from "@/components/site/legal-consent";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact MyRunner — support@myrunner.shop" },
      { name: "description", content: "Reach the MyRunner team. Email support@myrunner.shop or use our contact form for help with deliveries, drivers, refunds, or partnerships." },
      { property: "og:title", content: "Contact MyRunner" },
      { property: "og:description", content: "We answer fast. Real humans + AI support 24/7." },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: Contact,
});

function Contact() {
  const [agree, setAgree] = useState(false);
  return (
    <PageShell>
      <section className="container-app py-20">
        <p className="text-xs uppercase tracking-widest text-gold">Contact</p>
        <h1 className="mt-3 font-serif text-6xl">Real humans. Fast replies.</h1>
        <p className="mt-4 text-muted-foreground">support@myrunner.shop · 24/7 in‑app AI chat</p>
      </section>
      <section className="container-app pb-24">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!agree) return toast.error("Please accept the policies.");
            toast.success("Message sent — we'll reply within 24h.");
            (e.target as HTMLFormElement).reset();
            setAgree(false);
          }}
          className="grid max-w-xl gap-4 rounded-2xl border border-border bg-card p-8"
        >
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="msg">Message</Label>
            <Textarea id="msg" rows={5} required />
          </div>
          <LegalConsent id="contact-consent" checked={agree} onCheckedChange={setAgree} />
          <Button type="submit" className="bg-gold text-primary-foreground hover:bg-gold/90">Send message</Button>
        </form>
      </section>
    </PageShell>
  );
}
