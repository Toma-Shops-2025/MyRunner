import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Package, Clock, MapPin, Shield, Star, Zap, Smartphone, Users, CheckCircle2 } from "lucide-react";
import { PageShell } from "@/components/site/page-shell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MyRunner — On‑demand local delivery for anything, anywhere" },
      { name: "description", content: "MyRunner connects you with vetted local Runners to pick up and deliver anything, anytime." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <PageShell>
      {/* CINEMATIC ANIMATED BACKGROUND - REPLACES BROKEN VIDEO */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-black">
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_50%_50%,_rgba(245,197,66,0.15)_0%,_transparent_50%)]" />
        <div className="absolute inset-0 opacity-20 bg-[conic-gradient(from_0deg_at_50%_50%,_#f5c542_0deg,_transparent_60deg)] animate-[spin_20s_linear_infinite]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
      </div>

      <div className="relative z-10">
        {/* HERO SECTION */}
        <section className="min-h-screen flex items-center pt-20">
          <div className="container-app py-24 lg:py-32">
            <div className="max-w-2xl text-white">
              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs uppercase tracking-widest text-gold backdrop-blur-sm font-bold shadow-glow">
                <span className="size-1.5 animate-pulse rounded-full bg-gold" />
                Now live in 50+ cities · 24/7
              </span>
              <h1 className="mt-6 font-serif text-6xl leading-[1.02] sm:text-7xl lg:text-8xl drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)] font-black">
                Need it moved?
                <br />
                <span className="italic text-gold italic">We're already on it.</span>
              </h1>
              <p className="mt-8 max-w-xl text-lg text-white/90 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] font-bold">
                MyRunner connects you with vetted local Runners who'll pick up and
                deliver almost anything. Starting at <span className="text-gold font-black underline decoration-gold/50">$5.99</span>.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Button asChild size="lg" className="bg-gold text-black hover:bg-gold/90 font-black rounded-full px-12 h-16 text-lg shadow-glow">
                  <Link to="/signup">
                    Send a delivery <ArrowRight className="ml-2" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white/20 bg-white/5 backdrop-blur-sm text-white font-bold rounded-full px-12 h-16">
                  <Link to="/drivers">Earn as a Runner</Link>
                </Button>
              </div>
              <div className="mt-16 flex items-center gap-8 text-xs text-white/60 font-black uppercase tracking-widest">
                <Stat label="Avg pickup" value="< 12 min" />
                <Stat label="Cargo insured" value="$100" />
                <Stat label="Rating" value="4.9 ★" />
              </div>
            </div>
          </div>
        </section>

        {/* CONTENT AREA - RESTORED FULL LENGTH */}
        <div className="bg-[#050505] border-t border-white/5 pt-32 pb-32">
          <div className="container-app">

            {/* TRUST MARQUEE */}
            <div className="grid grid-cols-2 gap-8 text-center text-[10px] font-black uppercase tracking-[0.3em] text-white/30 sm:grid-cols-4 mb-32 bg-white/2 p-10 rounded-[40px] border border-white/5">
                <div className="flex flex-col items-center gap-3"><Shield className="size-6 text-gold" /> Vetted Drivers</div>
                <div className="flex flex-col items-center gap-3"><MapPin className="size-6 text-gold" /> Live GPS</div>
                <div className="flex flex-col items-center gap-3"><CheckCircle2 className="size-6 text-gold" /> Photo Proof</div>
                <div className="flex flex-col items-center gap-3"><Zap className="size-6 text-gold" /> Secure Pay</div>
            </div>

            {/* HOW IT WORKS */}
            <div className="mb-48 text-center lg:text-left">
                <p className="text-xs font-black uppercase tracking-[0.4em] text-gold mb-4">The Process</p>
                <h2 className="text-5xl lg:text-7xl font-serif text-white mb-20 leading-tight">Doorstep to doorstep,<br/>in four simple steps.</h2>
                <div className="grid gap-12 md:grid-cols-4">
                   {steps.map((s, i) => (
                      <div key={i} className="bg-[#111] p-10 rounded-[40px] border border-white/5 relative overflow-hidden group hover:border-gold/30 transition-all text-left">
                         <span className="text-7xl font-serif text-gold/10 absolute -top-2 -left-2">0{i+1}</span>
                         <h3 className="text-2xl font-bold mt-12 text-white relative z-10">{s.title}</h3>
                         <p className="text-white/40 mt-4 leading-relaxed font-bold uppercase text-xs relative z-10">{s.body}</p>
                      </div>
                   ))}
                </div>
            </div>

            {/* PRICING BLOCK */}
            <div className="rounded-[50px] bg-gradient-to-br from-[#1a1a1a] to-black p-12 lg:p-24 border border-gold/20 shadow-2xl mb-48">
                <div className="grid lg:grid-cols-2 gap-20 items-center">
                    <div>
                        <p className="text-xs font-black uppercase tracking-[0.4em] text-gold mb-6">Transparency</p>
                        <h2 className="text-6xl font-serif text-white leading-tight mb-8">$5.99 to start.<br/><span className="text-white/30 italic">No surprises.</span></h2>
                        <p className="text-white/50 text-lg mb-10 leading-relaxed font-medium">You see the full price before you pay. $1.50 per mile, $3 per extra stop. 100% of tips go to your Runner.</p>
                        <Button asChild size="lg" className="bg-gold text-black font-black px-12 py-8 rounded-full text-lg shadow-glow">
                          <Link to="/pricing">See Pricing Guide</Link>
                        </Button>
                    </div>
                    <div className="space-y-4">
                       {["Base fee: $5.99", "Mileage: $1.50/mi", "Extra Stops: $3.00", "Cargo Insurance: Free", "100% Tips to Runner"].map(line => (
                          <div key={line} className="bg-white/2 border border-white/5 p-6 rounded-2xl flex items-center gap-4 text-white/80 font-black uppercase text-[10px] tracking-widest">
                             <CheckCircle2 className="size-5 text-green-500" /> {line}
                          </div>
                       ))}
                    </div>
                </div>
            </div>

          </div>
        </div>

        {/* FOOTER FIX - HIGH CONTRAST */}
        <footer className="bg-black border-t border-white/10 pt-32 pb-20 text-center">
           <div className="container-app">
              <h2 className="text-gold font-serif text-4xl mb-6 italic tracking-tighter">MyRunner</h2>
              <div className="flex justify-center gap-10 text-[9px] font-black uppercase tracking-[0.3em] text-white/40 mb-12">
                 <Link to="/pricing">Pricing</Link>
                 <Link to="/safety">Safety</Link>
                 <Link to="/privacy">Privacy</Link>
              </div>
              <p className="text-white/10 text-[8px] font-black uppercase tracking-[0.8em]">Toma Shops Ecosystem · 2025</p>
           </div>
        </footer>
      </div>
    </PageShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-left">
      <p className="font-serif text-3xl text-white mb-1">{value}</p>
      <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gold/60">{label}</p>
    </div>
  );
}

const steps = [
  { title: "Pickup & Drop", body: "Enter addresses and what we are moving." },
  { title: "Pick Service", body: "Standard or multi-stop delivery routes." },
  { title: "Secure Pay", body: "Stripe-secured payments with full insurance." },
  { title: "Track Live", body: "Watch your runner deliver on a live map." },
];
