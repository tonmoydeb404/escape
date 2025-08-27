import { SoundCard } from "../components/SoundCard";
import { useApp } from "../context/AppContext";

export function SoundGrid() {
  const { sounds } = useApp();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl mx-auto">
      {sounds.map((sound) => (
        <SoundCard
          key={sound.id}
          soundId={sound.id}
          name={sound.name}
          isPlaying={sound.isPlaying}
          volume={sound.volume}
          isLoaded={sound.isLoaded}
          isLoading={sound.isLoading}
        />
      ))}
    </div>
  );
}
