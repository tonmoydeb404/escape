import { SoundCard } from "../components/SoundCard";
import { useApp } from "../context/AppContext";

export function SoundGrid() {
  const { state } = useApp();

  return (
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
  );
}
