import { TimerBottomSheet } from "../components/TimerBottomSheet";
import { useApp } from "../context/AppContext";
import { APP_CONFIG } from "../config/app";

interface HeaderProps {}

export function Header(_props: HeaderProps) {
  const { sounds } = useApp();

  const activeSoundsCount = sounds.filter((s) => s.isPlaying).length;

  return (
    <div className="flex items-center justify-between mb-16 max-w-4xl mx-auto pt-4">
      <div className="flex items-center space-x-3">
        <img alt={APP_CONFIG.shortName} src="/icons/logo.svg" width={45} />
        <div>
          <h1 className="text-2xl font-bold text-white">{APP_CONFIG.shortName}</h1>
          <p className="text-sm text-gray-400">
            {activeSoundsCount > 0
              ? `${activeSoundsCount} sound${
                  activeSoundsCount === 1 ? "" : "s"
                } playing`
              : "Tap sounds to start mixing"}
          </p>
        </div>
      </div>

      <TimerBottomSheet />
    </div>
  );
}
