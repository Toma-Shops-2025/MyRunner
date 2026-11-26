import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useServerFn } from "./useServerFn-DL2oePlL.mjs";
import { d as Route$5, B as Button } from "./router-CaL1rPwL.mjs";
import { I as Input } from "./input-DuM_isbv.mjs";
import { s as supabase } from "./client-DfLBq1uk.mjs";
import { u as useAuth } from "./use-auth-B85-Dc53.mjs";
import { f as fmtUSD } from "./pricing-Ci0mfZy0.mjs";
import { p as payoutDriverForOrder } from "./connect.functions-5BWjSdTS.mjs";
import { advanceDriverOrder } from "./dispatch.functions-CDAFMReD.mjs";
import { s as sendOrderMessage } from "./order.functions-BdPJdSi5.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { R as RouteAddressList } from "./route-address-list-o7LWFg7y.mjs";
import { m as mapsDirectionsUrl, o as orderedAddresses, p as parseRouteStops } from "./route-stops-DHGcaVTx.mjs";
import "../_libs/seroval.mjs";
import "../_libs/stripe.mjs";
import { i as CircleCheck, f as MapPin, x as Package, g as Camera, S as Send } from "../_libs/lucide-react.mjs";
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
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "./createSsrRpc-xYjLf7RI.mjs";
import "./server-pkl-8gUD.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "./signup-intent-DuoHB-mj.mjs";
import "./support-knowledge-BldCmBQ4.mjs";
import "./stripe-payout.server-BMP7bU7B.mjs";
import "./client.server-D5ro3rAQ.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/zod.mjs";
import "events";
import "http";
import "https";
import "os";
import "./auth-middleware-CMwi6y2l.mjs";
const STEPS = ["accepted", "picked_up", "in_transit", "delivered"];
function DriverOrder() {
  const {
    id
  } = Route$5.useParams();
  const {
    user
  } = useAuth();
  const [order, setOrder] = reactExports.useState(null);
  const [messages, setMessages] = reactExports.useState([]);
  const [body, setBody] = reactExports.useState("");
  const [busy, setBusy] = reactExports.useState(false);
  const scrollRef = reactExports.useRef(null);
  const fileRef = reactExports.useRef(null);
  const runPayout = useServerFn(payoutDriverForOrder);
  const advanceFn = useServerFn(advanceDriverOrder);
  const sendMsg = useServerFn(sendOrderMessage);
  reactExports.useEffect(() => {
    let active = true;
    (async () => {
      const {
        data: o
      } = await supabase.from("orders").select("*").eq("id", id).maybeSingle();
      if (active) setOrder(o);
      const {
        data: m
      } = await supabase.from("order_messages").select("*").eq("order_id", id).order("created_at");
      if (active) setMessages(m ?? []);
    })();
    const ch = supabase.channel(`drv-order-${id}`).on("postgres_changes", {
      event: "INSERT",
      schema: "public",
      table: "order_messages",
      filter: `order_id=eq.${id}`
    }, (p) => setMessages((prev) => [...prev, p.new])).on("postgres_changes", {
      event: "UPDATE",
      schema: "public",
      table: "orders",
      filter: `id=eq.${id}`
    }, (p) => setOrder(p.new)).subscribe();
    return () => {
      active = false;
      supabase.removeChannel(ch);
    };
  }, [id]);
  reactExports.useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth"
    });
  }, [messages.length]);
  async function advance(next, extra = {}) {
    setBusy(true);
    try {
      await advanceFn({
        data: {
          orderId: id,
          status: next,
          proofPhotoUrl: extra.proof_photo_url ?? void 0,
          deliveredAt: extra.delivered_at ?? void 0
        }
      });
      toast.success(`Marked ${next.replace("_", " ")}`);
      const {
        data
      } = await supabase.from("orders").select("*").eq("id", id).maybeSingle();
      if (data) setOrder(data);
      if (next === "delivered") {
        const res = await runPayout({
          data: {
            orderId: id
          }
        });
        if ("error" in res && res.error) {
          toast.error(`Payout: ${String(res.error)}`);
        } else if ("amount" in res && res.amount) {
          toast.success(`Payout sent: ${fmtUSD(res.amount)}`);
        } else if ("alreadyPaid" in res && res.alreadyPaid) {
          toast.success("Payout already routed to your account.");
        }
      }
      return true;
    } catch (e) {
      toast.error(e.message || "Could not update order.");
      return false;
    } finally {
      setBusy(false);
    }
  }
  async function handlePhoto(e) {
    const f = e.target.files?.[0];
    if (!f || !user) return;
    setBusy(true);
    const path = `${id}/${Date.now()}-${f.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;
    const {
      error: upErr
    } = await supabase.storage.from("delivery-proofs").upload(path, f, {
      upsert: false
    });
    if (upErr) {
      setBusy(false);
      return toast.error(upErr.message);
    }
    const {
      data: signed
    } = await supabase.storage.from("delivery-proofs").createSignedUrl(path, 60 * 60 * 24 * 365);
    await advance("delivered", {
      proof_photo_url: signed?.signedUrl ?? path,
      delivered_at: (/* @__PURE__ */ new Date()).toISOString()
    });
  }
  async function sendMessage(e) {
    e.preventDefault();
    if (!body.trim() || !user) return;
    const text = body.trim();
    setBody("");
    const res = await sendMsg({
      data: {
        orderId: id,
        body: text
      }
    });
    if ("error" in res && res.error) toast.error(res.error);
  }
  async function navigateToDropoff() {
    if (!order) return;
    if (order.status === "picked_up") {
      const ok = await advance("in_transit");
      if (!ok) return;
    }
    const {
      dropoffs
    } = orderedAddresses(order.pickup_address, order.dropoff_address, parseRouteStops(order.route_stops));
    window.open(mapsDirectionsUrl(dropoffs), "_blank", "noopener,noreferrer");
  }
  if (!order) return /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Loading…" });
  const stepIdx = STEPS.indexOf(order.status);
  const isMine = String(order.driver_id ?? "") === String(user?.id ?? "");
  const canActOnPickup = isMine && (order.status === "accepted" || order.status === "pending");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-card p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-start justify-between gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-widest text-gold", children: order.type.replace("_", " ") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-1 font-serif text-3xl", children: order.item_description }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(RouteAddressList, { pickup: order.pickup_address, dropoff: order.dropoff_address, stops: order.route_stops }),
          order.notes && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-2 text-xs italic text-muted-foreground", children: [
            '"',
            order.notes,
            '"'
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-serif text-4xl text-gold", children: fmtUSD(order.price_cents + order.tip_cents) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-widest text-muted-foreground", children: order.status.replace("_", " ") })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 flex items-center gap-2", children: STEPS.map((s, i) => {
        const done = stepIdx >= i;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-1 items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `flex size-7 items-center justify-center rounded-full text-[10px] uppercase ${done ? "bg-gold text-primary-foreground" : "bg-muted text-muted-foreground"}`, children: done ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "size-4" }) : i + 1 }),
          i < STEPS.length - 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `h-px flex-1 ${done ? "bg-gold" : "bg-border"}` })
        ] }, s);
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 flex justify-between text-[10px] uppercase tracking-widest text-muted-foreground", children: STEPS.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: s.replace("_", " ") }, s)) }),
      isMine && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 space-y-3 border-t border-border pt-4", children: [
        canActOnPickup && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, className: "bg-gold text-primary-foreground hover:bg-gold/90", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { target: "_blank", rel: "noreferrer", href: mapsDirectionsUrl(orderedAddresses(order.pickup_address, order.dropoff_address, parseRouteStops(order.route_stops)).pickups), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "mr-1 size-4" }),
            " Navigate to pickup"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", onClick: () => advance("picked_up"), disabled: busy, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "mr-1 size-4" }),
            " Mark picked up"
          ] })
        ] }),
        (order.status === "picked_up" || order.status === "in_transit") && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { className: "bg-gold text-primary-foreground hover:bg-gold/90", onClick: () => void navigateToDropoff(), disabled: busy, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "mr-1 size-4" }),
            " Navigate to drop-off"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-muted/30 p-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", children: "At the drop-off?" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
              "If the customer is there and you hand it off, tap ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: "Delivered" }),
              ". If no one's there, take a photo as proof and the order will be marked delivered."
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex flex-wrap gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { className: "bg-gold text-primary-foreground hover:bg-gold/90", onClick: () => advance("delivered", {
                delivered_at: (/* @__PURE__ */ new Date()).toISOString()
              }), disabled: busy, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "mr-1 size-4" }),
                " Delivered (handed off)"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", onClick: () => fileRef.current?.click(), disabled: busy, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { className: "mr-1 size-4" }),
                " No one here — take photo"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { ref: fileRef, type: "file", accept: "image/*", capture: "environment", hidden: true, onChange: handlePhoto })
            ] })
          ] })
        ] }),
        order.status === "delivered" && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-emerald-500", children: [
          "Delivered ✓ ",
          order.proof_photo_url ? "(photo proof captured)" : ""
        ] })
      ] }),
      !isMine && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-amber-200", children: "This order isn't assigned to you yet." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-muted-foreground", children: "Go back to the dashboard and tap Accept again after the next update deploys." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, variant: "outline", size: "sm", className: "mt-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/driver/dashboard", children: "Back to dashboard" }) })
      ] })
    ] }),
    isMine && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-b border-border p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-serif text-xl", children: "Chat with customer" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Messages are visible to you, the customer who placed the order, and admin." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { ref: scrollRef, className: "max-h-80 space-y-2 overflow-y-auto p-4", children: [
        messages.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center text-xs text-muted-foreground", children: "No messages yet." }),
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
    ] })
  ] });
}
export {
  DriverOrder as component
};
