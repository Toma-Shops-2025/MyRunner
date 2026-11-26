import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { e as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useServerFn } from "./useServerFn-DL2oePlL.mjs";
import { u as useBgmVolume, B as Button, c as cn } from "./router-CaL1rPwL.mjs";
import { R as Root$1, T as Thumb } from "../_libs/radix-ui__react-switch.mjs";
import { L as Label } from "./label-cfIxUmTz.mjs";
import { R as Root, P as Portal, C as Content, b as Close, a as Title, D as Description, O as Overlay } from "../_libs/radix-ui__react-dialog.mjs";
import { s as supabase } from "./client-DfLBq1uk.mjs";
import { u as useAuth, n as notifyPayoutStatusChanged } from "./use-auth-B85-Dc53.mjs";
import { f as fmtUSD } from "./pricing-Ci0mfZy0.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { setDriverPresence, acceptOffer, declineOffer, claimOpenOrder } from "./dispatch.functions-CDAFMReD.mjs";
import { getDriverReferralStats } from "./referral.functions-BOR-6JNb.mjs";
import { r as refreshAccountStatus } from "./connect.functions-5BWjSdTS.mjs";
import { C as Capacitor } from "../_libs/capacitor__core.mjs";
import { R as RouteAddressList } from "./route-address-list-o7LWFg7y.mjs";
import { m as mapsDirectionsUrl, o as orderedAddresses, p as parseRouteStops } from "./route-stops-DHGcaVTx.mjs";
import "../_libs/seroval.mjs";
import "../_libs/stripe.mjs";
import { R as RefreshCw, I as Bell, d as Share2, f as MapPin, X } from "../_libs/lucide-react.mjs";
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
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/radix-ui__react-use-previous.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/react-remove-scroll.mjs";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/aria-hidden.mjs";
const Switch = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Root$1,
  {
    className: cn(
      "peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
      className
    ),
    ...props,
    ref,
    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Thumb,
      {
        className: cn(
          "pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0"
        )
      }
    )
  }
));
Switch.displayName = Root$1.displayName;
const Dialog = Root;
const DialogPortal = Portal;
const DialogOverlay = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Overlay,
  {
    ref,
    className: cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    ),
    ...props
  }
));
DialogOverlay.displayName = Overlay.displayName;
const DialogContent = reactExports.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogPortal, { children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx(DialogOverlay, {}),
  /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Content,
    {
      ref,
      className: cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg",
        className
      ),
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Close, { className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sr-only", children: "Close" })
        ] })
      ]
    }
  )
] }));
DialogContent.displayName = Content.displayName;
const DialogHeader = ({ className, ...props }) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("flex flex-col space-y-1.5 text-center sm:text-left", className), ...props });
DialogHeader.displayName = "DialogHeader";
const DialogTitle = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Title,
  {
    ref,
    className: cn("text-lg font-semibold leading-none tracking-tight", className),
    ...props
  }
));
DialogTitle.displayName = Title.displayName;
const DialogDescription = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Description,
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
DialogDescription.displayName = Description.displayName;
function isNativeDriverApp() {
  return Capacitor.isNativePlatform();
}
function getDriverNotifyStatus() {
  if (typeof window === "undefined") return "unsupported";
  if (isNativeDriverApp()) {
    const cached = sessionStorage.getItem("myrunner-native-notify");
    if (cached === "granted" || cached === "denied" || cached === "default") {
      return cached;
    }
    return "default";
  }
  if (!("Notification" in window)) return "unsupported";
  return Notification.permission;
}
async function refreshNativeNotifyStatus() {
  if (!isNativeDriverApp()) return getDriverNotifyStatus();
  try {
    const { LocalNotifications } = await import("../_libs/capacitor__local-notifications.mjs");
    const current = await LocalNotifications.checkPermissions();
    const status = mapCapacitorPermission(current.display);
    sessionStorage.setItem("myrunner-native-notify", status);
    return status;
  } catch {
    return "unsupported";
  }
}
function mapCapacitorPermission(value) {
  if (value === "granted") return "granted";
  if (value === "denied") return "denied";
  if (value === "prompt" || value === "prompt-with-rationale") return "default";
  return "default";
}
async function registerDriverServiceWorker() {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) return null;
  if (isNativeDriverApp()) return null;
  try {
    return await navigator.serviceWorker.register("/sw.js", { scope: "/" });
  } catch {
    return null;
  }
}
async function ensureDriverNotificationPermission() {
  if (typeof window === "undefined") return "unsupported";
  if (isNativeDriverApp()) {
    try {
      const { LocalNotifications } = await import("../_libs/capacitor__local-notifications.mjs");
      await LocalNotifications.createChannel({
        id: "driver_orders",
        name: "Driver orders",
        description: "New delivery offers and open orders",
        importance: 5,
        visibility: 1,
        sound: "default",
        vibration: true
      }).catch(() => {
      });
      let current = await LocalNotifications.checkPermissions();
      if (current.display !== "granted") {
        current = await LocalNotifications.requestPermissions();
      }
      const status = mapCapacitorPermission(current.display);
      sessionStorage.setItem("myrunner-native-notify", status);
      return status;
    } catch {
      return "unsupported";
    }
  }
  if (!("Notification" in window)) return "unsupported";
  await registerDriverServiceWorker();
  if (Notification.permission === "granted") return "granted";
  if (Notification.permission === "denied") return "denied";
  try {
    const result = await Notification.requestPermission();
    return result;
  } catch {
    return "denied";
  }
}
async function notifyDriverIfBackground(title, body, tag) {
  if (typeof window === "undefined") return;
  if (isNativeDriverApp()) {
    try {
      const { LocalNotifications } = await import("../_libs/capacitor__local-notifications.mjs");
      const perm = await LocalNotifications.checkPermissions();
      if (perm.display !== "granted") return;
      const id = Math.floor(Math.random() * 2e9) + 1;
      await LocalNotifications.schedule({
        notifications: [
          {
            id,
            title,
            body,
            channelId: "driver_orders",
            extra: { tag, url: "/driver/dashboard" }
          }
        ]
      });
    } catch {
    }
    return;
  }
  if (!("Notification" in window)) return;
  if (Notification.permission !== "granted") return;
  if (!document.hidden && document.hasFocus()) return;
  const payload = {
    body,
    tag,
    icon: "/icon-192.png",
    badge: "/icon-192.png",
    data: { url: "/driver/dashboard" }
  };
  const showViaWorker = navigator.serviceWorker?.ready?.then(
    (reg) => reg.showNotification(title, payload)
  );
  if (showViaWorker) {
    showViaWorker.catch(() => {
      try {
        new Notification(title, payload);
      } catch {
      }
    });
    return;
  }
  try {
    new Notification(title, payload);
  } catch {
  }
}
function driverNotifyHelp(status) {
  if (isNativeDriverApp()) {
    return {
      title: "Turn on order alerts",
      body: "Tap Enable alerts so MyRunner can ping you for new deliveries. Your phone already shows Notifications = Allowed for MyRunner — this asks the app permission Android needs on top of that.",
      toastDenied: "Android denied the alert permission. Open Settings → Apps → MyRunner → Notifications and make sure they are Allowed, then tap Enable alerts again."
    };
  }
  return {
    title: "Allow alerts for this site",
    body: "This is separate from the MyRunner app setting. In Chrome, tap the lock icon next to myrunner.shop → Permissions → Notifications → Allow. Then tap Enable alerts.",
    toastDenied: "Chrome blocked alerts for this website (not the MyRunner app). Tap the lock icon by the address bar → Site settings → Notifications → Allow."
  };
}
function extraStopLabel(stops) {
  const count = parseRouteStops(stops).length;
  return count ? ` + ${count} more` : "";
}
const ONLINE_INTENT_KEY = "myrunner-driver-online";
function DriverDashboard() {
  const {
    user
  } = useAuth();
  const {
    setMuted
  } = useBgmVolume();
  const [online, setOnline] = reactExports.useState(false);
  const [pool, setPool] = reactExports.useState([]);
  const [mine, setMine] = reactExports.useState([]);
  const [completed, setCompleted] = reactExports.useState([]);
  const [rating, setRating] = reactExports.useState({
    avg: 0,
    count: 0
  });
  const [payoutsEnabled, setPayoutsEnabled] = reactExports.useState(null);
  const [bgStatus, setBgStatus] = reactExports.useState("pending");
  const [isActive, setIsActive] = reactExports.useState(true);
  const [loading, setLoading] = reactExports.useState(true);
  const [currentOffer, setCurrentOffer] = reactExports.useState(null);
  const [offerSecondsLeft, setOfferSecondsLeft] = reactExports.useState(0);
  const [notifyStatus, setNotifyStatus] = reactExports.useState("default");
  const [referral, setReferral] = reactExports.useState(null);
  const presenceFn = useServerFn(setDriverPresence);
  const referralFn = useServerFn(getDriverReferralStats);
  const acceptFn = useServerFn(acceptOffer);
  const declineFn = useServerFn(declineOffer);
  const claimFn = useServerFn(claimOpenOrder);
  const refreshPayoutFn = useServerFn(refreshAccountStatus);
  const navigate = useNavigate();
  const lastLocRef = reactExports.useRef(null);
  const knownPoolIdsRef = reactExports.useRef(/* @__PURE__ */ new Set());
  const load = reactExports.useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const [poolRes, mineRes, doneRes, ratingsRes, profileRes] = await Promise.all([
      // Fallback-pool orders: dispatcher couldn't place these, any driver can grab
      supabase.from("orders").select("*").eq("dispatch_status", "fallback_pool").eq("payment_status", "paid").is("driver_id", null).order("created_at", {
        ascending: false
      }).limit(50),
      supabase.from("orders").select("*").eq("driver_id", user.id).in("status", ["accepted", "picked_up", "in_transit"]).order("created_at", {
        ascending: false
      }),
      supabase.from("orders").select("*").eq("driver_id", user.id).eq("status", "delivered").order("created_at", {
        ascending: false
      }).limit(100),
      supabase.from("ratings").select("stars").eq("ratee_id", user.id),
      supabase.from("profiles").select("payouts_enabled, background_check_status, is_active, driver_status, stripe_connect_account_id").eq("id", user.id).maybeSingle()
    ]);
    setPool(poolRes.data ?? []);
    const poolOrders = poolRes.data ?? [];
    const prevPool = knownPoolIdsRef.current;
    for (const o of poolOrders) {
      if (!prevPool.has(o.id) && prevPool.size > 0) {
        notifyDriverIfBackground("Open delivery available", o.item_description.slice(0, 80), `pool-${o.id}`);
      }
    }
    knownPoolIdsRef.current = new Set(poolOrders.map((o) => o.id));
    setMine(mineRes.data ?? []);
    setCompleted(doneRes.data ?? []);
    const stars = (ratingsRes.data ?? []).map((r) => r.stars);
    setRating({
      avg: stars.length ? stars.reduce((a, b) => a + b, 0) / stars.length : 0,
      count: stars.length
    });
    const prof = profileRes.data;
    setPayoutsEnabled(Boolean(prof?.payouts_enabled));
    setBgStatus(prof?.background_check_status ?? "pending");
    setIsActive(prof?.is_active ?? true);
    const intentOnline = sessionStorage.getItem(ONLINE_INTENT_KEY) === "1";
    setOnline(prof?.driver_status === "online" || intentOnline);
    setLoading(false);
    try {
      const stats = await referralFn();
      setReferral({
        code: stats.code,
        link: stats.link,
        invited: stats.invited,
        paidCount: stats.paidCount,
        pendingCount: stats.pendingCount,
        deliveryGoal: stats.deliveryGoal,
        rewardCents: stats.rewardCents
      });
    } catch (e) {
      console.warn("referral stats:", e);
    }
    if (prof?.stripe_connect_account_id && !prof?.payouts_enabled) {
      const res = await refreshPayoutFn();
      if ("payoutsEnabled" in res && res.payoutsEnabled) {
        setPayoutsEnabled(true);
        notifyPayoutStatusChanged();
      }
    }
  }, [user, refreshPayoutFn, referralFn]);
  reactExports.useEffect(() => {
    if (!user) return;
    if (sessionStorage.getItem(ONLINE_INTENT_KEY) !== "1") return;
    presenceFn({
      data: {
        status: "online"
      }
    }).then(() => setOnline(true)).catch(() => {
      sessionStorage.removeItem(ONLINE_INTENT_KEY);
      setOnline(false);
    });
  }, [user, presenceFn]);
  reactExports.useEffect(() => {
    setNotifyStatus(getDriverNotifyStatus());
    void registerDriverServiceWorker();
    if (isNativeDriverApp()) {
      void refreshNativeNotifyStatus().then(setNotifyStatus);
    }
    const sync = () => {
      if (isNativeDriverApp()) void refreshNativeNotifyStatus().then(setNotifyStatus);
      else setNotifyStatus(getDriverNotifyStatus());
    };
    document.addEventListener("visibilitychange", sync);
    return () => document.removeEventListener("visibilitychange", sync);
  }, []);
  async function enableOrderAlerts() {
    const help = driverNotifyHelp();
    const status = await ensureDriverNotificationPermission();
    setNotifyStatus(status);
    if (status === "granted") {
      toast.success(isNativeDriverApp() ? "Order alerts on in the MyRunner app." : "Order alerts on. Keep this Chrome tab open while you drive.");
    } else if (status === "denied") {
      toast.error(help.toastDenied);
    } else if (status === "unsupported") {
      toast.error("This browser cannot show order alerts. Use the MyRunner app or Chrome.");
    } else {
      toast.message("Allow notifications when your phone asks.");
    }
  }
  reactExports.useEffect(() => {
    if (!user) return;
    load();
    const ch = supabase.channel("driver-feed").on("postgres_changes", {
      event: "*",
      schema: "public",
      table: "orders"
    }, () => load()).subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [user, load]);
  reactExports.useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    if (sp.get("onboarded") !== "1" && sp.get("refresh") !== "1") return;
    window.history.replaceState({}, "", window.location.pathname);
    void (async () => {
      const res = await refreshPayoutFn();
      if ("error" in res && res.error) {
        toast.error(res.error);
      } else if ("payoutsEnabled" in res) {
        toast.success(res.payoutsEnabled ? "Payouts enabled — you're all set." : "Stripe still needs a bit more info. Tap Set up payouts to continue.");
      }
      notifyPayoutStatusChanged();
      await load();
    })();
  }, [refreshPayoutFn, load]);
  reactExports.useEffect(() => {
    if (!user) return;
    const fetchPending = async () => {
      const {
        data
      } = await supabase.from("offers").select("*").eq("driver_id", user.id).eq("status", "pending").order("offered_at", {
        ascending: false
      }).limit(1).maybeSingle();
      if (data && new Date(data.expires_at).getTime() > Date.now()) {
        const {
          data: order
        } = await supabase.from("orders").select("*").eq("id", data.order_id).maybeSingle();
        setCurrentOffer({
          ...data,
          order: order ?? void 0
        });
        notifyDriverIfBackground("New delivery offer", order?.item_description?.slice(0, 80) ?? "Tap to accept within 45 seconds", `offer-${data.id}`);
        try {
          const AC = window.AudioContext || window.webkitAudioContext;
          const ctx = new AC();
          const osc = ctx.createOscillator();
          osc.frequency.value = 880;
          osc.connect(ctx.destination);
          osc.start();
          setTimeout(() => {
            osc.stop();
            ctx.close();
          }, 250);
        } catch {
        }
        if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
      }
    };
    fetchPending();
    const ch = supabase.channel(`offers-${user.id}`).on("postgres_changes", {
      event: "INSERT",
      schema: "public",
      table: "offers",
      filter: `driver_id=eq.${user.id}`
    }, () => fetchPending()).on("postgres_changes", {
      event: "UPDATE",
      schema: "public",
      table: "offers",
      filter: `driver_id=eq.${user.id}`
    }, () => fetchPending()).subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [user]);
  reactExports.useEffect(() => {
    if (!currentOffer) {
      setOfferSecondsLeft(0);
      return;
    }
    const update = () => {
      const left = Math.max(0, Math.ceil((new Date(currentOffer.expires_at).getTime() - Date.now()) / 1e3));
      setOfferSecondsLeft(left);
      if (left <= 0) setCurrentOffer(null);
    };
    update();
    const t = setInterval(update, 250);
    return () => clearInterval(t);
  }, [currentOffer]);
  reactExports.useEffect(() => {
    if (!online || !user) return;
    if (!("geolocation" in navigator)) return;
    const send = (lat, lng) => {
      lastLocRef.current = {
        lat,
        lng
      };
      presenceFn({
        data: {
          status: "online",
          lat,
          lng
        }
      }).catch(() => {
      });
    };
    navigator.geolocation.getCurrentPosition((p) => send(p.coords.latitude, p.coords.longitude), () => {
    }, {
      enableHighAccuracy: true,
      timeout: 8e3
    });
    const watchId = navigator.geolocation.watchPosition((p) => send(p.coords.latitude, p.coords.longitude), () => {
    }, {
      enableHighAccuracy: true,
      maximumAge: 15e3
    });
    const interval = setInterval(() => {
      const loc = lastLocRef.current;
      if (loc) presenceFn({
        data: {
          status: "online",
          lat: loc.lat,
          lng: loc.lng
        }
      }).catch(() => {
      });
    }, 2e4);
    return () => {
      navigator.geolocation.clearWatch(watchId);
      clearInterval(interval);
    };
  }, [online, user, presenceFn]);
  const canAccept = payoutsEnabled === true && isActive && bgStatus !== "failed";
  async function toggleOnline(next) {
    if (next && !canAccept) {
      if (!payoutsEnabled) return toast.error("Finish Stripe payout setup before going online.");
      if (bgStatus === "failed" || !isActive) return toast.error("Your account is deactivated. Contact support.");
    }
    setOnline(next);
    try {
      if (next) await enableOrderAlerts();
      await presenceFn({
        data: {
          status: next ? "online" : "offline"
        }
      });
      if (next) sessionStorage.setItem(ONLINE_INTENT_KEY, "1");
      else sessionStorage.removeItem(ONLINE_INTENT_KEY);
      toast.success(next ? "You're online." : "You're offline.");
    } catch (e) {
      setOnline(!next);
      if (next) sessionStorage.removeItem(ONLINE_INTENT_KEY);
      toast.error(e?.message || "Couldn't update status.");
    }
  }
  async function handleAccept() {
    if (!currentOffer) return;
    const orderId = currentOffer.order_id;
    try {
      await acceptFn({
        data: {
          offerId: currentOffer.id
        }
      });
      setMuted(true);
      toast.success("Order accepted — opening delivery.");
      setCurrentOffer(null);
      navigate({
        to: "/driver/orders/$id",
        params: {
          id: orderId
        }
      });
    } catch (e) {
      toast.error(e.message);
      setCurrentOffer(null);
    }
  }
  async function handleDecline() {
    if (!currentOffer) return;
    try {
      await declineFn({
        data: {
          offerId: currentOffer.id
        }
      });
    } catch {
    }
    setCurrentOffer(null);
  }
  async function claim(o) {
    if (!user) return;
    if (!canAccept) {
      if (!payoutsEnabled) return toast.error("Finish Stripe payout setup before accepting orders.");
      if (bgStatus === "failed" || !isActive) return toast.error("Your account is deactivated. Contact support.");
    }
    try {
      await claimFn({
        data: {
          orderId: o.id
        }
      });
      setMuted(true);
      toast.success("Order claimed — opening delivery.");
      navigate({
        to: "/driver/orders/$id",
        params: {
          id: o.id
        }
      });
    } catch (e) {
      toast.error(e.message || "Could not claim order.");
    }
  }
  const driverShare = (o) => Math.round(o.price_cents * 0.7) + o.tip_cents;
  const isSameLocalDay = (iso) => {
    if (!iso) return false;
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return false;
    const now = /* @__PURE__ */ new Date();
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();
  };
  const todayCents = completed.filter((o) => isSameLocalDay(o.delivered_at) || isSameLocalDay(o.created_at)).reduce((s, o) => s + driverShare(o), 0);
  const lifetimeCents = completed.reduce((s, o) => s + driverShare(o), 0);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-serif text-3xl", children: "Today" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Toggle online to receive offers. You'll get one offer at a time with 45 seconds to accept." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "ghost", onClick: load, "aria-label": "Refresh", children: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: `size-4 ${loading ? "animate-spin" : ""}` }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "online", className: online ? "text-gold" : "text-muted-foreground", children: online ? "Online" : "Offline" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Switch, { id: "online", checked: online, onCheckedChange: toggleOnline })
      ] })
    ] }),
    notifyStatus !== "granted" && notifyStatus !== "unsupported" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-gold/40 bg-gold/5 p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-serif text-lg", children: driverNotifyHelp().title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: driverNotifyHelp().body }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "button", className: "mt-4 bg-gold text-primary-foreground hover:bg-gold/90", onClick: () => void enableOrderAlerts(), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "mr-2 size-4" }),
        "Enable alerts"
      ] })
    ] }),
    (bgStatus === "failed" || !isActive) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-destructive/40 bg-destructive/10 p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-serif text-lg text-destructive", children: "Account deactivated" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-sm text-muted-foreground", children: [
        "Your background check returned a result that doesn't meet our standards. You can't accept orders right now. Contact ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "/contact", className: "underline text-destructive", children: "support" }),
        " if you believe this is a mistake."
      ] })
    ] }),
    payoutsEnabled === false && bgStatus !== "failed" && isActive && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gold/40 bg-gold-soft p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-serif text-lg text-gold", children: "Finish payout setup before accepting orders" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "You're activated as a Runner — but you can't accept orders or get paid until Stripe Connect is complete (70% of fee + 100% of tips)." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, className: "bg-gold text-primary-foreground hover:bg-gold/90", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/driver/earnings", children: "Set up payouts" }) })
    ] }),
    bgStatus === "pending" && payoutsEnabled === true && isActive && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl border border-border bg-muted/30 p-4 text-sm text-muted-foreground", children: "Background check in progress. You can accept and complete orders while it's running. If a disqualifying result comes back, your account will be deactivated automatically." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 sm:grid-cols-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Today's earnings", value: fmtUSD(todayCents) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Active", value: String(mine.length) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Completed", value: String(completed.length) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Rating", value: rating.count ? `${rating.avg.toFixed(2)} ★` : "—" })
    ] }),
    mine.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-serif text-2xl", children: "Your active deliveries" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-4 space-y-3", children: mine.map((o) => /* @__PURE__ */ jsxRuntimeExports.jsx(OrderCard, { order: o, mine: true }, o.id)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-serif text-2xl", children: "Open orders" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: online ? "Orders that couldn't be auto-assigned show up here for any driver to grab." : "You're offline — toggle on to receive offers." }),
      !online ? null : pool.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 rounded-2xl border border-dashed border-border p-12 text-center text-sm text-muted-foreground", children: "No open orders. New deliveries will be offered to you directly." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-4 space-y-3", children: pool.map((o) => /* @__PURE__ */ jsxRuntimeExports.jsx(OrderCard, { order: o, onClaim: () => claim(o), canAccept }, o.id)) })
    ] }),
    completed.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-serif text-2xl", children: "Recent completed" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
        "Lifetime: ",
        fmtUSD(lifetimeCents),
        " across ",
        completed.length,
        " deliveries."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-4 divide-y divide-border rounded-2xl border border-border bg-card", children: completed.slice(0, 8).map((o) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center justify-between gap-4 px-5 py-3 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate font-medium", children: o.item_description }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "truncate text-xs text-muted-foreground", children: [
            o.pickup_address,
            " → ",
            o.dropoff_address,
            extraStopLabel(o.route_stops)
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-serif text-lg text-gold", children: fmtUSD(driverShare(o)) })
      ] }, o.id)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-gold/40 bg-gold-soft p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Share2, { className: "size-6 text-gold" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-serif text-xl", children: "$25 driver referral" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
            "Invite a Runner. When they complete ",
            referral?.deliveryGoal ?? 3,
            " deliveries, you both get",
            " ",
            fmtUSD(referral?.rewardCents ?? 2500),
            " (Stripe debit/bank).",
            referral ? ` · ${referral.invited} invited · ${referral.paidCount} paid · ${referral.pendingCount} in progress` : ""
          ] }),
          referral?.link && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 break-all font-mono text-xs text-gold", children: referral.link })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: async () => {
          if (!referral?.link) return toast.error("Referral link not ready yet — run the SQL setup.");
          await navigator.clipboard.writeText(referral.link);
          toast.success("Referral link copied");
        }, children: "Copy invite link" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, className: "bg-gold text-primary-foreground hover:bg-gold/90", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/share", children: "Customer share page" }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!currentOffer, onOpenChange: (open) => {
      if (!open) handleDecline();
    }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "sm:max-w-md", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-serif text-2xl", children: "New delivery offer" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogDescription, { children: [
          offerSecondsLeft,
          "s to accept · attempt ",
          currentOffer?.order ? `for ${currentOffer.order.distance_miles ?? "?"} mi` : ""
        ] })
      ] }),
      currentOffer?.order && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-gold/40 bg-gold-soft p-4 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-serif text-4xl text-gold", children: fmtUSD(currentOffer.order.price_cents + currentOffer.order.tip_cents) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-widest text-muted-foreground", children: "Total payout (incl. tip)" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Item:" }),
            " ",
            currentOffer.order.item_description
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(RouteAddressList, { pickup: currentOffer.order.pickup_address, dropoff: currentOffer.order.dropoff_address, stops: currentOffer.order.route_stops })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 w-full overflow-hidden rounded-full bg-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full bg-gold transition-all", style: {
          width: `${Math.max(0, offerSecondsLeft / 45 * 100)}%`
        } }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", className: "flex-1", onClick: handleDecline, children: "Decline" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { className: "flex-1 bg-gold text-primary-foreground hover:bg-gold/90", onClick: handleAccept, children: [
            "Accept · ",
            offerSecondsLeft,
            "s"
          ] })
        ] })
      ] })
    ] }) })
  ] });
}
function Stat({
  label,
  value
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-serif text-3xl", children: value }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-widest text-muted-foreground", children: label })
  ] });
}
function OrderCard({
  order,
  mine,
  onClaim,
  canAccept = true
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "rounded-2xl border border-border bg-card p-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-serif text-lg", children: order.item_description }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(RouteAddressList, { pickup: order.pickup_address, dropoff: order.dropoff_address, stops: order.route_stops }),
        order.notes && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-xs italic text-muted-foreground", children: [
          '"',
          order.notes,
          '"'
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-xs text-muted-foreground", children: [
          order.distance_miles ? `${order.distance_miles} mi · ` : "",
          order.type.replace("_", " ")
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-serif text-3xl text-gold", children: fmtUSD(order.price_cents + order.tip_cents) }),
        mine ? /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, size: "sm", className: "mt-2 bg-gold text-primary-foreground hover:bg-gold/90", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/driver/orders/$id", params: {
          id: order.id
        }, children: "Open" }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", className: "mt-2 bg-gold text-primary-foreground hover:bg-gold/90", onClick: onClaim, disabled: !canAccept, title: canAccept ? "" : "Complete payout setup to accept orders", children: "Accept" })
      ] })
    ] }),
    mine && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex flex-wrap gap-2 border-t border-border pt-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { target: "_blank", rel: "noreferrer", href: mapsDirectionsUrl(orderedAddresses(order.pickup_address, order.dropoff_address, parseRouteStops(order.route_stops)).pickups), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "mr-1 size-3" }),
        " Navigate to pickup"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { target: "_blank", rel: "noreferrer", href: mapsDirectionsUrl(orderedAddresses(order.pickup_address, order.dropoff_address, parseRouteStops(order.route_stops)).dropoffs), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "mr-1 size-3" }),
        " Navigate to drop-off"
      ] }) })
    ] })
  ] });
}
export {
  DriverDashboard as component
};
