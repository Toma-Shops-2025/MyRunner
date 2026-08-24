import { useEffect, useRef, useState } from "react";

/** Self-hosted — remote CDNs (Pixabay) started returning 403 and killed the hero. */
const HERO_VIDEO =
  (import.meta as ImportMeta & { env?: Record<string, string> }).env?.VITE_HERO_VIDEO_URL ||
  "/video/hero.mp4";

const POSTER = "/og-image.png";

/**
 * Android WebView often blocks autoplay and paints a giant native play button.
 * Keep a poster cover until the video is actually playing, and keep forcing muted play.
 */
export function HeroBackgroundVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || failed) return;

    el.muted = true;
    el.defaultMuted = true;
    el.volume = 0;
    el.playsInline = true;
    el.setAttribute("muted", "");
    el.setAttribute("playsinline", "");
    el.setAttribute("webkit-playsinline", "true");
    el.setAttribute("x5-playsinline", "true");
    el.setAttribute("x5-video-player-type", "h5");
    el.setAttribute("x5-video-player-fullscreen", "false");
    el.disablePictureInPicture = true;
    el.controls = false;

    const tryPlay = () => {
      el.muted = true;
      el.volume = 0;
      const p = el.play();
      if (p && typeof p.then === "function") {
        void p
          .then(() => setPlaying(true))
          .catch(() => undefined);
      } else if (!el.paused) {
        setPlaying(true);
      }
    };

    const onPlaying = () => setPlaying(true);
    const onPause = () => {
      // Don't flash the native overlay — cover again and retry.
      setPlaying(false);
      tryPlay();
    };

    tryPlay();
    el.addEventListener("loadeddata", tryPlay);
    el.addEventListener("canplay", tryPlay);
    el.addEventListener("canplaythrough", tryPlay);
    el.addEventListener("playing", onPlaying);
    el.addEventListener("pause", onPause);
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
    }, 600);
    const stopKick = window.setTimeout(() => window.clearInterval(kick), 15000);

    return () => {
      el.removeEventListener("loadeddata", tryPlay);
      el.removeEventListener("canplay", tryPlay);
      el.removeEventListener("canplaythrough", tryPlay);
      el.removeEventListener("playing", onPlaying);
      el.removeEventListener("pause", onPause);
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
        <>
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
            poster={POSTER}
            className="hero-bg-video size-full object-cover opacity-[0.72]"
          />
          {/* Covers Android's giant play overlay until muted playback actually starts. */}
          {!playing && (
            <img
              src={POSTER}
              alt=""
              className="absolute inset-0 size-full object-cover opacity-[0.72]"
              aria-hidden
            />
          )}
        </>
      ) : (
        <img src={POSTER} alt="" className="size-full object-cover opacity-[0.72]" />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-black/75" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(0,0,0,0.55)_100%)]" />
    </div>
  );
}
