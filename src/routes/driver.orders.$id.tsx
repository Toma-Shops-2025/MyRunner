import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Send, MapPin, Camera, CheckCircle2, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { fmtUSD } from "@/lib/pricing";
import { payoutDriverForOrder } from "@/lib/connect.functions";
import { advanceDriverOrder } from "@/lib/dispatch.functions";
import { sendOrderMessage } from "@/lib/order.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/driver/orders/$id")({
  head: () => ({ meta: [{ title: "Delivery — MyRunner Driver" }, { name: "robots", content: "noindex" }] }),
  component: DriverOrder,
});

type Order = {
  id: string;
  customer_id: string;
  driver_id: string | null;
  pickup_address: string;
  dropoff_address: string;
  item_description: string;
  notes: string | null;
  type: string;
  status: string;
  price_cents: number;
  tip_cents: number;
  distance_miles: number | null;
  proof_photo_url: string | null;
};

type Message = { id: string; sender_id: string; body: string; created_at: string };

const STEPS = ["accepted", "picked_up", "in_transit", "delivered"] as const;

function DriverOrder() {
  const { id } = Route.useParams();
  const { user } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const runPayout = useServerFn(payoutDriverForOrder);
  const advanceFn = useServerFn(advanceDriverOrder);
  const sendMsg = useServerFn(sendOrderMessage);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data: o } = await supabase.from("orders").select("*").eq("id", id).maybeSingle();
      if (active) setOrder(o as Order | null);
      const { data: m } = await supabase.from("order_messages").select("*").eq("order_id", id).order("created_at");
      if (active) setMessages((m ?? []) as Message[]);
    })();
    const ch = supabase
      .channel(`drv-order-${id}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "order_messages", filter: `order_id=eq.${id}` },
        (p) => setMessages((prev) => [...prev, p.new as Message]))
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "orders", filter: `id=eq.${id}` },
        (p) => setOrder(p.new as Order))
      .subscribe();
    return () => { active = false; supabase.removeChannel(ch); };
  }, [id]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length]);

  async function advance(next: string, extra: Partial<Order> = {}) {
    setBusy(true);
    try {
      await advanceFn({
        data: {
          orderId: id,
          status: next as "accepted" | "picked_up" | "in_transit" | "delivered",
          proofPhotoUrl: extra.proof_photo_url ?? undefined,
          deliveredAt: (extra as { delivered_at?: string }).delivered_at ?? undefined,
        },
      });
      toast.success(`Marked ${next.replace("_", " ")}`);
      const { data } = await supabase.from("orders").select("*").eq("id", id).maybeSingle();
      if (data) setOrder(data as Order);
      if (next === "delivered") {
        const res = await runPayout({ data: { orderId: id } });
        if ("error" in res && res.error) {
          toast.error(`Payout: ${String(res.error)}`);
        } else if ("amount" in res && res.amount) {
          toast.success(`Payout sent: ${fmtUSD(res.amount)}`);
        } else if ("alreadyPaid" in res && res.alreadyPaid) {
          toast.success("Payout already routed to your account.");
        }
      }
    } catch (e) {
      toast.error((e as Error).message || "Could not update order.");
    } finally {
      setBusy(false);
    }
  }

  async function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f || !user) return;
    setBusy(true);
    const path = `${id}/${Date.now()}-${f.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;
    const { error: upErr } = await supabase.storage.from("delivery-proofs").upload(path, f, { upsert: false });
    if (upErr) { setBusy(false); return toast.error(upErr.message); }
    const { data: signed } = await supabase.storage.from("delivery-proofs").createSignedUrl(path, 60 * 60 * 24 * 365);
    await advance("delivered", { proof_photo_url: signed?.signedUrl ?? path, delivered_at: new Date().toISOString() } as Partial<Order>);
  }

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim() || !user) return;
    const text = body.trim();
    setBody("");
    const res = await sendMsg({ data: { orderId: id, body: text } });
    if ("error" in res && res.error) toast.error(res.error);
  }

  if (!order) return <p className="text-muted-foreground">Loading…</p>;

  const stepIdx = STEPS.indexOf(order.status as (typeof STEPS)[number]);
  const isMine = String(order.driver_id ?? "") === String(user?.id ?? "");
  const canActOnPickup = isMine && (order.status === "accepted" || order.status === "pending");

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-gold">{order.type.replace("_", " ")}</p>
            <h1 className="mt-1 font-serif text-3xl">{order.item_description}</h1>
            <p className="mt-3 text-sm"><span className="text-muted-foreground">Pickup:</span> {order.pickup_address}</p>
            <p className="text-sm"><span className="text-muted-foreground">Drop:</span> {order.dropoff_address}</p>
            {order.notes && <p className="mt-2 text-xs italic text-muted-foreground">"{order.notes}"</p>}
          </div>
          <div className="text-right">
            <p className="font-serif text-4xl text-gold">{fmtUSD(order.price_cents + order.tip_cents)}</p>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">{order.status.replace("_", " ")}</p>
          </div>
        </div>

        {/* Progress */}
        <div className="mt-6 flex items-center gap-2">
          {STEPS.map((s, i) => {
            const done = stepIdx >= i;
            return (
              <div key={s} className="flex flex-1 items-center gap-2">
                <div className={`flex size-7 items-center justify-center rounded-full text-[10px] uppercase ${done ? "bg-gold text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                  {done ? <CheckCircle2 className="size-4" /> : i + 1}
                </div>
                {i < STEPS.length - 1 && <div className={`h-px flex-1 ${done ? "bg-gold" : "bg-border"}`} />}
              </div>
            );
          })}
        </div>
        <div className="mt-2 flex justify-between text-[10px] uppercase tracking-widest text-muted-foreground">
          {STEPS.map((s) => <span key={s}>{s.replace("_", " ")}</span>)}
        </div>

        {/* Driver action bar — status-aware */}
        {isMine && (
          <div className="mt-6 space-y-3 border-t border-border pt-4">
            {canActOnPickup && (
              <div className="flex flex-wrap gap-2">
                <Button asChild className="bg-gold text-primary-foreground hover:bg-gold/90">
                  <a target="_blank" rel="noreferrer" href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(order.pickup_address)}`}>
                    <MapPin className="mr-1 size-4" /> Navigate to pickup
                  </a>
                </Button>
                <Button variant="outline" onClick={() => advance("picked_up")} disabled={busy}>
                  <Package className="mr-1 size-4" /> Mark picked up
                </Button>
              </div>
            )}
            {(order.status === "picked_up" || order.status === "in_transit") && (
              <>
                <div className="flex flex-wrap gap-2">
                  <Button asChild className="bg-gold text-primary-foreground hover:bg-gold/90">
                    <a target="_blank" rel="noreferrer" href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(order.dropoff_address)}`}>
                      <MapPin className="mr-1 size-4" /> Navigate to drop-off
                    </a>
                  </Button>
                  {order.status === "picked_up" && (
                    <Button variant="outline" onClick={() => advance("in_transit")} disabled={busy}>
                      Start delivery
                    </Button>
                  )}
                </div>
                <div className="rounded-xl border border-border bg-muted/30 p-4">
                  <p className="text-sm font-medium">At the drop-off?</p>
                  <p className="text-xs text-muted-foreground">If the customer is there and you hand it off, tap <span className="font-medium">Delivered</span>. If no one's there, take a photo as proof and the order will be marked delivered.</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button className="bg-gold text-primary-foreground hover:bg-gold/90" onClick={() => advance("delivered", { delivered_at: new Date().toISOString() } as Partial<Order>)} disabled={busy}>
                      <CheckCircle2 className="mr-1 size-4" /> Delivered (handed off)
                    </Button>
                    <Button variant="outline" onClick={() => fileRef.current?.click()} disabled={busy}>
                      <Camera className="mr-1 size-4" /> No one here — take photo
                    </Button>
                    <input ref={fileRef} type="file" accept="image/*" capture="environment" hidden onChange={handlePhoto} />
                  </div>
                </div>
              </>
            )}
            {order.status === "delivered" && (
              <p className="text-sm text-emerald-500">Delivered ✓ {order.proof_photo_url ? "(photo proof captured)" : ""}</p>
            )}
          </div>
        )}

        {!isMine && (
          <div className="mt-6 rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-sm">
            <p className="font-medium text-amber-200">This order isn&apos;t assigned to you yet.</p>
            <p className="mt-1 text-muted-foreground">Go back to the dashboard and tap Accept again after the next update deploys.</p>
            <Button asChild variant="outline" size="sm" className="mt-3">
              <Link to="/driver/dashboard">Back to dashboard</Link>
            </Button>
          </div>
        )}
      </div>

      {/* Chat with customer */}
      {isMine && (
        <div className="rounded-2xl border border-border bg-card">
          <div className="border-b border-border p-4">
            <h2 className="font-serif text-xl">Chat with customer</h2>
            <p className="text-xs text-muted-foreground">Messages are visible to you, the customer who placed the order, and admin.</p>
          </div>
          <div ref={scrollRef} className="max-h-80 space-y-2 overflow-y-auto p-4">
            {messages.length === 0 && <p className="text-center text-xs text-muted-foreground">No messages yet.</p>}
            {messages.map((m) => {
              const mine = m.sender_id === user?.id;
              return (
                <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${mine ? "bg-gold text-primary-foreground" : "bg-muted text-foreground"}`}>
                    {m.body}
                    <p className={`mt-0.5 text-[10px] ${mine ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                      {new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
          <form onSubmit={sendMessage} className="flex gap-2 border-t border-border p-3">
            <Input value={body} onChange={(e) => setBody(e.target.value)} placeholder="Type a message…" />
            <Button type="submit" size="sm" className="bg-gold text-primary-foreground hover:bg-gold/90">
              <Send className="size-4" />
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}
