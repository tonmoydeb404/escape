import { useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { useLocalStorage } from './useLocalStorage';

export function useTimer() {
  const { state, dispatch } = useApp();
  const intervalRef = useRef<NodeJS.Timeout>();
  const { setItem } = useLocalStorage();

  useEffect(() => {
    if (state.timer.isActive && state.timer.remaining > 0) {
      intervalRef.current = setInterval(() => {
        dispatch({ type: 'TICK_TIMER' });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Timer finished
    if (state.timer.isActive && state.timer.remaining === 0) {
      dispatch({ type: 'STOP_ALL_SOUNDS' });
      dispatch({ type: 'STOP_TIMER' });
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [state.timer.isActive, state.timer.remaining, dispatch]);

  const startTimer = (minutes: number) => {
    const duration = minutes * 60;
    dispatch({ type: 'START_TIMER', duration });
    setItem('lastTimerDuration', minutes);
  };

  const stopTimer = () => {
    dispatch({ type: 'STOP_TIMER' });
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = (): number => {
    if (state.timer.duration === 0) return 0;
    return ((state.timer.duration - state.timer.remaining) / state.timer.duration) * 100;
  };

  return {
    startTimer,
    stopTimer,
    formatTime,
    getProgress,
  };
}