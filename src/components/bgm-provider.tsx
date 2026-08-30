import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useRouterState } from "@tanstack/react-router";
import { Volume2, VolumeX } from "lucide-react";

import track01 from "@/assets/bgm/01.mp3?url";
import track02 from "@/assets/bgm/02.mp3?url";
import track03 from "@/assets/bgm/03.mp3?url";

const BGM_TRACKS = [track01, track02, track03] as const;

/** 0.5% — fixed background music level */
const BGM_VOLUME = 0.005;

/** Music only on marketing hero + customer/driver dashboards. */
const BGM_ALLOWED_PATHS = new Set(["/", "/app/dashboard", "/driver/dashboard"]);

function shuffleTracks(tracks: readonly string[]): string[] {
  const next = [...tracks];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

function normalizePath(pathname: string): string {
  if (!pathname) return "/";
  if (pathname.length > 1 && pathname.endsWith("/")) return pathname.slice(0, -1);
  return pathname;
}

function isBgmRoute(pathname: string): boolean {
  return BGM_ALLOWED_PATHS.has(normalizePath(pathname));
}

type BgmContextValue = {
  muted: boolean;
  setMuted: (value: boolean) => void;
};

const BgmContext = createContext<BgmContextValue | null>(null);

export function useBgmVolume() {
  const ctx = useContext(BgmContext);
  if (!ctx) throw new Error("useBgmVolume must be used within BgmProvider");
  return ctx;
}

function BgmMuteButton() {
  const { muted, setMuted } = useBgmVolume();

  return (
    <button
      type="button"
      onClick={() => setMuted(!muted)}
      className="fixed bottom-4 right-4 z-[60] flex size-11 items-center justify-center rounded-full border border-gold/40 bg-background/95 text-gold shadow-lg backdrop-blur-md transition-colors hover:bg-gold/10"
      aria-label={muted ? "Unmute background music" : "Mute background music"}
      title={muted ? "Unmute music" : "Mute music"}
    >
      {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
    </button>
  );
}

export function BgmProvider({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const routeAllowsBgm = isBgmRoute(pathname);

  const bgmRef = useRef<HTMLAudioElement | null>(null);
  const queueRef = useRef<string[]>([]);
  const indexRef = useRef(0);
  const playNextRef = useRef<() => void>(() => undefined);
  const mutedRef = useRef(false);
  const shouldPlayRef = useRef(false);

  const [muted, setMutedState] = useState(false);
  const [ready, setReady] = useState(false);

  const applyVolume = useCallback(() => {
    if (bgmRef.current) {
      bgmRef.current.volume = mutedRef.current ? 0 : BGM_VOLUME;
    }
  }, []);

  const setMuted = useCallback(
    (value: boolean) => {
      mutedRef.current = value;
      setMutedState(value);
      applyVolume();
    },
    [applyVolume],
  );

  const pauseBgm = useCallback(() => {
    bgmRef.current?.pause();
  }, []);

  const loadCurrent = useCallback(() => {
    const audio = bgmRef.current;
    if (!audio) return;
    if (queueRef.current.length === 0) {
      queueRef.current = shuffleTracks(BGM_TRACKS);
      indexRef.current = 0;
    }
    const src = queueRef.current[indexRef.current];
    if (!src) return;
    if (!audio.src.endsWith(src) && audio.getAttribute("src") !== src) {
      audio.src = src;
    }
    applyVolume();
  }, [applyVolume]);

  playNextRef.current = () => {
    if (!shouldPlayRef.current) return;
    indexRef.current += 1;
    if (indexRef.current >= queueRef.current.length) {
      queueRef.current = shuffleTracks(BGM_TRACKS);
      indexRef.current = 0;
    }
    loadCurrent();
    bgmRef.current?.play().catch(() => undefined);
  };

  const ensureAudio = useCallback(() => {
    if (bgmRef.current) return bgmRef.current;
    const audio = new Audio();
    audio.preload = "auto";
    audio.addEventListener("ended", () => playNextRef.current());
    bgmRef.current = audio;
    loadCurrent();
    return audio;
  }, [loadCurrent]);

  const startBgm = useCallback(() => {
    if (!shouldPlayRef.current) return;
    if (typeof document !== "undefined" && document.visibilityState !== "visible") return;
    const audio = ensureAudio();
    applyVolume();
    audio.play().catch(() => undefined);
  }, [applyVolume, ensureAudio]);

  useEffect(() => {
    mutedRef.current = false;
    setReady(true);
  }, []);

  // Route + app visibility gate: only hero + dashboards, and only while foregrounded.
  useEffect(() => {
    if (!ready) return;

    const syncPlayback = () => {
      const foreground = document.visibilityState === "visible";
      shouldPlayRef.current = routeAllowsBgm && foreground;
      if (shouldPlayRef.current) startBgm();
      else pauseBgm();
    };

    syncPlayback();

    const onVisible = () => syncPlayback();
    const onFirstGesture = () => {
      if (shouldPlayRef.current) startBgm();
    };

    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("pagehide", pauseBgm);
    window.addEventListener("pointerdown", onFirstGesture, { once: true });
    window.addEventListener("touchstart", onFirstGesture, { once: true, passive: true });
    window.addEventListener("keydown", onFirstGesture, { once: true });

    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("pagehide", pauseBgm);
      window.removeEventListener("pointerdown", onFirstGesture);
      window.removeEventListener("touchstart", onFirstGesture);
      window.removeEventListener("keydown", onFirstGesture);
      shouldPlayRef.current = false;
      pauseBgm();
    };
  }, [ready, routeAllowsBgm, startBgm, pauseBgm]);

  useEffect(() => {
    return () => {
      if (bgmRef.current) {
        bgmRef.current.pause();
        bgmRef.current = null;
      }
    };
  }, []);

  const showMute = ready && routeAllowsBgm;

  return (
    <BgmContext.Provider value={{ muted, setMuted }}>
      {children}
      {showMute ? <BgmMuteButton /> : null}
    </BgmContext.Provider>
  );
}
