import clsx from "clsx";
import { Pause, Play, Volume2, VolumeX } from "lucide-react";
import { useApp } from "../context/AppContext";
import { VolumeSlider } from "./VolumeSlider";

interface SoundCardProps {
  soundId: string;
  name: string;
  isPlaying: boolean;
  volume: number;
}

export function SoundCard({
  soundId,
  name,
  isPlaying,
  volume,
}: SoundCardProps) {
  const { dispatch } = useApp();

  const handleToggleSound = () => {
    dispatch({ type: "TOGGLE_SOUND", soundId });
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
        {/* Header with play button and title */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold text-lg">{name}</h3>
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
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>
        </div>

        {/* Volume controls */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => handleVolumeChange(volume > 0 ? 0 : 0.7)}
            className="p-2 rounded-lg transition-colors duration-200 hover:bg-white/10"
            style={{ minWidth: "40px", minHeight: "40px" }}
          >
            {volume > 0 ? (
              <Volume2 size={16} className="text-gray-300" />
            ) : (
              <VolumeX size={16} className="text-gray-500" />
            )}
          </button>

          <VolumeSlider
            value={volume}
            onChange={handleVolumeChange}
            disabled={!isPlaying}
          />

          <span className="text-xs text-gray-400 min-w-8 text-center">
            {Math.round(volume * 100)}%
          </span>
        </div>
      </div>
    </div>
  );
}
