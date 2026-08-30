const PERMISSION_KEY = "myrunner-driver-notify-asked";

/** Ask once when the driver goes online (mobile browsers require a user gesture). */
export async function ensureDriverNotificationPermission(): Promise<boolean> {
  if (typeof window === "undefined" || !("Notification" in window)) return false;
  if (Notification.permission === "granted") return true;
  if (Notification.permission === "denied") return false;
  if (sessionStorage.getItem(PERMISSION_KEY) === "1") return false;

  sessionStorage.setItem(PERMISSION_KEY, "1");
  try {
    const result = await Notification.requestPermission();
    return result === "granted";
  } catch {
    return false;
  }
}

/** Show a system notification when the dashboard tab is in the background. */
export function notifyDriverIfBackground(title: string, body: string, tag?: string) {
  if (typeof window === "undefined" || !("Notification" in window)) return;
  if (Notification.permission !== "granted") return;
  if (!document.hidden && document.hasFocus()) return;

  try {
    const n = new Notification(title, {
      body,
      tag,
      icon: "/icon-192.png",
      badge: "/icon-192.png",
    });
    n.onclick = () => {
      window.focus();
      n.close();
    };
  } catch {
    /* ignore — some browsers block without service worker */
  }
}
