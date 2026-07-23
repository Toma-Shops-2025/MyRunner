import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Package, Clock, MapPin, Shield, Star, Zap, Smartphone, Users, CheckCircle2 } from "lucide-react";
import { PageShell } from "@/components/site/page-shell";
import { Button } from "@/components/ui/button";
import heroVideo from "@/assets/hero-courier.mp4.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MyRunner — On‑demand local delivery for anything, anywhere" },
      { name: "description", content: "MyRunner connects you with vetted local Runners to pick up and deliver anything, anytime. From $5.99, live GPS tracking, photo proof, 24/7 in 50+ cities." },
      { property: "og:title", content: "MyRunner — Anything · Anytime · Anywhere" },
      { property: "og:description", content: "On‑demand local courier service. From $5.99 with live tracking, in‑app chat, and $100 cargo insurance." },
      { property: "og:url", content: "/" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Landing,
});

function Landing() {
  // HARDCODED FALLBACK: If Netlify env var is missing, use a professional city courier video
  const defaultVideo = "https://cdn.pixabay.com/video/2021/04/12/70860-536965158_large.mp4";
  const videoUrl = import.meta.env.VITE_HERO_VIDEO_URL || defaultVideo;

  return (
    <PageShell>
      {/* Fixed video background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <video
          src={videoUrl}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/30 to-background/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/70 via-background/20 to-transparent" />
      </div>

      <section className="relative z-10 min-h-[92vh] flex items-center">
        <div className="container-app py-24 lg:py-32">
          <div className="max-w-2xl text-white">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs uppercase tracking-widest text-gold backdrop-blur-sm font-bold">
              <span className="size-1.5 animate-pulse rounded-full bg-gold" />
              Now live in 50+ cities · 24/7
            </span>
            <h1 className="mt-6 font-serif text-6xl leading-[1.02] sm:text-7xl lg:text-8xl drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)] font-black">
              Need it moved?
              <br />
              <span className="italic text-gold">We're already on it.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] font-bold">
              MyRunner connects you with vetted local Runners who'll pick up and
              deliver almost anything. Starting at <span className="text-gold font-black">$5.99</span>.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-gold text-black hover:bg-gold/90 font-black rounded-full px-10">
                <Link to="/signup">
                  Send a delivery <ArrowRight className="ml-1" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/20 bg-white/5 backdrop-blur-sm text-white font-bold rounded-full px-10">
                <Link to="/drivers">Earn as a Runner</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="relative z-10 bg-background pt-20">
         {/* Features & Steps below */}
         <section className="container-app py-24">
            <h2 className="text-4xl font-serif text-center mb-16">Simple Delivery in 4 Steps</h2>
            <div className="grid gap-6 md:grid-cols-4">
               {steps.map((s, i) => (
                  <div key={i} className="bg-card p-8 rounded-3xl border border-border">
                     <span className="text-6xl font-serif text-gold/20">0{i+1}</span>
                     <h3 className="text-xl font-bold mt-4">{s.title}</h3>
                     <p className="text-muted-foreground mt-2">{s.body}</p>
                  </div>
               ))}
            </div>
         </section>
      </div>
    </PageShell>
  );
}

const steps = [
  { title: "Enter pickup & drop", body: "Two addresses, what to grab, any special instructions." },
  { title: "Pick your delivery type", body: "Standard, multi‑pickup, or multi‑dropoff." },
  { title: "Pay & track live", body: "See the quote, pay securely, watch on a real‑time map." },
  { title: "Photo proof + rate", body: "Confirmation photo at drop‑off. Rate your Runner." },
];
