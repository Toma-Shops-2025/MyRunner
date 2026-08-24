import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useServerFn } from "./useServerFn-DL2oePlL.mjs";
import { B as Button } from "./button-BXrfXN_b.mjs";
import { I as Input } from "./input-DwaGuH4D.mjs";
import { T as Textarea } from "./textarea-BBisE2jS.mjs";
import { O as OrderMap, c as createCheckoutSession, a as createTipCheckoutSession } from "./checkout.functions-BwnvZEMa.mjs";
import { s as supabase } from "./client-CbrcWund.mjs";
import { u as useAuth } from "./use-auth-Bp-NYKWf.mjs";
import { f as fmtUSD } from "./pricing-CPKaFipb.mjs";
import { p as payoutDriverForOrder } from "./connect.functions-Bl8ZlPt-.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { e as Route$4 } from "./router-CcOqsHDG.mjs";
import "../_libs/mapbox-gl.mjs";
import "../_libs/seroval.mjs";
import "../_libs/stripe.mjs";
import { z as ArrowLeft, e as CircleCheck, I as CreditCard, o as Flag, B as Send, v as Star } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "stream";
import "crypto";
import "../_libs/isbot.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "./server-DWRkkZvt.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "./auth-middleware-pF3e_tkz.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "./createMiddleware-BvN2ghIY.mjs";
import "../_libs/zod.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "./stripe.server-h1CGUd7G.mjs";
import "./client.server-D5ro3rAQ.mjs";
import "events";
import "http";
import "https";
import "os";
const STATUS_FLOW = ["pending", "accepted", "picked_up", "in_transit", "delivered"];
function OrderDetail() {
  const {
    id
  } = Route$4.useParams();
  const {
    user,
    isDriver,
    isAdmin
  } = useAuth();
  const [order, setOrder] = reactExports.useState(null);
  const [messages, setMessages] = reactExports.useState([]);
  const [body, setBody] = reactExports.useState("");
  const [myRating, setMyRating] = reactExports.useState(null);
  const [stars, setStars] = reactExports.useState(5);
  const [comment, setComment] = reactExports.useState("");
  const [payBusy, setPayBusy] = reactExports.useState(false);
  const [tipBusy, setTipBusy] = reactExports.useState(false);
  const [customTip, setCustomTip] = reactExports.useState("");
  const scrollRef = reactExports.useRef(null);
  const checkout = useServerFn(createCheckoutSession);
  const tipCheckout = useServerFn(createTipCheckoutSession);
  const runPayout = useServerFn(payoutDriverForOrder);
  async function payNow() {
    setPayBusy(true);
    const res = await checkout({
      data: {
        orderId: id
      }
    });
    setPayBusy(false);
    if ("error" in res && res.error) return toast.error(res.error);
    if ("url" in res && res.url) window.location.href = res.url;
  }
  async function addTip(dollars) {
    const cents = Math.round(dollars * 100);
    if (cents < 100) return toast.error("Minimum tip is $1");
    if (cents > 5e4) return toast.error("Maximum tip is $500");
    setTipBusy(true);
    const res = await tipCheckout({
      data: {
        orderId: id,
        tipCents: cents
      }
    });
    setTipBusy(false);
    if ("error" in res && res.error) return toast.error(res.error);
    if ("url" in res && res.url) window.location.href = res.url;
  }
  reactExports.useEffect(() => {
    let active = true;
    (async () => {
      const {
        data: o
      } = await supabase.from("orders").select("*").eq("id", id).maybeSingle();
      if (active) setOrder(o);
      const {
        data: m
      } = await supabase.from("order_messages").select("*").eq("order_id", id).order("created_at", {
        ascending: true
      });
      if (active) setMessages(m ?? []);
    })();
    const channel = supabase.channel(`order-${id}`).on("postgres_changes", {
      event: "INSERT",
      schema: "public",
      table: "order_messages",
      filter: `order_id=eq.${id}`
    }, (payload) => setMessages((prev) => [...prev, payload.new])).on("postgres_changes", {
      event: "UPDATE",
      schema: "public",
      table: "orders",
      filter: `id=eq.${id}`
    }, (payload) => setOrder(payload.new)).subscribe();
    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, [id]);
  reactExports.useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth"
    });
  }, [messages.length]);
  reactExports.useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    if (sp.get("paid") === "1") {
      toast.success("Payment received — your Runner is on it!");
      window.history.replaceState({}, "", window.location.pathname);
    }
    if (sp.get("cancelled") === "1") {
      toast("Payment cancelled — you can try again anytime.");
      window.history.replaceState({}, "", window.location.pathname);
    }
    if (sp.get("tipped") === "1") {
      toast.success("Tip sent — thanks for taking care of your Runner!");
      window.history.replaceState({}, "", window.location.pathname);
    }
    if (sp.get("tip_cancelled") === "1") {
      toast("Tip cancelled.");
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);
  reactExports.useEffect(() => {
    if (!user) return;
    supabase.from("ratings").select("stars").eq("order_id", id).eq("rater_id", user.id).maybeSingle().then(({
      data
    }) => setMyRating(data?.stars ?? null));
  }, [id, user]);
  async function submitRating() {
    if (!user || !order) return;
    const rateeId = user.id === order.customer_id ? order.driver_id : order.customer_id;
    if (!rateeId) return toast.error("No counterparty to rate");
    const {
      error
    } = await supabase.from("ratings").insert({
      order_id: id,
      rater_id: user.id,
      ratee_id: rateeId,
      stars,
      comment: comment.trim() || null
    });
    if (error) return toast.error(error.message);
    setMyRating(stars);
    toast.success("Thanks for your rating");
  }
  async function sendMessage(e) {
    e.preventDefault();
    if (!body.trim() || !user) return;
    const text = body.trim();
    setBody("");
    const {
      error
    } = await supabase.from("order_messages").insert({
      order_id: id,
      sender_id: user.id,
      body: text
    });
    if (error) toast.error(error.message);
  }
  async function advanceStatus(next) {
    const {
      error
    } = await supabase.from("orders").update({
      status: next
    }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success(`Status: ${next.replace("_", " ")}`);
    if (next === "delivered") {
      const res = await runPayout({
        data: {
          orderId: id
        }
      });
      if ("error" in res && res.error) {
        toast.error(`Payout issue: ${res.error}`);
      } else if ("amount" in res && res.amount) {
        toast.success(`Payout sent: ${fmtUSD(res.amount)}`);
      }
    }
  }
  async function claimOrder() {
    if (!user) return;
    const {
      error
    } = await supabase.from("orders").update({
      driver_id: user.id,
      status: "accepted"
    }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Order claimed");
  }
  async function cancelOrder() {
    if (!confirm("Cancel this order?")) return;
    const {
      error
    } = await supabase.from("orders").update({
      status: "cancelled"
    }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Order cancelled");
  }
  if (!order) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/app/orders", className: "inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "size-4" }),
        " Back to orders"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Loading…" })
    ] });
  }
  const isCustomer = user?.id === order.customer_id;
  const isAssignedDriver = user?.id === order.driver_id;
  const canChat = isCustomer || isAssignedDriver || isAdmin;
  const currentStepIdx = STATUS_FLOW.indexOf(order.status);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/app/orders", className: "inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "size-4" }),
      " Back to orders"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-card p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-start justify-between gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-widest text-gold", children: order.type.replace("_", " ") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-1 font-serif text-3xl", children: order.item_description }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: order.pickup_address }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
            "→ ",
            order.dropoff_address
          ] }),
          order.notes && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-2 text-xs text-muted-foreground italic", children: [
            '"',
            order.notes,
            '"'
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-serif text-4xl text-gold", children: fmtUSD(order.price_cents + order.tip_cents) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-widest text-muted-foreground", children: order.status.replace("_", " ") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `mt-1 text-[10px] uppercase tracking-widest ${order.payment_status === "paid" ? "text-emerald-500" : "text-amber-500"}`, children: order.payment_status === "paid" ? "✓ Paid" : "Unpaid" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(OrderMap, { pickup: order.pickup_address, dropoff: order.dropoff_address }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 flex items-center gap-2", children: STATUS_FLOW.map((s, i) => {
        const done = currentStepIdx >= i && order.status !== "cancelled";
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-1 items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `flex size-7 items-center justify-center rounded-full text-[10px] uppercase tracking-widest ${done ? "bg-gold text-primary-foreground" : "bg-muted text-muted-foreground"}`, children: done ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "size-4" }) : i + 1 }),
          i < STATUS_FLOW.length - 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `h-px flex-1 ${done ? "bg-gold" : "bg-border"}` })
        ] }, s);
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 flex justify-between text-[10px] uppercase tracking-widest text-muted-foreground", children: STATUS_FLOW.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: s.replace("_", " ") }, s)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex flex-wrap gap-2 border-t border-border pt-4", children: [
        isDriver && !order.driver_id && order.status === "pending" && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", className: "bg-gold text-primary-foreground hover:bg-gold/90", onClick: claimOrder, children: "Claim this order" }),
        isAssignedDriver && order.status === "accepted" && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", className: "bg-gold text-primary-foreground hover:bg-gold/90", onClick: () => advanceStatus("picked_up"), children: "Mark picked up" }),
        isAssignedDriver && order.status === "picked_up" && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", className: "bg-gold text-primary-foreground hover:bg-gold/90", onClick: () => advanceStatus("in_transit"), children: "Start delivery" }),
        isAssignedDriver && order.status === "in_transit" && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", className: "bg-gold text-primary-foreground hover:bg-gold/90", onClick: () => advanceStatus("delivered"), children: "Mark delivered" }),
        isCustomer && order.payment_status !== "paid" && order.status !== "cancelled" && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", className: "bg-gold text-primary-foreground hover:bg-gold/90", onClick: payNow, disabled: payBusy, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { className: "mr-2 size-3" }),
          " ",
          payBusy ? "Opening checkout…" : `Pay ${fmtUSD(order.price_cents + order.tip_cents)}`
        ] }),
        isCustomer && ["pending", "accepted"].includes(order.status) && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "outline", onClick: cancelOrder, children: "Cancel order" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "outline", asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/app/report", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Flag, { className: "mr-2 size-3" }),
          " Report an issue"
        ] }) })
      ] }),
      order.proof_photo_url && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 border-t border-border pt-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-serif text-lg", children: "Proof of delivery" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Your Runner left the package and captured this photo." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: order.proof_photo_url, target: "_blank", rel: "noreferrer", className: "mt-3 block overflow-hidden rounded-xl border border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: order.proof_photo_url, alt: "Delivery proof", className: "h-auto w-full object-cover" }) })
      ] })
    ] }),
    canChat && order.driver_id && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-b border-border p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-serif text-xl", children: "In-order chat" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Messages are visible to the customer, the driver, and admin only." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { ref: scrollRef, className: "max-h-80 space-y-2 overflow-y-auto p-4", children: [
        messages.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center text-xs text-muted-foreground", children: "No messages yet — say hi 👋" }),
        messages.map((m) => {
          const mine = m.sender_id === user?.id;
          return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `flex ${mine ? "justify-end" : "justify-start"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `max-w-[75%] rounded-2xl px-4 py-2 text-sm ${mine ? "bg-gold text-primary-foreground" : "bg-muted text-foreground"}`, children: [
            m.body,
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `mt-0.5 text-[10px] ${mine ? "text-primary-foreground/70" : "text-muted-foreground"}`, children: new Date(m.created_at).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit"
            }) })
          ] }) }, m.id);
        })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: sendMessage, className: "flex gap-2 border-t border-border p-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: body, onChange: (e) => setBody(e.target.value), placeholder: "Type a message…" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", size: "sm", className: "bg-gold text-primary-foreground hover:bg-gold/90", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "size-4" }) })
      ] })
    ] }),
    !order.driver_id && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground", children: "Waiting for a Runner to accept this order. Chat opens once a Runner is assigned." }),
    order.status === "delivered" && (isCustomer || isAssignedDriver) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-card p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-serif text-xl", children: isCustomer ? "Rate your Runner" : "Rate the customer" }),
      myRating ? /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-2 text-sm text-muted-foreground", children: [
        "You rated this delivery ",
        myRating,
        " ",
        myRating === 1 ? "star" : "stars",
        ". Thanks for the feedback."
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1", children: [1, 2, 3, 4, 5].map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setStars(n), "aria-label": `${n} stars`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: `size-7 ${n <= stars ? "fill-gold text-gold" : "text-muted-foreground"}` }) }, n)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { value: comment, onChange: (e) => setComment(e.target.value), placeholder: "Optional: leave a short comment", rows: 3 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: submitRating, className: "bg-gold text-primary-foreground hover:bg-gold/90", children: "Submit rating" })
      ] })
    ] }),
    isCustomer && order.status === "delivered" && order.driver_id && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-card p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-serif text-xl", children: "Add a tip for your Runner" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "Loved the service? Send your Runner an extra thank-you — 100% goes to them." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 flex flex-wrap gap-2", children: [2, 5, 10, 20].map((amt) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "outline", disabled: tipBusy, onClick: () => addTip(amt), children: [
        "$",
        amt
      ] }, amt)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", min: 1, max: 500, step: "1", placeholder: "Custom amount ($)", value: customTip, onChange: (e) => setCustomTip(e.target.value), className: "max-w-[200px]" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", disabled: tipBusy || !customTip, className: "bg-gold text-primary-foreground hover:bg-gold/90", onClick: () => addTip(Number(customTip)), children: tipBusy ? "Opening…" : "Send tip" })
      ] })
    ] })
  ] });
}
export {
  OrderDetail as component
};
