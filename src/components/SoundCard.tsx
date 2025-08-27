import clsx from "clsx";
import { Download, Loader, Pause, Play, Volume2, VolumeX } from "lucide-react";
import { useApp } from "../context/AppContext";
import { useAudio } from "../hooks/useAudio";
import { VolumeSlider } from "./VolumeSlider";

interface SoundCardProps {
  soundId: string;
  name: string;
  isPlaying: boolean;
  volume: number;
  isLoaded: boolean;
  isLoading: boolean;
}

export function SoundCard({
  soundId,
  name,
  isPlaying,
  volume,
  isLoaded,
  isLoading,
}: SoundCardProps) {
  const { dispatch } = useApp();
  const { loadSound } = useAudio();

  const handleToggleSound = () => {
    if (!isLoaded) return; // Only allow playing if sound is loaded
    dispatch({ type: "TOGGLE_SOUND", soundId });
  };

  const handleLoadSound = () => {
    if (!isLoading && !isLoaded) {
      loadSound(soundId);
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    dispatch({ type: "SET_VOLUME", soundId, volume: newVolume });
  };

  return (
    <div
      className={clsx(
        "relative overflow-hidden rounded-2xl p-6 transition-all duration-300 transform",
        "backdrop-blur-sm border border-white/10",
        "active:scale-95",
        isPlaying
          ? "bg-gradient-to-br from-blue-500/20 to-teal-500/20 shadow-lg shadow-blue-500/25"
          : "bg-gradient-to-br from-gray-800/40 to-gray-900/40 hover:from-gray-800/50 hover:to-gray-900/50"
      )}
    >
      {/* Background glow effect */}
      {isPlaying && (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-teal-400/10 animate-pulse" />
      )}

      <div className="relative z-10">
        {/* Header with load/play button and title */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold text-lg">{name}</h3>
          
          {!isLoaded ? (
            // Load button when sound is not loaded
            <button
              onClick={handleLoadSound}
              disabled={isLoading}
              className={clsx(
                "p-3 rounded-full transition-all duration-200 transform",
                "backdrop-blur-sm border border-white/20",
                isLoading
                  ? "bg-yellow-500/20 text-yellow-400 cursor-wait"
                  : "bg-gray-600/30 text-gray-300 hover:bg-gray-600/50 hover:text-white active:scale-90 hover:scale-110"
              )}
              style={{ minWidth: "48px", minHeight: "48px" }}
              aria-label={isLoading ? "Loading sound..." : "Load sound"}
            >
              {isLoading ? (
                <Loader size={20} className="animate-spin" />
              ) : (
                <Download size={20} />
              )}
            </button>
          ) : (
            // Play/pause button when sound is loaded
            <button
              onClick={handleToggleSound}
              className={clsx(
                "p-3 rounded-full transition-all duration-200 transform",
                "active:scale-90 hover:scale-110",
                "backdrop-blur-sm border border-white/20",
                isPlaying
                  ? "bg-blue-500/30 text-blue-200 hover:bg-blue-500/40"
                  : "bg-white/10 text-gray-300 hover:bg-white/20"
              )}
              style={{ minWidth: "48px", minHeight: "48px" }}
              aria-label={isPlaying ? "Pause sound" : "Play sound"}
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>
          )}
        </div>

        {/* Volume controls - always show but disabled until loaded */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => handleVolumeChange(volume > 0 ? 0 : 0.7)}
            disabled={!isLoaded}
            className={clsx(
              "p-2 rounded-lg transition-colors duration-200",
              isLoaded 
                ? "hover:bg-white/10" 
                : "opacity-50 cursor-not-allowed"
            )}
            style={{ minWidth: "40px", minHeight: "40px" }}
          >
            {volume > 0 ? (
              <Volume2 size={16} className={isLoaded ? "text-gray-300" : "text-gray-500"} />
            ) : (
              <VolumeX size={16} className={isLoaded ? "text-gray-500" : "text-gray-600"} />
            )}
          </button>

          <VolumeSlider
            value={volume}
            onChange={handleVolumeChange}
            disabled={!isLoaded || !isPlaying}
            ariaLabel={`Volume for ${name}`}
          />

          <span className={clsx(
            "text-xs min-w-8 text-center",
            isLoaded ? "text-gray-400" : "text-gray-500"
          )}>
            {Math.round(volume * 100)}%
          </span>
        </div>

        {/* Loading state message */}
        {isLoading && (
          <div className="text-center py-2">
            <p className="text-yellow-400 text-sm">Loading sound...</p>
          </div>
        )}
      </div>
    </div>
  );
}
