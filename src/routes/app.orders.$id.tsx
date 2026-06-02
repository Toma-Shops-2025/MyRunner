import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { ArrowLeft, Send, Flag, CheckCircle2, Star, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { OrderMap } from "@/components/site/order-map";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { fmtUSD } from "@/lib/pricing";
import { createCheckoutSession } from "@/lib/checkout.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/app/orders/$id")({
  head: () => ({ meta: [{ title: "Order details — MyRunner" }, { name: "robots", content: "noindex" }] }),
  component: OrderDetail,
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
  payment_status: string;
  created_at: string;
};

type Message = {
  id: string;
  sender_id: string;
  body: string;
  created_at: string;
};

const STATUS_FLOW = ["pending", "accepted", "picked_up", "in_transit", "delivered"] as const;

function OrderDetail() {
  const { id } = Route.useParams();
  const { user, isDriver, isAdmin } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [body, setBody] = useState("");
  const [myRating, setMyRating] = useState<number | null>(null);
  const [stars, setStars] = useState(5);
  const [comment, setComment] = useState("");
  const [payBusy, setPayBusy] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const checkout = useServerFn(createCheckoutSession);

  async function payNow() {
    setPayBusy(true);
    const res = await checkout({ data: { orderId: id } });
    setPayBusy(false);
    if ("error" in res && res.error) return toast.error(res.error);
    if ("url" in res && res.url) window.location.href = res.url;
  }


  // Load order + messages, subscribe to realtime
  useEffect(() => {
    let active = true;
    (async () => {
      const { data: o } = await supabase.from("orders").select("*").eq("id", id).maybeSingle();
      if (active) setOrder(o as Order | null);
      const { data: m } = await supabase
        .from("order_messages")
        .select("*")
        .eq("order_id", id)
        .order("created_at", { ascending: true });
      if (active) setMessages((m ?? []) as Message[]);
    })();

    const channel = supabase
      .channel(`order-${id}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "order_messages", filter: `order_id=eq.${id}` },
        (payload) => setMessages((prev) => [...prev, payload.new as Message]),
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "orders", filter: `id=eq.${id}` },
        (payload) => setOrder(payload.new as Order),
      )
      .subscribe();

    return () => { active = false; supabase.removeChannel(channel); };
  }, [id]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length]);

  // Load existing rating I left on this order
  useEffect(() => {
    if (!user) return;
    supabase.from("ratings").select("stars").eq("order_id", id).eq("rater_id", user.id).maybeSingle()
      .then(({ data }) => setMyRating((data as { stars: number } | null)?.stars ?? null));
  }, [id, user]);

  async function submitRating() {
    if (!user || !order) return;
    const rateeId = user.id === order.customer_id ? order.driver_id : order.customer_id;
    if (!rateeId) return toast.error("No counterparty to rate");
    const { error } = await supabase.from("ratings").insert({
      order_id: id, rater_id: user.id, ratee_id: rateeId, stars, comment: comment.trim() || null,
    });
    if (error) return toast.error(error.message);
    setMyRating(stars);
    toast.success("Thanks for your rating");
  }


  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim() || !user) return;
    const text = body.trim();
    setBody("");
    const { error } = await supabase
      .from("order_messages")
      .insert({ order_id: id, sender_id: user.id, body: text });
    if (error) toast.error(error.message);
  }

  async function advanceStatus(next: string) {
    const { error } = await supabase.from("orders").update({ status: next } as never).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success(`Status: ${next.replace("_", " ")}`);
  }

  async function claimOrder() {
    if (!user) return;
    const { error } = await supabase
      .from("orders")
      .update({ driver_id: user.id, status: "accepted" })
      .eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Order claimed");
  }

  async function cancelOrder() {
    if (!confirm("Cancel this order?")) return;
    const { error } = await supabase.from("orders").update({ status: "cancelled" }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Order cancelled");
  }

  if (!order) {
    return (
      <div className="space-y-4">
        <Link to="/app/orders" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" /> Back to orders
        </Link>
        <p className="text-muted-foreground">Loading…</p>
      </div>
    );
  }

  const isCustomer = user?.id === order.customer_id;
  const isAssignedDriver = user?.id === order.driver_id;
  const canChat = isCustomer || isAssignedDriver || isAdmin;
  const currentStepIdx = STATUS_FLOW.indexOf(order.status as (typeof STATUS_FLOW)[number]);

  return (
    <div className="space-y-6">
      <Link to="/app/orders" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Back to orders
      </Link>

      {/* Summary */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-gold">{order.type.replace("_", " ")}</p>
            <h1 className="mt-1 font-serif text-3xl">{order.item_description}</h1>
            <p className="mt-2 text-sm text-muted-foreground">{order.pickup_address}</p>
            <p className="text-sm text-muted-foreground">→ {order.dropoff_address}</p>
            {order.notes && <p className="mt-2 text-xs text-muted-foreground italic">"{order.notes}"</p>}
          </div>
          <div className="text-right">
            <p className="font-serif text-4xl text-gold">{fmtUSD(order.price_cents + order.tip_cents)}</p>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">{order.status.replace("_", " ")}</p>
            <p className={`mt-1 text-[10px] uppercase tracking-widest ${order.payment_status === "paid" ? "text-emerald-500" : "text-amber-500"}`}>
              {order.payment_status === "paid" ? "✓ Paid" : "Unpaid"}
            </p>
          </div>
        </div>

        {/* Map */}
        <div className="mt-6">
          <OrderMap pickup={order.pickup_address} dropoff={order.dropoff_address} />
        </div>

        {/* Status timeline */}
        <div className="mt-6 flex items-center gap-2">
          {STATUS_FLOW.map((s, i) => {
            const done = currentStepIdx >= i && order.status !== "cancelled";
            return (
              <div key={s} className="flex flex-1 items-center gap-2">
                <div
                  className={`flex size-7 items-center justify-center rounded-full text-[10px] uppercase tracking-widest ${
                    done ? "bg-gold text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {done ? <CheckCircle2 className="size-4" /> : i + 1}
                </div>
                {i < STATUS_FLOW.length - 1 && (
                  <div className={`h-px flex-1 ${done ? "bg-gold" : "bg-border"}`} />
                )}
              </div>
            );
          })}
        </div>
        <div className="mt-2 flex justify-between text-[10px] uppercase tracking-widest text-muted-foreground">
          {STATUS_FLOW.map((s) => <span key={s}>{s.replace("_", " ")}</span>)}
        </div>

        {/* Action bar */}
        <div className="mt-6 flex flex-wrap gap-2 border-t border-border pt-4">
          {/* Driver actions */}
          {isDriver && !order.driver_id && order.status === "pending" && (
            <Button size="sm" className="bg-gold text-primary-foreground hover:bg-gold/90" onClick={claimOrder}>
              Claim this order
            </Button>
          )}
          {isAssignedDriver && order.status === "accepted" && (
            <Button size="sm" className="bg-gold text-primary-foreground hover:bg-gold/90" onClick={() => advanceStatus("picked_up")}>
              Mark picked up
            </Button>
          )}
          {isAssignedDriver && order.status === "picked_up" && (
            <Button size="sm" className="bg-gold text-primary-foreground hover:bg-gold/90" onClick={() => advanceStatus("in_transit")}>
              Start delivery
            </Button>
          )}
          {isAssignedDriver && order.status === "in_transit" && (
            <Button size="sm" className="bg-gold text-primary-foreground hover:bg-gold/90" onClick={() => advanceStatus("delivered")}>
              Mark delivered
            </Button>
          )}

          {/* Customer actions */}
          {isCustomer && order.payment_status !== "paid" && order.status !== "cancelled" && (
            <Button size="sm" className="bg-gold text-primary-foreground hover:bg-gold/90" onClick={payNow} disabled={payBusy}>
              <CreditCard className="mr-2 size-3" /> {payBusy ? "Opening checkout…" : `Pay ${fmtUSD(order.price_cents + order.tip_cents)}`}
            </Button>
          )}
          {isCustomer && ["pending", "accepted"].includes(order.status) && (
            <Button size="sm" variant="outline" onClick={cancelOrder}>Cancel order</Button>
          )}

          <Button size="sm" variant="outline" asChild>
            <Link to="/app/report"><Flag className="mr-2 size-3" /> Report an issue</Link>
          </Button>
        </div>
      </div>

      {/* Chat */}
      {canChat && order.driver_id && (
        <div className="rounded-2xl border border-border bg-card">
          <div className="border-b border-border p-4">
            <h2 className="font-serif text-xl">In-order chat</h2>
            <p className="text-xs text-muted-foreground">Messages are visible to the customer, the driver, and admin only.</p>
          </div>
          <div ref={scrollRef} className="max-h-80 space-y-2 overflow-y-auto p-4">
            {messages.length === 0 && <p className="text-center text-xs text-muted-foreground">No messages yet — say hi 👋</p>}
            {messages.map((m) => {
              const mine = m.sender_id === user?.id;
              return (
                <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${
                    mine ? "bg-gold text-primary-foreground" : "bg-muted text-foreground"
                  }`}>
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

      {!order.driver_id && (
        <div className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
          Waiting for a Runner to accept this order. Chat opens once a Runner is assigned.
        </div>
      )}

      {/* Rating */}
      {order.status === "delivered" && (isCustomer || isAssignedDriver) && (
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="font-serif text-xl">{isCustomer ? "Rate your Runner" : "Rate the customer"}</h2>
          {myRating ? (
            <p className="mt-2 text-sm text-muted-foreground">
              You rated this delivery {myRating} {myRating === 1 ? "star" : "stars"}. Thanks for the feedback.
            </p>
          ) : (
            <div className="mt-3 space-y-3">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button key={n} type="button" onClick={() => setStars(n)} aria-label={`${n} stars`}>
                    <Star className={`size-7 ${n <= stars ? "fill-gold text-gold" : "text-muted-foreground"}`} />
                  </button>
                ))}
              </div>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Optional: leave a short comment"
                rows={3}
              />
              <Button onClick={submitRating} className="bg-gold text-primary-foreground hover:bg-gold/90">
                Submit rating
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
