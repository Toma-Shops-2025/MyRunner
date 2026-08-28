import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Volume2, VolumeX } from "lucide-react";

import track01 from "@/assets/bgm/01.mp3?url";
import track02 from "@/assets/bgm/02.mp3?url";
import track03 from "@/assets/bgm/03.mp3?url";

const BGM_TRACKS = [track01, track02, track03] as const;

/** 0.5% — fixed background music level */
const BGM_VOLUME = 0.005;

function shuffleTracks(tracks: readonly string[]): string[] {
  const next = [...tracks];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
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
  const bgmRef = useRef<HTMLAudioElement | null>(null);
  const queueRef = useRef<string[]>([]);
  const indexRef = useRef(0);
  const playNextRef = useRef<() => void>(() => undefined);
  const mutedRef = useRef(false);

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

  const loadCurrent = useCallback(() => {
    const audio = bgmRef.current;
    if (!audio) return;
    if (queueRef.current.length === 0) {
      queueRef.current = shuffleTracks(BGM_TRACKS);
      indexRef.current = 0;
    }
    const src = queueRef.current[indexRef.current];
    if (!src) return;
    audio.src = src;
    applyVolume();
  }, [applyVolume]);

  playNextRef.current = () => {
    indexRef.current += 1;
    if (indexRef.current >= queueRef.current.length) {
      queueRef.current = shuffleTracks(BGM_TRACKS);
      indexRef.current = 0;
    }
    loadCurrent();
    bgmRef.current?.play().catch(() => undefined);
  };

  const startBgm = useCallback(() => {
    if (!bgmRef.current) {
      const audio = new Audio();
      audio.preload = "auto";
      audio.addEventListener("ended", () => playNextRef.current());
      bgmRef.current = audio;
      loadCurrent();
    }
    applyVolume();
    bgmRef.current.play().catch(() => undefined);
  }, [applyVolume, loadCurrent]);

  useEffect(() => {
    mutedRef.current = false;
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    startBgm();
    const onVisible = () => {
      if (document.visibilityState === "visible") startBgm();
    };
    const onFirstGesture = () => startBgm();
    window.addEventListener("visibilitychange", onVisible);
    window.addEventListener("pointerdown", onFirstGesture, { once: true });
    window.addEventListener("touchstart", onFirstGesture, { once: true, passive: true });
    window.addEventListener("keydown", onFirstGesture, { once: true });
    return () => {
      window.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("pointerdown", onFirstGesture);
      window.removeEventListener("touchstart", onFirstGesture);
      window.removeEventListener("keydown", onFirstGesture);
      if (bgmRef.current) {
        bgmRef.current.pause();
        bgmRef.current = null;
      }
    };
  }, [ready, startBgm]);

  return (
    <BgmContext.Provider value={{ muted, setMuted }}>
      {children}
      {ready ? <BgmMuteButton /> : null}
    </BgmContext.Provider>
  );
}
