import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Copy, Download, Share2, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import qrAsset from "@/assets/myrunner-qr.png.asset.json";

export const Route = createFileRoute("/share")({
  head: () => ({
    meta: [
      { title: "Share MyRunner — Refer friends & earn" },
      { name: "description", content: "Share MyRunner with friends, neighbors, and local shops. Scan or share the link." },
    ],
  }),
  component: Share,
});

const SHARE_URL = "https://myrunner.shop";
const SHARE_TEXT = "Need anything delivered? MyRunner — Anything. Anytime. Anywhere.";

function Share() {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    await navigator.clipboard.writeText(SHARE_URL);
    setCopied(true);
    toast.success("Link copied");
    setTimeout(() => setCopied(false), 2000);
  }

  async function nativeShare() {
    if (navigator.share) {
      try {
        await navigator.share({ title: "MyRunner", text: SHARE_TEXT, url: SHARE_URL });
      } catch { /* user cancelled */ }
    } else {
      copyLink();
    }
  }

  function downloadQR() {
    const a = document.createElement("a");
    a.href = qrAsset.url;
    a.download = "myrunner-qr.png";
    a.click();
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="font-serif text-4xl">Share MyRunner</h1>
        <p className="mt-2 text-muted-foreground">
          Help friends, neighbors, and local shops discover on‑demand delivery.
          Show the QR, share the link, or post it anywhere.
        </p>
      </div>

      <div className="overflow-hidden rounded-3xl border border-border bg-card">
        <div className="flex items-center justify-center bg-gradient-to-br from-gold-soft to-card p-8">
          <div className="rounded-2xl bg-white p-5 shadow-xl">
            <img
              src={qrAsset.url}
              alt="QR code to myrunner.shop"
              className="size-64 rounded-lg"
            />
          </div>
        </div>
        <div className="space-y-4 p-6">
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Your link</p>
            <p className="mt-1 break-all font-serif text-xl text-gold">{SHARE_URL}</p>
          </div>
          <div className="grid gap-2 sm:grid-cols-3">
            <Button onClick={copyLink} variant="outline">
              {copied ? <Check className="mr-2 size-4" /> : <Copy className="mr-2 size-4" />}
              {copied ? "Copied" : "Copy link"}
            </Button>
            <Button onClick={nativeShare} variant="outline">
              <Share2 className="mr-2 size-4" /> Share
            </Button>
            <Button onClick={downloadQR} className="bg-gold text-primary-foreground hover:bg-gold/90">
              <Download className="mr-2 size-4" /> Download QR
            </Button>
          </div>
        </div>
      </div>

      <section className="rounded-2xl border border-border bg-card p-6">
        <h2 className="font-serif text-2xl">Where to share</h2>
        <ul className="mt-3 space-y-2 text-sm text-foreground/80">
          <li>· Print the QR on flyers, business cards, or vehicle decals</li>
          <li>· Post it on Instagram, TikTok, or Facebook with a short caption</li>
          <li>· Hand cards to neighbors, gyms, coffee shops, and apartment lobbies</li>
          <li>· Add it as the end card of any video you publish (5+ seconds, on white)</li>
        </ul>
      </section>
    </div>
  );
}
