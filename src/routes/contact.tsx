import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageShell } from "@/components/site/page-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { LegalConsent } from "@/components/site/legal-consent";
import { submitContactMessage } from "@/lib/support.functions";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact MyRunner — support@myrunner.shop" },
      { name: "description", content: "Reach the MyRunner team. Email support@myrunner.shop or use our contact form for help with deliveries, drivers, refunds, or partnerships." },
      { property: "og:title", content: "Contact MyRunner" },
      { property: "og:description", content: "24-hour support at (502) 812-2456 or support@myrunner.shop." },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: Contact,
});

function Contact() {
  const [agree, setAgree] = useState(false);
  const [busy, setBusy] = useState(false);

  return (
    <PageShell>
      <section className="container-app py-20">
        <p className="text-xs uppercase tracking-widest text-gold">Contact</p>
        <h1 className="mt-3 font-serif text-6xl">Contact support.</h1>
        <p className="mt-4 max-w-xl text-muted-foreground">
          Coming to your city very soon!!! Call 24-hour support at{" "}
          <a className="text-gold underline" href="tel:+15028122456">(502) 812-2456</a>,
          email support@myrunner.shop, or send the form below. The Help button can answer common questions from the FAQ.
        </p>
      </section>
      <section className="container-app pb-24">
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (!agree) return toast.error("Please accept the policies.");
            const form = e.currentTarget;
            const fd = new FormData(form);
            setBusy(true);
            try {
              await submitContactMessage({
                data: {
                  name: String(fd.get("name") || ""),
                  email: String(fd.get("email") || ""),
                  message: String(fd.get("msg") || ""),
                },
              });
              toast.success("Message sent. We'll reply by email when we can.");
              form.reset();
              setAgree(false);
            } catch (err) {
              toast.error(err instanceof Error ? err.message : "Could not send message.");
            } finally {
              setBusy(false);
            }
          }}
          className="grid max-w-xl gap-4 rounded-2xl border border-border bg-card p-8"
        >
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="msg">Message</Label>
            <Textarea id="msg" name="msg" rows={5} required />
          </div>
          <LegalConsent id="contact-consent" checked={agree} onCheckedChange={setAgree} />
          <Button type="submit" disabled={busy} className="bg-gold text-primary-foreground hover:bg-gold/90">
            {busy ? "Sending…" : "Send message"}
          </Button>
        </form>
      </section>
    </PageShell>
  );
}
