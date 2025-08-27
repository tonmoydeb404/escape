import { Howl } from "howler";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import soundsData from "../data.json";
import { mediaSessionManager } from "../utils/mediaSession";

interface SoundState {
  id: string;
  name: string;
  file: string;
  isPlaying: boolean;
  volume: number;
  isLoaded: boolean;
  isLoading: boolean;
  howl?: any;
}

interface TimerState {
  duration: number;
  remaining: number;
  isActive: boolean;
  isVisible: boolean;
}

interface AppState {
  sounds: SoundState[];
  timer: TimerState;
  isTimerBottomSheetOpen: boolean;
}

const initialState: AppState = {
  sounds: soundsData.sounds.map((sound) => ({
    ...sound,
    isPlaying: false,
    volume: 0.7,
    isLoaded: false,
    isLoading: false,
  })),
  timer: {
    duration: 0,
    remaining: 0,
    isActive: false,
    isVisible: false,
  },
  isTimerBottomSheetOpen: false,
};

interface AppContextType {
  sounds: SoundState[];
  timerDuration: number;
  timerRemaining: number;
  isTimerActive: boolean;
  isTimerVisible: boolean;
  isTimerBottomSheetOpen: boolean;
  toggleSound: (soundId: string) => void;
  setVolume: (soundId: string, volume: number) => void;
  setHowl: (soundId: string, howl: any) => void;
  startLoadingSound: (soundId: string) => void;
  soundLoaded: (soundId: string, howl: any) => void;
  soundLoadError: (soundId: string) => void;
  startTimer: (minutes: number) => void;
  tickTimer: () => void;
  stopTimer: () => void;
  toggleTimerBottomSheet: () => void;
  stopAllSounds: () => void;
  loadFromStorage: (state: Partial<AppState>) => void;
  loadSound: (soundId: string) => void;
  formatTime: (seconds: number) => string;
  getProgress: () => number;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [sounds, setSounds] = useState<SoundState[]>(initialState.sounds);
  const [timerDuration, setTimerDuration] = useState<number>(
    initialState.timer.duration
  );
  const [timerRemaining, setTimerRemaining] = useState<number>(
    initialState.timer.remaining
  );
  const [isTimerActive, setIsTimerActive] = useState<boolean>(
    initialState.timer.isActive
  );
  const [isTimerVisible, setIsTimerVisible] = useState<boolean>(
    initialState.timer.isVisible
  );
  const [isTimerBottomSheetOpen, setIsTimerBottomSheetOpen] = useState<boolean>(
    initialState.isTimerBottomSheetOpen
  );

  // Refs for audio and timer
  const howlsRef = useRef<Record<string, Howl>>({});
  const intervalRef = useRef<number>();

  const toggleSound = (soundId: string) => {
    setSounds((prevSounds) =>
      prevSounds.map((sound) =>
        sound.id === soundId ? { ...sound, isPlaying: !sound.isPlaying } : sound
      )
    );
  };

  const setVolume = (soundId: string, volume: number) => {
    setSounds((prevSounds) =>
      prevSounds.map((sound) =>
        sound.id === soundId ? { ...sound, volume } : sound
      )
    );
  };

  const setHowl = (soundId: string, howl: any) => {
    setSounds((prevSounds) =>
      prevSounds.map((sound) =>
        sound.id === soundId ? { ...sound, howl } : sound
      )
    );
  };

  const startLoadingSound = (soundId: string) => {
    setSounds((prevSounds) =>
      prevSounds.map((sound) =>
        sound.id === soundId
          ? { ...sound, isLoading: true, isLoaded: false }
          : sound
      )
    );
  };

  const soundLoaded = (soundId: string, howl: any) => {
    setSounds((prevSounds) =>
      prevSounds.map((sound) =>
        sound.id === soundId
          ? { ...sound, isLoading: false, isLoaded: true, howl }
          : sound
      )
    );
  };

  const soundLoadError = (soundId: string) => {
    setSounds((prevSounds) =>
      prevSounds.map((sound) =>
        sound.id === soundId
          ? { ...sound, isLoading: false, isLoaded: false, howl: null }
          : sound
      )
    );
  };

  const tickTimer = () => {
    setTimerRemaining((prevRemaining) => {
      if (prevRemaining <= 1) {
        setTimerRemaining(0);
        setIsTimerActive(false);
        stopAllSounds();
        return 0;
      }
      return prevRemaining - 1;
    });
  };

  const stopTimer = () => {
    setIsTimerActive(false);
    setTimerRemaining(0);
    setIsTimerVisible(false);
  };

  const toggleTimerBottomSheet = () => {
    setIsTimerBottomSheetOpen((prev) => !prev);
  };

  const stopAllSounds = () => {
    // Stop all Howl instances
    Object.values(howlsRef.current).forEach((howl) => {
      if (howl && howl.playing()) {
        howl.fade(howl.volume(), 0, 300);
        setTimeout(() => {
          howl.pause();
        }, 300);
      }
    });

    setSounds((prevSounds) =>
      prevSounds.map((sound) => ({ ...sound, isPlaying: false }))
    );
  };

  const loadFromStorage = (newState: Partial<AppState>) => {
    if (newState.sounds) {
      setSounds(newState.sounds);
    }
    if (newState.timer) {
      setTimerDuration(newState.timer.duration);
      setTimerRemaining(newState.timer.remaining);
      setIsTimerActive(newState.timer.isActive);
      setIsTimerVisible(newState.timer.isVisible);
    }
    if (newState.isTimerBottomSheetOpen !== undefined) {
      setIsTimerBottomSheetOpen(newState.isTimerBottomSheetOpen);
    }
  };

  // Audio functions
  const loadSound = useCallback(
    async (soundId: string) => {
      const sound = sounds.find((s) => s.id === soundId);
      if (!sound || sound.isLoading || sound.isLoaded) return;

      startLoadingSound(soundId);

      try {
        // Check if audio is already cached by service worker
        const cache = await caches.open('audio-cache');
        const cachedResponse = await cache.match(sound.file);
        
        if (!cachedResponse) {
          // If not cached, manually cache it first
          await cache.add(sound.file);
          console.log(`Cached audio: ${sound.name}`);
        } else {
          console.log(`Audio already cached: ${sound.name}`);
        }

        // Create Howl instance (will use cached version if available)
        const howl = new Howl({
          src: [sound.file],
          loop: true,
          volume: sound.volume,
          preload: true,
          html5: true,
          onload: () => {
            soundLoaded(soundId, howl);
            howlsRef.current[soundId] = howl;

            // Save to localStorage
            const loadedSounds = JSON.parse(
              localStorage.getItem("loadedSounds") || "[]"
            );
            if (!loadedSounds.includes(soundId)) {
              loadedSounds.push(soundId);
              localStorage.setItem("loadedSounds", JSON.stringify(loadedSounds));
            }
          },
          onloaderror: (_, error) => {
            console.error(`Failed to load ${sound.name}:`, error);
            soundLoadError(soundId);
          },
        });
      } catch (error) {
        console.error(`Failed to cache/load ${sound.name}:`, error);
        soundLoadError(soundId);
      }
    },
    [sounds]
  );

  // Timer helper functions
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const getProgress = (): number => {
    if (timerDuration === 0) return 0;
    return ((timerDuration - timerRemaining) / timerDuration) * 100;
  };

  // Update startTimer to accept minutes instead of seconds
  const startTimer = (minutes: number) => {
    const duration = minutes * 60;
    setTimerDuration(duration);
    setTimerRemaining(duration);
    setIsTimerActive(true);
    setIsTimerVisible(true);
    setIsTimerBottomSheetOpen(false);

    // Save to localStorage
    localStorage.setItem("lastTimerDuration", minutes.toString());
  };

  // Timer effect
  useEffect(() => {
    if (isTimerActive && timerRemaining > 0) {
      intervalRef.current = setInterval(() => {
        tickTimer();
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTimerActive, timerRemaining]);

  // Audio effect - manage playing/stopping sounds
  useEffect(() => {
    sounds.forEach((sound) => {
      const howl = howlsRef.current[sound.id];
      if (howl && sound.isLoaded) {
        howl.volume(sound.volume);

        if (sound.isPlaying && !howl.playing()) {
          howl.fade(0, sound.volume, 300);
          howl.play();
        } else if (!sound.isPlaying && howl.playing()) {
          howl.fade(sound.volume, 0, 300);
          setTimeout(() => {
            // Double check the state hasn't changed during fade
            const currentSound = sounds.find((s) => s.id === sound.id);
            if (currentSound && !currentSound.isPlaying) {
              howl.pause();
            }
          }, 300);
        }
      }
    });
  }, [sounds]);

  // Auto-load sounds that were previously loaded
  useEffect(() => {
    const loadedSounds = JSON.parse(
      localStorage.getItem("loadedSounds") || "[]"
    );

    sounds.forEach((sound) => {
      if (
        loadedSounds.includes(sound.id) &&
        !sound.isLoaded &&
        !sound.isLoading
      ) {
        loadSound(sound.id);
      }
    });
  }, [sounds, loadSound]);

  // Media Session API integration
  useEffect(() => {
    const playingSounds = sounds
      .filter((sound) => sound.isPlaying)
      .map((sound) => sound.name);
    mediaSessionManager.setPlaying(playingSounds);

    // Set up media session action handlers
    mediaSessionManager.setActionHandlers(
      undefined, // play - handled by individual sound toggles
      () => stopAllSounds(), // pause - stop all sounds
      () => stopAllSounds() // stop - stop all sounds
    );
  }, [sounds]);

  const contextValue: AppContextType = {
    sounds,
    timerDuration,
    timerRemaining,
    isTimerActive,
    isTimerVisible,
    isTimerBottomSheetOpen,
    toggleSound,
    setVolume,
    setHowl,
    startLoadingSound,
    soundLoaded,
    soundLoadError,
    startTimer,
    tickTimer,
    stopTimer,
    toggleTimerBottomSheet,
    stopAllSounds,
    loadFromStorage,
    loadSound,
    formatTime,
    getProgress,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
}
