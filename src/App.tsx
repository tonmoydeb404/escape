import clsx from "clsx";
import { Timer, Waves } from "lucide-react";
import { useEffect } from "react";
import { SoundCard } from "./components/SoundCard";
import { TimerBottomSheet } from "./components/TimerBottomSheet";
import { TimerDisplay } from "./components/TimerDisplay";
import { AppProvider, useApp } from "./context/AppContext";
import { useAudio } from "./hooks/useAudio";
import { useLocalStorage } from "./hooks/useLocalStorage";

function AppContent() {
  const { state, dispatch } = useApp();
  const { getItem, setItem } = useLocalStorage();

  useAudio();

  // Load saved preferences
  useEffect(() => {
    const savedSounds = getItem("soundPreferences");
    // const lastTimer = getItem("lastTimerDuration", 30);

    if (savedSounds) {
      // Could implement loading saved sound states here
    }
  }, []);

  // Save sound preferences
  useEffect(() => {
    const soundPreferences = state.sounds.map(({ id, volume, isPlaying }) => ({
      id,
      volume,
      isPlaying,
    }));
    setItem("soundPreferences", soundPreferences);
  }, [state.sounds, setItem]);

  const handleTimerClick = () => {
    dispatch({ type: "TOGGLE_TIMER_BOTTOM_SHEET" });
  };

  const activeSoundsCount = state.sounds.filter((s) => s.isPlaying).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900/20 to-gray-900">
      {/* Background effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-500/5 to-teal-500/5" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent" />

      <div className="relative z-10 p-4 pb-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-16 max-w-4xl mx-auto pt-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500/20 to-teal-500/20 backdrop-blur-sm border border-white/10">
              <Waves size={24} className="text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Nature Sounds</h1>
              <p className="text-sm text-gray-400">
                {activeSoundsCount > 0
                  ? `${activeSoundsCount} sound${
                      activeSoundsCount === 1 ? "" : "s"
                    } playing`
                  : "Tap sounds to start mixing"}
              </p>
            </div>
          </div>

          <button
            onClick={handleTimerClick}
            className={clsx(
              "p-3 rounded-2xl transition-all duration-200 transform",
              "active:scale-90 hover:scale-105",
              "backdrop-blur-sm border border-white/10",
              "bg-gradient-to-br from-purple-500/20 to-pink-500/20",
              "hover:from-purple-500/30 hover:to-pink-500/30"
            )}
            style={{ minWidth: "48px", minHeight: "48px" }}
          >
            <Timer size={24} className="text-purple-400" />
          </button>
        </div>

        {/* Sound Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {state.sounds.map((sound) => (
            <SoundCard
              key={sound.id}
              soundId={sound.id}
              name={sound.name}
              isPlaying={sound.isPlaying}
              volume={sound.volume}
            />
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500 text-sm">
          <p>Mix different sounds to create your perfect ambient atmosphere</p>
          <p className="mt-1">Use headphones for the best experience</p>
        </div>
      </div>

      {/* Overlays */}
      <TimerDisplay />
      <TimerBottomSheet />
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
