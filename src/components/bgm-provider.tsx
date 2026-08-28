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
import { Slider } from "@/components/ui/slider";

import track01 from "@/assets/bgm/01.mp3?url";
import track02 from "@/assets/bgm/02.mp3?url";
import track03 from "@/assets/bgm/03.mp3?url";

const BGM_TRACKS = [track01, track02, track03] as const;

const STORAGE_KEY = "myrunner-bgm-volume";
const DEFAULT_VOLUME = 0.01;

function shuffleTracks(tracks: readonly string[]): string[] {
  const next = [...tracks];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

function readStoredVolume(): number {
  if (typeof window === "undefined") return DEFAULT_VOLUME;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw == null) return DEFAULT_VOLUME;
  const n = Number.parseFloat(raw);
  if (!Number.isFinite(n)) return DEFAULT_VOLUME;
  return Math.min(1, Math.max(0, n));
}

type BgmContextValue = {
  volume: number;
  setVolume: (value: number) => void;
  muted: boolean;
  setMuted: (value: boolean) => void;
};

const BgmContext = createContext<BgmContextValue | null>(null);

export function useBgmVolume() {
  const ctx = useContext(BgmContext);
  if (!ctx) throw new Error("useBgmVolume must be used within BgmProvider");
  return ctx;
}

function BgmVolumeControl() {
  const { volume, setVolume, muted, setMuted } = useBgmVolume();
  const displayPct = Math.round((muted ? 0 : volume) * 100);

  return (
    <div
      className="fixed bottom-4 right-4 z-[60] flex w-[min(calc(100vw-2rem),14rem)] items-center gap-2 rounded-lg border border-gold/40 bg-background/95 px-3 py-2 shadow-lg backdrop-blur-md"
      aria-label="Background music volume"
    >
      <button
        type="button"
        onClick={() => setMuted(!muted)}
        className="shrink-0 rounded-md p-1 text-gold hover:bg-gold/10"
        aria-label={muted ? "Unmute background music" : "Mute background music"}
      >
        {muted || volume === 0 ? (
          <VolumeX className="h-4 w-4" />
        ) : (
          <Volume2 className="h-4 w-4" />
        )}
      </button>
      <Slider
        min={0}
        max={100}
        step={1}
        value={[displayPct]}
        onValueChange={([next]) => {
          if (next === undefined) return;
          if (muted && next > 0) setMuted(false);
          setVolume(next / 100);
        }}
        className="flex-1"
        aria-label="Music volume"
      />
      <span className="w-8 shrink-0 text-right text-[10px] font-bold tabular-nums text-muted-foreground">
        {displayPct}%
      </span>
    </div>
  );
}

export function BgmProvider({ children }: { children: ReactNode }) {
  const bgmRef = useRef<HTMLAudioElement | null>(null);
  const queueRef = useRef<string[]>([]);
  const indexRef = useRef(0);
  const playNextRef = useRef<() => void>(() => undefined);
  const volumeRef = useRef(DEFAULT_VOLUME);
  const mutedRef = useRef(false);

  const [volume, setVolumeState] = useState(DEFAULT_VOLUME);
  const [muted, setMutedState] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  const applyVolume = useCallback(() => {
    if (bgmRef.current) {
      bgmRef.current.volume = mutedRef.current ? 0 : volumeRef.current;
    }
  }, []);

  const setVolume = useCallback(
    (value: number) => {
      const clamped = Math.min(1, Math.max(0, value));
      volumeRef.current = clamped;
      setVolumeState(clamped);
      localStorage.setItem(STORAGE_KEY, String(clamped));
      applyVolume();
    },
    [applyVolume],
  );

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
    const stored = readStoredVolume();
    volumeRef.current = stored;
    setVolumeState(stored);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
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
  }, [hydrated, startBgm]);

  return (
    <BgmContext.Provider value={{ volume, setVolume, muted, setMuted }}>
      {children}
      {hydrated ? <BgmVolumeControl /> : null}
    </BgmContext.Provider>
  );
}
