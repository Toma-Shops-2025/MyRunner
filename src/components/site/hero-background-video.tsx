import { useEffect, useRef, useState } from "react";

/**
 * Always use the self-hosted file. Netlify/Pixabay env URLs started returning 403
 * and were baked into production builds via VITE_HERO_VIDEO_URL.
 * Cache-bust when swapping the clip so clients don't keep the old lab file.
 */
const HERO_VIDEO = "/video/hero.mp4?v=night-drive-1";

/**
 * Muted looping background for the landing page.
 * No poster/splash overlay — that was covering the video forever on Android WebView
 * when autoplay never fired a reliable "playing" event.
 */
export function HeroBackgroundVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || failed) return;

    el.muted = true;
    el.defaultMuted = true;
    el.volume = 0;
    el.playsInline = true;
    el.controls = false;
    el.setAttribute("muted", "");
    el.setAttribute("playsinline", "");
    el.setAttribute("webkit-playsinline", "true");
    el.disablePictureInPicture = true;
    el.playbackRate = 0.5;

    const tryPlay = () => {
      el.muted = true;
      el.volume = 0;
      el.playbackRate = 0.5;
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
    }, 700);
    const stopKick = window.setTimeout(() => window.clearInterval(kick), 20000);

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
          controlsList="nodownload nofullscreen noremoteplayback"
          disablePictureInPicture
          className="hero-bg-video size-full object-cover opacity-[0.72]"
        />
      ) : (
        <div className="size-full bg-black" aria-hidden />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-black/75" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(0,0,0,0.55)_100%)]" />
    </div>
  );
}
