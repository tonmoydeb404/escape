import { useEffect } from "react";
import { useApp } from "../context/AppContext";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useURLPresets } from "../hooks/useURLPresets";
import { PWAInstaller } from "../components/PWAInstaller";
import { PWAUpdateNotification } from "../components/PWAUpdateNotification";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { SoundGrid } from "./SoundGrid";

function App() {
  const { sounds } = useApp();
  const { getItem, setItem } = useLocalStorage();
  
  // Handle URL-based presets for PWA shortcuts
  useURLPresets();

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
    const soundPreferences = sounds.map(({ id, volume, isPlaying }) => ({
      id,
      volume,
      isPlaying,
    }));
    setItem("soundPreferences", soundPreferences);
  }, [sounds, setItem]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900/20 to-gray-900">
      {/* Background effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-500/5 to-teal-500/5" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent" />

      <div className="relative z-10 p-4 pb-8">
        <Header />
        <SoundGrid />
        <Footer />
      </div>
      
      {/* PWA Components */}
      <PWAInstaller />
      <PWAUpdateNotification />
    </div>
  );
}

export default App;
