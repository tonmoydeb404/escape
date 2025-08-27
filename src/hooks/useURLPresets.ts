import { useEffect } from 'react';
import { useApp } from '../context/AppContext';

/**
 * Hook to handle URL-based presets for PWA shortcuts
 * Supports:
 * - /?timer=25 - starts a 25-minute timer
 * - /?preset=rain - activates rain sounds
 */
export function useURLPresets() {
  const { startTimer, toggleSound, sounds } = useApp();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const timerParam = urlParams.get('timer');
    const presetParam = urlParams.get('preset');

    // Handle timer shortcut
    if (timerParam) {
      const minutes = parseInt(timerParam, 10);
      if (!isNaN(minutes) && minutes > 0 && minutes <= 999) {
        // Start timer after a small delay to ensure app is ready
        setTimeout(() => {
          startTimer(minutes);
        }, 1000);
      }
    }

    // Handle preset shortcuts
    if (presetParam) {
      setTimeout(() => {
        switch (presetParam.toLowerCase()) {
          case 'rain':
            const rainSound = sounds.find(s => s.name.toLowerCase().includes('rain'));
            if (rainSound && !rainSound.isPlaying) {
              toggleSound(rainSound.id);
            }
            break;
          case 'forest':
            const forestSound = sounds.find(s => s.name.toLowerCase().includes('forest'));
            if (forestSound && !forestSound.isPlaying) {
              toggleSound(forestSound.id);
            }
            break;
          case 'ocean':
            const oceanSound = sounds.find(s => s.name.toLowerCase().includes('ocean'));
            if (oceanSound && !oceanSound.isPlaying) {
              toggleSound(oceanSound.id);
            }
            break;
          case 'fire':
            const fireSound = sounds.find(s => s.name.toLowerCase().includes('fire'));
            if (fireSound && !fireSound.isPlaying) {
              toggleSound(fireSound.id);
            }
            break;
          case 'thunder':
            const thunderSound = sounds.find(s => s.name.toLowerCase().includes('thunder'));
            if (thunderSound && !thunderSound.isPlaying) {
              toggleSound(thunderSound.id);
            }
            break;
          case 'wind':
            const windSound = sounds.find(s => s.name.toLowerCase().includes('wind'));
            if (windSound && !windSound.isPlaying) {
              toggleSound(windSound.id);
            }
            break;
        }
      }, 1500); // Longer delay to ensure sounds are loaded
    }

    // Clean up URL params after processing
    if (timerParam || presetParam) {
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    }
  }, [startTimer, toggleSound, sounds]);
}