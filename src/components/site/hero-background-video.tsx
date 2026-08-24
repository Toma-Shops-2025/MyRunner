import { useEffect, useRef, useState } from "react";

/** Self-hosted — remote CDNs (Pixabay) started returning 403 and killed the hero. */
const HERO_VIDEO =
  (import.meta as ImportMeta & { env?: Record<string, string> }).env?.VITE_HERO_VIDEO_URL ||
  "/video/hero.mp4";

/** Android WebView often ignores autoPlay and shows a giant play overlay — force muted play. */
export function HeroBackgroundVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || failed) return;

    el.muted = true;
    el.defaultMuted = true;
    el.playsInline = true;
    el.setAttribute("muted", "");
    el.setAttribute("playsinline", "");
    el.setAttribute("webkit-playsinline", "true");
    el.disablePictureInPicture = true;

    const tryPlay = () => {
      el.muted = true;
      void el.play().catch(() => undefined);
    };

    tryPlay();
    el.addEventListener("loadeddata", tryPlay);
    el.addEventListener("canplay", tryPlay);
    el.addEventListener("canplaythrough", tryPlay);
    el.addEventListener("error", () => setFailed(true));

    const onGesture = () => tryPlay();
    window.addEventListener("pointerdown", onGesture, { passive: true });
    window.addEventListener("touchstart", onGesture, { passive: true });
    const onVis = () => {
      if (document.visibilityState === "visible") tryPlay();
    };
    document.addEventListener("visibilitychange", onVis);

    const kick = window.setInterval(() => {
      if (el.paused) tryPlay();
      else window.clearInterval(kick);
    }, 800);
    const stopKick = window.setTimeout(() => window.clearInterval(kick), 12000);

    return () => {
      el.removeEventListener("loadeddata", tryPlay);
      el.removeEventListener("canplay", tryPlay);
      el.removeEventListener("canplaythrough", tryPlay);
      window.removeEventListener("pointerdown", onGesture);
      window.removeEventListener("touchstart", onGesture);
      document.removeEventListener("visibilitychange", onVis);
      window.clearInterval(kick);
      window.clearTimeout(stopKick);
    };
  }, [failed]);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-black">
      {!failed ? (
        <video
          ref={ref}
          src={HERO_VIDEO}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          controls={false}
          disablePictureInPicture
          poster="/og-image.png"
          className="hero-bg-video size-full object-cover opacity-[0.72]"
        />
      ) : (
        <img
          src="/og-image.png"
          alt=""
          className="size-full object-cover opacity-[0.72]"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-black/75" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(0,0,0,0.55)_100%)]" />
    </div>
  );
}
