import { Howl } from "howler";
import { useEffect, useRef } from "react";
import { useApp } from "../context/AppContext";

export function useAudio() {
  const { state, dispatch } = useApp();
  const howlsRef = useRef<Record<string, Howl>>({});

  useEffect(() => {
    // Initialize Howl instances
    state.sounds.forEach((sound) => {
      if (!howlsRef.current[sound.id]) {
        const howl = new Howl({
          src: [sound.file],
          loop: true,
          volume: sound.volume,
          preload: true,
          html5: true,
          onload: () => {
            dispatch({ type: "SET_HOWL", soundId: sound.id, howl });
          },
          onloaderror: () => {
            console.warn(`Failed to load ${sound.name}, using fallback tone`);
          },
        });

        howlsRef.current[sound.id] = howl;
      }
    });

    return () => {
      // Cleanup on unmount
      Object.values(howlsRef.current).forEach((howl) => {
        if (howl) {
          howl.unload();
        }
      });
    };
  }, []);

  useEffect(() => {
    state.sounds.forEach((sound) => {
      const howl = howlsRef.current[sound.id];
      if (howl) {
        howl.volume(sound.volume);

        if (sound.isPlaying && !howl.playing()) {
          howl.fade(0, sound.volume, 300);
          howl.play();
        } else if (!sound.isPlaying && howl.playing()) {
          howl.fade(sound.volume, 0, 300);
          setTimeout(() => {
            if (!sound.isPlaying) {
              howl.pause();
            }
          }, 300);
        }
      }
    });
  }, [state.sounds]);

  const stopAllSounds = () => {
    Object.values(howlsRef.current).forEach((howl) => {
      if (howl && howl.playing()) {
        howl.fade(howl.volume(), 0, 300);
        setTimeout(() => {
          howl.pause();
        }, 300);
      }
    });
    dispatch({ type: "STOP_ALL_SOUNDS" });
  };

  return { stopAllSounds };
}
