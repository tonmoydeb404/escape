import { useState } from 'react';
import { RefreshCw, X } from 'lucide-react';
import clsx from 'clsx';
import { usePWAUpdate } from '../utils/pwa';

export function PWAUpdateNotification() {
  const { updateAvailable, updateApp } = usePWAUpdate();
  const [dismissed, setDismissed] = useState(false);

  if (!updateAvailable || dismissed) {
    return null;
  }

  const handleUpdate = () => {
    updateApp();
  };

  const handleDismiss = () => {
    setDismissed(true);
  };

  return (
    <div className="fixed top-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-sm">
      <div className={clsx(
        "bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-4 shadow-xl",
        "border border-white/10 backdrop-blur-sm",
        "animate-slide-up"
      )}>
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 p-2 bg-white/20 rounded-xl">
            <RefreshCw size={20} className="text-white" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-semibold text-sm">
              Update Available
            </h3>
            <p className="text-green-100 text-xs mt-1 leading-relaxed">
              A new version of Escape is ready. Restart to get the latest features and improvements.
            </p>
            
            <div className="flex space-x-2 mt-3">
              <button
                onClick={handleUpdate}
                className={clsx(
                  "px-3 py-1.5 bg-white text-green-600 rounded-lg text-xs font-semibold",
                  "hover:bg-green-50 transition-colors duration-200",
                  "focus:outline-none focus:ring-2 focus:ring-white/50"
                )}
              >
                Update Now
              </button>
              <button
                onClick={handleDismiss}
                className={clsx(
                  "px-3 py-1.5 bg-white/20 text-white rounded-lg text-xs font-medium",
                  "hover:bg-white/30 transition-colors duration-200",
                  "focus:outline-none focus:ring-2 focus:ring-white/50"
                )}
              >
                Later
              </button>
            </div>
          </div>
          
          <button
            onClick={handleDismiss}
            className={clsx(
              "flex-shrink-0 p-1 rounded-full hover:bg-white/20 transition-colors",
              "focus:outline-none focus:ring-2 focus:ring-white/50"
            )}
          >
            <X size={16} className="text-white/70" />
          </button>
        </div>
      </div>
    </div>
  );
}