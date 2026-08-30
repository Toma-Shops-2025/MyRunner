import { Capacitor } from "@capacitor/core";

export type DriverNotifyStatus = "unsupported" | "granted" | "denied" | "default";

export function isNativeDriverApp(): boolean {
  return Capacitor.isNativePlatform();
}

export function getDriverNotifyStatus(): DriverNotifyStatus {
  if (typeof window === "undefined") return "unsupported";

  // Native MyRunner app uses Capacitor Local Notifications (OS permission).
  // Web Notification.permission in the WebView is often stuck on "denied"
  // even when the MyRunner app itself is Allowed.
  if (isNativeDriverApp()) {
    // Until we await LocalNotifications.checkPermissions, treat as default
    // so the Enable alerts button stays visible.
    const cached = sessionStorage.getItem("myrunner-native-notify");
    if (cached === "granted" || cached === "denied" || cached === "default") {
      return cached as DriverNotifyStatus;
    }
    return "default";
  }

  if (!("Notification" in window)) return "unsupported";
  return Notification.permission as DriverNotifyStatus;
}

export async function refreshNativeNotifyStatus(): Promise<DriverNotifyStatus> {
  if (!isNativeDriverApp()) return getDriverNotifyStatus();
  try {
    const { LocalNotifications } = await import("@capacitor/local-notifications");
    const current = await LocalNotifications.checkPermissions();
    const status = mapCapacitorPermission(current.display);
    sessionStorage.setItem("myrunner-native-notify", status);
    return status;
  } catch {
    return "unsupported";
  }
}

function mapCapacitorPermission(value: string): DriverNotifyStatus {
  if (value === "granted") return "granted";
  if (value === "denied") return "denied";
  if (value === "prompt" || value === "prompt-with-rationale") return "default";
  return "default";
}

export async function registerDriverServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) return null;
  if (isNativeDriverApp()) return null;
  try {
    return await navigator.serviceWorker.register("/sw.js", { scope: "/" });
  } catch {
    return null;
  }
}

/**
 * Ask for notification permission from a real tap (toggle or button).
 * Native app → Capacitor Local Notifications (uses MyRunner OS permission).
 * Browser → Web Notification API (separate Chrome site permission for myrunner.shop).
 */
export async function ensureDriverNotificationPermission(): Promise<DriverNotifyStatus> {
  if (typeof window === "undefined") return "unsupported";

  if (isNativeDriverApp()) {
    try {
      const { LocalNotifications } = await import("@capacitor/local-notifications");
      await LocalNotifications.createChannel({
        id: "driver_orders",
        name: "Driver orders",
        description: "New delivery offers and open orders",
        importance: 5,
        visibility: 1,
        sound: "default",
        vibration: true,
      }).catch(() => {});

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
    return result as DriverNotifyStatus;
  } catch {
    return "denied";
  }
}

export async function notifyDriverIfBackground(title: string, body: string, tag?: string) {
  if (typeof window === "undefined") return;

  if (isNativeDriverApp()) {
    try {
      const { LocalNotifications } = await import("@capacitor/local-notifications");
      const perm = await LocalNotifications.checkPermissions();
      if (perm.display !== "granted") return;
      // Always notify on native when an offer arrives — driver may have switched apps.
      const id = Math.floor(Math.random() * 2_000_000_000) + 1;
      await LocalNotifications.schedule({
        notifications: [
          {
            id,
            title,
            body,
            channelId: "driver_orders",
            extra: { tag, url: "/driver/dashboard" },
          },
        ],
      });
    } catch {
      /* ignore */
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
    data: { url: "/driver/dashboard" },
  };

  const showViaWorker = navigator.serviceWorker?.ready?.then((reg) =>
    reg.showNotification(title, payload),
  );

  if (showViaWorker) {
    showViaWorker.catch(() => {
      try {
        new Notification(title, payload);
      } catch {
        /* ignore */
      }
    });
    return;
  }

  try {
    new Notification(title, payload);
  } catch {
    /* ignore */
  }
}

/** Short help copy for the dashboard banner / toasts. */
export function driverNotifyHelp(status: DriverNotifyStatus): { title: string; body: string; toastDenied: string } {
  if (isNativeDriverApp()) {
    return {
      title: "Turn on order alerts",
      body: "Tap Enable alerts so MyRunner can ping you for new deliveries. Your phone already shows Notifications = Allowed for MyRunner — this asks the app permission Android needs on top of that.",
      toastDenied:
        "Android denied the alert permission. Open Settings → Apps → MyRunner → Notifications and make sure they are Allowed, then tap Enable alerts again.",
    };
  }
  return {
    title: "Allow alerts for this site",
    body: "This is separate from the MyRunner app setting. In Chrome, tap the lock icon next to myrunner.shop → Permissions → Notifications → Allow. Then tap Enable alerts.",
    toastDenied:
      "Chrome blocked alerts for this website (not the MyRunner app). Tap the lock icon by the address bar → Site settings → Notifications → Allow.",
  };
}
