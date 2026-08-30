export type DriverNotifyStatus = "unsupported" | "granted" | "denied" | "default";

export function getDriverNotifyStatus(): DriverNotifyStatus {
  if (typeof window === "undefined" || !("Notification" in window)) return "unsupported";
  return Notification.permission as DriverNotifyStatus;
}

export async function registerDriverServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) return null;
  try {
    return await navigator.serviceWorker.register("/sw.js", { scope: "/" });
  } catch {
    return null;
  }
}

/**
 * Ask for notification permission from a real tap (toggle or button).
 * Android Chrome will not show a prompt if Chrome's OS notifications are off —
 * permission then comes back as "denied" immediately.
 */
export async function ensureDriverNotificationPermission(): Promise<DriverNotifyStatus> {
  if (typeof window === "undefined" || !("Notification" in window)) return "unsupported";
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

export function notifyDriverIfBackground(title: string, body: string, tag?: string) {
  if (typeof window === "undefined" || !("Notification" in window)) return;
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
