import { Howl } from "howler";
import { useCallback, useEffect, useRef } from "react";
import { useApp } from "../context/AppContext";

export function useAudio() {
  const { state, dispatch } = useApp();
  const howlsRef = useRef<Record<string, Howl>>({});

  const loadSound = useCallback((soundId: string) => {
    const sound = state.sounds.find(s => s.id === soundId);
    if (!sound || sound.isLoading || sound.isLoaded) return;

    dispatch({ type: 'START_LOADING_SOUND', soundId });

    const howl = new Howl({
      src: [sound.file],
      loop: true,
      volume: sound.volume,
      preload: true,
      html5: true,
      onload: () => {
        dispatch({ type: 'SOUND_LOADED', soundId, howl });
        howlsRef.current[soundId] = howl;
        
        // Save to localStorage
        const loadedSounds = JSON.parse(localStorage.getItem('loadedSounds') || '[]');
        if (!loadedSounds.includes(soundId)) {
          loadedSounds.push(soundId);
          localStorage.setItem('loadedSounds', JSON.stringify(loadedSounds));
        }
      },
      onloaderror: (id, error) => {
        console.error(`Failed to load ${sound.name}:`, error);
        dispatch({ type: 'SOUND_LOAD_ERROR', soundId });
      }
    });
  }, [state.sounds, dispatch]);

  // Auto-load sounds that were previously loaded (from localStorage)
  useEffect(() => {
    const loadedSounds = JSON.parse(localStorage.getItem('loadedSounds') || '[]');
    
    state.sounds.forEach(sound => {
      if (loadedSounds.includes(sound.id) && !sound.isLoaded && !sound.isLoading) {
        loadSound(sound.id);
      }
    });
  }, [state.sounds, loadSound]);

  useEffect(() => {
    state.sounds.forEach((sound) => {
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
            const currentSound = state.sounds.find(s => s.id === sound.id);
            if (currentSound && !currentSound.isPlaying) {
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

  return { stopAllSounds, loadSound };
}
