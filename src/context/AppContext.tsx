import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import soundsData from '../data.json';

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

type AppAction =
  | { type: 'TOGGLE_SOUND'; soundId: string }
  | { type: 'SET_VOLUME'; soundId: string; volume: number }
  | { type: 'SET_HOWL'; soundId: string; howl: any }
  | { type: 'START_LOADING_SOUND'; soundId: string }
  | { type: 'SOUND_LOADED'; soundId: string; howl: any }
  | { type: 'SOUND_LOAD_ERROR'; soundId: string }
  | { type: 'START_TIMER'; duration: number }
  | { type: 'TICK_TIMER' }
  | { type: 'STOP_TIMER' }
  | { type: 'TOGGLE_TIMER_BOTTOM_SHEET' }
  | { type: 'STOP_ALL_SOUNDS' }
  | { type: 'LOAD_FROM_STORAGE'; state: Partial<AppState> };

const initialState: AppState = {
  sounds: soundsData.sounds.map(sound => ({
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

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'TOGGLE_SOUND':
      return {
        ...state,
        sounds: state.sounds.map(sound =>
          sound.id === action.soundId
            ? { ...sound, isPlaying: !sound.isPlaying }
            : sound
        ),
      };
    
    case 'SET_VOLUME':
      return {
        ...state,
        sounds: state.sounds.map(sound =>
          sound.id === action.soundId
            ? { ...sound, volume: action.volume }
            : sound
        ),
      };
    
    case 'SET_HOWL':
      return {
        ...state,
        sounds: state.sounds.map(sound =>
          sound.id === action.soundId
            ? { ...sound, howl: action.howl }
            : sound
        ),
      };

    case 'START_LOADING_SOUND':
      return {
        ...state,
        sounds: state.sounds.map(sound =>
          sound.id === action.soundId
            ? { ...sound, isLoading: true, isLoaded: false }
            : sound
        ),
      };

    case 'SOUND_LOADED':
      return {
        ...state,
        sounds: state.sounds.map(sound =>
          sound.id === action.soundId
            ? { ...sound, isLoading: false, isLoaded: true, howl: action.howl }
            : sound
        ),
      };

    case 'SOUND_LOAD_ERROR':
      return {
        ...state,
        sounds: state.sounds.map(sound =>
          sound.id === action.soundId
            ? { ...sound, isLoading: false, isLoaded: false, howl: null }
            : sound
        ),
      };
    
    case 'START_TIMER':
      return {
        ...state,
        timer: {
          duration: action.duration,
          remaining: action.duration,
          isActive: true,
          isVisible: true,
        },
        isTimerBottomSheetOpen: false,
      };
    
    case 'TICK_TIMER':
      if (state.timer.remaining <= 1) {
        return {
          ...state,
          timer: {
            ...state.timer,
            remaining: 0,
            isActive: false,
          },
        };
      }
      return {
        ...state,
        timer: {
          ...state.timer,
          remaining: state.timer.remaining - 1,
        },
      };
    
    case 'STOP_TIMER':
      return {
        ...state,
        timer: {
          ...state.timer,
          isActive: false,
          remaining: 0,
          isVisible: false,
        },
      };
    
    case 'TOGGLE_TIMER_BOTTOM_SHEET':
      return {
        ...state,
        isTimerBottomSheetOpen: !state.isTimerBottomSheetOpen,
      };
    
    case 'STOP_ALL_SOUNDS':
      return {
        ...state,
        sounds: state.sounds.map(sound => ({ ...sound, isPlaying: false })),
      };
    
    case 'LOAD_FROM_STORAGE':
      return {
        ...state,
        ...action.state,
      };
    
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}