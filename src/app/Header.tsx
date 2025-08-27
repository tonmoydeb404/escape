import clsx from "clsx";
import { Timer, Waves } from "lucide-react";
import { useApp } from "../context/AppContext";

interface HeaderProps {
  onTimerClick: () => void;
}

export function Header({ onTimerClick }: HeaderProps) {
  const { state } = useApp();
  
  const activeSoundsCount = state.sounds.filter((s) => s.isPlaying).length;

  return (
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
        onClick={onTimerClick}
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
  );
}